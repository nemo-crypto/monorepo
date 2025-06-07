import request from '@xatom/utils/src/http'

export const changeLanguage = (payload = {}) => {
  const url = '/user/changeLanguage'
  const { query = {} } = payload
  const options = {
    method: 'post',
    requestType: 'jsonstring',
    responseType: 'jsonstring',
    body: {
      lang: query.lang,
    }
  }
  return request(url, options, 'config')
}

export const getLangList = () => {
  const url = '/content/public/getLangList'
  const options = {
    method: 'get',
  }
  return request(url, options, 'config')
}
