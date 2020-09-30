import React, { useCallback } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { Card, Button } from 'native-base'
import FastImage from 'react-native-fast-image'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth } from '../../utils/deviceDimenssions';
import { formatter } from '../../utils';


const RegisterRequestSuccessfully = props => {

    const {
        products = []
    } = props;

    const handleBack = () => {
        if (props.route && props.route.params) {
            props.route.params.emptyState();
            props.navigation.goBack();
        }

    }

    const keyExtractor = useCallback((_, index) => index.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * index,
        index
    }), []);

    return (

        <>

            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={handleBack}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('labels.registerRequest')}
                    </Text>
                </View>
            </View>

            <View style={{
                paddingVertical: 80,
                paddingHorizontal: 7
            }}>
                <Card>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <Text style={{
                            borderBottomColor: '#00C569', borderBottomWidth: 2,
                            paddingVertical: 5,
                            width: '100%', textAlign: 'center',
                            fontSize: 20, color: '#555555', fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}>
                            {locales('titles.requestSubmittedSuccessfully')}
                        </Text>
                        <Text
                            style={{
                                marginTop: 40,
                                textAlign: 'center',
                                fontSize: 18
                            }}>
                            {locales('titles.registerRequestDescription')}
                        </Text>

                        <Button
                            onPress={() => props.navigation.navigate('Home', { screen: 'ProductsList' })}
                            style={{
                                textAlign: 'center',
                                borderRadius: 5,
                                marginVertical: 40,
                                backgroundColor: '#00C569',
                                width: '70%',
                                color: 'white',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}
                            rounded
                        >
                            <Text style={{
                                color: 'white',
                                width: '100%',
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}>{locales('labels.productsList')}</Text>
                        </Button>
                    </View>
                </Card>
            </View>


            {products && products.length ?
                <View
                    style={{ marginTop: -20 }}
                >
                    <View style={{ flexDirection: 'row-reverse', width: deviceWidth }}>
                        <Text style={{ fontSize: 20, color: '#00C569', paddingHorizontal: 10 }}>{locales('labels.suggestedProducts')}</Text>
                        <View
                            style={{
                                height: 2,
                                flex: 1,
                                alignSelf: 'center',
                                backgroundColor: "#BEBEBE",
                            }}>
                            <View
                                style={{
                                    height: 4,
                                    bottom: 2,
                                    width: 40,
                                    alignSelf: 'flex-end',
                                    backgroundColor: "#00C469",
                                }}></View>
                        </View>
                    </View>
                    <FlatList
                        maxToRenderPerBatch={3}
                        getItemLayout={getItemLayout}
                        windowSize={10}
                        showsHorizontalScrollIndicator={false}
                        style={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            marginBottom: 50,
                            marginHorizontal: 7,
                        }}
                        initialNumToRender={2}
                        horizontal={true}
                        keyExtractor={keyExtractor}
                        data={products}
                        renderItem={({ item }) => (
                            <Card transparent>
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 6,
                                        elevation: 5,
                                        margin: 10,
                                        backgroundColor: '#fff',
                                        overflow: 'hidden',
                                        maxWidth: 180,
                                        minWidth: 180,
                                    }}
                                    activeOpacity={1}
                                    onPress={() => props.navigation.navigate('Home', { screen: 'ProductDetails', params: { productId: item.id } })}>
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
                            </Card>
                        )
                        }
                    />
                </View>
                : null}
        </>
    )
}

const styles = StyleSheet.create({
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    }
})

const mapStateToProps = (state) => {
    return {
        products: state.registerProductReducer.products
    }
};

export default connect(mapStateToProps)(RegisterRequestSuccessfully);

