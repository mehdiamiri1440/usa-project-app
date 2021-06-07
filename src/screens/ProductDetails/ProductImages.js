

import React, { memo } from 'react';
import FastImage from 'react-native-fast-image'
import { SliderBox } from "react-native-image-slider-box";
import ImageZoom from 'react-native-image-pan-zoom';
import { deviceWidth, deviceHeight } from '../../utils';

const ProductImages = props => {
    const { photosWithCompletePath } = props
    return (

        (photosWithCompletePath && photosWithCompletePath.length) ?
            <ImageZoom
                cropWidth={deviceWidth}
                cropHeight={400}
                imageWidth={deviceWidth}
                imageHeight={400}
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
            </ImageZoom>
            : null

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.photosWithCompletePath != nextProps.photosWithCompletePath)
        return false;
    return true;
};

export default memo(ProductImages, areEqual);



