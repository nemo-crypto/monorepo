import { Tooltip } from 'antd'
export default (props) => {
    let { type = 'primary', overlayClassName = '', ...rest } = props
    overlayClassName = `tooltip-${type} ${overlayClassName}`
    return <Tooltip overlayClassName={overlayClassName}  {...rest}>{props.children}</Tooltip>
}
