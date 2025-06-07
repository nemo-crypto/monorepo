
export function orderByDesc() {
  // TODO
}

export function orderByAsc() {
  // TODO
}

export function unique() {
  // TODO
}

// 升序
// obj arr 或者 二维数组
export function ascSorter(key, type) {
  if (type === 'string') {
    return (a, b) => {
      return a[key] >= b[key] ? 1 : -1 // 字符串比大小，不能与加减号
    }
  } else {
    return (a, b) => {
      const aValue = isNaN(a[key]) ? 0 : Number(a[key]) // fixbug: 修复 Number(value) 为 NaN时候排序不正确的bug
      const bValue = isNaN(b[key]) ? 0 : Number(b[key]) // fixbug: 修复 Number(value) 为 NaN时候排序不正确的bug
      return aValue - bValue
    }
  }

}

// 降序
// obj arr 或者 二维数组
export function descSorter(key, type) {
  if (type === 'string') {
    return (a, b) => {
      return b[key] >= a[key] ? 1 : -1 // 字符串比大小，不能与加减号
    }
  } else {
    return (a, b) => {
      const aValue = isNaN(a[key]) ? 0 : Number(a[key]) // fixbug: 修复 Number(value) 为 NaN时候排序不正确的bug
      const bValue = isNaN(b[key]) ? 0 : Number(b[key]) // fixbug: 修复 Number(value) 为 NaN时候排序不正确的bug
      return bValue - aValue
    }
  }
}
