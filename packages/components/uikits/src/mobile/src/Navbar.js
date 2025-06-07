import { Title, Cols } from '@xatom/uikits'
// 专注于layout
export default function NavBar(props) {
  let { left, right, center, title, className = '' } = props
  className = `${className} bt-grey-light bg-card-header`
  return (
    <Cols type="010" height="50px" className={className}>
      <div className="abs-left center-vh" style={{ width: 'auto' }}>
        {/* <Icon onClick={() => { }} className="fc-grey hover-fc-primary fs20" type="arrow-left" style={{ width: '50px' }} /> */}
        {left}
      </div>
      <div className="center-vh">
        {center}
        {!center && title && <Title type="2" className="fs18 lh-20 pl10">{title}</Title>}
      </div>
      <div className="abs-right center-vh" style={{ width: 'auto' }}>
        {/* <Icon onClick={() => { }} className="fc-grey hover-fc-primary fs20" type="filter" style={{ width: '50px' }}></Icon> */}
        {right}
      </div>
    </Cols>
  )
}
