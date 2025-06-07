import { bindActionCreators } from 'redux'
import { getDispatch } from './umi'

export function getActionCreators({ namespace = '', keys = [], id }) {
  let actionCreators = {}
  keys.forEach(key => {
    const actionCreator = (payload, resHandler) => {
      let type = namespace ? namespace + "/" + key : key
      let newPayload = id ? { ...payload, id } : payload
      return { type, payload: newPayload, resHandler };
    }
    actionCreators[key] = actionCreator
  })
  return actionCreators
}

export function getActions(model = {}, dispatch) {
  const namespace = model.namespace
  const reducersKeys = Object.keys(model.reducers || {})
  const effectsKeys = Object.keys(model.effects || {})
  const keys = [...reducersKeys, ...effectsKeys]
  const actionCreators = getActionCreators({ namespace, keys })
  if (!dispatch) dispatch = getDispatch()
  // console.log('getActions: model ',model)
  // console.log('getActions: dispatch ',dispatch)
  const actions = dispatch ? bindActionCreators(actionCreators, dispatch) : []
  // console.log('getActions: actions ',actions)
  return actions
}


