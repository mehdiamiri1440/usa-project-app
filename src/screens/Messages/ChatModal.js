import React from 'react';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';
import { Button } from 'native-base';
import {
    View, Text, Modal, TouchableOpacity, Image, TextInput, KeyboardAvoidingView,
    Keyboard, ScrollView, TouchableWithoutFeedback
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv';
import Spin from '../../components/loading/loading';
import MessagesContext from './MessagesContext';
import { formatter } from '../../utils';
import { FlatList } from 'react-native-gesture-handler';

class ChatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            userChatHistory: [],
            prevScrollPosition: 0,
            loaded: false
        };
    }

    scrollViewRef = React.createRef();

    componentDidMount() {

        Keyboard.addListener('keyboardDidShow', event => {
            this.setState({ keyboardHeight: event.endCoordinates.height }, () => {
                return this.scrollViewRef.current.scrollTo({ x: 0, y: this.state.prevScrollPosition, animated: true });
            })
        });


        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardHeight: 0 }, () => {
                return this.scrollViewRef.current.scrollTo({ x: 0, y: this.state.prevScrollPosition, animated: true });
            })
        });


        this.props.fetchUserChatHistory(this.props.contact.contact_id)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.setState({ userChatHistory: this.props.userChatHistory, loaded: true })
        }
    }

    handleMessageTextChange = text => {
        this.setState({ messageText: text })
    }

    sendMessage = () => {

        let { messageText } = this.state;

        let msgObject = {
            sender_id: formatter.toStandard(this.props.loggedInUserId),
            receiver_id: formatter.toStandard(this.props.contact.contact_id),
            text: formatter.toStandard(messageText)
        }

        if (messageText && messageText.length && messageText.trim()) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
            this.setState(state => {
                state.userChatHistory.push({ ...msgObject });
                state.messageText = '';
                state.isFirstLoad = false;

                return '';
            }, () => {
                this.props.sendMessage(msgObject).then(() => {
                    this.scrollViewRef.current.scrollToEnd({ animated: true });
                    this.props.fetchUserChatHistory(this.props.contact.contact_id).then(() => {
                        this.setState(state => {
                            state.loaded = false;
                            return '';
                        }, () => {
                            this.props.fetchAllContactsList().then(() => {
                                if (this.context)
                                    this.context(this.props.contactsList)
                                return this.scrollViewRef.current.scrollToEnd({ animated: true });

                            })
                        })
                    })
                })

            })
        }

    }

    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id } = contact;
        let { keyboardHeight, userChatHistory, isFirstLoad, messageText, loaded } = this.state;

        return (
            <Modal
                animationType="slide"
                transparent={transparent}
                visible={visible}
                onRequestClose={onRequestClose}
            >


                <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} style={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                }} />


                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 67,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end', paddingHorizontal: 10
                        }}
                        onPress={onRequestClose}

                    >
                        <AntDesign name='arrowright' size={25}
                        />
                    </TouchableOpacity>
                    <Image
                        style={{
                            borderRadius: 28,
                            width: 56, height: 56
                        }}
                        source={contact.profile_photo ?
                            { uri: `${REACT_APP_API_ENDPOINT}/storage/${contact.profile_photo}` }
                            : require('../../../assets/icons/user.png')}
                    />
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



                <Spin spinning={isFirstLoad && userChatHistoryLoading}>

                    <ScrollView
                        keyboardShouldPersistTaps='handled'
                        onScroll={event => this.setState({ prevScrollPosition: event.nativeEvent.contentOffset.y })}
                        keyboardDismissMode='on-drag'
                        onContentSizeChange={() => this.scrollViewRef.current.scrollToEnd({ animated: true })}
                        ref={this.scrollViewRef}
                        style={{ height: keyboardHeight == 0 ? deviceHeight * 0.77 : (deviceHeight * 0.77) - keyboardHeight }}
                    >

                        {
                            userChatHistory.map((message, index) => (

                                <View style={{
                                    width: deviceWidth,
                                    paddingHorizontal: 10,
                                    marginVertical: 10,
                                    flex: 1,
                                    alignItems: id == message.receiver_id ? 'flex-end' : 'flex-start'
                                }}
                                    key={index}
                                >
                                    <View
                                        style={{
                                            width: deviceWidth * 0.65, padding: 10, borderRadius: 6,
                                            backgroundColor: id == message.receiver_id ? '#DCF8C6' : 'white',
                                        }}
                                    >
                                        <Text style={{
                                            textAlign: 'right',
                                            fontSize: 16,
                                            color: '#777777'
                                        }}>
                                            {message.text}
                                        </Text>
                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 }}>
                                            {id == message.receiver_id && (message.created_at ? <MaterialCommunityIcons
                                                style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                                name={message.is_read ? 'check-all' : 'check'} size={16}
                                                color={message.is_read ? '#60CAF1' : '#617D8A'} /> :
                                                <Feather name='clock' size={16} color='#617D8A' />
                                            )
                                            }
                                            <Text
                                                style={{
                                                    color: '#AAAAAA',
                                                    fontSize: 14
                                                }}>
                                                {Jmoment(message.created_at).format('jYYYY/jM/jD , hh:mm A')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            ))

                        }
                    </ScrollView>


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
                            width: 50,
                            height: 50,
                            alignItems: 'center',
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            borderRadius: 25,
                            marginHorizontal: 10
                        }}
                    >
                        <MaterialCommunityIcons name='send' size={25} color='white' />
                    </Button>
                    <TextInput
                        value={messageText}
                        onChangeText={this.handleMessageTextChange}
                        style={{
                            textAlign: 'right', backgroundColor: 'white', borderRadius: 20, paddingVertical: 10,
                            width: deviceWidth * 0.8, paddingHorizontal: 20,
                            maxHeight: 100,
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

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserChatHistory: (id) => dispatch(messagesActions.fetchUserChatHistory(id)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList())
    }
};

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);