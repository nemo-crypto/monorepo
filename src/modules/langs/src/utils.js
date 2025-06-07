import storage from '@xatom/utils/src/storage'
import { getAppConfig } from '@xatom/modules/config'

export function formatLang(lang) {
  // 将 umi 或者 useragent.navigator 的 lang  转变为  server 端需要的 lang
  switch (true) {
    case /(TW)/.test(lang):
      return 'zh_TW'
    case /(en)/.test(lang):
      return 'en_US'
    case /(ko)/.test(lang):
      return 'ko_KR'
    case /(tr)/.test(lang):
      return 'tr_TR'
    case /(ja)/.test(lang):
      return 'ja_JP'
    case /(pt)/.test(lang):
      return 'pt_BR'
    case /(de)/.test(lang):
      return 'de_DE'
    case /(ru)/.test(lang):
      return 'ru_RU'
    case /(es)/.test(lang):
      return 'es_ES'
    case /(fr)/.test(lang):
      return 'fr_FR'
    case /(fa)/.test(lang):
      return 'fa_IR'
    case /(it)/.test(lang):
      return 'it_IT'
    default:
      return 'en_US'
  }
}

// 根据前端语言标识获取对应后端语言标识
export function getServerLang() {
  const lang = getLang()
  return lang || 'en_US'
}

// 返回 server端 需要的 lang
export function getLang() {
  const lang = window.appConfig && window.appConfig.lang
  return formatLang(lang)
}

// 处理 server端 lang 的label
export function getLangs() {
  const defaultLangs = [
    {
      "id": "en_US",
      "name": "English - EN"
    },
    {
      "id": "ko_KR",
      "name": "한국어 - KO"
    },
    {
      "id": "de_DE",
      "name": "Deutsch - DE"
    },
    {
      "id": "ja_JP",
      "name": "日本語 - JA"
    },
    {
      "id": "fa_IR",
      "name": "پارسی - IR"
    },
    {
      "id": "fr_FR",
      "name": "Français - FR"
    },
    {
      "id": "it_IT",
      "name": "Italiano - IT"
    },
    {
      "id": "ru_RU",
      "name": "Русский - RU"
    },
    {
      "id": "es_ES",
      "name": "Español - ES"
    },
    {
      "id": "pt_BR",
      "name": "Português - BR"
    },
    {
      "id": "tr_TR",
      "name": "Türkçe - TR"
    },
    {
      "id": "zh_TW",
      "name": "繁體中文 - TW"
    }
  ]
  const langs = defaultLangs
  return langs.map(lang => {
    return {
      id: lang.id,
      name: lang.name.split(' - ')[0]
    }
  })
}

// 存储 server端 合适类型的lang
export function setLang(value) {
  const lang = formatLang(value)
  const site = window.appConfig && window.appConfig.siteId || 'MAIN'
  const langList = storage.getItem('langList') || {}
  langList[site] = lang
  if (window.appConfig) {
    window.appConfig.lang = lang
  }
  storage.setItem('langList', langList)
}

// 返回 trading view 需要的lang
// https://github.com/zlq4863947/tradingViewWikiCn/blob/master/book/Localization.md
// 根据trading view 需要的lang 自动对应 /libs/trendingview/${lang}-tv-chart.e2a841ff.html
export function getTradingViewLang() {
  const DEFAULT_LANG = 'en'
  const lang = getLang()
  const map = {
    en_US: 'en',
    ko_KR: 'ko',
    tr_TR: 'tr',
    ja_JP: 'ja',
    pt_BR: 'pt',
    de_DE: 'de',
    zh_TW: 'zh_TW',
    ru_RU: 'ru',
    es_ES: 'es',
    fr_FR: 'fr',
    fa_IR: 'fa',
    it_IT: 'it'
  }
  return map[lang] || DEFAULT_LANG
}

// 返回 umi-locale 所需的 locale
export function getUmiLocale(lang) {
  const DEFAULT_LANG = 'en-US'
  if (!lang) {
    lang = getLang()
  }
  const map = {
    en_US: 'en-US',
    ko_KR: 'ko-KR',
    tr_TR: 'tr-TR',
    ja_JP: 'ja-JP',
    pt_BR: 'pt-BR',
    de_DE: 'de-DE',
    zh_TW: 'zh-TW',
    ru_RU: 'ru-RU',
    es_ES: 'es-ES',
    fr_FR: 'fr-FR',
    fa_IR: 'fa-IR',
    it_IT: 'it-IT'
  }
  return map[lang] || DEFAULT_LANG
}

// zendesk支持的文档语言
export function getZendeskLang(lang) {
  const DEFAULT_LANG = 'en-us'
  if (!lang) {
    lang = getLang()
  }
  const map = getAppConfig('zendeskLangMap') || {
    en_US: 'en-us',
    ja_JP: 'ja',
    es_ES: 'es',
    ru_RU: 'ru',
    fr_FR: 'fr',
    de_DE: 'de',
    zh_TW: 'zh-tw'
  }
  return map[lang] || DEFAULT_LANG
}
// zendesk支持的客服语言
// https://support.zendesk.com/api/v2/locales/public.json
export function getZELang() {
  const DEFAULT_LANG = 'en'
  const lang = getLang()
  if (!lang) {
    lang = 'en_US'
  }
  const map = {
    en_US: 'en',
    ko_KR: 'ko',
    tr_TR: 'tr',
    ja_JP: 'ja',
    pt_BR: 'pt-br',
    de_DE: 'de',
    ru_RU: 'ru',
    es_ES: 'es-es',
    fr_FR: 'fr-fr',
    fa_IR: 'fa',
    zh_TW: 'zh-tw',
    it_IT: 'it'
  }
  return map[lang] || DEFAULT_LANG
}
// 设置/读取 当前app支持的语言
function getApp() {
  const pathname = window.location.pathname
  const arr = pathname.split('/') // 取一级目录为 app name
  const app = arr[1] || '/'
  return app
}
export function getValidLangs() {
  const app = getApp()
  const localValidLangs = storage.getItem(`${app}.validLangs`)
  return localValidLangs || []
}
export function setValidLangs(langMap) {
  const app = getApp()
  if (app && langMap) {
    storage.setItem(`${app}.validLangs`, langMap)
  }
}

export function isFaLang() {
  const lang = getLang()
  if (lang === 'ar_AE' || lang === 'fa_IR') {
    return true
  }
}

export default {
  formatLang,
  getLang,
  setLang,
  getTradingViewLang,
  getUmiLocale,
  getValidLangs,
  getZendeskLang,
  getZELang,
  isFaLang
}
