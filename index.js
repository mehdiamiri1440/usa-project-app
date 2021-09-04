import { LogBox } from 'react-native';
import { AppRegistry } from 'react-native';
// import { YellowBox } from 'react-native';
import { Navigation } from "react-native-navigation";
import App from './App';

// YellowBox.ignoreWarnings(['Remote debugger']);
// LogBox.ignoreAllLogs();
export async function firebaseBackgroundMessage(message) {
    let notif = message['data'];
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
