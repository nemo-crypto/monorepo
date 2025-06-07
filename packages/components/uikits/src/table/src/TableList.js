import $t from '@xatom/intl';
import { SimplePagination } from '@xatom/iui';
import { ConfigProvider, Table } from 'antd';
import AntPagination from './AntPagination';
import Empty from './Empty';
const defaultScroll = {
  column: {},
  table: { x: true, y: null }
}
export default function TableList(props) {
  const { list, columns, expandedRowRender, rowKey, tableType = "antd", pageType = "antd", scroll, rowClassName = '', className = '', position = '', rowSelection, expandIconColumnIndex, onExpand, expandIconAsCell, isGreyEmpty, expandRowByClick, expandIcon } = props
  let { items = [], page = {}, loading, id } = list
  const scrollConfig = {
    ...defaultScroll.table,
    ...scroll
  }
  const tableProps = {
    rowClassName: rowClassName,
    className: `table-list ${className}`,
    rowKey: rowKey,
    dataSource: items,
    columns: formatColumns(columns),
    pagination: false,
    loading,
    scroll: scrollConfig,
    expandedRowRender: expandedRowRender,
    rowSelection: rowSelection,
    expandIconColumnIndex: expandIconColumnIndex,
    expandIconAsCell: expandIconAsCell,
    expandRowByClick: expandRowByClick,
    onExpand: onExpand,
    expandIcon: expandIcon,
    expandIconAsCell: false
  }
  const nomore = !!((items.length && items.length !== Number(page.size)) || (page.total && Math.ceil(page.total / page.size) <= page.current))
  return (
    <ConfigProvider renderEmpty={() => <Empty isGreyEmpty={isGreyEmpty} />}>
      {tableType === "antd" && <Table {...tableProps} />}
      {position === 'account' && nomore &&
        <span className="fs12 fc-grey-lighter center-h mt20 mb40">{$t('No more records')}</span>}
      {
        pageType === 'nototal' &&
        <div className="mt12">
          <SimplePagination disabled={loading} page={page} total={items.length} id={id} modelId={id} />
        </div>
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
    return {
      width: 'auto',
      ...column,
      ...newColumn,
    }
  }).filter(column => {
    return !column.pcHide
  })
}
