import $t from '@xatom/intl'
import { getMode } from '@xatom/utils/src/themes'
import './index.less'

export default function (props) {
  const { links = [], followLinks = [], thirdparty = [], getLocalLink = () => { } } = props
  return <div className="iui-footer-pad">
    <div className="iui-footer-pad-wrap">
      <Links links={links} />
      <FollowUS links={links} followLinks={followLinks} getLocalLink={getLocalLink} />
      <Foot thirdparty={thirdparty} />
    </div>
  </div>
}

function Links(props) {
  const { links = [] } = props
  const otherLinks = links.slice(0, -1)

  return <div className="iui-footer-pad-links">
    {
      otherLinks.map((link, index) => <div key={index} className="iui-footer-pad-links-col">
        <div className="iui-footer-pad-links-col-title">{link.title}</div>
        <div className="iui-footer-pad-links-col-main">
          {
            link.data && link.data.map((item, index) => {
              const props = item.nofollow ? { rel: 'nofollow' } : {}

              return <div key={index} className="iui-footer-pad-links-col-item">
                <a {...props} className="iui-footer-pad-links-col-item-link" target="_blank" href={item.href}>{item.title}</a>
              </div>
            })
          }
        </div>
      </div>)
    }
  </div>
}

function FollowUS(props) {
  const { links = [], followLinks = [], getLocalLink } = props
  const contactLinks = links[links.length - 1] || {}
  const contactLinksData = contactLinks.data || []
  return <div className="iui-footer-pad-follow">
    <div className="iui-footer-pad-follow-title">{$t('Follow Us')}</div>
    <div className="iui-footer-pad-follow-main">
      <div className="iui-footer-pad-follow-links">
        {
          followLinks.map((link, index) => {
            return <a
              key={index}
              className={`iui-footer-pad-follow-links-item iui-icon ${link.iconfont}`}
              target="_blank"
              rel="nofollow"
              href={getLocalLink(link)}
            ></a>
          })
        }
      </div>
      <div className="iui-footer-pad-follow-contact">
        {
          contactLinksData.map((item, index) => {
            return <div key={index} className="iui-footer-pad-follow-contact-item">
              <div className="iui-footer-pad-follow-contact-item-label">{item.title}</div>
              <a className="iui-footer-pad-follow-contact-item-value" target="_blank" rel="nofollow" href={item.href}>{item.subTitle}</a>
            </div>
          })
        }
      </div>
    </div>
  </div>
}

function Foot(props) {
  const { thirdparty = [] } = props
  const mode = getMode()

  return <div className="iui-footer-pad-foot">
    <div className="iui-footer-pad-foot-copyright">{$t('©{0} Test LLC. All rights reserved.', { 0: new Date().getFullYear() })}</div>
    <div className="iui-footer-pad-foot-thirdparty">
      {
        thirdparty.map((item, index) => {
          return <a href={item.link} className="iui-footer-pad-foot-thirdparty-item" key={index} target="_blank" rel="nofollow">
            <img height="60px" src={item[`${mode}-url`]} />
          </a>
        })
      }
    </div>
  </div>
}