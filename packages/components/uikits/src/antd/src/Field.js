import { Form } from 'antd'
const FormItem = Form.Item
export default props => {
  const { children, visible = true, colon = false, onChange, ...rest } = props
  return visible ? <FormItem {...rest} colon={colon}>{children}</FormItem> : null
}


