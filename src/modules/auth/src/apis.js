import { getHost, isLocal } from '@xatom/utils/src/env'
import request from '@xatom/utils/src/http'
import * as auth from './utils'

export const refreshToken = (payload={}) => {
  // 如果pending,就不是首次，拦截不发生refresh
  if (window.refresh_status === 'pending') {
    return null
  } else {
    // 首次请求发送refresh，并设置pending，以拦截后续的refresh
    window.refresh_status = 'pending'
  }
  const url = getHost('config') + '/user/refresh_token'
  const options = {
    method: 'post',
    requestType: 'jsonstring',
    responseType: 'jsonstring'
  }
  return request(url, options).then(res => {
    if (res && res.code === 200) {
      auth.setUser(res.data)
      // 如果请求成功，就标记成功
      payload && payload.onSuccess && payload.onSuccess()
      window.refresh_status = 'success'
    } else if (res && res.code === 10001) {
      if (!isLocal()) { }// 本地 local 开发环境的时候，不跳转去登录，
      auth.tokenInvalidHandle()
      payload && payload.onError && payload.onError()
    } else {
      window.refresh_status = 'success'
    }
  })
}
export function refreshUser() {
  const url = getHost('config') + '/user/userInfo'
  const options = {
    method: 'get',
  }
  return request(url, options).then(res => {
    if (res && res.code === 200) {
      auth.setUser(res.data)
    } 
  })
}

export function getkyc(userKyc) {
  const url = getHost('config') + '/kyc/getkyc'
  const options = {
    method: 'get',
  }
  request(url, options).then(res => {
    if (res && res.code === 200) {
      auth.setUser({kycStatus: res.data.status || -1})
    } 
  })
}





