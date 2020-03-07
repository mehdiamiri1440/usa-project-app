import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import locationsReducer from './locations/reducer'
import registerProductReducer from './registerProduct/reducer'
export default combineReducers({
  authReducer,
  locationsReducer,
  registerProductReducer
});
