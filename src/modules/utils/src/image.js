/**
 * 图片压缩处理
 * url 图片地址
 * w 需要的图片宽度
 * h 需要的图片高度
 * dpi 几倍图
 * q 图片质量
 */
export function getOssImage(url, { w, h, dpi = 2, q = 80 }) {
  if (url) {
    const split = url.includes('?') ? '&' : '?'
    let suffix = `${url}${split}x-oss-process=image/resize`
    if (w) suffix += `,w_${w * dpi}`
    if (h) suffix += `,h_${h * dpi}`
    if (q) suffix += `/quality,q_${q}`
    return suffix
  }
  return ''
}
