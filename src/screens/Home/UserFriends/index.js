import React from 'react';
import {
    View,
    Text,
    Image,
    ToastAndroid,
    ScrollView,
    FlatList,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import Clipboard from "@react-native-community/clipboard";
import LinearGradient from "react-native-linear-gradient";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import Header from '../../../components/header';
import { permissions, formatter, deviceWidth, deviceHeight } from '../../../utils';
import { Pressable } from 'react-native';

const UserFriends = props => {

    const {
        friendsList = []
    } = props;


    const renderListHeaderComponent = _ => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <ImageBackground
                    source={require('../../../../assets/images/Group2.jpg')}
                    style={{
                        width: deviceWidth,
                        resizeMode: "cover",
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '75%',
                            top: '40%',
                            marginVertical: 15,
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            zIndex: 1,
                            borderBottomWidth: 5,
                            borderColor: 'rgba(0,0,0,0.06)'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 20,
                                color: '#556080',
                                textAlign: 'center'
                            }}
                        >
                            {locales('titles.monetizationVolume')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 35,
                                color: '#1DA1F2',
                                textAlign: 'center'
                            }}
                        >
                            {formatter.numberWithCommas(250000)}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 17,
                                    color: '#1DA1F2',
                                    textAlign: 'center',
                                    fontWeight: '200'
                                }}

                            >
                                {` ${locales('titles.toman')}`}
                            </Text>
                        </Text>
                    </View>
                </ImageBackground>

                <View
                    style={{
                        marginTop: '14%',
                        padding: 20
                    }}
                >

                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17,
                            color: '#404B55',
                            textAlign: 'right',
                            fontWeight: '200'
                        }}
                    >
                        {locales('titles.walletInventoryToBuySpecialRegistration')}
                    </Text>

                    <View
                        style={{
                            marginTop: 7,
                            marginBottom: 15,
                        }}>

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: 4,
                                    width: '15%',
                                    padding: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "IRANSansWeb(FaNum)_Bold",
                                        color: '#404B55',
                                        fontSize: 13,
                                        textAlign: 'center',
                                    }}>
                                    {50}%
                                </Text>
                                <View
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeftWidth: 5,
                                        borderLeftColor: 'transparent',
                                        borderRightColor: 'transparent',
                                        borderRightWidth: 5,
                                        borderTopWidth: 5,
                                        borderTopColor: '#F2F2F2',
                                        left: '50%',
                                        bottom: -5,
                                        position: 'absolute'
                                    }}
                                >
                                </View>
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            height: 7
                        }}>
                            <View
                                style={{
                                    backgroundColor: '#DDDDDD',
                                    borderRadius: 15,
                                    height: 18,
                                    width: '100%',
                                    position: 'absolute'

                                }}
                            ></View>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#00C569', '#21AD93']}
                                style={{
                                    position: 'absolute',
                                    height: 18,
                                    width: `${50}%`,
                                    left: 0,
                                    borderRadius: 10
                                }}
                            >
                                <View
                                    style={{
                                        borderRadius: 100,
                                        width: 18,
                                        height: 18,
                                        backgroundColor: '#0E7B66',
                                        alignSelf: 'flex-end',
                                        left: 5
                                    }}
                                >

                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 15,
                                color: '#00C569',
                            }}
                        >
                            {locales('titles.specialRegistration')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 15,
                                color: '#999999',
                            }}
                        >
                            {locales('titles.earnWages')}
                        </Text>
                    </View>
                </View>
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    style={{
                        flexDirection: 'row-reverse',
                        alignSelf: 'center',
                        width: '80%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: '#1DA1F2',
                        padding: 10
                    }}
                >
                    <FontAwesome5
                        name='wallet'
                        color='#1DA1F2'
                        size={18}
                    />
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20,
                            color: '#1DA1F2',
                            marginRight: 10
                        }}
                    >
                        {locales('titles.chargeWalletManually')}
                    </Text>
                </Pressable>
            </View>
        )
    };

    const renderListEmptyComponent = _ => {
        return (
            <View>
                <Text>
                    hello mehjdo amiri
                </Text>
            </View>
        )
    };

    const renderItem = ({ item }) => {
        return (
            <View>

            </View>
        )
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >
            <Header
                title={locales('titles.monetization')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <FlatList
                renderItem={renderItem}
                data={friendsList}
                keyExtractor={item => item.dispatch.toString()}
                ListEmptyComponent={renderListEmptyComponent}
                ListHeaderComponent={renderListHeaderComponent}
            />
        </View >
    )
};

const mapStateToProps = ({
    profileReducer
}) => {

    const {
        userProfile = {}
    } = profileReducer;

    return {
        userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFriends);