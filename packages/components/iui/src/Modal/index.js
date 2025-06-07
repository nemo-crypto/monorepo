import { Modal } from 'antd'
import { useMediaQuery } from 'react-responsive'

export default function (props) {
  /**
   * scrollbar：auto/scroll
   *    - auto 滚动条样式auto
   *    - scroll 滚动条贴边
   * title: 可固定的页头
   * footer: 可固定的页脚
   */
  const { children, wrapClassName = '', scrollbar = 'auto', title = null, footer = null, ...rest } = props
  const isH5 = useMediaQuery({ maxWidth: 767 })
  const isH5MaxWidth = useMediaQuery({ maxWidth: 367 })
  const width = isH5 ? (isH5MaxWidth ? 'calc(100vw - 48px)' : '320px' ) : '420px'
  const modalProps = {
    wrapClassName: ['iui-modal', wrapClassName].join(' '),
    destroyOnClose: true,
    maskClosable: false,
    centered: true,
    title: null,
    footer: null,
    width,
    zIndex: 1002,
    closeIcon: <i className="iui-icon iui-icon-close iui-modal-close"></i>,
    ...rest
  }
  return <Modal {...modalProps}>
    {title && <div className="iui-modal-title">{title}</div>}
    <div className={`iui-modal-body iui-scrollbar-default iui-modal-scrollbar-${scrollbar}`}>{children}</div>
    {footer && <div className="iui-modal-footer">{footer}</div>}
  </Modal>
}
