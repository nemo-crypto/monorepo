import { message } from 'antd'
import './index.less'

message.config({
  duration: 3,
  maxCount: 2,
});

export default function ({ type = 'success', title = "" }) {
  message[type](title)
}
