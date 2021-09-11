import React from 'react';
import { View, Text, Image, ToastAndroid, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import Clipboard from "@react-native-community/clipboard";
import BgLinearGradient from 'react-native-linear-gradient';

import Header from '../../../components/header';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceWidth } from '../../../utils/deviceDimenssions';

const Referral = props => {

    const {
        userProfile = {}
    } = props;

    const {
        user_info = {},
    } = userProfile;

    const {
        user_name,
    } = user_info;

    const completeUrlToShare = `${REACT_APP_API_ENDPOINT_RELEASE}/invite/${user_name}`;

    const bodyText = locales('labels.helperTextForInvitation');

    const showToast = _ => {
        ToastAndroid.showWithGravityAndOffset(
            locales('titles.copiedToClipboard'),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            5,
            250);
        Clipboard.setString(`${bodyText}\n\n${completeUrlToShare}`);
    };

    const askForPermissionOfContacts = _ => {
        return props.navigation.navigate('MyBuskool', {
            screen: 'UserContacts', params: {
                sharingUrlPostFix: `/invite/${user_name}`,
                bodyText,
                title: null,
                shouldShowInstagramButton: false,
                image: null
            }
        })
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >
            <Header
                title={locales('titles.inviteFriends')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <ScrollView
                style={{
                    padding: 15
                }}
            >

                <Image
                    source={require('../../../../assets/images/referral.png')}
                    style={{
                        width: '100%',
                        height: 150,
                        marginVertical: 10,
                        alignSelf: 'center'
                    }}
                    resizeMode='contain'
                />
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 18,
                        textAlign: 'right',
                        marginVertical: 10,
                        color: '#555555'
                    }}
                >
                    {locales('titles.inviteFriends')}
                </Text>
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        fontSize: 15,
                        textAlign: 'right',
                        color: '#555555',
                    }}
                >
                    {locales('labels.inviteFriendsText')} <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17,
                            textAlign: 'right',
                            color: '#00C569',
                            fontWeight: '200'
                        }}
                    >
                        {`${locales('labels.halfOfBuyAmount')} `}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 15,
                            textAlign: 'right',
                            color: '#555555'
                        }}
                    >
                        {locales('labels.willBeAddedToWallet')}
                    </Text>
                </Text>

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        backgroundColor: '#EEEEEE',
                        alignItems: 'center',
                        marginTop: 30,
                        width: deviceWidth * 0.92,
                        marginBottom: 10,
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        borderRadius: 12
                    }}
                >
                    <Text
                        onPress={showToast}
                        style={{
                            textAlign: 'center',
                            backgroundColor: '#556080',
                            color: 'white',
                            fontSize: 16,
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            padding: 10,
                            width: deviceWidth * 0.3,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('titles.copyAddress')}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            textAlign: 'left',
                            backgroundColor: '#EEEEEE',
                            fontSize: 16,
                            borderRadius: 12,
                            padding: 10,
                            width: deviceWidth * 0.62,
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}
                    >
                        {completeUrlToShare}
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        borderRadius: 5,
                        textAlign: 'right',
                        backgroundColor: 'white',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        paddingVertical: 15,
                        height: 170,
                        shadowColor: 'black',
                        shadowOpacity: 0.13,
                        shadowRadius: 1,
                        shadowOffset: { width: 0, height: 2 },
                    }}>
                    <BgLinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0.8, y: 0.2 }}
                        colors={['#1DA1F2', '#3D7CB1']}
                        style={{
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            marginTop: 10,
                            height: 60,
                            alignSelf: 'center',
                            marginTop: 10,
                            position: 'absolute',
                            zIndex: 1
                        }}
                    >
                        <Button
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={askForPermissionOfContacts}
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
                                    color='white'
                                    size={20}
                                    style={{

                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        flexDirection: 'row',
                                        color: 'white',
                                        marginRight: 5
                                    }}>
                                    {locales('titles.sendInvitation')}
                                </Text>
                            </View>
                        </Button>
                    </BgLinearGradient>
                    <View style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: '#0966AD',
                        height: 60,
                        borderRadius: 12,
                    }}>
                    </View>
                </View>
            </ScrollView>
        </View>

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

export default connect(mapStateToProps)(Referral);