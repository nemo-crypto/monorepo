import { notification, message } from 'antd'

message.config({
  // top: 100,
  duration: 3,
  maxCount: 2,
});
// const TOAST_DEFAULF_DURATION = 3 * 1
export const toast = function ({ type = 'success', title = "" }) {
  message[type](title)
}

export const notify = function ({
  ui = 'notification',
  type = 'success', // success/error/warning/info
  title = 'this is title',
  des = null,
  icon = null,
}) {
  notification[type] && notification[type]({
    message: title,
    description: des,
  })
}



