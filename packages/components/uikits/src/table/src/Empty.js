import $t from '@xatom/intl';
import { getHooksMode } from '@xatom/utils/src/themes';

export default function Empty(props) {
  const mode = getHooksMode()
  const { height = '72px', emptyText = $t('No Record') } = props
  return (
    <div className="empty-table-list">
      <img src={`https://cdn.test.mobi/common/empty/table-empty-${mode}.png`} height={height} alt="no record" />
      <div className="fc-grey-light mt15 fs14">{emptyText}</div>
    </div>
  )
}

