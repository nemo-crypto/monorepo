import $t from '@xatom/intl';
import actions from '@xatom/modular/src/actions';
import * as hooks from '@xatom/modular/src/hooks';
import { ListView } from 'antd-mobile';
import { useEffect, useState } from 'react';
import Empty from './Empty';
import './ListView.less';

export default function List(props) {
  // list数据类型的列表
  // 必须：MID，renderRow
  // liistHeight: 容器高度，refresh：是否需要下拉刷新，showEmpty：是否展示空（是否解锁），useCursor：使用cursor还是minCursor、maxCursor，useBodyScroll：是否用body作为滚动容器, className，调整renderRow的样式(liveList在用), ptH: Empty的paddingTop
  const { MID, liistHeight = 'calc(100vh - 44px)', refresh = true, showEmpty = true, emptyText = null, useCursor = false, useBodyScroll = false, renderRow, pageSize = 10, className = "", ptH = 0, formatItems = [] } = props
  const { items = [], filters = {}, cursor, minCursor, maxCursor, loading, hasMore = true, onLoadMore, page } = hooks.useModel(MID)
  const [dataSource, setDataSource] = useState(new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
  }))
  useEffect(() => {
    if (!items.length) {
      return
    }
    // formatItems是处理后的list数据，传入formatItems时，用formatItems绘制list
    if (formatItems.length > 0) {
      setDataSource(dataSource.cloneWithRows(formatItems))
    } else {
      setDataSource(dataSource.cloneWithRows(items))
    }
  }, [items])
  const onEndReached = (event) => {
    if(!loading && items.length >= pageSize && hasMore && page?.current) {
      const pageFilters = { current: page?.current+1 }
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
      {!!items.length && <ListView
        className={className}
        dataSource={dataSource}
        renderFooter={() => (<div className='fc-grey-light pt10 pb10 text-center bg-card'>
          {(!hasMore || !page?.current) ? $t('No more data') : onLoadMore ? $t('Loading...') : ''}
        </div>)}
        renderRow={renderRow}
        useBodyScroll={useBodyScroll}
        style={useBodyScroll ? {} : {
          height: liistHeight,
          width: '100%'
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={100}
        pageSize={pageSize}
        initialListSize={pageSize}
      />}
    </>
  )
}