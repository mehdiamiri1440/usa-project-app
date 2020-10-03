import React, { memo, useCallback } from 'react';
import { Image, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Card } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { formatter } from '../../utils';

const RelatedProductsList = props => {

    const { relatedProductsArray } = props;

    const keyExtractor = useCallback((_, index) => index.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * index,
        index
    }), []);

    const renderListEmpty = useCallback(() => (
        <Text style={[{ width: deviceWidth, color: '#777777', textAlign: 'center', fontSize: 18 }, styles.textBold]}>
            {locales('titles.noRelatedProductFound')}
        </Text>
    ), []);

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity
                style={{
                    borderRadius: 6,
                    elevation: 5,
                    margin: 10,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    width: 180,
                }}
                activeOpacity={1}
                onPress={() => {
                    // this.props.navigation.setParams({ productId: item.id, key: item.id })
                    // routes.push(item.id);
                    props.navigation.navigate('ProductDetails', { productId: item.id, prevProductId: props.route.params.productId })
                }}>
                <FastImage
                    resizeMethod='resize'
                    style={{ width: deviceWidth * 0.5, height: deviceWidth * 0.3 }}
                    source={{
                        uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.photo}`,
                        headers: { Authorization: 'eTag' },
                        priority: FastImage.priority.low,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <Text
                    numberOfLines={1}
                    style={[{
                        width: '100%',
                        paddingTop: 5,
                        alignSelf: 'center',
                        textAlign: 'center',
                        paddingHorizontal: 10
                    }, styles.textBold]}>
                    {item.product_name}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[{ padding: 10, paddingTop: 0, alignSelf: 'center', textAlign: 'center', width: '100%', color: '#00C569' }, styles.textBold]}>
                    {locales('titles.stockQuantity')} {formatter.numberWithCommas(item.stock)} {locales('labels.kiloGram')}</Text>
            </TouchableOpacity>

        ), []);

    return (
        <FlatList
            maxToRenderPerBatch={3}
            getItemLayout={getItemLayout}
            windowSize={10}
            showsHorizontalScrollIndicator={false}
            style={{
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 20,
                marginHorizontal: 7,
            }}
            initialNumToRender={2}
            horizontal={true}
            ListEmptyComponent={renderListEmpty}
            keyExtractor={keyExtractor}
            data={relatedProductsArray}
            renderItem={renderItem}
        />
    )
}


const areEqual = (prevProps, nextProps) => {
    if (prevProps.relatedProductsArray != nextProps.relatedProductsArray)
        return false;
    return true;
};

export default memo(RelatedProductsList, areEqual);

const styles = StyleSheet.create({
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    }
})