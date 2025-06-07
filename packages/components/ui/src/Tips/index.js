import './index.less'

export default function (props) {
  const { children, align = '', type = 'remind', shape = '', className = '', ...rest } = props
  return <div className={['ui-tips', `ui-tips--type-${type}`, `ui-tips--shape-${shape}`, `ui-tips--align-${align}`, className].join(' ')} {...rest}>
    <span className="ui-tips-icon"></span>
    <span className="ui-tips-text">{children}</span>
  </div>
}
