import React from 'react';
import { Image, FlatList, TouchableOpacity, Text } from 'react-native';
import { Card } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { formatter } from '../../utils';

const RelatedProductsList = props => {

    const { relatedProductsArray } = props;

    return (
        <FlatList
            style={{
                borderRadius: 4, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 20, marginHorizontal: 7
                ,
                elevation: 6,
            }}
            horizontal={true}
            ListEmptyComponent={() => <Text style={{ width: deviceWidth, color: '#777777', textAlign: 'center', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>{locales('titles.noRelatedProductFound')}</Text>}
            keyExtractor={(_, index) => index.toString()}
            data={relatedProductsArray}
            renderItem={({ item }) => (
                <Card>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            // this.props.navigation.setParams({ productId: item.id, key: item.id })
                            // routes.push(item.id);
                            global.productIds.push(item.id)
                            props.navigation.navigate({ name: 'ProductDetails', params: { productId: item.id }, key: item.id, index: item.id })
                        }}>
                        <Image
                            resizeMode='cover'
                            style={{ width: deviceWidth * 0.46, height: deviceWidth * 0.4, borderRadius: 4 }}
                            source={{
                                uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.photo}`
                            }} />
                        <Text
                            numberOfLines={1}
                            style={{ paddingHorizontal: 10, alignSelf: 'center', }}>
                            {item.product_name}</Text>
                        <Text style={{ paddingHorizontal: 10, alignSelf: 'center', textAlign: 'center', width: '100%', color: '#00C569' }}>
                            {locales('titles.stockQuantity')} {formatter.numberWithCommas(item.stock)} {locales('labels.kiloGram')}</Text>
                    </TouchableOpacity>
                </Card>
            )
            }
        />
    )
}

export default RelatedProductsList;