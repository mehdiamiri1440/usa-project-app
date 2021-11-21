import React, { useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';
import Svg, { Path, G, Circle } from "react-native-svg";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceHeight } from '../../../utils';

const AuthenticatedSuccessfully = props => {

    const {
        userProfile = {},
        parentRef = null
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_seller,
        active_pakage_type
    } = user_info

    const navigateToOtherPage = _ => {
        if (!!!is_seller)
            return props.navigation.navigate('Home', { screen: 'ProductsList' });
        return props.navigation.navigate('RequestsStack');
    };

    useEffect(_ => {
        parentRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    }, []);

    return (
        <View
            style={{
                flex: 1,
                height: deviceHeight,
            }}
        >
            <LinearGradient
                start={{ x: 0, y: 0.51, z: 1 }}
                end={{ x: 0.8, y: 0.2, z: 1 }}
                colors={['#aef8d6', '#67ce9e']}
                style={{
                    borderRadius: 8,
                    padding: 20,
                    width: '95%',
                    alignSelf: 'center',
                    marginVertical: 15,
                    marginHorizontal: 25,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        opacity: 0.3,
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        top: '-35%',
                        overflow: 'hidden',
                        position: 'absolute',
                    }}
                >
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        opacity: 0.3,
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        left: '-15%',
                        overflow: 'hidden',
                        position: 'absolute',
                    }}
                >
                </View>
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            left: 20,
                            top: -10
                        }}
                        width="46"
                        height="42"
                        fill="none"
                        viewBox="0 0 36 32"
                    >
                        <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                        <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                        <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                        <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                        <Circle cx="16" cy="16" r="15.5" stroke="#000"></Circle>
                        <Path stroke="#000" d="M9.778 16l5.333 4.445 7.111-8.89"></Path>
                    </Svg>
                    <Text
                        style={{
                            marginVertical: 10,
                            textAlign: 'center',
                            color: '#264653',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 18,
                            marginHorizontal: 10
                        }}
                    >
                        {locales('labels.authenticatedSuccessfully')}
                    </Text>
                </View>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'rgba(38,70,83,0.8)',
                        fontFamily: 'IRANSansWeb(FaNum)',
                        fontSize: 15
                    }}
                >
                    {locales('labels.willBeAuthenticatedAfterApprovment')}
                </Text>
            </LinearGradient>
            {/* <View
                style={{
                    backgroundColor: 'rgba(237,248,230,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: deviceWidth * 0.1,
                        height: deviceWidth * 0.2,
                        width: deviceWidth * 0.2,
                        borderWidth: 1,
                        borderColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <FontAwesome
                        name='check'
                        size={50}
                        color='#21ad93'
                    />
                </View>
                <Text
                    style={{
                        marginVertical: 10,
                        textAlign: 'center',
                        color: '#21ad93',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 20
                    }}
                >
                    {locales('labels.authenticatedSuccessfully')}
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#21AD93',
                        paddingHorizontal: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16
                    }}
                >
                    {locales('labels.willBeAuthenticatedAfterApprovment')}
                </Text>
            </View> */}
            <View
                style={{
                    marginTop: 40
                }}
            >
                {!!!is_seller ?
                    <ShadowView
                        style={{
                            backgroundColor: '#E2F0F5',
                            width: '95%',
                            borderRadius: 12,
                            alignSelf: 'center',
                        }}
                    >
                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            style={{
                                width: '100%',
                                borderColor: 'rgba(39, 182, 238, 0.1)',
                                padding: 10,
                                borderRadius: 12,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row-reverse'
                            }}
                            onPress={_ => {
                                analytics().logEvent('suggested_products_in_verification');
                                props.navigation.navigate('SpecialProducts');
                            }
                            }
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
                                    style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        top: 4
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="60%"
                                    height="60%"
                                    fill="none"
                                    viewBox="0 0 29 32"
                                >
                                    <G clipPath="url(#clip0_1623:1329)" filter="url(#filter0_d_1623:1329)">
                                        <G filter="url(#filter1_d_1623:1329)">
                                            <Path
                                                fill="#fff"
                                                d="M24.453 18.587l-9.595 4.777a.908.908 0 01-.716 0l-9.595-4.777c-.195-.097-.195-.257 0-.355l2.298-1.142a.91.91 0 01.717 0l6.58 3.271a.904.904 0 00.716 0l6.58-3.271a.909.909 0 01.717 0l2.298 1.144c.198.096.198.256 0 .353zm0-6.666l-2.298-1.144a.909.909 0 00-.716 0l-6.58 3.275a.913.913 0 01-.717 0l-6.58-3.275a.91.91 0 00-.717 0l-2.298 1.144c-.195.098-.195.258 0 .357l9.595 4.775a.909.909 0 00.716 0l9.595-4.775c.198-.099.198-.259 0-.357zM4.547 6.368l9.595 4.409c.23.09.486.09.716 0l9.595-4.409c.195-.09.195-.238 0-.329l-9.595-4.408a.97.97 0 00-.716 0L4.547 6.039c-.198.09-.198.238 0 .33z"
                                            ></Path>
                                        </G>
                                    </G>
                                </Svg>
                            </LinearGradient>
                            <View>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 17
                                    }}
                                >
                                    {locales('labels.suggestedProducts')}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        fontSize: 15
                                    }}
                                >
                                    {locales('labels.seeSellersProductsList')}
                                </Text>
                            </View>
                            <FontAwesome5
                                name='angle-left'
                                size={20}
                                color='#15313C'
                            />
                        </Pressable>
                    </ShadowView>
                    : <>
                        {active_pakage_type == 0 ?
                            <ShadowView
                                style={{
                                    backgroundColor: '#E2F0F5',
                                    width: '95%',
                                    borderRadius: 12,
                                    alignSelf: 'center',
                                }}
                            >
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    style={{
                                        width: '100%',
                                        borderColor: 'rgba(39, 182, 238, 0.1)',
                                        padding: 10,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row-reverse'
                                    }}
                                    onPress={_ => {
                                        analytics().logEvent('package_promotion_in_verification');
                                        props.navigation.navigate('PromoteRegistration');
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
                                            style={{
                                                top: 4,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center'
                                            }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="60%"
                                            height="60%"
                                            fill="none"
                                            viewBox="0 0 29 28"
                                        >
                                            <G filter="url(#filter0_d_1514:1785)">
                                                <Path
                                                    fill="#fff"
                                                    d="M13.726 1.52L5.362 8.44A1 1 0 005 9.212v8.455c0 .88 1.053 1.33 1.69.724l6.984-6.656a1 1 0 011.369-.01l7.278 6.725c.64.592 1.679.137 1.679-.735V9.22a1 1 0 00-.374-.78l-8.637-6.93a1 1 0 00-1.263.01z"
                                                ></Path>
                                                <Path
                                                    stroke="#fff"
                                                    d="M13.726 1.52L5.362 8.44A1 1 0 005 9.212v8.455c0 .88 1.053 1.33 1.69.724l6.984-6.656a1 1 0 011.369-.01l7.278 6.725c.64.592 1.679.137 1.679-.735V9.22a1 1 0 00-.374-.78l-8.637-6.93a1 1 0 00-1.263.01z"
                                                ></Path>
                                            </G>
                                        </Svg>
                                    </LinearGradient>
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 17
                                            }}
                                        >
                                            {locales('titles.promoteRegistration')}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                fontSize: 15
                                            }}
                                        >
                                            {locales('labels.accessToMoreFeaturesOfBuskool')}
                                        </Text>
                                    </View>
                                    <FontAwesome5
                                        name='angle-left'
                                        size={20}
                                        color='#15313C'
                                    />
                                </Pressable>
                            </ShadowView>
                            : null
                        }
                        <ShadowView
                            style={{
                                backgroundColor: '#E2F0F5',
                                width: '95%',
                                borderRadius: 12,
                                alignSelf: 'center',
                                marginTop: 30,
                            }}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                style={{
                                    width: '100%',
                                    borderColor: 'rgba(39, 182, 238, 0.1)',
                                    padding: 10,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse'
                                }}
                                onPress={_ => {
                                    analytics().logEvent('click_buyads_in_verification');
                                    props.navigation.navigate('RequestsStack');
                                }
                                }
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0, }}
                                    end={{ x: 0, y: 1, }}
                                    colors={[
                                        'rgba(21,49,60,0.83)',
                                        'rgba(39,182,238,0.72)'
                                    ]}
                                    style={{
                                        borderRadius: 200,
                                        width: 60,
                                        height: 60,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Svg
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center'
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="50%"
                                        height="50%"
                                        fill="none"
                                        viewBox="0 0 19 23"
                                    >
                                        <Path
                                            fill="#fff"
                                            d="M10.938 6.11V0H1.953C1.356 0 .875.48.875 1.078v20.844c0 .597.48 1.078 1.078 1.078h15.094c.597 0 1.078-.48 1.078-1.078V7.187h-6.11a1.081 1.081 0 01-1.078-1.078zm7.187-.634v.274h-5.75V0h.274c.288 0 .562.112.764.314l4.398 4.403c.202.202.314.476.314.759z"
                                        ></Path>
                                    </Svg>
                                </LinearGradient>
                                <View
                                    style={{
                                        right: 25
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 17
                                        }}
                                    >
                                        {locales('titles.buyAdRequests')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            fontSize: 15
                                        }}
                                    >
                                        {locales('titles.seeBuyAdsRequests')}
                                    </Text>
                                </View>
                                <FontAwesome5
                                    name='angle-left'
                                    size={20}
                                    color='#15313C'
                                />
                            </Pressable>
                        </ShadowView>
                    </>
                }
            </View>
        </View>
    )
};

const mapStateToProps = state => {
    const {
        profileReducer
    } = state;

    const {
        userProfile
    } = profileReducer;

    return {
        userProfile
    }
}
export default connect(mapStateToProps)(AuthenticatedSuccessfully);