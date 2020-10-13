import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import { TabView, SceneMap } from 'react-native-tab-view';
import { deviceWidth } from '../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import MessagesTab from './MessagesTab';
import RequestsTab from './RequestsTab';



const Messages = props => {

    const {
        userProfile = {}
    } = props;
    const {
        user_info = {}
    } = userProfile;
    const {
        is_seller
    } = user_info;

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'messages', title: locales('labels.messages') },
        { key: 'requests', title: locales('labels.requests') }
    ]
    );


    const initialLayout = { width: deviceWidth, height: 0 };

    const renderScene = SceneMap({
        messages: () => <MessagesTab {...props} />,
        requests: () => <RequestsTab  {...props} />,
    });

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
                        {locales('labels.messages')}
                    </Text>
                </View>
            </View>

            {is_seller ?
                <TabView
                    useNativeDriver
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                />
                :
                <MessagesTab {...props} />
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
}
export default connect(mapStateToProps)(Messages)