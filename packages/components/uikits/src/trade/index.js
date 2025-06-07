import { Tooltip } from '@xatom/iui'
import { Text } from '@xatom/typo'
import { toPercent, toSeprator, tsToTime, utcToTime } from '@xatom/modular/src/formatters'

export function DashedTooltip(props) {
  const { title = '', maxWidth } = props
  return (
    <Tooltip className="d-inline-block" maxWidth={maxWidth} title={<Text className="lh-20" wrap={true}>{title}</Text>}>
      <div className="d-inline-block" style={{ paddingBottom: '1px', borderBottom: '1px dashed #606470' }}>{props.children}</div>
    </Tooltip>
  )
}
// 根据数据正负，控制颜色
export function Trend(props) {
  const { value, ...rest } = props
  let newValue = String(value)
  if (newValue.indexOf('%') > -1) newValue = newValue.replace('%', '')
  let type = '1'
  if (!isNaN(newValue) && Number(newValue) > 0) type = '1-up'
  if (!isNaN(newValue) && Number(newValue) < 0) type = '1-down'
  return <Text type={type} number {...rest}>{props.children ? props.children : value}</Text>
}
// 根据数据正负，1.判断颜色 2.判断+-符号 3.增加百分号%
export function Change(props) {
  const { value, precision, ...rest } = props
  let prefix = null
  if (Number(value) > 0) prefix = '+'
  if (Number(value) < 0) prefix = null // 负号已经有了
  const precentValue = toPercent(props.value, precision)
  return <Trend value={value} {...rest}>{prefix}{precentValue}</Trend>
}

export function MaxAmount(props) {
  const origin = Number(props.value)
  const max = Number(props.max || 1000 * 100)
  const { format = true } = props
  let amount
  if (origin && origin > max) {
    amount = max
  } else {
    amount = origin
  }
  return (
    <Tooltip title={<div className="fs12 lh-20">{toSeprator(origin)}</div>}>
      {format ? toSeprator(amount) : amount}{origin > max && '+'}
    </Tooltip>
  )
}

export function Time(props) {
  const { value, type, unit = 'ms', format = 'YYYY-MM-DD HH:mm:ss', isUtc = false } = props
  let newValue = value
  if (isUtc) {
    newValue = utcToTime({ value, type, format })
  } else {
    newValue = tsToTime({ value, type, format, unit })
  }
  return newValue
}
