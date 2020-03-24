import React from 'react';
import { connect } from 'react-redux';
import Jmoment, { locales } from 'moment-jalaali';
import { View, Text, Modal, TouchableOpacity, Image, TextInput, Keyboard } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import Spin from '../../components/loading/loading';
import { ScrollView } from 'react-native-gesture-handler';
import { toStandard } from '../../utils/formatter';

class ChatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            userChatHistory: [],
            loaded: false
        };
    }

    scrollViewRef = React.createRef();

    componentDidMount() {

        Keyboard.addListener('keyboardDidShow', event => {
            this.setState({ keyboardHeight: event.endCoordinates.height })
        });


        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardHeight: 0 })
        });


        this.props.fetchUserChatHistory(this.props.contact.contact_id)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.setState({ userChatHistory: this.props.userChatHistory, loaded: true })
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.loaded == false && this.props.contact.contact_id) {
    //         this.setState({ loaded: true }, () => {
    //             this.props.fetchUserChatHistory(this.props.contact.contact_id);
    //         })

    //     }
    // }

    // closeModal = () => {
    //     this.setState({ loaded: false }, () => {
    //         this.props.onRequestClose();
    //     })

    // };
    handleMessageTextChange = text => {
        this.setState({ messageText: text })
    }

    sendMessage = () => {

        let { messageText } = this.state;

        let msgObject = {
            sender_id: toStandard(this.props.userChatHistory[0].receiver_id),
            receiver_id: toStandard(this.props.contact.contact_id),
            text: toStandard(messageText)
        }

        if (messageText && messageText.length) {
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
                            return this.scrollViewRef.current.scrollToEnd({ animated: true });

                        })
                    })
                })

            })
        }

    }

    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id } = contact;
        let { keyboardHeight, userChatHistory, isFirstLoad, messageText } = this.state;

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
                    resizeMode: 'cover', // or 'stretch'
                }} />


                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{
                            width: deviceWidth * 0.4, justifyContent: 'center',
                            alignItems: 'flex-end', paddingHorizontal: 10
                        }}
                        onPress={onRequestClose}

                    >
                        <AntDesign name='arrowright' size={25}
                        />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.63,
                        alignItems: 'flex-end'
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
                        onLayout={() => {
                            return this.scrollViewRef.current.scrollToEnd({ animated: true })
                        }
                        }
                        ref={this.scrollViewRef}
                        style={{ marginBottom: 80, height: keyboardHeight == 0 ? deviceHeight * 0.77 : (deviceHeight * 0.77) - keyboardHeight }}>
                        {
                            userChatHistory.map((message, index) => (

                                <View style={{
                                    width: deviceWidth,
                                    flexDirection: 'column',
                                    paddingHorizontal: 10,
                                    marginVertical: 10,
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
                                                color={message.is_read ? '#60CAF1' : '#617D8A'} /> : <Feather name='clock' size={16} color='#617D8A' />
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
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start', position: 'absolute', bottom: 0,
                        width: deviceWidth, paddingVertical: 20,
                        flexDirection: 'row-reverse',
                    }}>
                    <Image source={require('../../../assets/images/whatsapp-wallpaper.png')} style={{
                        position: 'absolute',
                        width: deviceWidth,
                        maxHeight: 60,
                        resizeMode: 'cover', // or 'stretch'
                    }} />


                    <TouchableOpacity
                        onPress={this.sendMessage}
                        style={{
                            backgroundColor: '#00C569',
                            width: 50,
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 25,
                            marginHorizontal: 10
                        }}
                    >
                        <MaterialCommunityIcons name='send' size={25} color='white' />
                    </TouchableOpacity>

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
        userChatHistory: state.messagesReducer.userChatHistory
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserChatHistory: (id) => dispatch(messagesActions.fetchUserChatHistory(id)),
        sendMessage: msgObject => dispatch(messagesActions.sendMessage(msgObject))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);