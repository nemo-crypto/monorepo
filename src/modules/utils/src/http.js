import auth from '@xatom/auth';
import { getLang } from '@xatom/langs';
import { getSite } from '@xatom/sites';
import qs from 'qs';
import Browser from './browser';
import { getHost, isSimul } from './env';
import { isInApp } from './useragent'
import { bridgeReady, callApi } from '@xatom/bridge'
import { v4 as uuidv4 } from 'uuid'
import storage from './storage'
import Monitor from '@xatom/monitor'
import MomentTimezone from 'moment-timezone'
import { encodePassword, getAkamaiAuth } from '@xatom/utils/src/crypto'
import { removeEmptyValues } from './object'
const fetch = require("dva").fetch;

const tracker = new Monitor()

const getDefaultHeaders = () => {
  const utcOffset = -(new Date().getTimezoneOffset() / 60)
  let headers = {
    site: getSite(),
    lang: getLang(),
    // 浏览器自带的headers里的origin 网关服务转发的时候把origin给filter去掉了 ===> 后端取的NewOrigin字段
    NewOrigin: location.origin || location.protocol + '//' + location.host,
    timezone: utcOffset,
    clientData: getClientData(),
    deviceinfo: getDeviceInfo(utcOffset),
    fpt: getFptInfo()
  }
  const user = auth.getUser()
  if (auth.isLoged()) {
    // app内的H5和离线版本依旧使用headers传输token
    if (isInApp()) {
      headers = Object.assign({}, headers, {
        Authorization: `Bearer ${user.token}`
      })
    }
    if (isSimul() && user.displayUserId) {
      headers.uid = user.displayUserId
    }
  }
  return headers
}

function toFormData(obj = {}) {
  let formData
  const keys = Object.keys(obj)
  if (keys.length > 0) {
    formData = new FormData()
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key])
      }
    }
  } else {
    formData = null
  }
  return formData
}

// 解析url
export const parseUrl = url => {
  const el = document.createElement('a')
  el.href = url
  return el
}

// 请求日志
export const sendHttpLog = (url, startTime, options, res, hasHttp = true, type = '') => {
  const baseUrl = hasHttp ? parseUrl(url).origin : getHost(type)
  const path = hasHttp ? url.split(baseUrl)[1] : url
  tracker.sendHttpLog({
    baseUrl,
    path,
    startTime,
    method: options.method,
    data: { ...options.params, ...options.body },
    code: res.code,
    message: res.message
  })
}

export function pureRequest(url, options) {
  const responseType = options.responseType || 'json' // 默认接受的数据类型是json
  options.responseType && delete options.responseType
  const startTime = Date.now()
  return fetch(url, options)
    .then(formatRes(responseType))
    .then(res => {
      sendHttpLog(url, startTime, options, { code: 200, message: 'success' })
      return serverCodeHandler(res)
    })
    .catch(res => {
      sendHttpLog(url, startTime, options, { code: 403, message: 'failed' })
      return res
    })
}
export default function request(url, options, type) {
  // 新增type参数，控制模拟盘页面是否使用线上api地址
  let newUrl
  // 如果带有host信息，则不添加host(适用于部分接口使用同事的机器进行联调)
  const hasHttp = url.startsWith('http') || url.startsWith('https')
  if (hasHttp) {
    newUrl = getUrlByParams(url, options)
  } else {
    newUrl = getHost(type) + getUrlByParams(url, options)
  }
  const { requestType = 'formdata', responseType = 'json', ...opts } = options
  const newOptions = optionsTransformer.format(opts).setDefault().setBody(requestType).setHeaders(requestType).value()
  const startTime = Date.now()
  return fetch(newUrl, newOptions)
    .then(formatRes(responseType))
    .then(res => {
      sendHttpLog(url, startTime, opts, res, hasHttp, type)
      return serverCodeHandler(res)
    })
    .catch(res => {
      sendHttpLog(url, startTime, opts, res, hasHttp, type)
      return res
    })
}

// url字符拼接
export const generateQueryString = function (url, params) {
  const split = url.indexOf('?') !== -1 ? '&' : '?'
  return `${url}${split}${qs.stringify(removeEmptyValues(params))}`
}

export const getUrlByParams = function (url, options = {}) {
  options.params = Object.assign({}, options.params, { auth: getAkamaiAuth(url) })
  const split = url.indexOf('?') !== -1 ? '&' : '?'
  return `${url}${split}${qs.stringify(options.params)}`
}

