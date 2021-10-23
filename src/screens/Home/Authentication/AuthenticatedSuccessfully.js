import React from 'react';
import {
    View, Text,
    LayoutAnimation, UIManager, Platform, Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import Svg, { Path, G, Circle } from "react-native-svg"

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceWidth } from '../../../utils';


if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AuthenticatedSuccessfully = props => {

    const {
        userProfile = {}
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

    return (
        <View
            style={{
                flex: 1,
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
                        width="36"
                        height="32"
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
                        color: 'rgba(38,70,83,80)',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16
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
            {active_pakage_type == 0 ? <Pressable
                onPress={_ => props.navigation.navigate('PromoteRegistration')}
                style={{
                    backgroundColor: '#C5E1EB',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: 20,
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(197,255,235,0.5)'
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0, }}
                    end={{ x: 0, y: 1, }}
                    colors={['rgba(21,49,60,0.83)', 'rgba(39,182,238,0.72)']}
                    style={{
                        borderRadius: 200,
                        width: 80,
                        height: 80
                    }}
                >
                </LinearGradient>
                <View
                    style={{
                        marginHorizontal: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.promoteRegistration')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16
                        }}
                    >
                        {locales('labels.accessToMoreFeaturesOfBuskool')}
                    </Text>
                </View>
            </Pressable>
                : null}

            <Pressable
                onPress={_ => props.navigation.navigate('RequestsStack')}
                style={{
                    backgroundColor: '#C5E1EB',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: 20,
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(197,255,235,0.5)',
                    marginTop: 20
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0, }}
                    end={{ x: 0, y: 1, }}
                    colors={['rgba(21,49,60,0.83)', 'rgba(39,182,238,0.72)']}
                    style={{
                        borderRadius: 200,
                        width: 80,
                        height: 80
                    }}
                >
                </LinearGradient>
                <View
                    style={{
                        marginHorizontal: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.buyAdRequests')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.seeBuyAdsRequests')}
                    </Text>
                </View>
            </Pressable>
            {/* 
            <Button
                onPress={navigateToOtherPage}
                style={{
                    textAlign: 'center',
                    backgroundColor: '#00C569',
                    elevation: 0,
                    borderRadius: 5,
                    width: deviceWidth * 0.6,
                    color: 'white',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 60,
                    justifyContent: 'center'
                }}
            >
                <AntDesign name='arrowleft' size={25} color='white' />
                <Text
                    style={{
                        color: 'white',
                        width: '60%',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                >
                    {!!is_seller ? locales('titles.buyLoading') : locales('labels.productsList')}
                </Text>
            </Button> */}
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