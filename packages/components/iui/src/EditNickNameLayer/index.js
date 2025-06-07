import { toast } from '@xatom/antd/Notify'
import auth from '@xatom/auth'
import $t from '@xatom/intl'
import Layer from '@xatom/layers'
import actions from '@xatom/modular/src/actions'
import * as hooks from '@xatom/modular/src/hooks'
import { getHost } from '@xatom/utils/src/env'
import request from '@xatom/utils/src/http'
import Button from '../Button'
import Input from '../Input'
import './index.less'

const MID = 'editNickName'
const LID = 'editNickNameLayer'
export default () => {
  const { loading, values = {} } = hooks.useModel(MID)
  const nameChange = (value) => {
    // 正则校验匹配表情
    let reg = /([0-9|*|#]\uFE0F\u20E3)|([0-9|#]\u20E3)|([\u203C-\u3299]\uFE0F\u200D)|([\u203C-\u3299]\uFE0F)|([\u2122-\u2B55])|(\u303D)|([(\A9)|(\AE)]\u3030)|(\uA9)|(\uAE)|(\u3030)|([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF])|([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F])/g
    const newValue = value.replace(reg, "")
    actions.changeForm({ id: MID, values: { name: newValue } })
  }
  let userInfo = auth.getUser() || {}
  return (
    <div>
      <Layer id={LID} type="reactive" title={title} zIndex="1001" onClosed={onClosed}>
        <div className="editNickNameLayer mt40">
          <div className="fs12 lh-14 nick-name-label">{$t('Nickname')}</div>
          <div className="mt8">
            <Input
              className="nick-name-input"
              value={values.name}
              maxLength={25}
              onChange={(e) => nameChange(e.target.value)}
              disabled={userInfo?.nickNameModificationTimes === 0}
              suffix={<div className="center-v">
                {values?.name?.length > 0 && <i className="iui-icon iui-icon-clear fs14 nick-name-icon-clear cursor-pointer" onClick={() => nameChange('')}></i>}
                <span className="nick-name-split-line"></span>
                <span className="nick-name-length fs14">{values?.name?.length || 0}/25</span>
              </div>}
            />
          </div>
          <div className="fs12 nick-name-tip mt8">*{$t('Nickname can not be longer than 25 characters')}</div>
          <div className="fs12 nick-name-tip mt8">
            {userInfo?.nickNameModificationTimes > 0 ? $t('You can edit your nickname {0} more time(s) this month', { 0: userInfo?.nickNameModificationTimes }) : $t('You have reached the limit of {0} nickname changes this month', { 0: userInfo?.maxNickNamModificationTimes })}
          </div>
          <div className="d-flex center-v equal-cols mt40">
            <Button type='default' size="large" className="mr8" onClick={onClosed}>{$t('Cancel')}</Button>
            <Button type='primary' size="large" disabled={loading || !values?.name?.length || userInfo?.nickNameModificationTimes === 0} loading={loading} onClick={() => submit(values?.name)} >
              {$t('Confirm')}
            </Button>
          </div>
        </div>
      </Layer>
    </div>
  )
}
const title = <div className='nick-name-title fs16 lh-20 fw-bolder'>{$t('Edit Nickname')}</div>
const onClosed = () => {
  actions.changeForm({ id: MID, values: { name: '' } })
  actions.hideLayer({ id: LID })
}
const submit = (value) => {
  const url = getHost('config') + '/user/nick/name'
  const options = {
    method: 'post',
    requestType: 'jsonstring',
    responseType: 'jsonstring',
    body: {
      nickName: value
    }
  }
  request(url, options).then(res => {
    if (res && res.code === 200) {
      toast({ type: 'success', title: $t("Nickname change request submitted. We'll review it soon.") })
      auth.refreshUser()
      onClosed()
    } else {
      toast({ type: 'error', title: res.message })
    }
  })
}