import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tabs from './tabs';

const Tab = createMaterialBottomTabNavigator()

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={tabs[0].name}
                activeColor="#00C569"
                inactiveColor="#FFFFFF"
                barStyle={{ backgroundColor: '#313A43' }}
            >
                {tabs.map((route, index) => (
                    <Tab.Screen
                        key={index}
                        options={{
                            tabBarLabel: locales(route.label),
                            tabBarIcon: ({ color }) => route.icon(color)
                        }}
                        name={route.name}
                        component={route.component}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.authREd
    }
};

export default connect(mapStateToProps)(App);