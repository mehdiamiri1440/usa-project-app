import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  I18nManager,
  View,
  ActivityIndicator,
  NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'
import RNRestart from 'react-native-restart';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import { isReadyRef } from './rootNavigation';
import * as RootNavigation from './rootNavigation';
import { deviceWidth, deviceHeight } from '../utils';
import { routeToScreensFromNotifications } from './linking';


import AppNavigator from './navigator';



const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
}

const App = (props) => {
  const RNAppUpdate = NativeModules.RNAppUpdate;

  // console.disableYellowBox = true;
  const { userProfile = {} } = props;
  const { user_info = {} } = userProfile;
  let { is_seller } = user_info;

  const [initialRoute, setInitialRoute] = useState(!!is_seller ? 'RegisterProductStack' : 'RegisterRequest');
  let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());


  useEffect(() => {
    // fetch('https://app-download.s3.ir-thr-at1.arvanstorage.com/buskool.json')
    //   .then(res => {
    //     res.text().then(result => {
    //       const resultOfVersion = JSON.parse(result);
    //       if (
    //         RNAppUpdate.versionName.toString() !==
    //         resultOfVersion.versionName.toString()
    //       ) {
    //         if (!resultOfVersion.forceUpdate) {
    //           setUpdateModalFlag(true);
    //           // Alert.alert(
    //           //     'به روز رسانی',
    //           //     'نسخه جدیدی موجود است. آیا تمایل به  بروز رسانی دارید ؟',
    //           //     [
    //           //         {
    //           //             text: 'به روز رسانی',
    //           //             onPress: () => navigationRef.current.navigate('UpgradeApp')
    //           //         },
    //           //         {
    //           //             text: 'انصراف',
    //           //             onPress: () => { },
    //           //             style: 'cancel'
    //           //         },
    //           //     ],
    //           // );
    //         }
    //         else {
    //           navigationRef.current.navigate('UpgradeApp')
    //         }
    //       }
    //     });
    //   })
    //   .catch(err => navigationRef.current.navigate('SignUp')
    //   );



    if (!props.loggedInUserId) {
      AsyncStorage.getItem('@isIntroductionSeen').then(result => {
        result = JSON.parse(result);

        if (result) {
          setInitialRoute('SignUp')
          RootNavigation.navigate('SignUp')
        }
        else {
          setInitialRoute('Intro')
          RootNavigation.navigate('Intro')
        }
        SplashScreen.hide();
      })
    }
    else {
      setInitialRoute(is_seller ? 'RegisterProductStack' : 'RegisterRequest')
      SplashScreen.hide();
    }

    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      RNRestart.Restart();
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
                    .subscribeToTopic(`FCM${props.loggedInUserId}`)
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
              .subscribeToTopic(`FCM${props.loggedInUserId}`)
            Alert.alert('device is not registered');
          }
        })
    }

    return () => {
      // clearTimeout(guidModalTimeout);
      isReadyRef.current = false;
    }

  }, [initialRoute, is_seller, props.loggedInUserId, props.logOutLoading]);


  return (
    <>
      {(!props.logOutError && !props.userProfileError && ((props.userProfileLoading && !!props.loggedInUserId))) ?
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 9999,
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: deviceWidth,
            height: deviceHeight,
            flex: 1
          }}
        >
          <View style={{
            backgroundColor: '#000546',
            bottom: 78,
            height: 50,
            width: deviceWidth,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row-reverse'
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
        </View>
        : null}

      <AppNavigator
        initialRoute={initialRoute}
        {...props}
      />
    </>

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