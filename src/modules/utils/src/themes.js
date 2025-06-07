import * as hooks from '@xatom/modular/src/hooks'
import { getAppConfig } from '@xatom/modules/config'
import routeActions from '@xatom/utils/src/routeActions'

export function getTheme() {
  const className = document.body?.className || ''
  const theme = className.match(/theme-([^\s]+)/) || []
  return theme && theme[1] || getAppConfig('themeId')
}

export function setTheme(theme, ifFrefresh = false) {
  let className = document.body?.className || ''
  if (className === '') {
    document.body.className = `theme-${theme}`
  } else {
    let arr = className.split(" ");
    let newArray = arr.filter(function (name) {
      return name.indexOf('theme-') === -1;
    });
    newArray.push(`theme-${theme}`)
    document.body.className = newArray.join(' ')
  }

  if (ifFrefresh) {
    routeActions.refresh()
  }
}

export function getMode(theme) {
  let themeName = theme || getTheme()
  if (themeName && themeName.indexOf('dark') > -1) {
    return 'dark'
  } else {
    return 'light'
  }
}

export function getHooksMode() {
  const { theme = '' } = hooks.useModel('layoutTheme') || {}
  return getMode(theme)
}

export function initTheme(themeId) {
  // 在 PageInit 中 更安全（ document.body 已经生成）
  const theme = themeId || getTheme()

  setTheme(theme, false)
}

export function getKlineTheme(targetThemeId) {
  // 没有传入指定的themeId 的时候，使用当前的themeId
  const currentThemeId = getTheme()
  const themeId = targetThemeId || currentThemeId
  const themes = getAppConfig('themes') || {}
  const theme = themes[themeId] || {}
  const themeMode = getMode()
  return {
    type: themeMode,
    tradingview: {
      toolbarBg: theme['bg-card'],
      background: theme['bg-card'],
      vertGrid: theme['bg-card'],
      horzGrid: theme['bg-card'],
      up: theme['brand-up'],
      down: theme['brand-down'],
      ma: ['#9A9A9A', '#FF9903', '#FF00FF', '#33ae72'],
      ...(theme.kline ? theme.kline : {}),
    }
  }
}

export function setKlineTheme(themeId) {
  const themeCofnig = getKlineTheme(themeId)
  window.TradingView && window.TradingView.instance && window.TradingView.instance.changeTvTheme && window.TradingView.instance.changeTvTheme(themeCofnig)
}
