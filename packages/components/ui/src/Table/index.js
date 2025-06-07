import { Table, ConfigProvider } from 'antd'
import $t from '@xatom/intl'
import SimplePagination from '../SimplePagination'
import Empty from '../Empty'
import './index.less'

export default function (props) {
  const { list, columns, className = '', emptyText = $t('No Record'), simplePagination = true, scroll, theme } = props
  let { items = [], page = {}, loading, id } = list
  const tableProps = {
    className: `ui-table ${className}`,
    dataSource: items,
    columns: formatColumns(columns),
    pagination: false,
    loading,
    scroll
  }
  return (
    <ConfigProvider renderEmpty={() => <Empty text={emptyText} style={{ height: '360px' }} theme={theme} />}>
      <Table {...tableProps} />
      {simplePagination && <SimplePagination disabled={loading} page={page} total={items.length} id={id} modelId={id} />}
    </ConfigProvider>
  )
}
function formatColumns(columns) {
  return columns.map(column => {
    let newColumn = {}
    if (!column.key) {
      newColumn.key = column.dataIndex
    }
    return {
      ...column,
      ...newColumn,
    }
  })
}
