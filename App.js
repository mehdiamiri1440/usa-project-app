import React from 'react';
import { I18nManager, ToastAndroid } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from "@react-native-community/netinfo";
import { setCustomText } from "react-native-global-props";
import Router from './src/router/router'
import RNRestart from 'react-native-restart';
import configureStore, { persistor } from './src/redux/configureStore';
import messaging from '@react-native-firebase/messaging';

import * as messageActions from './src/redux/messages/actions';
import ErrorBoundary from './ErrorBoundary';
import locales from './locales/index';
import { Provider as PaperProvider } from 'react-native-paper';
import { Root, Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const store = configureStore()


const customTextProps = {
  style: {
    fontFamily: "IRANSansWeb(FaNum)_Light",
    fontWeight: 'normal',
    direction: 'rtl',
  }
};
setCustomText(customTextProps);
locales.setActiveLanguage('fa-ir');
global.locales = locales.localize;
global.initialProfileRoute = 'HomeIndex';
global.routes = [];
global.productIds = [];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromMessages: false,
      isConnected: true
    }
  }

  componentDidMount() {

    messaging().setBackgroundMessageHandler(async _ => {
      store.dispatch(messageActions.isFromOutSide(true))
    });
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      RNRestart.Restart();
    }
    NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(this.handleConnectivityChange);
  }



  handleConnectivityChange = state => {
    if (!state.isConnected) {
      return ToastAndroid.showWithGravity(
        'اتصال شما به اینترنت دچار مشکل شده‌است .',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };

  render() {
    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider>
              <Root>
                <ErrorBoundary>
                  <Router />
                </ErrorBoundary>
              </Root>
            </PaperProvider>
          </PersistGate>
        </Provider >
      </>
    )
  }
}
export default App;
