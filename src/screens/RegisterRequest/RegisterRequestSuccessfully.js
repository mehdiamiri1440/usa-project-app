import React, { useCallback, useState } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Card, Button } from 'native-base'
import Svg, { Path, G } from "react-native-svg"
import FastImage from 'react-native-fast-image'

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { dataGenerator, formatter } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';

const RegisterRequestSuccessfully = props => {

    const {
        products = []
    } = props;

    const [selectedContact, setSelectedContact] = useState({});
    const [loading, setLoading] = useState(false);

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
                    padding: 20,
                    marginTop: 15
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#323A42'
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
                            color: '#21AD93',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >{` ${locales('titles.buskool')}`}</Text>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.forYourRequest')}.
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
                    style={{ color: '#1DA1F2', padding: 10 }}
                    name='arrow-left'
                    color='#1DA1F2'
                />
            </View>
        )
    };

    const renderItemSeparatorComponent = _ => {
        return (
            <View
                style={{
                    marginVertical: 15
                }}
            >

            </View>
        )
    }


    const renderItem = ({ item }) => {
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

        return (
            <>
                <Card
                    style={{
                        paddingVertical: 5,
                        borderColor: active_pakage_type == 3 ? '#00C569' : '#CCC',
                        borderTopWidth: 2,
                        borderBottomWidth: 2,
                        elevation: 0,
                        borderRightWidth: 2,
                        borderLeftWidth: 2,
                        borderRadius: 8,
                        width: deviceWidth * 0.96,
                        alignSelf: 'center'
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
                                    width: deviceWidth * 0.09,
                                    marginBottom: 5,
                                    height: deviceWidth * 0.09,
                                    borderRadius: deviceWidth * 0.045,
                                }}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: '#666666',
                                        fontSize: 15,
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

                        {active_pakage_type == 3 && <Svg
                            style={{ position: 'absolute', left: 5, top: 37, zIndex: 1 }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="27"
                            height="37.007"
                            viewBox="0 0 27 37.007"
                        >
                            <G data-name="Group 145" transform="translate(-261 -703.993)">
                                <Path
                                    fill="#00c569"
                                    d="M0 0l27-.016v36.989l-13.741-5.989-13.259 6z"
                                    data-name="Path 1"
                                    transform="translate(261 704.016)"
                                ></Path>
                                <Path
                                    fill="#00b761"
                                    d="M0 0H27V1.072H0z"
                                    data-name="Rectangle 6"
                                    transform="translate(261 703.993)"
                                ></Path>
                                <G fill="#fff" data-name="Group 23" transform="translate(266 707)">
                                    <Path
                                        d="M8.511 15.553A8.529 8.529 0 013.444.175l2.162 2.166a5.455 5.455 0 108.3 5.4l1.488-1.466 1.594 1.57a8.518 8.518 0 01-8.473 7.707zM17 6.384l-1.609-1.59-1.477 1.46a5.476 5.476 0 00-2.759-4.069L13.336 0A8.49 8.49 0 0117 6.382z"
                                        data-name="Subtraction 1"
                                        transform="translate(0 5.447)"
                                    ></Path>
                                    <G data-name="Group 24" transform="translate(3.292)">
                                        <Path
                                            d="M3 0h3.656v3.853H0V3a3 3 0 013-3z"
                                            data-name="Rectangle 12"
                                            transform="rotate(45 -.73 4.156)"
                                        ></Path>
                                        <Path
                                            d="M0 0h9.459v3.5H3.5A3.5 3.5 0 010 0z"
                                            data-name="Rectangle 13"
                                            transform="rotate(135 5.244 3.623)"
                                        ></Path>
                                    </G>
                                </G>
                            </G>
                        </Svg>}
                        <View
                            style={{
                                flexDirection: 'row-reverse', justifyContent: 'flex-start',
                                alignItems: 'flex-start', paddingHorizontal: 10, paddingVertical: 20
                            }}>
                            <FastImage
                                resizeMethod='resize'
                                style={{
                                    backgroundColor: "#f0f3f6",
                                    width: deviceWidth * 0.25,
                                    borderColor: '#BEBEBE', height: deviceWidth * 0.25, borderRadius: 4
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
                                    marginTop: 5,
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
                                    <Entypo name='location-pin' size={20} color='#777777' />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 16,
                                            width: '75%',
                                            color: '#777'
                                        }}
                                    >
                                        {subcategory_name}
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 16,
                                                color: '#474747',
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
                                    <FontAwesome5 name='box-open' size={15} color='#777' />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 16,
                                            marginHorizontal: 2,
                                            color: '#474747',
                                            width: '65%'
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#777',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 16,
                                            }}>{locales('titles.stockQuantity')} :</Text> {formatter.convertedNumbersToTonUnit(stock)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Button
                            onPress={event => {
                                event.stopPropagation();
                                event.preventDefault();
                                setLoading(true);
                                setSelectedContact({
                                    first_name,
                                    last_name,
                                    is_verified,
                                    contact_id: myuser_id
                                });
                                setTimeout(() => {
                                    setLoading(false);
                                    props.navigation.navigate('Chat', { contact: selectedContact })
                                }, 1000);
                            }}
                            style={{
                                textAlign: 'center',
                                zIndex: 10005,
                                borderRadius: 5,
                                elevation: 0,
                                padding: 25,
                                marginBottom: 10,
                                backgroundColor: '#00C569',
                                width: '80%',
                                color: 'white',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}
                            rounded
                        >
                            <View
                                style={{
                                    flexDirection: 'row', justifyContent: 'center',
                                    alignItems: 'center', width: '100%'
                                }}>
                                <ActivityIndicator
                                    size="small"
                                    animating={loading && selectedContact.contact_id && selectedContact.contact_id == item.myuser_id}
                                    color="white"
                                />
                                <Text
                                    onPress={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        setLoading(true);
                                        setSelectedContact({
                                            first_name,
                                            last_name,
                                            is_verified,
                                            contact_id: myuser_id
                                        });
                                        setTimeout(() => {
                                            setLoading(false);
                                            props.navigation.navigate('Chat', { contact: selectedContact })
                                        }, 1000);
                                    }}
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        marginHorizontal: 3,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}>{locales('labels.sendMessageToSeller')}</Text>
                                <MaterialCommunityIcons name='message' size={22} color='#FFFFFF'
                                    onPress={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        setLoading(true);
                                        setSelectedContact({
                                            first_name,
                                            last_name,
                                            is_verified,
                                            contact_id: myuser_id
                                        });
                                        setTimeout(() => {
                                            setLoading(false);
                                            props.navigation.navigate('Chat', { contact: selectedContact })
                                        }, 1000);
                                    }} />
                            </View>
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

            <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
                <View
                    style={{
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
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            color: '#21AD93'
                        }}>
                        {locales('titles.registerRequestDescription')}
                        {` ${locales('titles.buskool')}`}،
                        {` ${locales('titles.willBeSentToBuyers')}`}

                    </Text> : null}

                </View>


                {!products || !products.length ? <Text
                    style={{
                        paddingHorizontal: 10,
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 15,
                        color: '#777777',
                        marginTop: 40
                    }}>
                    {locales('titles.registerRequestDescription')}
                    <Text
                        style={{
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 15,
                            color: '#21ad93'
                        }}>
                        {` ${locales('titles.buskool')}`}،
                                </Text>
                    <Text
                        style={{
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 15,
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
                        elevation: 0,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                    rounded
                >
                    <Text style={{
                        color: 'white',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: 16,
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
                            ItemSeparatorComponent={renderItemSeparatorComponent}
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

