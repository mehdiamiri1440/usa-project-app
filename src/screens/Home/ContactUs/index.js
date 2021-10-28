import React from 'react';
import analytics from '@react-native-firebase/analytics';
import {
    Text,
    View,
    Image,
    ToastAndroid,
    Linking,
    Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg,
{ Path }
    from "react-native-svg";
import ShadowView from '@vikasrg/react-native-simple-shadow-view';
import Clipboard from "@react-native-community/clipboard";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Header from '../../../components/header';
class ContactUs extends React.Component {

    componentDidMount() {
        analytics().logEvent('support');
    }

    openSocialApp = app => {

        let url = '', failUrl = '';

        switch (app) {
            case 'whatsapp': {
                url = `whatsapp://send?phone=+989178928266`;
                failUrl = 'https://www.whatsapp.com'
                break;
            }
            case 'telegram': {
                url = 'tg://resolve?domain=buskool';
                failUrl = 'https://t.me/buskool'
                break;
            }
            case 'instagram': {
                url = 'instagram://user?username=buskool.ir';
                failUrl = 'https://www.instagram.com/buskool.ir'
                break;
            }
            default:
                break;
        };

        return Linking.canOpenURL(url).then((supported) => {
            if (!!supported)
                Linking.openURL(url)
            else
                Linking.openURL(failUrl)

        })
            .catch(() => Linking.openURL(failUrl));
    };

    render() {
        return (
            <>
                <Header
                    title={locales('titles.support')}
                    shouldShowAuthenticationRibbonFromProps
                    {...this.props}
                />

                <View style={{
                    padding: 15,
                    borderRadius: 5,
                    flex: 1,
                    backgroundColor: '#fff',

                }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
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
                            alignItems: 'center',
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

                        <ShadowView
                            style={{
                                shadowColor: 'black',
                                shadowOpacity: 0.1,
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 4 },
                                backgroundColor: '#E2F0F5',
                                width: '95%',
                                borderRadius: 12,
                                alignSelf: 'center',
                                marginTop: 30
                            }}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                style={{
                                    width: '100%',
                                    borderColor: '#e0e0e0',
                                    padding: 10,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse'
                                }}
                                onPress={() => this.openSocialApp('whatsapp')}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0, }}
                                        end={{ x: 0, y: 1, }}
                                        colors={['rgba(21,49,60,0.83)', 'rgba(39,182,238,0.72)']}
                                        style={{
                                            borderRadius: 200,
                                            width: 60,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 60
                                        }}
                                    >
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="26"
                                            height="26"
                                            fill="none"
                                            viewBox="0 0 17 17"
                                        >
                                            <Path
                                                fill="#fff"
                                                d="M0 2.125A2.125 2.125 0 012.125 0h12.75A2.125 2.125 0 0117 2.125v8.5a2.125 2.125 0 01-2.125 2.125H4.69c-.282 0-.552.112-.751.311L.907 16.093A.531.531 0 010 15.718V2.125zm5.313 4.25a1.062 1.062 0 10-2.125 0 1.062 1.062 0 002.124 0zm4.25 0a1.062 1.062 0 10-2.125 0 1.062 1.062 0 002.125 0zm3.187 1.063a1.063 1.063 0 100-2.126 1.063 1.063 0 000 2.125z"
                                            ></Path>
                                        </Svg>
                                    </LinearGradient>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 16,
                                            marginHorizontal: 15
                                        }}
                                    >
                                        {locales('titles.messageToSupport')}
                                    </Text>
                                </View>
                                <FontAwesome5
                                    name='angle-left'
                                    size={20}
                                    color='#bebebe'
                                />
                            </Pressable>
                        </ShadowView>

                    </View>

                    <View style={{
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        marginBottom: 60

                    }}>
                        <Pressable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={_ => this.openSocialApp('instagram')}
                        >
                            <Image
                                style={{
                                    width: 30,
                                    height: 30
                                }}
                                source={require('../../../../assets/icons/instagram.png')}
                            />
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginVertical: 15,
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}
                            >
                                {locales('titles.instagram')}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={_ => this.openSocialApp('telegram')}
                        >
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <Path
                                    fill="#57ADD2"
                                    fillRule="evenodd"
                                    d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM12.43 8.859c-1.167.485-3.5 1.49-6.998 3.014-.568.226-.866.447-.893.663-.046.366.412.51 1.034.705.085.027.173.054.263.084.613.199 1.437.432 1.865.441.389.008.823-.152 1.302-.48 3.268-2.207 4.955-3.322 5.061-3.346.075-.017.179-.039.249.024.07.062.063.18.056.212-.046.193-1.84 1.862-2.77 2.726-.29.269-.495.46-.537.504-.094.097-.19.19-.282.279-.57.548-.996.96.024 1.632.49.323.882.59 1.273.856.427.291.853.581 1.405.943.14.092.274.187.405.28.497.355.944.673 1.496.623.32-.03.652-.331.82-1.23.397-2.126 1.179-6.73 1.36-8.628a2.112 2.112 0 00-.02-.472.506.506 0 00-.172-.325c-.143-.117-.365-.142-.465-.14-.451.008-1.143.249-4.476 1.635z"
                                    clipRule="evenodd"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginVertical: 15,
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}
                            >
                                {locales('titles.telegram')}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                ToastAndroid.showWithGravityAndOffset(
                                    locales('titles.copiedToClipboard'),
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    5,
                                    250)
                                Clipboard.setString('‌09118413054')
                            }}
                        >
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <Path
                                    fill="#01B400"
                                    d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z"
                                ></Path>
                                <Path
                                    fill="#fff"
                                    d="M18.997 20C10.466 20.012 3.991 13.46 4 5.003 4 4.45 4.448 4 5 4h2.64c.495 0 .916.364.989.854a12.417 12.417 0 001.015 3.397l.103.222a.707.707 0 01-.23.872c-.818.584-1.13 1.759-.493 2.675.799 1.15 1.806 2.158 2.956 2.957.917.636 2.092.324 2.675-.493a.707.707 0 01.873-.231l.221.102c1.078.5 2.222.842 3.397 1.016.49.073.854.494.854.99V19a1 1 0 01-1.001 1h-.002z"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginVertical: 15,
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}
                            >
                                09118413054
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </>
        )
    }
}
export default ContactUs