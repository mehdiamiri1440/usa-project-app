import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import {
  Alert, Linking, Text, I18nManager, View, ActivityIndicator,
  NativeModules, StyleSheet
} from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
import DeviceInfo from 'react-native-device-info';


import { navigationRef, isReadyRef } from './rootNavigation';
import * as RootNavigation from './rootNavigation';
import { deviceWidth, deviceHeight, dataGenerator } from '../utils';



import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import AppNavigator from './navigator';

import AsyncStorage from '@react-native-community/async-storage';




let counter = 0;

const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
}


export const routeToScreensFromNotifications = (remoteMessage, props) => {

  const { userProfile = {} } = props;
  const { user_info = {} } = userProfile;
  let { is_seller } = user_info;
  is_seller = is_seller == 0 ? false : true;

  global.isFromOutSide = false

  if (navigationRef.current) {
    switch (remoteMessage.data.BTarget) {
      case 'messages': {
        return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 0 } });
      }
      case 'myProducts': {
        if (is_seller) {
          return navigationRef.current.navigate('MyBuskool', { screen: 'MyProducts' });
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'MyBuskool', childRoute: 'MyProducts' } });
        }
      }
      case 'dashboard': {
        if (is_seller) {
          return navigationRef.current.navigate('MyBuskool', { screen: 'Dashboard' });
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'MyBuskool', childRoute: 'Dashboard' } });
        }
      }
      case 'registerProduct': {
        if (is_seller) {
          return navigationRef.current.navigate('RegisterProductStack', { screen: 'RegisterProduct' });
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'RegisterProductStack', childRoute: 'RegisterProduct' } });
        }
      }
      case 'registerBuyAd': {
        if (!is_seller) {
          return navigationRef.current.navigate('RegisterRequest');
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'RegisterRequest', childRoute: 'RegisterRequest' } });
        }
      }
      case 'specialProducts': {
        if (!is_seller) {
          return navigationRef.current.navigate('SpecialProducts');
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'SpecialProducts', childRoute: 'SpecialProducts' } });
        }
      }
      case 'productList': {
        if (remoteMessage.data.productId) {
          return navigationRef.current.navigate('Home', {
            screen: 'ProductDetails',
            params: { productId: remoteMessage.data.productId }
          });
        }
        return navigationRef.current.navigate('Home');
      }
      case 'myBuskool': {
        return navigationRef.current.navigate('MyBuskool');
      }
      case 'buyAds': {
        if (is_seller) {
          return navigationRef.current.navigate('Requests');
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'Requests' } });
        }
      }
      case 'buyAdSuggestion': {
        if (is_seller) {
          return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 1 } });
        }
        else {
          return navigationRef.current.navigate('MyBuskool',
            { screen: 'ChangeRole', params: { parentRoute: 'Messages', childRoute: 'MessagesIndex', routeParams: { tabIndex: 1 } } });
        }
      }
      default:
        return navigationRef.current.navigate('Home');
    }
  }
  else {
    if (counter <= 2) {
      // I used counter variable to make sure that this recursive function calling will not occures more than 3 times and
      // prevent any looping inside app that can cause any crash
      counter = counter + 1
      return setTimeout(() => {
        return routeToScreensFromNotifications(remoteMessage, props)
      }, 1000);
    }
  }
}

