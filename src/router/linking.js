import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStateFromPath } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import { navigationRef } from './rootNavigation';
import * as RootNavigation from './rootNavigation';
import { dataGenerator } from '../utils';
import configureStore from '../redux/configureStore';

const store = configureStore();

const config = {
    screens: {
        RequestsStack: {
            path: "buyAd-requests",
        },
        RegisterProductStack: {
            screens: {
                RegisterProduct: {
                    path: "register-product",
                },
            },
        },
        Home: {
            screens: {
                ProductsList: {
                    path: "product-list",
                },
            },
        },
        MyBuskool: {
            screens: {
                PromoteRegistration: {
                    path: "pricing",
                },
                Authentication: {
                    path: "verification",
                },
                ChangeRole: {
                    path: "change-role/:parentRoute/:childRoute/:routeParams?",
                    parse: {
                        parentRoute: parentRoute => `${parentRoute}`,
                        childRoute: childRoute => `${childRoute}`,
                        routeParams: routeParams => JSON.parse(routeParams)
                    }
                },
                SignUp: {
                    path: "sign-up/:parentRoute?/:targetRoute?",
                    parse: {
                        parentRoute: parentRoute => `${parentRoute}`,
                        targetRoute: targetRoute => `${targetRoute}`
                    }
                },
            },
        },
        RegisterProductSuccessfully: {
            path: "register-product-successfully",
        },
        Messages: {
            screens: {
                Profile: {
                    path: "shared-profile/:user_name",
                    parse: {
                        user_name: user_name => `${user_name}`
                    }
                },
                Channel: {
                    path: "public-channel/:id",
                    parse: {
                        id: id => `${id}`
                    },
                },
                MessagesIndex: {
                    path: 'buyers/:tabIndex',
                    parse: {
                        tabIndex: tabIndex => Number(tabIndex)
                    },
                },
            }
        },
        SpecialProducts: {
            path: "special-products",
        },
    },
};

const linking = {
    prefixes: [
        "buskool://",
        "https://www.buskool.com",
        "http://www.buskool.com",
        "http://www.alidelkhosh.ir",
        "https://www.alidelkhosh.ir",
        "http://alidelkhosh.ir",
        "http://buskool.com",
        "https://alidelkhosh.ir",
        "https://buskool.com"
    ],
    config,
    getInitialURL: async _ => {
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();
        if (url != null) {
            handleIncomingEvent(url)
            return url;
        }

        messaging().getInitialNotification()
            .then(async remoteMessage => {
                return await routeToScreensFromNotifications(remoteMessage);
            });

        // Get deep link from data
        // if this is undefined, the app will open the default/home page

    },
    getStateFromPath: (path, options) => {

        if (path.includes('seller'))
            path = path.replace("/seller/", "")

        if (path.includes('buyers')) {
            if (!global.meInfo.loggedInUserId)
                path = path.replace('/buyers', "/sign-up/buyers")

            else if (global.meInfo.is_seller == 1) {
                path = path.replace("/buyers", `/buyers/1`)
            }
            else {
                const routeParams = JSON.stringify({ tabIndex: 1 });
                path = path.replace('/buyers', `/change-role/Messages/MessagesIndex/${routeParams}`)
            }
        }

        if (path.includes('pricing')) {
            if (!global.meInfo.loggedInUserId)
                path = path.replace('/pricing', "/sign-up/pricing");
            else if (global.meInfo.is_seller == 0) {
                path = path.replace('/pricing', `/change-role/MyBuskool/PromoteRegistration`)
            }
        }

        if (path.includes('msg')) {
            if (!global.meInfo.loggedInUserId)
                path = path.replace('/msg', "/sign-up/msg")
            else
                path = path.replace("/msg", `/buyers/0`)
        }

        if (path.includes('profile'))
            path = path.replace("/profile/", "")
        return getStateFromPath(path, options);
    },

    subscribe: (listener) => {
        const onReceiveURL = ({ url }) => {
            handleIncomingEvent(url)
            return listener(url)
        };

        Linking.addEventListener('url', onReceiveURL);

        const unsubscribeNotification = messaging().onNotificationOpenedApp(
            async (remoteMessage = {}) => {
                // Any custom logic to check whether the URL needs to be handled
                !!routeToScreensFromNotifications ? await routeToScreensFromNotifications(remoteMessage) : null
                // Call the listener to let React Navigation handle the URL
                listener(remoteMessage);
            },
        );

        return () => {
            // Clean up the event listener
            Linking.removeEventListener('url', onReceiveURL);
            unsubscribeNotification();
        };
    },
};

let counter = 0;


const handleIncomingEvent = (url) => {
    if (url) {
        if (!url.includes('www')) {
            url = url.split('://')[1]
        }
        else {
            url = url.split('/')[3]
        }
    }
    // if (url.includes('public-channel')) {
    //     return navigationRef.current.navigate('Messages', {
    //         screen: 'Channel',
    //     });
    // }
    switch (url) {
        case 'register-product-successfully':
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
                    return navigationRef.current.navigate('RequestsStack', {
                        needToRefreshKey: dataGenerator.generateKey('buy_ads_from_buy_ads_requests_'),
                        subCategoryId: result.subCategoryId, subCategoryName: result.subCategoryName
                    });
                }
                return navigationRef.current.navigate('RequestsStack', { needToRefreshKey: dataGenerator.generateKey('buy_ads_from_buy_ads_requests_') });
            })
        };
        case 'wallet': {
            return navigationRef.current.navigate('MyBuskool', {
                screen: 'Wallet',
                params: {
                    needToRefreshKey: dataGenerator.generateKey('wallet_from_bank_'),
                }
            });
        };
        case 'my-buskool': {
            return navigationRef.current.navigate('MyBuskool', {
                screen: 'HomeIndex',
                params: {
                    needToRefreshKey: dataGenerator.generateKey('my_buskool_from_bank_'),
                }
            });
        }
        default:
            break;
    }
};

export const routeToScreensFromNotifications = (remoteMessage = {}) => {

    const { userProfile = {} } = store.getState().profileReducer;
    const { user_info = {} } = userProfile;
    let { is_seller } = user_info;
    is_seller = is_seller == 0 ? false : true;

    if (navigationRef.current) {
        switch (remoteMessage?.data?.BTarget) {
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
                    return navigationRef.current.navigate('RegisterRequestStack', { screen: 'RegisterRequest' });
                }
                else {
                    return navigationRef.current.navigate('MyBuskool',
                        { screen: 'ChangeRole', params: { parentRoute: 'RegisterRequestStack', childRoute: 'RegisterRequest' } });
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
                if (remoteMessage?.data?.productId) {
                    return navigationRef.current.navigate('Home', {
                        screen: 'ProductDetails',
                        params: { productId: remoteMessage?.data?.productId }
                    });
                }
                return navigationRef.current.navigate('Home');
            }
            case 'myBuskool': {
                return navigationRef.current.navigate('MyBuskool');
            }
            case 'buyAds': {
                if (is_seller) {
                    return navigationRef.current.navigate('RequestsStack');
                }
                else {
                    return navigationRef.current.navigate('MyBuskool',
                        { screen: 'ChangeRole', params: { parentRoute: 'RequestsStack' } });
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
                break;
        }
    }
    else {
        if (counter <= 2) {
            // I used counter variable to make sure that this recursive function calling will not occures more than 3 times and
            // prevent any looping inside app that can cause any crash
            counter = counter + 1
            return setTimeout(() => {
                return routeToScreensFromNotifications(remoteMessage)
            }, 1000);
        }
    }
}

export default linking;