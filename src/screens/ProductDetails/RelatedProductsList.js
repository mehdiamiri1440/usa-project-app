import React from 'react';
import { Image, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { formatter } from '../../utils';

const RelatedProductsList = props => {

    const { relatedProductsArray } = props;

    return (
        <FlatList
            style={{
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 20,
                marginHorizontal: 7,
            }}
            horizontal={true}
            ListEmptyComponent={() => <Text style={[{ width: deviceWidth, color: '#777777', textAlign: 'center', fontSize: 18 }, styles.textBold]}>{locales('titles.noRelatedProductFound')}</Text>}
            keyExtractor={(_, index) => index.toString()}
            data={relatedProductsArray}
            renderItem={({ item }) => (
                <Card transparent>
                    <TouchableOpacity
                        style={{
                            borderRadius: 6,
                            elevation: 5,
                            margin: 10,
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            minWidth: 220,
                        }}
                        activeOpacity={1}
                        onPress={() => {
                            // this.props.navigation.setParams({ productId: item.id, key: item.id })
                            // routes.push(item.id);
                            global.productIds.push(item.id)
                            props.navigation.navigate({ name: 'ProductDetails', params: { productId: item.id }, key: item.id, index: item.id })
                        }}>
                        <Image
                            resizeMode='cover'
                            style={{ width: '100%', height: deviceWidth * 0.35 }}
                            source={{
                                uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.photo}`
                            }} />
                        <Text
                            numberOfLines={1}
                            style={[{ paddingTop: 5, alignSelf: 'center' }, styles.textBold]}>
                            {item.product_name}</Text>
                        <Text style={[{ padding: 10, paddingTop: 0, alignSelf: 'center', textAlign: 'center', width: '100%', color: '#00C569' }, styles.textBold]}>
                            {locales('titles.stockQuantity')} {formatter.numberWithCommas(item.stock)} {locales('labels.kiloGram')}</Text>
                    </TouchableOpacity>
                </Card>
            )
            }
        />
    )
}

export default RelatedProductsList;

const styles = StyleSheet.create({
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    }
})