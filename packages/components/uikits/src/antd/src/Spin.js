import { Spin } from 'antd'
export default (props) => {
  let { loading, className, style = {}, ...rest } = props
  className += ` center-vh ${className}`
  style = { flex: 1 }
  return <Spin spinning={loading} className={className} style={style} {...rest} />
}
