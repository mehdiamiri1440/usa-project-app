import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import locationsReducer from './locations/reducer'
import registerProductReducer from './registerProduct/reducer'
import homeReducer from './home/reducer'
import messagesReducer from './messages/reducer'
import buyAdRequestReducer from './buyAdRequest/reducer'
import profileReducer from './profile/reducer'

export default combineReducers({
  authReducer,
  locationsReducer,
  registerProductReducer,
  homeReducer,
  messagesReducer,
  buyAdRequestReducer,
  profileReducer,
});
