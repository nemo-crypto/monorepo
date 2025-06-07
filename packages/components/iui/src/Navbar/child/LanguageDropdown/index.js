import { useState } from 'react'
import { getLang, getLangs, setLang, getUmiLocale, getValidLangs, apis } from '@xatom/langs'
import { setLocale } from '@xatom/intl'
import $t from '@xatom/intl'
import auth from '@xatom/auth'
import storage from '@xatom/utils/src/storage'
import actions from '@xatom/modular/src/actions'
import * as hooks from '@xatom/modular/src/hooks'
import { Dropdown, Drawer } from '@xatom/iui';

export default function (props) {
  const { type } = props

  // 浮窗控制
  const [visibleOverlay, setVisibleOverlay] = useState(false)
  const onVisibleChange = visible => {
    setVisibleOverlay(visible)
  }

  // 当前语言
  const lang = getLang()
  const validLangs = getValidLangs() || []
  let langList = (getLangs() || []).filter(item => validLangs.includes(item.id))

  // 语言白名单处理
  const { koreanWhite } = hooks.useModel('G_WHITELIST_CONTROL', 'items') || {}
  langList = langList.filter(item => {
    return item.id === 'ko_KR' ? koreanWhite : true
  })
  
  const getLocalLang = () => {
    const langList = storage.getItem('langList') || {}
    return langList['MAIN']
  }

  const onChangeLang = v => {
    // 多页面时，点击其他页面已选择过的语言直接刷新
    if (v === getLocalLang()) {
      return window.location.reload()
    }
    
    setLang(v)
    // 已登录用户修改服务端lang
    if (auth.isLoged()) {
      apis.changeLanguage({ query: { lang: v } }).then(res => {
        if (res && res.code === 200) {
          setLocale(getUmiLocale(v))
        }
      })
    } else {
      setLocale(getUmiLocale(v))
    }
  }

  // 当前法币
  const currencyRatesList = hooks.useModel('CURRENCY_RATES_LIST', 'items') || []
  const defaultCurrencyName = hooks.useModel('CURRENCY_RATES_CURRENT', 'value') || storage.getItem('CURRENCY_RATES_CURRENT') || 'USD'
  const onChangeCurrency = v => {
    // storage存储用于和tapbit-main项目同步默认法币
    storage.setItem('CURRENCY_RATES_CURRENT', v)
    actions.changeItem({ id: 'CURRENCY_RATES_CURRENT', value: v })
    setVisibleOverlay(false)
  }

  const payload = { visibleOverlay, onVisibleChange, langList, lang, currencyRatesList, defaultCurrencyName, onChangeLang, onChangeCurrency }
  return type === 'drawer' ? <DrawerLanguage {...payload} /> : <DropdownLanguage {...payload} />
}

function DrawerLanguage(props) {
  const { visibleOverlay, onVisibleChange, langList, lang, defaultCurrencyName, currencyRatesList } = props
  const langItem = langList.find((item) => item.id === lang) || {}
  const currentCurrency = currencyRatesList.find(item => item.name === defaultCurrencyName) || {}
  return <div className="iui-navbar-language-menu">
    <div onClick={() => onVisibleChange(true)} className="iui-navbar-language-menu-item">{langItem.name || '--'}</div>
    <div onClick={() => onVisibleChange(true)} className="iui-navbar-language-menu-item">{currentCurrency.name || '--'}</div>

    <Drawer className="iui-navbar-language-drawer" placement="right" visible={visibleOverlay} onClose={() => onVisibleChange(false)}>
      <LanguageOverlay type="drawer" {...props} />
    </Drawer>
  </div>
}

function DropdownLanguage(props) {
  const { visibleOverlay, onVisibleChange } = props
  return <Dropdown
    visible={visibleOverlay}
    onVisibleChange={onVisibleChange}
    overlay={<LanguageOverlay type="dropdown" {...props} />}>
    <div className="iui-navbar-language-dropdown">
      <i className="iui-icon iui-icon-globe iui-navbar-language-dropdown-icon"></i>
    </div>
  </Dropdown>
}

function LanguageOverlay(props) {
  const { type, langList, lang, currencyRatesList, defaultCurrencyName, onChangeLang, onChangeCurrency } = props
  return <div className={`iui-navbar-language-overlay iui-navbar-language-overlay--${type}`}>
    <div className="iui-navbar-language-overlay-col">
      <div className="iui-navbar-language-overlay-title">{$t('Language')}</div>
      <div className="iui-navbar-language-overlay-box iui-scrollbar-default">
        {
          langList.map((item, index) => {
            return <div key={index} onClick={() => onChangeLang(item.id)} className={`iui-navbar-language-overlay-item ${item.id === lang ? 'is-active' : ''}`}>{item.name}</div>
          })
        }
      </div>
    </div>
    <div className="iui-navbar-language-overlay-col">
      <div className="iui-navbar-language-overlay-title">{$t('Currency')}</div>
      <div className="iui-navbar-language-overlay-box iui-scrollbar-default">
        {
          currencyRatesList.map((item, index) => {
            return <div key={index} onClick={() => onChangeCurrency(item.name)} className={`iui-navbar-language-overlay-item ${item.name === defaultCurrencyName ? 'is-active' : ''}`}>{item.name} - {item.symbol}</div>
          })
        }
      </div>
    </div>
  </div>
}
