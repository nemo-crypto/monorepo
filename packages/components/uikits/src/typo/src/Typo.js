
import RouteLink from 'umi/link'
import { Icon } from 'antd'

function Typo(props) {
  let {
    prefix = '', type = '1',
    className = '', style = {},
    nowrap = true, // 默认不换行
    wrap = false, // 默认不换行
    ellipsis = true, // 默认显示省略号
    bold, bolder, center, right,
    inline, block,
    number,
    render,
    hidden,
    isActive = false,
    mode,
    disabled,
    onClick,
    loading,
    kit,
    inherit,
    icon = null,
    ...rest
  } = props
  className = `typo ${prefix}-${type} ${className} `
  // let textWrap = ''
  // let textOverflow = ''
  // if (!wrap) {
  //   // 不换行的时候才设置省略
  //   textWrap = 'typo-nowrap'
  //   textOverflow = ellipsis && 'typo-ellipsis'
  // }
  // if (ellipsis) className += ' typo-ellipsis'
  if (hidden) return null
  if (disabled) {
    className += ' typo-disabled'
    onClick = null
  }
  if (bold) className += ' fw-bold'
  if (bolder) className += ' fw-bolder'
  if (center) className += ' text-center center-h'
  if (right) className += ' text-right'
  if (inline) className += ' d-inline'
  if (block) className += ' d-block'
  if (inherit) className += ' fc-inherit'
  if (number) className += ' ff-number'
  if (kit) className += ` kit-${kit}`
  if (isActive) className += ' active'
  if (onClick || props.to || props.href) className = className + ' cursor-pointer'
  if (icon || loading) {
    icon = <Icon type={loading ? 'loading' : icon} className="mr5" />
  }
  if (props.href) {
    render = props => <a {...props}>{icon}{props.children}</a>
  }
  if (props.to) {
    let pagePathname = window.location.pathname
    const base = window.routerBase
    if (base) pagePathname = pagePathname.replace(base, '/') // umi routerBase 逻辑
    const toPathname = (props.to && props.to.pathname) || props.to  // to 可能是 map，可能是 str
    const isActive = props.exact ? toPathname === pagePathname : pagePathname.startsWith(toPathname) // 这里一定是等于，不能是 indexOf，不能是 startsWith
    if (isActive) className += ' active'
    render = props => <RouteLink {...props}>{icon}{props.children}</RouteLink>
  }
  // if (props.to && className.indexOf('active-') > -1) {
  //   render = props => <NavLink {...props} activeClassName="active">{icon}{props.children}</NavLink>
  // }
  if (!render) {
    render = props => <div {...props}>{icon}{props.children}</div>
  }
  if (mode && (mode === 'html' || mode === 'richtext')) {
    render = props => <div {...props} dangerouslySetInnerHTML={{ __html: children }}></div>
  }
  if (mode && (mode === 'p' || mode === 'paragraph')) {
    wrap = true
    className += ' typo-paragraph'
  }
  // if (!wrap) className += ' typo-nowrap typo-ellipsis'
  if (wrap) style = { wordBreak: 'break-word', whiteSpace: 'normal', ...style }
  // 不换行的情况，分三种类型
  // 如果 wrap 设置为true，则 nowrap的所有设置失效
  if (nowrap && !wrap) {
    switch (nowrap) {
      case 'visible':
        className += ' typo-nowrap-visible'
        break;
      case 'hidden':
        className += ' typo-nowrap'
        break;
      default:
        className += ' typo-nowrap typo-ellipsis'
        break;
    }
  }
  style = { ...style }
  const newProps = { className, style, ...rest, onClick, }
  return render(newProps)
}

export function Text(props) {
  return <Typo prefix="typo-text" {...props}>{props.children}</Typo>
}

export function Title(props) {
  return <Typo prefix="typo-title" {...props}>{props.children}</Typo>
}

export function Heading(props) {
  return <Typo prefix="typo-heading" {...props}>{props.children}</Typo>
}











