import React, { useState, useRef, useEffect } from 'react';
import {
    FlatList, View, Text, Image, TouchableOpacity, Share,
    ActivityIndicator, Modal, Animated, Linking
} from 'react-native';
import { connect } from "react-redux";
import Jmoment from 'moment-jalaali';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import * as messagesActions from '../../redux/messages/actions';
import { deviceWidth, parser, formatter, deviceHeight } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';

const Channel = props => {

    let onEndReachedCalledDuringMomentum = true;
    let firstLoad = true;

    const ChannelContainerRef = useRef();
    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    let translateY = useState(new Animated.Value(0))[0];
    const [caption, setCaption] = useState(true);
    const [contents, setContents] = useState([]);


    useEffect(_ => {
        if (firstLoad) {
            props.fetchChannelData(page).then(result => {
                console.log('first load', result)
                setContents([...result.payload.contents])
            });
            firstLoad = false;
        }
    }, []);

    const {
        channelDataLoading,
        channelData = {}
    } = props;

    const {
        total
    } = channelData;

    const renderListHeaderComponent = _ => {
        return (
            <View>

            </View>
        )
    };

    const shareApp = async _ => {
        try {
            const result = await Share.share({
                message: `https://play.google.com/store/apps/details?id=com.buskool`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const forwardMessage = (id) => {
        const url = `whatsapp://send?text=${REACT_APP_API_ENDPOINT_RELEASE}/public-channel/${id}`;
        Linking.canOpenURL(url).then((supported) => {
            if (!!supported) {
                Linking.openURL(url)
            } else {
                Linking.openURL(url)
            }
        })
            .catch(() => {
                Linking.openURL(url)
            })

    };

    const redirectToProduct = (product_id = '') => props.navigation.navigate('ProductDetails', { productId: product_id })

    const renderMessageWithProductDesign = ({ text = '', file_path = '', product_id = '', created_at = '' }) => {

        const firstText = text.split('\n')[0];
        const secondText = text.split('\n')[1];

        const firstTextFirstPart = firstText.split('|')[0];
        const firstTextSecondPart = firstText.split('|')[1];

        const secondTextNumberPart = secondText.split(' ')[2];

        return (
            <TouchableOpacity
                onPress={_ => redirectToProduct(product_id)}
                style={{
                    backgroundColor: 'white',
                    minHeight: 50,
                    width: '70%',
                    padding: 10,
                    borderRadius: 6,
                    flexDirection: 'row-reverse'
                }}
            >
                <Image
                    source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${file_path}` }}
                    style={{
                        resizeMode: 'cover',
                        width: deviceWidth * 0.27,
                        height: deviceWidth * 0.27,
                        borderRadius: 4
                    }}
                />
                <View
                    style={{
                        marginHorizontal: 10,
                        justifyContent: 'space-around',
                        alignItems: 'flex-end',
                        maxWidth: '55%',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#474747',
                            fontSize: 15
                        }}
                    >
                        {firstTextFirstPart} | <Text
                            numberOfLines={1}
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: '#777777',
                                fontSize: 15
                            }}
                        >
                            {firstTextSecondPart}
                        </Text>
                    </Text>
                    <View style={{ flexDirection: 'row-reverse', paddingVertical: 3, width: '85%' }}>
                        <Text
                            numberOfLines={1}
                            style={{ textAlign: 'right', marginLeft: 9 }}>
                            <FontAwesome5 name='box-open' size={18} color='#BEBEBE' />
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 14 }}>
                            {formatter.convertedNumbersToTonUnit(secondTextNumberPart)}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#B2B2B2',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 13
                            }}
                        >
                            {Jmoment(created_at).format('jYYYY/jMM/jDD , HH:mm')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const renderItem = ({ item, index }) => {

        const {
            text = '',
            file_path = '',
            created_at = '',
            is_product = false,
            is_sharable = false,
            id = ''
        } = item;

        return (
            <>
                {parser.showDate(contents[index], contents[index > 0 ? index - 1 : 0])}
                <View>
                    <View
                        style={{
                            width: deviceWidth,
                            margin: 18,
                            marginBottom: 8,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        {!!is_sharable ? <TouchableOpacity
                            onPress={_ => forwardMessage(id)}
                            style={{
                                backgroundColor: 'rgba(102,102,102,0.44)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                padding: 10,
                                margin: 10
                            }}
                        >
                            <FontAwesome5 name='share' color='white' size={20} />
                        </TouchableOpacity> : null}

                        {!is_product ? <View
                            style={{
                                backgroundColor: 'white',
                                minHeight: 50,
                                width: '70%',
                                padding: 10,
                                borderRadius: 6
                            }}
                        >
                            {file_path ? <TouchableOpacity
                                onPress={_ => setSelectedItem(item)}
                                activeOpacity={1}
                            >
                                <Image
                                    source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${file_path}` }}
                                    style={{
                                        maxWidth: 270,
                                        width: '100%',
                                        minWidth: 200,
                                        height: 300,
                                        maxHeight: 350,
                                        minHeight: 250,
                                        resizeMode: 'cover',
                                    }}
                                />
                            </TouchableOpacity>
                                : null}
                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    left: -6,
                                    top: 0,
                                    borderBottomLeftRadius: 50,
                                }}
                            >

                            </View>
                            <Text
                                style={{
                                    width: '100%',
                                    marginTop: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    color: '#313A43',
                                }}
                            >
                                {text}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#B2B2B2',
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        fontSize: 13
                                    }}
                                >
                                    {Jmoment(created_at).format('jYYYY/jMM/jDD , HH:mm')}
                                </Text>
                            </View>
                        </View>
                            : renderMessageWithProductDesign(item)}

                    </View>
                    {!!is_sharable ? <TouchableOpacity
                        onPress={_ => forwardMessage(id)}
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            marginRight: 12,
                            marginBottom: 10,
                            width: deviceWidth * 0.72,
                            padding: 10,
                            borderRadius: 6,
                            alignItems: 'center'
                        }}>
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                marginHorizontal: 3,
                                fontSize: 16
                            }}
                        >
                            {locales('titles.sendToFriends')}
                        </Text>
                        <FontAwesome5 name='share' color='white' size={15} />
                    </TouchableOpacity> : null}
                </View>
            </>

        )
    };

    const renderKeyExtractor = item => item.id.toString();

    const onEndReached = _ => {
        if (!onEndReachedCalledDuringMomentum && contents.length < total) {
            let tempPage = page;
            tempPage = tempPage + 1;
            setPage(tempPage);
            props.fetchChannelData(tempPage).then(result => {
                console.log('end reached', result);
                setContents([...contents, ...result.payload.contents])
            });
            onEndReachedCalledDuringMomentum = true;
        }
    };
    const fadeIn = _ => {
        return Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const fadeOut = _ => {
        return Animated.timing(translateY, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true
        }).start()
    };

    return (
        <>
            <Modal
                visible={!!selectedItem}
                onRequestClose={_ => setSelectedItem(null)}
                transparent={false}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row-reverse',
                        height: 40,
                        position: 'absolute',
                        zIndex: 1,
                        right: 0
                    }}
                    onPress={() => setSelectedItem(null)}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end', paddingHorizontal: 10
                        }}
                    >
                        <FontAwesome5 name='times-circle' size={35} solid color='white' />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={_ => {
                        !caption ? fadeIn() : fadeOut();
                        setCaption(!caption)
                    }}
                    style={{
                        width: deviceWidth,
                        height: deviceHeight,
                        backgroundColor: 'black'
                    }}
                >

                    <Image
                        source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${selectedItem?.file_path}` }}
                        style={{
                            resizeMode: 'contain',
                            width: deviceWidth,
                            alignSelf: 'center',
                            height: deviceHeight,
                            borderRadius: 4
                        }}
                    />
                </TouchableOpacity>
                <Animated.View
                    style={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        translateY,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        maxHeight: 200,
                        padding: 10,

                    }}
                >
                    <Animated.Text
                        onPress={_ => {
                            !caption ? fadeIn() : fadeOut();
                            setCaption(!caption)
                        }}
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            color: 'white'
                        }}
                    >
                        {selectedItem?.text}
                    </Animated.Text>
                </Animated.View>

            </Modal>

            <View
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 53,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    zIndex: 1
                }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row-reverse' }}
                    onPress={() => props.navigation.goBack()}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end', paddingHorizontal: 10
                        }}
                    >
                        <AntDesign name='arrowright' size={25}
                        />
                    </View>
                    <Image
                        style={{
                            borderRadius: 23,
                            width: 46, height: 46
                        }}
                        source={require('../../../assets/icons/buskool-logo.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{
                        paddingHorizontal: 10,
                        width: deviceWidth * 0.6,
                        alignItems: 'flex-end',
                    }}>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <View
                            style={{ flexDirection: 'row-reverse', alignItems: 'center', width: '96%' }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 18, marginHorizontal: 5
                                }}
                            >
                                {locales('titles.buskoolOfficialChannel')}
                            </Text>
                            <ValidatedUserIcon  {...props} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Image
                source={require('../../../assets/images/whatsapp-wallpaper.png')}
                style={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                    width: '100%',
                    height: '100%',
                }}
            />

            {channelDataLoading ? <ActivityIndicator
                size="large"
                color="#00C569"
                style={{
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    alignSelf: 'center',
                    borderColor: 'black',
                    backgroundColor: 'white',
                    width: 50,
                    position: 'absolute',
                    left: '44%',
                    top: '10%',
                    height: 50,
                    borderRadius: 25

                }}
            /> : null}

            <FlatList
                ref={ChannelContainerRef}
                keyExtractor={renderKeyExtractor}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderListHeaderComponent}
                inverted={!!contents && !!contents.length}
                renderItem={renderItem}
                removeClippedSubviews
                legacyImplementation
                windowSize={8}
                maxToRenderPerBatch={3}
                onMomentumScrollBegin={() => onEndReachedCalledDuringMomentum = false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                data={contents}
            />

            <TouchableOpacity
                activeOpacity={1}
                onPress={shareApp}
                style={{
                    width: deviceWidth,
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00C569',
                    padding: 10
                }}
            >
                <FontAwesome
                    name='android'
                    color='white'
                    size={25}
                />
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        marginHorizontal: 5,
                        fontSize: 16
                    }}
                >
                    {locales('titles.referralShareButton')}
                </Text>
            </TouchableOpacity>
        </>
    )
};

const mapStateToProps = state => {

    const {
        channelDataLoading,
        channelDataFailed,
        channelDataError,
        channelDataMessage,
        channelData
    } = state.messagesReducer;

    return {
        channelDataLoading,
        channelDataFailed,
        channelDataError,
        channelDataMessage,
        channelData
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchChannelData: page => dispatch(messagesActions.fetchChannelData(page))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);