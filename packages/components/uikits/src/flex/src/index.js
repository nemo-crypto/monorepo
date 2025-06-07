import { Spin } from '@xatom/antd'
import Scrollbar from './Scrollbar';
export const Stacks = props => {
  let { children, className = '', style = {}, between, equal, bottom, justify, type, hidden, auto, hfull, full = true, height, loading, onClick, disabled, scroll, ...rest } = props
  className = `d-flex flex-column ${className}`
  if (hidden) { return null }
  style = { ...style }
  if (hfull) { style.height = '100%' }
  if (height) { style.height = height }
  if (between) { className += ' justify-content-between' }
  if (equal) { className += ' equal-cols' }
  if (bottom) { className += ' justify-content-end' }
  if (justify) { style.justifyContent = justify } // space-around / space-evently
  if (type) { className += ` stacks-type-${type}` }
  if (scroll) { style = { overflow: 'auto', ...style } }
  if (disabled) {
    className += ` cursor-not-allowed`
    onClick = null
  }
  if (onClick) { className += ` cursor-pointer` }
  const newProps = { className, style, onClick, ...rest }
  if (scroll === true) {
    className += ` pc-scrollbar`
    return <Scrollbar  {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</Scrollbar>
  } else {
    return <div {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</div>
  }
}
export function Cols(props) {
  let { children, className = '', style = {}, between, center, equal, right, justify, type, hidden, auto = false, hfull, full = true, height, loading, onClick, disabled, scroll, ...rest } = props
  className = `d-flex ${className}`
  if (hidden) { return null }
  if (hfull) { style.height = '100%' }
  if (height) { style.height = height }
  if (between) { className += ' justify-content-between' }
  if (equal) { className += ' equal-cols' }
  if (right) { className += ' justify-content-end' }
  if (justify) { style.justifyContent = justify } // space-around / space-evently
  if (type) { className += ` cols-type-${type}` }
  if (disabled) {
    className += ` cursor-not-allowed`
    onClick = null
  }
  if (onClick) { className += ` cursor-pointer` }
  const newProps = { className, style, onClick, ...rest }
  if (scroll) {
    return <Scrollbar  {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</Scrollbar>
  } else {
    return <div {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</div>
  }
}
export function Cell(props) {
  let { children, className = '', style = {}, auto, fluid, hidden, loading, scroll, onClick, disabled, height, ...rest } = props
  if (hidden) { return null }
  if (auto) { className += ' box-auto' }
  if (fluid) { className += ' box-fluid' }
  if (height) { style.height = height }
  if (disabled) {
    className += ` cursor-not-allowed`
    onClick = null
  }
  if (onClick) { className += ` cursor-pointer` }
  const newProps = { className, style, onClick, ...rest }
  if (scroll) {
    return <Scrollbar {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</Scrollbar>
  } else {
    return <div {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</div>
  }
}

// ============================
// 待废弃，减少使用
// ============================
export const Scroll = props => {
  let { children, className = '', style = {}, hidden, loading, ...rest } = props
  className = `box-fluid ${className}`
  if (hidden) { return null }
  style = { overflow: 'auto', ...style }
  const newProps = { className, style, ...rest }
  return <div {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</div>
}
// ============================
// 待废弃，减少使用
// ============================
export const Fluid = props => {
  let { children, className = '', style = {}, hidden, loading, ...rest } = props
  className = `box-fluid ${className}`
  if (hidden) { return null }
  if (scroll) style = { ...style }
  style = { ...style }
  const newProps = { className, style, ...rest }
  return <div {...newProps}>{children}{loading && <Spin className="abs-cover" loading={loading} />}</div>
}
// ============================
// 待废弃，减少使用
// ============================

export const Auto = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `box-auto ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }
  return <div {...newProps}>{children}</div>
}
// 待废弃，减少使用
export const Right = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `d-flex justify-content-end ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }

  return <div {...newProps}>{children}</div>
}

// 待废弃，减少使用
export const Equal = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `d-flex equal-cols ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }

  return <div {...newProps}>{children}</div>
}
// 待废弃，减少使用
export const Between = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `d-flex justify-content-between ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }

  return <div {...newProps}>{children}</div>
}
// 待废弃，减少使用
export const Row = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `d-flex ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }

  return <div {...newProps}>{children}</div>
}


// 待废弃
export const Box = props => {
  let { children, className = '', style = {}, ...rest } = props
  className = `box ${className}`
  style = { ...style }
  const newProps = { className, style, ...rest }
  return <div {...newProps}>{children}</div>
}
