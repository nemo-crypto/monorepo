import { getAppConfig } from '@xatom/modules/config'
import { getLang, getZendeskLang } from '@xatom/langs'
import { useMediaQuery } from 'react-responsive'
import { isInApp } from '@xatom/utils/src/useragent'
import LayoutH5 from './child/LayoutH5'
import LayoutWeb from './child/LayoutWeb'
import LayoutPad from './child/LayoutPad'

export default function () {
  const lang = getLang()
  const footer = getAppConfig('footer') || {}
  let { links = [], followLinks = [], thirdparty = [] } = footer
  const isApp = isInApp()
  const isH5 = useMediaQuery({ maxWidth: 767 })
  const isPad = useMediaQuery({ maxWidth: 1023 })

  // Zendesk language check.
  const target = getZendeskLang(lang) || 'en-us'
  for (let i = 0; i < links.length; i++) {
    let data = links[i].data
    if (data) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].isintl) {
          data[j].href = data[j].href.replace('/en-us', '/' + target)
        }
      }
    }
  }

  // 根据showInLang和notShowInlang过滤Follow Us链接链接
  followLinks = followLinks.filter(link => {
    if ((link.showInLang && link.showInLang !== lang) || (link.notShowInlang && link.notShowInlang === lang)) {
      return false
    }
    return true
  })

  // 根据语言获取Follow Us链接
  const getLocalLink = item => {
    if (item.locales) return item.locales[lang] || item.href
    return item.href
  }

  const payload = {
    links,
    followLinks,
    thirdparty,
    getLocalLink
  }

  if (isApp) {
    return null
  } else if (isH5) {
    return <LayoutH5 {...payload} />
  } else if (isPad) {
    return <LayoutPad {...payload} />
  } else {
    return <LayoutWeb {...payload} />
  }
}
