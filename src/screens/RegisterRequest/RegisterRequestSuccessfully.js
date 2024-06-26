import React, { useCallback, useState, useRef } from 'react'
import {
    Text, View, Pressable, FlatList, StyleSheet,
    Image, ActivityIndicator, Linking,
    LayoutAnimation, UIManager, Platform,
    TouchableOpacity, ScrollView
} from 'react-native'
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Card, Button } from 'native-base'
import Svg, { Path, G, Circle } from "react-native-svg"
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';

import * as productListActions from '../../redux/productsList/actions';
import * as productActions from '../../redux/registerProduct/actions';
import { dataGenerator, formatter, deviceWidth, validator, deviceHeight } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import Header from '../../components/header';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegisterRequestSuccessfully = props => {

    const flatListRef = useRef(null);

    const scrollViewRef = useRef(null);

    const viewRef = useRef(null);

    const {
        products = [],
        sellerMobileNumberLoading = false,
    } = props;

    const [selectedContact, setSelectedContact] = useState({});
    const [loading, setLoading] = useState(false);

    const [isContactInfoShown, setIsContactInfoShown] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(false);
    const [showMobileNumberWarnModal, setShowMobileNumberWarnModal] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [accessToContactInfoErrorMessage, setAccessToContactInfoErrorMessage] = useState('');
    const [showBox, setShowBox] = useState(true);
    const [scrollOffset, setOffset] = useState(0);

    const handleBack = () => {
        props.resetRegisterRequest(true)
        return props.navigation.dispatch(StackActions.popToTop());
    }

    const keyExtractor = item => `${dataGenerator.generateKey('request_')}${item?.id.toString()}`;

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * index,
        index
    }), []);

    const renderListHeaderComponent = _ => {
        if (showBox)
            return (
                <TouchableOpacity
                    onPress={_ => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setShowBox(false);
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}
                >
                    <FontAwesome5
                        name='angle-up'
                        color='white'
                        size={20}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.suggestedSellers')}
                    </Text>
                </TouchableOpacity>
            );
        return null;
        // return (
        //     <View
        //         style={{
        //             padding: 20,
        //             marginTop: 15
        //         }}
        //     >
        //         <Text
        //             style={{
        //                 fontSize: 22,
        //                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
        //                 color: '#323A42'
        //             }}
        //         >
        //             {locales('labels.suggestedSellers')}
        //         </Text>
        //         <Text
        //             style={{
        //                 color: '#777777',
        //                 marginVertical: 10,
        //                 fontSize: 16,
        //                 fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //             }}
        //         >
        //             {locales('labels.suggestedSellersForYou')}
        //             <Text
        //                 style={{
        //                     color: '#21AD93',
        //                     fontWeight: '200',
        //                     fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //                 }}
        //             >{` ${locales('titles.buskool')}`}</Text>
        //             <Text
        //                 style={{
        //                     color: '#777777',
        //                     fontWeight: '200',
        //                     fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //                 }}
        //             >
        //                 {locales('labels.forYourRequest')}.
        //             </Text>
        //         </Text>
        //     </View>
        // )
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
                        color: showBox ? 'white' : '#1DA1F2',
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
                    color={showBox ? 'white' : '#1DA1F2'}
                />
            </View>
        )
    };


    const openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    const fetchContactInfo = (item, index) => {
        const { id, myuser_id } = item;

        setSelectedButton(id);
        const contactInfoObject = {
            s_id: myuser_id,
            p_id: id,
            item: "PRODUCT"
        }
        props.fetchSellerMobileNumber(contactInfoObject).then(result => {
            const {
                payload = {}
            } = result;
            const {
                phone,
                status
            } = payload;
            if (status == true && !!phone) {
                item.isContactInfoShown = true;
                item.mobileNumber = phone;
                setMobileNumber(phone);
                setIsContactInfoShown(true);
                return scrollViewRef?.current?.scrollTo({
                    y: scrollOffset + 100,
                    x: 0,
                    animated: true
                });
            }
        })
            .catch(err => {
                const {
                    response = {}
                } = err;
                const {
                    data = {}
                } = response;
                const {
                    msg,
                    status
                } = data;
                if (status == false) {
                    setAccessToContactInfoErrorMessage(msg);
                    setShowMobileNumberWarnModal(true);
                }
            });
    };

    const navigateToChat = (event, { first_name, last_name, is_verified, myuser_id }, productId) => {
        event.stopPropagation();
        event.preventDefault();
        const tempContact = {
            first_name,
            last_name,
            is_verified,
            contact_id: myuser_id
        };
        setSelectedContact({ ...tempContact });
        props.navigation.navigate('Chat', {
            shouldHideGuidAndComment: true,
            contact: { ...tempContact },
            productId
        })
    };

    const renderItem = ({ item, index }) => {
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
            photo,
            has_phone
        } = item;

        return (
            <>

                <Card
                    style={{
                        paddingVertical: 5,
                        borderColor: active_pakage_type == 3 ? '#00C569' : 'rgba(0,0,0,0.15)',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        elevation: 0,
                        borderRightWidth: 1,
                        borderLeftWidth: 1,
                        borderRadius: 8,
                        width: deviceWidth * 0.96,
                        alignSelf: 'center'
                    }}
                >
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        activeOpacity={1}
                        onPress={() => props.navigation.navigate('ProductDetails', { productId: id })}
                    >
                        {/* <View
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
                        </View> */}

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
                                flexDirection: 'row-reverse',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                paddingHorizontal: 10,
                                paddingVertical: 5
                            }}>
                            <FastImage
                                resizeMethod='resize'
                                style={{
                                    backgroundColor: "#f0f3f6",
                                    width: deviceWidth * 0.26,
                                    borderColor: '#BEBEBE',
                                    height: deviceWidth * 0.21,
                                    borderRadius: 4
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
                                    marginHorizontal: 10,
                                    top: -3,
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
                                    {/* <Entypo name='location-pin' size={20} color='#777777' /> */}
                                    {/* <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 16,
                                            width: '75%',
                                            color: '#777'
                                        }}
                                    >
                                        {subcategory_name} */}
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 18,
                                            fontWeight: '200',
                                            width: '85%',
                                            color: 'black',
                                        }}
                                    >
                                        {` ${product_name}`}
                                    </Text>
                                    {/* </Text> */}
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal: 20
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            marginTop: 5,
                                            width: '100%'
                                        }}
                                    >
                                        <FontAwesome5
                                            name='user-circle'
                                            color='black'
                                            size={19}
                                            solid
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)',
                                                fontSize: 15,
                                                marginHorizontal: 5,
                                                color: 'black',
                                                width: '75%'
                                            }}
                                        >
                                            {/* <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#777',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontWeight: '200',
                                                fontSize: 16,
                                            }}>{locales('titles.stockQuantity')} :</Text> */}
                                            {`${first_name} ${last_name}`}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            width: '100%'
                                        }}
                                    >
                                        <FontAwesome5
                                            name='box-open'
                                            size={15}
                                            color='black'
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)',
                                                fontSize: 15,
                                                marginHorizontal: 5,
                                                color: 'black',
                                                width: '65%'
                                            }}
                                        >
                                            {/* <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#777',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontWeight: '200',
                                                fontSize: 16,
                                            }}>{locales('titles.stockQuantity')} :</Text> */}
                                            {formatter.convertedNumbersToTonUnit(stock)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {has_phone ?
                            <View style={{
                                marginVertical: 15,
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                width: '97%',
                                paddingHorizontal: 5,
                                alignSelf: 'center',
                                justifyContent: 'space-between'
                            }}
                            >
                                <Button
                                    small
                                    onPress={() => fetchContactInfo(item, index)}
                                    style={{
                                        borderColor: item.isContactInfoShown ? '#c7a84f' : '#FF9828',
                                        width: '49%',
                                        zIndex: 1000,
                                        position: 'relative',
                                        alignSelf: 'center',

                                    }}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0.51, z: 1 }}
                                        end={{ x: 0.8, y: 0.2, z: 1 }}
                                        colors={!item.isContactInfoShown ? ['#FF9828', '#FF9828', '#FF9828'] : ['#E0E0E0', '#E0E0E0']}
                                        style={{
                                            width: '100%',
                                            paddingHorizontal: 10,
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            height: 45.7,
                                            paddingLeft: 20,
                                            padding: 8,
                                            elevation: 0
                                        }}
                                    >
                                        {!!sellerMobileNumberLoading && selectedButton == item.id ?
                                            <ActivityIndicator
                                                size={17}
                                                color='white'
                                                animating
                                                style={{
                                                    position: 'relative',
                                                    width: 10, height: 10, borderRadius: 5,
                                                    marginRight: 5
                                                }}
                                            />
                                            :
                                            <FontAwesome5
                                                solid
                                                name='phone-alt'
                                                color='white'
                                                size={14}
                                                style={{
                                                }}
                                            />
                                        }
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                marginHorizontal: 3,
                                                fontSize: 16,
                                                color: 'white',
                                                paddingHorizontal: 3
                                            }}
                                        >
                                            {locales('labels.callWithSeller')}
                                        </Text>

                                    </LinearGradient>

                                </Button>

                                <Button
                                    small
                                    onPress={event => navigateToChat(event, item, id)}
                                    style={{
                                        width: '49%',
                                        zIndex: 1000,
                                        elevation: 0,
                                        position: 'relative',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0.51, z: 1 }}
                                        end={{ x: 0.8, y: 0.2, z: 1 }}
                                        colors={['#fff', '#fff']}
                                        style={{
                                            width: '100%',
                                            borderColor: '#556080',
                                            paddingHorizontal: 10,
                                            flexDirection: 'row-reverse',
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            padding: 8,
                                            elevation: 0
                                        }}
                                    >

                                        <MaterialCommunityIcons
                                            name='message'
                                            color='#556080'
                                            size={15}
                                        />
                                        <Text
                                            onPress={event => navigateToChat(event, item, id)}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 16,
                                                color: '#556080',
                                                paddingHorizontal: 3
                                            }}
                                        >
                                            {locales('labels.sendMessageToSeller')}
                                        </Text>
                                        <ActivityIndicator
                                            size="small"
                                            animating={loading && selectedContact.contact_id && selectedContact.contact_id == item.myuser_id}
                                            color='#556080'
                                            style={{
                                                position: 'relative',
                                                width: 10,
                                                height: 10,
                                                borderRadius: 5,
                                                marginLeft: -10,
                                                marginRight: 5
                                            }}
                                        />
                                    </LinearGradient>
                                </Button>
                            </View>
                            :
                            <Button
                                onPress={event => navigateToChat(event, item, id)}
                                style={{
                                    textAlign: 'center',
                                    zIndex: 10005,
                                    borderRadius: 8,
                                    elevation: 0,
                                    marginBottom: 10,
                                    backgroundColor: '#FF9828',
                                    width: '68%',
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
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <Text
                                        onPress={event => navigateToChat(event, item, id)}
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            marginHorizontal: 3,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                        }}>
                                        {locales('labels.sendMessageToSeller')}
                                    </Text>
                                    {
                                        loading && selectedContact.contact_id && selectedContact.contact_id == item.myuser_id
                                            ?
                                            <ActivityIndicator
                                                size="small"
                                                color="white"
                                            />
                                            :
                                            <MaterialCommunityIcons
                                                name='message'
                                                size={17}
                                                color='#FFFFFF'
                                                onPress={event => navigateToChat(event, item, id)}
                                            />
                                    }
                                </View>
                            </Button>
                        }
                        {(item.isContactInfoShown) ?
                            <View
                                ref={viewRef}
                            >
                                <View
                                    style={{
                                        zIndex: 1,
                                        flexDirection: 'row-reverse',
                                        paddingVertical: 25,
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        width: '90%',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18,
                                            color: '#404B55'
                                        }}>
                                        {locales('titles.phoneNumber')}
                                    </Text>
                                    <Pressable
                                        android_ripple={{
                                            color: '#ededed'
                                        }}
                                        onPress={_ => openCallPad(item.mobileNumber)}
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#404B55', fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5
                                            }}
                                        >
                                            {item.mobileNumber}
                                        </Text>
                                        <FontAwesome5
                                            name='phone-alt'
                                            size={20}
                                        />
                                    </Pressable>
                                </View>

                                <View
                                    style={{
                                        backgroundColor: '#FFFBE5',
                                        borderRadius: 12,
                                        alignSelf: 'center',
                                        padding: 20,
                                        width: '90%',
                                        zIndex: 1,
                                        bottom: 10
                                    }}
                                >

                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FontAwesome5
                                            color='#404B55'
                                            size={25}
                                            name='exclamation-circle'
                                        />
                                        <Text
                                            style={{
                                                color: '#404B55',
                                                marginHorizontal: 5,
                                                fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            }}
                                        >
                                            {locales('titles.policeWarn')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginVertical: 15,
                                            color: '#666666',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}
                                    >
                                        {locales('labels.policeWarnDescription')}
                                    </Text>
                                </View>
                            </View>
                            : null}
                    </Pressable>
                </Card>
            </>
        )
    }

    return (

        <View
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >
            < Portal
                style={{
                    padding: 0,
                    margin: 0
                }}>
                <Dialog
                    visible={showMobileNumberWarnModal}
                    onDismiss={_ => setShowMobileNumberWarnModal(false)}
                    style={styles.dialogWrapper}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >
                        <Button
                            onPress={_ => setShowMobileNumberWarnModal(false)}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>
                        <Paragraph style={styles.headerTextDialogModal}>
                            {locales('labels.callWithSeller')}
                        </Paragraph>
                    </Dialog.Actions>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>

                        <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                            borderColor: '#facea8',
                        }]} />

                    </View>
                    <Paragraph
                        style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                        {accessToContactInfoErrorMessage}
                    </Paragraph>
                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={styles.modalCloseButton}
                            onPress={_ => setShowMobileNumberWarnModal(false)}
                        >

                            <Text style={styles.closeButtonText}>{locales('titles.close')}
                            </Text>
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >

            <Header
                title={locales('labels.registerRequest')}
                onBackButtonPressed={_ => handleBack()}
                {...props}
            />
            <ScrollView
                ref={scrollViewRef}
                onScroll={event => setOffset(event.nativeEvent.contentOffset.y)}
            >
                {showBox == true ?
                    <LinearGradient
                        start={{ x: 0, y: 0.51, z: 1 }}
                        end={{ x: 0.8, y: 0.2, z: 1 }}
                        colors={['#aef8d6', '#67ce9e']}
                        style={{
                            borderRadius: 8,
                            padding: 20,
                            width: '95%',
                            alignSelf: 'center',
                            marginVertical: 15,
                            marginHorizontal: 25,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'white',
                                opacity: 0.3,
                                width: 100,
                                height: 100,
                                borderRadius: 100,
                                top: '-35%',
                                overflow: 'hidden',
                                position: 'absolute',
                            }}
                        >
                        </View>
                        <View
                            style={{
                                backgroundColor: 'white',
                                opacity: 0.3,
                                width: 100,
                                height: 100,
                                borderRadius: 100,
                                left: '-15%',
                                overflow: 'hidden',
                                position: 'absolute',
                            }}
                        >
                        </View>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="32"
                                fill="none"
                                viewBox="0 0 36 32"
                            >
                                <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                <Circle cx="16" cy="16" r="15.5" stroke="#000"></Circle>
                                <Path stroke="#000" d="M9.778 16l5.333 4.445 7.111-8.89"></Path>
                            </Svg>
                            <Text
                                style={{
                                    marginVertical: 10,
                                    textAlign: 'center',
                                    color: '#264653',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18,
                                    marginHorizontal: 10
                                }}
                            >
                                {locales('titles.requestSubmittedSuccessfully')}
                            </Text>
                        </View>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: 'rgba(38,70,83,0.8)',
                                fontFamily: 'IRANSansWeb(FaNum)',
                                fontSize: 15
                            }}
                        >
                            {locales('titles.registerRequestFullDescription')}
                        </Text>
                    </LinearGradient>
                    : null}

                {/* 
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

            </View> */}


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
                            fontWeight: '200',
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
                            fontWeight: '200',
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
                        backgroundColor: '#FF9828',
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
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={showBox ? ['#9FBDCA', '#548DA5'] : ['white', 'white']}
                        style={{
                            borderRadius: 8,
                            alignSelf: 'center',
                            flex: 1
                        }}
                    >

                        <FlatList
                            ListHeaderComponent={renderListHeaderComponent}
                            ListFooterComponent={renderListFooterComponent}
                            maxToRenderPerBatch={3}
                            getItemLayout={getItemLayout}
                            windowSize={10}
                            initialNumToRender={2}
                            keyExtractor={keyExtractor}
                            data={products}
                            ref={flatListRef}
                            renderItem={renderItem}
                        />
                    </LinearGradient>
                    : null}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    buttonText: {
        color: 'white',
        width: '80%',
        textAlign: 'center'
    },
    backButtonText: {
        color: '#7E7E7E',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        width: '60%',
        textAlign: 'center'
    },
    closeButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#777777',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#FF9828',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        alignSelf: 'center',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#FF9828',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        padding: 20,
    },
    userText: {
        flexWrap: 'wrap',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    }
})

const mapStateToProps = (state) => {
    return {
        products: state.registerProductReducer.products,
        sellerMobileNumberLoading: state.productsListReducer.sellerMobileNumberLoading
    }
};
const mapDispatchToProps = dispatch => {
    return {
        resetRegisterRequest: resetTab => dispatch(productActions.resetRegisterRequest(resetTab)),
        fetchSellerMobileNumber: contactInfoObject => dispatch(productListActions.fetchSellerMobileNumber(contactInfoObject)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterRequestSuccessfully);

