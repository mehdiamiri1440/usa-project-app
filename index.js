import { AppRegistry } from 'react-native';
// import { YellowBox } from 'react-native';
import { Navigation } from "react-native-navigation";
import App from './App';

// YellowBox.ignoreWarnings(['Remote debugger']);
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
