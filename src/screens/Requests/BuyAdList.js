import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Card, CardItem, Body, Toast } from 'native-base';
import Jmoment from 'moment-jalaali';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const BuyAdList = props => {

    const { item, index, selectedButton, buyAdRequestsList, isUserAllowedToSendMessageLoading } = props;

    return (
        <View
            style={{
                padding: 10, backgroundColor: '#FFFFFF', marginVertical: 5,
                width: '100%',
                borderColor: !!item.is_golden ? '#c7a84f' : '#aaa',
                borderWidth: 1,
                borderRadius: 4
            }}
            key={item.id}
        >

            <View style={{
 height: 3,
 width: 70,
 shadowOpacity: 1,
 shadowColor: '#000',
 shadowOffset: { width: 10, height: 10 },
 shadowRadius: 5,
 elevation: 5,
 borderWidth: 0.5,
 borderColor: "white",
 backgroundColor: "rgba(255, 255, 255, 1)"
             }}>

                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                        }}
                    >{`${item.category_name} | ${item.subcategory_name} ${!!item.name ? `| ${item.name}` : ''}`}</Text>
                </View>


                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            marginVertical: 5,
                            flexWrap: 'wrap', width: '100%', textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                        }}
                    >{`${locales('titles.requirementQuantity')} : ${item.requirement_amount} ${locales('labels.kiloGram')}`}
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
                        {Jmoment(item.created_at.split(" ")[0]).format('jD jMMMM , jYYYY')}
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
                                duration: 10
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
    if (prevProps.buyAdRequestsList == nextProps.buyAdRequestsList || prevProps.item == nextProps.item || !nextProps.buyAdRequestsList || !prevProps.buyAdRequestsList || !prevProps.buyAdRequestsList.length || !nextProps.buyAdRequestsList.length || nextProps.isUserAllowedToSendMessageLoading || prevProps.isUserAllowedToSendMessageLoading)
        return false
    return true;
}

export default memo(BuyAdList, arePropsEqual)