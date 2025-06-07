import auth, { Loged, UnLoged } from '@xatom/auth'
import { bridgeReady, callApi } from '@xatom/bridge'
import $t from '@xatom/intl'
import { Button } from '@xatom/iui'
import actions from '@xatom/modular/src/actions'
import * as hooks from '@xatom/modular/src/hooks'
import { getAppConfig } from '@xatom/modules/config'
import { TransferLayer } from '@xatom/transfer'
import { disallowIframe } from '@xatom/utils/src/iframe'
import { getHooksMode } from '@xatom/utils/src/themes'
import { isInApp } from '@xatom/utils/src/useragent'
import { useMediaQuery } from 'react-responsive'
import EditNickNameLayer from '../EditNickNameLayer'
import AssetsDropdown from './child/AssetsDropdown'
import CommonDropdown from './child/CommonDropdown'
import DownloadDropdown from './child/DownloadDropdown'
import LanguageDropdown from './child/LanguageDropdown'
import MessageDropdown from './child/MessageDropdown'
import MoreDrawer from './child/MoreDrawer'
import OrdersDropdown from './child/OrdersDropdown'
import UserDropdown from './child/UserDropdown'
import initWhiteList from './initWhiteList'


// 防止iframe非法嵌入
disallowIframe()

// 每次更新user信息
if (auth.isLoged() && !isInApp()) {
  auth.refreshUser()
}

// 白名单控制
initWhiteList()

export default function (props) {
  const mode = getHooksMode()
  const isApp = isInApp()
  const isH5 = useMediaQuery({ maxWidth: 767 })
  const isPad = useMediaQuery({ maxWidth: 1023 })
  let leftMenus = getAppConfig('navbar.leftMenus', [])
  let navbarWallet = getAppConfig('navbar.wallet', {})
  let navbarOrders = getAppConfig('navbar.orders', {})

  const { p2pWhite } = hooks.useModel('G_WHITELIST_CONTROL', 'items') || {}
  const showMenuItem = item => {
    if (item.isP2P && p2pWhite !== undefined) return p2pWhite
    return true
  }
  leftMenus = leftMenus.filter(child => {
    // 一级菜单
    if (!showMenuItem(child)) return false
    // 二级菜单
    if (child.children) {
      child.children = child.children.filter(item => {
        if (!showMenuItem(item)) return false
        return true
      })
    }
    return true
  })
  navbarWallet.children = (navbarWallet.children || []).map(child => {
    return child.filter(item => {
      if (!showMenuItem(item)) return false
      return true
    })
  })
  navbarOrders.children = (navbarOrders.children || []).map(child => {
    return child.filter(item => {
      if (!showMenuItem(item)) return false
      return true
    })
  })

  const payload = { mode, navbarWallet, navbarOrders, leftMenus, ...props }

  if (isApp) {
    return <LayoutApp {...payload} />
  } else if (isH5) {
    return <WithTransfer><LayoutH5 {...payload} /></WithTransfer>
  } else if (isPad) {
    return <WithTransfer><LayoutPad {...payload} /></WithTransfer>
  } else {
    return <WithTransfer><LayoutWeb {...payload} /></WithTransfer>
  }
}

function WithTransfer(props) {
  return <>
    {props.children}
    <TransferLayer />
    <EditNickNameLayer />
  </>
}

function LayoutApp(props) {
  const { title = '' } = props
  const statusBarHeight = actions.getQuery('statusBarHeight') || 20
  const toBack = () => {
    bridgeReady().then(() => {
      callApi('navigator.closeWebApp')
    })
  }
  return <div className="iui-navbar-app" style={{ paddingTop: `${statusBarHeight}px` }}>
    <i onClick={toBack} className="iui-icon iui-icon-chevron-left iui-navbar-app-back"></i>
    <div className="iui-navbar-app-title">{title}</div>
  </div>
}

