import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { connect } from "react-redux";

import * as messagesActions from '../../redux/messages/actions';
import { deviceHeight, deviceWidth } from '../../utils/deviceDimenssions';


const Channel = props => {

    const ChannelContainerRef = useRef();

    useEffect(_ => {
        props.fetchChannelData();
    }, []);

    const {
        channelData = {}
    } = props;

    const {
        messages = []
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

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <Text>
                    mehdi amiri
                </Text>
            </View>
        )
    };

    const renderKeyExtractor = item => item.id.toString();

    const onEndReached = _ => {

    };

    return (
        <>
            <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} s
                tyle={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                    width: deviceWidth,
                    height: deviceHeight,
                }}
            />
            <FlatList
                ListEmptyComponent={renderListEmptyComponent}
                ref={ChannelContainerRef}
                refreshing={false}
                keyExtractor={renderKeyExtractor}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderListHeaderComponent}
                data={messages}
                inverted={!!messages && !!messages.length}
                renderItem={renderItem}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={10}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />
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