import React from 'react';
import { connect } from 'react-redux';
import Jmoment, { locales } from 'moment-jalaali';
import { Button } from 'native-base';
import {
    View, Text, Modal, TouchableOpacity, Image, TextInput, KeyboardAvoidingView,
    Keyboard, ScrollView, FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv';
import Spin from '../../components/loading/loading';
import messaging from '@react-native-firebase/messaging';
import MessagesContext from './MessagesContext';
import { formatter } from '../../utils';

class ChatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            selecteds: -10,
            userChatHistory: [],
            prevScrollPosition: 0,
            loaded: false
        };
    }

    scrollViewRef = React.createRef();

    componentDidMount() {
        this.props.fetchUserProfilePhoto(this.props.contact.contact_id)
        // Keyboard.addListener('keyboardDidShow', event => {
        //     this.setState({ keyboardHeight: event.endCoordinates.height }, () => {
        // return this.scrollViewRef.current.scrollTo({ x: 0, y: this.state.prevScrollPosition, animated: true });
        // })
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
        //     this.setState({ keyboardHeight: 0 }, () => {
        // return this.scrollViewRef.current.scrollTo({ x: 0, y: this.state.prevScrollPosition, animated: true });
        //     })
        // });


        this.props.fetchUserChatHistory(this.props.contact.contact_id)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.setState({ userChatHistory: this.props.userChatHistory, loaded: true })
        }
        // if (this.props.message) {
        //     console.warn('herer-->', this.props.message)
        //     this.props.newMessageReceived(false)
        //     setTimeout(() => {
        //         this.props.fetchUserChatHistory(this.props.contact.contact_id).then(() => {
        //             this.setState({ userChatHistory: this.props.userChatHistory }, () => {
        //                 console.warn('thighjk---->', this.state.userChatHistory)
        //                 // this.scrollViewRef.current.scrollToEnd({ animated: true });
        //             })
        //         })
        //     }, 1000);
        //     console.warn('reached', this.props.message)
        // }
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
            // this.scrollViewRef.current.scrollToEnd({ animated: true });
            this.setState(state => {
                state.userChatHistory.push({ ...msgObject });
                state.messageText = '';
                state.isFirstLoad = false;

                return '';
            }, () => {
                this.props.sendMessage(msgObject).then(() => {
                    // this.scrollViewRef.current.scrollToEnd({ animated: true });
                    this.props.fetchUserChatHistory(this.props.contact.contact_id).then(() => {
                        this.setState(state => {
                            state.loaded = false;
                            return '';
                        }, () => {
                            this.props.fetchAllContactsList().then(() => {
                                if (this.context)
                                    this.context(this.props.contactsList)
                                // return this.scrollViewRef.current.scrollToEnd({ animated: true });

                            })
                        })
                    })
                })

            })
        }

    }

    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading, profile_photo } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id } = contact;
        let { keyboardHeight, userChatHistory, isFirstLoad, messageText, selecteds } = this.state;

        return (
            <Modal
                animationType="slide"
                transparent={transparent}
                visible={visible}
                onRequestClose={() => {
                    this.props.fetchAllContactsList().then(() => {
                        // if (this.context.length)
                        //     this.context(this.props.contactsList)
                        onRequestClose()
                    })
                }}
            >


                <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} style={{
                    flex: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                }} />


                <TouchableOpacity
                    onPress={() => {
                        this.props.fetchAllContactsList().then(() => {
                            // if (this.context.length)
                            //     this.context(this.props.contactsList)
                            onRequestClose()
                        })
                    }
                    } style={{
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
                            { uri: `${REACT_APP_API_ENDPOINT}/storage/${contact.profile_photo || profile_photo}` }
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
                </TouchableOpacity>



                <Spin spinning={isFirstLoad && userChatHistoryLoading && !this.state.loaded}>

                    <FlatList
                        // keyboardShouldPersistTaps='handled'
                        refreshing={isFirstLoad && userChatHistoryLoading && !this.state.loaded}
                        // keyboardDismissMode='on-drag'
                        // getItemLayout={(data, index) => ({
                        //     length: data.length, offset: deviceHeight * index, index
                        // })
                        // }
                        // onContentSizeChange={() => this.scrollViewRef.current.scrollToEnd({ animated: true })}
                        keyExtractor={(item) => JSON.stringify(item.id)}
                        extraData={this.state.userChatHistory.slice(selecteds)}
                        ref={this.scrollViewRef}
                        onRefresh={() => this.setState({ selecteds: this.state.selecteds - 10 })}
                        ListEmptyComponent={() => <Text>{locales('titles.chatHistoryIsEmpty')}</Text>}
                        data={this.state.userChatHistory.slice(selecteds)}
                        renderItem={({ item, index, separators }) => (
                            <View style={{
                                width: deviceWidth,
                                paddingHorizontal: 10,
                                marginTop: index == 0 ? 10 : 0,
                                marginBottom: index == separators.length - 1 ? 20 : (index < separators.length - 1 && separators[index].receiver_id == separators[index + 1].receiver_id ? 5 : 10),
                                flex: 1,
                                alignItems: id == item.receiver_id ? 'flex-end' : 'flex-start'
                            }}
                                key={index}
                            >
                                <View
                                    style={{
                                        shadowOffset: { width: 3, height: 3 },
                                        shadowColor: 'black',
                                        shadowOpacity: 1.0,
                                        elevation: 2,
                                        width: deviceWidth * 0.65, padding: 10, borderRadius: 6,
                                        backgroundColor: id == item.receiver_id ? '#DCF8C7' : 'white'
                                    }}
                                >
                                    <Text style={{
                                        textAlign: 'right',
                                        fontSize: 16,
                                        color: '#777777'
                                    }}>
                                        {item.text}
                                    </Text>
                                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 }}>
                                        {id == item.receiver_id && (item.created_at ? <MaterialCommunityIcons
                                            style={{ textAlign: 'right', paddingHorizontal: 3 }}
                                            name={item.is_read ? 'check-all' : 'check'} size={16}
                                            color={item.is_read ? '#60CAF1' : '#617D8A'} /> :
                                            <Feather name='clock' size={16} color='#617D8A' />
                                        )
                                        }
                                        <Text
                                            style={{
                                                color: '#AAAAAA',
                                                fontSize: 14
                                            }}>
                                            {Jmoment(item.created_at).format('jYYYY/jM/jD , hh:mm A')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        )}
                    />

                    {/* <ScrollView
                        keyboardShouldPersistTaps='handled'
                        keyboardDismissMode='on-drag'
                        onScroll={event => this.setState({ prevScrollPosition: event.nativeEvent.contentOffset.y })}
                        onContentSizeChange={() => this.scrollViewRef.current.scrollToEnd({ animated: true })}
                        ref={this.scrollViewRef}
                        style={{ height: keyboardHeight == 0 ? deviceHeight * 0.83 : (deviceHeight * 0.83) - keyboardHeight }}
                    >


                        {
                            userChatHistory.map((message, index, self) => (

                                <View style={{
                                    width: deviceWidth,
                                    paddingHorizontal: 10,
                                    marginTop: index == 0 ? 10 : 0,
                                    marginBottom: index == self.length - 1 ? 20 : (index < self.length - 1 && self[index].receiver_id == self[index + 1].receiver_id ? 5 : 10),
                                    flex: 1,
                                    alignItems: id == message.receiver_id ? 'flex-end' : 'flex-start'
                                }}
                                    key={index}
                                >
                                    <View
                                        style={{
                                            shadowOffset: { width: 3, height: 3 },
                                            shadowColor: 'black',
                                            shadowOpacity: 1.0,
                                            elevation: 2,
                                            width: deviceWidth * 0.65, padding: 10, borderRadius: 6,
                                            backgroundColor: id == message.receiver_id ? '#DCF8C7' : 'white',
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
                    </ScrollView> */}


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
        fetchUserChatHistory: (id) => dispatch(messagesActions.fetchUserChatHistory(id)),
        newMessageReceived: (message) => dispatch(messagesActions.newMessageReceived(message)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList()),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id))
    }
};

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);