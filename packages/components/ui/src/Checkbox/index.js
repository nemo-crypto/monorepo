import { Checkbox } from 'antd'
import './index.less'

export default function (props) {
  const { children, className = '', ...rest } = props
  return <Checkbox className={['ui-checkbox', className].join(' ')} {...rest}>{children}</Checkbox>
}
