import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, AppState } from 'react-native';
import { connect } from 'react-redux';
import { useScrollToTop, useIsFocused } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import analytics from '@react-native-firebase/analytics';
import { Navigation } from 'react-native-navigation';
import messaging from '@react-native-firebase/messaging';
import { Button } from 'native-base';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as messagesActions from '../../redux/messages/actions';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

import Contact from './Contact';
import ChannelInContactsList from './ChannelInContactsList';

let unsubscribe;


class ContactsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            routes: [{ key: 'messages', title: locales('labels.messages') }, { key: 'requests', title: locales('labels.requests') }],
            searchText: '',
            contactsList: [],
            contactsListData: {},
            from: 0,
            to: 15,
            contactsListUpdated: false,
            loaded: false,
            appState: AppState.currentState
        }
    }

    contactsListRef = React.createRef();
    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
                if (componentType === 'Component') {
                    analytics().logScreenView({
                        screen_name: componentName,
                        screen_class: componentName,
                    });
                }
            });
            analytics().logScreenView({
                screen_name: "messanger",
                screen_class: "messanger",
            });
            // this.props.emptyMessage(false)
            this.props.fetchAllContactsList(this.state.from, this.state.to);
            unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            });

            unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            });
            unsubscribe = messaging().onMessage(async remoteMessage => {
                if (remoteMessage && remoteMessage.data.BTarget == 'messages') {
                    this.props.newMessageReceived(true)
                    this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
                }
            });
            // .catch(_ => this.setState({ showModal: true }));
        }
        AppState.addEventListener('change', this.handleAppStateChange);
        this.screenFocusEvent = this.props.navigation.addListener('focus', this.handleScreenFocused);
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.loaded == false && this.props.contactsList.length) {
            this.setState({ contactsList: this.props.contactsList, contactsListData: { ...this.props.contactsListData }, loaded: true });
        }
        if (prevProps.refresh != this.props.refresh) {
            this.setState({ contactsList: this.props.contactsList, contactsListData: { ...this.props.contactsListData }, loaded: true })
        }
        if (this.props.searchText != this.state.searchText) {
            this.handleSearch(this.props.searchText)
        }
        this.props.setRefresh(false)
    }


    componentWillUnmount() {
        this.isComponentMounted = false;
        AppState.removeEventListener('change', this.handleAppStateChange)
        this.screenFocusEvent;
        return unsubscribe;
    }

    handleScreenFocused = _ => {
        this.props.fetchAllContactsList().then(result => {
            this.setState({ contactsList: [...result.payload.contact_list], contactsListData: { ...result.payload } });
            if (this.props.contactsList.every(item => item.unread_msgs_count == 0)) {
                this.props.newMessageReceived(false);
            }
        });
    };

    handleSearch = text => {
        let contactsList = [...this.state.contactsList];
        if (text) {
            contactsList = this.props.contactsList.filter(item => `${item.first_name} ${item.last_name}`.includes(text));
        }
        else {
            contactsList = [...this.props.contactsList]
        }
        this.setState({ contactsList, searchText: text })
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.props.isFocused) {
            this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => {
                this.setState({ loaded: false })
            })
        }
        this.setState({ appState: nextAppState });
    };

    setSearchText = searchText => this.setState({ searchText });


    renderItem = ({ item, index }) => {
        const {
            contactsList
        } = this.state;

        return (
            <Contact
                item={item}
                index={index}
                setSearchText={this.setSearchText}
                contactsList={contactsList}
                contactsListLoading={this.props.contactsListLoading}
                {...this.props}
            />
        )
    };



    renderListEmptyComponent = () => {
        const {
            contactsListLoading,
            userProfile = {}
        } = this.props;
        const {
            searchText
        } = this.state;

        const {
            user_info = {}
        } = userProfile
        const {
            is_seller
        } = user_info

        return contactsListLoading ?
            [1, 2, 3, 4, 5].map((_, index) =>
                <View
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                    }}>
                    <ContentLoader
                        speed={2}
                        width={deviceWidth}
                        height={80}
                        viewBox="0 0 480 80"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <Rect x="158" y="11" rx="3" ry="3" width="183" height="15" />
                        <Circle cx="398" cy="33" r="33" />
                        <Rect x="191" y="44" rx="3" ry="3" width="147" height="13" />
                        <Rect x="0" y="11" rx="3" ry="3" width="88" height="15" />
                        <Rect x="2" y="77" rx="0" ry="0" width="436" height="2" />
                    </ContentLoader>
                </View>)


            : searchText ?
                <View style={{ marginTop: 30, flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign size={135} name='contacts' color='#BEBEBE' />
                    <Text style={{ fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#7E7E7E' }}>
                        {locales('labels.noContactFound')}
                    </Text>
                </View> :
                <View style={{ flex: 1, alignSelf: 'center', marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Entypo size={135} name='message' color='#BEBEBE' />
                    <Text style={{ fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#7E7E7E' }}>
                        {locales('labels.noChatFound')}
                    </Text>
                    <Button
                        onPress={() => this.props.navigation.navigate(is_seller ? 'RequestsStack' : 'Home')}
                        style={[styles.loginButton]}
                    >
                        <View style={[styles.textCenterView, styles.buttonText]}>
                            <Text style={[styles.textWhite, styles.textBold,
                            styles.textSize18, { marginTop: 3 }]}>
                                {is_seller ? locales('titles.seeBuyAds') : locales('labels.seeProductsList')}
                            </Text>
                        </View>

                    </Button>
                </View>
    };

    renderOnRefresh = _ => {
        this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => {
            this.setState({ loaded: false })
        })
        // .catch(_ => this.setState({ showModal: true }))
    };

    renderKeyExtractor = item => item.contact_id.toString();

    render() {


        let { contactsList, contactsListData } = this.state;
        const { channel_info = {} } = contactsListData;


        const {
            last_content_title,
            last_content_date,
            unread_contents
        } = channel_info;

        return (
            <>

                <>
                    <View style={{
                        paddingHorizontal: 15,
                        backgroundColor: '#fff'
                    }}>


                        <FlatList
                            ListEmptyComponent={this.renderListEmptyComponent}
                            ref={this.props.contactsListRef}
                            refreshing={false}
                            onRefresh={this.renderOnRefresh}
                            keyExtractor={this.renderKeyExtractor}
                            keyboardShouldPersistTaps='handled'
                            keyboardDismissMode='on-drag'
                            showsVerticalScrollIndicator={false}
                            windowSize={13}
                            initialNumToRender={2}
                            maxToRenderPerBatch={5}
                            style={{ width: '100%', height: deviceHeight }}
                            contentContainerStyle={{ paddingBottom: 235 }}
                            ListHeaderComponent={_ => <ChannelInContactsList
                                unread_contents={unread_contents}
                                last_content_title={last_content_title}
                                last_content_date={last_content_date}
                                {...this.props}
                            />}
                            data={contactsList}
                            renderItem={this.renderItem}
                        />
                    </View>
                </>
            </>
        );
    }
}



const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        paddingHorizontal: deviceWidth * 0.025,
        alignSelf: 'center',
    },
    cardItemStyle: {
        borderRadius: 5,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 2,
        borderWidth: 1,
    },
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center',
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: '100%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: '100%',
        height: 40,
        elevation: 0,
        borderRadius: 4,
        backgroundColor: '#00C569',
        color: 'white',
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    actionsWrapper: {
        flexDirection: 'row-reverse',
        flex: 1,
        justifyContent: 'center',

    },
    elevatorIcon: {
        backgroundColor: '#7E7E7E',
        padding: 10,
        borderRadius: 4,
        height: 40,
        marginTop: 10,
        marginRight: 15
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize18: {
        fontSize: 18
    },
    scene: {
        flex: 1
    },
});

const mapStateToProps = (state) => {
    return {
        contactsList: state.messagesReducer.contactsList,
        contactsListMessage: state.messagesReducer.contactsListMessage,
        contactsListError: state.messagesReducer.contactsListError,
        contactsListFailed: state.messagesReducer.contactsListFailed,
        contactsListLoading: state.messagesReducer.contactsListLoading,
        contactsListData: state.messagesReducer.contactsListData,

        userProfile: state.profileReducer.userProfile,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllContactsList: (from, to) => dispatch(messagesActions.fetchAllContactsList(from, to)),
        newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
    }
};




const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);
    const isFocused = useIsFocused();
    return <ContactsList {...props} contactsListRef={ref} isFocused={isFocused} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
