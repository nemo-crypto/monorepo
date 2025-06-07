import { Checkbox } from 'antd'

export default function (props) {
  const { children, className = '', ...rest } = props
  return <Checkbox className={['iui-checkbox', className].join(' ')} {...rest}>{children}</Checkbox>
}
