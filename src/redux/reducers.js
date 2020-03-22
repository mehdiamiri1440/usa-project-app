import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import locationsReducer from './locations/reducer'
import registerProductReducer from './registerProduct/reducer'
import homeReducer from './home/reducer'
import messagesReducer from './messages/reducer'

export default combineReducers({
  authReducer,
  locationsReducer,
  registerProductReducer,
  homeReducer,
  messagesReducer,
});
