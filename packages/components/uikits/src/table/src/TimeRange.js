import $t from '@xatom/intl'
import { DatePicker, ConfigProvider } from 'antd'
import { getTs, parseTs } from '@xatom/utils/src/time'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/en_US'
import { isFaLang } from '@xatom/langs'

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
  //波斯语下 时间区间组件默认英文（fix：波斯语语言下时间选择为NaN）
  if (isFaLang()) {
    return <ConfigProvider locale={locale}><RangePicker size="small" onChange={handleChange} format="YY/MM/DD HH:mm" value={dateValue || null} placeholder={[$t('Start Date'), $t('End Date')]} disabledDate={getDisableDate} {...rest} /></ConfigProvider>
  } else {
    return <RangePicker size="small" onChange={handleChange} format="YY/MM/DD HH:mm" value={dateValue || null} placeholder={[$t('Start Date'), $t('End Date')]} disabledDate={getDisableDate} {...rest} />
  } 
}

function getDisableDate(date) {
  // 小于3个月之前 和 大于今天的时间，都不可选
  return date < moment().subtract(3, 'months').startOf('day') || date > moment().endOf('day')
}
// 注意
// 获得今天的0分0秒（返回moment对象）： moment().startOf('day') 
// 获得今天的0分0秒（返回unix字符串，毫秒）： moment().startOf('day').format('x')
// 获得今天的0分0秒（返回unix字符串，秒）： moment().startOf('day').format('X')



