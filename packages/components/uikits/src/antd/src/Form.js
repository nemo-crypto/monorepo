import { Form } from 'antd'
export default props => {
  const { form = {}, children, ...rest } = props
  const childProps = { form }
  return <Form {...rest}>{children}</Form>
}
// { React.Children.map(children, child => React.cloneElement(child, { ...childProps })) }
// export default Form.create()(FormWrapper)
