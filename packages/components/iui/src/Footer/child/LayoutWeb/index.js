import $t from '@xatom/intl'
import { getMode } from '@xatom/utils/src/themes'
import './index.less'

export default function (props) {
  const { links = [], followLinks = [], thirdparty = [], getLocalLink = () => { } } = props
  return <div className="iui-footer-web">
    <div className="iui-footer-web-wrap">
      <Links links={links} followLinks={followLinks} getLocalLink={getLocalLink} />
      <Foot thirdparty={thirdparty} />
    </div>
  </div>
}

function Links(props) {
  const { links = [], followLinks = [], getLocalLink } = props
  const contactLinks = links[links.length - 1] || {}
  const contactLinksData = contactLinks.data || []
  const otherLinks = links.slice(0, -1)

  return <div className="iui-footer-web-links">
    <div className="iui-footer-web-links-col">
      <div className="iui-footer-web-links-col-title">{$t('Follow Us')}</div>
      <div className="iui-footer-web-links-col-main">
        <div className="iui-footer-web-links-col-follow">
          {
            followLinks.map((link, index) => {
              return <a
                key={index}
                className={`iui-footer-web-links-col-follow-item iui-icon ${link.iconfont}`}
                target="_blank"
                rel="nofollow"
                href={getLocalLink(link)}
              ></a>
            })
          }
        </div>
        <div className="iui-footer-web-links-col-contact">
          {
            contactLinksData.map((item, index) => {
              return <div key={index} className="iui-footer-web-links-col-contact-item">
                <div className="iui-footer-web-links-col-contact-item-label">{item.title}</div>
                <a className="iui-footer-web-links-col-contact-item-value" target="_blank" rel="nofollow" href={item.href}>{item.subTitle}</a>
              </div>
            })
          }
        </div>
      </div>
    </div>

    {
      otherLinks.map((link, index) => <div key={index} className="iui-footer-web-links-col">
        <div className="iui-footer-web-links-col-title">{link.title}</div>
        <div className="iui-footer-web-links-col-main">
          {
            link.data && link.data.map((item, index) => {
              const props = item.nofollow ? { rel: 'nofollow' } : {}

              return <div key={index} className="iui-footer-web-links-col-item">
                <a {...props} className="iui-footer-web-links-col-item-link" target="_blank" href={item.href}>{item.title}</a>
              </div>
            })
          }
        </div>
      </div>)
    }
  </div>
}

function Foot(props) {
  const { thirdparty = [] } = props
  const mode = getMode()

  return <div className="iui-footer-web-foot">
    <div className="iui-footer-web-foot-copyright">{$t('©{0} Test LLC. All rights reserved.', { 0: new Date().getFullYear() })}</div>
    <div className="iui-footer-web-foot-thirdparty">
      {
        thirdparty.map((item, index) => {
          return <a href={item.link} className="iui-footer-web-foot-thirdparty-item" key={index} target="_blank" rel="nofollow">
            <img height="60px" src={item[`${mode}-url`]} />
          </a>
        })
      }
    </div>
  </div>
}