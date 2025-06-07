import { Table } from 'antd'
import SimplePagination from './SimplePagination';
import AntPagination from './AntPagination';
import { ConfigProvider } from 'antd';
import Empty from './Empty';
import $t from '@xatom/intl'
const defaultScroll = {
  column: {},
  table: { x: true, y: null }
}
export default function TableList(props) {
  const { list, columns, expandedRowRender, rowKey, tableType = "antd", pageType = "antd", scroll, className = '', position = '' } = props
  let { items = [], page = {}, loading, id } = list
  const scrollConfig = {
    ...scroll,
    ...defaultScroll.table
  }
  const tableProps = {
    className: `table-list ${className}`,
    rowKey: rowKey,
    dataSource: items,
    columns: formatColumns(columns),
    pagination: false,
    loading,
    scroll: scrollConfig,
    expandedRowRender: expandedRowRender
  }
  const nomore = !!((items.length && items.length !== Number(page.size)) || (page.total && Math.ceil(page.total/page.size) <= page.current))
  return (
    <ConfigProvider renderEmpty={() => <Empty />}>
      {tableType === "antd" && <Table {...tableProps} />}
      {position === 'account' && nomore && 
        <span className="fs12 fc-grey-lighter center-h mt20 mb40">{$t('No more records')}</span>}
      {
        pageType === 'nototal' &&
        <SimplePagination disabled={loading} page={page} total={items.length} id={id} modelId={id} />
      }
      {
        pageType === 'antd' &&
        <AntPagination disabled={loading} page={page} id={id} />
      }
    </ConfigProvider>
  )
}
function formatColumns(columns) {
  return columns.map(column => {
    let newColumn = {}
    if (!column.key) {
      newColumn.key = column.dataIndex
    }
    if (!column.width) {
      newColumn.width = defaultScroll.column && defaultScroll.column.width
    }
    newColumn.width = 'auto'
    return {
      ...column,
      ...newColumn,
    }
  })
}
