/**
 * size：max/large/default/small
 * type：primary/up/down/default/line/text
 */
import { Button } from 'antd'

export default function (props) {
  const { children, className = '', size = '', ...rest } = props
  const sizeClassName = size ? `iui-button-size-${size}` : ''
  return <Button className={['iui-button', className, sizeClassName].join(' ')} {...rest}>{children}</Button>
}
