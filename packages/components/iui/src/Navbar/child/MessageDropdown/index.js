import { Dropdown } from '@xatom/iui';
import { Item } from '../CommonItem';
import { useState } from 'react'
import { toast } from '@xatom/antd'
import auth from '@xatom/auth'
import $t from '@xatom/intl'
import actions from '@xatom/modular/src/actions'
import * as hooks from '@xatom/modular/src/hooks'
import commonRenders from '@xatom/modular/src/renders'
import { getAppConfig } from '@xatom/modules/config'
import request from '@xatom/utils/src/http'
import routeActions from '@xatom/utils/src/routeActions'
import { isInApp } from '@xatom/utils/src/useragent'

const messageMenus = getAppConfig('navbar.messages') || []

export default function () {
  const messageList = messageMenus.map(menu => {
    const { messageList = {} } = hooks.useModel(`message${menu.type}`)
    messageList.type = menu.type
    messageList.title = menu.title
    messageList.link = menu.link
    messageList.iconfont = menu.iconfont
    return messageList
  })
  const user = auth.getUser() || {}
  const userId = user.userId
  messageList && messageList.map(message => {
    const firstItem = message && message.list && message.list[0]
    if (firstItem && !localStorage.getItem(`message${message.type}${userId}Time`)) {
      localStorage.setItem(`showmessage${message.type}${userId}`, '1')
    }
    if (firstItem && localStorage.getItem(`message${message.type}${userId}Time`)) {
      localStorage.setItem(`clearmessage${message.type}${userId}`, '0')
      if (Number(firstItem.createTime) > Number(localStorage.getItem(`message${message.type}${userId}Time`))) {
        setTimeout(() => {
          if (localStorage.getItem(`clearmessage${message.type}${userId}`) === '1') {
            localStorage.setItem(`showmessage${message.type}${userId}`, '0')
          } else {
            localStorage.setItem(`showmessage${message.type}${userId}`, '1')
          }
        }, 0)
      } else {
        localStorage.setItem(`showmessage${message.type}${userId}`, '0')
      }
    }
    if (!firstItem) {
      localStorage.setItem(`showmessage${message.type}${userId}`, '0')
    }
  })

  const [showHeaderIcon, setShowHeaderIcon] = useState(false)
  setTimeout(() => {
    const showFlag = messageMenus && messageMenus.map(message => {
      if ((localStorage.getItem(`showmessage${message.type}${userId}`)) === '1') {
        return '1'
      } else {
        return '0'
      }
    })
    setShowHeaderIcon(showFlag.find(item => item === '1'))
  }, 100)

  return <Dropdown overlay={<DropdownOverlay messageList={messageList} />}>
    <div className="iui-navbar-message">
      <div className="iui-navbar-message-trigger">
        <i className="iui-icon iui-icon-bell iui-navbar-message-trigger-icon"></i>
        {showHeaderIcon && <i className="iui-navbar-message-trigger-badge"></i>}
      </div>
    </div>
  </Dropdown>
}

const MessageItem = (props) => {
  const user = auth.getUser() || {}
  const userId = user.userId
  const { title, iconfont, type, item = {} } = props
  const toMessage = () => {
    localStorage.setItem(`showmessage${type}${userId}`, '0')
    localStorage.setItem(`message${type}${userId}Time`, item.createTime || '')
    routeActions.gotoHref(`/personal/message/${type}`)
  }
  const toDetail = e => {
    e.stopPropagation()
    window.open(item.linkUrl)
  }
  const DownNode = () => {
    return <div className="iui-navbar-message-overlay-text">
      <div className="iui-navbar-message-overlay-text-item">
        <span className="iui-navbar-message-overlay-text-item-title">{item.title}</span>
        {item.linkUrl && <span className="iui-navbar-message-overlay-text-item-detail" onClick={toDetail} target="_blank">{$t('View details')}</span>}
      </div>
      <div className="iui-navbar-message-overlay-text-item">{commonRenders['datetime'](item.createTime)}</div>
    </div>
  }
  const AfterNode = () => {
    if (localStorage.getItem(`showmessage${type}${userId}`) === '1') {
      return <i className="iui-navbar-message-overlay-badge"></i>
    }
    return null
  }
  return <Item title={title} iconfont={iconfont} onClick={toMessage} afterNode={<AfterNode />} downNode={<DownNode />} />
}

const EmptyMessageItem = (props) => {
  const { title, iconfont } = props
  const DownNode = () => {
    return <div className="iui-navbar-message-overlay-text">
      <div className="iui-navbar-message-overlay-text-item">{$t('No Record')}</div>
    </div>
  }
  return <Item title={title} iconfont={iconfont} downNode={<DownNode />} />
}

const DropdownOverlay = (props) => {
  const { messageList = [] } = props
  return <div className="iui-navbar-message-overlay">
    {
      messageList.map((message, messageIndex) => {
        if (message.list && message.list.length) {
          return <MessageItem key={messageIndex} {...message} item={message.list[0]} />
        }
        return <EmptyMessageItem key={messageIndex} {...message} />
      })
    }
  </div>
}

const initMessgae = () => {
  if (auth.isLoged()) {
    request('/activities/notify/allMessage', { method: 'get', }, 'config').then(res => {
      if (res && res.code === 200) {
        const data = res.data || {}
        messageMenus.map(menu => {
          actions.changeList({ id: `message${menu.type}`, messageList: data[`${menu.type}MessageVo`] })
        })
      } else {
        toast({ type: 'error', title: res.message })
      }
    })
  }
}

if (!isInApp()) {
  initMessgae()
}