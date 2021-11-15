

import React, { memo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image'
import { SliderBox } from "react-native-image-slider-box";
import { deviceWidth, deviceHeight } from '../../utils';

const ProductImages = props => {
    const { photosWithCompletePath } = props
    const [width, setWidth] = useState(deviceWidth * 0.98);

    const onLayout = e => {
        setWidth(e.nativeEvent.layout.width);
    };

    return (

        (photosWithCompletePath && photosWithCompletePath.length) ?
            <View
                style={{
                    width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: '12%',
                    borderWidth: 2,
                    borderColor: 'rgba(0, 0, 0, 0.05)',
                    marginTop: 10
                }}
                onLayout={onLayout}
            >
                <SliderBox
                    dotColor='#00C569'
                    ImageComponent={FastImage}
                    inactiveDotColor='#A8A8A8'
                    sliderBoxHeight='100%'
                    paginationBoxStyle={{}}
                    dotStyle={{ width: 9, height: 9, borderRadius: 5, marginHorizontal: -10 }}
                    images={photosWithCompletePath}
                    imageLoadingColor='#e41c38'
                    resizeMode='cover'
                    resizeMethod='resize'
                    onCurrentImagePressed={index => props.showFullSizeImage(index)}
                />
            </View>
            : null

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.photosWithCompletePath != nextProps.photosWithCompletePath)
        return false;
    return true;
};

export default memo(ProductImages, areEqual);



