import { Table, ConfigProvider } from 'antd'
import { useMediaQuery } from 'react-responsive'
import $t from '@xatom/intl'
import SimplePagination from '../SimplePagination'
import ListView from './ListView'
import Empty from '../Empty'

import './index.less'

const defaultScroll = {
  column: {},
  table: { x: true, y: null }
}

export default function (props) {
  const isMobile = useMediaQuery({ maxWidth: 1024 })

  const { list, columns, expandedRowRender, rowKey, tableType = "antd", scroll, rowClassName = '', className = '', rowSelection, expandIconColumnIndex, onExpand, expandIconAsCell, expandRowByClick, expandIcon, listHeight = '100vh', noPagination = false, isCollapse, emptyText = $t('No Record'), ...rest } = props
  let { items = [], page = {}, loading, id } = list
  const scrollConfig = {
    ...scroll,
    ...defaultScroll.table
  }
  const tableProps = {
    rowClassName: rowClassName,
    className: `iui-table ${className}`,
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
  return (
    <ConfigProvider renderEmpty={() => <Empty emptyText={emptyText}/>} >
      {/* pc+pad */}
      {!isMobile && <>
        {tableType === "antd" && <Table {...tableProps} />}
        {
        !noPagination &&
          <SimplePagination disabled={loading} page={page} total={items.length} id={id} modelId={id} />
        }
        </>
      }

      {/* H5 */}
      {isMobile && <ListView MID={id} noPagination={noPagination} itemsData={items} columns={columns} useBodyScroll={false} listHeight = {listHeight} isCollapse={isCollapse} emptyText={emptyText} {...rest}/>}
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
