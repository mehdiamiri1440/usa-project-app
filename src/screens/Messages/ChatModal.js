import React, { Component } from 'react';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';
import moment from 'moment';
import { Button } from 'native-base';
import { View, Text, Modal, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import Axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth } from '../../utils/deviceDimenssions';
import Message from './Message';
import * as messagesActions from '../../redux/messages/actions';
import MessagesContext from './MessagesContext';
import { formatter, validator } from '../../utils';
import ChatWithUnAuthorizedUserPopUp from './ChatWithUnAuthorizedUserPopUp';
import ValidatedUserIcon from '../../components/validatedUserIcon';

let unsubscribe;
class ChatModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            msgCount: 25,
            showUnAuthorizedUserPopUp: false,
            userChatHistory: [],
            prevScrollPosition: 0,
            loaded: false
        };
        Jmoment.locale('en')
    }

    scrollViewRef = React.createRef();

    componentDidMount() {
        this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount);

        // unsubscribe = messaging().getInitialNotification(async remoteMessage => {
        //     console.log('message reciev from fcm in chat list when it was init', remoteMessage)
        //     this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(_ => this.setState({ loaded: false }));
        // });
        // unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
        //     console.log('message reciev from fcm in chat list when notification opend app', remoteMessage)
        //     this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(_ => this.setState({ loaded: false }));
        // });

        // unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
        //     console.log('message reciev from fcm in chat list when app was in background', remoteMessage)
        //     this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(_ => this.setState({ loaded: false }));
        // });
        unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage && remoteMessage.data.BTarget == 'messages') {
                if (this.props.contact && this.props.contact.contact_id == remoteMessage.data.senderId)
                    this.pushNewMessageToChatList(remoteMessage);
                // this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(_ => this.setState({ loaded: false }));
            }
        });
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            console.warn('end reached in updated', this.state.loaded)
            this.fetchSenderIds()
            this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory].reverse(), loaded: true }, () => {
                // if (!this.state.isFirstLoad)
                //     setTimeout(() => {
                //         this.scrollViewRef.current.scrollToEnd({ animated: true });
                //     }, 1000)
            })
        }
        // if (this.props.newMessage || this.props.contactsListUpdated) {
        //     console.warn('re')
        //     // this.props.newMessageReceived(false)
        //     // this.props.setcontactsListUpdated(false);
        //     setTimeout(() => {
        //         this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(() => {
        //             this.fetchSenderIds()
        //             this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory].reverse() }, () => {
        //                 // if (!this.state.isFirstLoad)
        //                 //     setTimeout(() => {
        //                 //         this.scrollViewRef.current.scrollToEnd({ animated: true });
        //                 //     }, 1000)
        //             })
        //         })
        //     }, 10);
        //     console.warn('reached', this.props.newMessage)
        // }
    }


    componentWillUnmount() {
    }


    pushNewMessageToChatList = (remoteMessage) => {
        const text = remoteMessage.notification.body;
        let userChatHistory = [...this.state.userChatHistory];
        const message = {
            sender_id: this.props.contact.contact_id,
            receiver_id: this.props.loggedInUserId,
            text,
            is_phone: validator.isMobileNumber(text),
            is_read: 1
        };


        userChatHistory.unshift(message);

        userChatHistory.slice(0, 60).forEach(item => {
            if (item.is_read == undefined) {
                item.is_read = true;
            }
        })
        this.setState({ userChatHistory }, () => {
            Axios.post(`${REACT_APP_API_ENDPOINT_RELEASE}/get_user_chat_history`, {
                msg_count: this.state.msgCount,
                user_id: this.props.contact.contact_id
            })
        })

    };


    handleMessageTextChange = text => {
        this.setState({ messageText: text })
    }

    sendMessage = () => {
        let { messageText } = this.state;
        let userChatHistory = [...this.state.userChatHistory].reverse();
        let msgObject = {
            sender_id: formatter.toStandard(this.props.loggedInUserId),
            receiver_id: formatter.toStandard(this.props.contact.contact_id),
            text: formatter.toStandard(messageText),
            created_at: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        }

        if (messageText && messageText.length && messageText.trim()) {
            userChatHistory.push({ ...msgObject });
            AsyncStorage.setItem('@user/ChatHistory', JSON.stringify(userChatHistory));
            this.setState({
                userChatHistory: [...userChatHistory.slice(-25)].reverse(),
                messageText: '',
                isFirstLoad: false
            });

            this.props.sendMessage(msgObject).then((result) => {
                setTimeout(() => {
                    if (this.scrollViewRef && this.scrollViewRef != null && this.scrollViewRef != undefined &&
                        this.scrollViewRef.current && this.scrollViewRef.current != null &&
                        this.scrollViewRef.current != undefined &&
                        result.payload.message && this.state.userChatHistory.length > 0 &&
                        !this.props.userChatHistoryLoading)
                        setTimeout(() => {
                            this.scrollViewRef?.current.scrollToIndex({ animated: true, index: 0 });
                        }, 200);
                }, 10);
                // this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount)
                //     .then(() => {
                //         this.setState(state => {
                //             state.loaded = false;
                //             return '';
                //         })
                //     })
            });

        }

    }


    hideUnAuthorizedUserChatPopUp = () => {

        AsyncStorage.getItem('@sender_ids').then(async (sender_ids_from_storage) => {
            let sender_ids = [];
            if (sender_ids_from_storage) {
                sender_ids = JSON.parse(sender_ids_from_storage);
            }

            let id = '';
            if (this.state.userChatHistory.length) {
                id = this.state.userChatHistory.every(item => item.sender_id != this.props.loggedInUserId) ?
                    this.state.userChatHistory.find(item => item.sender_id != this.props.loggedInUserId).sender_id
                    : "";
            }
            if (id) {
                sender_ids.push(id);
                this.setState({ showUnAuthorizedUserPopUp: false });
                return await AsyncStorage.setItem('@sender_ids', JSON.stringify(sender_ids));
            }
        });
    };

    fetchSenderIds = () => AsyncStorage.getItem('@sender_ids').then(sender_ids => {
        sender_ids = JSON.parse(sender_ids);
        if (sender_ids && sender_ids.length) {
            if (this.state.userChatHistory.length) {
                const foundSender_id = this.state.userChatHistory.every(item => item.sender_id != this.props.loggedInUserId) ?
                    this.state.userChatHistory.find(item => item.sender_id != this.props.loggedInUserId).sender_id
                    : "";
                this.setState({ showUnAuthorizedUserPopUp: sender_ids.every(item => item != foundSender_id) });
            }
        }
        else {
            this.setState({ showUnAuthorizedUserPopUp: true });
        }
    });

    onEndReached = _ => {

        const { loaded, userChatHistory } = this.state;
        if (loaded && userChatHistory.length >= 9)
            this.setState({ msgCount: this.state.msgCount + 25 }, () => {
                this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(_ => this.setState({ loaded: false }))
            })
    };
    keyExtractor = (_, index) => index.toString();

    renderItem = ({ item, index, separators }) => {
        return <Message
            item={item}
            loggedInUserId={this.props.loggedInUserId}
            contact={this.props.contact}
            index={index}
            separators={separators}
        />;
    };

    renderListFooterComponent = _ => {
        if (!this.state.isFirstLoad && (this.props.userChatHistoryLoading))
            return (
                <View style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    marginBottom: 15

                }}>
                    <ActivityIndicator size="small" color="#00C569"
                        style={{
                            zIndex: 999,
                            width: 50, height: 50,
                            borderRadius: 50,
                            backgroundColor: '#fff',
                            elevation: 5,
                            padding: 0,
                        }}
                    />
                </View>
            )
        return null;
    }

    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading, profile_photo, isSenderVerified } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id, user_name, is_verified = 0 } = contact;
        let { userChatHistory, isFirstLoad, messageText, loaded, showUnAuthorizedUserPopUp } = this.state;
        return (
            <Modal
                animationType="slide"
                transparent={transparent}
                visible={visible}
                onRequestClose={() => {
                    Jmoment.locale('fa')
                    onRequestClose()
                }}
            >


                <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} style={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                    width: '100%',
                    height: '100%',
                }} />


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
                    }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row-reverse' }}
                        onPress={() => {
                            Jmoment.locale('fa')
                            this.props.fetchTotalUnreadMessages();
                            onRequestClose()
                        }}>
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
                            source={profile_photo || contact.profile_photo ?
                                { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo || contact.profile_photo}` }
                                : require('../../../assets/icons/user.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={this.props.buyAdId ? 1 : 0}
                        onPress={() => {
                            Jmoment.locale('fa');
                            if (!this.props.buyAdId) {
                                onRequestClose();
                                this.props.navigation.navigate('Profile', { user_name });
                            }
                        }}
                        style={{
                            paddingHorizontal: 10,
                            width: deviceWidth * 0.63,
                            alignItems: 'flex-end',
                        }}>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <Text
                                style={{ fontSize: 18, marginHorizontal: 5 }}
                            >
                                {`${firstName} ${lastName}`}
                            </Text>
                            {is_verified ? <ValidatedUserIcon  {...this.props} /> : null}
                        </View>
                    </TouchableOpacity>
                </View>


                {(isFirstLoad && userChatHistoryLoading && !this.state.loaded) ?
                    <ActivityIndicator size="large" color="#00C569"
                        style={{
                            position: 'absolute', left: '44%', top: '40%',
                            shadowOffset: { width: 20, height: 20 },
                            shadowColor: 'black',
                            shadowOpacity: 1.0,
                            elevation: 5,
                            borderColor: 'black',
                            backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                        }}
                    /> : null}


                <FlatList
                    data={userChatHistory}
                    ListFooterComponentStyle={{ padding: 10 }}
                    ListFooterComponent={this.renderListFooterComponent}
                    inverted
                    maxToRenderPerBatch={3}
                    initialNumToRender={3}
                    windowSize={10}
                    ref={this.scrollViewRef}
                    style={{ marginBottom: 60, paddingTop: 2, height: '100%' }}
                    extraData={this.state}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />


                {(userChatHistory.length && userChatHistory.every(item => item.sender_id != this.props.loggedInUserId) &&
                    !isSenderVerified && showUnAuthorizedUserPopUp) ? <View style={{ marginBottom: 55, marginTop: -65 }}>

                        <ChatWithUnAuthorizedUserPopUp
                            hideUnAuthorizedUserChatPopUp={this.hideUnAuthorizedUserChatPopUp}
                        />
                    </View>
                    : null}


                <View
                    style={{
                        position: 'absolute', bottom: 0, paddingTop: 3,
                        width: deviceWidth, paddingBottom: 10,
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Image source={require('../../../assets/images/whatsapp-wallpaper.png')}
                        style={{
                            position: 'absolute',
                            width: deviceWidth,
                            resizeMode: 'cover',
                            width: '100%',
                            height: '100%'
                        }} />

                    <Button
                        // disabled={!!userChatHistoryLoading}
                        onPress={this.sendMessage}
                        style={{
                            backgroundColor: '#00C569',
                            width: 44,
                            height: 44,
                            alignItems: 'center',
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            borderRadius: 22,
                            marginHorizontal: 10
                        }}
                    >
                        <MaterialCommunityIcons name='send' size={25} color='white' />
                    </Button>

                    <TextInput
                        value={messageText}
                        onChangeText={this.handleMessageTextChange}
                        style={{
                            textAlign: 'right', backgroundColor: 'white', borderRadius: 20, paddingVertical: 6,
                            width: deviceWidth * 0.8, paddingHorizontal: 20,
                            maxHeight: 100, height: 44,
                            overflow: 'scroll',
                        }}
                        placeholder='پیامی بگذارید'
                        placeholderTextColor="#BEBEBE"
                        multiline={true}
                    />
                </View>

            </Modal>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        userChatHistoryLoading: state.messagesReducer.userChatHistoryLoading,
        userChatHistory: state.messagesReducer.userChatHistory,
        loggedInUserId: state.authReducer.loggedInUserId,
        isSenderVerified: state.messagesReducer.isSenderVerified,
        userProfile: state.profileReducer.userProfile,

        contactsList: state.messagesReducer.contactsList,
        // profile_photo: state.messagesReducer.profile_photo,

        // newMessage: state.messagesReducer.newMessage
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        fetchUserChatHistory: (id, msgCount) => dispatch(messagesActions.fetchUserChatHistory(id, msgCount)),
        // newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject, props.buyAdId)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList()),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id))
    }
};

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);