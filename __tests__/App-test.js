import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import RegisterProduct from '../src/screens/RegisterProduct'
import configureStore, { persistor } from '../src/redux/configureStore';
import { Provider } from 'react-redux';
const store = configureStore();

test('renders correctly', () => {
  const tree = renderer.create(<Provider store={store}><RegisterProduct /></Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});