import $t from '@xatom/intl';
import actions from '@xatom/modular/src/actions';
import * as hooks from '@xatom/modular/src/hooks';
import { ListView } from 'antd-mobile';
import { useEffect, useState } from 'react';
import Empty from '../Empty'
import DataItem from './MobileTable'

export default function List(props) {
  // list数据类型的列表
  // 必须：MID，renderRow
  // listHeight: 容器高度，showEmpty：是否展示空，useBodyScroll：是否用body作为滚动容器, className，调整renderRow的样式, ptH: Empty的paddingTop
  // hasMore: 是否有更多 默认true 对有些无分页的接口 设置为false
  // noPagination: 是否有分页 默认false 如果接口不需要分页 设置为true
  // customize: 自定义列表样式 不是Table样式 默认false
  // itemsData: 无分页的情况下 前端处理后的数据
  // isCollapse: 列表字段是否需要折叠（默认展示前3个）默认需要折叠
  const { MID, columns, listHeight = '640px', customize = false, showEmpty = true, emptyText = $t('No Record'), useBodyScroll = false, renderRow, pageSize = 10, className = "", ptH = 0, noPagination = false, itemsData, isCollapse = true } = props
  let { items = [], filters = {}, loading, hasMore = !noPagination, onLoadMore, page } = hooks.useModel(MID)
  // 无分页的 直接使用请求到的所有数据 
  items = noPagination ? itemsData : items
  const ItemRow = (rowData, sectionID, rowID) => {
    return (
      <DataItem key={rowID} item={rowData} record={rowData} columns={columns} isCollapse={isCollapse} />
    )
  }
  const finalyRenderRow = customize ? renderRow : ItemRow  
  const [dataSource, setDataSource] = useState(new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
  }))
  useEffect(() => {
    if (!items.length) {
      return
    }
    // 如果接口无分页 走接口直接返回的itemsData  将设置hasMore 为false
    setDataSource(dataSource.cloneWithRows(items))
  }, [items])
  const onEndReached = (event) => {
    const pageFilters = { current: page?.current+1 }
    if(!loading && items.length >= pageSize && hasMore) {
      actions.changeList({id:MID, onLoadMore: true})
      actions.fetchList({ id: MID, page: pageFilters }, (res => {
        if (res.items && res.items.length < pageSize) {
          res.hasMore = false
        }
        res.items = [...items, ...(res.items || [])]
        actions.changeList({id:MID, onLoadMore: false})
      }))
    } 
  }

  return (
    <>
      {showEmpty && !items.length && !loading && <Empty ptH={ptH} emptyText={emptyText} />}
      {!!items.length && <div className='iui-list-h5'><ListView
        loading={loading}
        className={className}
        dataSource={dataSource}
        renderFooter={() => (<div className="pt20 center-vh fc-grey-lighter">
          {!hasMore ? $t('No more data') : onLoadMore ? $t('Loading...') : ''}
        </div>)}
        renderRow={finalyRenderRow}
        useBodyScroll={useBodyScroll}
        style={useBodyScroll ? {} : {
          height: listHeight,
          width: '100%'
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={100}
        pageSize={pageSize}
        initialListSize={pageSize}
      /></div>}
    </>
  )
}