import { Cols } from '@xatom/flex'
import { Icon } from '@xatom/antd'
import { listActions } from '@xatom/lists'
import './index.less'

export default function (props) {
  const { page = {}, disabled, total = 0, id } = props
  const current = Number(page.current || 1)
  const next = () => listActions.pageChange({ id, page: { current: current + 1 } })
  const prev = () => listActions.pageChange({ id, page: { current: current - 1 } })
  const back = () => listActions.pageChange({ id, page: { current: 1 } })

  return ((total === Number(page.size) || current > 1) &&
    <Cols right className="ui-simple-pagination">
      <PageItem onClick={back} disabled={disabled || current <= 1}  >
        <Icon type="vertical-right" />
      </PageItem>
      <PageItem onClick={prev} disabled={disabled || current <= 1} >
        <Icon type="left" />
      </PageItem>
      <PageItem>{current}</PageItem>
      <PageItem onClick={next} disabled={disabled || total !== Number(page.size)} >
        <Icon type="right" />
      </PageItem>
    </Cols>
  )
}

function PageItem(props) {
  let { children, className = '', disabled, onClick, ...rest } = props
  className = `ui-simple-pagination-item ${className}`
  if (disabled) {
    className += ` disabled`
    onClick = null
  }
  return <div className={className} disabled={disabled} onClick={onClick} {...rest}>{children}</div>
}