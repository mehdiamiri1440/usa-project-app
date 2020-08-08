

import React, { memo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';




const RelatedPhotos = props => {

    const {
        index,
        item
    } = props;


    return (
        <TouchableOpacity
            onPress={() => { props.setSelectedImage(true, index) }}
        >
            <Image
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
    )
}


export default memo(RelatedPhotos);



