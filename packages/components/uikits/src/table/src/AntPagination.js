import { Pagination } from 'antd'
import { listActions } from '@xatom/lists'
import { Cols } from '@xatom/flex'

export default function AntPagination(props) {
  const { page = {}, id, type, ...rest } = props
  let { total, size, current } = page
  const handleChange = (page, pageSize) => {
    listActions.pageChange({
      id, page: {
        current: page,
        size: pageSize
      }
    })
  }
  if (type === 'nototal') {
    total = null
  }
  return (
    <Cols right className="pt5">
      <Pagination total={total} pageSize={size || 10} current={current} onChange={handleChange} hideOnSinglePage={true} {...rest} />
    </Cols>
  )
}
