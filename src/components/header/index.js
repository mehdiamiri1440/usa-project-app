import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import ValidatedUserIcon from '../validatedUserIcon';

export default (props = {}) => {

    const {
        title = '',
        navigation = {},
        onBackButtonPressed,
        image,
        firstName,
        lastName,
        isVerified,
        containerStyle = {}
    } = props;

    const {
        goBack = _ => { }
    } = navigation;

    return (
        <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            height: 45,
            elevation: 5,
            justifyContent: 'center',
            ...containerStyle
        }}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 5,
                }}
                onPress={onBackButtonPressed ?? goBack}
            >
                <AntDesign name='arrowright' size={25} />
                {image
                    ?
                    <Image
                        style={{
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            marginHorizontal: 3
                        }}
                        source={image}
                    />
                    : null
                }
            </TouchableOpacity>

            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row-reverse'
            }}>
                <Text
                    style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5 }}
                >
                    {title}
                </Text>
                {isVerified
                    ?
                    <ValidatedUserIcon
                        {...props}
                    />
                    :
                    null}
            </View>
        </View>
    )
}
