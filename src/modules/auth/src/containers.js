import { isLoged, getUser } from './utils'
import { isFunction } from '@xatom/utils/src/types'

export function Loged(props) {
  const loged = isLoged()
  const user = getUser()
  if (loged) {
    if (isFunction(props.children)) {
      return props.children({ user })
    } else {
      return props.children
    }
  } else {
    return props.unLoged || null
  }
}

export function UnLoged(props) {
  const loged = isLoged()
  if (!loged) {
    return props.children
  } else {
    return null
  }
}

