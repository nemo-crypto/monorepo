import { Icon } from 'antd'
export default (props) => {
  let { type = 'primary', size = "middle", outline, className = '', style = {}, icon, ...rest } = props
  className += ` ${className} tag-basic tag-${type} tag-${size}`
  if (props.onClick) className = className + ' cursor-pointer'
  if (outline) className += ` tag-outline`
  if (icon) icon = <Icon type={icon} className="mr5" />
  style = { ...style }
  return <span className={className} style={style} {...rest}>{icon}{props.children}</span>
}
