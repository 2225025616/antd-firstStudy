import { combineReducers } from 'redux'
import { reducers as userReducers } from './modules/user'

export default combineReducers({
  ...userReducers
})
