import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Button,
    Input,
    Label,
    InputGroup
} from 'native-base';
import Svg, { Pattern, G, Path, Defs, Image as SvgImage } from 'react-native-svg';
import {
    View, Text, TouchableOpacity, Image, TextInput, FlatList,
    ActivityIndicator, ImageBackground, StyleSheet,
    LayoutAnimation, UIManager, Platform, Modal, Pressable
} from 'react-native';
import { Dialog, Paragraph } from 'react-native-paper';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import ShadowView from '@vikasrg/react-native-simple-shadow-view'
import Axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import Message from './Message';
import * as messagesActions from '../../redux/messages/actions';
import * as productListActions from '../../redux/productsList/actions';
import * as CommentsAndRatingsActions from '../../redux/commentsAndRatings/actions';
import { formatter, validator, deviceWidth, deviceHeight } from '../../utils';
import ChatWithUnAuthorizedUserPopUp from './ChatWithUnAuthorizedUserPopUp';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import ViolationReport from './ViolationReport';
import ChatRating from './ChatRating';


if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

let unsubscribe, isScrollToBottomButtonClicked = false;
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0,
            messageText: '',
            isFirstLoad: true,
            from: 0,
            to: 50,
            showUnAuthorizedUserPopUp: false,
            userChatHistory: [],
            prevScrollPosition: 0,
            loaded: false,
            showGuid: false,
            showViolationReportFlag: false,
            shouldShowRatingCard: false,
            showScrollToBottomButton: false,
            shouldShowPromotionModal: false,
            shouldShowEditPriceModal: false,
            selectedMessageId: null,
            productMinSalePrice: null,
            productMinSalePriceError: null,
            productMinSalePriceClicked: false,
            shouldShowEditionSuccessfullText: false,
            shouldShowDelsaAdvertisement: false,
            shouldShowPhoneNumberBanner: true,
            inventoryModalFlag: false,
        };
    }

    scrollViewRef = React.createRef();

    componentDidMount() {

        const { route = {} } = this.props;
        const { params = {} } = route;
        const { contact = {} } = params;
        const {
            from,
            to
        } = this.state;

        this.handleGuid();

        this.handlePhoneNumberBannerVisiblity();

        this.props.fetchUserChatHistory(contact.contact_id, from, to).then(_ => {
            this.checkForShowingRatingCard();
        });

        this.handleIncomingMessage();

    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.fetchSenderIds()
            this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory], loaded: true });
        }

    }

    handlePhoneNumberBannerVisiblity = _ => {
        AsyncStorage.getItem('@validPassedTimeForPhoneNumberBanner').then(result => {
            result = JSON.parse(result);
            if (result) {
                if (moment().diff(result, 'hours') >= 1)
                    return this.setState({ shouldShowPhoneNumberBanner: true });
                return this.setState({ shouldShowPhoneNumberBanner: false });
            }
            return this.setState({ shouldShowPhoneNumberBanner: true });
        });

    };

    checkForShowingRatingCard = _ => {

        let shouldShowDelsaAdvertisement = false,
            chatWithProductToShowComment = true,
            loggedInUserStatusToShowDelsaAd = true;

        const {
            route = {},
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            is_seller,
            active_pakage_type
        } = user_info;

        const {
            params = {}
        } = route;

        const {
            contact = {}
        } = params;

        const {
            contact_id
        } = contact;

        const {
            userChatHistory = []
        } = this.state;

        if (!is_seller || active_pakage_type != 0)
            loggedInUserStatusToShowDelsaAd = false;

        this.props.checkUserAutorityToPostComment(contact_id).then((result = {}) => {

            const {
                payload = {}
            } = result;

            const {
                is_allowed
            } = payload;

            if (userChatHistory && userChatHistory.length && userChatHistory.length == 1 && !!userChatHistory[0].p_id)
                chatWithProductToShowComment = false;


            AsyncStorage.getItem('@ratedChats').then(result => {

                result = JSON.parse(result);

                if (!Array.isArray(result) || result == null || result == undefined)
                    result = [];

                const foundTime = result.find(item => item.contact_id == contact_id)?.date;

                const closeButtonPassedTime = !foundTime ? true : moment().diff(foundTime, 'hours') >= 24;

                const passedTimeFromLastMessage = userChatHistory && userChatHistory.length &&
                    userChatHistory[0] && userChatHistory[0].created_at &&
                    moment().diff(moment(userChatHistory[0].created_at), 'minutes') >= 10;

                const shouldShowRatingCard = is_allowed && chatWithProductToShowComment && closeButtonPassedTime && passedTimeFromLastMessage && this.isMessagesSentFromDelsa();

                shouldShowDelsaAdvertisement = loggedInUserStatusToShowDelsaAd && !shouldShowRatingCard && passedTimeFromLastMessage;

                this.setState({ shouldShowRatingCard, shouldShowDelsaAdvertisement });
            });
        });
    };

    isMessagesSentFromDelsa = _ => {
        const {
            userChatHistory = []
        } = this.state;

        if (userChatHistory && userChatHistory.length &&
            userChatHistory.filter(item => item.sender_id != this.props.loggedInUserId).some(item => !item.p_id && !item.phone_locked)
        )
            return true;
        return false;
    };

    handleIncomingMessage = _ => {
        const { route = {} } = this.props;
        const { params = {} } = route;
        const { contact = {} } = params;

        unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage && remoteMessage.data.BTarget == 'messages') {
                if (contact && contact.contact_id == remoteMessage.data.senderId)
                    this.pushNewMessageToChatList(remoteMessage);
            }
        });
    };

    handleGuid = _ => {
        const { route = {} } = this.props;
        const { params = {} } = route;
        const { contact = {},
            shouldHideGuidAndComment,
            buyAdId
        } = params;

        if (!buyAdId && !shouldHideGuidAndComment) {

            AsyncStorage.getItem('@openedChatIds').then(result => {

                let ids = JSON.parse(result);

                if (!ids || ids.length == 0) {
                    this.setState({ showGuid: true }, _ => setTimeout(() => this.setState({ showGuid: false }), 2000))
                }
                else {
                    if (contact && contact.contact_id &&
                        ids.some(item => item == contact.contact_id)
                    ) {
                        this.setState({ showGuid: false })
                    }
                    else {
                        if (ids && ids.length && ids.length >= 20) {
                            this.setState({
                                showGuid: false
                            });
                        }
                        else {
                            this.setState({ showGuid: true }, _ => setTimeout(() => this.setState({ showGuid: false }), 2000))
                        }
                    }
                }
                this.checkForShowingCommentsGuid(ids, contact);
            });
        }
    };

    checkForShowingCommentsGuid = (result, contact) => {
        if (contact && contact.contact_id) {
            if (result && result.length) {
                const foundIndex = result.findIndex(item => item == contact.contact_id);
                if (foundIndex < 0) {
                    result.push(contact.contact_id)
                    result = [...(new Set(result))]
                }
            }
            else {
                result = [];
                result.push(contact.contact_id)
                result = [...(new Set(result))]
            }
            AsyncStorage.setItem('@openedChatIds', JSON.stringify(result));
        }
    };

    pushNewMessageToChatList = (remoteMessage) => {
        const { route = {} } = this.props;
        const { params = {} } = route;
        const { contact = {} } = params;
        let text = remoteMessage.notification.body;
        let userChatHistory = [...this.state.userChatHistory];

        let message = {
            sender_id: contact.contact_id,
            receiver_id: this.props.loggedInUserId,
            text,
            is_phone: validator.isMobileNumber(text),
            is_read: 1
        };


        if (text.includes(":p=")) {
            message.text = text.slice(0, text.indexOf(":p="));
            message.isSentFromDelsa = true;
        }

        if (text.includes(":wlt=")) {
            message.text = text.slice(0, text.indexOf(":wlt="));
            message.isSentFromDelsa = true;
        }

        userChatHistory.unshift(message);

        userChatHistory.forEach(item => {
            if (item.is_read == undefined) {
                item.is_read = true;
            }
        });

        this.scrollToTop();

        this.setState({
            userChatHistory,
            shouldShowRatingCard: false,
            shouldShowDelsaAdvertisement: false
        }, () => {
            const {
                from,
                to
            } = this.state;
            Axios.post(`${REACT_APP_API_ENDPOINT_RELEASE}/get_user_chat_history`, {
                from,
                to,
                user_id: contact.contact_id
            })
        })

    };

    handleMessageTextChange = text => {
        this.setState({ messageText: text })
    };

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

    closeViolationModal = _ => {
        this.setState({ visible: true, showViolationReportFlag: false })
    };

    closeRatingCard = _ => {
        let { route = {} } = this.props;
        const { params = {} } = route;
        const {
            contact,
        } = params;
        let {
            contact_id
        } = contact;
        this.setState({ shouldShowRatingCard: false }, _ => {

            AsyncStorage.getItem('@ratedChats').then(result => {
                result = JSON.parse(result);

                if (!Array.isArray(result) || !result || result == null || result == undefined)
                    result = [];

                if (result.every(item => item.contact_id != contact_id))
                    result.push({
                        contact_id,
                        date: moment()
                    }
                    );

                AsyncStorage.setItem('@ratedChats', JSON.stringify(result))
            })
        })
    };

    sendMessage = () => {
        const { route = {} } = this.props;

        const { params = {} } = route;

        const {
            contact = {},
            productId,
            buyAdId
        } = params;

        let { messageText } = this.state;

        let userChatHistory = [...this.state.userChatHistory];

        let msgObject = {
            sender_id: formatter.toStandard(this.props.loggedInUserId),
            receiver_id: formatter.toStandard(contact.contact_id),
            text: formatter.toStandard(messageText),
            created_at: moment(new Date()).format('YYYY-MM-DD HH:mm')
        };

        if (messageText && messageText.length && messageText.trim()) {
            userChatHistory.unshift({ ...msgObject });
            AsyncStorage.setItem('@user/ChatHistory', JSON.stringify(userChatHistory));
            this.setState({
                userChatHistory: [...userChatHistory],
                messageText: '',
                isFirstLoad: false,
                shouldShowRatingCard: false,
                shouldShowDelsaAdvertisement: false
            });

            this.props.sendMessage(msgObject, buyAdId, productId).then((result) => {
                this.scrollToTop(result);
            });
        }
    };

    onScrollChanged = ({
        nativeEvent = {}
    }) => {

        const {
            contentOffset
        } = nativeEvent;

        const {
            showScrollToBottomButton
        } = this.state;
        if (contentOffset.y > 50) {
            if (!isScrollToBottomButtonClicked && !showScrollToBottomButton) {
                this.setState({ showScrollToBottomButton: true });
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }
        }
        else {
            isScrollToBottomButtonClicked = false;
            if (showScrollToBottomButton) {
                this.setState({ showScrollToBottomButton: false });
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }
        }

    };

    onScrollToIndexFailed = _ => {
        const {
            userChatHistory = []
        } = this.state;

        if (userChatHistory && userChatHistory.length)
            this.scrollViewRef?.current?.scrollToIndex({ animated: true, index: userChatHistory.length });
    };

    scrollToTop = (result) => {

        isScrollToBottomButtonClicked = true;

        this.setState({ showScrollToBottomButton: false });

        let conditions = this.scrollViewRef &&
            this.scrollViewRef != null &&
            this.scrollViewRef != undefined &&
            this.scrollViewRef.current &&
            this.scrollViewRef.current != null &&
            this.scrollViewRef.current != undefined &&
            this.state.userChatHistory.length > 0 &&
            !this.props.userChatHistoryLoading;

        if (result) {

            const {
                payload = {}
            } = result;

            conditions = conditions && payload?.message;
        }

        if (conditions)
            this.scrollViewRef?.current?.scrollToIndex({ animated: true, index: 0 });
    };

    onProductMinSalePriceChanged = field => {

        this.setState(() => ({
            productMinSalePriceError: '',
            productMinSalePrice: field,
            productMinSalePriceClicked: true
        }));
        if (field) {
            if (validator.isNumber(field))
                this.setState(() => ({
                    productMinSalePrice: field,
                    productMinSalePriceError: '',
                    productMinSalePriceClicked: true
                }));
            if (field <= 0) {
                this.setState(() => ({
                    productMinSalePriceError: locales('errors.canNotBeZero', { fieldName: locales('titles.minPriceNeeded') }),
                    productMinSalePriceClicked: true
                }));
            }
        }
        else
            this.setState(() => ({
                productMinSalePrice: '',
                productMinSalePriceClicked: false,
                productMinSalePriceError: '',
            }));
    };

    handlePromotionModalVisiblity = shouldShowPromotionModal => {
        this.setState({
            shouldShowPromotionModal,
        });
    };

    setDelsaAdVisiblity = shouldShowDelsaAdvertisement => {
        this.setState({ shouldShowDelsaAdvertisement })
    };

    handleEditPriceModalVisiblity = (productId, messageId) => {
        this.setState({ selectedMessageId: messageId });
        this.props.fetchProductDetails(productId)
            .then(_ => {

                const {
                    productDetails = {}
                } = this.props;

                const {
                    main = {}
                } = productDetails;

                const {
                    min_sale_price
                } = main;

                this.setState({
                    shouldShowEditPriceModal: true,
                    selectedMessageId: null,
                    productMinSalePrice: min_sale_price.toString()
                });
            });
    };

    onEndReached = _ => {

        const {
            route = {},
            userChatHistoryData = {}
        } = this.props;

        const {
            total_count
        } = userChatHistoryData;

        const {
            params = {}
        } = route;

        const {
            contact = {}
        } = params;

        const {
            userChatHistory,
            from,
            to
        } = this.state;

        if (userChatHistory.length < total_count) {

            this.props.fetchUserChatHistory(contact.contact_id, from + 50, to + 50).then((result = {}) => {
                const {
                    payload = {}
                } = result;

                const {
                    messages = []
                } = payload;

                this.setState({
                    userChatHistory: [...userChatHistory, ...messages],
                    from: this.state.from + 50,
                    to: this.state.to + 50
                });
            });
        }
    };

    editProductMinSalePrice = _ => {
        const {
            productDetails = {}
        } = this.props;

        const {
            main = {}
        } = productDetails;

        const {
            id,
            stock,
            min_sale_amount,
            max_sale_price
        } = main;

        const {
            productMinSalePrice
        } = this.state;
        const editObj = {
            product_id: id,
            stock,
            min_sale_amount,
            max_sale_price,
            min_sale_price: parseInt(productMinSalePrice)
        };

        let isProductMinSalePriceInValid = '';

        if (!productMinSalePrice) {
            isProductMinSalePriceInValid = locales('errors.pleaseEnterField', { fieldName: locales('titles.minPriceNeeded') })
        }
        else if (productMinSalePrice && productMinSalePrice <= 0) {
            isProductMinSalePriceInValid = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.minPriceNeeded') })
        }
        else {
            isProductMinSalePriceInValid = '';
        }

        if (!!isProductMinSalePriceInValid)
            this.setState({
                productMinSalePriceError: isProductMinSalePriceInValid,
                productMinSalePriceClicked: true
            });
        else {
            this.props.editProduct(editObj).then(_ => {
                this.setState({
                    productMinSalePriceClicked: false,
                    productMinSalePriceError: null,
                    shouldShowEditionSuccessfullText: true
                }, _ => setTimeout(() => {
                    this.setState({
                        shouldShowEditionSuccessfullText: false,
                        shouldShowEditPriceModal: false,
                    })
                }, 3000));
            });
        }
    };

    keyExtractor = (_, index) => index.toString();

    setInventoryModalVisibility = inventoryModalFlag => {
        this.setState({ inventoryModalFlag })
    };

    renderItem = ({ item, index, separators }) => {
        const {
            route = {},
            userProfile = {},
            productDetailsLoading
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            active_pakage_type
        } = user_info;

        const { params = {} } = route;

        const { contact = {} } = params;

        const {
            selectedMessageId
        } = this.state;

        return <Message
            item={item}
            active_pakage_type={active_pakage_type}
            loggedInUserId={this.props.loggedInUserId}
            selectedMessageId={selectedMessageId}
            handlePromotionModalVisiblity={this.handlePromotionModalVisiblity}
            handleEditPriceModalVisiblity={this.handleEditPriceModalVisiblity}
            productDetailsLoading={productDetailsLoading}
            contact={contact}
            index={index}
            separators={separators}
            prevMessage={this.state.userChatHistory[index > 0 ? index - 1 : 0]}
            setInventoryModalVisibility={this.setInventoryModalVisibility}
            {...this.props}
        />;
    };

    renderListHeaderComponent = _ => {
        const {
            isSenderVerified,
            route = {}
        } = this.props;


        const { params = {} } = route;

        const {
            contact,
        } = params;

        let {
            first_name: firstName,
            last_name: lastName,
            contact_id: id
        } = contact;

        const {
            showUnAuthorizedUserPopUp,
            shouldShowRatingCard,
            userChatHistory,
            shouldShowDelsaAdvertisement
        } = this.state;

        return (
            <View
            >

                {
                    userChatHistory.length
                        ?
                        (
                            shouldShowRatingCard ?
                                <ChatRating
                                    firstName={firstName}
                                    lastName={lastName}
                                    userId={id}
                                    closeRatingCard={this.closeRatingCard}
                                    {...this.props}
                                />
                                : shouldShowDelsaAdvertisement
                                    ? <DelsaAdvertisementComponent
                                        handlePromotionModalVisiblity={this.handlePromotionModalVisiblity}
                                        setDelsaAdVisiblity={this.setDelsaAdVisiblity}
                                        {...this.props}
                                    />
                                    : null
                        )
                        : null
                }

                {(userChatHistory.length && userChatHistory.every(item => item.sender_id != this.props.loggedInUserId) &&
                    !isSenderVerified && showUnAuthorizedUserPopUp) ?
                    <ChatWithUnAuthorizedUserPopUp
                        hideUnAuthorizedUserChatPopUp={this.hideUnAuthorizedUserChatPopUp}
                    />
                    : null}
            </View>
        )
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
                            padding: 0,
                        }}
                    />
                </View>
            )
        return null;
    };

    setPhoneNumberBannerVisibility = _ => {
        AsyncStorage.setItem('@validPassedTimeForPhoneNumberBanner', JSON.stringify(moment()));
        this.setState({ shouldShowPhoneNumberBanner: false });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    render() {

        let {
            userChatHistoryLoading,
            route = {},
            editProductLoading,
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            wallet_balance,
            active_pakage_type,
            is_seller
        } = user_info;

        const {
            params = {}
        } = route;

        const {
            profile_photo,
            contact,
            showReportText,
            shouldHideGuidAndComment = false,
            buyAdId
        } = params;

        let {
            first_name: firstName,
            last_name: lastName,
            contact_id: id,
            user_name,
            is_verified = 0
        } = contact;

        let {
            userChatHistory,
            isFirstLoad,
            messageText,
            showGuid,
            showViolationReportFlag,
            showScrollToBottomButton,
            shouldShowPromotionModal,
            shouldShowEditPriceModal,
            productMinSalePriceError,
            productMinSalePrice,
            productMinSalePriceClicked,
            shouldShowEditionSuccessfullText,
            shouldShowPhoneNumberBanner,
            inventoryModalFlag
        } = this.state;

        const detectToShowCommentAndGuid = showGuid && !buyAdId;

        return (
            <View style={styles.container}>
                {inventoryModalFlag ?
                    <Modal
                        animationType="fade"
                        visible={inventoryModalFlag}
                        onRequestClose={_ => this.setInventoryModalVisibility(false)}
                        transparent={false}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/lock.gif')}
                                style={{
                                    width: '100%',
                                    height: '45%'
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    width: '70%',
                                    color: '#000000',
                                    marginVertical: 40
                                }}
                            >
                                {locales('titles.youAreNotAbleSendPhonesAutomatic')} <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        textAlign: 'center',
                                        color: '#F03738',
                                        fontWeight: '200'
                                    }}
                                >
                                    {locales('titles.disable')}
                                </Text> <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        textAlign: 'center',
                                        color: '#000000',
                                        fontWeight: '200'
                                    }}
                                >
                                    {locales('titles.is')}
                                </Text>
                            </Text>
                            <View
                                style={{
                                    width: '100%'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        marginBottom: 10,
                                        fontSize: 16,
                                        textAlign: 'center',
                                        color: '#000000'
                                    }}
                                >
                                    {locales('titles.sendPhonePrice')}
                                </Text>
                                <Button
                                    onPress={_ => {
                                        this.setState({ inventoryModalFlag: false });
                                        this.props.navigation.navigate('Wallet');
                                    }}
                                    style={{
                                        backgroundColor: '#264653',
                                        borderRadius: 8,
                                        padding: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        width: '85%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 14,
                                            textAlign: 'center',
                                            color: 'white',
                                            textAlignVertical: 'center'
                                        }}
                                    >
                                        {locales('titles.chargeWallet')}
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                    : null}
                <ImageBackground
                    source={require('../../../assets/images/whatsapp-wallpaper.png')}
                    style={styles.image}
                >

                    {shouldShowPromotionModal ?
                        <Modal
                            onRequestClose={_ => this.handlePromotionModalVisiblity(false)}
                            visible={shouldShowPromotionModal}
                            animationType="fade"
                            transparent={true}
                        >
                            <Dialog
                                onDismiss={_ => this.handlePromotionModalVisiblity(false)}
                                visible={shouldShowPromotionModal}
                                style={{ ...styles.dialogWrapper }}
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <AntDesign
                                        onPress={_ => this.handlePromotionModalVisiblity(false)}
                                        name="close"
                                        color="#264653"
                                        solid
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            paddingVertical: 10,
                                            paddingHorizontal: 15
                                        }}
                                        size={22}
                                    />

                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="120"
                                        style={{
                                            marginTop: 20
                                        }}
                                        height="97"
                                        fill="none"
                                        viewBox="0 0 120 97"
                                    >
                                        <Path
                                            fill="#C0D4FF"
                                            d="M94.248 93.804c3.822-5.791 4.909-13.307 2.885-19.944-1.28-4.196-3.734-8.095-4.048-12.47-.628-8.748 7.286-15.821 8.928-24.437.722-3.786-.066-8.198-3.16-10.498-3.054-2.272-7.415-1.808-10.874-.217-3.46 1.591-6.386 4.138-9.707 6-3.32 1.862-7.41 3.013-10.917 1.53-3.553-1.5-5.567-5.284-6.696-8.971-1.128-3.688-1.683-7.615-3.61-10.956-3.174-5.506-9.943-8.508-16.251-7.732-6.308.777-11.944 5.033-14.967 10.624-3.023 5.59-3.552 12.352-2.047 18.528.764 3.131 2.021 6.13 2.707 9.28.686 3.15.748 6.598-.783 9.435-3.2 5.933-11.646 6.76-16.069 11.848-3.65 4.2-3.765 10.608-1.693 15.771 2.072 5.164 5.964 9.355 9.846 13.34 18.105.61 36.533.65 54.638 1.258 7.036.237 14.79-1.975 21.818-2.39z"
                                        ></Path>
                                        <Path
                                            fill="#C0D4FF"
                                            d="M16.904 18.652c-3.625 6.048-3.789 14.02-.415 20.211 1.067 1.956 2.507 3.78 4.451 4.867 1.944 1.088 4.453 1.33 6.388.227 2.935-1.675 3.584-5.623 3.35-8.994-.233-3.371-.997-6.905.301-10.025.847-2.033 2.472-3.619 3.913-5.284 1.442-1.665 2.787-3.61 2.861-5.81.194-5.707-5.865-5.28-9.516-4.095-4.661 1.513-8.806 4.686-11.333 8.903zM87.851 28.085c-.047 5.12 4.82 9.577 3.973 14.628-.453 2.702-2.511 5.441-1.315 7.907 1.059 2.18 4.09 2.558 6.41 1.85 5.426-1.66 8.725-7.208 10.302-12.66 1.484-5.128 1.853-10.855-.524-15.636-1.914-3.851-6.333-7.252-10.819-6.937-4.11.288-7.99 6.99-8.027 10.848z"
                                            opacity="0.5"
                                        ></Path>
                                        <Path
                                            fill="#A1C5FF"
                                            d="M93.344 94.974l-.389-.356c1.071-1.17 2.781-3.854 2.202-8.68-.257-2.148-.896-4.269-1.513-6.32a87.053 87.053 0 01-.81-2.807c-2.657-10.044-1.495-21.123 3.187-30.397a87.66 87.66 0 011.301-2.447c1.29-2.367 2.625-4.815 3.199-7.46 1.006-4.64-.983-8.118-3.257-9.386-2.182-1.217-5.261-1.03-8.449.51-1.166.564-2.3 1.253-3.396 1.92-1.448.882-2.946 1.793-4.554 2.438-6.327 2.538-14.237.381-18.4-5.017-2-2.595-3.13-5.73-4.222-8.762-.423-1.175-.861-2.39-1.342-3.552-1.498-3.615-4.237-8.152-8.789-9.237-3.999-.954-8.05 1.142-10.742 3.069-5.153 3.687-8.785 8.68-10.228 14.059-.973 3.627-1.012 7.575-1.05 11.394-.057 5.685-.115 11.565-3.326 16.3-1.46 2.154-3.47 3.873-5.413 5.535-1.819 1.557-3.7 3.166-5.103 5.117-3.179 4.421-3.958 10.68-2.138 17.173 1.636 5.833 4.97 11.008 8.193 16.014l-.443.285c-3.245-5.038-6.6-10.248-8.257-16.157-1.863-6.648-1.055-13.07 2.217-17.622 1.44-2.003 3.346-3.633 5.189-5.21 1.916-1.64 3.898-3.335 5.319-5.43 3.122-4.604 3.177-10.145 3.235-16.01.038-3.852.078-7.834 1.068-11.526 1.474-5.496 5.178-10.593 10.43-14.35 2.782-1.991 6.979-4.154 11.172-3.155 4.767 1.137 7.609 5.82 9.153 9.549.486 1.174.926 2.395 1.35 3.576 1.08 2.993 2.194 6.09 4.144 8.618 4.024 5.218 11.67 7.304 17.787 4.85 1.568-.629 3.046-1.529 4.477-2.399 1.106-.673 2.25-1.37 3.44-1.944 3.343-1.617 6.6-1.798 8.935-.497 2.438 1.36 4.578 5.056 3.515 9.959-.59 2.719-1.942 5.2-3.25 7.6-.434.795-.883 1.617-1.294 2.433-4.626 9.16-5.773 20.104-3.149 30.024.246.933.53 1.877.805 2.789.624 2.073 1.27 4.218 1.533 6.411.603 5.034-1.205 7.861-2.337 9.098z"
                                        ></Path>
                                        <Path
                                            fill="#99B9FF"
                                            d="M16.867 60.308c.588-1.72.488-3.5-.137-5.075-1.562.419-2.948 1.516-3.613 3.27a6.065 6.065 0 00-.38 2.284 56.96 56.96 0 01-1.643-4.457c1.364-.492 2.52-1.552 3.254-3.003.82-1.63.968-3.422.567-5.087a5.24 5.24 0 00-4.033 2.75 6.126 6.126 0 00-.693 2.224c-.264-1.015-.5-2.04-.708-3.072.64-1.37.917-2.974.716-4.665-.24-1.998-1.1-3.758-2.343-5.035-1.176 1.33-1.833 3.352-1.574 5.504.216 1.817 1.042 3.373 2.168 4.404.082.406.168.81.258 1.213a8.425 8.425 0 00-1.59-1.803c-1.488-1.257-3.214-1.76-4.799-1.4.221 2.13 1.232 4.166 2.812 5.393 1.412 1.102 2.99 1.369 4.393 1.02a57.928 57.928 0 001.521 4.602 8.292 8.292 0 00-1.82-1.542C7.576 56.814 5.8 56.57 4.28 57.148c.512 2.052 1.791 3.904 3.522 4.886 1.55.882 3.148.921 4.487.38a57.997 57.997 0 002.135 4.318 8.206 8.206 0 00-2.012-1.263c-1.767-.772-3.56-.762-4.983.023.787 1.947 2.307 3.593 4.154 4.32 1.654.653 3.242.469 4.493-.254a57.912 57.912 0 002.71 3.974 8.192 8.192 0 00-2.168-.97c-1.856-.518-3.628-.257-4.929.718 1.048 1.814 2.78 3.233 4.71 3.696 1.73.419 3.277.017 4.416-.873a57.99 57.99 0 003.244 3.57 8.202 8.202 0 00-2.286-.666c-1.913-.257-3.633.247-4.785 1.392 1.292 1.655 3.21 2.825 5.192 3.02 1.775.179 3.255-.432 4.259-1.471a57.867 57.867 0 003.74 3.103 8.3 8.3 0 00-2.37-.35c-1.94.006-3.575.742-4.556 2.038 1.52 1.467 3.598 2.368 5.601 2.292 1.794-.064 3.18-.873 4.028-2.042a58.066 58.066 0 006.93 4.006c.32.156.682.067.806-.196s-.03-.597-.342-.75a57.079 57.079 0 01-5.17-2.871c.724-1.256.916-2.817.534-4.406a7.452 7.452 0 00-2.846-4.256c-1.102 1.183-1.696 2.848-1.32 4.695.157.767.47 1.494.906 2.15a56.828 56.828 0 01-3.784-2.928c.895-1.14 1.312-2.653 1.167-4.271a7.317 7.317 0 00-2.188-4.583c-1.256 1.019-2.08 2.582-1.975 4.454.044.778.248 1.537.581 2.242a56.752 56.752 0 01-3.307-3.4c1.046-1.003 1.673-2.44 1.76-4.056a7.249 7.249 0 00-1.516-4.826c-1.385.834-2.418 2.266-2.578 4.13a6.025 6.025 0 00.257 2.294 57.101 57.101 0 01-2.79-3.811c1.174-.849 1.996-2.182 2.308-3.77a7.236 7.236 0 00-.832-4.989c-1.487.634-2.709 1.91-3.126 3.734a6.034 6.034 0 00-.064 2.307 57.006 57.006 0 01-2.236-4.165c1.282-.677 2.28-1.884 2.809-3.415z"
                                        ></Path>
                                        <Path
                                            fill="#7391FF"
                                            d="M108.756 95.773H6.388a1.899 1.899 0 010-3.797h102.368a1.898 1.898 0 010 3.797z"
                                        ></Path>
                                        <Path
                                            fill="#7F4300"
                                            d="M38.69 66.863a8.821 8.821 0 01-4.374-5.56 8.82 8.82 0 011.202-6.971c1.05-1.569 2.667-2.944 2.793-4.827.13-1.951-1.4-3.568-2.154-5.372-.918-2.2-.618-4.864.767-6.804 1.001-1.403 2.526-2.456 3.164-4.057.402-1.007.404-2.12.48-3.201.074-1.082.25-2.215.921-3.066.671-.852 1.982-1.285 2.874-.67 1.558-1.763 3.39-3.897 5.514-4.905 2.126-1.008 4.722-1.256 6.804-.161 1.648.866 2.789 2.443 4.254 3.591 1.257.987 2.737 1.645 4.085 2.506 1.347.86 2.618 2.008 3.089 3.536.774 2.511-.808 5.141-.767 7.769.04 2.552 1.597 4.836 2.036 7.35.444 2.553-.304 5.197-1.57 7.456-1.268 2.259-3.028 4.195-4.773 6.11-.59 3.34-2.92 5.793-5.968 7.283-3.048 1.49-6.517 1.88-9.91 1.912-2.762.026-6.024-.629-8.468-1.919z"
                                        ></Path>
                                        <Path
                                            fill="#6B3900"
                                            d="M42.158 60.063c-.747-.9-.786-2.202-.543-3.347.242-1.144.726-2.232.906-3.387.243-1.563-.08-3.155-.473-4.686-.392-1.531-.856-3.065-.899-4.645-.042-1.58.4-3.254 1.561-4.326 4.072-3.76 10.987-2.833 16.52-2.505 2.796.166 4.822 2.764 5.825 5.38 1.003 2.615.84 5.587-.094 8.228-.932 2.642-2.589 4.979-4.499 7.028-1.14 1.222-3.295.38-4.918.777-1.591.389-2.931 1.431-4.41 2.133a10.976 10.976 0 01-7.657.624c-.738-.212-1.365-.507-1.319-1.274z"
                                        ></Path>
                                        <Path
                                            fill="#FFC985"
                                            d="M71.15 62.285a14.766 14.766 0 00-8.03-5.25c-1.452-.363-2.959-.504-4.387-.952a8.273 8.273 0 01-1.188-.477 26.182 26.182 0 01-.82-6.697H48.353a26.161 26.161 0 01-.819 6.697c-.383.19-.783.35-1.187.477-1.429.448-2.935.589-4.388.952a14.764 14.764 0 00-8.03 5.25 14.765 14.765 0 00-3.052 9.097v20.691l37.353-.546a6.062 6.062 0 005.974-6.062V71.382a14.766 14.766 0 00-3.053-9.097z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M56.627 90.737c.713-1.868.775-3.91 1.033-5.895.496-3.806 1.737-7.469 2.618-11.205.88-3.736 1.66-7.806.696-11.521a67.96 67.96 0 01-16.416-.026c-2.06.864-3.13 3.464-3.513 5.666-.383 2.201-.103 4.455-.06 6.69.047 2.443-.192 4.889-.077 7.33.116 2.441.618 4.94 1.999 6.957.854 1.247 1.999 2.245 3.243 3.117l10.022-.146c.176-.313.33-.637.455-.966z"
                                        ></Path>
                                        <Path
                                            fill="#EEE"
                                            d="M41.045 69.704c.383-2.201 1.453-4.801 3.513-5.666 5.444.672 10.97.68 16.416.026.235.903.364 1.828.416 2.763.079-1.598-.02-3.185-.416-4.711a67.977 67.977 0 01-16.416-.026c-2.06.864-3.13 3.464-3.513 5.666-.21 1.208-.218 2.432-.178 3.66.026-.573.08-1.144.178-1.712zM40.986 76.393c-.002-.076-.006-.153-.007-.229-.036 1.677-.132 3.353-.089 5.028.035-1.6.126-3.2.096-4.799z"
                                        ></Path>
                                        <Path
                                            fill="#A57951"
                                            d="M48.152 52.514a17.812 17.812 0 008.59-2.425 25.77 25.77 0 01-.036-1.227l-3.849.041-.676.007-3.848.042c.022 1.19-.04 2.38-.18 3.562z"
                                        ></Path>
                                        <Path
                                            fill="#FFC985"
                                            d="M44.492 38.175c-.344-.624-.76-1.246-1.382-1.595-.621-.35-1.496-.339-1.965.199-.381.435-.4 1.074-.36 1.652.084 1.168.354 2.366 1.069 3.294.715.928 1.954 1.52 3.083 1.21.145-1.594.329-3.36-.445-4.76z"
                                        ></Path>
                                        <Path
                                            fill="#E8AB71"
                                            d="M44.429 39.418l.121.018c-.161-.383-.323-.77-.55-1.119-.227-.35-.523-.664-.895-.85-.372-.187-.827-.232-1.207-.061-.38.17-.659.578-.62.993.222-.267.629-.351.97-.285.34.067.636.33.742.66-.297.038-.51.34-.569.633-.058.293.022.597.142.871.07.16.154.316.278.438a.652.652 0 00.466.201c-.154.21-.418.379-.678.394.564.268 1.293.222 1.805-.137.07-.585.052-1.17-.005-1.756z"
                                        ></Path>
                                        <Path
                                            fill="#FFC985"
                                            d="M59.802 38.622c.33-.632.733-1.263 1.347-1.625.614-.363 1.489-.371 1.97.156.39.428.423 1.066.394 1.644-.059 1.17-.303 2.373-.998 3.317-.694.943-1.92 1.562-3.056 1.275-.179-1.59-.4-3.35.343-4.767z"
                                        ></Path>
                                        <Path
                                            fill="#E8AB71"
                                            d="M59.892 39.863l-.122.02c.154-.387.308-.777.527-1.13.219-.355.508-.675.876-.87.369-.194.822-.25 1.206-.087.383.163.67.564.64.98-.227-.263-.636-.338-.975-.264a.995.995 0 00-.727.676c.297.031.517.328.582.62.064.292-.01.598-.123.875-.066.16-.148.318-.27.443a.651.651 0 01-.46.211c.157.207.425.37.686.38-.558.28-1.289.249-1.807-.099a8.062 8.062 0 01-.033-1.755z"
                                        ></Path>
                                        <Path
                                            fill="#009ACB"
                                            d="M46.117 39.356a2.41 2.41 0 11-4.82.053 2.41 2.41 0 014.82-.053zM63.175 39.173a2.41 2.41 0 11-4.819.052 2.41 2.41 0 014.82-.052z"
                                        ></Path>
                                        <Path
                                            fill="#FFC985"
                                            d="M60.772 39.72c.068 6.345-3.702 11.53-8.42 11.581-4.72.051-8.6-5.052-8.668-11.398-.069-6.346-.124-11.49 8.42-11.582 8.544-.091 8.6 5.053 8.668 11.398z"
                                        ></Path>
                                        <Path
                                            fill="#7F4300"
                                            d="M44.147 35.583c-.268-.12.188-.588.88-.782 1.836-.517 3.871-.75 5.414.371.063.317-.339.698-.658.74-.32.043-.635-.084-.94-.19-1.486-.518-3.17-.523-4.696-.139zM60.138 35.411c.265-.126-.2-.584-.897-.764-1.846-.477-3.886-.666-5.404.488-.057.318.353.69.673.726.321.035.633-.098.936-.21 1.474-.55 3.159-.592 4.692-.24z"
                                        ></Path>
                                        <Path
                                            fill="#FFAE6A"
                                            d="M49.85 42.625c.003.332-1.05.612-2.353.626-1.303.014-2.362-.243-2.366-.575-.003-.332 1.05-.612 2.353-.626 1.303-.014 2.362.243 2.366.575zM59.253 42.523c.003.332-1.05.612-2.353.627-1.303.014-2.363-.244-2.366-.576-.004-.331 1.05-.612 2.353-.626 1.303-.014 2.362.244 2.366.575z"
                                        ></Path>
                                        <Path
                                            stroke="#EAAB6A"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="0.5"
                                            d="M51.977 37.331a6.336 6.336 0 01-1.013 4.493c-.186.274-.404.563-.39.894.018.374.347.678.708.778.36.101.745.04 1.111-.04"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M47.538 41.661a3.81 3.81 0 01-3.847-3.765 3.81 3.81 0 013.765-3.847 3.81 3.81 0 013.847 3.765 3.81 3.81 0 01-3.765 3.847zm-.075-6.992a3.19 3.19 0 00-3.152 3.22 3.19 3.19 0 003.22 3.152 3.19 3.19 0 003.153-3.22 3.19 3.19 0 00-3.221-3.152zM57.09 41.559a3.81 3.81 0 01-3.847-3.765 3.81 3.81 0 013.765-3.848 3.81 3.81 0 013.847 3.766 3.81 3.81 0 01-3.765 3.847zm-.075-6.993a3.19 3.19 0 00-3.153 3.22 3.19 3.19 0 003.222 3.153 3.19 3.19 0 003.152-3.22 3.19 3.19 0 00-3.22-3.153z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M51.175 38.069l-.364-.502c.503-.364 1.759-.839 2.92-.03l-.355.508c-1.093-.762-2.19.015-2.2.024z"
                                        ></Path>
                                        <Path
                                            stroke="#EAAB6A"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="0.5"
                                            d="M49.832 45.105c1.62.92 3.767.817 5.29-.255"
                                        ></Path>
                                        <Path
                                            stroke="#EAAB6A"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M51.529 46.959a3.3 3.3 0 001.596.11"
                                        ></Path>
                                        <Path
                                            fill="#7F4300"
                                            d="M40.543 40.54a17.997 17.997 0 006.222-8.509c2.045 1.865 4.945 2.848 7.708 2.7-.547-.239-.956-.724-1.29-1.219 2.676.603 4.989 2.198 6.77 4.285.724.848 1.34 1.793 2.155 2.552.817.758 1.902 1.329 3.009 1.198-.723-2.932-1.428-5.962-2.565-8.76-.698-1.716-1.519-3.464-2.95-4.642-1.781-1.465-4.25-1.815-6.548-1.622-2.452.207-4.861.974-6.951 2.272a15 15 0 00-6.167 7.667c-.247.696-.443 1.427-.403 2.165.041.738.412 1.478 1.01 1.912z"
                                        ></Path>
                                        <Path
                                            fill="#FFEF21"
                                            d="M43.728 42.389a.778.778 0 11-1.556.017.778.778 0 011.556-.017zM62.354 42.189a.778.778 0 11-1.556.016.778.778 0 011.556-.016z"
                                        ></Path>
                                        <Path
                                            fill="#4F4519"
                                            d="M47.665 36.716c-.276.003-.514.232-.648.572l.661.648-.647.662c.142.338.385.562.66.559.43-.005.772-.555.765-1.23-.007-.673-.361-1.216-.79-1.211zM56.754 36.618c-.276.003-.514.232-.648.573l.661.647-.647.662c.142.338.385.562.66.559.43-.005.773-.555.765-1.229-.007-.674-.36-1.217-.79-1.212z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M42.174 35.215c-.183-1.245-.051-2.55.335-3.789a9.353 9.353 0 011.949-3.389 9.538 9.538 0 013.206-2.347 9.868 9.868 0 013.913-.864 9.86 9.86 0 013.93.778 9.536 9.536 0 013.257 2.278 9.353 9.353 0 012.022 3.347c.412 1.231.572 2.533.414 3.782-.348-2.488-1.53-4.712-3.281-6.265-1.754-1.55-4.032-2.4-6.326-2.372-2.294.019-4.554.919-6.275 2.505-1.718 1.591-2.852 3.841-3.144 6.336z"
                                        ></Path>
                                        <Path
                                            fill="#00A5D4"
                                            d="M63.12 57.036c-1.203-.3-2.444-.451-3.646-.748a283.123 283.123 0 00-5.355 35.447l14.11-.207a6.062 6.062 0 005.974-6.062V71.383a14.764 14.764 0 00-3.052-9.096 14.764 14.764 0 00-8.03-5.25zM45.873 56.22c-1.286.344-2.621.492-3.914.815a14.765 14.765 0 00-8.03 5.25 14.765 14.765 0 00-3.053 9.097v20.692l20.37-.298a283.041 283.041 0 00-5.373-35.556z"
                                        ></Path>
                                        <Path
                                            fill="#00A5D4"
                                            d="M41.959 57.036c-.44.11-.872.243-1.298.394a145.224 145.224 0 00-2.691 8.44c1.54.89 3.027 1.995 4.703 2.698-.605 1.474-1.251 3.107-1.856 4.58 3.084 5.925 5.733 12.383 7.892 18.66l2.537-.031a236.852 236.852 0 00-6.461-35.306c-.941.19-1.895.332-2.826.565zM64.56 73.149c-.592-1.474-1.224-3.106-1.815-4.58 1.638-.704 3.093-1.81 4.599-2.698a147.885 147.885 0 00-2.588-8.317 14.438 14.438 0 00-1.636-.518c-.888-.222-1.796-.363-2.694-.54a241.727 241.727 0 00-6.307 35.239l2.761-.04c2.105-6.24 4.682-12.658 7.68-18.546z"
                                        ></Path>
                                        <Path
                                            fill="#00B1E4"
                                            d="M45.873 56.22c-1.045.28-2.122.431-3.183.651a169.128 169.128 0 00-2.376 8.999c1.268.888 2.493 1.995 3.873 2.697-.498 1.475-1.03 3.107-1.528 4.581 2.539 5.924 4.72 12.383 6.498 18.659l2.089-.031a283.047 283.047 0 00-5.373-35.556zM62.916 56.99c-1.14-.269-2.307-.422-3.442-.702a283.055 283.055 0 00-5.355 35.446l2.323-.034c1.773-6.242 3.945-12.66 6.469-18.551-.498-1.475-1.03-3.107-1.528-4.581 1.38-.703 2.604-1.809 3.872-2.697-.698-2.981-1.48-5.942-2.34-8.88z"
                                        ></Path>
                                        <Path
                                            fill="#FFEF21"
                                            d="M46.602 56.367a.47.47 0 01-.387-.207.401.401 0 01-.04-.08.464.464 0 01-.038-.178.467.467 0 01.078-.26.485.485 0 01.477-.198c.03.006.059.016.087.028a.35.35 0 01.08.043c.028.016.05.038.071.056.022.022.04.047.06.072a.632.632 0 01.043.08.467.467 0 01-.102.508.304.304 0 01-.072.056.332.332 0 01-.08.043.41.41 0 01-.177.037z"
                                        ></Path>
                                        <Path
                                            fill="#FFEF21"
                                            d="M51.998 59.037a.463.463 0 01-.443-.416.467.467 0 01-.502.341h-.003a.465.465 0 01-.409-.446.466.466 0 01-.904-.176.463.463 0 01-.558.254.46.46 0 01-.322-.527.467.467 0 01-.598.174.467.467 0 01-.232-.583.468.468 0 01-.629.053.466.466 0 01-.099-.626.466.466 0 01-.542-.755.467.467 0 01.65.086h.004a.47.47 0 01.015.542.472.472 0 01.545.019.467.467 0 01.15.53.462.462 0 01.541-.103c.195.093.294.3.257.502a.463.463 0 01.858.266.469.469 0 01.511-.266c.22.04.372.23.378.443a.464.464 0 01.902.103.465.465 0 01.904.033.47.47 0 01.437-.38c.22-.01.409.136.467.337a.464.464 0 01.896-.13.465.465 0 01.873-.223.466.466 0 01.842-.325.464.464 0 01.793-.422.463.463 0 01.731-.523.464.464 0 11.112.133.465.465 0 01-.753.536.462.462 0 01-.811.434.467.467 0 01-.285.545.468.468 0 01-.577-.214.466.466 0 01-.346.505.462.462 0 01-.545-.28.47.47 0 01-.4.466.463.463 0 01-.514-.335.464.464 0 01-.92.046.462.462 0 01-.455.382h-.019z"
                                        ></Path>
                                        <Path
                                            fill="#FFEF21"
                                            d="M58.533 56.376a.47.47 0 01-.464-.465c0-.12.05-.241.136-.328a.479.479 0 01.657 0 .47.47 0 01.136.328.469.469 0 01-.465.465z"
                                        ></Path>
                                        <Path
                                            fill="#006B8D"
                                            d="M49.519 47.632h-.015c-.88-.042-1.791-.086-2.679-.282-1.017-.226-1.853-.627-2.483-1.191-.984-.881-1.41-2.111-1.595-2.989-.231-1.101-.227-2.231-.222-3.324 0-.141.127-.254.256-.254.141 0 .255.115.254.256-.004 1.066-.008 2.168.212 3.217.168.803.554 1.925 1.435 2.714.564.505 1.323.866 2.254 1.073.844.187 1.733.23 2.592.27a.255.255 0 01-.009.51z"
                                        ></Path>
                                        <Path
                                            fill="#006B8D"
                                            d="M50.262 47.35c.004.381-.423.695-.953.701-.53.006-.964-.299-.968-.68-.004-.383.422-.697.953-.703.53-.005.964.3.968.681z"
                                        ></Path>
                                        <Path
                                            fill="#00A5D4"
                                            d="M34.584 61.974c-2.718 3.13-4.489 6.989-5.655 10.965-1.166 3.978-1.756 8.098-2.342 12.2-.17 1.18-.334 2.409.026 3.545.739 2.33 3.424 3.472 5.863 3.616 2.44.145 4.897-.403 7.32-.091 1.208-10.183-.173-21.304-5.212-30.235z"
                                        ></Path>
                                        <Path
                                            fill="#FFC985"
                                            d="M44.25 86.573c1.75-.622 3.513-1.247 5.347-1.54 1.834-.293 3.765-.238 5.482.47 1.717.709 3.193 2.134 3.676 3.927.154.572-.95.79-1.509.985-.558.195-1.163.198-1.755.2l-5.917.007c-1.408.002-2.92.435-4.14-.267-.611-.352-.999-1.008-1.178-1.69-.18-.681-.01-1.387-.006-2.092z"
                                        ></Path>
                                        <Path
                                            fill="#00A5D4"
                                            d="M31.864 84.252c5.12-.584 10.272-.886 15.426-.903.607 2.384 1.389 4.985 1.318 7.444a25.052 25.052 0 01-12.548.84c-2.87-.535-4.066-4.464-4.196-7.38z"
                                        ></Path>
                                        <Path
                                            fill="#00A5D4"
                                            d="M44.446 83.46c-1.835-.834-3.97-1.27-5.983-1.363.155-2.953.055-5.92-.3-8.857.886 2.33 1.566 4.735 1.677 7.225 1.775.534 3.55 1.47 4.605 2.995z"
                                        ></Path>
                                        <Path
                                            fill="#DFE9FF"
                                            d="M94.232 90.306H35.47v.486c0 .654.53 1.184 1.184 1.184h56.394c.653 0 1.184-.53 1.184-1.184v-.486z"
                                        ></Path>
                                        <Path
                                            fill="#D0DBEF"
                                            d="M94.232 90.306H35.47v.486c0 .654.53 1.184 1.184 1.184h56.394c.653 0 1.184-.53 1.184-1.184v-.486z"
                                        ></Path>
                                        <Path
                                            fill="#D0DBEF"
                                            d="M55.941 90.791v-.486H35.47v.486c0 .654.53 1.184 1.184 1.184h18.103c.654 0 1.184-.53 1.184-1.184z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M94.232 90.306h-38.29l8.538-23.459c.317-.873 1.283-1.581 2.157-1.581h35.127c.873 0 1.324.707 1.006 1.581l-8.538 23.459z"
                                        ></Path>
                                        <Path
                                            fill="#C6CFE3"
                                            d="M82.103 77.785c-.495 1.359-1.997 2.46-3.355 2.46-1.358 0-2.058-1.101-1.564-2.46.494-1.358 1.996-2.459 3.355-2.459 1.358 0 2.058 1.101 1.564 2.46z"
                                        ></Path>
                                        <Path
                                            fill="#D0DBEF"
                                            d="M51.838 91.449h-1.329a.304.304 0 110-.607h1.329a.303.303 0 110 .607zM49.142 91.449h-1.329a.304.304 0 110-.607h1.33a.303.303 0 110 .607zM46.447 91.449h-1.33a.304.304 0 110-.607h1.33a.303.303 0 110 .607z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M18.156 53.94c.192.066.385.118.579.16l.075.928c.295.053.592.082.886.092l.263-.896a5.412 5.412 0 001.188-.146l.47.806a6.32 6.32 0 00.84-.303l-.151-.915a5.466 5.466 0 001.006-.65l.774.52c.222-.196.43-.408.625-.636l-.536-.763c.243-.312.456-.65.63-1.02l.919.134c.057-.136.111-.274.16-.416.048-.143.089-.285.127-.429l-.811-.453c.087-.398.124-.797.12-1.192l.89-.28a6.235 6.235 0 00-.108-.885l-.931-.057a5.456 5.456 0 00-.402-1.129l.677-.634a6.321 6.321 0 00-.482-.751l-.864.353a5.409 5.409 0 00-.853-.839l.337-.871a6.25 6.25 0 00-.76-.467l-.623.69a5.457 5.457 0 00-.557-.225 5.458 5.458 0 00-.58-.16l-.074-.928a6.233 6.233 0 00-.886-.091l-.263.896a5.423 5.423 0 00-1.188.145l-.47-.805a6.353 6.353 0 00-.84.303l.15.915a5.448 5.448 0 00-1.005.65l-.774-.52a6.262 6.262 0 00-.625.636l.536.763c-.243.311-.456.65-.63 1.02l-.919-.135a6.29 6.29 0 00-.16.417 6.31 6.31 0 00-.127.428l.811.454a5.387 5.387 0 00-.12 1.191l-.89.28c.015.299.051.595.108.885l.93.057c.095.39.227.77.403 1.13l-.677.634c.143.26.304.512.482.75l.863-.352c.251.308.537.59.854.839l-.337.87c.24.172.493.329.76.468l.623-.69c.18.083.365.16.557.225zm-1.89-6.37a3.838 3.838 0 117.268 2.467 3.838 3.838 0 01-7.268-2.467z"
                                        ></Path>
                                        <G fill="#BCD7FF" opacity="0.112">
                                            <Path d="M1.217 56.975a.608.608 0 11-1.217 0 .608.608 0 011.217 0zM8.858 26.12a.376.376 0 11-.751 0 .376.376 0 01.751 0zM84.648 10.405a.949.949 0 11-1.898 0 .949.949 0 011.898 0zM94.231 12.838a.617.617 0 11-1.233 0 .617.617 0 011.233 0zM110.089 40.95a1.048 1.048 0 11-2.096 0 1.048 1.048 0 012.096 0zM107.992 50.11a.782.782 0 11-1.565.001.782.782 0 011.565 0zM107.711 87.122a.998.998 0 11-1.997 0 .998.998 0 011.997 0z"></Path>
                                        </G>
                                        <G fill="#BCD7FF" opacity="0.092">
                                            <Path d="M116.343 33.605c.14.992.919 1.77 1.91 1.911-.991.14-1.77.92-1.91 1.91a2.247 2.247 0 00-1.911-1.91 2.247 2.247 0 001.911-1.91zM117.396 73.662c.14.991.919 1.77 1.91 1.91-.991.14-1.77.92-1.91 1.911a2.25 2.25 0 00-1.911-1.91 2.25 2.25 0 001.911-1.91zM64.906 2.596a1.82 1.82 0 001.547 1.546 1.82 1.82 0 00-1.547 1.547 1.82 1.82 0 00-1.547-1.547 1.82 1.82 0 001.547-1.546z"></Path>
                                        </G>
                                        <Path
                                            fill="#fff"
                                            d="M85.13 43.445h-9.839a2.888 2.888 0 00-2.887 2.888v4.703a2.887 2.887 0 002.887 2.887h.33l-.668.946c-.22.31.105.712.454.564l3.138-1.33c.28-.118.581-.18.886-.18h5.7a2.887 2.887 0 002.887-2.887v-4.703a2.888 2.888 0 00-2.887-2.888z"
                                        ></Path>
                                        <Path
                                            fill="#EEE"
                                            d="M86.039 46.954H74.383a.501.501 0 010-1.002H86.04a.5.5 0 110 1.002zM86.039 49.184H74.383a.501.501 0 010-1.001H86.04a.5.5 0 110 1.001zM80.936 51.416h-6.553a.5.5 0 010-1.002h6.553a.5.5 0 010 1.002z"
                                        ></Path>
                                        <Path
                                            fill="#7391FF"
                                            d="M100.676 39.896h-9.367a5.752 5.752 0 01-5.752-5.752v-9.367a5.752 5.752 0 015.752-5.752h9.367a5.752 5.752 0 015.752 5.752v9.367a5.752 5.752 0 01-5.752 5.752z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M90.457 34.78c-2.69-3.05-2.397-7.722.655-10.412 3.05-2.69 7.722-2.397 10.412.654a.589.589 0 01-.883.779 6.207 6.207 0 00-8.75-.55 6.206 6.206 0 00-.55 8.75 6.206 6.206 0 008.75.55 6.207 6.207 0 001.957-5.974.59.59 0 011.151-.25 7.388 7.388 0 01-2.329 7.107c-3.051 2.69-7.722 2.398-10.413-.654z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M97.468 26.038a.589.589 0 01.396-.976l2.58-.2-.2-2.58a.59.59 0 011.175-.09l.245 3.167a.587.587 0 01-.542.632l-3.167.245a.588.588 0 01-.487-.198zM92.723 29.308c0-.242-.105-.363-.315-.363-.118 0-.204.04-.259.123-.055.083-.085.212-.091.386h-.741c.018-.381.133-.668.346-.86.213-.193.482-.288.807-.288.34 0 .597.086.77.257.173.172.26.395.26.67 0 .304-.117.602-.351.893a3.267 3.267 0 01-.838.739h1.237v.612h-2.235v-.567c.94-.672 1.41-1.206 1.41-1.602zM93.867 30.936v-.634l1.433-1.965h.816v1.938h.377v.661h-.377v.577h-.767v-.577h-1.482zm1.544-1.721l-.772 1.06h.772v-1.06zM98.49 27.299l-1.194 5.048h-.732l1.194-5.048h.732zM100.562 28.91l-1.123 2.604h-.785l1.136-2.515h-1.331v-.652h2.103v.563z"
                                        ></Path>
                                        <Path
                                            fill="#7391FF"
                                            d="M29.393 34.984H14.399a4.831 4.831 0 01-4.83-4.831v-7.868a4.831 4.831 0 014.83-4.83h14.994a4.831 4.831 0 014.831 4.83v7.868a4.831 4.831 0 01-4.831 4.83z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M16.752 23.087a2.053 2.053 0 11-4.107 0 2.053 2.053 0 014.107 0zM29.329 22.297H18.94a.632.632 0 110-1.263H29.33a.632.632 0 010 1.263zM29.329 25.168H18.94a.632.632 0 110-1.263H29.33a.631.631 0 110 1.263zM16.752 29.322a2.053 2.053 0 11-4.107 0 2.053 2.053 0 014.107 0zM29.329 28.532H18.94a.632.632 0 110-1.263H29.33a.631.631 0 110 1.263zM29.329 31.403H18.94a.632.632 0 110-1.263H29.33a.632.632 0 010 1.263z"
                                        ></Path>
                                        <Path
                                            fill="#7391FF"
                                            d="M17.887 73.073h-7.333a4.503 4.503 0 01-4.503-4.502v-7.333a4.503 4.503 0 014.503-4.503h7.333a4.503 4.503 0 014.503 4.503v7.333a4.503 4.503 0 01-4.503 4.502z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M16.54 61.172c.501.434.752 1.056.752 1.867 0 .756-.245 1.35-.734 1.779-.49.43-1.144.652-1.963.668v1.062h-1.922v-2.375h.8c.573 0 1.018-.081 1.336-.244.319-.163.478-.456.478-.878 0-.27-.076-.48-.227-.632-.151-.151-.354-.227-.609-.227-.286 0-.51.086-.674.257a.905.905 0 00-.244.65H11.61a2.469 2.469 0 01.305-1.307c.218-.393.55-.703.996-.93.445-.227.982-.34 1.611-.34.844 0 1.516.216 2.017.65zm-1.838 8.395h-2.124v-2.04h2.124v2.04z"
                                        ></Path>
                                        <Path
                                            fill="#7391FF"
                                            d="M58.682 15.215h-9.367a5.752 5.752 0 01-5.752-5.752V5.752A5.752 5.752 0 0149.315 0h9.367a5.752 5.752 0 015.752 5.752v3.71a5.752 5.752 0 01-5.752 5.753z"
                                        ></Path>
                                        <Path
                                            fill="#fff"
                                            d="M59.745 7.607a1.527 1.527 0 11-3.053 0 1.527 1.527 0 013.053 0zM55.526 7.607a1.527 1.527 0 11-3.054 0 1.527 1.527 0 013.054 0zM51.306 7.607a1.527 1.527 0 11-3.053 0 1.527 1.527 0 013.053 0z"
                                        ></Path>
                                    </Svg>
                                </View>

                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#374761',
                                            textAlign: 'right',
                                            fontSize: 15,
                                            paddingHorizontal: 10,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            marginVertical: 10
                                        }}
                                    >
                                        {locales('titles.hello')}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#374761',
                                            textAlign: 'right',
                                            fontSize: 22,
                                            paddingHorizontal: 10,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        }}
                                    >
                                        {locales('titles.imDelsa')} <Text
                                            style={{
                                                color: '#374761',
                                                fontSize: 15,
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                marginVertical: 15,
                                                fontWeight: '200'
                                            }}
                                        >
                                            ({locales('titles.BuskoolBot')})
                                        </Text>
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#374761',
                                            fontSize: 14,
                                            paddingHorizontal: 10,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            marginVertical: 5
                                        }}
                                    >
                                        {locales('titles.DelsaPromotionModalText')}
                                    </Text>

                                    <LinearGradient
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0.8, y: 0.2 }}
                                        style={{
                                            width: '70%',
                                            borderRadius: 8,
                                            alignSelf: 'center',
                                            padding: 10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: 20,
                                            height: 50,
                                        }}
                                        colors={['#FF9727', '#FF6701']}
                                    >
                                        <Pressable
                                            android_ripple={{
                                                color: '#ededed'
                                            }}
                                            onPress={() => {
                                                this.handlePromotionModalVisiblity(false)
                                                this.props.navigation.navigate('PromoteRegistration')
                                            }}
                                        >
                                            <Text style={[styles.buttonText, {
                                                alignSelf: 'center',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 20,
                                            }]}>{locales('labels.promoteRegistration')}
                                            </Text>
                                        </Pressable>
                                    </LinearGradient>
                                </View>
                            </Dialog>
                        </Modal>
                        : null
                    }

                    {shouldShowEditPriceModal ?
                        <Modal
                            onRequestClose={_ => this.setState({ shouldShowEditPriceModal: false })}
                            visible={shouldShowEditPriceModal}
                            transparent={true}
                            animationType="fade"
                        >
                            <Dialog
                                onDismiss={_ => this.setState({ shouldShowEditPriceModal: false })}
                                visible={shouldShowEditPriceModal}
                                style={{ ...styles.dialogWrapper }}
                            >

                                <Dialog.Actions
                                    style={styles.dialogHeader}
                                >
                                    <Button
                                        onPress={_ => this.setState({ shouldShowEditPriceModal: false })}
                                        style={styles.closeDialogModal}>
                                        <FontAwesome5 name="times" color="#777" solid size={18} />
                                    </Button>
                                    <Paragraph style={styles.headerTextDialogModal}>
                                        {locales('labels.editPrice')}
                                    </Paragraph>
                                </Dialog.Actions>

                                {!shouldShowEditionSuccessfullText ?
                                    <>
                                        <View
                                            style={{
                                                backgroundColor: '#E7F9FF',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                marginTop: 20
                                            }}
                                        >
                                            <FontAwesome5
                                                onPress={_ => this.setState({ shouldShowEditPriceModal: false })}
                                                solid
                                                size={20}
                                                color='#808C9B'
                                                name='times'
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 0,
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 15
                                                }}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                paddingHorizontal: 10,
                                            }}
                                        >
                                            <InputGroup
                                                regular
                                                style={{
                                                    borderRadius: 4,
                                                    borderColor: productMinSalePrice ? productMinSalePriceError ? '#E41C38' : '#00C569' :
                                                        productMinSalePriceClicked ? '#E41C38' : '#666',
                                                    paddingHorizontal: 10,
                                                    backgroundColor: '#FBFBFB'
                                                }}
                                            >
                                                <FontAwesome5 name={
                                                    productMinSalePrice ? productMinSalePriceError ?
                                                        'times-circle' : 'check-circle' : productMinSalePriceClicked
                                                        ? 'times-circle' : 'edit'}
                                                    color={productMinSalePrice ? productMinSalePriceError ? '#E41C38' : '#00C569'
                                                        : productMinSalePriceClicked ? '#E41C38' : '#BDC4CC'}
                                                    size={16}
                                                    solid
                                                    style={{
                                                        marginLeft: 10
                                                    }}
                                                />
                                                <Input
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    keyboardType='number-pad'
                                                    autoCompleteType='off'
                                                    style={{
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                        fontSize: 14,
                                                        height: 45,
                                                        flexDirection: 'row',
                                                        borderRadius: 4,
                                                        textDecorationLine: 'none',
                                                        direction: 'rtl',
                                                        textAlign: 'right'
                                                    }}
                                                    onChangeText={this.onProductMinSalePriceChanged}
                                                    value={productMinSalePrice}
                                                    placeholderTextColor="#BEBEBE"
                                                    placeholder={locales('titles.enterMinPrice')}

                                                />
                                            </InputGroup>
                                            <Label style={{
                                                fontSize: 14, color: '#D81A1A', height: 25,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}>
                                                {!!productMinSalePriceError ? productMinSalePriceError : null}
                                            </Label>

                                            <Button
                                                onPress={this.editProductMinSalePrice}
                                                style={!productMinSalePrice || productMinSalePriceError
                                                    ? styles.disableLoginButton : styles.loginButton}
                                            >
                                                <Text style={[styles.buttonText, {
                                                    alignSelf: 'center',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    fontSize: 20,
                                                }]}>{locales('titles.submitChanges')}
                                                </Text>
                                                {editProductLoading ?
                                                    <ActivityIndicator
                                                        size={20}
                                                        color='white'
                                                        animating={editProductLoading}
                                                        style={{
                                                            position: 'absolute',
                                                            left: '5%'
                                                        }}
                                                    />
                                                    : null
                                                }
                                            </Button>
                                        </View>
                                    </>
                                    :
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '22%',
                                            paddingVertical: 20
                                        }}
                                    >
                                        <FontAwesome5
                                            name="check-circle"
                                            color="#00C569"
                                            size={70}
                                            style={{
                                                marginVertical: 20
                                            }}
                                        />
                                        <Text style={styles.mainTextDialogModal}>
                                            {locales('titles.editionsDone')}
                                        </Text>
                                    </View>
                                }
                            </Dialog>
                        </Modal>
                        : null
                    }

                    {showScrollToBottomButton ?
                        <FontAwesome5
                            name='angle-double-down'
                            color='#333333'
                            size={14}
                            solid
                            onPress={_ => this.scrollToTop()}
                            style={{
                                backgroundColor: '#FFFFFF',
                                padding: 10,
                                width: 37,
                                height: 37,
                                borderRadius: 18.5,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                position: 'absolute',
                                bottom: 70,
                                right: 10
                            }}
                        />
                        : null}

                    {showViolationReportFlag ? <ViolationReport
                        {...this.props}
                        contactId={id}
                        visible={showViolationReportFlag}
                        onRequestToClose={this.closeViolationModal}
                    /> : null}

                    {detectToShowCommentAndGuid ? <TouchableOpacity
                        onPress={_ => this.setState({ showGuid: false })}
                        activeOpacity={1}
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            width: deviceWidth,
                            height: deviceHeight,
                            position: 'absolute',
                            flex: 1,
                            zIndex: 1,
                            padding: 20,
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: 'rgba(255,255,255,0.78)',
                                top: -30,
                                left: -25,
                                zIndex: 10,
                                borderWidth: 0.8,
                                borderColor: '#313A43'
                            }}
                        >
                            <Text
                                style={{
                                    color: '#21AD93',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 14,
                                    top: 26,
                                    right: 8,
                                    marginHorizontal: 10
                                }}
                            >
                                {locales('labels.usersComment')}
                            </Text>
                            {/* <FontAwesome5
                            style={{
                                marginTop: 5,
                                top: 5,
                                right: -10,
                            }}
                            size={13}
                            name='arrow-left'
                            color='#21AD93'
                        /> */}
                        </View>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="122.37"
                            height="122.37"
                            viewBox="0 0 122.37 122.37"
                            style={{ left: -165 }}
                        >
                            <Defs>
                                <Pattern
                                    id="pattern"
                                    width="1"
                                    height="1"
                                    patternTransform="matrix(1 0 0 -1 0 196)"
                                    viewBox="-0.674 -0.587 98 98"
                                >
                                    <SvgImage
                                        width="98"
                                        height="98"
                                        preserveAspectRatio="none"
                                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDItMDZUMTA6Mzg6MTArMDM6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAyLTA2VDEwOjM4OjQzKzAzOjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAyLTA2VDEwOjM4OjQzKzAzOjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjllZGU0Nzg2LTY2Y2Yt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"
                                    ></SvgImage>
                                </Pattern>
                            </Defs>
                            <Path
                                fill="url(#pattern)"
                                d="M0 0H98V98H0z"
                                transform="rotate(-107 59.6 50.584)"
                            ></Path>
                        </Svg>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 20,
                                textAlign: 'center',
                                color: 'white',
                                textAlignVertical: 'center'
                            }}
                        >
                            {locales('titles.commentsGuidDescription')}
                        </Text>
                    </TouchableOpacity> : null}

                    <ShadowView
                        style={{
                            backgroundColor: 'white',
                            flexDirection: 'row-reverse',
                            alignContent: 'center',
                            alignItems: 'center',
                            height: 53,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: detectToShowCommentAndGuid ? 0 : 5,
                            shadowOffset: { width: 0, height: 2 },
                            width: deviceWidth
                        }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row-reverse',
                                width: '21%'
                            }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'flex-end', paddingHorizontal: 5
                                }}
                            >
                                <AntDesign
                                    name='arrowright'
                                    size={25}
                                />
                            </View>
                            <Image
                                style={{
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40
                                }}
                                source={profile_photo || contact.profile_photo ?
                                    { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo || contact.profile_photo}` }
                                    : require('../../../assets/icons/user.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={(shouldHideGuidAndComment || buyAdId) ? 1 : 0}
                            onPress={() => {
                                if (!buyAdId && !shouldHideGuidAndComment) {
                                    this.props.navigation.navigate('Profile', { user_name });
                                }
                            }}
                            style={{
                                paddingHorizontal: 5,
                                width: '55%',
                                alignItems: 'flex-end',
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        maxWidth: '58%',
                                        top: -2
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 17,
                                            marginLeft: 2,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light'
                                        }}
                                    >
                                        {`${firstName} ${lastName}`}
                                    </Text>
                                    {is_verified ? <ValidatedUserIcon  {...this.props} /> : null}
                                </View>
                                {!showGuid && !buyAdId && !shouldHideGuidAndComment ? <Text
                                    style={{
                                        textAlign: 'right',
                                        color: '#21AD93',
                                        marginRight: 24,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                    }}
                                >
                                    {locales('labels.usersComment')}
                                </Text>

                                    : null}
                            </View>
                        </TouchableOpacity>

                        {showReportText === true ?
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '24%'
                                }}
                                onPress={_ => this.setState({ showViolationReportFlag: true })}
                            >
                                <FontAwesome5
                                    size={13}
                                    name='exclamation-circle'
                                    color='#BBBBBB'
                                    style={{
                                        marginTop: 5,
                                        marginHorizontal: 3
                                    }}
                                />
                                <Text
                                    style={{
                                        color: '#BBBBBB',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 13,
                                    }}
                                >
                                    {locales('titles.reportViolation')}
                                </Text>
                            </TouchableOpacity>
                            : null}
                    </ShadowView>

                    {(isFirstLoad && userChatHistoryLoading && !this.state.loaded) ?
                        <ShadowView
                            style={{
                                position: 'absolute', left: '44%', top: '40%',
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                shadowRadius: detectToShowCommentAndGuid ? 0 : 5,
                                shadowOffset: { width: 0, height: 2 },
                                borderColor: 'black',
                                backgroundColor: 'white',
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }}
                        >
                            <ActivityIndicator
                                size="large"
                                color="#00C569"
                                style={{ top: 7 }}
                            />
                        </ShadowView>
                        : null}
                    {wallet_balance == 0 && is_seller && active_pakage_type == 0 && shouldShowPhoneNumberBanner ?
                        <PayForPhoneNumberBanner
                            {...this.props}
                            setPhoneNumberBannerVisibility={this.setPhoneNumberBannerVisibility}
                        />
                        :
                        null
                    }
                    <FlatList
                        keyboardShouldPersistTaps='handled'
                        keyboardDismissMode='none'
                        ref={this.scrollViewRef}
                        data={userChatHistory}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.8}
                        onScrollToIndexFailed={this.onScrollToIndexFailed}
                        onScroll={this.onScrollChanged}
                        ListFooterComponentStyle={{ padding: 10 }}
                        ListFooterComponent={this.renderListFooterComponent}
                        ListHeaderComponent={this.renderListHeaderComponent}
                        renderItem={this.renderItem}
                        removeClippedSubviews
                        initialNumToRender={3}
                        maxToRenderPerBatch={5}
                        windowSize={10}
                        inverted
                        style={{
                            marginBottom: 60,
                            paddingTop: 2,
                            height: '100%'
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            paddingTop: 3,
                            zIndex: detectToShowCommentAndGuid ? 0 : 1,
                            width: deviceWidth,
                            paddingBottom: 10,
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
                            <MaterialCommunityIcons
                                name='send'
                                size={25}
                                color='white'
                            />
                        </Button>

                        <TextInput
                            value={messageText}
                            onChangeText={this.handleMessageTextChange}
                            style={{
                                textAlign: 'right',
                                backgroundColor: 'white',
                                borderRadius: 20,
                                paddingVertical: 6,
                                width: deviceWidth * 0.8,
                                paddingHorizontal: 20,
                                maxHeight: 100,
                                height: 44,
                                overflow: 'scroll',
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                            }}
                            placeholder={locales('labels.putAMessage')}
                            placeholderTextColor="#BEBEBE"
                            multiline={true}
                        />
                    </View>
                </ImageBackground>

            </View>
        )
    }
}

const PayForPhoneNumberBanner = props => {

    const {
        setPhoneNumberBannerVisibility = _ => { }
    } = props;

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={_ => props.navigation.navigate('PromoteRegistration')}
            style={{
                width: '100%',
                height: 58,
                backgroundColor: '#F03738',
                borderRadius: 50,
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 3,
                marginHorizontal: 60,
                padding: 10
            }}
        >
            <FontAwesome5
                name='times'
                onPress={event => {
                    event.stopPropagation();
                    ; setPhoneNumberBannerVisibility();
                }
                }
                color='white'
                size={20}
                style={{
                    marginHorizontal: 5
                }}
            />
            <Text
                numberOfLines={2}
                style={{
                    fontSize: 12,
                    width: '60%',
                    textAlign: "right",
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    color: 'white'
                }}
            >
                {locales('labels.reasonNotToShowPhoneNumber')}
            </Text>
            <TouchableOpacity
                activeOpacity={1}
                onPress={_ => {
                    analytics().logEvent('click_on_change_wallet_button');
                    props.navigation.navigate('PromoteRegistration');
                }}
                style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    height: 42,
                    width: 99,
                    marginRight: -5,
                    borderRadius: 50

                }}
            >
                <FontAwesome5
                    size={15}
                    name='plus'
                    color='#264653'
                />
                <Text
                    style={{
                        fontSize: 12,
                        textAlign: "center",
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#264653',
                        width: 51,
                    }}
                >
                    {locales('titles.promoteRegistration')}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};

const DelsaAdvertisementComponent = props => {

    const {
        handlePromotionModalVisiblity = _ => { },
        setDelsaAdVisiblity = _ => { }
    } = props;

    return (
        <ShadowView
            style={{
                shadowColor: 'black',
                shadowOpacity: 0.13,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                backgroundColor: '#EDF8E6',
                borderRadius: 8,
                padding: 10,
                marginVertical: 10,
                width: '95%',
                alignSelf: 'center',
            }}>
            <FontAwesome5
                onPress={_ => setDelsaAdVisiblity(false)}
                solid
                size={20}
                color='#808C9B'
                name='times'
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    zIndex: 1
                }}
            />
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    marginVertical: 20
                }}
            >
                {locales('labels.inquireYourOwnSecretary')}
            </Text>
            <Button
                onPress={_ => handlePromotionModalVisiblity(true)}
                style={{
                    elevation: 0,
                    backgroundColor: '#4DC0BB',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row-reverse',
                    alignSelf: 'center',
                    width: '50%',
                    marginVertical: 10,
                }}
            >
                <FontAwesome5
                    name='info-circle'
                    size={16}
                    color='white'
                    style={{
                        marginHorizontal: 8
                    }}
                />
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {locales('titles.moreDetails')}
                </Text>
            </Button>
        </ShadowView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '55%',
        color: 'white',
        elevation: 0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#FF9828',
        borderRadius: 5,
        width: '55%',
        elevation: 0,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        justifyContent: 'center'
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        maxWidth: 145,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd'
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {
        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20
    },
    greenButton: {
        backgroundColor: '#FF9828',
    },
});

const mapStateToProps = ({
    messagesReducer,
    authReducer,
    profileReducer,
    productsListReducer
}) => {

    const {
        productDetailsLoading,
        productDetails,
        editProductLoading
    } = productsListReducer;

    const {
        userChatHistoryData,
        userChatHistoryLoading,
        userChatHistory,

        isSenderVerified,

        contactsList
    } = messagesReducer;

    const {
        loggedInUserId
    } = authReducer;

    const {
        userProfile
    } = profileReducer;

    return {
        userChatHistoryData,
        userChatHistoryLoading,
        userChatHistory,

        isSenderVerified,

        contactsList,

        loggedInUserId,

        userProfile,

        productDetailsLoading,
        productDetails,
        editProductLoading
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        fetchUserChatHistory: (id, from, to) => dispatch(messagesActions.fetchUserChatHistory(id, from, to)),
        sendMessage: (msgObject, buyAdId, productId) => dispatch(messagesActions.sendMessage(msgObject, buyAdId, productId)),
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList()),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id)),
        checkUserAutorityToPostComment: (userId) => dispatch(CommentsAndRatingsActions.checkUserAuthorityToPostComment(userId)),
        fetchProductDetails: id => dispatch(productListActions.fetchProductDetails(id)),
        editProduct: product => dispatch(productListActions.editProduct(product)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);