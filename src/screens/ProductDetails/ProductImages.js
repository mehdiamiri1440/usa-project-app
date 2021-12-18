
import React, { memo, useRef, useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image'
import { deviceWidth, deviceHeight } from '../../utils';

const ProductImages = props => {

    const flatListRef = useRef();

    const { photosWithCompletePath } = props;

    const [currentSlide, setCurrentSlide] = useState(0);

    const paginationButtons = Array.from(Array(photosWithCompletePath.length).keys());

    const onViewableItemsChanged = ({
        viewableItems,
    }) => {
        if (viewableItems && viewableItems.length)
            return setCurrentSlide(viewableItems[0].index);
    };

    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);


    const renderItem = ({ item, index }) => {
        return (
            <Pressable
                onPress={_ => props.showFullSizeImage(index)}
            >
                <FastImage
                    style={{
                        width: deviceWidth * 0.95,
                        height: deviceHeight * 0.29
                    }}
                    source={{
                        uri: item,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </Pressable>
        )
    };


    return (
        (photosWithCompletePath && photosWithCompletePath.length) ?
            <>
                <FlatList
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    renderItem={renderItem}
                    data={photosWithCompletePath}
                    keyExtractor={(_, index) => index.toString()}
                    pagingEnabled
                    style={{
                        borderWidth: 1,
                        marginTop: 10,
                        borderColor: 'rgba(0,0,0,0.5)'
                    }}
                    horizontal
                    ref={flatListRef}
                    showsHorizontalScrollIndicator={false}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                    }}
                >
                    {photosWithCompletePath && photosWithCompletePath.length ?
                        paginationButtons.map((_, index) => (
                            <View
                                style={{
                                    backgroundColor: currentSlide == index ? "#FF9828" : "#979797",
                                    width: 10,
                                    height: 10,
                                    marginHorizontal: 2,
                                    marginTop: 5,
                                    borderRadius: 200,
                                }}
                            >
                            </View>
                        ))
                        : null}
                </View>
            </>
            : null

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.photosWithCompletePath != nextProps.photosWithCompletePath)
        return false;
    return true;
};

export default memo(ProductImages, areEqual);



