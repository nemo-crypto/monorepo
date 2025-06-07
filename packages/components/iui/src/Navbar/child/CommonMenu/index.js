import { useState } from 'react'

export default function Menu(props) {
  const { menus = [] } = props
  const menuActive = {}
  return <div className="iui-nabvar-common-menu">
    {
      menus.map((menu, menuIndex) => {
        if (menu.children?.length) {
          return <Submenu key={menuIndex} {...menu} menuIndex={menuIndex} menuActive={menuActive} />
        }
        return <MenuItem key={menuIndex} {...menu} />
      })
    }
  </div>
}

export function MenuItem(props) {
  const { title } = props
  return <div className="iui-nabvar-common-menu-item">
    <div className="iui-nabvar-common-menu-item-title">
      <a {...getLinks(props)} className="iui-nabvar-common-menu-item-title-label">{title}</a>
    </div>
  </div>
}

export function Submenu(props) {
  // 切换内容展示
  const [menuActive, setMenuActive] = useState({})
  const toggleActive = index => {
    setMenuActive({ ...menuActive, [index]: !menuActive[index] })
  }
  const { menuIndex, title, children = [] } = props
  return <div className={`iui-nabvar-common-menu-item ${menuActive[menuIndex] ? 'is-active' : ''}`}>
    <div onClick={() => toggleActive(menuIndex)} className="iui-nabvar-common-menu-item-title">
      <div className="iui-nabvar-common-menu-item-title-label">{title}</div>
      <i className="iui-icon iui-icon-chevron-down iui-nabvar-common-menu-item-title-expand"></i>
    </div>
    <div className="iui-nabvar-common-menu-item-submenu">
      {children.map((item, index) => <a key={index} {...getLinks(item)} className="iui-nabvar-common-menu-item-submenu-item">
        <div className="iui-nabvar-common-menu-item-submenu-item-title">{item.title}</div>
        {item.afterNode}
      </a>)}
    </div>
  </div>
}

/**
 * TODO:等main项目迁移完可考虑统一数据格式
 * 处理数据格式里的link、href等新老格式存在不统一的情况
 * 可能存在的格式：
 *    - link: ''
 *    - link: { href: '' }
 *    - href: ''
 */
function getLinks(props) {
  const { link, href } = props
  if (link) {
    if (typeof link === 'string') {
      return { href: link }
    }
    return link
  }
  if (href) {
    return { href: item.href }
  }
  return {}
}
