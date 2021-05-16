

import React, { useEffect } from 'react';
import { Text, View, BackHandler, StyleSheet, Image, ScrollView, ToastAndroid, Linking } from 'react-native';
import { Button, Item, Input } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceWidth, deviceHeight } from '../../../utils';
import Clipboard from "@react-native-community/clipboard";

import UserFriends from '../UserFriends/UserLists'
import Header from '../../../components/header';


const Referral = props => {

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backChangesHandler)
        return _ => BackHandler.removeEventListener('hardwareBackPress', backChangesHandler)
    }, [])

    const backChangesHandler = _ => {
        props.navigation.goBack()
    };

    const openSms = () => {
        let url = 'sms:?body=سلام این لینک باسکول هست';

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    'پیامک در دسترس نیست',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    5,
                    20)
            }
        })
    }


    const openWhatsApp = () => {
        let url = 'whatsapp://send?text=سلام این لینک باسکول هست';

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    'نرم افزار واتساپ نصب نیست',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    5,
                    20)
            }
        })
    }


    return (
        <>
            <Header
                title={locales('titles.referralMainTitle')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />
            <ScrollView style={{
                backgroundColor: '#fff',
                flex: 1,
            }}>
                <View style={{
                    borderBottomWidth: 2,
                    borderBottomColor: '#efefef',
                    paddingBottom: 10,
                    alignItems: 'center',

                }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#556080',
                        textAlign: 'center',
                        paddingVertical: 10
                    }}>
                        {/* <Text style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}>
                        {locales('titles.referralMainTitle')}

                    </Text> */}
                        <Text style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}>
                            {locales('titles.referralFirstMainTitle')}
                        </Text>
                        <Text style={{
                            color: '#00C569',
                            marginHorizontal: 5,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                        }}>
                            {locales('titles.referralSecondMainTitle')}
                        </Text>

                        <Text style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}>
                            {locales('titles.referralThirdMainTitle')}
                        </Text>
                    </Text>

                    <Image source={require('./../../../../assets/images/gift-card.png')}
                        style={{
                            width: deviceWidth * 0.7,
                            height: deviceHeight * 0.30
                        }}
                    />
                    <Text style={{
                        color: "#777",
                        paddingHorizontal: 5,
                        textAlign: 'center',
                        paddingTop: 14
                    }}>
                        {locales('titles.referralMainPageContents')}

                    </Text>

                </View>

                <View style={{
                    alignItems: 'center',

                }}>
                    <Text style={{
                        fontSize: 20,
                        paddingTop: 5,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#555',
                    }}>
                        {locales('titles.referralTitle')}
                        <Text style={{
                            fontSize: 22,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#00C569',
                        }}>
                            25,000,000
                                     </Text>

                        {locales('titles.toman')}

                    </Text>

                    {/* <Button
                        style={[styles.loginButton, { width: '55%', marginTop: 0, marginBottom: 0, elevation: 0, height: 40, alignSelf: 'center' }]}
                    >
                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>

                            {locales('titles.referralButton')}

                        </Text>
                    </Button> */}
                </View>

                <View style={{
                    width: '100%',
                    paddingBottom: 20
                }}>

                    <View style={{
                        padding: 10,

                    }}>
                        {/* <Text style={{
                            color: '#556080',
                            marginHorizontal: 5,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                        }}>
                            {locales('titles.referralShareButton')}

                        </Text> */}

                        <View style={{
                            flexDirection: 'row-reverse',
                            paddingTop: 5
                        }}>
                            <Button

                                onPress={openWhatsApp}
                                style={[styles.iconWrapper, { backgroundColor: '#00C569' }]}>
                                <FontAwesome5 name="whatsapp" color="#fff" size={23} />
                                <Text style={styles.iconContents}>
                                    {locales('titles.whatsapp')}
                                </Text>
                            </Button>
                            {/* <Button style={[styles.iconWrapper, { marginLeft: 3 }]}>

                                <FontAwesome5 name="instagram" color="#777" size={15} />
                                <Text style={styles.iconContents}>
                                    {locales('titles.instagram')}
                                </Text>
                            </Button>
                            <Button style={[styles.iconWrapper, { marginLeft: 3 }]}>

                                <FontAwesome5 name="telegram-plane" color="#777" size={15} />
                                <Text style={styles.iconContents}>
                                    {locales('titles.telegram')}

                                </Text>
                            </Button> */}
                            <Button
                                onPress={openSms}
                                style={[styles.iconWrapper, { borderWidth: 2, borderColor: '#777', backgroundColor: '#fff', marginLeft: 5 }]}>

                                <FontAwesome5 name="comment-alt" color="#777" size={20} />
                                <Text style={[styles.iconContents, { color: '#777' }]}>
                                    {locales('titles.sms')}

                                </Text>
                            </Button>
                        </View>
                    </View>


                    <View style={{

                        paddingHorizontal: 10
                    }}>


                        <View>
                            <Item style={{
                                borderBottomWidth: 0,
                                marginTop: 10
                            }}>
                                <Input disabled style={{ fontSize: 14, height: 35, color: '#777', padding: 5, margin: 0, backgroundColor: '#eee', borderWidth: 0, borderRadius: 4, textAlign: 'left' }} placeholder="https://buskool.com/profile/del" />
                                <Button
                                    onPress={() => {
                                        ToastAndroid.showWithGravityAndOffset(
                                            locales('titles.copiedToClipboard'),
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            5,
                                            20)
                                        Clipboard.setString('https://buskool.com/profile/del')
                                    }}
                                    style={{
                                        backgroundColor: '#556080',
                                        paddingHorizontal: 20,
                                        height: 35,
                                        elevation: 0
                                    }}>
                                    <Text style={{
                                        color: '#fff',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    }}>
                                        کپی
</Text>
                                </Button>
                            </Item>
                        </View>
                    </View>
                </View>

                <UserFriends />
            </ScrollView>

        </>
    )
}


const styles = StyleSheet.create({

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '70%',
        color: 'white',
    },
    iconWrapper: {
        flex: 1,
        flexDirection: 'row-reverse',
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',

        elevation: 0
    },
    iconContents: {
        color: '#fff',
        fontSize: 16,
        marginRight: 3,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
    }
});


export default Referral