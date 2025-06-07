import $t from '@xatom/intl'
import './index.less'

export default function (props) {
  const {
    className = '',
    text = $t('Oops, page not found!'),
    desc = $t("We are very sorry for the inconvenience. It looks like you`re trying to access a page that has been deleted or never even existed."),
    btnText = $t('Back to homepage'),
  } = props
  return <div className={['ui-router-404', className].join(' ')} >
    <img className="ui-router-404-icon" src={require(`./images/empty.png`)} />
    <div className="ui-router-404-text">{text}</div>
    <div className="ui-router-404-desc">{desc}</div>
    <a href="/" className="ui-router-404-btn">{btnText}</a>
  </div>
}
