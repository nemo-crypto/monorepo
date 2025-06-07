
// URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL
export function createFileAndDownload(fileName, content) {
  var aTag = document.createElement('a')
  var blob = new Blob([content])
  aTag.download = fileName
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}

// http://caibaojian.com/js-download.html
export function downloadFile(aLink, fileName, content) {
  aLink.download = fileName;
  aLink.href = "data:text/plain," + content;
}

export function downloadURL(url, fileName = 'img.png') {
  const elem = document.createElement('a');

  elem.setAttribute('href', url);
  elem.setAttribute('download', fileName);
  document.body.appendChild(elem);
  elem.click();

  elem.remove();
}

/**
 * 
 * @param {String|HTMLCanvasElement} target canvas selector 或 canvas
 * @param {String} fileName
 */
export function downloadCanvas(target, fileName) {
  let canvas

  if (typeof target === 'string') {
    canvas = document.querySelector(target)
  } else {
    canvas = target
  }

  if (canvas) {
    try {
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

      downloadURL(image, fileName)

      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
