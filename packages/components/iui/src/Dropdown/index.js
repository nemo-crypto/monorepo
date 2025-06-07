import { Dropdown } from 'antd'

export default function (props) {
  const { children, overlayClassName = '', ...rest } = props
  return <Dropdown overlayClassName={['iui-dropdown-overlay', overlayClassName].join(' ')} {...rest}>{children}</Dropdown>
}
