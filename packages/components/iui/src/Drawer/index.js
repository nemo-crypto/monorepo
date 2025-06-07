import { Drawer } from 'antd'
import { useMediaQuery } from 'react-responsive'

export default function (props) {
  /**
   * scrollbar：auto/scroll
   *    - auto 滚动条样式auto
   *    - scroll 滚动条贴边
   * shape: round
   *    - round 抽屉上部分支持圆角
   * closable: 是否展示自定义的关闭按钮
   * title: 可固定的页头
   * footer: 可固定的页脚
   */
  const { children, scrollbar = 'auto', shape = '', closable = true, title = null, footer = null, className = '', onClose = () => { }, ...rest } = props
  const isH5 = useMediaQuery({ maxWidth: 767 })
  const width = isH5 ? '100vw' : '320px'
  const platformClassName = isH5 ? 'iui-drawer-h5' : 'iui-drawer-web'
  const shapeClassName = shape ? `iui-drawer-shape-${shape}` : ''
  const drawerProps = {
    width,
    zIndex: 1002,
    placement: 'right',
    closable: false,
    destroyOnClose: true,
    maskClosable: false,
    className: ['iui-drawer', platformClassName, shapeClassName, className].join(' '),
    ...rest
  }
  
  return <Drawer {...drawerProps}>
    {closable && <i className="iui-icon iui-icon-close iui-drawer-close" onClick={onClose}></i>}
    <div className="iui-drawer-wrap">
      {title && <div className="iui-drawer-title">{title}</div>}
      <div className={`iui-drawer-body iui-scrollbar-default iui-drawer-scrollbar-${scrollbar}`}>{children}</div>
      {footer && <div className="iui-drawer-footer">{footer}</div>}
    </div>
  </Drawer>
}