const App = (props) => {
  const RNAppUpdate = NativeModules.RNAppUpdate;

  // console.disableYellowBox = true;
  const { userProfile = {} } = props;
  const { user_info = {} } = userProfile;
  let { is_seller } = user_info;
  is_seller = is_seller == 0 ? false : true;

  const [initialRoute, setInitialRoute] = useState(is_seller ? 'RegisterProductStack' : 'RegisterRequest');
  let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());
  let [updateModalFlag, setUpdateModalFlag] = useState(false);
  let [isForceUpdate, setIsForceUpdate] = useState(true);


  useEffect(() => {
    // checkForUpdate()

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
        if (JSON.parse(result)) {
          setInitialRoute('SignUp')
          RootNavigation.navigate('SignUp')
        }
        else {
          setInitialRoute('Intro')
          RootNavigation.navigate('Intro')
        }
        setTimeout(() => {
          SplashScreen.hide();
        }, 200);
      })
    }
    else {
      SplashScreen.hide();
    }
    // Linking.getInitialURL().then(url => handleIncomingEvent(undefined, url))
    // Linking.addEventListener('url', event => handleIncomingEvent(event, undefined))
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
      isReadyRef.current = false
      Linking.removeEventListener('url', handleIncomingEvent)
    }

  }, [initialRoute, is_seller, props.loggedInUserId, props.logOutLoading]);

  const checkForUpdate = _ => {
    getAppstoreAppMetadata("com.buskool") //put any apps packageId here
      .then(metadata => {
        if (
          DeviceInfo.getVersion() != metadata.version
        ) {
          const versionParts = metadata.version.split('.');
          if (versionParts[versionParts.length - 1] == '1') {
            setIsForceUpdate(true);
          }
          else {
            setIsForceUpdate(false);
          }
          setUpdateModalFlag(true);
        }
        else {
          setUpdateModalFlag(false);
        }
      })
      .catch(err => {
        console.log("error occurred", err);
      });
  }

  const handleIncomingEvent = (event, url) => {
    if (!url) {
      url = (event.url).split('://')[1].includes('www') ? (event.url).split('://')[1].split('/')[1]
        : (event.url).split('://')[1]
    }
    else {
      console.log('url', url)
      url = url.split('/')[3]
    }
    switch (url) {
      case 'register-product-successfully':
        console.log('here')
        return RootNavigation.navigate('RegisterProductStack', {
          screen: 'RegisterProductSuccessfully',
          params: { needToRefreshKey: dataGenerator.generateKey('register_product_successfully_from_bank') }
        });
      case 'pricing':
        return RootNavigation.navigate('MyBuskool', {
          screen: 'PromoteRegistration',
          params: { needToRefreshKey: dataGenerator.generateKey('buy_ads_from_pricing_') }
        });

      case 'product-list':
        return navigationRef.current.navigate('Home', {
          screen: 'ProductsList',
          params: { needToRefreshKey: dataGenerator.generateKey('product_list_from_product_list_') }
        });

      case 'register-product': {
        return navigationRef.current.navigate('RegisterProductStack', {
          screen: 'RegisterProduct',
          params: { needToRefreshKey: dataGenerator.generateKey('register_product_from_register_product_') }
        });
      }
      case 'buyAd-requests': {
        AsyncStorage.getItem('@registerProductParams').then(result => {
          result = JSON.parse(result);
          if (result && result.subCategoryId && result.subCategoryName) {
            return navigationRef.current.navigate('Requests', {
              needToRefreshKey: dataGenerator.generateKey('buy_ads_from_buy_ads_requests_'),
              subCategoryId: result.subCategoryId, subCategoryName: result.subCategoryName
            });
          }
          return navigationRef.current.navigate('Requests', { needToRefreshKey: dataGenerator.generateKey('buy_ads_from_buy_ads_requests_') });
        })
      };
      case 'public-channel':
        return navigationRef.current.navigate('Messages', {
          screen: 'Channel',
        });
      default:
        break;
    }
  };


  return (
    <>
      <Portal
        style={{
          padding: 0,
          margin: 0

        }}>
        <Dialog
          visible={updateModalFlag}
          style={styles.dialogWrapper}
        >
          <Dialog.Actions
            style={styles.dialogHeader}
          >
            {!isForceUpdate ? <Button
              onPress={() => setUpdateModalFlag(false)}
              style={styles.closeDialogModal}>
              <FontAwesome5 name="times" color="#777" solid size={18} />
            </Button> : null}
            <Paragraph style={styles.headerTextDialogModal}>
              {locales('titles.update')}
            </Paragraph>
          </Dialog.Actions>
          <View
            style={{
              width: '100%',
              alignItems: 'center'
            }}>
            <AntDesign name="exclamation" color="#3fc3ee" size={70} style={[styles.dialogIcon, {
              borderColor: '#9de0f6',
            }]} />

          </View>
          <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

            <Text style={[styles.mainTextDialogModal, { fontSize: 18 }]}>
              {locales('titles.newVersionUpdate')}
            </Text>
          </Dialog.Actions>
          <View style={{
            alignSelf: 'center',
            justifyContent: 'center',
            paddingBottom: 30,
            padding: 10,
            width: '100%',
            textAlign: 'center',
            alignItems: 'center'
          }}>
            <Button
              style={[styles.modalButton, styles.greenButton, { maxWidth: deviceWidth * 0.5 }]}
              onPress={() => {
                Linking.canOpenURL('https://play.google.com/store/apps/details?id=com.buskool').then((supported) => {
                  if (!!supported) {
                    Linking.openURL('https://play.google.com/store/apps/details?id=com.buskool')
                  } else {
                    Linking.openURL('https://play.google.com')
                  }
                })
                  .catch(() => {
                    Linking.openURL('https://play.google.com')
                  })
              }}
            >

              <Text style={styles.buttonText}>{locales('titles.update')}
              </Text>
            </Button>
          </View>
          <Dialog.Actions style={{
            justifyContent: 'center',
            width: '100%',
            padding: 0
          }}>
            {!isForceUpdate ? <Button
              style={[styles.modalCloseButton,]}
              onPress={() => setUpdateModalFlag(false)}>

              <Text style={styles.closeButtonText}>{locales('titles.cancel')}
              </Text>
            </Button> : null}
          </Dialog.Actions>
        </Dialog>
      </Portal >

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



const styles = StyleSheet.create({
  backButtonText: {
    color: '#7E7E7E',
    width: '60%',
    textAlign: 'center'
  },
  backButtonContainer: {
    textAlign: 'center',
    borderRadius: 5,
    margin: 10,
    width: deviceWidth * 0.4,
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  loginFailedContainer: {
    backgroundColor: '#D4EDDA',
    padding: 10,
    borderRadius: 5
  },
  loginFailedText: {
    textAlign: 'center',
    width: deviceWidth,
    color: '#155724'
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: 'IRANSansWeb(FaNum)_Light',
    paddingVertical: 8,
    color: 'black',
    height: 60,
    width: deviceWidth * 0.9,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    left: 30,
    top: 17,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'IRANSansWeb(FaNum)_Medium',
    width: '100%',
    textAlign: 'center'
  },
  labelInputPadding: {
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  disableLoginButton: {
    textAlign: 'center',
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#B5B5B5',
    width: deviceWidth * 0.4,
    color: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  loginButton: {
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#00C569',
    borderRadius: 5,
    width: deviceWidth * 0.4,
    color: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  dialogWrapper: {
    borderRadius: 12,
    padding: 0,
    margin: 0,
    overflow: "hidden"
  },
  dialogHeader: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    padding: 0,
    margin: 0,
    position: 'relative',
  },
  closeDialogModal: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 15,
    height: '100%',
    backgroundColor: 'transparent',
    elevation: 0
  },
  headerTextDialogModal: {
    fontFamily: 'IRANSansWeb(FaNum)_Bold',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: 11,
    color: '#474747'
  },
  mainWrapperTextDialogModal: {
    width: '100%',
    marginBottom: 0
  },
  mainTextDialogModal: {
    fontFamily: 'IRANSansWeb(FaNum)_Bold',
    color: '#777',
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 15,
    width: '100%'
  },
  modalButton: {
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    fontFamily: 'IRANSansWeb(FaNum)_Bold',
    maxWidth: 145,
    color: 'white',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    color: 'white',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    elevation: 0,
    borderRadius: 0,
    backgroundColor: '#ddd'
  },
  closeButtonText: {
    fontFamily: 'IRANSansWeb(FaNum)_Bold',
    color: '#555',
  },
  dialogIcon: {

    height: 80,
    width: 80,
    textAlign: 'center',
    borderWidth: 4,
    borderRadius: 80,
    paddingTop: 5,
    marginTop: 20

  },
  greenButton: {
    backgroundColor: '#00C569',
  },
  forgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  forgotPassword: {
    marginTop: 10,
    textAlign: 'center',
    color: '#7E7E7E',
    fontSize: 16,
    padding: 10,
  },
  enterText: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00C569',
    fontSize: 20,
    padding: 10,
  },
  linearGradient: {
    height: deviceHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextStyle: {
    color: 'white',
    position: 'absolute',
    textAlign: 'center',
    fontSize: 26,
    bottom: 40
  },
  textInputPadding: {
    padding: 20,
  },
  userText: {
    flexWrap: 'wrap',
    paddingTop: '3%',
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
    color: '#7E7E7E'
  }
});

const mapStateToProps = (state) => {

  return {
    loggedInUserId: state.authReducer.loggedInUserId,
    logOutLoading: state.authReducer.logOutLoading,
    logOutError: state.authReducer.logOutError,

    userProfile: state.profileReducer.userProfile,
    userProfileError: state.profileReducer.userProfileError,
    userProfileLoading: state.profileReducer.userProfileLoading,
  }
};


export default connect(mapStateToProps)(React.memo(App))