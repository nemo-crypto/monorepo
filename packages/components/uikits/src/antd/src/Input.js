import { Input } from 'antd'
NewInput.Password = Input.Password
NewInput.Search = Input.Search
NewInput.TextArea = Input.TextArea
NewInput.Group = Input.Group
export default function NewInput(props) {
  let { onChange, children, ...rest } = props

  function handelChange(e) {
    onChange && onChange(e.target.value)
  }
  return (
    <Input onChange={handelChange} {...rest}>
      {children}
    </Input>
  )
}
