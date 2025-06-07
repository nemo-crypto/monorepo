import { Text } from '@xatom/typo';
import $t from '@xatom/intl';

export default function Empty({ height = '66px' }) {
  return (
    <div className="empty-table-list">
      <img className="" src={require('./empty.png')} height={height} alt="no record" />
      <Text type="1-lighter" style={{ opacity: '1' }} className="mt10">{$t('No Record')}</Text>
    </div>
  )
}

