import React, { useState, useRef, useEffect } from 'react';
import {
    FlatList, View, Text, Image, TouchableOpacity,
    ActivityIndicator, Modal, Animated, Linking
} from 'react-native';
import { connect } from "react-redux";
import Svg, { Path, G } from "react-native-svg"
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
                setContents([...result.payload.contents])
            });
            firstLoad = false;
        }
        return _ => props.fetchAllContactsList()
    }, []);

    const {
        channelDataLoading,
        channelData = {}
    } = props;

    const {
        total
    } = channelData;

    const shareProfile = async _ => {

        const {
            userProfile = {}
        } = props;

        const {
            user_info = {}
        } = userProfile;

        const {
            user_name
        } = user_info;

        const url = `whatsapp://send?text=${REACT_APP_API_ENDPOINT_RELEASE}/shared-profile/${user_name}`;

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

        const firstText = text && text.length ? text.split('\n')[0] : '';
        const secondText = text && text.length ? text.split('\n')[1] : '';

        const firstTextFirstPart = firstText && firstText.length ? firstText.split('|')[0] : '';
        const firstTextSecondPart = firstText && firstText.length ? firstText.split('|')[1] : '';

        const secondTextNumberPart = secondText && secondText.length ? secondText.split(' ')[2] : '';

        return (
            <TouchableOpacity
                onPress={_ => redirectToProduct(product_id)}
                style={{
                    backgroundColor: 'white',
                    minHeight: 50,
                    width: '70%',
                    padding: 10,
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: '#00C569'
                }}
            >
                <Svg
                    style={{ position: 'absolute', left: 5, top: 0, zIndex: 1 }}
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
                </Svg>
                <Text
                    style={{
                        color: '#474747',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 16,
                        textAlign: 'right'
                    }}
                >
                    {locales('labels.suggesstedProduct')}
                </Text>
                <Image
                    source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${file_path}` }}
                    style={{
                        resizeMode: 'cover',
                        width: deviceWidth * 0.66,
                        alignSelf: 'center',
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: '#EEEEEE',
                        height: deviceWidth * 0.66,
                        borderRadius: 5
                    }}
                />
                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        width: '100%',
                        marginTop: 10
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
                        {firstTextFirstPart}{firstTextSecondPart && firstTextSecondPart.length ? '|' : ''} <Text
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
                    <View style={{ flexDirection: 'row-reverse', paddingVertical: 3, width: '100%' }}>
                        <FontAwesome5
                            name='box-open'
                            size={18}
                            color='#BEBEBE'
                            style={{ marginTop: 2 }}
                        />
                        <Text
                            style={{
                                color: '#474747',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                marginHorizontal: 3

                            }}
                        >
                            {locales('titles.stockQuantity')} :
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 14, marginTop: 2 }}>
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

    const sendCtaLink = url => {
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

    const renderCtaText = (cta_text, cta_link) => {
        if (cta_text && cta_text.length && cta_link && cta_link.length)
            return (
                <TouchableOpacity
                    onPress={_ => sendCtaLink(cta_link)}
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(56,72,95,.67)',
                        marginRight: 12,
                        marginBottom: 10,
                        width: deviceWidth * 0.72,
                        padding: 10,
                        borderRadius: 6,
                        alignItems: 'center'
                    }}>
                    <FontAwesome5 name='link' color='white' size={15} />
                    <Text
                        numberOfLines={1}
                        style={{
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            marginHorizontal: 3,
                            fontSize: 16
                        }}
                    >
                        {cta_text}
                    </Text>
                </TouchableOpacity>
            )
        return null;
    };

    const renderItem = ({ item, index }) => {

        const {
            text = '',
            file_path = '',
            created_at = '',
            is_product = false,
            is_sharable = false,
            id = '',
            cta_text = '',
            cta_link = ''
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
                        {!!is_sharable && !cta_link && !cta_text ? <TouchableOpacity
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
                                        alignSelf: 'center',
                                        width: deviceWidth * 0.66,
                                        height: deviceWidth * 0.66,
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
                                    fontSize: 19,
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
                            marginRight: 17,
                            marginBottom: 10,
                            width: deviceWidth * 0.705,
                            padding: 10,
                            borderRadius: 6,
                            alignItems: 'center'
                        }}>
                        <FontAwesome5 name='share' color='white' size={15} />
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
                    </TouchableOpacity> : renderCtaText(cta_text, cta_link)}
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
                        backgroundColor: 'rgba(0,0,0,1)'
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
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: 10,

                    }}
                >
                    <Animated.Text
                        numberOfLines={8}
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
                    height: 60,
                    paddingTop: 2,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    zIndex: 1
                }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row-reverse', paddingVertical: 10, }}
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
                            borderRadius: 23, marginVertical: 10,
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
                onPress={shareProfile}
                style={{
                    width: deviceWidth,
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#4eb9fb',
                    padding: 10
                }}
            >
                <FontAwesome
                    name='address-card'
                    color='white'
                    size={20}
                />
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        marginHorizontal: 7,
                        fontSize: 16
                    }}
                >
                    {locales('labels.sendYourProfileToYourFriends')}
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

    const {
        userProfile
    } = state.profileReducer;

    return {
        channelDataLoading,
        channelDataFailed,
        channelDataError,
        channelDataMessage,
        channelData,

        userProfile
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchChannelData: page => dispatch(messagesActions.fetchChannelData(page)),
        fetchAllContactsList: (from, to) => dispatch(messagesActions.fetchAllContactsList(from, to)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);