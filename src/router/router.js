import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Tour from '../screens/Tour/Tour';
import Login from '../screens/Login/Login';

const MainNavigator = createStackNavigator({
    Login: { screen: Login },
    Tour: { screen: Tour },
});

const App = createAppContainer(MainNavigator);

export default App;