export const Absolute = props => {
    let { children, className = '', style = {}, ...rest } = props
    className = `${className}`
    style = { height: '100%', ...style }
    const newProps = { className, style, ...rest }
    return <div {...newProps}>{children}</div>
}

export const Relative = props => {
    let { children, className = '', style = {}, ...rest } = props
    className = `${className}`
    style = { height: '100%', ...style }
    const newProps = { className, style, ...rest }
    return <div {...newProps}>{children}</div>
}

export const Fixed = props => {
    let { children, className = '', style = {}, ...rest } = props
    className = `${className}`
    style = { height: '100%', ...style }
    const newProps = { className, style, ...rest }
    return <div {...newProps}>{children}</div>
}


