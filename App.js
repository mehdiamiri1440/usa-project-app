import React from 'react';
import { I18nManager } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setCustomText } from "react-native-global-props";
import Router from './src/router/router'
import RNRestart from 'react-native-restart';
import configureStore, { persistor } from './src/redux/configureStore';
import messaging from '@react-native-firebase/messaging';

import locales from './locales/index';
import { Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
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
  constructor(props) {
    super(props);
    this.state = {
      fromMessages: false
    }
  }
  componentDidMount() {
    messaging().setBackgroundMessageHandler(async _ => {
      await AsyncStorage.setItem('@fromMessages', JSON.stringify(true))
    });
    // if (I18nManager.isRTL) {
    //   I18nManager.forceRTL(false);
    //   RNRestart.Restart();
    // }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <Root>
              <Router />
            </Root>
          </PaperProvider>
        </PersistGate>
      </Provider >
    )
  }
}
export default App;
