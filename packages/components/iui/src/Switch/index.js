/**
 * size：default/small
 * type：default/primary
 */

import { Switch } from 'antd'

export default function (props) {
  const { className = '', type = '', ...rest } = props
  const typeClassName = type ? `iui-switch-${type}` : ''
  return <Switch className={['iui-switch', typeClassName, className].join(' ')} {...rest} />
}
