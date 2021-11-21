import React, { useState, memo } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, ActivityIndicator, Linking, Pressable } from 'react-native';
import { Button, Toast } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

import { formatter } from '../../utils';
import { deviceWidth, validator } from '../../utils';
import * as buyAdActions from '../../redux/buyAdRequest/actions';


const BuyAdList = props => {

    const {
        item,
        index,
        selectedButton,
        userProfile = {},
        isUserAllowedToSendMessageLoading,
        openMobileNumberWarnModal = _ => { },
        setPromotionModalVisiblity = _ => { },
        buyerMobileNumberLoading,
        loggedInUserId
    } = props;

    const { user_info = {} } = userProfile;

    const { active_pakage_type = 0 } = user_info;

    const [isContactInfoShown, setIsContactInfoShown] = useState(false);

    const [mobileNumber, setMobileNumber] = useState(false);

    const fetchContactInfo = ({ id, is_golden }) => {
        const shouldShowPromotionModal = !!is_golden && active_pakage_type == 0;
        if (shouldShowPromotionModal) {
            setPromotionModalVisiblity(true)
        }
        else {
            props.setSelectedButton(id);
            const contactInfoObject = {
                b_id: item.myuser_id,
                ba_id: item.id,
                item: "BUYAD"
            }
            props.fetchBuyerMobileNumber(contactInfoObject).then(result => {
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
                }
            })
                .catch(err => {
                    const {
                        response = {}
                    } = err;
                    const {
                        data = {},
                        status: statusCode
                    } = response;
                    const {
                        msg,
                        status,
                    } = data;
                    if (status == false) {
                        openMobileNumberWarnModal(true, msg, statusCode);
                    }
                });
        }
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

    if (!!loggedInUserId && !item.has_msg && !item.has_phone)
        return null;

    return (

        <View
            style={{
                backgroundColor: 'white',
                width: '95%',
                alignSelf: 'center',
                overflow: 'hidden',
                padding: 20,
                borderRadius: 12,
                marginVertical: 20,
                borderColor: !!item.is_golden ? '#c7a84f' : '#DDD',
                borderWidth: 0.8,
                borderRightWidth: !!item.is_golden ? 12 : 1,
                borderBottomWidth: item.is_golden ? 0.8 : 1,
            }}
            key={item.id}
        >

            {item.is_golden && active_pakage_type == 0 ?

                <View style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    top: 0,
                    zIndex: 1
                }}>

                    <Image source={require('../../../assets/images/blur-items.jpg')}
                        style={{
                            width: deviceWidth * 0.915,
                            height: '80%',
                            top: '5%'
                        }}
                    />

                    <View
                        style={{
                            alignItems: 'center',
                            marginVertical: 5,
                            right: 15,
                            position: 'absolute',
                            flexDirection: 'row-reverse'
                        }}
                    >

                        <FontAwesome5
                            solid
                            name='user-circle'
                            color='#adadad'
                            size={16}
                        />
                        <Text
                            style={{
                                marginHorizontal: 5,
                                color: '#adadad',
                                fontSize: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {`${item.first_name} ${item.last_name}`}
                        </Text>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            left: deviceWidth * 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            bottom: 0,
                            top: 0,
                            right: 0,
                        }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 20,
                                top: -23,
                                color: '#7e7e7e',
                            }}
                        >
                            {locales('labels.buyer')} <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontWeight: '200',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    color: '#556083',
                                    marginHorizontal: 2
                                }}
                            >
                                {` ${item.subcategory_name} `}
                            </Text>
                            {item.is_golden && active_pakage_type == 0 ?
                                <Text> </Text>
                                :
                                item.name ? <>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 20,
                                            marginHorizontal: 2,
                                            fontWeight: '200',
                                            textAlign: 'center',
                                            color: '#7e7e7e'
                                        }}
                                    >
                                        {locales('labels.fromType')}
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#556083',
                                            fontSize: 20,
                                            fontWeight: '200',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            marginHorizontal: 2
                                        }}
                                    >
                                        {` ${item.name} `}
                                    </Text>
                                </> : null

                            }
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textAlign: 'center',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    fontWeight: '200',
                                    color: '#7e7e7e'
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                    </View>
                </View>

                : null}

            <View
                style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 0,
                    flexDirection: 'row-reverse'
                }}
            >

                <FontAwesome5
                    solid
                    name='user-circle'
                    color='#adadad'
                    size={16}
                />
                <Text
                    style={{
                        marginHorizontal: 5,
                        color: '#adadad',
                        fontSize: 15,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {`${item.first_name} ${item.last_name}`}
                </Text>
            </View>

            {item.is_golden && active_pakage_type == 0 ?
                <Text style={{ textAlign: 'center' }}>...</Text>
                :
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        marginVertical: -5,
                        minHeight: 70
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            textAlign: 'center',
                            fontSize: 18,
                            color: '#7e7e7e'
                        }}
                    >
                        {locales('labels.buyer')}
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlign: 'center',
                                fontSize: 18,
                                color: '#e41c38',
                                fontWeight: '200',
                                marginHorizontal: 2
                            }}
                        >
                            {` ${formatter.convertedNumbersToTonUnit(item.requirement_amount)}`} <Text
                                style={{
                                    color: '#556083',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontWeight: '200',
                                    fontSize: 18,
                                    marginHorizontal: 2
                                }}
                            >
                                {`${item.subcategory_name} `}
                            </Text>
                        </Text>
                        {item.is_golden && active_pakage_type == 0 ?
                            <Text> </Text>
                            :
                            item.name ? <>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        textAlign: 'center',
                                        marginHorizontal: 2,
                                        fontWeight: '200',
                                        color: '#7e7e7e'
                                    }}
                                >
                                    {locales('labels.fromType')}
                                </Text>
                                <Text
                                    style={{
                                        color: '#556083',
                                        textAlign: 'center',
                                        fontSize: 18,
                                        fontWeight: '200',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        marginHorizontal: 2
                                    }}
                                >
                                    {` ${item.name} `}
                                </Text>
                            </> : null

                        }
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                fontWeight: '200',
                                textAlign: 'center',
                                marginHorizontal: 2,
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.is')}
                        </Text>
                    </Text>

                </View>
            }

            <View style={{
                marginVertical: 5,
                flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center'
            }}>
                {item.has_msg ?
                    <View
                        style={{ flexDirection: 'row-reverse', marginHorizontal: 30 }}
                    >
                        <MaterialCommunityIcons
                            onPress={() => {
                                return Toast.show({
                                    text: locales('titles.remianedCapacityToSendMessageToBuyer'),
                                    position: "bottom",
                                    style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                    textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                    duration: 2000
                                })
                            }
                            }
                            name='comment-alert' size={25} color={'#777777'} />
                        <Text style={{ color: '#556083', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, }}>+{item.reply_capacity}</Text>
                    </View>
                    : null}
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5, marginRight: 60,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            color: '#556083',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16,
                        }}
                    >
                        {item.is_golden && active_pakage_type == 0 ? locales('labels.requestsBlurDate') : item.register_date}
                    </Text>
                </View>
            </View>
            <View style={{
                marginVertical: 15,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                width: deviceWidth * 0.87,
                paddingHorizontal: 5,
                alignSelf: 'center',
                justifyContent: 'center'
            }}
            >
                {item.has_phone ?
                    <Button
                        small
                        onPress={() => fetchContactInfo(item)}
                        style={{
                            borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                            width: item.has_msg ? '49%' : '70%',
                            zIndex: 1000,
                            position: 'relative',
                            alignSelf: 'center',
                            marginHorizontal: 15

                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={!item.isContactInfoShown ?
                                (!item.is_golden ? ['#00C569', '#00C569', '#00C569']
                                    : ['#c7a84f', '#f9f29f', '#c7a84f'])
                                : ['#E0E0E0', '#E0E0E0']}
                            style={{
                                width: '100%',
                                height: 48,
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                paddingLeft: 20,
                                padding: 8,
                                elevation: 0
                            }}
                        >
                            {buyerMobileNumberLoading && selectedButton == item.id ?
                                <ActivityIndicator
                                    size={19}
                                    color={(!item.is_golden ? 'white' : '#333')}
                                    animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                />
                                :
                                <FontAwesome5
                                    solid
                                    name='phone-square-alt'
                                    color={!item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white'}
                                    size={19} />
                            }
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    marginHorizontal: 3,
                                    fontSize: 17,
                                    color: !item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white',
                                    paddingHorizontal: 3
                                }}
                            >
                                {locales('labels.callWithBuyer')}
                            </Text>

                        </LinearGradient>

                    </Button>
                    : null}
                {(item.has_msg || !!!loggedInUserId) ?
                    <Button
                        small
                        onPress={event => {
                            event.stopPropagation()
                            props.openChat(event, item)
                        }}
                        style={{
                            width: item.has_phone ? '47%' : '70%',
                            zIndex: 1000,
                            elevation: 0,
                            marginHorizontal: 15,
                            position: 'relative',
                            alignSelf: 'center',
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={item.has_phone ? ['#fff', '#fff']
                                : (!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f'])
                            }
                            style={{
                                width: '100%',
                                borderColor: item.has_phone ? '#556080' : (!!item.is_golden ? '#c7a84f' : '#00C569'),
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                borderWidth: item.has_phone ? 1 : 0,
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                padding: 8,
                                elevation: 0
                            }}
                        >

                            {selectedButton == item.id &&
                                !!isUserAllowedToSendMessageLoading ?
                                <ActivityIndicator
                                    size={20}
                                    style={{ width: 20, height: 20 }}
                                    color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
                                />
                                :
                                <MaterialCommunityIcons
                                    name='message'
                                    color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
                                    size={20}
                                />
                            }
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                color: item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333'),
                                paddingHorizontal: 3
                            }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                        </LinearGradient>

                    </Button>
                    : null
                }
            </View>
            {(item.isContactInfoShown) ?
                <>
                    <View
                        style={{
                            zIndex: 1,
                            flexDirection: 'row-reverse',
                            paddingVertical: 25,
                            alignItems: 'center',
                            width: deviceWidth * 0.83,
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
                                name='phone-square-alt'
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
                            width: deviceWidth * 0.85,
                            zIndex: 1,
                            bottom: -10
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
                                {locales('titles.buskoolSuggesstion')}
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
                            {locales('labels.buskoolSuggestionDescription')}
                        </Text>
                    </View>
                </>
                : null}

        </View>

    )
}

const arePropsEqual = (prevProps, nextProps) => {
    if (prevProps.loggedInUserId !== nextProps.loggedInUserId || (prevProps.buyAdRequestsList == nextProps.buyAdRequestsList ||
        prevProps.item == nextProps.item || !nextProps.buyAdRequestsList ||
        !prevProps.buyAdRequestsList || !prevProps.buyAdRequestsList.length ||
        !nextProps.buyAdRequestsList.length || nextProps.isUserAllowedToSendMessageLoading
        || prevProps.isUserAllowedToSendMessageLoading))
        return false
    return true;
}

const mapStateToProps = ({
    profileReducer,
    buyAdRequestReducer
}) => {

    const {
        buyerMobileNumberLoading
    } = buyAdRequestReducer;

    const {
        userProfile
    } = profileReducer;

    return {
        userProfile,
        buyerMobileNumberLoading
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchBuyerMobileNumber: contactInfoObject => dispatch(buyAdActions.fetchBuyerMobileNumber(contactInfoObject)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(BuyAdList, arePropsEqual))