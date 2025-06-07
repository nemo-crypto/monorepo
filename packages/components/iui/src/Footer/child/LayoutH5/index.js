import { useState } from 'react'
import $t from '@xatom/intl'
import { getMode } from '@xatom/utils/src/themes'
import './index.less'

export default function (props) {
  const { links = [], followLinks = [], thirdparty = [], getLocalLink = () => {} } = props
  return <div className="iui-footer-h5">
    <div className="iui-footer-h5-wrap">
      <Links links={links} />
      <FollowUS followLinks={followLinks} thirdparty={thirdparty} getLocalLink={getLocalLink} />
      <Copyright />
    </div>
  </div>
}

function Links(props) {
  const { links = [] } = props
  const [linkActive, setLinkActive] = useState({})
  const toggleActive = index => {
    setLinkActive({ ...linkActive, [index]: !linkActive[index] })
  }

  return <div className="iui-footer-h5-links">
    {
      links.map((link, index) => <div key={index} onClick={() => toggleActive(index)} className={`iui-footer-h5-links-col ${linkActive[index] ? 'is-active' : ''}`}>
        <div className="iui-footer-h5-links-col-title">
          {link.title}
          <i className="iui-icon iui-icon-chevron-down iui-footer-h5-links-col-title-expand"></i>
        </div>
        <div className="iui-footer-h5-links-col-main">
          {
            link.data && link.data.map((item, index) => {
              const props = item.nofollow ? { rel: 'nofollow' } : {}
              if (item.subTitle) {
                return <div key={index} className="iui-footer-h5-links-col-item">
                  <div className="iui-footer-h5-links-col-item-label">{item.title}</div>
                  <a {...props} className="iui-footer-h5-links-col-item-value" target="_blank" href={item.href}>{item.subTitle}</a>
                </div>
              }
              return <div key={index} className="iui-footer-h5-links-col-item">
                <a {...props} className="iui-footer-h5-links-col-item-link" target="_blank" href={item.href}>{item.title}</a>
              </div>
            })
          }
        </div>
      </div>)
    }
  </div>
}

function FollowUS(props) {
  const { getLocalLink, followLinks = [], thirdparty = [] } = props
  const mode = getMode()
  return <div className="iui-footer-h5-follow">
    <div className="iui-footer-h5-follow-title">{$t('Follow Us')}</div>
    <div className="iui-footer-h5-follow-main">
      <div className="iui-footer-h5-follow-link">
        {
          followLinks.map((link, index) => {
            return <a
              key={index}
              className={`iui-footer-h5-follow-link-item iui-icon ${link.iconfont}`}
              target="_blank"
              rel="nofollow"
              href={getLocalLink(link)}
            ></a>
          })
        }
      </div>
      <div className="iui-footer-h5-follow-thirdparty">
        {
          thirdparty.map((item, index) => {
            return <a href={item.link} className="iui-footer-h5-follow-thirdparty-item" key={index} target="_blank" rel="nofollow">
              <img height="48px" src={item[`${mode}-url`]} />
            </a>
          })
        }
      </div>
    </div>
  </div>
}

function Copyright() {
  return <div className="iui-footer-h5-copyright">{$t('©{0} Test LLC. All rights reserved.', { 0: new Date().getFullYear() })}</div>
}