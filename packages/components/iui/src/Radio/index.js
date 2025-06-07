import { Radio } from 'antd'

export default function (props) {
  const { children, className = '', ...rest } = props
  return <Radio className={['iui-radio', className].join(' ')} {...rest}>{children}</Radio>
}
