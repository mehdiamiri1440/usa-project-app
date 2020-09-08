import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { useScrollToTop } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import { Card, CardItem, Body, Icon, InputGroup, Input } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { connect } from 'react-redux';
import * as messagesActions from '../../redux/messages/actions';
import { ScrollView } from 'react-native-gesture-handler';
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import Jmoment from 'moment-jalaali';
import ChatModal from './ChatModal';
import MessagesContext from './MessagesContext';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import NoConnection from '../../components/noConnectionError';
import Contact from './Contact';

let unsubscribe;
class ContactsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            showModal: false
        }
    }

    serachInputRef = React.createRef();
    contactsListRef = React.createRef();


    componentDidMount() {
        analytics().logEvent('messages')
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
            if (remoteMessage) {
                console.log('message reciev from fcm in contacts list', remoteMessage)
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => this.setState({ loaded: false }));
            }
        });
        // .catch(_ => this.setState({ showModal: true }));
    }

    componentDidUpdate(prevProps, prevState) {
        console.warn('wear1111', prevState.loaded)
        if (prevState.loaded == false && this.props.contactsList.length) {
            console.warn('wear', prevState.loaded)
            this.setState({ contactsList: this.props.contactsList, loaded: true })
        }

        // if (this.props.newMessage) {
        //     this.props.newMessageReceived(false)
        //     // this.props.isFromOutSide(false)
        //     setTimeout(() => {
        //         this.props.fetchAllContactsList(this.state.from, this.state.to).then(() => {
        //             this.setState({ contactsList: this.props.contactsList, contactsListUpdated: true }, () => {
        //             })
        //         })
        //         // .catch(_ => this.setState({ showModal: true }))
        //     }, 10);
        // }
    }


    componentWillUnmount() {
        return unsubscribe;
    }

    // setNewContactsList = contactsList => {
    //     if (contactsList && contactsList.length) {
    //         this.setState({ contactsList })
    //     }
    // };

    setUnreadMessages = id => {
        let contactsList = this.state.contactsList;
        const foundIndex = contactsList.findIndex(item => item.contact_id == id);
        contactsList[foundIndex].unread_msgs_count = 0;
        this.setState({ contactsList })
    };

    closeChatModal = () => {
        this.setState({ modalFlag: false, loaded: false }, () => {
            this.props.fetchAllContactsList(this.state.from, this.state.to)
            // .catch(_ => this.setState({ showModal: true }))
        });
    }

    // setcontactsListUpdated = contactsListUpdated => this.setState({ contactsListUpdated });

    handleSearch = text => {
        const { contactsList } = this.props;
        this.setState(state => {
            state.searchText = text;
            state.isSearched = true;
            if (text) {
                state.contactsList = contactsList.filter(item => `${item.first_name} ${item.last_name}`.includes(text));
            }
            else {
                state.contactsList = [...contactsList]
            }
            return '';
        })
    }

    closeModal = _ => {
        this.setState({ showModal: false, });
        this.props.fetchAllContactsList(this.state.from, this.state.to);
    }


    setSelectedContact = selectedContact => {
        this.setState({ selectedContact })
    };

    setSearchText = searchText => this.setState({ searchText })

    setModalFlag = modalFlag => {
        this.setState({ modalFlag })
    };

    render() {

        let { contactsListLoading } = this.props;
        let { modalFlag, selectedContact, loaded, searchText, contactsList, contactsListUpdated } = this.state;

        return (
            <View>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />
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
                        onPress={() => this.props.navigation.goBack()}
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


                <View style={{ marginTop: 5, marginHorizontal: 5, padding: 4 }}>
                    <InputGroup rounded style={{ backgroundColor: 'white', elevation: 1 }}>
                        <Input value={searchText}
                            ref={this.serachInputRef}
                            onChangeText={this.handleSearch}
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777' }}
                            placeholder={locales('labels.searchContacts')}
                            placeholderTextColor="#BEBEBE"

                        />
                        <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                    </InputGroup>
                </View>



                {/* {() ? <ActivityIndicator size="large" color="#00C569"
                    style={{
                        position: 'absolute', left: '44%', top: '40%',
                        shadowOffset: { width: 20, height: 20 },
                        shadowColor: 'black',
                        shadowOpacity: 1.0,
                        elevation: 5,
                        borderColor: 'black',
                        backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                    }}
                /> : null} */}
                {modalFlag ? <ChatModal
                    transparent={false}
                    {...this.props}
                    setUnreadMessages={this.setUnreadMessages}
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
            </View >
        )
    }
}

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