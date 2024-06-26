import React, { memo, useRef, useEffect } from 'react';
import Jmoment from 'moment-jalaali';
import { ToastAndroid, View, Text, Pressable, Linking, ActivityIndicator, Animated } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Clipboard from "@react-native-community/clipboard";

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils/deviceDimenssions';
import { validator, parser } from '../../utils';

const Message = props => {

    const {
        item,
        index,
        separators,
        contact,
        loggedInUserId,
        prevMessage,
        active_pakage_type,
        handlePromotionModalVisiblity = _ => { },
        handleEditPriceModalVisiblity = _ => { },
        productDetailsLoading,
        selectedMessageId,
        setInventoryModalVisibility = _ => { }
    } = props;

    const { contact_id: id } = contact;

    const showPhoneFormat = item.sender_id != loggedInUserId && item.is_phone;

    const showToast = _ => {
        ToastAndroid.showWithGravityAndOffset(
            locales('titles.copiedToClipboard'),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            5,
            250);
        Clipboard.setString(item.text);
    };

    return (
        <>
            {parser.showDate(item, prevMessage)}

            <View
                style={{
                    width: deviceWidth,
                    paddingHorizontal: 10,
                    paddingVertical: 0,
                    marginTop: index == separators.length - 1 ? 50 : (index < separators.length - 1 && separators[index].receiver_id == separators[index + 1].receiver_id ? 5 : 7),
                    flex: 1,
                    alignItems: id == item.receiver_id ? 'flex-end' : 'flex-start'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            backgroundColor: 'rgba(204,204,204,0.4)',
                            paddingBottom: 1.5,
                            paddingTop: 1,
                            paddingLeft: 1.5,
                            paddingRight: 1,
                            borderRadius: 9,
                            borderTopWidth: 0.3,
                            borderBottomWidth: 0.7,
                            borderLeftWidth: 0.3,
                            borderRightWidth: 0.3,
                            borderTopColor: 'rgba(204,204,204,0.1)',
                            borderBottomColor: 'rgba(204,204,204,0.7)',
                            borderRightColor: 'rgba(204,204,204,0.1)',
                            borderLeftColor: 'rgba(204,204,204,0.1)',
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: 10,
                                maxWidth: deviceWidth * 0.75,
                                borderRadius: 9,
                                borderBottomRightRadius: !!item.p_id || showPhoneFormat ? 0 : 9,
                                borderBottomLeftRadius: !!item.p_id || showPhoneFormat ? 0 : 9,
                                paddingVertical: 3,
                                backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                            }}
                        >
                            {item.p_id || item.phone_locked || item.isSentFromDelsa == true ?
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 14,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        color: 'rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {locales('titles.botSentItAutomatically')}
                                </Text>
                                : null
                            }
                            <Text
                                selectionColor='gray'
                                suppressHighlighting
                                selectable
                                // onPress={showToast}
                                style={{
                                    zIndex: 999999,
                                    textAlign: 'right',
                                    fontSize: showPhoneFormat ? 18 : 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    color: showPhoneFormat ? '#5188B8' : '#333333'

                                }}>
                                {item.text}
                            </Text>
                            <RenderDate
                                item={item}
                                {...props}
                                id={id}
                                showPhoneFormat={showPhoneFormat}
                            />
                        </View>
                        {item.isSentFromDelsa == true
                            ? null
                            :
                            <RenderPhoneFormatMessage
                                showPhoneFormat={showPhoneFormat}
                                item={item}
                                handlePromotionModalVisiblity={handlePromotionModalVisiblity}
                                handleEditPriceModalVisiblity={handleEditPriceModalVisiblity}
                                active_pakage_type={active_pakage_type}
                                selectedMessageId={selectedMessageId}
                                productDetailsLoading={productDetailsLoading}
                                id={id}
                                {...props}
                            />
                        }
                        <RenderMessageWithProductIdDesign
                            item={item}
                            {...props}
                        />
                    </View>
                    {loggedInUserId == item.sender_id && item.phone_locked ?
                        <FontAwesome5
                            onPress={_ => setInventoryModalVisibility(true)}
                            name='exclamation-circle'
                            color='#F03738'
                            size={25}
                            style={{
                                marginHorizontal: 3
                            }}
                        />
                        :
                        null}
                </View>
            </View>
        </>
    )
};

