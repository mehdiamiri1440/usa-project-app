import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import locationsReducer from './locations/reducer'
export default combineReducers({
  authReducer,
  locationsReducer
});
