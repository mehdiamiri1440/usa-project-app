import { connect } from 'react-redux';
import React, { memo } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { Button, Toast } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import { formatter } from '../../utils';
import { deviceWidth } from '../../utils/deviceDimenssions';


const BuyAdList = props => {

    const { item, index, selectedButton, userProfile = {}, isUserAllowedToSendMessageLoading } = props;
    const { user_info = {} } = userProfile;
    const { active_pakage_type } = user_info;
    return (

        <View
            style={{
                padding: 20,
                backgroundColor: index % 2 == 0 ? '#f9fcff' : '#FFFFFF',
                width: '100%',
                borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                borderWidth: 0.8,
            }}
            key={item.id}
        >

            {item.is_golden && active_pakage_type == 0 ?

                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    zIndex: 1
                }}>

                    <Image source={require('../../../assets/images/blur-items.jpg')}
                        style={{
                            width: deviceWidth,
                            height: '100%'
                        }}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            marginVertical: 10,
                            right: -25,
                            position: 'absolute',
                            flexDirection: 'row-reverse'
                        }}
                    >

                        <FontAwesome
                            name='user-circle'
                            color='#adadad'
                            size={20}
                        />
                        <Text
                            style={{
                                marginHorizontal: 5,
                                color: '#adadad',
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {`${item.first_name} ${item.last_name}`}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            position: 'absolute',
                            top: 65,
                            textAlign: 'center',
                            left: deviceWidth * 0.33,
                            fontSize: 20,
                            color: '#7e7e7e'
                        }}
                    >
                        {locales('labels.buyer')}
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 20,
                                textAlign: 'center',
                                color: '#556083',
                                marginHorizontal: 2
                            }}
                        >
                            {` ${item.subcategory_name}`}
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
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.is')}
                        </Text>
                    </Text>

                </View>

                : null}

            <View
                style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 10,
                    flexDirection: 'row-reverse'
                }}
            >

                <FontAwesome
                    name='user-circle'
                    color='#adadad'
                    size={20}
                />
                <Text
                    style={{
                        marginHorizontal: 5,
                        color: '#adadad',
                        fontSize: 16,
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
                        marginVertical: 5,
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
                                marginHorizontal: 2
                            }}
                        >
                            {` ${formatter.convertedNumbersToTonUnit(item.requirement_amount)}`} <Text
                                style={{
                                    color: '#556083',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
                marginVertical: 10,
                flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center'
            }}>
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
            <View style={{ marginVertical: 15 }}>

                <Button
                    small
                    onPress={event => {
                        event.stopPropagation()
                        props.openChat(event, item)
                    }}
                    style={{
                        borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                        width: "80%", zIndex: 1000,
                        position: 'relative',
                        alignSelf: 'center',

                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0.51, z: 1 }}
                        end={{ x: 0.8, y: 0.2, z: 1 }}
                        colors={!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f']}
                        style={{
                            width: '100%',
                            paddingHorizontal: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            textAlign: 'center',
                            justifyContent: 'center',
                            borderRadius: 6,
                            padding: 10,
                            elevation: 2
                        }}
                    >

                        <MaterialCommunityIcons name='message' color={!item.is_golden ? 'white' : '#333'} size={20} />
                        <Text style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20,
                            color: !item.is_golden ? 'white' : '#333',
                            paddingHorizontal: 3
                        }}>
                            {locales('labels.messageToBuyer')}


                        </Text>
                        <ActivityIndicator size={20} color={!item.is_golden ? 'white' : '#333'}
                            animating={selectedButton == item.id &&
                                !!isUserAllowedToSendMessageLoading}
                            style={{
                                position: 'relative',
                                width: 10, height: 10, borderRadius: 5,
                                marginLeft: -10,
                                marginRight: 5
                            }}
                        />
                    </LinearGradient>

                </Button>

            </View>
        </View>

    )
}

const arePropsEqual = (prevProps, nextProps) => {
    // console.log('prevprops', prevProps, 'nextPRops', nextProps)
    if (prevProps.buyAdRequestsList == nextProps.buyAdRequestsList ||
        prevProps.item == nextProps.item || !nextProps.buyAdRequestsList ||
        !prevProps.buyAdRequestsList || !prevProps.buyAdRequestsList.length ||
        !nextProps.buyAdRequestsList.length || nextProps.isUserAllowedToSendMessageLoading
        || prevProps.isUserAllowedToSendMessageLoading)
        return false
    return true;
}

const mapStateToProps = state => {
    return {
        userProfile: state.profileReducer.userProfile
    }
}
export default connect(mapStateToProps)(memo(BuyAdList, arePropsEqual))