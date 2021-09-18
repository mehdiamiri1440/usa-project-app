import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import RegisterProduct from '../src/screens/RegisterProduct'
import configureStore, { persistor } from '../src/redux/configureStore';
import { Provider } from 'react-redux';
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
test('renders correctly', () => {
  const tree = renderer.create(<Provider store={store}>
    <PaperProvider theme={theme}>
      <Root>
        <RegisterProduct />
      </Root>
    </PaperProvider>
  </Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});