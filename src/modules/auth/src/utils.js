import { toast } from '@xatom/antd/Notify'
import $t from '@xatom/intl'
import qs from 'qs';
import { encodeEmail, encodePhone } from '@xatom/utils/src/crypto'
import { getHost } from '@xatom/utils/src/env'
import request from '@xatom/utils/src/http'
import { isOffline } from '@xatom/utils/src/offline'
import { isEmail } from '@xatom/utils/src/RegExp'
import routeActions from '@xatom/utils/src/routeActions'
import storage from '@xatom/utils/src/storage'
import { getkyc, refreshToken, refreshUser } from './apis'
import { isInApp } from '@xatom/utils/src/useragent'
import { bridgeReady, callApi } from '@xatom/bridge'
import { clearUserIdGio } from '@xatom/utils/src/gio'

export { getkyc, refreshToken, refreshUser }

export function isLoged() {
  const user = getUser('user')
  if (user && user.userId) {
    return true
  } else {
    return false
  }
}
export function getUser() {
  return storage.getItem('user') || {}
}
export function setUser(user) {
  const oldUser = getUser() || {}
  const newUser = {
    ...oldUser,
    ...user,
  }
  // app内的H5和离线版本需要使用到token
  if (isInApp()) {
    storage.setItem('user', newUser)
  } else {
    const { token, refreshToken, ...userInfo } = newUser
    storage.setItem('user', userInfo)
  }
}
export function removeUser() {
  storage.removeItem('user')
}

export function logout(path) {
  request(getHost('config') + '/user/logout', { method: 'post' }).then(res => {
    if (res && res.code === 200) {
      storage.removeItem('user')
      if (!isOffline) {
        routeActions.gotoHref(path || '/')
      }
      //gio清除登录用户ID
      clearUserIdGio()
    } else {
      toast({ type: 'error', title: res.message })
    }
  })
}
const splitParams = (sign, query = {}) => {
  const params = qs.stringify({...routeActions.getQuery(), ...query})
  return `${sign}${params}`
}
export function gotoLogin(path, query = {}) {
  const pathname = window.location.pathname
  if (!path) {
    path = window.location.href
  }
  
  if (pathname.startsWith('/auth/')) {
    routeActions.gotoHref(`/auth/login${splitParams("?", query)}`)
  } else {
    routeActions.gotoHref(`/auth/login?backurl=${encodeURIComponent(path)}${splitParams("&", query)}`)
  }
}

export function gotoRegister(path = '', query = {}) {
  console.log('gotoRegister', path)
  const pathname = window.location.pathname
  if (!path) {
    path = window.location.href
  }
  
  if (pathname.startsWith('/auth/')) {
    routeActions.gotoHref(`/auth/register/email${splitParams("?", query)}`)
  } else {
    console.log('gotoRegister', encodeURIComponent(path))
    console.log('gotoRegister', encodeURIComponent(JSON.stringify(query)))
    console.log('gotoRegister', `/auth/register/email?backurl=${encodeURIComponent(path)}${splitParams("&", query)}`)
    routeActions.gotoHref(`/auth/register/email?backurl=${encodeURIComponent(path)}${splitParams("&", query)}`)
  }
}

// 格式化 用户的 phone 或者 email
export function getUserName() {
  const user = getUser()
  if (user) {
    const loginId = user.loginId
    return isEmail(loginId) ? encodeEmail(loginId) : encodePhone(loginId)
  }
}

export function tokenInvalidHandle() {
  toast({ type: 'error', title: $t('Login has expired') })
  storage.removeItem('user')
  setTimeout(() => {
    location.reload()
  }, 1000)
}

export const doWithAuth = callback => {
  return function (...args) {
    if (isLoged()) {
      callback.apply(null, args)
    } else {
      gotoLogin()
    }
  }
}

/**
 * 初始化 App 环境下的用户配置
 * 该函数用于在 App 环境中同步用户数据，包括：
 * 1. 检查是否在 App 环境内
 * 2. 等待 bridge 就绪
 * 3. 获取用户数据并更新本地存储
 * 4. 执行回调函数
 * 
 * @param {Function} [callback=() => {}] - 初始化完成后的回调函数
 * @returns {void}
 */
export const initAppUserConfig = (callback = () => { }) => {
  if (isInApp()) {
    bridgeReady().then(() => {
      callApi('user.getUser')
        .then(data => {
          if (data && data.token) {
            setUser(data);
            callback();
          } else {
            removeUser();
            callback();
          }
        })
        .catch(() => {
          callback();
        });
    })
  } else {
    callback();
  }
} 

