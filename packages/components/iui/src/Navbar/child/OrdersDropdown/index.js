import { Dropdown } from '@xatom/iui';
import { Item } from '../CommonItem';

export default function (props) {
  const { title, children = [] } = props
  return <Dropdown overlay={<DropdownOverlay children={children} />} placement="bottomRight">
    <div className="iui-navbar-orders">
      <div className="iui-navbar-orders-label">{title}</div>
      <i className="iui-navbar-orders-arrow iui-icon iui-icon-chevron-down"></i>
    </div>
  </Dropdown>
}

const DropdownOverlay = (props) => {
  const { children = [] } = props
  return <div className="iui-navbar-orders-overlay">
    {
      children.map((group, groupIndex) => {
        return <div key={groupIndex}>
          {
            group.map((item, index) => {
              return <Item key={index} title={item.title} link={{ href: item.link }} iconfont={item.iconfont} />
            })
          }
        </div>
      })
    }
  </div>
}