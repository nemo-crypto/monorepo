/**
 * size：max/large/default/small
 */
import { Select } from 'antd'
import $t from '@xatom/intl'
import { getMode } from '@xatom/utils/src/themes'

export default function (props) {
  const { options = [], labelRender, className = '', dropdownClassName = '', size = '', ...rest } = props
  const sizeClassName = size ? `iui-select-size-${size}` : ''
  const dropdownSizeClassName = size ? `iui-select-dropdown-size-${size}` : ''
  const mode = getMode()
  
  return (
    <Select
      className={['iui-select', className, sizeClassName].join(' ')}
      suffixIcon={<i className="iui-icon iui-icon-chevron-down" />}
      notFoundContent={
        <div className="iui-select-empty">
          <div className={`iui-select-empty-icon iui-select-empty-icon-${mode}`}></div>
          <div className="iui-select-empty-text">{$t('No Record')}</div>
        </div>
      }
      dropdownClassName={['iui-select-dropdown', dropdownClassName, dropdownSizeClassName].join(' ')} {...rest}>
      {options.map((item, index) =>
        <Select.Option value={item.value} key={index} label={item.label} className={item.hide ? 'is-hide' : ''}>
          {labelRender ? labelRender(item) : item.label}
        </Select.Option>
      )}
    </Select>
  )
}
