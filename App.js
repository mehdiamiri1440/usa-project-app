import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setCustomText } from "react-native-global-props";
import Router from './src/router'
import configureStore, { persistor } from './src/redux/configureStore';

import ErrorBoundary from './ErrorBoundary';
import locales from './locales';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';

const store = configureStore()

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

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
global.shouldShowRibbon = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromMessages: false,
      isConnected: true
    }
  }

  componentDidMount() {
    // messaging().getInitialNotification(async remoteMessage => {
    //   store.dispatch(messageActions.newMessageReceived(true))
    // });
    // messaging().onNotificationOpenedApp(async remoteMessage => {
    //   store.dispatch(messageActions.newMessageReceived(true))
    // });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   store.dispatch(messageActions.newMessageReceived(true))
    // });
    // if (I18nManager.isRTL) {
    //   I18nManager.forceRTL(false);
    //   I18nManager.allowRTL(false);
    //   RNRestart.Restart();
    // }
    // NetInfo.addEventListener(this.handleConnectivityChange);
  }

  // componentWillUnmount() {
  //   NetInfo.removeEventListener(this.handleConnectivityChange);
  // }



  // handleConnectivityChange = state => {
  //   if (!state.isConnected) {
  //     return ToastAndroid.showWithGravity(
  //       'اتصال شما به اینترنت دچار مشکل شده‌است .',
  //       ToastAndroid.LONG,
  //       ToastAndroid.CENTER
  //     );
  //   }
  // };

  render() {

    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
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
