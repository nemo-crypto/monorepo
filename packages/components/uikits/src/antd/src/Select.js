import { Select } from 'antd'
export default function NewSelect(props) {
  let { options = [], labelRender, block, className, children, label, ...rest } = props
  if (block) {
    className += ' d-block'
  }
  return (
    <Select className={className} {...rest}>
      {options.map((item, index) =>
        <Select.Option value={item.value} key={index}>
          {labelRender ? labelRender(item) : item.label}
        </Select.Option>
      )}
    </Select>
  )
}
