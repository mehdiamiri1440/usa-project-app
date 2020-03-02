import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import monitorReducersEnhancer from './enhanders/monitorReducer';
import loggerMiddleware from './middleware/logger';
import rootReducer from './reducers';

let persistor;
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'authReducer',
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['locationsReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhanders = [middlewareEnhancer];
  // const composedEnhancers = compose(...enhanders);
  const composedEnhancers = composeWithDevTools(...enhanders);

  const store = createStore(persistedReducer, preloadedState, composedEnhancers);
  persistor = persistStore(store);

  return store;
}
export { persistor };
export default configureStore;
