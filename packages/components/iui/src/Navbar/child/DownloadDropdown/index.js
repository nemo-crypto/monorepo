import QRCode from 'qrcode.react';
import { Dropdown } from '@xatom/iui';
import $t from '@xatom/intl'
import { getAppConfig } from '@xatom/modules/config'
import auth from '@xatom/auth'
import request from '@xatom/utils/src/http'
import { toast } from '@xatom/antd'

export default function () {
  return <Dropdown overlay={<DropdownOverlay />}>
    <div className="iui-navbar-download">
      <i className="iui-icon iui-icon-download iui-navbar-download-icon"></i>
    </div>
  </Dropdown>
}

const DropdownOverlay = () => {
  const mobileUrls = getAppConfig('appDownloadUrls', {})
  const urls = {
    qrcode: window.location.origin + '/download' + '?' + Math.ceil(new Date().valueOf() / 60 / 3 / 1000), // // 增加时间戳，避免缓存问题
    ...mobileUrls
  }

  function downloadAndroid() {
    const url = auth.isLoged() ? '/content/user/checkVersion' : '/content/public/checkVersion'
    const options = {
      method: 'get',
      params: {
        versionName: '0.0.0',
        type: 'android'
      }
    }
    request(url, options).then(res => {
      if (res) {
        if (res.code === 200) {
          toast({ type: 'success', title: $t('Start download') })
          window.location.href = res.data.downUrl
        } else {
          toast({ type: 'error', title: res.message })
        }
      }
    })
  }

  function downloadiOSOrGoogle(url) {
    if (url) {
      window.open(url)
    } else {
      toast({ type: 'warn', title: $t('Coming soon') })
    }
  }

  return <div className="iui-navbar-download-overlay">
    <QRCode className="iui-navbar-download-overlay-qrcode" value={urls.qrcode} size={136} />
    <div className="iui-navbar-download-overlay-title">{$t('iOS & Android')}</div>
    <div className="iui-navbar-download-overlay-platform">
      <div onClick={() => downloadiOSOrGoogle(urls.appStore)} className="iui-navbar-download-overlay-platform-item">
        <i className="iui-navbar-download-overlay-platform-item-icon iui-icon iui-icon-ios"></i>
      </div>
      <div onClick={downloadAndroid} className="iui-navbar-download-overlay-platform-item">
        <i className="iui-navbar-download-overlay-platform-item-icon iui-icon iui-icon-android"></i>
      </div>
      <div onClick={() => downloadiOSOrGoogle(urls.googlePlay)} className="iui-navbar-download-overlay-platform-item">
        <i className="iui-navbar-download-overlay-platform-item-icon iui-icon iui-icon-google-play"></i>
      </div>
    </div>
  </div>
}