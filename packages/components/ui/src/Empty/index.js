import $t from '@xatom/intl'
import './index.less'

export default function (props) {
  const { className = '', size = '100px', theme = 'light', text = $t('No Record'), ...rest } = props
  return <div className={['ui-empty', className].join(' ')} {...rest}>
    <img className="ui-empty-icon" src={require(`./images/empty-${theme}.png`)} height={size} />
    <div className="ui-empty-text">{text}</div>
  </div>
}
