import { Tooltip } from 'antd'

export default function (props) {
  /**
   * underline 可选，触发节点是否添加下划线
   * maxWidth 可选，提示浮层宽度
   */
  let { children, underline = false, maxWidth = '', overlayStyle = {}, overlayClassName = '', ...rest } = props
  maxWidth = maxWidth || 'calc(100vw - 48px)'
  return <Tooltip overlayStyle={{ maxWidth, ...overlayStyle }} overlayClassName={['iui-tooltip-overlay', overlayClassName].join(' ')} {...rest}>
    {underline ? <span className="iui-tooltip-overlay-underline">{children}</span> : children}
  </Tooltip>
}
