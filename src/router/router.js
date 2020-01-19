import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Tour from '../screens/Tour/Tour';
import Home from '../screens/Home/Home';

const MainNavigator = createStackNavigator({
    Home: { screen: Home },
    Tour: { screen: Tour },
});

const App = createAppContainer(MainNavigator);

export default App;