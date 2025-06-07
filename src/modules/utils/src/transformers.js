// default transformer of item
export const item = (res) => {
  if (res && res.code === 200) {
    return {
      code: res.code,
      // fix1： 接受res.data 是一个字符串
      // fix2： 有些接口没有data key，所以要做 undefined 处理
      item: res.data === undefined ? {} : res.data
    }
  } else {
    return {
      code: res && res.code,
      item: {}
    }
  }
}

// default transformer of list
export const list = (res) => {
  if (res && res.code === 200 && res.data) {
    return {
      code: res.code,
      items: res.data.list || [],
      page: {
        ...(res.data.pageNum ? { current: res.data.pageNum } : {}),
        ...(res.data.pageSize ? { size: res.data.pageSize } : {}),
        total: res.data.total,
      },
    }
  } else {
    return {
      code: res && res.code,
      items: [],
    }
  }
}

// default transformer of page
export const page = (payload) => {
  const { page = {} } = payload
  return {
    pageNum: page.current,
    pageSize: page.size,
  }
}



