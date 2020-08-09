

import React, { memo } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { deviceWidth } from '../../utils/deviceDimenssions';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';





const RelatedPhotos = props => {
    const { relatedsFromByUserName } = props
    return (
        <FlatList
            data={relatedsFromByUserName}
            horizontal
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    onPress={() => { props.setSelectedImage(true, index) }}
                >
                    <Image
                        resizeMode='cover'
                        resizeMethod='resize'
                        style={{
                            width: deviceWidth * 0.4,
                            borderWidth: 0.7,
                            borderColor: '#BEBEBE',
                            borderRadius: 4, marginHorizontal: 5, height: deviceWidth * 0.4
                        }}
                        source={{
                            uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item}`
                        }}
                    />
                </TouchableOpacity>

            )}
            initialNumToRender={2}
            ListEmptyComponent={() => (
                <View style={{
                    alignSelf: 'center', justifyContent: 'flex-start',
                    alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93
                }}>
                    <FontAwesome5 name='images' size={80} color='#BEBEBE' solid />
                    <Text style={{
                        color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                        padding: 15, textAlign: 'center'
                    }}>
                        {locales('labels.noImageFound')}</Text>
                </View>
            )}
            keyExtractor={((_, index) => index.toString())}
            showsHorizontalScrollIndicator={false}
        />

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.relatedsFromByUserName != nextProps.relatedsFromByUserName)
        return false;
    return true;
};

export default memo(RelatedPhotos, areEqual);



