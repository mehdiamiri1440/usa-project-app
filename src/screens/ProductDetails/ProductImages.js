

import React, { memo } from 'react';
import FastImage from 'react-native-fast-image'
import { SliderBox } from "react-native-image-slider-box";


const ProductImages = props => {
    const { photosWithCompletePath } = props
    return (

        (photosWithCompletePath && photosWithCompletePath.length) ? <SliderBox
            dotColor='#00C569'
            ImageComponent={FastImage}
            inactiveDotColor='#A8A8A8'
            sliderBoxHeight={400}
            dotStyle={{ bottom: -30, width: 9, height: 9, borderRadius: 5, marginHorizontal: -10 }}
            images={photosWithCompletePath}
            imageLoadingColor='red'
            resizeMode='cover'
            resizeMethod='resize'
            onCurrentImagePressed={index => props.showFullSizeImage(index)}
        /> : null

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.photosWithCompletePath != nextProps.photosWithCompletePath)
        return false;
    return true;
};

export default memo(ProductImages, areEqual);



