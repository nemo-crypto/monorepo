export function isMobile() {
  return window.navigator.userAgent.toLowerCase().indexOf('mobi') > -1
}
export function isWechat() {
  // 微信的ios 和 Android 里的浏览器的名字 名字叫 MicroMessenger (微信)
  return window.navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}
export function isAndroid() {
  return window.navigator.userAgent.toLowerCase().indexOf('android') !== -1
}
export function isIOS() {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

/**
 * 判断是否在咱们的app内
 * 判断标识 ida
 */
export function isInApp() {
  return /ida/i.test(navigator.userAgent)
}






