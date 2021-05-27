import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import ShadowView from 'react-native-simple-shadow-view';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';

import * as authReducer from '../../redux/auth/actions';
import Header from '../../components/header';

let settingRoutes = [
    // { label: 'labels.changePassword', icon: <FontAwesome size={25} name='unlock-alt' color='white' />, name: 'ChangePassword' },
    { label: 'labels.signOut', icon: <SimpleLineIcons size={25} name='logout' color='white' />, name: 'SignOut' },
];


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleRouteChange = (name) => {
        if (name == 'SignOut') {
            this.setState({ loading: true })
            AsyncStorage.multiRemove([
                '@openedChatIds',
                '@contactInfoShownTimes',
                '@promotionModalLastSeen',
                '@IsNewSignedUpUser',
                '@ratedChats',
                '@sender_ids',
                '@registerProductParams'
            ]).then(_ => {
                messaging()
                    .unsubscribeFromTopic(`FCM${this.props.loggedInUserId}`).then(_ => {
                        this.props.logOut();
                    })
            })
        }
        else {
            this.props.navigation.navigate(name)
        }

    };

    componentDidMount() {
        analytics().logEvent('setting');
    }

    render() {
        return (
            <>
                <Header
                    title={locales('labels.settings')}
                    shouldShowAuthenticationRibbonFromProps
                    {...this.props}
                />
                <ScrollView
                    style={{ marginVertical: 20, flex: 1, backgroundColor: '#F2F2F2' }}>

                    {settingRoutes.map((route, index) => {
                        return (
                            <ShadowView
                                style={{
                                    shadowColor: 'black',
                                    shadowOpacity: 0.13,
                                    shadowRadius: 1,
                                    shadowOffset: { width: 0, height: 2 },
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.handleRouteChange(route.name)}
                                    style={{
                                        alignContent: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: 5,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        marginVertical: 10,
                                        marginHorizontal: 20,
                                        flexDirection: 'row-reverse',
                                    }}
                                    key={index}>
                                    <View style={{ width: '45%', flexDirection: 'row-reverse' }}>
                                        <View style={{
                                            borderRadius: 5,
                                            backgroundColor: '#666666',
                                            padding: 5
                                        }}>
                                            {route.icon}
                                        </View>
                                        <Text style={{
                                            paddingHorizontal: 10, fontSize: 16, textAlignVertical: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Light'
                                        }}>
                                            {locales(route.label)}
                                        </Text>
                                    </View>
                                    <View style={{ width: '55%', flexDirection: 'row' }}>
                                        <Text style={{ textAlignVertical: 'center' }}>
                                            <FontAwesome5 color={'#666666'} size={25} name='angle-left' />
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </ShadowView>
                        )
                    })}
                </ScrollView>
                {(this.state.loading || this.props.logOutLoading) ?
                    <ShadowView
                        style={{
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                            position: 'absolute', left: '44%', top: '40%',
                            borderColor: 'black',
                            backgroundColor: 'white', width: 40, height: 40, borderRadius: 20
                        }}
                    >
                        <ActivityIndicator size="small" color="#00C569"
                            style={{
                                top: 10
                            }}
                        />
                    </ShadowView>
                    : null}

            </>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch(authReducer.logOut())
    }
}
const mapStateToProps = (state) => {
    return {
        logOutLoading: state.authReducer.logOutLoading,
        loggedInUserId: state.authReducer.loggedInUserId,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)