import React, { memo } from 'react';
import Jmoment from 'moment-jalaali';
import { ToastAndroid, View, Text } from 'react-native';
import Clipboard from "@react-native-community/clipboard";

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth } from '../../utils/deviceDimenssions';

const Message = props => {

    const {
        item,
        index,
        separators,
        contact
    } = props;
    const { contact_id: id } = contact;

    return (
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
                        fontSize: 16,
                        color: '#333333'
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
                            color: '#333333',
                            fontSize: 12
                        }}>
                        {Jmoment(item.created_at).format('jYY/jM/jD , hh:mm A ')}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default memo(Message);