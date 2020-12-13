

import React, { memo } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { deviceWidth } from '../../utils/deviceDimenssions';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';





const CErtificates = props => {
    const { certificatesFromByUserName } = props
    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={certificatesFromByUserName}
            horizontal
            ListEmptyComponent={() => (
                <View style={{
                    alignSelf: 'center', justifyContent: 'flex-start',
                    alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93,

                }}>
                    <FontAwesome5 name='tasks' size={80} color='#BEBEBE' />
                    <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>
                        {locales('labels.noevidenceFound')}</Text>
                </View>
            )}
            initialNumToRender={2}
            keyExtractor={((_, index) => index.toString())}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    onPress={() => props.setSelectedEvidence(true, index)}
                >
                    <Image
                        style={{
                            borderWidth: 0.7,
                            borderColor: '#BEBEBE',
                            borderRadius: 4,
                            width: deviceWidth * 0.4, borderRadius: 4,
                            marginHorizontal: 5, height: deviceWidth * 0.4
                        }}
                        source={{
                            uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item}`
                        }}
                    />
                </TouchableOpacity>
            )}
        />

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.certificatesFromByUserName != nextProps.certificatesFromByUserName)
        return false;
    return true;
};

export default memo(CErtificates, areEqual);



