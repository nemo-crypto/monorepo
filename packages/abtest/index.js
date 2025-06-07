import { sessionStore } from '@xatom/utils/src/storage'
import request from '@xatom/utils/src/http'
import { getHost } from '@xatom/utils/src/env'
import { isLoged } from '@xatom/auth/utils'

/**
 * 初始化abtest
 * 获取abtest策略
 * 存储到storage中
 */
export async function initAbtest() {
  const path = isLoged() ? '/content/user/abtest/check-strategy' : '/content/public/abtest/check-strategy'
  const res = await request(getHost('config') + path, { method: 'get' })
  if (res && res.code === 200) {
    const { data = {} } = res || {}
    sessionStore.setItem('G_ABTEST_STRATEGY', data)
  }
}

/**
 * 获取abtest策略
 * @param {string} key 策略key
 * @param {boolean} defaultValue 默认值
 * @returns {boolean} 策略值
 */
export function getAbtest(key, defaultValue = false) {
  const data = sessionStore.getItem('G_ABTEST_STRATEGY') || {}
  return data[key] || defaultValue
}
