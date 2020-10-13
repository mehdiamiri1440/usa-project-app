import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon, InputGroup, Input } from 'native-base';

import { TabView, TabBar } from 'react-native-tab-view';
import { deviceWidth } from '../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import * as messagesActions from '../../redux/messages/actions';
import * as requestActions from '../../redux/buyAdRequest/actions';

import MessagesTab from './MessagesTab';
import RequestsTab from './RequestsTab';



const Messages = props => {

    const serachInputRef = useRef();

    const {
        userProfile = {}
    } = props;
    const {
        user_info = {}
    } = userProfile;
    const {
        is_seller
    } = user_info;

    const [searchText, setSearchText] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'messages', title: locales('labels.messages') },
        { key: 'requests', title: locales('labels.requests') }
    ]
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
        if (index == 1) {
            return props.fetchAllContactsList().then(_ => {
                setRefresh(true);
            });
        }
        return props.fetchRelatedRequests().then(_ => {
            setRefresh(true);
        });
    }

    const renderTabBar = internalProps => (
        <TabBar
            onTabPress={() => refreshTabs()}
            {...internalProps}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#22AC93' }}
            renderLabel={({ route, focused, color }) => (
                <View
                    style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                >
                    <Text style={{ color: 'white', textAlign: 'center', textAlignVertical: 'center' }}>
                        {route.title}
                    </Text>
                    {route.key == 'requests' ?
                        <Text
                            style={{
                                color: 'white', backgroundColor: '#D92941', width: 40,
                                borderRadius: 4,
                                marginHorizontal: 10,
                                textAlign: 'center', textAlignVertical: 'center'
                            }}
                        >
                            {locales('titles.new')}
                        </Text>
                        : null}
                </View>
            )}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => props.navigation.goBack()}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('titles.messanger')}
                    </Text>
                </View>
            </View>

            {is_seller ?
                <View>
                    <InputGroup rounded style={{
                        backgroundColor: '#22AC93', borderBottomColor: 'white',
                        borderBottomWidth: 2,
                        elevation: 1, width: deviceWidth, borderRadius: 0
                    }}>
                        <Input
                            value={searchText}
                            ref={serachInputRef}
                            onChangeText={handleSearch}
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#FFFFFF' }}
                            placeholder={index == 0 ? locales('labels.searchContacts') : locales('titles.searchBuyAd')}
                            placeholderTextColor="#FFFFFF"

                        />
                        <Icon name='ios-search' style={{ color: '#FFFFFF', marginHorizontal: 5 }} />
                    </InputGroup>
                </View>
                :
                <View style={{ marginTop: 5, marginHorizontal: 5, padding: 4 }}>
                    <InputGroup rounded style={{ backgroundColor: 'white', elevation: 1 }}>
                        <Input
                            value={searchText}
                            ref={serachInputRef}
                            onChangeText={handleSearch}
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777' }}
                            placeholder={locales('labels.searchContacts')}
                            placeholderTextColor="#BEBEBE"

                        />
                        <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                    </InputGroup>
                </View>
            }


            {is_seller ?
                <TabView
                    onSwipeStart={() => refreshTabs()}
                    lazy
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