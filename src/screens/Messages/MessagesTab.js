import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import analytics from '@react-native-firebase/analytics';
import { Navigation } from 'react-native-navigation';
import messaging from '@react-native-firebase/messaging';
import { Card, CardItem, Body, Icon, InputGroup, Input } from 'native-base';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as messagesActions from '../../redux/messages/actions';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

import ChatModal from './ChatModal';
import Contact from './Contact';

let unsubscribe;


class ContactsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            routes: [{ key: 'messages', title: locales('labels.messages') }, { key: 'requests', title: locales('labels.requests') }],
            modalFlag: false,
            searchText: '',
            contactsList: [],
            from: 0,
            to: 15,
            contactsListUpdated: false,
            loaded: false,
            selectedContact: {
                first_name: '',
                last_name: '',
                id: null
            },
        }
    }

    contactsListRef = React.createRef();
    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
                if (componentType === 'Component') {
                    analytics().setCurrentScreen(componentName, componentName);
                }
            });
            analytics().setCurrentScreen("messanger", "messanger");
            // this.props.emptyMessage(false)
            this.props.fetchAllContactsList(this.state.from, this.state.to);

            unsubscribe = messaging().getInitialNotification(async remoteMessage => {
                console.log('message reciev from fcm in contacts list when it was init', remoteMessage)
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            });
            unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
                console.log('message reciev from fcm in contacts list when notification opend app', remoteMessage)
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            });

            unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
                console.log('message reciev from fcm in contacts list when app was in background', remoteMessage)
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            });
            unsubscribe = messaging().onMessage(async remoteMessage => {
                if (remoteMessage && remoteMessage.data.BTarget == 'messages') {
                    console.log('message reciev from fcm in contacts list', remoteMessage)
                    this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
                }
            });
            // .catch(_ => this.setState({ showModal: true }));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.warn('wear1111', prevState.loaded)
        if (prevState.loaded == false && this.props.contactsList.length) {
            // console.warn('wear', prevState.loaded)
            this.setState({ contactsList: this.props.contactsList, loaded: true })
        }
        if (prevProps.refresh != this.props.refresh) {
            this.setState({ contactsList: this.props.contactsList, loaded: true })
        }
        if (this.props.searchText != this.state.searchText) {
            this.handleSearch(this.props.searchText)
        }
        this.props.setRefresh(false)
    }


    componentWillUnmount() {
        this.isComponentMounted = false;
        return unsubscribe;
    }

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

    setSearchText = searchText => this.setState({ searchText })

    closeChatModal = () => {
        this.setState({ modalFlag: false, loaded: false }, () => {
            this.props.fetchAllContactsList(this.state.from, this.state.to)
            // .catch(_ => this.setState({ showModal: true }))
        });
    }

    setSelectedContact = selectedContact => {
        this.setState({ selectedContact })
    };

    setModalFlag = modalFlag => {
        this.setState({ modalFlag })
    };




    render() {

        let { contactsListLoading, } = this.props;
        let { modalFlag, selectedContact, contactsList, searchText } = this.state;
        return (
            <>

                {modalFlag ? <ChatModal
                    transparent={false}
                    {...this.props}
                    // setcontactsListUpdated={this.setcontactsListUpdated}
                    visible={modalFlag}
                    // contactsListUpdated={contactsListUpdated}
                    contact={selectedContact}
                    onRequestClose={this.closeChatModal}
                /> : null}
                {/* 
                <MessagesContext.Provider
                    value={this.setNewContactsList}
                    style={{ paddingBottom: 200, marginBottom: 200 }}
                > */}
                <>
                    <Card>

                        <CardItem >
                            <Body >
                                <FlatList
                                    ListEmptyComponent={() =>
                                        contactsListLoading ?
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
                                                <View style={{ flex: 1, height: deviceHeight, justifyContent: 'center', alignItems: 'center' }}>
                                                    <AntDesign size={135} name='contacts' color='#BEBEBE' />
                                                    <Text style={{ fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#7E7E7E' }}>{locales('labels.noContactFound')}</Text>
                                                </View> :
                                                <View style={{ flex: 1, height: deviceHeight, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Entypo size={135} name='message' color='#BEBEBE' />
                                                    <Text style={{ fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#7E7E7E' }}>{locales('labels.noChatFound')}</Text>
                                                </View>
                                    }
                                    ref={this.props.contactsListRef}
                                    refreshing={!!contactsListLoading}
                                    onRefresh={() => {
                                        this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => {
                                            this.setState({ loaded: false })
                                        })
                                        // .catch(_ => this.setState({ showModal: true }))
                                    }
                                    }
                                    keyExtractor={item => item.contact_id.toString()}
                                    keyboardShouldPersistTaps='handled'
                                    keyboardDismissMode='on-drag'
                                    showsVerticalScrollIndicator={false}
                                    style={{ width: '100%', height: deviceHeight * 1 }}
                                    contentContainerStyle={{ paddingBottom: 220 }}
                                    data={contactsList}
                                    renderItem={({ item, index }) => <Contact
                                        item={item}
                                        setModalFlag={this.setModalFlag}
                                        setSelectedContact={this.setSelectedContact}
                                        index={index}
                                        setSearchText={this.setSearchText}
                                        contactsList={contactsList}
                                        {...this.props}
                                    />
                                    }
                                />
                            </Body>
                        </CardItem>
                    </Card>
                </>
                {/* </MessagesContext.Provider> */}
            </>
        );
    }
}


const styles = StyleSheet.create({
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

        // newMessage: state.messagesReducer.newMessage,
        // messageFromOutSide: state.messagesReducer.messageFromOutSide,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllContactsList: (from, to) => dispatch(messagesActions.fetchAllContactsList(from, to)),
        // newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        // emptyMessage: (message) => dispatch(messagesActions.emptyMessage(message)),

    }
};




const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <ContactsList {...props} contactsListRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
