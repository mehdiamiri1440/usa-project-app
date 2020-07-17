import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { useScrollToTop } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { Card, CardItem, Body, Icon, InputGroup, Input } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { connect } from 'react-redux';
import * as messagesActions from '../../redux/messages/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import Jmoment from 'moment-jalaali';
import ChatModal from './ChatModal';
import MessagesContext from './MessagesContext';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import NoConnection from '../../components/noConnectionError';


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
        this.props.isFromOutSide(false)
        this.props.fetchAllContactsList(this.state.from, this.state.to).catch(_ => this.setState({ showModal: true }));
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.loaded == false && this.props.contactsList.length) {
            this.setState({ contactsList: this.props.contactsList, loaded: true })
        }


        if (this.props.message) {
            this.props.newMessageReceived(false)
            setTimeout(() => {
                this.props.fetchAllContactsList(this.state.from, this.state.to).then(() => {
                    this.setState({ contactsList: this.props.contactsList, contactsListUpdated: true }, () => {
                    })
                }).catch(_ => this.setState({ showModal: true }))
            }, 10);
        }
    }


    setNewContactsList = contactsList => {
        if (contactsList && contactsList.length) {
            this.setState({ contactsList })
        }
    };


    closeChatModal = () => {
        this.setState({ modalFlag: false, loaded: false }, () => {
            this.props.fetchAllContactsList(this.state.from, this.state.to).catch(_ => this.setState({ showModal: true }))
        });
    }

    setcontactsListUpdated = contactsListUpdated => this.setState({ contactsListUpdated });

    fetchMoreContacts = () => {
        this.setState({ from: this.state.to, to: this.state.to + 10 }, () => {
            this.props.fetchAllContactsList(this.state.from, this.state.to).then(result => {
                this.setState({ contactsList: [...this.state.contactsList, ...this.props.contactsList] });
            }).catch(_ => this.setState({ showModal: true }));
        })
    };


    handleSearch = text => {
        const { contactsList } = this.props;
        this.setState(state => {
            contactsList.filter(item => (`${item.first_name} ${item.last_name}`).includes(text))
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
                    height: 57,
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
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.messages')}
                        </Text>
                    </View>
                </View>


                <View style={{ marginTop: 5, padding: 4 }}>
                    <InputGroup rounded style={{ backgroundColor: 'white' }}>
                        <Input value={searchText}
                            ref={this.serachInputRef}
                            onChangeText={this.handleSearch}
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', height: 42, textAlignVertical: 'center' }}
                            placeholder={locales('labels.searchContacts')} />
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
                    setcontactsListUpdated={this.setcontactsListUpdated}
                    visible={modalFlag}
                    contactsListUpdated={contactsListUpdated}
                    contact={selectedContact}
                    onRequestClose={this.closeChatModal}
                /> : null}

                <MessagesContext.Provider
                    value={this.setNewContactsList}
                    style={{ paddingBottom: 200, marginBottom: 200 }}
                >
                    <>
                        <Card>
                            <CardItem >
                                <Body >
                                    <FlatList
                                        ListEmptyComponent={() => searchText ?
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
                                        refreshing={((!!contactsListLoading))}
                                        onRefresh={() => {
                                            this.props.fetchAllContactsList(this.state.from, this.state.to).then(_ => {
                                                this.setState({ loaded: false })
                                            }).catch(_ => this.setState({ showModal: true }))
                                        }
                                        }
                                        keyExtractor={item => item.contact_id.toString()}
                                        keyboardShouldPersistTaps='handled'
                                        keyboardDismissMode='on-drag'
                                        showsVerticalScrollIndicator={false}
                                        // getItemLayout={(data, index) => (
                                        //     { length: 100, offset: 100 * index, index }
                                        // )}
                                        // onEndReachedThreshold={0.3}
                                        // onEndReached={this.fetchMoreContacts}
                                        style={{ width: '100%', height: deviceHeight * 1 }}
                                        contentContainerStyle={{ paddingBottom: 200 }}
                                        data={contactsList}
                                        renderItem={({ item, index, separators }) => (
                                            <TouchableOpacity
                                                onPress={() => this.setState({ modalFlag: true, selectedContact: item, searchText: '' })}
                                                key={item.contact_id}
                                                style={{
                                                    borderBottomColor: '#DDDDDD', paddingVertical: 12,
                                                    flexDirection: 'row-reverse', width: '100%',
                                                    borderBottomWidth: index < contactsList.length - 1 ? 1 : 0
                                                }}
                                            >

                                                <Image
                                                    style={{
                                                        borderRadius: deviceWidth * 0.06,
                                                        width: deviceWidth * 0.12, height: deviceWidth * 0.12
                                                    }}
                                                    source={item.profile_photo ?
                                                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.profile_photo}` }
                                                        : require('../../../assets/icons/user.png')}
                                                />

                                                <View>
                                                    <View
                                                        style={{
                                                            width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                            flexDirection: 'row-reverse',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                                            <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5 }}>
                                                                {`${item.first_name} ${item.last_name}`}
                                                            </Text>
                                                            {item.is_verified ? <ValidatedUserIcon /> : null}
                                                        </View>
                                                        <Text style={{ color: '#666666' }}>
                                                            {Jmoment(item.last_msg_time_date.split(" ")[0]).format('jYYYY/jM/jD')}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                            flexDirection: 'row-reverse',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text style={{ color: '#666666', flexWrap: 'wrap', textAlign: 'right', width: '85%' }} numberOfLines={1}>
                                                            {item.last_msg.last_msg_text}
                                                        </Text>
                                                        {item.unread_msgs_count > 0 && <Text style={{
                                                            color: 'white', backgroundColor: '#00C569', width: 30, height: 30,
                                                            borderRadius: 15, textAlign: 'center', textAlignVertical: 'center'
                                                        }}>
                                                            {item.unread_msgs_count}
                                                        </Text>}
                                                    </View>

                                                </View>


                                            </TouchableOpacity>

                                        )}
                                    />
                                </Body>
                            </CardItem>
                        </Card>
                    </>
                    {/* <ScrollView
                        keyboardShouldPersistTaps='handled'
                        keyboardDismissMode='on-drag'
                        style={{ paddingHorizontal: 5, height: deviceHeight * 0.78 }}>

                        {modalFlag ? <ChatModal
                            transparent={false}
                            setcontactsListUpdated={this.setcontactsListUpdated}
                            visible={modalFlag}
                            contactsListUpdated={contactsListUpdated}
                            contact={selectedContact}
                            onRequestClose={this.closeChatModal}
                        /> : null}

                        <Card style={{ minHeight: deviceHeight * 0.77 }}>
                            <CardItem>
                                <Body>
                                    {
                                        contactsList && contactsList.map((contact, index) => (
                                            <TouchableOpacity
                                                onPress={() => this.setState({ modalFlag: true, selectedContact: contact })}
                                                key={contact.contact_id}
                                                style={{
                                                    borderBottomColor: '#DDDDDD', paddingVertical: 12,
                                                    flexDirection: 'row-reverse', width: '100%',
                                                    borderBottomWidth: index < contactsList.length - 1 ? 1 : 0
                                                }}
                                            >

                                                <Image
                                                    style={{
                                                        borderRadius: deviceWidth * 0.06,
                                                        width: deviceWidth * 0.12, height: deviceWidth * 0.12
                                                    }}
                                                    source={contact.profile_photo ?
                                                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${contact.profile_photo}` }
                                                        : require('../../../assets/icons/user.png')}
                                                />

                                                <View>
                                                    <View
                                                        style={{
                                                            width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                            flexDirection: 'row-reverse',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                                            {`${contact.first_name} ${contact.last_name}`}
                                                        </Text>
                                                        <Text style={{ color: '#666666' }}>
                                                            {Jmoment(contact.last_msg_time_date.split(" ")[0]).format('jYYYY/jM/jD')}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                            flexDirection: 'row-reverse',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text style={{ color: '#666666', flexWrap: 'wrap', textAlign: 'right', width: '85%' }} numberOfLines={1}>
                                                            {contact.last_msg.last_msg_text}
                                                        </Text>
                                                        {contact.unread_msgs_count > 0 && <Text style={{
                                                            color: 'white', backgroundColor: '#00C569', width: 30, height: 30,
                                                            borderRadius: 15, textAlign: 'center', textAlignVertical: 'center'
                                                        }}>
                                                            {contact.unread_msgs_count}
                                                        </Text>}
                                                    </View>

                                                </View>


                                            </TouchableOpacity>
                                     
                                     ))
                                    }
                                </Body>
                            </CardItem>
                        </Card>

                    </ScrollView>
               */}
                </MessagesContext.Provider>
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

        message: state.messagesReducer.message

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllContactsList: (from, to) => dispatch(messagesActions.fetchAllContactsList(from, to)),
        newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        isFromOutSide: (message) => dispatch(messagesActions.isFromOutSide(message)),

    }
};




const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <ContactsList {...props} contactsListRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)