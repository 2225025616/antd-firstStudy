import { SET_USER } from '../../config/actionTypes'

export const reducers = {
  user: (state = {}, action) => {
    switch (action.type) {
      case SET_USER:
        return {
          ...state,
          ...action.params
        }
      default:
        return state
    }
  }
}

export const actions = {
  setUser: (params) => {
    localStorage.setItem('user', JSON.stringify(params))
    return { type: SET_USER, params }
  }
}