const RenderDate = props => {
    const {
        showPhoneFormat,
        item,
        id
    } = props;

    return (
        <View
            style={{ flexDirection: 'row-reverse', alignItems: 'center', }}
        >
            {id == item.receiver_id && (item.created_at ?
                <MaterialCommunityIcons
                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                    name={(item.is_read == 1 || item.is_read == true) ? 'check-all' : 'check'}
                    size={14}
                    color={(item.is_read == 1 || item.is_read == true) ? '#60CAF1' : '#617D8A'}
                />
                :
                <Feather
                    name='clock'
                    size={14}
                    color='#617D8A'
                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                />
            )
            }
            <Text
                style={{
                    color: showPhoneFormat ? '#5188B8' : '#333333',
                    fontSize: 12,
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                }}
            >
                {Jmoment(item.created_at).format('jYYYY/jMM/jDD , HH:mm ')}
            </Text>
        </View>
    )
};

const RenderPhoneFormatMessage = props => {
    const {
        showPhoneFormat,
        item
    } = props;


    const openCallPad = phoneNumber => {
        analytics().logEvent('click_on_call_info_button_messanger');
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

    if (showPhoneFormat)

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={() => openCallPad(item.text)}
            >
                <View
                    style={{
                        width: '100%',
                        backgroundColor: '#4FA992',

                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',

                        flexDirection: 'row-reverse',

                        paddingVertical: 5,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        overflow: "hidden",
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,

                    }}
                >
                    <Text style={{
                        marginRight: 10
                    }}>
                        <FontAwesome
                            name='phone'
                            color='white'
                            size={14}
                        />
                    </Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginHorizontal: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}>
                        {locales('labels.call')}

                    </Text>


                </View>
            </Pressable >
        )
    return null;
};

