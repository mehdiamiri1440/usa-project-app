import React, { memo } from 'react';
import Jmoment from 'moment-jalaali';
import { ToastAndroid, View, Text, Pressable, Linking } from 'react-native';
import Clipboard from "@react-native-community/clipboard";

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { validator, parser } from '../../utils';

const Message = props => {

    const {
        item,
        index,
        separators,
        contact,
        loggedInUserId,
        prevMessage,
    } = props;

    const { contact_id: id } = contact;

    const showPhoneFormat = item.sender_id != loggedInUserId && item.is_phone;

    const showToast = _ => {
        ToastAndroid.showWithGravityAndOffset(
            locales('titles.copiedToClipboard'),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            5,
            20);
        Clipboard.setString(item.text);
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
            >
                <View
                    style={{
                        backgroundColor: 'rgba(204,204,204,0.4)',
                        paddingBottom: 1.5,
                        paddingTop: 1,
                        paddingLeft: 1.5,
                        paddingRight: 1,
                        borderRadius: 9,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.7,
                        borderLeftWidth: 0.3,
                        borderRightWidth: 0.3,
                        borderTopColor: 'rgba(204,204,204,0.1)',
                        borderBottomColor: 'rgba(204,204,204,0.7)',
                        borderRightColor: 'rgba(204,204,204,0.1)',
                        borderLeftColor: 'rgba(204,204,204,0.1)',
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 10,
                            maxWidth: deviceWidth * 0.75,
                            borderRadius: 9,
                            borderBottomRightRadius: (!!item.p_id && item.sender_id != loggedInUserId) || showPhoneFormat ? 0 : 9,
                            borderBottomLeftRadius: (!!item.p_id && item.sender_id != loggedInUserId) || showPhoneFormat ? 0 : 9,
                            paddingVertical: 3,
                            backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                        }}
                    >
                        <Text
                            selectionColor='gray'
                            suppressHighlighting
                            selectable
                            onPress={showToast}
                            style={{
                                zIndex: 999999,
                                textAlign: 'right',
                                fontSize: showPhoneFormat ? 18 : 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                color: showPhoneFormat ? '#5188B8' : '#333333'

                            }}>
                            {item.text}
                        </Text>
                        <RenderDate
                            item={item}
                            {...props}
                            id={id}
                            showPhoneFormat={showPhoneFormat}
                        />
                    </View>
                    <RenderPhoneFormatMessage
                        showPhoneFormat={showPhoneFormat}
                        item={item}
                        {...props}
                        id={id}
                    />
                    {item.sender_id != loggedInUserId ?
                        <RenderMessageWithProductIdDesign
                            item={item}
                            {...props}
                        />
                        :
                        null
                    }
                </View>
            </View>
        </>
    )
};

const RenderDate = props => {
    const {
        showPhoneFormat,
        item,
        id
    } = props;

    return (
        <View
            style={{ flexDirection: 'row-reverse', alignItems: 'center', }}
        >
            {id == item.receiver_id && (item.created_at ?
                <MaterialCommunityIcons
                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                    name={(item.is_read == 1 || item.is_read == true) ? 'check-all' : 'check'}
                    size={14}
                    color={(item.is_read == 1 || item.is_read == true) ? '#60CAF1' : '#617D8A'}
                />
                :
                <Feather
                    name='clock'
                    size={14}
                    color='#617D8A'
                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                />
            )
            }
            <Text
                style={{
                    color: showPhoneFormat ? '#5188B8' : '#333333',
                    fontSize: 12,
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                }}
            >
                {Jmoment(item.created_at).format('jYYYY/jMM/jDD , HH:mm ')}
            </Text>
        </View>
    )
};

const RenderPhoneFormatMessage = props => {
    const {
        showPhoneFormat,
        item
    } = props;


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

    if (showPhoneFormat)

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={() => openCallPad(item.text)}
            >
                <View
                    style={{
                        width: '100%',
                        backgroundColor: '#4FA992',

                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',

                        flexDirection: 'row-reverse',

                        paddingVertical: 5,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        overflow: "hidden",
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,

                    }}
                >
                    <Text style={{
                        marginRight: 10
                    }}>
                        <FontAwesome
                            name='phone'
                            color='white'
                            size={14}
                        />
                    </Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginHorizontal: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}>
                        {locales('labels.call')}

                    </Text>


                </View>
            </Pressable >
        )
    return null;
};

const RenderMessageWithProductIdDesign = props => {
    const {
        item = {},
        navigation = {}
    } = props;

    const {
        navigate = _ => { }
    } = navigation;

    const {
        p_id
    } = item;


    if (!!p_id)
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={() => navigate('Messages', { screen: 'ProductDetails', params: { productId: p_id } })}
            >
                <View
                    style={{
                        width: '100%',
                        backgroundColor: '#1da1f2',

                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',

                        flexDirection: 'row-reverse',

                        paddingVertical: 8,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        overflow: "hidden",
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,

                    }}
                >
                    <Text style={{
                        marginRight: 10
                    }}>
                        <FontAwesome5
                            name='link'
                            color='white'
                            size={14}
                        />
                    </Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginHorizontal: 5,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}>
                        {locales('labels.ProductImagesAndDetails')}

                    </Text>
                </View>
            </Pressable >
        )
    return null;
};

export default memo(Message);