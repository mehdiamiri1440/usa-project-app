import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef, memo } from 'react';
import { Button } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import { Alert, Linking, Text, I18nManager, Image, View, ActivityIndicator, NativeModules, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import remoteConfig from '@react-native-firebase/remote-config';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';

import * as messagesActions from '../redux/messages/actions';
import * as profileActions from '../redux/profile/actions';
import * as authActions from '../redux/auth/actions';

import { navigationRef, isReadyRef } from './rootNavigation';
import * as RootNavigation from './rootNavigation';
import { deviceWidth, deviceHeight } from '../utils';



import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';



import UpgradeApp from '../screens/UpgradeApp'
import Intro from '../screens/Intro'
import SignUp from '../screens/SignUp'
import Home from '../screens/Home/Home';
import Requests from '../screens/Requests/Requests';
import Dashboard from '../screens/Home/Dashboard';
import ContactUs from '../screens/Home/ContactUs';
import Authentication from '../screens/Home/Authentication';
import ChangeRole from '../screens/Home/ChangeRole';
import PromoteRegistration from '../screens/Home/PromoteRegistration/PromoteRegistration';
import EditProfile from '../screens/Home/EditProfile';
// import PromotionIntro from '../screens/Home/PromotionIntro';
// import Referral from '../screens/Home/Referral';
// import UserFriends from '../screens/Home/UserFriends';
import Terms from '../screens/Home/Terms/Terms';
import MyProducts from '../screens/Home/MyProducts';
import Settings from '../screens/Settings/Settings';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import ProductDetails from '../screens/ProductDetails';
import Profile from '../screens/Profile';
import SpecialProducts from '../screens/SpecialProducts';
import RegisterRequest from '../screens/RegisterRequest';
import RegisterRequestSuccessfully from '../screens/RegisterRequest/RegisterRequestSuccessfully';
import Payment from '../screens/Payment';
import RegisterProduct from '../screens/RegisterProduct';
import ExtraProductCapacity from '../screens/Home/PromoteRegistration/ExtraProductCapacity';
import ExtraBuyAdCapacity from '../screens/Home/PromoteRegistration/ExtraBuyAdCapacity';
import ProductsList from '../screens/ProductsList';
import RegisterProductSuccessfully from '../screens/RegisterProduct/RegisterProductSuccessfully';
import Messages from '../screens/Messages';

import AsyncStorage from '@react-native-community/async-storage';





const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
}


const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


