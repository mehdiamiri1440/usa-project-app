import { Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { navigationRef, RootNavigation } from './rootNavigation';
import { dataGenerator } from '../utils';

const config = {
    screens: {
        Messages: {
            screens: {
                Channel: {
                    path: "public-channel/:id",
                    parse: {
                        id: (id) => `${id}`,
                    },
                },
            },
        },
        Requests: {
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
            },
        },
        RegisterProductSuccessfully: {
            path: "register-product-successfully",
        },
    },
};

const linking = {
    prefixes: ["buskool://", "https://www.buskool.com", "http://www.buskool.com",
        "http://www.alidelkhosh.ir", "https://www.alidelkhosh.ir"
    ],
    config,
    getInitialURL: async _ => {
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();
        console.log('url11', url)
        if (url != null) {
            handleIncomingEvent(url)
            return url;
        }
    },
    subscribe: (listener) => {
        const onReceiveURL = ({ url }) => {
            console.log('ur2222', url)
            handleIncomingEvent(url)
            return listener(url)
        };

        Linking.addEventListener('url', onReceiveURL);

        return () => {
            // Clean up the event listener
            Linking.removeEventListener('url', onReceiveURL);
        };
    },
};



const handleIncomingEvent = (url) => {
    console.log('url', url)
    if (!url.includes('wwww')) {
        url = url.split('://')[1]
    }
    else {
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

export default linking;