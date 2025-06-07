// 防止iframe非法嵌入
export function disallowIframe() {
  try {
    if (top.location.hostname != window.location.hostname) {
      top.location.href = window.location.href
    }
  }
  catch(e) {
    window.location.href = "about:blank"
  }
}