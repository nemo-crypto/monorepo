export function Item(props) {
  const { title = '', link = {}, iconfont = '', afterNode = null, downNode = null, ...rest } = props
  return <a className="iui-navbar-common-item-row" rel="nofollow" {...link} {...rest}>
    <i className={`iui-navbar-common-item-row-icon iui-icon ${iconfont}`}></i>
    <div className="iui-navbar-common-item-row-info">
      <div className="iui-navbar-common-item-row-info-title">
        <div className="iui-navbar-common-item-row-info-title-label">{title}</div>
        {afterNode}
      </div>
      {downNode}
    </div>
  </a>
}

export function ItemGroup(props) {
  return <div className="iui-navbar-common-item">
    {props.children}
  </div>
}
