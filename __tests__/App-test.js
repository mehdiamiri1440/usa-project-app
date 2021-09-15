import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});