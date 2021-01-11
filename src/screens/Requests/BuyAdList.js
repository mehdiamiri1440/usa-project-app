import { connect } from 'react-redux';
import React, { memo } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { Button, Toast } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { formatter } from '../../utils';


const BuyAdList = props => {

    const { item, index, selectedButton, userProfile = {}, isUserAllowedToSendMessageLoading } = props;
    const { user_info = {} } = userProfile;
    const { active_pakage_type } = user_info;
    return (
        <View
            style={{
                padding: 10,
                backgroundColor: '#FFFFFF',
                width: '100%',
                borderColor: !!item.is_golden ? '#c7a84f' : '#aaa',
                borderWidth: 1,
                borderColor: '#ddd'
            }}
            key={item.id}
        >

            <View >
                {/* blur items */}
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
                                width: '100%',
                                height: '100%'
                            }}
                        />
                        <Text style={{
                            position: 'absolute',
                            width: '100%',
                            top: 50,
                            fontSize: 23,
                            textAlign: 'center',
                            // backgroundColor: 'red',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            zIndex: 2
                        }}>
                            {item.subcategory_name}
                        </Text>
                    </View>

                    : null}
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                        }}
                    >
                        {item.is_golden && active_pakage_type == 0 ? `${item.subcategory_name} | ${item.subcategory_name} ` : `${item.category_name} | ${item.subcategory_name} ${!!item.name ? `| ${item.name}` : ''}`}</Text>
                </View>


                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                        }}
                    >

                        {item.is_golden && active_pakage_type == 0 ? `${locales('titles.requirementQuantity')} : نامشخص` : `${locales('titles.requirementQuantity')} : ${formatter.convertedNumbersToTonUnit(item.requirement_amount)}`}
                    </Text>
                </View>

                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                        }}
                    >
                        {item.is_golden && active_pakage_type == 0 ? locales('labels.requestsBlurDate') : item.register_date}
                    </Text>
                </View>



                <View style={{
                    marginVertical: 5,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Text style={{ color: '#E41C38', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, }}>+{item.reply_capacity}</Text>
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
                </View>

            </View>

            <View style={{ marginVertical: 5 }}>

                <Button
                    small
                    onPress={event => props.openChat(event, item)}
                    style={{
                        borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                        width: "80%",
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
                            height: 35,
                            borderRadius: 6,
                            elevation: 2
                        }}
                    >

                        <MaterialCommunityIcons name='message' color={!item.is_golden ? 'white' : '#333'} size={14} />
                        <Text style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 14,
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