import $t from '@xatom/intl'

export default function Widget (props) {
  return (
    <div className="center-vh pt70 pb50">
      <div className="fc-grey-light mt15 fs14">{$t('No Record')}</div>
    </div>
  )
}