import { Drawer, Button } from '@xatom/iui';
import auth, { UnLoged } from '@xatom/auth'
import { useState } from 'react'
import $t from '@xatom/intl'
import LanguageDropdown from '../LanguageDropdown'
import CommonMenu from '../CommonMenu'

export default function (props) {
  const { leftMenus = [] } = props
  const [drawerVisible, setDrawerVisible] = useState(false)

  return <>
    <div className="iui-navbar-more" onClick={() => setDrawerVisible(true)}>
      <i className="iui-icon iui-icon-menus iui-navbar-more-icon"></i>
    </div>

    <Drawer className="iui-navbar-more-drawer" visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
      <UnLoged>
        <div className="iui-navbar-more-drawer-unloged">
          <Button className="iui-navbar-more-drawer-unloged-register" type="primary" size="large" block onClick={auth.gotoRegister}>{$t('Register')}</Button>
          <Button className="iui-navbar-more-drawer-unloged-login" size="large" block onClick={auth.gotoLogin}>{$t('Log In')}</Button>
        </div>
      </UnLoged>

      <CommonMenu menus={leftMenus} />
      <LanguageDropdown type="drawer" />
    </Drawer>
  </>
}
