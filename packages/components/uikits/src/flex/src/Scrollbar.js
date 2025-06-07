import { Scrollbars } from 'react-custom-scrollbars';
export default function Scrollbar(props) {
  let { className, ...rest } = props
  const renderThumbHorizontal = ({ style, ...props }) => <div style={{ ...style }} {...props} className="pc-scrollbar-thumb" />
  const renderThumbVertical = ({ style, ...props }) => <div style={{ ...style }} {...props} className="pc-scrollbar-thumb" />
  const scrollProps = {
    renderThumbHorizontal,
    renderThumbVertical,
    autoHide: false,
  }
  className += ' pc-scrollbar'
  return <Scrollbars {...scrollProps} className={className}  {...rest}>{props.children}</Scrollbars>
}
