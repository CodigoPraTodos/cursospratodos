import { LOGIN, LOGOUT } from './actions'

export const initialState = {
  user: null,
  token: null,
}

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case LOGIN:
      return { ...state, ...payload }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
