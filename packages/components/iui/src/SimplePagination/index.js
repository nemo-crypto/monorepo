import { Text } from '@xatom/typo'
import { Cols } from '@xatom/flex'
import { Icon } from '@xatom/antd'
import { listActions } from '@xatom/lists'
import './index.less'

export default function SimplePagination(props) {
  const { page = {}, disabled, total = 0, id } = props
  const current = Number(page.current || 1)
  const next = () => listActions.pageChange({ id, page: { current: current + 1 } })
  const prev = () => listActions.pageChange({ id, page: { current: current - 1 } })
  const back = () => listActions.pageChange({ id, page: { current: 1 } })
  const jump = (page) => listActions.pageChange({ id, page: { current: page } })
  return ((total === Number(page.size) || current > 1) &&
    <Cols right className="iui-simple-pagination">
      <PageItem onClick={back} disabled={disabled || current <= 1}  >
        <Icon className="fs12" type="vertical-right" />
      </PageItem>
      <PageItem onClick={prev} disabled={disabled || current <= 1} >
        <Icon className="fs12" type="left" />
      </PageItem>
      <PageItem active={true}>
        <Text className="fc-grey">{current}</Text>
      </PageItem>
      <PageItem onClick={next} disabled={disabled || total !== Number(page.size)} >
        <Icon className="fs12" type="right" />
      </PageItem>
    </Cols>
  )
}

function PageItem(props) {
  let { children, className = '', disabled, style, active, onClick, ...rest } = props
  className = `pagination-item ${className}`
  if (disabled) {
    className += ` disabled`
    onClick = null
  }
  if (active) className += ` active`
  return <div className={className} style={style} disabled={disabled} onClick={onClick} {...rest}>{children}</div>
}