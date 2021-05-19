import React, { memo } from 'react';
import Jmoment from 'moment-jalaali';
import ShadowView from 'react-native-simple-shadow-view'
import { ToastAndroid, View, Text, TouchableOpacity, Linking } from 'react-native';
import Clipboard from "@react-native-community/clipboard";

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { validator, parser } from '../../utils';
const Message = props => {


    const {
        item,
        index,
        separators,
        contact,
        loggedInUserId,
        prevMessage
    } = props;
    const { contact_id: id } = contact;

    const showPhoneFormat = item.sender_id != loggedInUserId && item.is_phone;

    const openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    return (
        <>
            {parser.showDate(item, prevMessage)}
            <View
                style={{
                    width: deviceWidth,
                    paddingHorizontal: 10,
                    paddingVertical: 0,
                    marginTop: index == separators.length - 1 ? 50 : (index < separators.length - 1 && separators[index].receiver_id == separators[index + 1].receiver_id ? 5 : 7),
                    flex: 1,
                    alignItems: id == item.receiver_id ? 'flex-end' : 'flex-start'
                }}
                key={index}
            >
                <ShadowView
                    style={{
                        maxWidth: deviceWidth * 0.75,
                        borderRadius: 9,
                        paddingVertical: 3,
                        backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                        shadowColor: 'black',
                        shadowOpacity: 0.13,
                        shadowRadius: 1,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    <View
                        style={{ paddingHorizontal: 10 }}
                    >

                        <Text
                            selectionColor='gray'
                            suppressHighlighting
                            selectable
                            onPress={() => {
                                ToastAndroid.showWithGravityAndOffset(
                                    locales('titles.copiedToClipboard'),
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    5,
                                    20)
                                Clipboard.setString(item.text)
                            }}
                            style={{
                                zIndex: 999999,
                                textAlign: 'right',
                                fontSize: showPhoneFormat ? 18 : 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                color: showPhoneFormat ? '#5188B8' : '#333333'

                            }}>
                            {item.text}
                        </Text>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
                            {id == item.receiver_id && (item.created_at ? <MaterialCommunityIcons
                                style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                name={(item.is_read == 1 || item.is_read == true) ? 'check-all' : 'check'} size={14}
                                color={(item.is_read == 1 || item.is_read == true) ? '#60CAF1' : '#617D8A'} /> :
                                <Feather name='clock' size={14} color='#617D8A'
                                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                />
                            )
                            }
                            <Text
                                style={{
                                    color: showPhoneFormat ? '#5188B8' : '#333333',
                                    fontSize: 12,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>
                                {Jmoment(item.created_at).format('jYYYY/jMM/jDD , HH:mm ')}
                            </Text>
                        </View>
                    </View>
                    {showPhoneFormat ?
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => openCallPad(item.text)}
                            style={{
                                bottom: -4,
                            }}
                        >
                            <View
                                style={{
                                    width: 210,
                                    backgroundColor: '#4FA992',

                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',

                                    flexDirection: 'row-reverse',

                                    paddingVertical: 5,
                                    marginHorizontal: -10,
                                    marginBottom: -5,
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8,
                                    marginTop: 7,
                                    overflow: "hidden",
                                    borderTopRightRadius: 0,
                                    borderTopLeftRadius: 0,

                                }}
                            >
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}>
                                    {locales('labels.call')}

                                </Text>
                                <Text style={{
                                    // position: 'absolute',
                                    // left: 0,
                                    marginRight: 10
                                }}>
                                    <FontAwesome name='phone'

                                        color='white' size={18} />
                                </Text>

                            </View>
                        </TouchableOpacity>
                        : null}
                </ShadowView>
            </View>
        </>
    )
}

export default memo(Message);