import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import monitorReducersEnhancer from './enhanders/monitorReducer';
import loggerMiddleware from './middleware/logger';
import rootReducer from './reducers';

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhanders = [middlewareEnhancer];
  // const composedEnhancers = compose(...enhanders);
  const composedEnhancers = composeWithDevTools(...enhanders);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
