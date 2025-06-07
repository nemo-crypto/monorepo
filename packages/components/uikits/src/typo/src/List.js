
export function Inlines(props) {
  let { children, className = '', style = {}, dataSource = [], ...rest } = props
  className = `title ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }
  return (
    <div {...newProps}>
      {
        dataSource.map(item => (
          <span {...item} >{item.children}</span>
        ))
      }
    </div>
  )
}









