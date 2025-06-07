import { Cols } from '@xatom/flex'
import ListView from './ListView'

export default function (props) {
  const bodyHeight = document.body.offsetHeight
  const { MID = 'myPositions', className = '', dataSource = [], columns, loading = false, header = null, footer = null, hasLine = false, ...rest } = props
  const renderRow = (rowData, sectionID, rowID) => {
    return (
      <div className={`${hasLine ? 'bt-grey-light' : ''}`}>
        <DataItem key={rowID} record={rowData} columns={columns} />
      </div>
    )
  }
  return (
    <div className={`${className}`} {...rest}>
      {header && <div>{header}</div>}
      <ListView MID={MID} renderRow={renderRow} pageSize={5} useBodyScroll={false} liistHeight = {`${bodyHeight - 150}px`} formatItems={dataSource} {...rest} />
      {footer && <div>{footer}</div>}
    </div>
  )
}

const DataItem = ({ record, columns }) => {
  return (
    <div className="bg-card p16 sv-3">
      {columns?.map((column) => (
        <ColumnItem key={column.key} record={record} column={column} />
      ))}
    </div>
  )
}

const ColumnItem = ({ record, column }) => {
  const dataIndex = column.dataIndex || column.key
  const value = record[dataIndex]
  if (column.mobileHide) {
    return null
  }
  if (column.mobileRender) {
    return <div className=""> {column.mobileRender(value, record)}</div>
  }
  if (dataIndex === 'action' && column.render) {
    return <div className="center-vh">{column.render(value, record)}</div>
  }
  return (
    <Cols between className="center-v">
      <div className="fs12 lh-15 fc-grey-light">{column.title}</div>
      <div className="fs12 lh-15 fc-grey">{column.render ? column.render(value, record) : value}</div>
    </Cols>
  )
}
