import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Jmoment from 'moment-jalaali';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils/deviceDimenssions';
import ValidatedUserIcon from '../../components/validatedUserIcon';

const ChannelInContactsList = ({
    last_content_title,
    last_content_date,
    unread_contents,
    ...props
}) => {

    return (
        <TouchableOpacity
            onPress={() => props.navigation.navigate('Channel')}
            style={{
                backgroundColor: 'white',
                flexDirection: 'row-reverse',
                alignContent: 'center',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: 75,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e5e5',
            }}>
            <Image
                style={{
                    borderRadius: 25,
                    width: 50, height: 50
                }}
                source={require('../../../assets/icons/buskool-logo.png')}
            />
            <View style={{
                width: deviceWidth - 55,
            }}>
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 18, marginHorizontal: 5,
                                color: '#666666',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {locales('titles.buskoolOfficialChannel')}
                        </Text>
                        <ValidatedUserIcon  {...props} />
                    </View>
                    {last_content_date && last_content_date.length ? <Text
                        style={{
                            color: '#666666',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 14,
                            marginLeft: 66
                        }}
                    >
                        {Jmoment(last_content_date).format('jYYYY/jMM/jDD')}
                    </Text>
                        :
                        <FontAwesome5
                            name='bullhorn'
                            solid
                            color='#AEB5BC'
                            size={20}
                            style={{ marginLeft: 66 }}
                        />}
                </View>
                {unread_contents > 0 && last_content_title && last_content_title.length ?
                    <View style={{
                        flexDirection: 'row-reverse',
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                color: '#666666',
                                width: '75%',
                                marginHorizontal: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}
                        >
                            {last_content_title}
                        </Text>
                        <Text style={{
                            color: 'white', backgroundColor: '#00C569', width: 20, height: 20,
                            borderRadius: 15, textAlign: 'center', textAlignVertical: 'center',
                        }}>
                            {unread_contents}
                        </Text>
                    </View> : null}
            </View>
        </TouchableOpacity>
    )
}
export default ChannelInContactsList