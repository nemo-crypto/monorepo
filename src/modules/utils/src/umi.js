import { isFunction } from './types'

// get dispatch by this way only in some specail condition
export function getDispatch() {
  const dispatch = window.g_app && window.g_app._store && window.g_app._store.dispatch
  if (!isFunction(dispatch)) { console.log('cant not get dispatch') }
  return isFunction(dispatch) ? dispatch : null
}
export function getStore() {
  return window.g_app._store
}

export function getState() {
  const store = window.g_app._store
  return store ? store.getState() : {}
}




