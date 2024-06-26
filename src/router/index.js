import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  View,
  NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import { isReadyRef } from './rootNavigation';
import { routeToScreensFromNotifications } from './linking';
import AppNavigator from './navigator';

const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
}

const App = (props) => {
  const RNAppUpdate = NativeModules.RNAppUpdate;

  const {
    userProfile = {},
    loggedInUserId
  } = props;

  const { user_info = {} } = userProfile;

  let { is_seller, id } = user_info;
  global.meInfo.is_seller = is_seller;
  global.meInfo.loggedInUserId = id;

  const [initialRoute, setInitialRoute] = useState(!!is_seller ? 'RequestsStack' : 'Home');
  let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());


  useEffect(() => {

    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      // RNRestart.Restart();
    }

    if (isRegistered) {
      firebase.messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {
            firebase.messaging().hasPermission()
              .then(enabled => {
                if (enabled) {
                  messaging().onNotificationOpenedApp(async remoteMessage => {
                    if (remoteMessage.data.BTarget)
                      routeToScreensFromNotifications(remoteMessage, props);
                    else
                      setInitialRoute('Messages')
                  })
                  messaging().getInitialNotification(async remoteMessage => {
                    if (remoteMessage.data.BTarget)
                      routeToScreensFromNotifications(remoteMessage, props);
                    else
                      setInitialRoute('Messages')
                  });
                  messaging().setBackgroundMessageHandler(async remoteMessage => {
                    if (remoteMessage.data.BTarget)
                      routeToScreensFromNotifications(remoteMessage, props);
                    else
                      setInitialRoute('Messages')
                  });
                  messaging()
                    .subscribeToTopic(`FCM${loggedInUserId}`)
                    .then(() => {

                      messaging().getInitialNotification(() => {
                        messaging().setBackgroundMessageHandler(async remoteMessage => {
                          // try {
                          //   await setBackgroundIncomingMessage(true)
                          // }
                          // catch (err) {
                          // }
                        })
                      });
                    })

                }
                else {
                  firebase.messaging().requestPermission()
                    .then(() => {
                      setIsRegistered(true);
                    })
                }
              });
          }
          else {
            messaging()
              .subscribeToTopic(`FCM${loggedInUserId}`)
            Alert.alert('device is not registered');
          }
        })
    }

    return () => {
      // clearTimeout(guidModalTimeout);
      isReadyRef.current = false;
    }

  }, [initialRoute, is_seller, loggedInUserId, props.logOutLoading]);


  return (
    <View
      style={{
        flex: 1
      }}
    >
      {/* {(!props.logOutError && !props.userProfileError && ((props.userProfileLoading && !!loggedInUserId))) ?
        <View
          style={{
            backgroundColor: '#000546',
            bottom: '7%',
            paddingHorizontal: 10,
            position: 'absolute',
            alignItems: 'center',
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start',
            zIndex: 9999,
            width: deviceWidth,
            height: 40,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              marginHorizontal: 3,
              fontFamily: 'IRANSansWeb(FaNum)_Medium',
            }}
          >
            {locales('labels.pleaseWait')}
          </Text>
          <ActivityIndicator
            size={20}
            color="white"
          />
        </View>
        :
        null
      }  */}
      <AppNavigator
        initialRoute={initialRoute}
        loggedInUserId={loggedInUserId}
        {...props}
      />
    </View>

  )
}

const mapStateToProps = ({
  authReducer,
  profileReducer
}) => {

  const {
    loggedInUserId,
    logOutLoading,
    logOutError
  } = authReducer;

  const {
    userProfile,
    userProfileError,
    userProfileLoading
  } = profileReducer;

  return {
    loggedInUserId,
    logOutLoading,
    logOutError,

    userProfile,
    userProfileError,
    userProfileLoading
  }
};

export default connect(mapStateToProps)(React.memo(App))