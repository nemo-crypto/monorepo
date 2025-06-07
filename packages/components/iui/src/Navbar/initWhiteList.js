import auth from '@xatom/auth'
import request from '@xatom/utils/src/http'
import { getHost } from '@xatom/utils/src/env'
import actions from '@xatom/modular/src/actions'
import { getUmiLocale, setLang, getLang } from '@xatom/langs'
import storage from '@xatom/utils/src/storage'
import { setLocale } from '@xatom/intl'
import { isInApp } from '@xatom/utils/src/useragent';

// 初始化韩国白名单、ip、法币
export default async function () {
  // 韩国白名单默认值：p2p、kyc、韩语、外汇
  let koreaIP = false
  let p2pWhite = false
  let kycWhite = false
  let koreanWhite = false

  // 初始化韩国ip、韩国白名单

  async function initVasp() {
    const res = await request(getHost('config') + '/activities/public/getvaspinfo', { method: 'get' })
    if (res && res.code === 200) {
      const data = res.data || {}
      // 开关
      const isVaspWhite = data.vaspSwitch === 1
      // 是否韩国IP
      koreaIP = data.lang === 'ko_KR'
      if (koreaIP) {
        if (auth.isLoged()) {
          // 韩国ip已登录走user配置
          const user = auth.getUser() || {}
          const userAct = user.userAct || {}
          p2pWhite = userAct.p2p === 1
          kycWhite = userAct.kycWhite === 1
          koreanWhite = userAct.ko_KR === 1
        } else {
          // 韩国ip未登录走vasp开关
          p2pWhite = isVaspWhite
          kycWhite = isVaspWhite
          koreanWhite = isVaspWhite
        }
      } else {
        // 非韩国ip默认状态
        p2pWhite = true
        kycWhite = true
        koreanWhite = auth.isLoged()
      }
    }
    // 已选择韩语 + 开关关闭，默认为英语（app内不受控制，以app为准）
    if (getLang() === 'ko_KR' && !koreanWhite && !isInApp()) {
      setLang('en_US')
      setLocale(getUmiLocale('en_US'))
    }
    actions.changeItem({ id: 'G_WHITELIST_CONTROL', items: { koreaIP, p2pWhite, kycWhite, koreanWhite } })
  }

  // 法币列表（依赖韩国白名单）
  async function initCurrency() {
    const res = await request(getHost('config') + '/market/v2/currency-rates', { method: 'get' })
    if (res && res.code === 200) {
      let data = res.data || []
      // 根据开关过滤法币列表
      data = koreanWhite ? data : data.filter(item => item.name !== 'KRW')
      actions.changeItem({ id: 'CURRENCY_RATES_LIST', items: data })
      // 已选择韩元 + 开关关闭，默认为USD
      const currentCurrency = storage.getItem('CURRENCY_RATES_CURRENT')
      if (currentCurrency === 'KRW' && !koreanWhite) {
        actions.changeItem({ id: 'CURRENCY_RATES_CURRENT', value: 'USD' })
        storage.setItem('CURRENCY_RATES_CURRENT', 'USD')
      }
    }
  }

  await initVasp()
  await initCurrency()
}
