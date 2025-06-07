import { Slider } from 'antd'
import './index.less'

// 两段滑动条，例如：0~N, N~Max
export function TwoStageSlider(props) {
  const { theme = 'drak', className = '', stagePercent = 20, maxPercent = 500, value = 0, onChange = () => { }, ...rest } = props
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

  return <div className="ui-slider">
    <Slider
      className={`${className} ui-slider-${theme}`}
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
  const { theme = 'drak', className = '', ...rest } = props
  return <div className="ui-slider">
    <Slider className={`${className} ui-slider-${theme}`} tooltipPlacement="top" tipFormatter={val => `${val}%`} {...rest}></Slider>
  </div>
}
