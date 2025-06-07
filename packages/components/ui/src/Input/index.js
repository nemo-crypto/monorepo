import { Input } from 'antd'
import './index.less'

export default function (props) {
  const { className = '', ...rest } = props
  return <Input className={['ui-input', className].join(' ')} {...rest} />
}
