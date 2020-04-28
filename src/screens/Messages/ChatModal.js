import React from 'react';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';
import { Button } from 'native-base';
import {
    View, Text, Modal, TouchableOpacity, Image, TextInput, KeyboardAvoidingView,
    Keyboard, ScrollView, TouchableWithoutFeedback, FlatList,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import Spin from '../../components/loading/loading';
import messaging from '@react-native-firebase/messaging';
import MessagesContext from './MessagesContext';
import { formatter, dataGenerator } from '../../utils';

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
        this.props.fetchUserProfilePhoto(this.props.contact.contact_id);
        this.props.fetchTotalUnreadMessages();
        // Keyboard.addListener('keyboardDidShow', event => {
        //     this.setState({ keyboardHeight: event.endCoordinates.height }, () => setTimeout(() => {
        //         this.scrollViewRef.current.scrollToEnd({ animated: true });
        //     }, 200)
        //     )
        // messaging().onMesonmesage(message => {
        //     console.warn('dfsfd-->>', this.state.userChatHistory)
        //     this.props.fetchUserChatHistory(this.props.contact.contact_id).then(() => {
        //         this.setState({ userChatHistory: this.props.userChatHistory }, () => {
        //         })
        //         this.props.fetchAllContactsList().then(_ => {
        //         })
        //     })
        // })
        // });


        // Keyboard.addListener('keyboardDidHide', () => {
        //     this.setState({ keyboardHeight: 0 }, () => setTimeout(() => {
        //         this.scrollViewRef.current.scrollToEnd({ animated: true });
        //     }, 200)
        //     )
        // });


        this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(() => {
            // if (this.state.isFirstLoad)
            //     setTimeout(() => {
            //         this.scrollViewRef.current.scrollToEnd({ animated: true });
            //     }, 1000)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.props.fetchTotalUnreadMessages();
            this.setState({ userChatHistory: [...this.props.userChatHistory].reverse(), loaded: true }, () => {
                // if (!this.state.isFirstLoad)
                //     setTimeout(() => {
                //         this.scrollViewRef.current.scrollToEnd({ animated: true });
                //     }, 1000)
            })
        }
        if (this.props.message || this.props.contactsListUpdated) {
            this.props.fetchTotalUnreadMessages();
            this.props.newMessageReceived(false)
            this.props.setcontactsListUpdated(false);
            setTimeout(() => {
                this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount).then(() => {
                    this.setState({ userChatHistory: [...this.props.userChatHistory].reverse() }, () => {
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
        Jmoment.locale('fa')
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
                    this.scrollViewRef.current.scrollToIndex({ animated: true, index: 0 });
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
        let { first_name: firstName, last_name: lastName, contact_id: id } = contact;
        let { keyboardHeight, userChatHistory, isFirstLoad, messageText, loaded } = this.state;

        return (
            <Modal
                animationType="slide"
                transparent={transparent}
                visible={visible}
                onRequestClose={() => {
                    this.props.fetchTotalUnreadMessages();
                    onRequestClose()
                }}
            >


                <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} style={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
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
                            source={contact.profile_photo || profile_photo ?
                                { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${contact.profile_photo || profile_photo}` }
                                : require('../../../assets/icons/user.png')}
                        />
                    </TouchableOpacity>
                    <View style={{
                        paddingHorizontal: 10,
                        width: deviceWidth * 0.63,
                        alignItems: 'flex-end',
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {`${firstName} ${lastName}`}
                        </Text>
                    </View>
                </View>



                <Spin spinning={isFirstLoad && userChatHistoryLoading && !this.state.loaded}>


                    <FlatList
                        // refreshing={this.state.userChatHistory}
                        data={userChatHistory}
                        getItemLayout={(data, index) => (
                            { length: userChatHistory.length, offset: 100 * index, index }
                        )}
                        inverted
                        ref={this.scrollViewRef}
                        style={{ marginBottom: 105, marginTop: 10 }}
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
                                    marginBottom: index == separators.length - 1 ? 50 : (index < separators.length - 1 && separators[index].receiver_id == separators[index + 1].receiver_id ? 5 : 10),
                                    flex: 1,
                                    alignItems: id == item.receiver_id ? 'flex-end' : 'flex-start'
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
                                        backgroundColor: id == item.receiver_id ? '#DCF8C6' : '#F7F7F7',
                                    }}
                                >
                                    <Text style={{
                                        textAlign: 'right',
                                        fontSize: 16,
                                        color: '#333333'
                                    }}>
                                        {item.text}
                                    </Text>
                                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 }}>
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
                                                    fontFamily: 'Vazir-Bold-FD',
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

                </Spin>

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
                            resizeMode: 'cover'
                        }} />

                    <Button
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
                            overflow: 'scroll'
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
        profile_photo: state.messagesReducer.profile_photo,

        message: state.messagesReducer.message
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        fetchUserChatHistory: (id, msgCount) => dispatch(messagesActions.fetchUserChatHistory(id, msgCount)),
        newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList()),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id))
    }
};

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);