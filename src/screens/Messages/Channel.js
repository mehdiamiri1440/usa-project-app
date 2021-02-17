import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, Share } from 'react-native';
import { connect } from "react-redux";
import moment from 'moment';
import Jmoment from 'moment-jalaali';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as messagesActions from '../../redux/messages/actions';
import { deviceHeight, deviceWidth, dataGenerator, parser } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';

const Channel = props => {

    const ChannelContainerRef = useRef();

    useEffect(_ => {
        props.fetchChannelData();
    }, []);

    const {
        channelData = {},
    } = props;

    let {
        messages = [

            {
                id: 9,
                text: 'شس',
                created_at: '2021-02-03 12:34:10'
            },
            {
                id: 2,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                file_path: require('../../../assets/images/earth.png'),
                created_at: '2021-02-05 12:34:10'
            },
            {
                id: 3,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                file_path: require('../../../assets/images/earth.png'),
                created_at: '2021-02-20 10:10:51'
            },
            {
                id: 4,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                file_path: require('../../../assets/images/earth.png'),
                created_at: '2021-02-21 17:22:11'
            },
            {
                id: 5,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                created_at: '2021-02-22 17:22:11'
            },
            {
                id: 6,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                created_at: '2021-02-22 17:54:39'
            },
            {
                id: 7,
                text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                created_at: '2021-02-22 20:12:11'
            },
        ]
    } = channelData;

    const renderListEmptyComponent = _ => {
        return (
            <View
                style={{
                    height: deviceHeight,
                    width: deviceWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        textAlign: 'center'
                    }}
                >
                    پیامی در کانال موجود نیست
                </Text>
            </View>
        )
    };

    const renderListHeaderComponent = _ => {
        return (
            <View>

            </View>
        )
    };

    const forwardMessage = async _ => {
        try {
            const result = await Share.share({
                message: 'https://www.buskool.com/public-channel',
                title: 'pricing',

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

    const renderItem = ({ item, index }) => {
        const {
            text = '',
            file_path = '',
            created_at = ''
        } = item;
        return (
            <View>
                {parser.showDate(messages[index], messages[index > 0 ? index - 1 : 0])}

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
                    <TouchableOpacity
                        onPress={forwardMessage}
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
                    </TouchableOpacity>
                    <View
                        style={{
                            backgroundColor: 'white',
                            minHeight: 50,
                            width: '70%',
                            padding: 10,
                            borderRadius: 6
                        }}
                    >
                        {file_path ? <Image
                            source={file_path}
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

                </View>
                <TouchableOpacity
                    onPress={_ => forwardMessage()}
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
                </TouchableOpacity>
            </View>

        )
    };

    const renderKeyExtractor = item => item.id.toString();

    const onEndReached = _ => {

    };

    return (
        <>

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
            <FlatList
                ListEmptyComponent={renderListEmptyComponent}
                ref={ChannelContainerRef}
                refreshing={false}
                keyExtractor={renderKeyExtractor}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderListHeaderComponent}
                inverted={!!messages && !!messages.length}
                renderItem={renderItem}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={10}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                data={[...messages.reverse(), {
                    id: 1,
                    text: 'سلام، به کانال باسکول خوش آمدید این کانال در جهت اطلاع رسانی برای شما عزیز',
                    created_at: '2021-01-10 10:54:10'
                }]}
            />
            <View
                style={{
                    width: deviceWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1DA1F2',
                    padding: 10
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        marginHorizontal: 3,
                        fontSize: 16
                    }}
                >
                    {locales('titles.referralShareButton')}
                </Text>
            </View>
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
        fetchChannelData: _ => dispatch(messagesActions.fetchChannelData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);