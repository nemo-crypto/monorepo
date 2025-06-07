import { useState, useEffect } from 'react'
import $t from '@xatom/intl'
import actions from '@xatom/modular/src/actions'
import { accountTypes, showTransfer } from '@xatom/transfer'
import auth from '@xatom/auth'
import globalEv from '@xatom/utils/src/ev'
import { Dropdown, Select } from '@xatom/iui';
import * as hooks from '@xatom/modular/src/hooks'
import fms from '@xatom/modular/src/formatters'
import { CurrentCurrency } from '@xatom/brand/src/Currency'
import request from '@xatom/utils/src/http'
import storage from '@xatom/utils/src/storage'
import { Item, ItemGroup } from '../CommonItem';

export default function (props) {
  const { title, children = [] } = props

  // 浮窗控制
  const [visibleOverlay, setVisibleOverlay] = useState(false)
  const onVisibleChange = visible => {
    setVisibleOverlay(visible)
  }

  return <Dropdown
    visible={visibleOverlay}
    onVisibleChange={onVisibleChange}
    overlay={<DropdownOverlay children={children} onVisibleChange={onVisibleChange} />}
    placement="bottomRight">
    <div className="iui-navbar-assets">
      <div className="iui-navbar-assets-label">{title}</div>
      <i className="iui-navbar-assets-arrow iui-icon iui-icon-chevron-down"></i>
    </div>
  </Dropdown>
}

function DropdownOverlay(props) {
  let { onVisibleChange, children = [] } = props

  // 过滤充/提/转，在本组件里写死
  // TODO：后续otc改完后，可删除配置与本行代码
  children = children.slice(0, -1)

  // 切换脱敏
  const accountPreferences = storage.getItem('account.preferences') || {}
  const hisHideBalance = accountPreferences.hideBalance || false
  const [hideBalance, setHideBalance] = useState(hisHideBalance)
  // 脱敏/更新数据
  const updateEncryptionData = val => {
    setHideBalance(val)
  }
  // 脱敏/同步数据
  const syncEncryptionData = val => {
    globalEv.emit('onNavbarAssetsEncryption', val)
    storage.setItem('account.preferences', { ...accountPreferences, hideBalance: val })
  }
  const onChangeEncryption = (val) => {
    updateEncryptionData(!val)
    syncEncryptionData(!val)
  }

  // 账户总览
  const hisValuationAsset = storage.getItem('valuationAsset') || 'USDT'
  const [valuationAsset, setValuationAsset] = useState(hisValuationAsset)
  const overviewData = hooks.useModel('G_NAVBAR_ASSETS_OVERVIEW', 'data') || {}
  const rateData = hooks.useModel('G_NAVBAR_ASSETS_RATE', 'data') || {}
  const getTotalValue = val => {
    if (!hideBalance) return '******'
    return val ? fms.toSeprator(val) : '--'
  }

  // 账户总览估值
  const getTotalValueCurrency = val => {
    if (!hideBalance) return '******'
    if (typeof val === 'undefined' || !rateData.n) return '--'
    const ret = valuationAsset === 'BTC' ? fms.toDown(val * rateData.n, 8) : val
    return <CurrentCurrency precision={4} prefix="≈" usdt={ret} />
  }

  // 切换单位/更新数据
  const updateUnitData = val => {
    // 清空原数据
    actions.changeForm({ id: 'G_NAVBAR_ASSETS_OVERVIEW', data: null })
    actions.changeForm({ id: 'G_NAVBAR_ASSETS_RATE', data: null })
    // 重新获取最新数据
    fetchAssetsOverview(val)
    fetchAssetsRate()
    // 更新选择的单位
    setValuationAsset(val)
  }
  // 切换单位/同步数据
  const syncUnitData = val => {
    globalEv.emit('onNavbarAssetsUnit', val)
    storage.setItem('valuationAsset', val)
  }
  // 切换单位
  const onChangeSelectUnit = val => {
    updateUnitData(val)
    syncUnitData(val)
  }

  // 初始化数据
  useEffect(() => {
    fetchAssetsOverview(valuationAsset)
    fetchAssetsRate()
  }, [])

  // 同步资产设置
  useEffect(() => {
    // 脱敏
    globalEv.on('onPersonalAssetsEncryption', updateEncryptionData)
    // 资产的单位
    globalEv.on('onPersonalAssetsUnit', updateUnitData)
  }, [])

  return <div className="iui-navbar-assets-overlay">
    <div className="iui-navbar-assets-overlay-total">
      <div className="iui-navbar-assets-overlay-total-label">
        <div className="iui-navbar-assets-overlay-total-label-text">{$t('Total Value')}</div>
        <i className={`iui-icon iui-navbar-assets-overlay-total-label-icon ${hideBalance ? 'iui-icon-eye' : 'iui-icon-eye-off'}`} onClick={() => onChangeEncryption(hideBalance)}></i>
      </div>
      <div className="iui-navbar-assets-overlay-total-amount">
        <div className="iui-navbar-assets-overlay-total-amount-text">{getTotalValue(overviewData.btcTotalPreestimate)}</div>
        <Select
          size="large"
          dropdownStyle={{ width: '100px' }}
          dropdownMatchSelectWidth={false}
          options={[{ label: 'BTC', value: 'BTC' }, { label: 'USDT', value: 'USDT' }]}
          value={valuationAsset}
          className="iui-navbar-assets-overlay-total-amount-unit"
          onChange={v => onChangeSelectUnit(v)}
        ></Select>
      </div>
      <div className="iui-navbar-assets-overlay-total-currency">{getTotalValueCurrency(overviewData.btcTotalPreestimate)}</div>
    </div>

    <AssetsControl onVisibleChange={onVisibleChange} />

    {
      children.map((menu, menuIndex) => {
        return <ItemGroup key={menuIndex}>
          {
            menu.map((item, index) => {
              return <Item key={index} title={item.title} link={{ href: item.link }} iconfont={item.iconfont} />
            })
          }
        </ItemGroup>
      })
    }
  </div>
}

