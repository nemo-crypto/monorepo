import { Select } from 'antd'
import $t from '@xatom/intl'
import './index.less'

export default function (props) {
  const { options = [], labelRender, className = '', ...rest } = props

  return (
    <Select
      className={['ui-select', className].join(' ')}
      suffixIcon={<img src={require('./images/icon-arrow-down.png')} width={20} height={20} />}
      notFoundContent={
        <div className="ui-select-empty">
          <div className="ui-select-empty-icon"></div>
          <div className="ui-select-empty-text">{$t('No Record')}</div>
        </div>
      }
      dropdownClassName="ui-select-dropdown" {...rest}>
      {options.map((item, index) =>
        <Select.Option value={item.value} key={index}>
          {labelRender ? labelRender(item) : item.label}
        </Select.Option>
      )}
    </Select>
  )
}