const optionsTransformer = {
  format(options) {
    // remove paramse
    const { parmas, ...rest } = options
    this._options = rest
    return this
  },
  setDefault() {
    const options = this._options
    const defaultOptions = {
      // 传递 cookie session 等信息
      credentials: 'include',
      // mode: 'no-cors',
    }
    this._options = { ...defaultOptions, ...options, }
    return this
  },
  setBody(requestType) {
    let options = this._options
    options.method = options.method.toUpperCase()
    // 没有body就不能对空值做处理
    if (options.body) {
      // GET 请求不能有body
      if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
        switch (requestType) {
          case 'formdata':
            options.body = toFormData(options.body)
            break;
          case 'json':
            options.body = JSON.stringify(options.body)
            break;
          case 'jsonstring':
            options.body = qs.stringify(options.body)
            break;
          default:
            options.body = JSON.stringify(options.body)
            break;
        }
      }
    }
    this._options = options
    return this
  },
  setHeaders(requestType) {
    const options = this._options
    options.headers = {
      'Accept': 'application/json, text/plain, */*',
      // 此处逻辑：可以优化或者抽离
      ...getDefaultHeaders(),
      ...options.headers,
    }
    if (!(options.body instanceof FormData)) {
      // get jsonstring json text
      switch (requestType) {
        case 'jsonstring':
          options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            ...options.headers,
          };
          break;

        case 'json':
          options.headers = {
            'Content-Type': 'application/json; charset=utf-8',
            ...options.headers,
          };
          break;

        default:
          break;
      }
    }
    this._options = options
    return this
  },
  value() {
    return this._options
  }
}

const formatRes = (responseType = 'json') => {

  return (response) => {
    let res
    // 这里的异常，汇报 promise.catch catch住，所以不用手工 try catch
    switch (responseType) {
      case 'json':
        res = response.json()
        break;
      case 'blob':
        res = response.blob()
        break;
      case 'text':
        res = response.text()
        break;
      case 'jsonstring':
        res = response.json()
        break;
      // 有些返回无preview: 不对数据进行处理（如往三方oss地址传图）
      case 'normal':
        res = response
        break
      default:
        res = response.text()
        break;
    }
    return res
  }
}

function handle401() {
  const user = auth.getUser()
  // app内
  if (isInApp()) {
    // token无效
    if (user && user.token) {
      // 如果是app调用桥清空登录信息，然后主动调起登录
      bridgeReady().then(() => {
        callApi('user.clearUserInfo').then(() => {
          callApi('user.login').then(data => {
            if (data && data.token) {
              auth.setUser(data)
              location.reload()
            }
          })
        })
      })
    } else {
      // 无token
      bridgeReady().then(() => {
        callApi('user.login').then(data => {
          if (data && data.token) {
            auth.setUser(data)
            location.reload()
          }
        })
      })
    }
    return
  }

  // h5和web
  if (auth.isLoged()) {
    auth.refreshToken()
  } else {
    auth.gotoLogin()
  }
}

const serverCodeHandler = res => {
  const code = res && res.code
  switch (code) {
    case 10001:
      handle401()
      break;
    default:
      break;
  }
  return res
}

const BROSWER_ID = 'browserId'
function initBrowserId() {
  const info = new Browser()
  const id = `${info.browser}(${info.version}) ${info.os}(${info.osVersion})`

  window.localStorage.setItem(BROSWER_ID, id)

  return id
}

function initUuid() {
  const uuid = uuidv4()
  storage.setItem('uuid', uuid)
  return uuid
}

export function getClientData() {
  const deviceId = window.localStorage.getItem(BROSWER_ID) || initBrowserId()
  const uuid = storage.getItem('uuid') || initUuid()

  return JSON.stringify({
    deviceId,
    uuid,
    clientType: 0
  })
}

// 封禁相关数据
function getDeviceInfo(utcOffset) {
  let ret = {}
  try {
    ret = JSON.stringify({
      lang: navigator.language,
      timeZone: `GMT${utcOffset > 0 ? `+${utcOffset}` : utcOffset} ${MomentTimezone.tz.guess()}`
    })
  } catch (e) { }
  return ret
}

// 顶象风控fpt
function getFptInfo() {
  const deviceId = window.localStorage.getItem(BROSWER_ID) || initBrowserId()
  if (isInApp()) {
    return getFptApp(deviceId)
  }
  return getFptWeb(deviceId)
}

// 获取app内的顶像fpt
function getFptApp(deviceId) {
  const fpt = storage.getItem('G_AISECURIUS_APP_FPT') || ''
  // 32位之后是token
  const token = fpt ? fpt.slice(32) : ''
  if (token) {
    return `${encodePassword(deviceId + '|' + token)}${token}`
  }
  return ''
}

// 获取web的顶像fpt
function getFptWeb(deviceId) {
  const token = storage.getItem('G_AISECURIUS_TOKEN') || ''
  // 有token + 已登录的才上传
  if (token && auth.isLoged()) {
    return `${encodePassword(deviceId + '|' + token)}${token}`
  }
  return ''
}