export function AssetsControl(props) {
  const { type = 'dropdown', onVisibleChange = () => { } } = props

  // 划转弹窗
  const transfer = () => {
    let time = 0
    if(type === 'drawer') {
      time = 300
    } 
    setTimeout(() => {
      showTransfer({
        values: {
          asset: 'USDT',
          fromProduct: accountTypes.spot,
          toProduct: accountTypes.futures_usdt
        },
        onSuccess: () => window.location.reload()
      })
    }, time)
    onVisibleChange(false)
  }

  return <>
    <div className={`iui-navbar-assets-overlay-control iui-navbar-assets-overlay-control--${type}`}>
      <div className="iui-navbar-assets-overlay-control-item" onClick={() => actions.gotoHref('/personal/deposit')}>
        <i className="iui-icon iui-icon-down iui-navbar-assets-overlay-control-item-icon"></i>
        <div className="iui-navbar-assets-overlay-control-item-label">{$t('Deposit')}</div>
      </div>
      <div className="iui-navbar-assets-overlay-control-item" onClick={() => actions.gotoHref('/personal/withdrawal')}>
        <i className="iui-icon iui-icon-up iui-navbar-assets-overlay-control-item-icon"></i>
        <div className="iui-navbar-assets-overlay-control-item-label">{$t('Withdraw')}</div>
      </div>
      <div className="iui-navbar-assets-overlay-control-item" onClick={transfer}>
        <i className="iui-icon iui-icon-refresh iui-navbar-assets-overlay-control-item-icon"></i>
        <div className="iui-navbar-assets-overlay-control-item-label">{$t('Transfer')}</div>
      </div>
    </div>
  </>
}

// 账户总览
function fetchAssetsOverview(valuationAsset = 'USDT') {
  if (!auth.isLoged()) return false
  request('/api/exchange-account-center-api/asset/totalPreestimate', { method: 'get', params: { valuationAsset } }, 'config').then(res => {
    if (res && res.code === 200) {
      const data = res.data || {}
      actions.changeForm({ id: 'G_NAVBAR_ASSETS_OVERVIEW', data })
    }
  })
}

// BTC/USDT汇率
function fetchAssetsRate(tradePairName = 'BTC/USDT') {
  if (!auth.isLoged()) return false
  request('/market/v2/tradepair/single/quote', { method: 'get', params: { tradePairName } }, 'config').then(res => {
    if (res && res.code === 200) {
      const data = res.data || {}
      actions.changeForm({ id: 'G_NAVBAR_ASSETS_RATE', data })
    }
  })
}