function LayoutH5(props) {
  const { isTransparent, mode, navbarWallet, navbarOrders, leftMenus } = props

  return <div className={`iui-navbar-h5 iui-navbar-layout ${isTransparent ? 'is-transparent' : ''}`}>
    {/* left */}
    <div className="iui-navbar-layout-col iui-navbar-layout-left">
      <a className="iui-navbar-layout-logo" href="/">
        <img width={85} className="iui-navbar-layout-logo-image" src={`https://cdn.test.mobi/common/logo/${mode}.png`} />
      </a>
    </div>

    {/* right */}
    <div className="iui-navbar-layout-col">
      <UnLoged>
        <div className="iui-navbar-layout-col-item">
          <Button className="iui-navbar-layout-login" onClick={auth.gotoLogin}>{$t('Log In')}</Button>
        </div>
        <div className="iui-navbar-layout-col-item">
          <div className="iui-navbar-layout-register">
            <Button type="primary" onClick={auth.gotoRegister}>{$t('Register')}</Button>
          </div>
        </div>
      </UnLoged>
      <Loged>
        <div className="iui-navbar-layout-col-item">
          <UserDropdown type="drawer" navbarWallet={navbarWallet} navbarOrders={navbarOrders} />
        </div>
      </Loged>
      <div className="iui-navbar-layout-col-item">
        <MoreDrawer leftMenus={leftMenus} />
      </div>
    </div>
  </div>
}

function LayoutPad(props) {
  const { isTransparent, mode, navbarWallet, navbarOrders, leftMenus } = props

  return <div className={`iui-navbar-pad iui-navbar-layout ${isTransparent ? 'is-transparent' : ''}`}>
    {/* left */}
    <div className="iui-navbar-layout-col iui-navbar-layout-left">
      <a className="iui-navbar-layout-logo" href="/">
        <img width={85} className="iui-navbar-layout-logo-image" src={`https://cdn.test.mobi/common/logo/${mode}.png`} />
      </a>

      {
        leftMenus.map((menu, index) => {
          return <div key={index} className="iui-navbar-layout-col-item">
            <CommonDropdown {...menu} />
          </div>
        })
      }
    </div>

    {/* right */}
    <div className="iui-navbar-layout-col">
      <UnLoged>
        <div className="iui-navbar-layout-col-item">
          <Button className="iui-navbar-layout-login" onClick={auth.gotoLogin}>{$t('Log In')}</Button>
        </div>
        <div className="iui-navbar-layout-col-item">
          <div className="iui-navbar-layout-register">
            <Button type="primary" onClick={auth.gotoRegister}>{$t('Register')}</Button>
          </div>
        </div>
      </UnLoged>

      <Loged>
        <div className="iui-navbar-layout-col-item">
          <UserDropdown type="drawer" navbarWallet={navbarWallet} navbarOrders={navbarOrders} />
        </div>
      </Loged>

      <div className="iui-navbar-layout-col-item">
        <DownloadDropdown />
      </div>
      <div className="iui-navbar-layout-col-item">
        <MoreDrawer leftMenus={leftMenus} />
      </div>
    </div>
  </div>
}

function LayoutWeb(props) {
  const { isTransparent, mode, navbarWallet, navbarOrders, leftMenus } = props

  return <div className={`iui-navbar-web iui-navbar-layout ${isTransparent ? 'is-transparent' : ''}`}>
    {/* left */}
    <div className="iui-navbar-layout-col iui-navbar-layout-left">
      <a className="iui-navbar-layout-logo" href="/">
        <img width={85} className="iui-navbar-layout-logo-image" src={`https://cdn.test.mobi/common/logo/${mode}.png`} />
      </a>

      {
        leftMenus.map((menu, index) => {
          return <div key={index} className="iui-navbar-layout-col-item">
            <CommonDropdown {...menu} />
          </div>
        })
      }
    </div>

    {/* right */}
    <div className="iui-navbar-layout-col">
      <UnLoged>
        <div className="iui-navbar-layout-col-item">
          <Button className="iui-navbar-layout-login" onClick={auth.gotoLogin}>{$t('Log In')}</Button>
        </div>
        <div className="iui-navbar-layout-col-item">
          <div className="iui-navbar-layout-register">
            <Button type="primary" onClick={auth.gotoRegister}>{$t('Register')}</Button>
          </div>
        </div>
      </UnLoged>

      <Loged>
        <div className="iui-navbar-layout-col-item">
          <AssetsDropdown {...navbarWallet} />
        </div>
        <div className="iui-navbar-layout-col-item">
          <OrdersDropdown {...navbarOrders} />
        </div>
        <div className="iui-navbar-layout-col-item">
          <UserDropdown type="dropdown" navbarWallet={navbarWallet} navbarOrders={navbarOrders} />
        </div>
        <div className="iui-navbar-layout-col-item">
          <MessageDropdown />
        </div>
      </Loged>
      <div className="iui-navbar-layout-col-item">
        <LanguageDropdown />
      </div>
      <div className="iui-navbar-layout-col-item">
        <DownloadDropdown />
      </div>
    </div>
  </div>
}