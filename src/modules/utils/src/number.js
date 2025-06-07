
// 向下取整(负数不要用，会向上取)
export function toFloat(num, digit) {
  num = num * 1 || 0
  digit = digit * 1 || 0
  var str = num + ''
  // 判断科学计数法e-
  if (str.indexOf('e-') !== -1) {
    str = (str * 1).toFixed(digit + 1)
  }
  // str = (this.accMul(str, Math.pow(10, digit))).toFixed(1) / Math.pow(10, digit)
  str += ''
  var arr = str.split('.')
  var newStr
  if (arr[1]) {
    newStr = arr[0] + '.' + arr[1].substr(0, digit)
  } else {
    newStr = arr[0]
  }
  if (!(newStr * 1).toFixed(digit) || isNaN((newStr * 1).toFixed(digit))) {
    return 0
  } else {
    return (newStr * 1).toFixed(digit) || 0
  }
}

// 向上取整(正负数都正常向上取整)
export function toCeil(num, digit) {
  num = num || 0
  digit = digit * 1 || 0
  num = accMul(num, Math.pow(10, digit))
  num = Math.ceil(num) / Math.pow(10, digit)
  if (!num.toFixed(digit) || isNaN(num.toFixed(digit))) {
    return 0
  } else {
    return num.toFixed(digit) || 0
  }
}

// 乘
export function accMul(arg1, arg2) {
  let m = 0
  let s1 = arg1 + ''
  let s2 = arg2 + ''
  try { m += s1.split('.')[1].length } catch (e) { }
  try { m += s2.split('.')[1].length } catch (e) { }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 除
export function accDiv(arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
  try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

// 加法
export function accAdd(arg1, arg2) {
  let r1
  let r2
  let m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

export const shortBigNumber = (value, precision) => {
  const num = Number(value)
  if (isNaN(num)) return 0;
  if (num < 1000*1000) {
    return toFloat(num, precision)
  }
  if (1000 * 1000 <= num < 1000*1000*1000) {
    return toFloat(accDiv(num,1000), precision) + 'K+'
  }
  if (1000*1000*1000 <= num < 1000*100*1000*1000) {
    return toFloat(accDiv(num,1000*1000), precision) + 'M+'
  }
  if (1000*1000*1000*1000 <= num < 1000*1000*1000*1000*1000) {
    return toFloat(accDiv(num,1000*1000*1000), precision) + 'B+'
  }
}

export const toPercent = (value, precision=2) => {
  if (!isNaN(value)) {
    const num = toFloat(Number(value) * 100, precision)
    return `${num}%`
  } else {
    return null
  }
}
