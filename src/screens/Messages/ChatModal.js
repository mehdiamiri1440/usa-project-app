import React from 'react';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';
import { Button, Toast } from 'native-base';
import {
    ToastAndroid,
    View, Text, Modal, TouchableOpacity, Image, TextInput,
    FlatList, ActivityIndicator
} from 'react-native';
import Clipboard from "@react-native-community/clipboard";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import messaging from '@react-native-firebase/messaging';
import MessagesContext from './MessagesContext';
import { formatter, dataGenerator } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';

class ChatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            msgCount: 10,
            userChatHistory: [],
            prevScrollPosition: 0,
            loaded: false
        };
        Jmoment.locale('en')
    }

    scrollViewRef = React.createRef();

    componentDidMount() {
        this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory].reverse(), loaded: true }, () => {
                // if (!this.state.isFirstLoad)
                //     setTimeout(() => {
                //         this.scrollViewRef.current.scrollToEnd({ animated: true });
                //     }, 1000)
            })
        }
        if (this.props.message || this.props.contactsListUpdated) {
            this.props.newMessageReceived(false)
            this.props.setcontactsListUpdated(false);
            setTimeout(() => {
                this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(() => {
                    this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory].reverse() }, () => {
                        // if (!this.state.isFirstLoad)
                        //     setTimeout(() => {
                        //         this.scrollViewRef.current.scrollToEnd({ animated: true });
                        //     }, 1000)
                    })
                })
            }, 10);
            console.warn('reached', this.props.message)
        }
    }


    componentWillUnmount() {
        Jmoment.locale('fa');
        this.props.fetchAllContactsList();
    }

    handleMessageTextChange = text => {
        this.setState({ messageText: text })
    }

    sendMessage = () => {

        let { messageText } = this.state;
        let userChatHistory = [...this.state.userChatHistory].reverse();

        let msgObject = {
            sender_id: formatter.toStandard(this.props.loggedInUserId),
            receiver_id: formatter.toStandard(this.props.contact.contact_id),
            text: formatter.toStandard(messageText)
        }

        if (messageText && messageText.length && messageText.trim()) {
            userChatHistory.push({ ...msgObject });
            this.setState({
                userChatHistory: [...userChatHistory.slice(-10)].reverse(),
                messageText: '',
                isFirstLoad: false
            });

            this.props.sendMessage(msgObject).then(() => {
                setTimeout(() => {
                    if (this.scrollViewRef && this.scrollViewRef.current && this.state.userChatHistory.length > 0 && !this.props.userChatHistoryLoading)
                        setTimeout(() => {
                            this.scrollViewRef.current.scrollToIndex({ animated: true, index: 0 });
                        }, 200);
                }, 10);
                this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(() => {
                    this.setState(state => {
                        state.loaded = false;
                        return '';
                    })
                })
            });

        }

    }

    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading, profile_photo } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id, user_name, is_verified = 0 } = contact;
        let { userChatHistory, isFirstLoad, messageText, loaded } = this.state;

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
                            {is_verified ? <ValidatedUserIcon /> : null}
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
                    // refreshing={this.state.userChatHistory}
                    data={userChatHistory}
                    getItemLayout={(data, index) => (
                        { length: 40, offset: 40 * index, index }
                    )}
                    inverted
                    ref={this.scrollViewRef}
                    style={{ marginBottom: 60, paddingTop: 2, height: '100%' }}
                    extraData={this.state}
                    onEndReached={() => {
                        if (loaded && userChatHistory.length >= 9)
                            this.setState({ msgCount: this.state.msgCount + 10, loaded: false }, () => {
                                this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount)
                            })
                    }}
                    // pagingEnabled={true}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index, separators }) => (
                        <View
                            style={{
                                width: deviceWidth,
                                paddingHorizontal: 10,
                                paddingVertical: 0,
                                marginTop: index == separators.length - 1 ? 50 : (index < separators.length - 1 && separators[index].receiver_id == separators[index + 1].receiver_id ? 5 : 7),
                                flex: 1,
                                alignItems: id == item.receiver_id ? 'flex-end' : 'flex-start'
                            }}
                            key={index}
                        >
                            <View
                                style={{

                                    elevation: 1,
                                    maxWidth: deviceWidth * 0.75, paddingHorizontal: 10, borderRadius: 9, paddingVertical: 3,
                                    backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                                }}
                            >
                                <Text
                                    selectionColor='gray'
                                    suppressHighlighting
                                    selectable
                                    onPress={() => {
                                        ToastAndroid.showWithGravityAndOffset(
                                            locales('titles.copiedToClipboard'),
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            5,
                                            20)
                                        Clipboard.setString(item.text)
                                    }}
                                    style={{
                                        zIndex: 999999,
                                        textAlign: 'right',
                                        fontSize: 16,
                                        color: '#333333'
                                    }}>
                                    {item.text}
                                </Text>
                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
                                    {id == item.receiver_id && (item.created_at ? <MaterialCommunityIcons
                                        style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                        name={item.is_read ? 'check-all' : 'check'} size={14}
                                        color={item.is_read ? '#60CAF1' : '#617D8A'} /> :
                                        <Feather name='clock' size={14} color='#617D8A'
                                            style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                        />
                                    )
                                    }
                                    <Text
                                        style={{
                                            color: '#333333',
                                            fontSize: 12
                                        }}>
                                        {Jmoment(item.created_at).format('jYY/jM/jD , hh:mm A ')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    )}
                />





                {/* 
                    <ScrollView
                        keyboardShouldPersistTaps='handled'
                        keyboardDismissMode='on-drag'
                        onScroll={event => this.setState({ prevScrollPosition: event.nativeEvent.contentOffset.y })}
                        onContentSizeChange={() => this.scrollViewRef.current.scrollToEnd({ animated: true })}
                        ref={this.scrollViewRef}
                        style={{ height: keyboardHeight == 0 ? deviceHeight * 0.87 : (deviceHeight * 0.87) - keyboardHeight }}
                    >

                        {
                            userChatHistory.map((message, index, self) => (

                                <View style={{
                                    width: deviceWidth,
                                    paddingHorizontal: 10,
                                    marginTop: index == 0 ? 10 : 0,
                                    marginBottom: index == self.length - 1 ? 50 : (index < self.length - 1 && self[index].receiver_id == self[index + 1].receiver_id ? 5 : 10),
                                    flex: 1,
                                    alignItems: id == message.receiver_id ? 'flex-end' : 'flex-start'
                                }}
                                    key={index}
                                >
                                    <View
                                        style={{
                                            shadowOffset: { width: 20, height: 20 },
                                            shadowColor: 'black',
                                            shadowOpacity: 1.0,
                                            elevation: 5,
                                            maxWidth: deviceWidth * 0.75, paddingHorizontal: 10, borderRadius: 9,
                                            backgroundColor: id == message.receiver_id ? '#DCF8C6' : '#F7F7F7',
                                        }}
                                    >
                                        <Text style={{
                                            textAlign: 'right',
                                            fontSize: 16,
                                            color: '#333333'
                                        }}>
                                            {message.text}
                                        </Text>
                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 }}>
                                            {id == message.receiver_id && (message.created_at ? <MaterialCommunityIcons
                                                style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                                name={message.is_read ? 'check-all' : 'check'} size={14}
                                                color={message.is_read ? '#60CAF1' : '#617D8A'} /> :
                                                <Feather name='clock' size={14} color='#617D8A'
                                                    style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                                />
                                            )
                                            }
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    color: '#333333',
                                                    fontSize: 12
                                                }}>
                                                {Jmoment(message.created_at).format('jYY/jM/jD , hh:mm A ')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            ))

                        }
                    </ScrollView>
 */}


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
                        disabled={!!userChatHistoryLoading}
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

        contactsList: state.messagesReducer.contactsList,
        // profile_photo: state.messagesReducer.profile_photo,

        message: state.messagesReducer.message
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        fetchUserChatHistory: (id, msgCount) => dispatch(messagesActions.fetchUserChatHistory(id, msgCount)),
        newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject, props.buyAdId)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList()),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id))
    }
};

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);