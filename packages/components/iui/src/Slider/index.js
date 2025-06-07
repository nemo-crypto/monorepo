import { useRef } from 'react'
import { Slider } from 'antd'

// 两段滑动条，例如：0~N, N~Max
export function TwoStageSlider(props) {
  const sliderWrapRef = useRef(null)
  const { stagePercent = 20, maxPercent = 500, value = 0, onChange = () => { }, ...rest } = props
  const maxValue = (maxPercent - stagePercent) / ((100 - stagePercent) / 100)
  const stageValue = stagePercent / 100 * maxValue
  const stageBeforeValue = value / 100 * maxValue
  const stageAfterValue = stageValue + (value - stagePercent)
  const currentValue = value > stagePercent ? stageAfterValue : stageBeforeValue
  const marks = {
    0: '0%',
    [stageValue]: `${stagePercent}%`,
    [maxValue]: `${maxPercent}%`
  }

  const getSliderPercent = val => {
    const spilt = maxValue * stagePercent / 100
    if (val >= spilt) {
      return (val - spilt) + stagePercent
    }
    return Number(val / (spilt / stagePercent)).toFixed()
  }

  // 修复antd点击展示的tooltip失去焦点后不消失
  const sliderRef = useRef(null)
  const onSliderMouseLeave = () => {
    sliderRef.current?.blur()
  }

  return <div ref={sliderWrapRef} className="iui-slider" onMouseLeave={onSliderMouseLeave}>
    <Slider
      ref={sliderRef}
      getTooltipPopupContainer={() => sliderWrapRef.current}
      onChange={val => onChange(getSliderPercent(val))}
      marks={marks}
      value={currentValue}
      max={maxValue}
      tooltipPlacement="top"
      tipFormatter={val => getSliderPercent(val) + '%'}
      {...rest}
    >
    </Slider>
  </div>
}

// 默认滑动条，仅修改样式
export default function (props) {
  const sliderWrapRef = useRef(null)
  // 修复antd点击展示的tooltip失去焦点后不消失
  const sliderRef = useRef(null)
  const onSliderMouseLeave = () => {
    sliderRef.current?.blur()
  }
  return <div ref={sliderWrapRef} className="iui-slider" onMouseLeave={onSliderMouseLeave}>
    <Slider ref={sliderRef} tooltipPlacement="top" tipFormatter={val => `${val}%`} getTooltipPopupContainer={() => sliderWrapRef.current} {...props}></Slider>
  </div>
}
