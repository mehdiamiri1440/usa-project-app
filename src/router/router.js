import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUp from '../screens/SignUp/index';
import Login from '../screens/Login/Login';

const MainNavigator = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            headerShown: false,
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            headerShown: false,
        }
    },
},
    {
        initialRouteName: 'Login'
    }
);

const App = createAppContainer(MainNavigator);

export default App;