const RenderMessageWithProductIdDesign = props => {

    const animatedColor = useRef(new Animated.Value(0)).current;

    const {
        item = {},
        navigation = {},
        loggedInUserId,
        active_pakage_type,
        handlePromotionModalVisiblity = _ => { },
        handleEditPriceModalVisiblity = _ => { },
        productDetailsLoading,
        selectedMessageId
    } = props;

    const {
        navigate = _ => { }
    } = navigation;

    const {
        p_id
    } = item;

    useEffect(_ => {
        // const colorInterval = setInterval(handleAnimationChanges, 1000);
        // return _ => clearInterval(colorInterval);
    }, []);

    // const handleAnimationChanges = _ => {
    //     Animated.timing(animatedColor, {
    //         duration: 1000,
    //         useNativeDriver: false,
    //         toValue: 1,
    //     }).start(_ => {
    //         Animated.timing(animatedColor, {
    //             duration: 1000,
    //             useNativeDriver: false,
    //             toValue: 0,
    //         }).start()
    //     });
    // };

    // const backgroundColor = animatedColor.interpolate({
    //     inputRange: [0, 0.5, 1],
    //     outputRange: ['#fea858', '#ed765e', '#fea858']
    // });

    // const backgroundColorForDelsa = animatedColor.interpolate({
    //     inputRange: [0, 0.5, 1],
    //     outputRange: ['#4DC0BB', '#24ae95', '#21AD93']
    // });

    // const backgroundColorEditPrice = animatedColor.interpolate({
    //     inputRange: [0, 0.5, 1],
    //     outputRange: ['#556080', '#495577', '#556593']
    // });

    if (!!p_id) {
        if (item.sender_id == loggedInUserId) {
            // if (active_pakage_type != 0)
            return (
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    activeOpacity={1}
                    style={{
                        borderTopWidth: 1,
                        borderColor: '#d5f0c0',
                        backgroundColor: '#DCF8C6',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        paddingVertical: 10,
                    }}
                    onPress={() => {
                        analytics().logEvent('click_on_price_update_button');
                        handleEditPriceModalVisiblity(p_id, item.id);
                    }}
                >
                    <Animated.View
                        // start={{ x: 0, y: 1 }}
                        // end={{ x: 0.8, y: 0.2 }}
                        // colors={[colorFirst, colorSecond]}
                        style={{
                            width: '95%',

                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',

                            flexDirection: 'row-reverse',
                            alignSelf: 'center',
                            paddingVertical: 10,
                            borderRadius: 8,
                            overflow: "hidden",
                            backgroundColor: "#556080",

                        }}
                    >
                        {productDetailsLoading && item.id == selectedMessageId
                            ?
                            <ActivityIndicator
                                animating={productDetailsLoading}
                                size={20}
                                color='white'
                            />
                            :
                            <FontAwesome5
                                name='edit'
                                color='white'
                                size={14}
                            />
                        }
                        <Text style={{
                            color: 'white',
                            fontSize: 16,
                            marginRight: 5,
                            marginLeft: 10,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}>
                            {locales('labels.editPrice')}
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={14}
                        />
                    </Animated.View>
                </Pressable >
            );
            // return (
            //     <Pressable
            //         android_ripple={{
            //             color: '#ededed'
            //         }}
            //         activeOpacity={1}
            //         style={{
            //             borderTopWidth: 1,
            //             borderColor: '#d5f0c0',
            //             backgroundColor: '#DCF8C6',
            //             borderBottomLeftRadius: 12,
            //             borderBottomRightRadius: 12,
            //             paddingVertical: 10,

            //         }}
            //         onPress={() => handlePromotionModalVisiblity(true)}
            //     >
            //         <Animated.View
            //             // start={{ x: 0, y: 1 }}
            //             // end={{ x: 0.8, y: 0.2 }}
            //             // colors={[colorFirst, colorSecond]}
            //             style={{
            //                 width: '95%',

            //                 alignItems: 'center',
            //                 justifyContent: 'center',
            //                 textAlign: 'center',

            //                 flexDirection: 'row-reverse',
            //                 alignSelf: 'center',
            //                 paddingVertical: 10,
            //                 borderRadius: 8,
            //                 overflow: "hidden",
            //                 backgroundColor: backgroundColorForDelsa,

            //             }}
            //         >
            //             {/* <LinearGradient
            //             start={{ x: 0, y: 1 }}
            //             end={{ x: 0.8, y: 0.2 }}
            //             style={{
            //                 width: '100%',
            //                 backgroundColor: '#21AD93',

            //                 alignItems: 'center',
            //                 justifyContent: 'center',
            //                 textAlign: 'center',

            //                 flexDirection: 'row-reverse',

            //                 paddingVertical: 5,
            //                 borderBottomLeftRadius: 8,
            //                 borderBottomRightRadius: 8,
            //                 overflow: "hidden",
            //                 borderTopRightRadius: 0,
            //                 borderTopLeftRadius: 0,
            //             }}
            //             colors={['#4DC0BB', '#21AD93']}
            //         > */}

            //             <Text style={{
            //                 marginRight: 10
            //             }}>
            //                 <FontAwesome5
            //                     name='chess-queen'
            //                     color='white'
            //                     size={14}
            //                 />
            //             </Text>
            //             <Text style={{
            //                 color: 'white',
            //                 fontSize: 16,
            //                 marginRight: 5,
            //                 marginLeft: 10,
            //                 fontFamily: 'IRANSansWeb(FaNum)_Medium',
            //             }}>
            //                 {locales('titles.inquireSecretary')}

            //             </Text>
            //             <FontAwesome5
            //                 name='angle-left'
            //                 color='white'
            //                 size={14}
            //             />
            //         </Animated.View>
            //     </Pressable >
            // );
        }
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                style={{
                    borderTopWidth: 1,
                    borderColor: '#f2f2f2',
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    paddingVertical: 10,
                    backgroundColor: 'white'
                }}
                onPress={() => {
                    analytics().logEvent('click_on_see_product');
                    navigate('Messages', { screen: 'ProductDetails', params: { productId: p_id } });
                }}
            >

                <Animated.View
                    // start={{ x: 0, y: 1 }}
                    // end={{ x: 0.8, y: 0.2 }}
                    // colors={[colorFirst, colorSecond]}
                    style={{
                        width: '95%',

                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',

                        flexDirection: 'row-reverse',
                        alignSelf: 'center',
                        paddingVertical: 10,
                        borderRadius: 8,
                        overflow: "hidden",
                        backgroundColor: "#fea858",

                    }}
                >
                    <Text style={{
                        marginRight: 10
                    }}>
                        <FontAwesome5
                            name='clipboard-check'
                            color='white'
                            size={14}
                        />
                    </Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginRight: 5,
                        marginLeft: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}>
                        {locales('labels.ProductImagesAndDetails')}

                    </Text>
                    <FontAwesome5
                        name='angle-left'
                        color='white'
                        size={14}
                    />
                </Animated.View>
            </Pressable >
        );
    }
    return null;
};

export default memo(Message);