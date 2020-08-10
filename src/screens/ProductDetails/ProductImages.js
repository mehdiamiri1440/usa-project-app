

import React, { memo } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FastImage from 'react-native-fast-image'
import { SliderBox } from "react-native-image-slider-box";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

const ProductImages = props => {
    const { photosWithCompletePath } = props
    return (

        (photosWithCompletePath && photosWithCompletePath.length) ? <SliderBox
            dotColor='#00C569'
            ImageComponent={FastImage}
            inactiveDotColor='#A8A8A8'
            sliderBoxHeight={200}
            dotStyle={{ bottom: -30, width: 9, height: 9, borderRadius: 5, marginHorizontal: -10 }}
            images={photosWithCompletePath}
            imageLoadingColor='red'
            resizeMode='cover'
            resizeMethod='resize'
            onCurrentImagePressed={index => props.showFullSizeImage(index)}
        /> : null


        // <FlatList
        //     data={photosWithCompletePath}
        //     horizontal
        //     renderItem={({ item, index }) => (
        //         <TouchableOpacity
        //             onPress={() => { props.showFullSizeImage(index) }}
        //         >
        //             <FastImage
        //                 resizeMethod='resize'
        //                 source={{
        //                     uri: `${item}`,
        //                     headers: { Authorization: 'eTag' },
        //                     priority: FastImage.priority.low,
        //                 }}
        //                 resizeMode={FastImage.resizeMode.cover}
        //                 style={{
        //                     width: deviceWidth,
        //                     borderWidth: 0.7,
        //                     borderColor: '#BEBEBE',
        //                     borderRadius: 4, marginHorizontal: 5, height: deviceHeight * 0.5
        //                 }}
        //             />
        //         </TouchableOpacity>

        //     )}
        //     initialNumToRender={2}
        //     ListEmptyComponent={() => (
        //         <View style={{
        //             alignSelf: 'center', justifyContent: 'flex-start',
        //             alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93
        //         }}>
        //             <FontAwesome5 name='images' size={80} color='#BEBEBE' solid />
        //             <Text style={{
        //                 color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
        //                 padding: 15, textAlign: 'center'
        //             }}>
        //                 {locales('labels.noImageFound')}</Text>
        //         </View>
        //     )}
        //     keyExtractor={((_, index) => index.toString())}
        //     showsHorizontalScrollIndicator={false}
        // />

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.photosWithCompletePath != nextProps.photosWithCompletePath)
        return false;
    return true;
};

export default memo(ProductImages, areEqual);



