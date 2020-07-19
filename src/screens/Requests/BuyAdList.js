import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Card, CardItem, Body, Toast } from 'native-base';
import Jmoment from 'moment-jalaali';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const BuyAdList = props => {

    const { item, index, selectedButton, buyAdRequestsList, isUserAllowedToSendMessageLoading } = props;

    return (
        <View
            style={{
                padding: 10, backgroundColor: '#FFFFFF', marginVertical: 5,
                width: '100%', borderBottomColor: '#DDDDDD',
                borderBottomWidth: index < buyAdRequestsList.length - 1 ? 0.7 : 0
            }}
            key={item.id}
        >

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


            <View style={{ marginVertical: 5 }}>
                <Button
                    small
                    onPress={event => props.openChat(event, item)}
                    style={{
                        backgroundColor: '#00C569',
                        borderRadius: 6,
                        alignItems: 'center',
                        width: "80%",
                        position: 'relative',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        height: 35,
                        paddingHorizontal: 10,
                        flexDirection: 'row-reverse'
                    }}
                >
                    <ActivityIndicator size={20} color="white"
                        animating={selectedButton == item.id &&
                            !!isUserAllowedToSendMessageLoading}
                        style={{
                            position: 'absolute', right: '30%', top: '40%',
                            width: 10, height: 10, borderRadius: 5
                        }}
                    />
                    <MaterialCommunityIcons name='message' color='white' size={14} />
                    <Text style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 14,
                        color: 'white', paddingHorizontal: 3
                    }}>
                        {locales('labels.messageToBuyer')}


                    </Text>
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