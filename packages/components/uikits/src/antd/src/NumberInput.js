import Input from './Input'

export default function NumberInput(props) {
  const { value, onChange = () => { }, isInt = false, min, max, decimal, precision, className, ...rest } = props
  const handleChange = (value) => {
    // 替换非数字有效字符
    value = String(value).replace(/[^\d.]+/g, '')
    const sValue = value.split('.')
    const integerValue = sValue[0]
    const floatValue = sValue[1] || ''
    let isValid = true
    if(value === '.'){ //不允许只输入 "." //不允许只输入 空格
      value = ''
    }
    // 过滤掉前面无效的0
    if (value && /^(0+[1-9])|^(0{2,})/.test(value)) {
      value = value.replace(/\b(0+)/gi, '') || '0'
      if (value.startsWith('.')) {
        value = `0${value}`
      }
    }
    if (isNaN(value)) {
      isValid = false
    }
    if (isInt) {
      value = (value === null || value === '' || value === '-') ? value : parseInt(value) // 允许为null 和空字符串 （允许清空整个input）
    }
    if (min && !isNaN(min) && Number(value) < Number(min)) {
      isValid = false
    }
    if (max && !isNaN(max) && Number(value) > Number(max)) {
      isValid = false
    }
    if ((decimal || Number(decimal) === 0) && value) {
      if (floatValue.length > decimal) {
        isValid = false
      }
    }
    // 当以复制方式粘贴超过最大精度要求时
    if (precision >= 0 && floatValue.length > precision) {
      // 直接舍去多余小数位
      value = `${integerValue}.${floatValue.slice(0, precision)}`
    }
    isValid && onChange(value)
  }
  return (
    <Input className={`number-input ${className}`}
      value={value}
      onChange={(value) => handleChange(value)}
      {...rest}
    />
  )
}