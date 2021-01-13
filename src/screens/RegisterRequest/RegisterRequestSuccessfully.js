import React, { useCallback, useState } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Card, Button } from 'native-base'
import FastImage from 'react-native-fast-image'

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { dataGenerator, formatter } from '../../utils';
import ChatModal from '../Messages/ChatModal';
import ValidatedUserIcon from '../../components/validatedUserIcon';

const RegisterRequestSuccessfully = props => {

    const {
        products = []
    } = props;

    const [modalFlag, setModalFlag] = useState(false);

    const handleBack = () => {
        if (props.route && props.route.params) {
            props.navigation.goBack();
        }

    }

    const keyExtractor = useCallback((_, index) => index.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * index,
        index
    }), []);

    const renderListHeaderComponent = _ => {
        return (
            <View
                style={{
                    padding: 20
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}
                >
                    {locales('labels.suggestedSellers')}
                </Text>
                <Text
                    style={{
                        color: '#777777',
                        marginVertical: 10,
                        fontSize: 16,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {locales('labels.suggestedSellersForYou')}
                    <Text
                        style={{
                            color: '#00C569',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >{` ${locales('titles.buskool')}`}</Text>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.forYourRequest')}
                    </Text>
                </Text>
            </View>
        )
    };

    const renderListFooterComponent = _ => {
        return (
            <View
                style={{
                    flexDirection: 'row-reverse', width: deviceWidth,
                    alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center'
                }}>
                <Text
                    onPress={() => props.navigation.navigate('Home', { screen: 'ProductsList', params: { productsListRefreshKey: dataGenerator.generateKey('productList_') } })}
                    style={{
                        textAlign: 'center',
                        borderRadius: 5,
                        marginVertical: 40,
                        color: '#1DA1F2',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                >
                    {locales('labels.lookAllProducts')}
                </Text>
                <FontAwesome5
                    size={20}
                    style={{ padding: 10 }}
                    name='arrow-left'
                    color='#1DA1F2'
                />
            </View>
        )
    };


    const renderItem = ({ item }) => {
        console.warn('item', item)
        const {
            product_name,
            stock,
            id,
            myuser_id,
            subcategory_name,
            first_name,
            last_name,
            active_pakage_type,
            is_verified,
            photo
        } = item;

        const selectedContact = {
            first_name,
            last_name,
            is_verified,
            contact_id: myuser_id,
        }
        return (
            <>
                {modalFlag && <ChatModal
                    transparent={false}
                    {...props}
                    visible={modalFlag}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => setModalFlag(false)}
                />}

                <Card
                    style={{
                        padding: 10, borderColor: active_pakage_type > 0 ? '#00C569' : '#bebebe',
                        borderTopWidth: 2,
                        borderBottomWidth: 2,
                        borderRightWidth: 2,
                        borderLeftWidth: 2,
                        borderRadius: 3, width: deviceWidth * 0.96, alignSelf: 'center'
                    }}
                >
                    {/* <TouchableOpacity
                    style={{
                        borderRadius: 6,
                        elevation: 5,
                        margin: 10,
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        props.navigation.navigate('Home')
                        setTimeout(() => {
                            return props.navigation.navigate('ProductDetails', { productId: item.id })
                        }, 100);
                    }}
                > */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            props.navigation.navigate('Home')
                            setTimeout(() => {
                                return props.navigation.navigate('ProductDetails', { productId: id })
                            }, 100);
                        }}>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'flex-start',
                                borderBottomWidth: 0.8,
                                borderBottomColor: '#BEBEBE',
                                justifyContent: 'flex-start',
                                paddingHorizontal: 10,
                            }}>
                            <Image
                                source={require('../../../assets/icons/user.png')}
                                style={{
                                    width: deviceWidth * 0.1,
                                    height: deviceWidth * 0.1,
                                    borderRadius: deviceWidth * 0.05,
                                    marginBottom: 10
                                }}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: '#666666',
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        marginTop: 5,
                                        marginHorizontal: 5,
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {first_name} {last_name}
                                </Text>
                                {is_verified ? <ValidatedUserIcon {...props} /> : null}
                            </View>
                        </View>
                        {active_pakage_type > 1 && <Image
                            style={{ position: 'absolute', left: 5, top: 50, zIndex: 1 }}
                            source={require('../../../assets/icons/special-label.png')} />}
                        <View
                            style={{
                                flexDirection: 'row-reverse', justifyContent: 'flex-start',
                                alignItems: 'flex-start', paddingHorizontal: 10, paddingVertical: 20
                            }}>
                            <FastImage
                                resizeMethod='resize'
                                style={{
                                    width: deviceWidth * 0.4, borderWidth: 0.6,
                                    borderColor: '#BEBEBE', height: deviceWidth * 0.3, borderRadius: 4
                                }}
                                source={{
                                    uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${photo}`,
                                    headers: { Authorization: 'eTag' },
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                                style={{
                                    marginTop: 20,
                                    marginHorizontal: 10
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <Entypo name='location-pin' size={20} color='#BEBEBE' />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18,
                                            width: '65%',
                                            color: '#BEBEBE'
                                        }}
                                    >
                                        {subcategory_name}
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 18,
                                                color: '#000',
                                            }}
                                        >
                                            {` ${product_name}`}
                                        </Text>
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        width: '100%'
                                    }}
                                >
                                    <FontAwesome5 name='box-open' size={20} color='#BEBEBE' />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18,
                                            marginHorizontal: 2,
                                            color: '#000',
                                            width: '65%'
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#BEBEBE',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 16,
                                            }}>{locales('titles.stockQuantity')}:</Text> {formatter.convertedNumbersToTonUnit(stock)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Button
                            onPress={_ => setModalFlag(true)}
                            style={{
                                textAlign: 'center',
                                borderRadius: 5,
                                padding: 30,
                                marginBottom: 10,
                                backgroundColor: '#00C569',
                                width: '95%',
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
                                textAlign: 'center',
                                fontSize: 22,
                                marginHorizontal: 3,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}>{locales('labels.sendMessageToSeller')}</Text>
                            <MaterialCommunityIcons name='message' size={25} color='#FFFFFF' />
                        </Button>
                        {/* <FastImage
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
                        style={[{
                            padding: 10, paddingTop: 0, alignSelf: 'center',
                            textAlign: 'center', width: '100%', color: '#00C569'
                        }, styles.textBold]}>
                        {locales('titles.stockQuantity')} {formatter.numberWithCommas(item.stock)} {locales('labels.kiloGram')}</Text> */}
                        {/* </TouchableOpacity> */}
                    </TouchableOpacity>
                </Card>
            </>
        )
    }

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

            <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
                <View
                    style={{
                        marginVertical: 10,
                        backgroundColor: '#edf8e6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: deviceWidth * 0.1,
                            height: deviceWidth * 0.2,
                            width: deviceWidth * 0.2,
                            borderWidth: 1,
                            borderColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FontAwesome
                            name='check'
                            size={50}
                            color='#21ad93'
                        />
                    </View>
                    <Text
                        style={{
                            marginVertical: 10,
                            textAlign: 'center',
                            color: '#21ad93',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20
                        }}
                    >
                        {locales('titles.requestSubmittedSuccessfully')}

                    </Text>

                    {products && products.length ? <Text
                        style={{
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 18,
                            color: '#21AD93'
                        }}>
                        {locales('titles.registerRequestDescription')}
                        <Text
                            style={{
                                paddingHorizontal: 10,
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 18,
                                color: '#00C569'
                            }}>
                            {` ${locales('titles.buskool')}`}،
                                </Text>
                        <Text
                            style={{
                                paddingHorizontal: 10,
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 18,
                                color: '#21AD93'
                            }}>
                            {` ${locales('titles.willBeSentToBuyers')}`}
                        </Text>
                    </Text> : null}

                </View>

                {!products || !products.length ? <Text
                    style={{
                        paddingHorizontal: 10,
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        fontSize: 18,
                        color: '#777777'
                    }}>
                    {locales('titles.registerRequestDescription')}
                    <Text
                        style={{
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 18,
                            color: '#00C569'
                        }}>
                        {` ${locales('titles.buskool')}`}،
                                </Text>
                    <Text
                        style={{
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 18,
                            color: '#777777'
                        }}>
                        {` ${locales('titles.willBeSentToBuyers')}`}
                    </Text>
                </Text> : null}

                {!products || !products.length ? <Button
                    onPress={() => props.navigation.navigate('Home', { screen: 'ProductsList', params: { productsListRefreshKey: dataGenerator.generateKey('productList_') } })}
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
                </Button> : null}


                {products && products.length ?
                    <View
                        style={{ marginTop: -20 }}
                    >
                        {/* <View style={{ flexDirection: 'row-reverse', width: deviceWidth }}>
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
                        </View> */}
                        <FlatList
                            ListHeaderComponent={renderListHeaderComponent}
                            ListFooterComponent={renderListFooterComponent}
                            maxToRenderPerBatch={3}
                            getItemLayout={getItemLayout}
                            windowSize={10}
                            initialNumToRender={2}
                            keyExtractor={keyExtractor}
                            data={products}
                            renderItem={renderItem}
                        />
                    </View>
                    : null}
            </ScrollView>
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

