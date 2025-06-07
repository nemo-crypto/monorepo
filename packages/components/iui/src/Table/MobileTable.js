import React, { useState } from 'react';
import { Cols } from '@xatom/flex'

export default function DataItem (props) {
  const { className = '', record = {}, columns, loading = false, header = null, footer = null, hasLine = true, isCollapse, ...rest } = props
  const [displayCount, setDisplayCount] = useState(isCollapse ? 3 : columns.length);
  //找到H5下需要隐藏的column的个数
  const mobileHideCount = columns?.filter(item => item.mobileHide).length || 0
  //H5下实际展示column的个数
  const mobileCount = columns?.length - mobileHideCount
  // 展开全部
  function handleExpand() {
    setDisplayCount(mobileCount); 
  }
  // 收起
  function handleCollapse() {
    setDisplayCount(3); 
  }
  
  return (
    <div className={`bg-body ${className}`} {...rest}>
      {header && <div>{header}</div>}
      <div className={`bg-card sv-3 pb16 pt16 ${hasLine ? 'bt-grey-light' : ''}`}>
        {columns?.slice(0, displayCount).map((column) => (
          <ColumnItem key={column.key} record={record} column={column} />
        ))}
        {isCollapse && <>
          {displayCount < mobileCount && (
            <Cols className='center-vh'>
              <i onClick={handleExpand} className={`iui-icon iui-icon-chevron-down fs16 fc-grey`}></i>
            </Cols>
            )}
            {displayCount > 3 && (
              <Cols className='center-vh'>
                <i onClick={handleCollapse} className={`iui-icon iui-icon-chevron-up fs16 fc-grey`}></i>
              </Cols>
            )}
        </>}
      </div>
      {footer && <div>{footer}</div>}
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
      <div className="fs12 lh-15 fw-bold fc-grey-light">{column.title}</div>
      <div className="fs12 lh-15 fc-grey">{column.render ? column.render(value, record) : value}</div>
    </Cols>
  )
}
