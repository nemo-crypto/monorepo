/**
 * H5离线环境相关
 */

// 是否H5离线包环境
export const isOffline = window.location.origin.includes('file://')

// 是否离线包测试环境
export const isOfflineTest = navigator.userAgent.toLowerCase().indexOf('online/0') !== -1

// 是否离线包线上环境
export const isOfflineProd = navigator.userAgent.toLowerCase().indexOf('online/1') !== -1

// 是否离线包预发布环境
export const isOfflineStaging = navigator.userAgent.toLowerCase().indexOf('online/2') !== -1

// 离线包环境host
export function getOfflineHost() {
  // file路径：file:///xxx/m.test.net/cur/xxx
  const r = /[^/]+(?=\/cur)/.exec(window.location.href) // 在file路径中找出域名Host
  return r[0]
}

// 离线包环境host域名后缀
export function getOfflineHostSuffix() {
  const r = /[^/]+(?=\/cur)/.exec(window.location.href)
  const host = r[0].split('.').slice(-2).join('.')
  return host
}
