import { Button } from 'antd'
import './index.less'

export default function (props) {
  const { children, className = '', ...rest } = props
  return <Button className={['ui-button', className].join(' ')} {...rest}>{children}</Button>
}
