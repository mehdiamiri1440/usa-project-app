import React, { Component } from 'react';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';
import moment from 'moment';
import { Button } from 'native-base';
import {
    View, Text, Modal, TouchableOpacity, Image, TextInput, FlatList,
    ActivityIndicator, StyleSheet, TouchableHighlight
} from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import Axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
// import Voice from '@react-native-community/voice';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils/deviceDimenssions';
import Message from './Message';
import * as messagesActions from '../../redux/messages/actions';
import MessagesContext from './MessagesContext';
import { formatter, validator } from '../../utils';
import ChatWithUnAuthorizedUserPopUp from './ChatWithUnAuthorizedUserPopUp';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import { generateKey } from '../../utils/dataGenerator';
import RNFetchBlob from 'rn-fetch-blob';

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
            loaded: false,

            isVoiceMessage: true,

            currentTime: 0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DownloadsDirectoryPath + `/messanger-voice-${generateKey()}.aac`,
            hasPermission: undefined,

        };
        Jmoment.locale('en');
        // Voice.onSpeechStart = this.onSpeechStart;
        // Voice.onSpeechEnd = this.onSpeechEnd;
        // Voice.onSpeechError = this.onSpeechError;
        // Voice.onSpeechResults = this.onSpeechResults;
        // Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }

    scrollViewRef = React.createRef();

    componentDidMount() {
        this.props.fetchUserChatHistory(this.props.contact.contact_id, this.state.msgCount);
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState(state => {
                    let seconds = Math.floor(data.currentTime % 60);
                    let minutes = Math.floor(data.currentTime / 60);
                    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
                    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
                    state.currentTime = `${minutes}:${seconds}`;
                    return '';
                });
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });

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
            // console.warn('end reached in updated', this.state.loaded)
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
    };




    // onStartButtonPress = async (e) => {
    //     try {
    //         await Voice.start('fa-IR');
    //         this.setState({
    //             recognized: '',
    //             started: '',
    //             results: [],
    //         });
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // const onSpeechStart = (e) => {
    //     //Invoked when .start() is called without error
    //     console.log('onSpeechStart: ', e);
    //     setStarted('√');
    // };

    // const onSpeechEnd = (e) => {
    //     //Invoked when SpeechRecognizer stops recognition
    //     console.log('onSpeechEnd: ', e);
    //     setEnd('√');
    // };

    // const onSpeechError = (e) => {
    //     //Invoked when an error occurs.
    //     console.log('onSpeechError: ', e);
    //     setError(JSON.stringify(e.error));
    // };

    // const onSpeechResults = (e) => {
    //     //Invoked when SpeechRecognizer is finished recognizing
    //     console.log('onSpeechResults: ', e);
    //     setResults(e.value);
    // };

    // const onSpeechPartialResults = (e) => {
    //     //Invoked when any results are computed
    //     console.log('onSpeechPartialResults: ', e);
    //     setPartialResults(e.value);
    // };

    // const onSpeechVolumeChanged = (e) => {
    //     //Invoked when pitch that is recognized changed
    //     console.log('onSpeechVolumeChanged: ', e);
    //     setPitch(e.value);
    // };

    // const startRecognizing = async () => {
    //     //Starts listening for speech for a specific locale
    //     try {
    //         await Voice.start('en-US');
    //         setPitch('');
    //         setError('');
    //         setStarted('');
    //         setResults([]);
    //         setPartialResults([]);
    //         setEnd('');
    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);
    //     }
    // };

    // const stopRecognizing = async () => {
    //     //Stops listening for speech
    //     try {
    //         await Voice.stop();
    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);
    //     }
    // };

    // const cancelRecognizing = async () => {
    //     //Cancels the speech recognition
    //     try {
    //         await Voice.cancel();
    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);
    //     }
    // };

    // const destroyRecognizer = async () => {
    //     //Destroys the current SpeechRecognizer instance
    //     try {
    //         await Voice.destroy();
    //         setPitch('');
    //         setError('');
    //         setStarted('');
    //         setResults([]);
    //         setPartialResults([]);
    //         setEnd('');
    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);
    //     }
    // };
    prepareRecordingPath = (audioPath) => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }
    pause = async () => {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({ paused: true });
        } catch (error) {
            console.error(error);
        }
    }

    resume = async () => {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ paused: false });
        } catch (error) {
            console.error(error);
        }
    }

    stop = async () => {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({ stoppedRecording: true, recording: false, paused: false });

        try {
            const filePath = await AudioRecorder.stopRecording();
            console.warn('fil', filePath)
            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            const fs = RNFetchBlob.fs
            const base64 = RNFetchBlob.base64
            fs.createFile(filePath, `messanger-voice-${generateKey()}`, 'utf8')
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    play = async () => {
        if (this.state.recording) {
            await this.stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    record = async () => {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({ recording: true, paused: false });

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording = (didSucceed, filePath, fileSize) => {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    _renderButton = (title, onPress, active) => {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _renderPauseButton = (onPress, active) => {
        var style = (active) ? styles.activeButtonText : styles.buttonText;
        var title = this.state.paused ? "RESUME" : "PAUSE";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }



    render() {
        let { visible, onRequestClose, transparent, contact, userChatHistoryLoading, profile_photo, isSenderVerified } = this.props;
        let { first_name: firstName, last_name: lastName, contact_id: id, user_name, is_verified = 0 } = contact;
        let { userChatHistory, isFirstLoad, messageText, recording, showUnAuthorizedUserPopUp, isVoiceMessage, currentTime } = this.state;
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



                <View style={styles.container}>
                    <View style={styles.controls}>
                        {this._renderButton("RECORD", () => { this.record() }, this.state.recording)}
                        {this._renderButton("PLAY", () => { this.play() })}
                        {this._renderButton("STOP", () => { this.stop() })}
                        {/* {this._renderButton("PAUSE", () => {this.pause()} )} */}
                        {this._renderPauseButton(() => { this.state.paused ? this.resume() : this.pause() })}
                        <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                    </View>
                </View>

                {/* <Text onPress={this.onStartButtonPress}>press</Text> */}


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
                        onPress={isVoiceMessage ? this.record : this.sendMessage}
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

                        {isVoiceMessage ?
                            <FontAwesome5 name='microphone' size={25} color='white' />
                            :
                            <MaterialCommunityIcons name='send' size={25} color='white' />
                        }
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
                        placeholder={recording ? 'در حال ضبط' : 'پیامی بگذارید'}
                        placeholderTextColor="#BEBEBE"
                        multiline={true}
                    />
                    <TouchableOpacity
                        onPress={this.stop}
                        style={{ flexDirection: 'row', position: 'absolute', left: 100 }}>
                        <FontAwesome5 name='microphone' size={25} color='#E41C38' />
                        <Text style={{ color: '#21AD93' }}>{currentTime}</Text>
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    },
})

ChatModal.contextType = MessagesContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatModal);