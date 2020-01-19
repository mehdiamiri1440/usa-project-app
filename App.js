import React from 'react';
import { Provider } from 'react-redux'
import Router from './src/router/router'
import configureStore from './src/redux/configureStore';
import locales from './locales/index';
const store = configureStore()
locales.setActiveLanguage('fa-ir');
global.locales = locales.localize;
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}
export default App;
