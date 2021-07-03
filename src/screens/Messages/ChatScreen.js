import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Button,
    Input,
    Label,
    InputGroup
} from 'native-base';
import Svg, { Pattern, Path, Defs, Image as SvgImage } from 'react-native-svg';
import {
    View, Text, TouchableOpacity, Image, TextInput, FlatList,
    ActivityIndicator, ImageBackground, StyleSheet, BackHandler,
    LayoutAnimation, UIManager, Platform, Modal
} from 'react-native';
import { Dialog, Paragraph } from 'react-native-paper';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import ShadowView from '@vikasrg/react-native-simple-shadow-view'
import Axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

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

        this.props.fetchUserChatHistory(contact.contact_id, from, to).then(_ => {
            this.checkForShowingRatingCard();
        });

        this.handleIncomingMessage();

        BackHandler.addEventListener('hardwareBackPress', this.handleGoBack)
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.loaded == false && this.props.userChatHistory.length) {
            this.fetchSenderIds()
            this.setState({ isFirstLoad: false, userChatHistory: [...this.props.userChatHistory], loaded: true });
        }

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleGoBack);
    }

    checkForShowingRatingCard = _ => {

        const {
            route = {},
        } = this.props;
        const { params = {} } = route;

        const { contact = {} } = params;

        const {
            contact_id
        } = contact;

        const {
            userChatHistory = []
        } = this.state;

        this.props.checkUserAutorityToPostComment(contact_id).then((result = {}) => {

            const {
                payload = {}
            } = result;

            const {
                is_allowed
            } = payload;

            if (userChatHistory && userChatHistory.length && userChatHistory.length == 1 && !!userChatHistory[0].p_id)
                return;

            AsyncStorage.getItem('@ratedChats').then(result => {

                result = JSON.parse(result);

                if (!Array.isArray(result) || result == null || result == undefined)
                    result = [];

                const foundTime = result.find(item => item.contact_id == contact_id)?.date;

                const closeButtonPassedTime = !foundTime ? true : moment().diff(foundTime, 'hours') >= 24;

                const conidtions = (is_allowed) &&
                    (closeButtonPassedTime) &&
                    (userChatHistory && userChatHistory.length &&
                        userChatHistory[0] && userChatHistory[0].created_at &&
                        moment().diff(moment(userChatHistory[0].created_at), 'minutes') >= 10
                    );

                this.setState({ shouldShowRatingCard: conidtions });
            });

        });
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

    handleGoBack = fromHeader => {
        this.props.doForceRefresh(true);
        if (fromHeader == true)
            this.props.navigation.goBack();
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
        const text = remoteMessage.notification.body;
        let userChatHistory = [...this.state.userChatHistory];
        const message = {
            sender_id: contact.contact_id,
            receiver_id: this.props.loggedInUserId,
            text,
            is_phone: validator.isMobileNumber(text),
            is_read: 1
        };


        userChatHistory.unshift(message);

        userChatHistory.forEach(item => {
            if (item.is_read == undefined) {
                item.is_read = true;
            }
        });

        this.scrollToTop();

        this.setState({
            userChatHistory,
            shouldShowRatingCard: false
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
                shouldShowRatingCard: false
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
            shouldShowPromotionModal
        });
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
            userChatHistory
        } = this.state;

        return (
            <View
            >
                {(userChatHistory.length && userChatHistory.every(item => item.sender_id != this.props.loggedInUserId) &&
                    !isSenderVerified && showUnAuthorizedUserPopUp) ?
                    <ChatWithUnAuthorizedUserPopUp
                        hideUnAuthorizedUserChatPopUp={this.hideUnAuthorizedUserChatPopUp}
                    />
                    : null}

                {
                    (userChatHistory.length && shouldShowRatingCard)
                        ?
                        <ChatRating
                            firstName={firstName}
                            lastName={lastName}
                            userId={id}
                            closeRatingCard={this.closeRatingCard}
                            {...this.props}
                        />

                        : null
                }
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

    render() {

        let {
            userChatHistoryLoading,
            route = {},
            editProductLoading
        } = this.props;

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
            shouldShowEditionSuccessfullText
        } = this.state;

        const detectToShowCommentAndGuid = showGuid && !buyAdId;

        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/whatsapp-wallpaper.png')}
                    style={styles.image}
                >

                    {shouldShowPromotionModal ?
                        <Modal
                            onRequestClose={_ => this.handlePromotionModalVisiblity(false)}
                            visible={shouldShowPromotionModal}
                            transparent={true}
                        >
                            <Dialog
                                onDismiss={_ => this.handlePromotionModalVisiblity(false)}
                                visible={shouldShowPromotionModal}
                                style={{ ...styles.dialogWrapper }}
                            >
                                <Dialog.Actions
                                    style={styles.dialogHeader}
                                >
                                    <Button
                                        onPress={_ => this.handlePromotionModalVisiblity(false)}
                                        style={styles.closeDialogModal}>
                                        <FontAwesome5 name="times" color="#777" solid size={18} />
                                    </Button>
                                    <Paragraph style={styles.headerTextDialogModal}>
                                        {locales('labels.editPrice')}
                                    </Paragraph>
                                </Dialog.Actions>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '22%',
                                        paddingVertical: 20
                                    }}
                                >
                                    <Button
                                        onPress={_ => {
                                            this.handlePromotionModalVisiblity(false);
                                            this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' })
                                        }}
                                        style={styles.loginButton}
                                    >
                                        <Text style={[styles.buttonText, {
                                            alignSelf: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 20,
                                        }]}>
                                            {locales('titles.promoteRegistration')}
                                        </Text>
                                    </Button>
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
                            onPress={() => this.handleGoBack(true)}>
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
        backgroundColor: '#00C569',
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
        backgroundColor: '#00C569',
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
        doForceRefresh: (forceRefresh) => dispatch(messagesActions.doForceRefresh(forceRefresh)),
        fetchUserProfilePhoto: id => dispatch(messagesActions.fetchUserProfilePhoto(id)),
        checkUserAutorityToPostComment: (userId) => dispatch(CommentsAndRatingsActions.checkUserAuthorityToPostComment(userId)),
        fetchProductDetails: id => dispatch(productListActions.fetchProductDetails(id)),
        editProduct: product => dispatch(productListActions.editProduct(product)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);