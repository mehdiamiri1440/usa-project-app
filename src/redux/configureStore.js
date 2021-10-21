import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducers';

let persistor;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function configureStore(preloadedState) {

  const middlewares = [thunkMiddleware];

  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhanders = [middlewareEnhancer];

  const composedEnhancers = composeWithDevTools(...enhanders);

  const store = createStore(persistedReducer, preloadedState, composedEnhancers);

  persistor = persistStore(store);

  return store;
};

export { persistor };

export default configureStore;
