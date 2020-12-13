import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
// import { YellowBox } from 'react-native';
import { Navigation } from "react-native-navigation";
import App from './App';
import configureStore from './src/redux/configureStore';
import { routeToScreensFromNotifications } from './src/router';

// YellowBox.ignoreWarnings(['Remote debugger']);
global.isFromOutSide = false
export async function firebaseBackgroundMessage(message) {
    let notif = message['data'];
    console.warn(notif);
    return Promise.resolve();
}

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage);

Navigation.registerComponent('com.buskool', () => App);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'com.buskool'
            }
        },
    });
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const store = configureStore();
    global.isFromOutSide = true
    store.subscribe(() => {
        Promise.resolve(store.getState().profileReducer).then(result => {
            setTimeout(() => {
                routeToScreensFromNotifications(remoteMessage, result);
            }, 1000);
        })
    })
})
