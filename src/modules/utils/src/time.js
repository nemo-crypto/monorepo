import moment from 'moment';

// 返回 timestamp
// 输入：moment类型，enum类型
export function getTs(options = {}) {
  moment.locale('en')
  const { value, format = "now", unit = 'ms' } = options
  const xUnit = unit === 'ms' ? 'x' : 'X'
  switch (format) {
    case 'now':
      // 返回当前的时间的 unix ts
      return Number(moment().format(xUnit))
    case 'moment':
      // 将 moment 时间格式转为 ts
      if (value && typeof value === 'object') {
        return Number(value.format(xUnit))
      } else {
        return null
      }
    default:
      break;
  }
}

// 返回 time 或者 momentl类型
export function parseTs({ value, format = "YYYY-MM-DD HH:mm:ss", unit = 'ms' }) {
  moment.locale('en')
  const xUnit = unit === 'ms' ? 'x' : 'X'
  if (value)
    switch (format) {
      case 'fromnow':
        // 将 ts 转为 fromnow 时间格式：例如 5 mins ago
        return moment(value, xUnit).fromNow() // 本地 time
      case 'moment':
        // 将 ts 转为 moment 格式
        return moment(value, xUnit)
      default:
        // 将 ts 转为 标准的刻度格式，例如：2019-02-28 22:00:00
        return moment(value, xUnit).format(format) // 本地 time
    }
}

// 返回 time
export function getNow(format = "YYYY-MM-DD HH:mm:ss") {
  return moment().format(format) // 本地 time
}

export const commonRanges = {
  'last24hour': [moment().subtract(24, 'hours'), moment()],
  'last7day': [moment().subtract(7, 'days'), moment()],
  'last1month': [moment().subtract(1, 'months'), moment()],
  'last3month': [moment().subtract(3, 'months'), moment()],
  'today': [moment().startOf('day'), moment()], // 本日到现在
  'thisweek': [moment().startOf('week'), moment()],  // 本周到现在
  'thismonth': [moment().startOf('month'), moment()], // 本月到现在
}

export function getSeconds(value, unit) {
  value = Number(value);
  switch (unit) {
    case 'second':
      return value;
    case 'minute':
      return value * 60;
    case 'hour':
      return value * 3600;
    case 'day':
      return value * 3600 * 24;
    default:
      return value;
  }
}
