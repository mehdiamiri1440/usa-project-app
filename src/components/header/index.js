import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils';
import ValidatedUserIcon from '../validatedUserIcon';

const Header = (props = {}) => {

    const {
        title = '',
        navigation = {},
        onBackButtonPressed,
        image,
        isVerified,
        containerStyle = {},
        shouldShowAuthenticationRibbonFromProps = false,
        userProfile = {}
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_verified
    } = user_info;

    const shouldShowAuthenticationRibbonCondition = !!!is_verified &&
        shouldShowAuthenticationRibbonFromProps &&
        global.shouldShowRibbon;

    const [shouldShowAuthenticationRibbonFromState, setShouldShowAuthenticationRibbonFromState] = useState(global.shouldShowRibbon);

    useEffect(() => {
        setShouldShowAuthenticationRibbonFromState(global.shouldShowAuthenticationRibbonFromState)
    }, [global.shouldShowRibbon]);

    const {
        goBack = _ => { },
        navigate = _ => { }
    } = navigation;

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
                <TouchableOpacity
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 12,
                    }}
                    onPress={onBackButtonPressed ?? goBack}
                >
                    <FontAwesome5 name='arrow-right' size={20} color='#313A43' solid />
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

            {shouldShowAuthenticationRibbonCondition
                ?
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={_ => navigate('MyBuskool', { screen: 'Authentication' })}
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
                        onPress={_ => {
                            global.shouldShowRibbon = false;
                            setShouldShowAuthenticationRibbonFromState(false);
                        }}
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
                            alignItems: 'center'
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
                            fontSize: 16,
                            marginHorizontal: 10,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>
                            {locales('titles.clickToStartAuthentication')}
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={22}
                            solid
                        />
                    </View>
                </TouchableOpacity>
                : null
            }
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
