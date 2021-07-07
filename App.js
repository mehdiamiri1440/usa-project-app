import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setCustomText } from "react-native-global-props";
import configureStore, { persistor } from './src/redux/configureStore';

import ErrorBoundary from './ErrorBoundary';
import locales from './locales';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';
import Router from './src/router'

const store = configureStore();

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
global.meInfo = {
  is_seller: 0,
  loggedInUserId: ''
};

class App extends React.Component {

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
};

export default App;
