import { toast } from '@xatom/antd/Notify';
import auth from '@xatom/auth';
import $t from '@xatom/intl';
import { Drawer, Dropdown, Tooltip } from '@xatom/iui';
import actions from '@xatom/modular/src/actions';
import routeActions from '@xatom/utils/src/routeActions';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { AssetsControl } from '../AssetsDropdown';
import { Item, ItemGroup } from '../CommonItem';
import CommonMenu from '../CommonMenu';

const userMenus = [
  { iconfont: 'iui-icon-shield', title: $t('Security Center'), link: { href: "/personal/security" } },
  { iconfont: 'iui-icon-passport', title: $t('ID Verification'), link: { href: "/personal/settings/profile" }, afterNode: getKycText() },
  { iconfont: 'iui-icon-users-plus', title: $t('Invite Friends'), link: { href: "/activity/invite" } },
  { iconfont: 'iui-icon-coupon', title: $t('Coupon Center'), link: { href: "/m/#/mobile/coupon" } },
  { iconfont: 'iui-icon-fees', title: $t('Trading Fees & VOL'), link: { href: "/m/#/fees" } },
  { iconfont: 'iui-icon-api', title: $t('API Management'), link: { href: "/personal/settings/my-api" } },
]

const logoutMenus = [
  { iconfont: "iui-icon-logout", title: $t('Log out'), link: { onClick: () => auth.logout('/') } }
]

function copyValue(value) {
  copy(value || '')
  toast({ type: 'success', title: $t('Success') })
}

function getKycText() {
  const user = auth.getUser() || {}
  const status = user.kycStatus
  switch (status) {
    case -1:
      return <div className="iui-navbar-user-status is-unverified">{$t('Unverified')}</div>
    case 1:
    case 10:
      return <div className="iui-navbar-user-status is-pending">{$t('Pending')}</div>
    case 9:
      return <div className="iui-navbar-user-status is-failed">{$t('Failed')}</div>
    case 2:
      return <div className="iui-navbar-user-status is-verified">{$t('Verified')}</div>
    default:
      return <div className="iui-navbar-user-status is-unverified">{$t('Unverified')}</div>
  }
}

function DropdownUser() {
  return <Dropdown overlay={<DropdownUserOverlay />} placement="bottomRight">
    <div className="iui-navbar-user">
      <img className="iui-navbar-user-trigger" width={24} height={24} src={require('./images/avatar.png')} />
    </div>
  </Dropdown>
}

function DrawerUser(props) {
  const { navbarWallet, navbarOrders } = props
  // 扁平化二维数字
  const formattingArray = arr => {
    return arr?.length > 0 ? arr.reduce((prev, next) => prev.concat(next)) : []
  }
  const profileData = [
    {
      title: $t('Profile'),
      children: userMenus
    }
  ]
  const assetsData = [
    {
      ...navbarWallet,
      // 过滤充提转
      children: formattingArray(navbarWallet.children.slice(0, -1))
    },
    {
      ...navbarOrders,
      children: formattingArray(navbarOrders.children)
    }
  ]
  const [visibleOverlay, setVisibleOverlay] = useState(false)
  const onVisibleChange = visible => {
    setVisibleOverlay(visible)
  }
  return <>
    <div onClick={() => setVisibleOverlay(true)} className="iui-navbar-user">
      <img className="iui-navbar-user-trigger" width={24} height={24} src={require('./images/avatar.png')} />
    </div>

    <Drawer className="iui-navbar-user-drawer" placement="right" visible={visibleOverlay} onClose={() => setVisibleOverlay(false)}>
      <User type="drawer" onVisibleChange={onVisibleChange} />
      <AssetsControl type="drawer" onVisibleChange={onVisibleChange} />
      <CommonMenu menus={profileData} />
      <CommonMenu menus={assetsData} />
      <CommonMenu menus={logoutMenus} />
    </Drawer>
  </>
}

function DropdownUserOverlay() {
  return <div className="iui-navbar-user-overlay">
    <User />
    <ItemGroup>
      {
        userMenus.map((item, index) => {
          return <Item key={index} {...item} />
        })
      }
    </ItemGroup>
    <ItemGroup>
      {
        logoutMenus.map((item, index) => {
          return <Item key={index} {...item} />
        })
      }
    </ItemGroup>
  </div>
}

function User(props) {
  const { type = 'dropdown', onVisibleChange = () => { } } = props
  const user = auth.getUser() || {}
  const { displayUserId, vipTag, currentNickName, newNickName, nickNameStatus, isDefaultNickName } = user
  const gotoLevel = (e) => {
    e.stopPropagation()
    routeActions.gotoHref('/activity/vip')
  }
  const editNickName = () => {
    if (nickNameStatus === 0) {
      toast({ type: 'error', title: $t('Your submitted nickname is under review. Please wait for the results.') })
    } else {
      if (!isDefaultNickName) {
        actions.changeForm({ id: 'editNickName', values: { name: currentNickName } })
      }
      onVisibleChange(false)
      actions.showLayer({id: 'editNickNameLayer', user: user})
    }
  }

  return <div className={`iui-navbar-user-overlay-user iui-navbar-user-overlay-user--${type}`}>
    <div className="iui-navbar-user-overlay-user-account">
      <div className="iui-navbar-user-overlay-user-account-label">{$t('Hi')}, {currentNickName}</div>
    </div>
    <div className="iui-navbar-user-overlay-user-uid">
      <div className="iui-navbar-user-overlay-user-uid-label">UID: {displayUserId || ''}</div>
      <i className="iui-navbar-user-overlay-user-uid-copy iui-icon iui-icon-copy" onClick={() => copyValue(displayUserId)}></i>
      <img onClick={gotoLevel} className="iui-navbar-user-overlay-user-uid-vip" src={`${vipTag ? 'https://cdn.test.mobi/monorepo/vip-tag.png' : 'https://cdn.test.mobi/monorepo/vip.png'}`} alt="" />
    </div>
    <div className="iui-navbar-user-overlay-user-name">
      <div className="iui-navbar-user-overlay-user-name-label">{$t('Nickname')}: {nickNameStatus === 0 ? newNickName : currentNickName || ''}</div>
      <i className="iui-navbar-user-overlay-user-name-edit iui-icon iui-icon-edit" onClick={() => editNickName()}></i>
      {/* nickNameStatus 昵称状态 -1无审核,0审核中,1已通过,2已拒绝*/}
      {nickNameStatus === 0 && <Tooltip 
        placement="bottomRight" 
        overlayStyle={{width: '210px'}}
        title={<div className="fs12 iui-navbar-user-overlay-user-name-tooltip">{$t('Your nickname modification “{0}” is currently under review.', { 0: newNickName })}</div>}
      >
        <div className="iui-navbar-user-overlay-user-name-tag name-tag-warn">{$t('Review')}</div>
      </Tooltip>}
      {nickNameStatus === 2 && <Tooltip 
        placement="bottomRight" 
        overlayStyle={{width: '210px'}}
        title={<div className="fs12 navbar-user-overlay-user-name-tooltip">{$t('Your attempt to change the nickname "{0}" has failed because it contains sensitive words.', { 0: newNickName })}</div>}
      >
        <div className="iui-navbar-user-overlay-user-name-tag name-tag-error">{$t('Failed')}</div>
      </Tooltip>}
    </div>
  </div>
}

export default function (props) {
  const { type } = props
  return type === 'drawer' ? <DrawerUser {...props} /> : <DropdownUser />
}