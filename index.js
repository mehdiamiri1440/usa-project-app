import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { YellowBox } from 'react-native';

import App from './App';
import configureStore from './src/redux/configureStore';
import { routeToScreensFromNotifications } from './src/router/router';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['Remote debugger']);

export async function firebaseBackgroundMessage(message) {
    let notif = message['data'];
    console.warn(notif);
    return Promise.resolve();
}

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage);

AppRegistry.registerComponent(appName, () => App);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const store = configureStore();
    store.subscribe(() => {
        Promise.resolve(store.getState().profileReducer).then(result => {
            setTimeout(() => {
                routeToScreensFromNotifications(remoteMessage, result);
            }, 1000);
        })
    })
})
