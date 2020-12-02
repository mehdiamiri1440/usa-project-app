import React from 'react';
import analytics from '@react-native-firebase/analytics';
import {
    Text, TouchableOpacity, View, StyleSheet, Image, ToastAndroid, Linking
} from 'react-native';
import { Button } from 'native-base';
import Clipboard from "@react-native-community/clipboard";

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { deviceHeight } from '../../../utils/deviceDimenssions';
class ContactUs extends React.Component {

    componentDidMount() {
        analytics().logEvent('support');
    }
    render() {
        return (
            <>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('titles.support')}
                        </Text>
                    </View>
                </View>


                <View style={{
                    padding: 15,
                    borderRadius: 5,
                    flex: 1,
                    backgroundColor: '#fff',

                }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}
                    >
                        <View style={{
                            // position: 'absolute',
                            // bottom: 45,
                            width: '100%',
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                style={{
                                    height: 75,
                                    width: 75,

                                }}
                                resizeMode={"contain"}
                                source={require('../../../../assets/icons/main-logo.png')}
                            />
                        </View>
                        <Text

                            style={{
                                textAlign: 'center',
                                marginVertical: 15,
                                fontSize: 23,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}

                        >
                            {locales('titles.contactUs')}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                paddingHorizontal: 15,
                                fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Medium'
                            }}
                        >
                            {locales('titles.phoneNumber')}
                        </Text>
                        <View style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                                <FontAwesome5 name="phone" solid size={15} style={{
                                    paddingTop: 15,
                                    color: '#00c569'
                                }} />
                                <Text
                                    onPress={() => {
                                        ToastAndroid.showWithGravityAndOffset(
                                            locales('titles.copiedToClipboard'),
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            5,
                                            20)
                                        Clipboard.setString('09178928266')
                                    }}
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}
                                >
                                    09178928266
                            </Text>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                                <FontAwesome5 name="phone" solid size={15} style={{
                                    paddingTop: 10,
                                    color: '#00c569'
                                }} />
                                <Text
                                    onPress={() => {
                                        ToastAndroid.showWithGravityAndOffset(
                                            locales('titles.copiedToClipboard'),
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            5,
                                            20)
                                        Clipboard.setString('‌09118413054')
                                    }}
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}
                                >
                                    ‌09118413054
                            </Text>

                            </View>
                        </View>

                        <Text style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginVertical: 15

                        }}>
                            شبکه های اجتماعی
                    </Text>
                        <View style={{
                            justifyContent: 'space-around',
                            flexDirection: 'row',

                        }}>
                            <Button
                                style={{
                                    backgroundColor: 'none',
                                    elevation: 0
                                }}
                                onPress={() => {
                                    Linking.canOpenURL('instagram://user?username=buskool.ir').then((supported) => {
                                        if (!!supported) {
                                            Linking.openURL('instagram://user?username=buskool.ir')
                                        } else {
                                            Linking.openURL('https://www.instagram.com/buskool.ir')
                                        }
                                    })
                                        .catch(() => {
                                            Linking.openURL('https://www.instagram.com')
                                        })
                                }}
                            >
                                <Text
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 15,
                                        width: 45,
                                        height: 45,
                                        alignItems: 'center',
                                        elevation: 4,
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        paddingTop: 6,
                                        backgroundColor: '#556080'
                                    }}>
                                    <FontAwesome5 size={30} name="instagram" solid color="#fff" />
                                </Text>
                            </Button>
                            {/* <Button
                                style={{
                                    backgroundColor: 'none',
                                    elevation: 0
                                }}
                                onPress={() => {
                                    Linking.canOpenURL('fb://profile/buskool1').then((supported) => {
                                        if (!!supported) {
                                            Linking.openURL('fb://profile/buskool1')
                                        } else {
                                            Linking.openURL('https://www.facebook.com/buskool1/')
                                        }
                                    })
                                        .catch(() => {
                                            Linking.openURL('https://www.facebook.com/')
                                        })
                                }}
                            >
                                <Text
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 15,
                                        width: 45,
                                        height: 45,
                                        alignItems: 'center',
                                        elevation: 4,
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        paddingTop: 10,
                                        backgroundColor: '#556080'

                                    }}>
                                    <FontAwesome5 size={23} name="facebook-f" color="#fff" />
                                </Text>
                            </Button> */}
                            {/* <Button
                                style={{
                                    backgroundColor: 'none',
                                    elevation: 0
                                }}
                                onPress={() => {
                                    Linking.canOpenURL('twitter://buskool_BS').then((supported) => {
                                        if (!!supported) {
                                            Linking.openURL('twitter://buskool_BS')
                                        } else {
                                            Linking.openURL('https://twitter.com/buskool_BS')
                                        }
                                    })
                                        .catch(() => {
                                            Linking.openURL('https://twitter.com/')
                                        })
                                }}
                            >
                                <Text
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 15,
                                        width: 45,
                                        height: 45,
                                        alignItems: 'center',
                                        elevation: 4,
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        paddingTop: 10,
                                        backgroundColor: '#556080'

                                    }}>
                                    <FontAwesome5 size={23} name="twitter" color="#fff" />
                                </Text>
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: 'none',
                                    elevation: 0
                                }}
                                onPress={() => {
                                    Linking.canOpenURL('https://www.linkedin.com/company/27058131/').then((supported) => {
                                        if (!!supported) {
                                            Linking.openURL('https://www.linkedin.com/company/27058131/')
                                        } else {
                                            Linking.openURL('https://www.linkedin.com/company/27058131/')
                                        }
                                    })
                                        .catch(() => {
                                            Linking.openURL('https://www.linkedin.com/')
                                        })
                                }}
                            >
                                <Text
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 15,
                                        width: 45,
                                        height: 45,
                                        alignItems: 'center',
                                        elevation: 4,
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        paddingTop: 10,
                                        backgroundColor: '#556080'

                                    }}>
                                    <FontAwesome size={23} name="linkedin" color="#fff" />
                                </Text>
                            </Button> */}
                            <Button
                                style={{
                                    backgroundColor: 'none',
                                    elevation: 0
                                }}
                                onPress={() => {
                                    Linking.canOpenURL('tg://resolve?domain=buskool').then((supported) => {
                                        if (!!supported) {
                                            Linking.openURL('tg://resolve?domain=buskool')
                                        } else {
                                            Linking.openURL('https://t.me/buskool')
                                        }
                                    })
                                        .catch(() => {
                                            Linking.openURL('https://t.me/buskool')
                                        })
                                }}
                            >
                                <Text
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 15,
                                        width: 45,
                                        height: 45,
                                        alignItems: 'center',
                                        elevation: 4,
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        paddingTop: 10,
                                        backgroundColor: '#556080'

                                    }}>
                                    <FontAwesome size={23} name="telegram" color="#fff" />
                                </Text>
                            </Button>
                        </View>

                    </View>



                </View>
            </>
        )
    }
}
export default ContactUs