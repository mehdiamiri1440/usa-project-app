import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon, InputGroup, Input } from 'native-base';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { TabView, TabBar } from 'react-native-tab-view';

import { deviceWidth } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import * as requestActions from '../../redux/buyAdRequest/actions';
import MessageContext from './MessagesContext';

import MessagesTab from './MessagesTab';
import RequestsTab from './RequestsTab';
import Header from '../../components/header';

const Messages = props => {

    const routes = [
        { key: 'messages', title: locales('labels.messages') },
        { key: 'requests', title: locales('labels.suggestedBuyers') }
    ];

    const serachInputRef = useRef();

    const {
        userProfile = {},
        route = {}
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_seller
    } = user_info;

    const {
        params = {}
    } = route;

    const {
        tabIndex = 0
    } = params;

    const [searchText, setSearchText] = useState('');

    const [refresh, setRefresh] = useState(false);

    const [index, setIndex] = useState(tabIndex);

    useEffect(() => setIndex(tabIndex),
        [props.route, props.route?.params, props.route?.params?.tabIndex]
    );

    const handleSearch = text => setSearchText(text);

    const initialLayout = { width: deviceWidth, height: 0 };

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'messages':
                return <MessagesTab
                    refresh={refresh}
                    setRefresh={setRefresh}
                    searchText={searchText}
                    {...props}
                />
            case 'requests':
                return <RequestsTab
                    refresh={refresh}
                    setRefresh={setRefresh}
                    searchText={searchText}
                    {...props}
                />;
            default:
                return null;
        }
    };

    const refreshTabs = _ => {
        setSearchText('');
        if (index == 0)
            return props.fetchAllContactsList().then(_ => setRefresh(true));
        return props.fetchRelatedRequests().then(_ => setRefresh(true));
    };

    const renderTabBar = internalProps => (
        <TabBar
            onTabPress={() => refreshTabs()}
            {...internalProps}
            indicatorStyle={{
                backgroundColor: '#FF9828',
                padding: 2,
                borderRadius: 8,
                position: 'absolute',
                bottom: -5
            }}
            style={{
                backgroundColor: '#ffffff',
                borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                borderBottomWidth: 6,
                elevation: 0,
            }}
            renderLabel={({ route, focused, color }) => (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    margin: 0
                }}>
                    <Text
                        style={{
                            color: focused ? '#FF9828' : 'rgba(0,0,0,0.7)',
                            fontFamily: focused ? 'IRANSansWeb(FaNum)_Medium' : 'IRANSansWeb(FaNum)_Light',
                            fontSize: focused ? 16 : 14,
                            top: focused ? -2 : 0,
                            width: '90%',
                            textAlign: 'center',
                        }}
                    >
                        {route.title}
                    </Text>
                    {route.key == 'requests' ?
                        <View style={{
                            marginTop: 3,
                            left: focused ? -7 : -13
                        }}>
                            <Svg

                                xmlns="http://www.w3.org/2000/svg"
                                width="18" height="17" viewBox="0 0 23 22.014"
                            >
                                <Defs>
                                    <LinearGradient id="grad" x2="0.864" y2="1">
                                        <Stop offset="0" stopColor="#c7a84f" stopOpacity="1" />
                                        <Stop offset="0.571" stopColor="#f4eb97" stopOpacity="1" />
                                        <Stop offset="1" stopColor="#c7a84f" stopOpacity="1" />

                                    </LinearGradient>
                                </Defs>
                                <Path d="M30.766.753,27.958,6.445l-6.281.916a1.376,1.376,0,0,0-.761,2.347l4.544,4.428-1.075,6.255a1.375,1.375,0,0,0,1.995,1.449L32,18.887l5.619,2.953a1.376,1.376,0,0,0,1.995-1.449l-1.075-6.255,4.544-4.428a1.376,1.376,0,0,0-.761-2.347l-6.281-.916L33.233.753A1.377,1.377,0,0,0,30.766.753Z" transform="translate(-20.5 0.013)" fill="url(#grad)" />
                            </Svg>
                        </View>
                        : null}
                </View>
            )}
        />
    );
    const resetSearch = _ => setSearchText('');

    return (
        <View style={{ flex: 1 }}>
            <MessageContext.Provider value={{ resetSearch, searchText }}>

                <Header
                    title={locales('titles.messanger')}
                    shouldShowBackButton={false}
                    {...props}
                />

                <View style={{
                    paddingHorizontal: 15,
                    left: 0,
                    backgroundColor: 'white',
                }}>
                    <InputGroup
                        rounded
                        style={{
                            borderWidth: 0,
                            borderColor: '#e0e0e0',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            width: '100%',
                            borderRadius: 0,

                        }}>
                        <Input
                            value={searchText}
                            ref={serachInputRef}
                            onChangeText={handleSearch}
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                color: '#777'
                            }}
                            placeholder={is_seller ? locales('labels.search') : locales('labels.searchContacts')}
                            placeholderTextColor="#e0e0e0"

                        />
                        <Icon
                            name='ios-search'
                            style={{
                                color: '#e0e0e0',
                                marginHorizontal: 5
                            }}
                        />
                    </InputGroup>
                </View>

                {is_seller ?
                    <TabView
                        onSwipeStart={() => refreshTabs()}
                        lazy={_ => true}
                        removeClippedSubviews={true}
                        renderTabBar={renderTabBar}
                        useNativeDriver
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
                    :
                    <MessagesTab
                        setRefresh={setRefresh}
                        refresh={refresh}
                        searchText={searchText}
                        {...props} />
                }
            </MessageContext.Provider>
        </View>
    );
}

const mapStateToProps = (state) => {
    const {
        userProfile
    } = state.profileReducer;

    return {
        userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllContactsList: (from, to) => dispatch(messagesActions.fetchAllContactsList(from, to)),
        fetchRelatedRequests: _ => dispatch(requestActions.fetchRelatedRequests()),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Messages)