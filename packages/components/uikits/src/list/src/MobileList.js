import { List } from 'antd'
import SimplePagination from './SimplePagination';
import { ConfigProvider } from 'antd';
import Empty from './Empty';
import $t from '@xatom/intl'
export default function MobileList(props) {
  const { list, renderItem = () => null, className = '' } = props
  let { items = [], page = {}, loading, id } = list
  const listProps = {
    className: `${className}`,
    dataSource: items,
    loading,
    loadMore: null,
    pagination: false,
    renderItem,
  }
  return (
    <ConfigProvider renderEmpty={() => <Empty />}>
      <List {...listProps} />
      <SimplePagination disabled={loading} page={page} total={items.length} id={id} modelId={id} />
    </ConfigProvider>
  )
}