export const routeToScreensFromNotifications = (remoteMessage, props) => {
  console.warn('ert', props)
  const { userProfile = {}, message } = props;
  const { user_info = {} } = userProfile;
  let { is_seller } = user_info;
  is_seller = is_seller == 0 ? false : true;

  switch (remoteMessage.data.BTarget) {
    case 'messages': {
      return navigationRef.current.navigate('Messages');
    }
    case 'myProducts': {
      if (is_seller) {
        return navigationRef.current.navigate('MyBuskool', { screen: 'MyProducts' });
      }
      else {
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    case 'dashboard': {
      if (is_seller) {
        return navigationRef.current.navigate('MyBuskool', { screen: 'Dashboard' });
      }
      else {
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    case 'registerProduct': {
      if (is_seller) {
        return navigationRef.current.navigate('RegisterProductStack', { screen: 'RegisterProduct' });
      }
      else {
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    case 'registerBuyAd': {
      if (!is_seller) {
        return navigationRef.current.navigate('RegisterRequest');
      }
      else {
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    case 'specialProducts': {
      if (!is_seller) {
        return navigationRef.current.navigate('SpecialProducts');
      }
      else {
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    case 'productList': {
      if (remoteMessage.data.productId) {
        return navigationRef.current.navigate('Home', { screen: 'ProductDetails', params: { productId: remoteMessage.data.product_id } });
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
        return navigationRef.current.navigate('MyBuskool', { screen: 'ChangeRole' });
      }
    }
    default:
      return navigationRef.current.navigate('Home');
  }
}

const App = (props) => {
  const RNAppUpdate = NativeModules.RNAppUpdate;

  // console.disableYellowBox = true;
  const { userProfile = {}, message } = props;
  const { user_info = {} } = userProfile;
  let { is_seller } = user_info;
  is_seller = is_seller == 0 ? false : true;

  const [initialRoute, setInitialRoute] = useState(is_seller ? 'RegisterProductStack' : 'RegisterRequest');
  let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());
  // let [backgroundIncomingMessage, setBackgroundIncomingMessage] = useState(false);
  let [updateModalFlag, setUpdateModalFlag] = useState(false);
  let unsubscribe;


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

    remoteConfig()
      .setDefaults({
        appVersion: '1.1.2.997',
      })
      .then(() => {
        console.log('Default values set.');
      });

    if (!props.loggedInUserId) {
      AsyncStorage.getItem('@isIntroductionSeen').then(result => {
        if (JSON.parse(result)) {
          navigationRef.current.navigate('SignUp')
        }
        else navigationRef.current.navigate('Intro')
        setTimeout(() => {
          SplashScreen.hide();
        }, 200);

      })
    }
    else {
      SplashScreen.hide();
    }

    Linking.addEventListener('url', handleIncomingEvent)
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
      // return unsubscribe
    }

  }, [initialRoute, is_seller]);

  const linking = {
    prefixes: ['buskool://Home'],
  };
  const handleIncomingEvent = event => {
    switch ((event.url).split('://')[1]) {
      case 'pricing':
        return RootNavigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });

      case 'product-list':
        return RootNavigation.navigate('Home');

      case 'register-product': {
        return navigationRef.current.navigate('RegisterProductStack', { screen: 'RegisterProduct' });
      }
      case 'buyAd-requests': {
        AsyncStorage.getItem('@registerProductParams').then(result => {
          result = JSON.parse(result);
          if (result && result.subCategoryId && result.subCategoryName) {
            return navigationRef.current.navigate('Requests', { subCategoryId: result.subCategoryId, subCategoryName: result.subCategoryName });
          }
          return navigationRef.current.navigate('Requests');
        })
      }
      default:
        break;
    }
  };






  const MyBuskoolStack = (props) => {
    return (
      <Stack.Navigator
        initialRouteName={global.initialProfileRoute}
      // initialRouteName={'ChangeRole'}
      >
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='HomeIndex'
          name='HomeIndex'
          component={Home}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='dashboard'
          name='Dashboard'
          component={Dashboard}
        />

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='MyProducts'
          name='MyProducts'
          component={MyProducts}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='PromoteRegistration'
          name='PromoteRegistration'
          component={PromoteRegistration}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='EditProfile'
          name='EditProfile'
          component={EditProfile}
        />
        {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Referral'
          name='Referral'
          component={Referral}
        /> */}
        {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='UserFriends'
          name='UserFriends'
          component={UserFriends}
        /> */}
        {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='PromotionIntro'
          name='PromotionIntro'
          component={PromotionIntro}
        /> */}
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Settings'
          name='Settings'
          component={Settings}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ChangePassword'
          name='ChangePassword'
          component={ChangePassword}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Terms'
          name='Terms'
          component={Terms}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ProductDetails'
          name='ProductDetails'
          component={ProductDetails}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Profile'
          name='Profile'
          component={Profile}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Payment'
          name='Payment'
          component={Payment}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ChangeRole'
          name='ChangeRole'
          component={ChangeRole}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ExtraBuyAdCapacity'
          name='ExtraBuyAdCapacity'
          component={ExtraBuyAdCapacity}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ExtraProductCapacity'
          name='ExtraProductCapacity'
          component={ExtraProductCapacity}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ContactUs'
          name='ContactUs'
          component={ContactUs}
        />
        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Authentication'
          name='Authentication'
          component={Authentication}
        />
      </Stack.Navigator >
    )
  };


  const RegisterProductStack = () => (
    <Stack.Navigator>

      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        key='RegisterProduct'
        name='RegisterProduct'
        component={RegisterProduct}
      />


      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        name={`PromoteRegistration`}
        component={PromoteRegistration}
      />


      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        key='RegisterProductSuccessfully'
        name='RegisterProductSuccessfully'
        component={RegisterProductSuccessfully}
      />
      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        name={`UpgradeApp`}
        component={UpgradeApp}
      />
    </Stack.Navigator>
  )

  const RegisterRequestStack = () => (
    <Stack.Navigator>

      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        key='RegisterRequest'
        name='RegisterRequest'
        component={RegisterRequest}
      />


      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        name={`RegisterRequestSuccessfully`}
        component={RegisterRequestSuccessfully}
      />
      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        name={`UpgradeApp`}
        component={UpgradeApp}
      />


    </Stack.Navigator>
  )

  const MessagesStack = () => (
    <Stack.Navigator>

      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        key='Message'
        name='Messages'
        component={Messages}
      />


      <Stack.Screen
        options={({ navigation, route }) => ({
          headerShown: false,
          title: null,
        })}
        name={`Profile`}
        component={Profile}
      />
    </Stack.Navigator>
  )


  const HomeStack = (props) => {
    return (
      <Stack.Navigator>

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='ProductsList'
          name='ProductsList'
          component={ProductsList}
        />


        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          name={`ProductDetails`}
          component={ProductDetails}
        />


        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Payment'
          name='Payment'
          component={Payment}
        />

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='PromoteRegistration'
          name='PromoteRegistration'
          component={PromoteRegistration}
        />

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Profile'
          name='Profile'
          component={Profile}
        />

      </Stack.Navigator>
    )
  };

  const SpecialProductsStack = (props) => {
    return (
      <Stack.Navigator>

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='SpecialProducts'
          name='SpecialProducts'
          component={SpecialProducts}
        />


        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          name={`ProductDetails`}
          component={ProductDetails}
        />


        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Payment'
          name='Payment'
          component={Payment}
        />

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='PromoteRegistration'
          name='PromoteRegistration'
          component={PromoteRegistration}
        />

        <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Profile'
          name='Profile'
          component={Profile}
        />

      </Stack.Navigator>
    )
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
            <Button
              onPress={() => setUpdateModalFlag(false)}
              style={styles.closeDialogModal}>
              <FontAwesome5 name="times" color="#777" solid size={18} />
            </Button>
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
                setUpdateModalFlag(false);
                setTimeout(() => {
                  navigationRef.current.navigate('UpgradeApp');
                }, 200);
              }}
            >

              <Text style={styles.buttonText}>{locales('titles.installIt')}
              </Text>
            </Button>
          </View>
          <Dialog.Actions style={{
            justifyContent: 'center',
            width: '100%',
            padding: 0
          }}>
            <Button
              style={[styles.modalCloseButton,]}
              onPress={() => setUpdateModalFlag(false)}>

              <Text style={styles.closeButtonText}>{locales('titles.cancel')}
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal >

      {(props.userProfileLoading || props.logOutLoading) ?
        <View style={{
          backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
          position: 'absolute',

          elevation: 5,
          borderColor: 'black',
          backgroundColor: 'white',
        }}>
          <ActivityIndicator size="large"
            style={{
              position: 'absolute', left: '44%', top: '40%',

              elevation: 5,
              borderColor: 'black',
              backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
            }}
            color="#00C569"

          />
        </View> : null}

      <NavigationContainer
        linking={linking}
        fallback={<Text>Loading...</Text>}
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
      >


        {(!props.loggedInUserId) ?
          (
            <Stack.Navigator
              headerMode='none'>
              <Stack.Screen key='SignUp' name='SignUp' component={SignUp} />
              <Stack.Screen key='Intro' name='Intro' component={Intro} />
              <Stack.Screen key='UpgradeApp' name='UpgradeApp' component={UpgradeApp} />
            </Stack.Navigator>
          )
          : (
            <Tab.Navigator
              initialRouteName={initialRoute}
              shifting={false}
              activeColor="#00C569"
              inactiveColor="#FFFFFF"
              barStyle={{ backgroundColor: '#313A43' }
              }
            >



              <Tab.Screen

                options={{
                  tabBarBadge: false,
                  tabBarLabel: locales('labels.home'),
                  tabBarIcon: ({ focused, color }) => <Octicons size={25} name='home' color={color} />,
                }}
                name='Home'
                component={HomeStack}
              />

              {is_seller ? <Tab.Screen
                key={'Requests'}
                options={{
                  tabBarBadge: false,
                  tabBarLabel: locales('labels.requests'),
                  tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
                }}
                name={'Requests'}
                component={Requests}
              />
                :
                <Tab.Screen
                  key={'SpecialProducts'}
                  options={{
                    tabBarBadge: false,
                    tabBarLabel: locales('labels.specialProducts'),
                    tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
                  }}
                  name={'SpecialProducts'}
                  component={SpecialProductsStack}
                />}



              {is_seller ? <Tab.Screen
                key={'RegisterProduct'}
                listeners={{
                  tabPress: e => {
                    if (!!global.resetRegisterProduct)
                      global.resetRegisterProduct(true)
                  },
                }}
                options={{
                  tabBarBadge: false,
                  tabBarLabel: locales('labels.registerProduct'),
                  tabBarIcon: ({ focused, color }) => <View style={{ backgroundColor: color, height: 30, width: 30, top: -4, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}><FontAwesome5 size={18} name='plus' solid color={!!focused ? '#fff' : '#00C569'} /></View>,
                }}
                name={'RegisterProductStack'}
                component={RegisterProductStack}
              />
                :
                <Tab.Screen
                  key={'RegisterRequest'}
                  listeners={{
                    tabPress: e => {
                      if (!!global.resetRegisterRequest)
                        global.resetRegisterRequest(true)
                    },
                  }}
                  options={{
                    tabBarBadge: false,
                    tabBarLabel: locales('labels.registerRequest'),
                    tabBarIcon: ({ focused, color }) => <View style={{ backgroundColor: color, height: 30, width: 30, top: -4, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}><FontAwesome5 size={18} name='plus' solid color={!!focused ? '#fff' : '#00C569'} /></View>,
                  }}
                  name={'RegisterRequest'}
                  component={RegisterRequestStack}
                />}


              <Tab.Screen
                key='Messages'
                options={{
                  tabBarBadge: false,
                  tabBarLabel: locales('labels.messages'),
                  tabBarIcon: ({ focused, color }) => <Entypo size={25} name='message' color={color} />,
                }}
                name='Messages'
                component={MessagesStack}
              />

              <Tab.Screen
                listeners={{
                  tabPress: e => {
                    navigationRef.current.navigate('MyBuskool', { screen: 'HomeIndex' })
                  },
                }}
                key={'MyBuskool'}
                options={{
                  tabBarBadge: false,
                  tabBarLabel: locales('labels.myBuskool'),
                  tabBarIcon: ({ focused, color }) => (
                    <Image
                      style={{
                        borderRadius: deviceWidth * 0.032,
                        width: deviceWidth * 0.064, height: deviceWidth * 0.064
                      }}
                      source={!!userProfile && !!userProfile.profile && userProfile.profile.profile_photo &&
                        userProfile.profile.profile_photo.length ?
                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${userProfile.profile.profile_photo}` }
                        : require('../../assets/icons/user.png')
                      }
                    />
                  ),
                }}
                name='MyBuskool'
                component={MyBuskoolStack}
              />
            </Tab.Navigator>

          )
        }

      </NavigationContainer >
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

    userProfile: state.profileReducer.userProfile,
    userProfileLoading: state.profileReducer.userProfileLoading,

    productDetailsId: state.productsListReducer.productDetailsId,

    // subCategoryId: state.registerProductReducer.subCategoryId,
    // subCategoryName: state.registerProductReducer.subCategoryName
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
    // newMessageReceived: message => dispatch(messagesActions.newMessageReceived(message)),
    changeRole: _ => dispatch(authActions.changeRole()),
  }
}

const areEqual = (prevProps, nextProps) => {
  // if (
  //     global.initialProfileRoute == 'EditProfile'
  // ) {
  //     global.initialProfileRoute = 'HomeIndex';
  //     return false;
  // }
  // if (prevProps.userProfile != nextProps.userProfile)
  //     return true
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(App, areEqual))