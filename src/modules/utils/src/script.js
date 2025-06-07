
/**
 * loadScript
 * @param options.src // required
 * @param options.onload
 * @param options.onerror
 */

export function loadScript(options = {}) {
  if (options.src && window.scriptsLoaded && window.scriptsLoaded[options.src]) {
    options.onload && options.onload()
  } else {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.charset = "utf-8"
    script.src = options.src
    script.onerror = options.onerror || function (err) { console.error('load script error', err) }
    script.onload = function () {
      window.scriptsLoaded = {
        [options.src]: true
      }
      options.onload && options.onload()
    }
    document.body.appendChild(script)  // body 最后
    // document.head.appendChild(script) // head 最后
    // var firstScript = document.getElementsByTagName('script')[0] // 第一个 script 之前
    // firstScript.parentNode.insertBefore(script, firstScript)
  }

}
