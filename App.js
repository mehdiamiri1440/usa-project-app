import React from 'react';
import { I18nManager } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setCustomText } from "react-native-global-props";
import Router from './src/router/router'
import RNRestart from 'react-native-restart';
import configureStore, { persistor } from './src/redux/configureStore';
import locales from './locales/index';
import { deviceHeight, deviceWidth } from './src/utils/deviceDimenssions';
const store = configureStore()
const customTextProps = {
  style: {
    fontFamily: "Vazir-FD",
    fontWeight: 'normal',
    direction: 'rtl',
  }
};
setCustomText(customTextProps);
locales.setActiveLanguage('fa-ir');
global.locales = locales.localize;
class App extends React.Component {
  // componentDidMount() {
  //   if (I18nManager.isRTL) {
  //     I18nManager.forceRTL(false);
  //     RNRestart.Restart();
  //   }
  // }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider >
    )
  }
}
export default App;
