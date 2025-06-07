import { parse } from 'qs';

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export function isUrl(path) {
  return reg.test(path);
}
export function getQuery(paramKey, url) {
  url = url ? url : window.location.href
  const querystring = url.split('?')[1]
  const query = parse(querystring)
  return paramKey ? query[paramKey] : query
}

export function toQuery(obj = {}) {

}

export function getPathname(uri) {
  // 移除协议部分 (http://, https://, ws://, wss://)
  const withoutProtocol = uri.replace(/^(?:[\w+.-]+:)?\/\//, '');
  // 移除认证信息 (user:pass@)
  const withoutAuth = withoutProtocol.replace(/^[^@]*@/, '');
  // 移除域名和端口，获取路径部分
  const pathAndQuery = withoutAuth.replace(/^[^/]*/, '');
  // 移除查询参数和hash
  const pathname = pathAndQuery.split(/[?#]/)[0];
  // 如果结果为空，返回 '/'
  return pathname || '/';
}

export default {
  isUrl,
  getQuery,
  toQuery,
  getPathname,
}

