import routeActions from '@xatom/utils/src/routeActions'
import { getLang, setLang, getUmiLocale, setValidLangs } from './utils'
import { setLocale } from 'umi/locale'
import { getAppConfig } from '@xatom/modules/config'
function setUmiLocale(langMap) {
  const lang1 = getLang() // 获取 storage 里面 的 lang
  const lang2 = routeActions.getQuery('lang') // url 里面的lang
  let lang = lang2 || lang1  // url 里的 lang 优先级更高
  lang = handleSimulatorLang(lang,langMap)
  const locale = getUmiLocale(lang)
  localStorage.setItem('umi_locale',locale)
  setLang(lang) // 将 url 里的 lang 更新到本地
  setLocale(locale) // 将 主站的 locale 同步给umi (如果不同，umi 会自己刷新)
}
window.setLocale = setLocale
export default function init() {
  const langMap = getAppConfig('langs.supportLangs') || ['zh_CN', 'en_US', 'ko_KR', 'ja_JP']
  // 读取url的 lang 参数，确保 lang 正确
  setUmiLocale(langMap)
  // 存储当前app的ValidLangs
  setValidLangs(langMap)
}
// 不同项目的多语言筛选
export function handleSimulatorLang(lang,langMap) {
  if(langMap.indexOf(lang) > -1){
    return lang
  }else{
    return 'en_US'
  }
}

