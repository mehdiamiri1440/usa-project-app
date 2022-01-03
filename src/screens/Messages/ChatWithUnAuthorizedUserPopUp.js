import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { deviceWidth } from '../../utils/deviceDimenssions';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { ValidatedUserDescription } from '../../components/validatedUserIcon';

const ChatWithUnAuthorizedUserPopUp = props => {

    const { userProfile = {} } = props;
    const { user_info = {} } = userProfile;
    const { is_verified } = user_info;

    const [showModal, setShowModal] = useState(false);

    return (
        <View
            style={{
                backgroundColor: '#FFF8C1', width: deviceWidth * 0.94,
                alignSelf: 'center',
                borderRadius: 4,
                padding: 10,
                margin: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >


            <Text
                style={{ fontSize: 14, paddingVertical: 10, fontFamily: 'IRANSansWeb(FaNum)_Medium', textAlign: 'right', color: '#77778B' }}
            >
                {locales('messages.userNotAuthorized')} {!is_verified ? <Text
                    style={{
                        color: '#E51F38',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}>{locales('messages.likeYou')} </Text> : ''}
                {locales('messages.nearBuskool')}
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                > {locales('messages.authorize')} </Text>
                <Text style={{
                    color: '#E51F38',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                }}>{locales('messages.notHappened')}</Text>
            </Text>

            <View
                style={{
                    paddingVertical: 10,
                    width: '100%',
                    justifyContent: 'flex-start', alignSelf: 'center', alignItems: 'flex-end'
                }}>
                <Pressable
                    android_ripple={{
                        color: '#ededed',
                    }}
                    onPress={() => props.hideUnAuthorizedUserChatPopUp()}
                    activeOpacity={1}
                    style={{ marginVertical: 15, marginHorizontal: 5, justifyContent: 'center' }}>
                    <Text style={{
                        textAlign: 'center',
                        color: "#33B398", fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}>{locales('titles.gotIt')}</Text>
                </Pressable>

                <Pressable
                    android_ripple={{
                        color: '#ededed',
                    }}
                    activeOpacity={1}
                    onPress={() => setShowModal(true)}
                    style={{ flexDirection: 'row-reverse' }}>
                    <FontAwesome5 name='exclamation' color='#337AB7' size={20} />
                    <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', marginHorizontal: 3, color: '#337AB7' }}>
                        {locales('titles.moreDetails')}
                    </Text>
                </Pressable>
            </View>
            {showModal ?
                <ValidatedUserDescription
                    shwModal={showModal}
                    onRequestClose={() => setShowModal(false)}
                    {...props}
                />
                :
                null}
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.profileReducer.userProfile
    }
};

export default connect(mapStateToProps)(ChatWithUnAuthorizedUserPopUp);