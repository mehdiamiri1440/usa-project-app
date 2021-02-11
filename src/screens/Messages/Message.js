import React, { memo } from 'react';
import Jmoment from 'moment-jalaali';
import moment from 'moment';
import { ToastAndroid, View, Text, TouchableOpacity, Linking } from 'react-native';
import Clipboard from "@react-native-community/clipboard";

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { validator } from '../../utils';

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


    const showDate = _ => {

        let text = '';

        if (!item.created_at)
            item.created_at = moment(new Date()).format('YYYY-MM-DD HH:mm');

        if (!prevMessage.created_at)
            prevMessage.created_at = moment(new Date()).format('YYYY-MM-DD HH:mm');


        if (!prevMessage.created_at || !item.created_at || typeof item.created_at !== 'string'
            || typeof prevMessage.created_at !== 'string' ||
            !item.created_at.length || !prevMessage.created_at.length)
            return text;

        const currentMessageDate = item.created_at.split('-')[2].split(' ')[0];
        const prevMessageDay = prevMessage.created_at.split('-')[2].split(' ')[0];
        // const prevMessageMonth = prevMessage.created_at.split('-')[1];
        // const prevMessageYear = prevMessage.created_at.split('-')[0];
        const diffBetweenMessages = Math.abs(prevMessageDay - currentMessageDate);

        // if (diffBetweenMessages >= 1 && Math.abs(prevMessageDay - (new Date().getDate())) == 0 && (prevMessageYear == new Date().getFullYear()) && (prevMessageMonth == (new Date().getMonth() + 1)))
        //     text = locales('labels.today');

        // else if (diffBetweenMessages >= 1 && Math.abs((new Date().getDate()) - prevMessageDay) <= 1 && (prevMessageYear == new Date().getFullYear()) && (prevMessageMonth == (new Date().getMonth() + 1)))
        //     text = locales('labels.yesterday');

        if (diffBetweenMessages >= 1)
            text = Jmoment(prevMessage.created_at).format('jYYYY/jMM/jDD')
        else text = '';

        if (text)
            return (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#deeff7',
                        width: deviceWidth * 0.3,
                        borderRadius: 7.6,
                        padding: 3,
                        margin: 5,
                        elevation: 1,
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            color: '#313a43',
                            fontSize: 14,
                            paddingHorizontal: 10
                        }}
                    >
                        {text}
                    </Text>
                </View>
            )
        return null;
    };

    return (
        <>
            {showDate()}
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
                <View
                    style={{

                        elevation: 1,
                        maxWidth: deviceWidth * 0.75, paddingHorizontal: 10, borderRadius: 9, paddingVertical: 3,
                        backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                    }}
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
                                fontSize: 12
                            }}>
                            {Jmoment(item.created_at).format('jYYYY/jMM/jDD , HH:mm ')}
                        </Text>
                    </View>
                    {showPhoneFormat ?
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => openCallPad(item.text)}
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
                                    bottom: 2,
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
                </View>
            </View>
        </>
    )
}

export default memo(Message);