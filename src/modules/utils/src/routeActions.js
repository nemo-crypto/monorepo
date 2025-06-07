import router from 'umi/router';
import { getQuery } from './url';
import { matchPath } from "react-router";

export default {
  refresh: (bool = true) => {
    window.location.reload(bool)
  },
  goBack: (defaultUrl) => {
    const length = window.history.length
    if (length >= 1) {
      router.goBack()
    } else {
      if (defaultUrl) {
        // 如果没有上一页的话，有指定页的话，就会自动跳转到指定的页面
        window.location.href = defaultUrl
      } else {
        router.goBack()
      }
    }
  },
  goForward: () => {
    router.goForward()
  },
  gotoRoute: (route) => {
    router.push(route);
  },
  gotoPath: (path, state) => {
    router.push({
      pathname: path,
      ...state,
    });
  },
  gotoHref: (href, ifNewPage = false) => {
    if (ifNewPage) {
      window.open(href);
    } else {
      window.location.href = href
    }
  },
  getQuery,
  getParams,
  // TODO
  isActive: () => { },
  isMatch: () => { },
}

function getParams({
  key,
  pathname, // 当前页面无需传递
  route, // 例如 /margin/exchange/:symbol
}) {
  pathname = pathname ? pathname : window.location.pathname
  const match = matchPath(pathname, {
    path: route,
    exact: false,
    strict: false
  });
  if (key) {
    return match && match.params && match.params[key]
  } else {
    return match && match.params
  }
}
