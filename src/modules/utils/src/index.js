// 数字千分位展示
export const toSeprator = num => {
  if(isNaN(num)) return 0
  const arr = ("" + num).split('.')
  const str1 = arr[0]
  const str2 = arr[1] ? '.' + arr[1] : ''
  return str1.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,") + str2
}

// 获取传入数值有几位小数
export const getNumPrecisionLength = num => {
  if (!num) return 0
  const arr = num.toString().split('.')
  if (arr[1]) return arr[1].length
  return 0
}
