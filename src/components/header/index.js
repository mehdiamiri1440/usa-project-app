import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, LayoutAnimation, UIManager, Platform } from 'react-native';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils';
import ValidatedUserIcon from '../validatedUserIcon';
import { deviceHeight } from '../../utils/deviceDimenssions';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Header = (props = {}) => {
    const {
        title = '',
        navigation = {},
        onBackButtonPressed,
        image,
        isVerified,
        containerStyle = {},
        shouldShowAuthenticationRibbonFromProps = false,
        shouldShowBackButton = true,
        userProfile = {},
        iconName = 'arrow-right'
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_verified,
        is_seller
    } = user_info;

    const {
        goBack = _ => { },
        navigate = _ => { }
    } = navigation;

    const [shouldShowAuthenticationRibbonFromState, setShouldShowAuthenticationRibbonFromState] = useState(global.shouldShowRibbon);

    const shouldShowAuthenticationRibbonCondition = !!!is_verified &&
        shouldShowAuthenticationRibbonFromProps &&
        shouldShowAuthenticationRibbonFromState;

    useEffect(() => {
        setShouldShowAuthenticationRibbonFromState(global.shouldShowRibbon);
    }, [global.shouldShowRibbon]);

    const hideRibbon = _ => {
        global.shouldShowRibbon = false;
        setShouldShowAuthenticationRibbonFromState(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (
        <>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                justifyContent: 'center',
                borderBottomColor: '#e0e0e0',
                borderBottomWidth: 1,
                ...containerStyle
            }}>
                {
                    shouldShowBackButton ?
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                right: 0,
                                minWidth: 40,
                            }}
                            onPress={onBackButtonPressed ?? goBack}
                        >
                            <FontAwesome5
                                name={iconName}
                                size={20}
                                color='#313A43'
                                solid
                            />
                            {image
                                ?
                                <>
                                    <Image
                                        style={{
                                            borderRadius: 20,
                                            width: 40,
                                            height: 40,
                                            marginHorizontal: 5
                                        }}
                                        source={image}
                                    />
                                    <View style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row-reverse'
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                marginHorizontal: 5
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {isVerified
                                            ?
                                            <ValidatedUserIcon
                                                {...props}
                                            />
                                            :
                                            null}
                                    </View>
                                </>
                                : null
                            }
                        </TouchableOpacity>
                        : null
                }

                {!image
                    ?
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row-reverse'
                    }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginHorizontal: 5
                            }}
                        >
                            {title}
                        </Text>
                        {isVerified
                            ?
                            <ValidatedUserIcon
                                {...props}
                            />
                            :
                            null}
                    </View>
                    : null
                }
            </View>


            {shouldShowAuthenticationRibbonCondition ?
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={_ => navigate('Authentication')}
                    style={{
                        width: deviceWidth,
                        height: 45,
                        backgroundColor: '#1DA1F2',
                        padding: 10,
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        zIndex: 1
                    }}
                >
                    <FontAwesome5
                        name='times'
                        color='white'
                        onPress={hideRibbon}
                        size={22}
                        style={{
                            left: 0,
                            top: 0,
                            paddingHorizontal: 14,
                            paddingVertical: 11,
                            position: 'absolute'
                        }}
                        solid
                    />
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <FontAwesome5
                                name='certificate'
                                color='white'
                                size={20}
                            />
                            <FontAwesome5
                                color='#1DA1F2'
                                name='check'
                                size={11}
                                style={{ position: 'absolute' }}
                            />

                        </View>
                        <Text style={{
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: deviceWidth > 500 ? 16 : deviceWidth * 0.035,
                            marginHorizontal: 10,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>
                            {!!is_seller ? locales('labels.verifyForHavingMoreBuyers') : locales('labels.verifyForHavingMoreSellers')}
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={22}
                            solid
                        />
                    </View>
                </TouchableOpacity>
                : null}
        </>
    )
};

const mapStateToProps = ({
    profileReducer
}) => {

    const {
        userProfile
    } = profileReducer;

    return {
        userProfile
    }
};

export default connect(mapStateToProps)(Header);
