import { useMediaQuery } from 'react-responsive'
import React from "react"
import { isFunction } from "@xatom/utils/src/types"
import './index.less'
const breakPoints = {
  xl: { minWidth: 1600 },
  lg: { minWidth: 1400, maxWidth: 1600 },
  md: { minWidth: 1200, maxWidth: 140 },
  sm: { minWidth: 980, maxWidth: 1200 },
  mobi: { maxWidth: 980 },
  m: { maxWidth: 980 },
  mobile: { maxWidth: 980 },
  pc: { minWidth: 980 },
}

function useMatches() {
  const matches = {
    xl: useMediaQuery(breakPoints.xl),
    lg: useMediaQuery(breakPoints.lg),
    md: useMediaQuery(breakPoints.md),
    sm: useMediaQuery(breakPoints.sm),
    mobi: useMediaQuery(breakPoints.mobi),
    m: useMediaQuery(breakPoints.m),
    mobile: useMediaQuery(breakPoints.mobile),
    pc: useMediaQuery(breakPoints.pc),
  }
  return matches

}

export function useDevice() {
  const isMobile = useMediaQuery({ maxWidth: 960 }) // 手机
  const isTablet = useMediaQuery({ minWidth: 961, maxWidth: 1200 }) // 平板电脑
  const isLaptop = useMediaQuery({ minWidth: 1201, maxWidth: 1440 }) // 笔记本电脑
  const isLargeLaptop = useMediaQuery({ minWidth: 1441, maxWidth: 1690 }) // 宽屏笔记本电脑
  const isDesktop = useMediaQuery({ minWidth: 1690 }) // 台式机
  switch (true) {
    case isMobile:
      return 'mobile'
    case isTablet:
      return 'tablet'
    case isLaptop:
      return 'laptop'
    case isLargeLaptop:
      return 'laptop-lg'
    case isDesktop:
      return 'desktop'
    default:
      return 'desktop'
  }
}

export function Device(props) {
  const { type = 'pc' } = props
  const isMobile = useMediaQuery(breakPoints.mobile)
  const isPC = useMediaQuery(breakPoints.pc)
  switch (true) {
    case type === 'mobile' && isMobile:
      return props.children
    case type === 'pc' && isPC:
      return props.children
    default:
      return null
  }
}

export const utils = {
  isMobile: () => useMediaQuery(breakPoints.mobile),
  isPC: () => useMediaQuery(breakPoints.pc),
}

export const isMobile = () => useMediaQuery(breakPoints.mobile)
export const isPC = () => useMediaQuery(breakPoints.mobile)

export function Show(props) {
  // TODO: validator: on
  const { on = "" } = props
  const matches = useMatches()
  let isMatched = false
  const devices = on.split(',')
  devices.forEach(device => {
    if (matches[device]) {
      isMatched = true
    }
  })

  return isMatched ? props.children : null
}
export function Hide(props) {
  // TODO: validator: on
  const { on = "" } = props
  const matches = useMatches()
  let isMatched = false
  const devices = on.split(',')
  devices.forEach(device => {
    if (matches[device]) {
      isMatched = true
    }
  })
  return isMatched ? null : props.children
}

export function EqualGrid(props) {
  // TODO: validator: dataSource,itemRender
  const { colNum, className, dataSource = [], itemRender, ...rest } = props
  return (
    <div className={`grid-items ${className}`}>
      {dataSource.map((item, index) => {
        return (
          <div className={`grid-item grid-item-col-${colNum}`} key={item['rowKey'] || index}>
            {!item.render && itemRender && itemRender(item, index)}
            {item.render && item.render(item, index)}
          </div>
        )
      })}
    </div>
  )
}

export function ResponsiveEqualGrid(props) {
  const matches = useMatches()
  const { query = {}, className, ...rest } = props
  const devices = Object.keys(query)
  const matched = devices.find(device => matches[device]) || {}
  const device = query[matched] || {}
  return <EqualGrid {...rest} className={`${device.className} ${className}`} colNum={device.colNum} />
}


//===========================================
//
// 暂未完成，设计中
//
//===========================================


// WIP : 通过 query 来统一 show 和 hide
export function Visible(props) {
  const matches = useMatches()
  const { query = {}, className, ...rest } = props
  const devices = Object.keys(query)
  const matched = devices.find(device => matches[device]) || {}
}


// WIP: 无法扩展增强子元素的className，只能覆盖
export function ResponsiveClassName(props) {
  // TODO  validator: query
  const { query = {}, ...rest } = props
  const devices = Object.keys(query)
  const matches = useMatches()
  const matched = devices.find(device => matches[device])
  const device = query[matched]

  const childProps = { ...rest }
  if (isFunction(children)) {
    return children(this, childProps)
  } else {
    return React.Children.map(children, child => React.cloneElement(child, { ...childProps }))
  }
}

// WIP: 所有的节点都通过 json + type 来实现配置
export function UnEqualGrid(props) {
  // TODO: validator: dataSource,itemRender
  const { colNum, className, dataSource = [], itemRender, ...rest } = props
  return (
    <div className={`row ${className}`}>
      {dataSource.map((item, index) => {
        if (item.type === 'fluid') {
          return 'Fluid'
        }
        if (item.type === 'auto') {
          return 'Fluid'
        }
      })}
    </div>
  )
}


export function ResponsiveUnEqualGrid(props) {
  const matches = useMatches()
  const { query = {}, className, dataSoure, ...rest } = props
  const devices = Object.keys(query)
  const matched = devices.find(device => matches[device]) || {}
  const device = query[matched] || {}
  const { className: deviceClassName, ...deviceRest } = device
  const newClassName = `${deviceClassName} ${className}`

  // 处理子级的query
  dataSoure.forEach(item => {
    if (item.query) {
      function getClassName(query) {
        let className = ''
        devices.forEach(device => className += ` col-${device}-${query[device]}`)
      }
      itemClassName = getClassName(item.query)
    }
  })

  return <Grid className={newClassName} {...rest} {...deviceRest}>{props.children}</Grid>
}


