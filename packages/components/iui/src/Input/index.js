/**
 * size：max/large/default/small
 */
import { Input } from 'antd'

export default function (props) {
  const { className = '', size = '', ...rest } = props
  const sizeClassName = size ? `iui-input-size-${size}` : ''
  return <Input className={['iui-input', className, sizeClassName].join(' ')} {...rest} />
}
