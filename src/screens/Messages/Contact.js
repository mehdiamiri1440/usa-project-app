import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Jmoment from 'moment-jalaali';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { deviceWidth } from '../../utils/deviceDimenssions';


import ValidatedUserIcon from '../../components/validatedUserIcon';
import MessagesContext from './MessagesContext';


const ContactsList = props => {

    const { item, index, contactsList } = props;
    const msgCntxt = useContext(MessagesContext);


    return (
        (
            <TouchableOpacity
                onPress={() => {
                    msgCntxt.resetSearch('');
                    props.navigation.navigate('Chat', { contact: item, showReportText: true })
                }}

                key={item.contact_id}
                style={{
                    borderBottomColor: '#DDDDDD', paddingVertical: 12,
                    flexDirection: 'row-reverse', width: '100%',
                    borderBottomWidth: index < contactsList.length - 1 ? 1 : 0
                }}
            >

                <Image
                    style={{
                        borderRadius: deviceWidth * 0.06,
                        width: deviceWidth * 0.12, height: deviceWidth * 0.12
                    }}
                    source={item.profile_photo ?
                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.profile_photo}` }
                        : require('../../../assets/icons/user.png')}
                />

                <View>
                    <View
                        style={{
                            width: deviceWidth * 0.8,
                            paddingHorizontal: 10,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <Text style={{
                                color: '#666666', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginHorizontal: 5
                            }}>
                                {`${item.first_name} ${item.last_name}`}
                            </Text>
                            {item.is_verified ? <ValidatedUserIcon {...props} /> : null}
                        </View>
                        <Text style={{
                            color: '#666666',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>
                            {Jmoment(item.last_msg_time_date.split(" ")[0]).format('jYYYY/jM/jD')}
                        </Text>
                    </View>


                    <View
                        style={{
                            width: deviceWidth * 0.8,
                            paddingHorizontal: 10,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{
                            color: '#666666', flexWrap: 'wrap', textAlign: 'right', width: '85%',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}
                            numberOfLines={1}>
                            {item.last_msg.last_msg_text}
                        </Text>
                        {item.unread_msgs_count > 0 && <Text style={{
                            color: 'white', backgroundColor: '#00C569', width: 20, height: 20,
                            borderRadius: 15, textAlign: 'center', textAlignVertical: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>
                            {item.unread_msgs_count}
                        </Text>}
                    </View>

                </View>


            </TouchableOpacity>

        )
    )
}

export default (ContactsList)