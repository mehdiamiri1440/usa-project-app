import React, { memo } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    Animated,
    StyleSheet
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {
    connect
} from 'react-redux';
import {
    Button,
} from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';
import Svg, { Path as SvgPath } from "react-native-svg";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';


const FooterButtons = props => {

    const {
        productDetailsInfoError,
        productDetailsInfoFailed,

        loggedInUserId,

        sellerMobileNumberLoading,
        userId,
        has_phone,
        userProfile = {},
        productIdFromProductDetails,
        isContactInfoShown,
        openChat = _ => { },
        fetchContactInfo = _ => { },
        animatedValue
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_seller
    } = user_info;

    if (productDetailsInfoFailed || productDetailsInfoError)
        return null;
    if (!props.productDetailsInfoLoading && userId != loggedInUserId)
        return (
            <Animated.View
                style={{
                    transform: [{
                        translateY: animatedValue
                    }],
                    backgroundColor: 'white',
                    width: '100%',
                    position: 'absolute',
                }}
            >
                <ShadowView
                    style={{
                        shadowColor: 'black',
                        backgroundColor: 'white',
                        shadowRadius: 1,
                        shadowOffset: { width: 0, height: 2 },
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        shadowOpacity: 0.13,
                    }}
                >
                    {(has_phone && !is_seller) ?
                        <Button
                            onPress={() => {
                                analytics().logEvent('click_on_call_info_button_product');
                                fetchContactInfo(productIdFromProductDetails, userId);
                            }}
                            style={[
                                styles.loginButton,
                                {
                                    alignItems: 'center',
                                    width: '45%',
                                    justifyContent: 'center',
                                    backgroundColor: isContactInfoShown ? '#E0E0E0' : '#FF9828'
                                    // width: !!is_elevated ? '50%' : '46%'
                                }]}
                        >
                            <View
                                style={[
                                    styles.textCenterView,
                                    styles.buttonText
                                ]}
                            >
                                {!sellerMobileNumberLoading ? <Text
                                    style={[
                                        styles.textWhite,
                                        {
                                            top: 10
                                        }
                                    ]}
                                >
                                    <FontAwesome5
                                        solid
                                        name='phone-alt'
                                        size={18}
                                    />
                                </Text> :
                                    <ActivityIndicator
                                        animating={true}
                                        size={20}
                                        color='white'
                                    />
                                }
                                <Text
                                    style={
                                        [
                                            styles.textWhite,
                                            styles.margin5,
                                            styles.textBold,
                                            styles.textSize18
                                        ]}
                                >
                                    {locales('labels.callWithSeller')}
                                </Text>
                            </View>
                        </Button>
                        : null}
                    <Button
                        onPress={openChat}
                        style={[
                            styles.loginButton,
                            {
                                zIndex: 1,
                                width: (!is_seller && has_phone) ? '45%' : '95%',
                                backgroundColor: (!is_seller && has_phone) ? '#FFD5A8' : '#FF9828',
                            }]}
                    >
                        <View
                            style={[
                                styles.textCenterView,
                                styles.buttonText]}
                        >
                            <Text
                                style={[
                                    styles.textWhite,
                                    styles.margin5,
                                    {
                                        marginTop: 7,
                                        color: (!is_seller && has_phone) ? '#556080' : 'white',
                                    }
                                ]
                                }
                            >
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <SvgPath
                                        fill={
                                            (!is_seller && has_phone) ?
                                                "#FF9828" : "white"}
                                        d="M4 18h2v4.081L11.101 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2z"
                                    ></SvgPath>
                                    <SvgPath
                                        fill={
                                            (!is_seller && has_phone) ?
                                                "#FF9828" : "white"}
                                        d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"
                                    ></SvgPath>
                                </Svg>
                            </Text>
                            <Text
                                style={[
                                    styles.textWhite,
                                    styles.margin5,
                                    styles.textBold,
                                    styles.textSize18,
                                    {
                                        color: (!is_seller && has_phone) ?
                                            '#FF9828' : "white"
                                    }
                                ]}
                            >
                                {locales('labels.chatWithSeller')}
                            </Text>
                        </View>

                    </Button>
                </ShadowView>
            </Animated.View>
        )
    return null;
};


const styles = StyleSheet.create({
    textSize18: {
        fontSize: 18
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#FF9828',
        color: 'white',
        elevation: 0
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    margin5: {
        margin: 5
    },
    textWhite: {
        color: "#fff"
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },

});

const mapStateToProps = (state) => {
    const {
        profileReducer,
        authReducer,
        productsListReducer,
    } = state;

    const {
        sellerMobileNumberLoading,
        productDetailsInfoError,
        productDetailsInfoFailed,

    } = productsListReducer;

    const {
        userProfile,
    } = profileReducer;

    const {
        loggedInUserId
    } = authReducer;


    return {
        productDetailsInfoError,
        productDetailsInfoFailed,
        loggedInUserId,
        sellerMobileNumberLoading,
        userProfile
    }
};

export default memo(connect(mapStateToProps)(FooterButtons));
