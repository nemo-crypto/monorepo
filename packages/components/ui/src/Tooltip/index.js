import { Tooltip } from 'antd'
import './index.less'

export default function (props) {
  const { children, overlayClassName = '', ...rest } = props
  return <Tooltip overlayClassName={['ui-tooltip-overlay', overlayClassName].join(' ')} {...rest}>{children}</Tooltip>
}
