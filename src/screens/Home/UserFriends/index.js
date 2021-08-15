import React, {
    useRef,
    useEffect
}
    from 'react';
import {
    View,
    Text,
    FlatList,
    ImageBackground,
    Pressable
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import BgLinearGradient from "react-native-linear-gradient";
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import Header from '../../../components/header';
import { formatter, deviceWidth } from '../../../utils';

const UserFriends = props => {

    const friendsListRef = useRef();

    const {
        friendsList = [
            {
                id: 1,
                first_name: 'محمدامین',
                last_name: 'دلداری',
                credit: 5000
            },
            {
                id: 2,
                first_name: 'محمدمهدی',
                last_name: 'امیری',
                credit: 10000
            },
            {
                id: 3,
                first_name: 'حسین',
                last_name: 'انگاشته',
                credit: 350000
            },
            {
                id: 4,
                first_name: 'علیرضا',
                last_name: 'مروج',
                credit: 1000
            },
            {
                id: 5,
                first_name: 'شهرام',
                last_name: 'صفرزاده',
                credit: 24300
            },
        ]
    } = props;

    useEffect(() => {
        friendsListRef?.current?.scrollToOffset({ offset: 70 })
    }, []);

    const renderListHeaderComponent = _ => {
        return (
            <>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 5,
                        paddingBottom: 40
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
                        <ShadowView
                            style={{
                                backgroundColor: 'white',
                                shadowColor: 'black',
                                shadowOpacity: 0.06,
                                shadowRadius: 5,
                                shadowOffset: { width: 0, height: 5 },
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
                            }}>
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
                        </ShadowView>
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
                                marginTop: 15,
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
                        onPress={_ => props.navigation.navigate('MyBuskool', { screen: 'Wallet' })}
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
                            padding: 10,
                            marginTop: 20,
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
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 17,
                        color: '#404B55',
                        marginRight: 10,
                        marginTop: 10
                    }}
                >
                    {locales('titles.yourInvitors')}
                </Text>
            </>
        )
    };

    const renderListEmptyComponent = _ => {
        return (
            <View
                style={{
                    padding: 30,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 17,
                        color: '#777777',
                        textAlign: 'center'
                    }}
                >
                    {locales('titles.noInvitationAcceptedYet')}
                </Text>
            </View>
        )
    };

    const renderItem = (
        {
            item: {
                first_name = '',
                last_name = '',
                credit = ''
            } = {},
            index
        }
    ) => {
        return (
            <View
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10
                }}
            >

                <FontAwesome5
                    name='user-circle'
                    solid
                    color='#BBBBBB'
                    size={25}
                />

                <View
                    style={{
                        borderBottomColor: '#F2F2F2',
                        borderBottomWidth: index == friendsList.length - 1 ? 0 : 1,
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '94%',
                        paddingVertical: 20
                    }}
                >

                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 15,
                            marginHorizontal: 10,
                            color: '#404B55',
                            textAlign: 'right',
                            width: '60%'
                        }}
                    >
                        {`${first_name} ${last_name}`}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 20,
                            color: '#21AD93',
                            textAlign: 'center'
                        }}
                    >
                        {formatter.numberWithCommas(credit)} <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 15,
                                color: '#404B55',
                                textAlign: 'center',
                                fontWeight: '200'
                            }}
                        >
                            {locales('titles.toman')}
                        </Text>
                    </Text>
                </View>
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
                ref={friendsListRef}
                renderItem={renderItem}
                data={friendsList}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={renderListEmptyComponent}
                ListHeaderComponent={renderListHeaderComponent}
            />

            <ShadowView
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: deviceWidth,
                    backgroundColor: 'white',
                    shadowColor: 'rgba(0,0,0,0.1)',
                    shadowOpacity: 0.4,
                    shadowRadius: 1,
                    shadowOffset: { width: 0, height: -5 },
                    paddingTop: 10,
                    paddingBottom: 15
                }}
            >

                <BgLinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#1DA1F2', '#3D7DB2']}
                    style={{
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '95%',
                        zIndex: 1,
                        height: 60,
                        alignSelf: 'center',
                    }}
                >
                    {/* <ShadowView
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: deviceWidth,
                            shadowColor: 'red',
                            shadowOpacity: 1,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 5 },
                        }}
                    > */}
                    <Button
                        onPress={_ => props.navigation.navigate('MyBuskool', { screen: 'Referral' })}
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 0
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome5
                                name='share-alt'
                                size={20}
                                color='white'
                            />
                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 20,
                                    marginRight: 5
                                }}
                            >
                                {locales('titles.sendNewInviation')}
                            </Text>
                        </View>
                    </Button>
                    {/* </ShadowView> */}
                    {/* <View style={{
                        width: "95%",
                        backgroundColor: '#0966AD',
                        zIndex: 0,
                        height: 60,
                        top: 15,
                        borderRadius: 12,
                        position: 'absolute'
                    }}>
                    </View> */}
                </BgLinearGradient>
            </ShadowView>

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