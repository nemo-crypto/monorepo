import { Button } from 'antd'

export default function NewButton(props) {
  let { children, type, className, outline, ...rest } = props
  className = `typo-button-${type} ${className}`
  if (props.disabled) className += ' typo-button-disabled'
  if (props.outline) className += ' typo-button-outline'
  const newProps = { className, type, ...rest }
  return <Button {...newProps}>{children}</Button>
}
NewButton.Group = Button.Group
