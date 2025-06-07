import $t from '@xatom/intl'
import { DatePicker } from 'antd'
import { getTs, parseTs } from '@xatom/utils/src/time'
import moment from 'moment'
const { RangePicker } = DatePicker
export default function TimeRange(props) {
  const { value = [], onChange, ...rest } = props
  const dateValue = value[0] && value[1] && [
    parseTs({ value: value[0], format: 'moment' }),
    parseTs({ value: value[1], format: 'moment' }),
  ]
  function handleChange(value) {
    const beginTime = getTs({ value: value[0], format: "moment" })
    const endTime = getTs({ value: value[1], format: "moment" })
    onChange && onChange([beginTime, endTime])
  }

  return <RangePicker size="small" onChange={handleChange} format="YY/MM/DD HH:mm" value={dateValue || null} placeholder={[$t('Start Date'), $t('End Date')]} disabledDate={getDisableDate} {...rest} />
}

function getDisableDate(date) {
  // 小于3个月之前 和 大于今天的时间，都不可选
  return date < moment().subtract(3, 'months').startOf('day') || date > moment().endOf('day')
}




