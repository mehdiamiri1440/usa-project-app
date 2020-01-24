import React from 'react';
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { setCustomText } from "react-native-global-props";
import Router from './src/router/router'
import configureStore from './src/redux/configureStore';
import locales from './locales/index';
const store = configureStore()
const customTextProps = {
  style: {
    fontFamily: "Vazir",
    direction: 'rtl',
  }
};
setCustomText(customTextProps);
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
