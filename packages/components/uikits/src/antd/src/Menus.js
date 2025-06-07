import { Menu, Icon, Button } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item


function Badge(props) {
  // 是否显示右上角的badge
  const { content, badgeClass = '' } = props
  return (
    <div className="w-p100 h-p100 center-v mr5" style={{ position: 'relative' }}>
      {props.children}
      <span className={['center-v', badgeClass].join(' ')} style={{ position: 'absolute', left: '100%' }}>
        {content && <span className="fs10">{content}</span>}
      </span>
    </div>
  )
}
// 如果有Badge就将titlle 包裹起来
const getMenuItem = menu => (
  <MenuItem key={menu.key} onClick={menu && menu.onClick} className="cursor-pointer">
    {!!menu.badge && <Badge content={menu.badge} badgeClass={menu.badgeClass}>{menu.title}</Badge>}
    {!menu.badge && menu.title}
  </MenuItem>
)
const getSubMenuItem = menu => (
  <MenuItem key={menu.key} >
    {/* fix bug: submenu item onclick invalid  */}
    <Button onClick={menu && menu.onClick} size="small" type="primary" className="cursor-pointer w-p100 text-left t-reset" >
      {menu.title}
    </Button>
  </MenuItem>
)

const SubMenuTitle = ({ menu }) => {
  const { title, onClick, showArrow = true } = menu
  return (
    <div onClick={onClick}>
      {title}
      {showArrow && <Icon type="caret-down" rotate={0} className="fs12" style={{ marginLeft: '3px', marginRight: '0px' }} />}
    </div>
  )
}
const getSubMenu = (menu, popup = {}) => {
  return (
    <SubMenu className={popup.className || null} title={<SubMenuTitle menu={menu} />} key={menu.key} popupOffset={popup.offset || null}>
      {menu.children.filter(menu => !menu.hidden).map(getSubMenuItem)}
    </SubMenu>
  )
}
const getMenusNodes = (menus, popup) => {
  return menus.filter(menu => !menu.hidden).map(menu => Array.isArray(menu.children) ? getSubMenu(menu, popup) : getMenuItem(menu))
}

export default function Menus(props) {
  const { menus = [], direction = "horizontal", theme = "dark", popup, selectedKeys, ...rest } = props
  const handleClick = function (item, key, keypath) {
  }
  const newSelectedKeys = selectedKeys || getSelectedKeys(menus)
  const menusNodes = getMenusNodes(menus, popup)
  return (
    <Menu
      onClick={handleClick}
      selectedKeys={newSelectedKeys}
      mode={direction}
      theme={theme}
      {...rest}
    >
      {menusNodes}
    </Menu>
  )
}

function getSelectedKeys(menus) {
  const href = window.location.href
  const pathname = window.location.pathname
  let selectedKeys = []
  menus.forEach(menu => {
    // 如果精准匹配
    if (menu.exact) {
      if (pathname.replace(window.window.routerBase, '/') === menu.key) {
        selectedKeys.push(menu.key)
      }
    } else {
      if (href.indexOf(menu.key) > -1) {
        selectedKeys.push(menu.key)
      }
    }

  })
  return selectedKeys
}
