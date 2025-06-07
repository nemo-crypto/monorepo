import { Dropdown } from '@xatom/iui';
import { Item } from '../CommonItem';

export default function (props) {
  const { title, badgeType, link = {}, children = [], dropdownProps = {} } = props

  const TriggerLink = () => {
    return <a className="iui-navbar-common-dropdown" rel="nofollow" {...link}>
      <div className="iui-navbar-common-dropdown-label">{title}</div>
      {badgeType === 'hot' && <i className="iui-navbar-common-dropdown-hot iui-icon iui-icon-hot"></i>}
    </a>
  }

  const TriggerMenus = () => {
    return <Dropdown {...dropdownProps} overlay={<DropdownOverlay children={children} />}>
      <div className="iui-navbar-common-dropdown">
        <div className="iui-navbar-common-dropdown-label">{title}</div>
        <i className="iui-navbar-common-dropdown-arrow iui-icon iui-icon-chevron-down"></i>
        {badgeType === 'hot' && <i className="iui-navbar-common-dropdown-hot iui-icon iui-icon-hot"></i>}
      </div>
    </Dropdown>
  }

  if (children && children.length) {
    return <TriggerMenus />
  }

  return <TriggerLink />
}

const HotItem = (props) => {
  const AfterNode = () => {
    return <i className="iui-icon iui-icon-hot iui-navbar-common-dropdown-overlay-menu-hot"></i>
  }
  return <Item afterNode={<AfterNode />} {...props} />
}

const DropdownOverlay = (props) => {
  const { children = [] } = props
  return <div className="iui-navbar-common-dropdown-overlay">
    {
      children.map((item, index) => {
        if (item.badgeType === 'hot') {
          return <HotItem key={index} title={item.title} link={item.link} iconfont={item.iconfont} />
        }
        return <Item key={index} title={item.title} link={item.link} iconfont={item.iconfont} />
      })
    }
  </div>
}