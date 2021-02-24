import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import analytics from '@react-native-firebase/analytics';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as requestActions from '../../redux/buyAdRequest/actions';
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

import ChatModal from '../Messages/ChatModal';
import { numberWithCommas } from '../../utils/formatter';

class RequestsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: null,
            showDialog: false,
            modalFlag: false,
            selectedBuyAdId: -1,
            selectedContact: {},
            loaded: false,
            fromMyBuskool: false,
            relatedBuyAdRequestsList: [],
            goldenBuyAdsList: [],
            showGoldenModal: false,
        }
    }

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "buyAd_suggestion",
            screen_class: "buyAd_suggestion",
        });

        this.props.fetchRelatedRequests();

        AppState.addEventListener('change', this.handleAppStateChange)
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.fromMyBuskool == false && this.props.route && prevProps.route &&
            this.props.route.params && prevProps.route.params &&
            (this.props.route.params.fromMyNuskool != prevProps.route.params.fromMyNuskool ||
                prevProps.route.params.fromMyNuskool || this.props.route.params)
        ) {
            this.setState({ fromMyBuskool: true })
            this.props.fetchRelatedRequests().then(result => {
                this.setState({ relatedBuyAdRequestsList: result.payload.buyAds, goldenBuyAdsList: result.payload.golden_buyAds })
            });
        }

        if (prevState.loaded == false && this.props.relatedBuyAdRequestsList.length) {
            this.setState({
                relatedBuyAdRequestsList: this.props.relatedBuyAdRequestsList,
                goldenBuyAdsList: this.props.goldenBuyAdsList, loaded: true
            })
        }

        if (prevProps.refresh != this.props.refresh) {
            this.setState({
                relatedBuyAdRequestsList: this.props.relatedBuyAdRequestsList,
                goldenBuyAdsList: this.props.goldenBuyAdsList, loaded: true
            })
        }
        if (this.props.searchText != this.state.searchText) {
            this.handleSearch(this.props.searchText)
        }
        this.props.setRefresh(false)
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    handleSearch = text => {
        let relatedBuyAdRequestsList = [...this.state.relatedBuyAdRequestsList];
        let goldenBuyAdsList = [...this.state.goldenBuyAdsList];
        if (text) {
            relatedBuyAdRequestsList = this.props.relatedBuyAdRequestsList
                .filter(item => `${item.first_name} ${item.last_name}`.includes(text) || `${item.subcategory_name}`.includes(text) ||
                    `${item.name}`.includes(text));
            goldenBuyAdsList = this.props.goldenBuyAdsList
                .filter(item => `${item.first_name} ${item.last_name}`.includes(text) || `${item.subcategory_name}`.includes(text) ||
                    `${item.name}`.includes(text));
        }
        else {
            relatedBuyAdRequestsList = [...this.props.relatedBuyAdRequestsList]
            goldenBuyAdsList = [...this.props.goldenBuyAdsList]
        }
        this.setState({ relatedBuyAdRequestsList, goldenBuyAdsList, searchText: text })
    };

    handleAppStateChange = (nextAppState) => {
        if (
            AppState.current != nextAppState
        ) {
            this.props.fetchRelatedRequests().then(result => {
                this.setState({ relatedBuyAdRequestsList: result.payload.buyAds, goldenBuyAdsList: result.payload.golden_buyAds })
            });
        }
    };

    renderListEmptyComponent = _ => {
        const { relatedBuyAdRequestsLoading } = this.props;
        const { relatedBuyAdRequestsList = [], goldenBuyAdsList = [] } = this.state;

        if (goldenBuyAdsList && goldenBuyAdsList.length)
            if (relatedBuyAdRequestsList && !relatedBuyAdRequestsList.length)
                return null;

        if (relatedBuyAdRequestsLoading)
            return <View style={{
                paddingTop: 50
            }}>
                {[1, 2, 3, 4, 5].map((_, index) => <View
                    key={index}
                >
                    <ContentLoader
                        style={{
                            marginTop: -30,

                        }}
                        speed={2}
                        width={deviceWidth}
                        height={260}
                        viewBox="0 0 430 320"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"

                    >
                        <Rect x="164" y="21" rx="3" ry="3" width="183" height="20" />
                        <Circle cx="395" cy="30" r="30" />
                        <Rect x="42" y="94" rx="3" ry="3" width="349" height="24" />
                        <Rect x="5" y="69" rx="0" ry="0" width="436" height="2" />
                        <Rect x="17" y="136" rx="3" ry="3" width="398" height="19" />
                        <Rect x="62" y="175" rx="3" ry="3" width="312" height="17" />
                        <Rect x="97" y="211" rx="3" ry="3" width="237" height="48" />
                    </ContentLoader>

                </View>)}
            </View>

        if (!relatedBuyAdRequestsList.length && !goldenBuyAdsList.length && !relatedBuyAdRequestsLoading)
            return <View style={{ height: deviceHeight, paddingHorizontal: 10 }}>
                <View style={{ height: deviceHeight / 2, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <FontAwesome5 size={85} name='list-alt' solid color='#BEBEBE' />
                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginVertical: 15, color: '#777777', textAlign: 'center' }}>
                        {locales('labels.messengerNoRelateRequstFoundFirst')}
                    </Text>
                    <Text style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#E41C38', textAlign: 'center' }}>
                        {locales('labels.messengerNoRelateRequstFoundSecond')}
                    </Text>
                </View>
                <Button
                    onPress={_ => this.props.navigation.navigate('RegisterProductStack')}
                    style={{
                        alignSelf: 'center',
                        backgroundColor: '#00C569',
                        width: deviceWidth * 0.6,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        borderRadius: 4,
                    }}
                >

                    <Text style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 18,
                        textAlign: 'center', textAlignVertical: 'center'
                    }}>
                        {locales('labels.registerProduct')}
                    </Text>
                </Button>
            </View>
    };

    keyExtractor = item => item.id.toString();

    renderRequirementAmount = amount => {
        if (amount < 1000)
            return `${numberWithCommas(amount)} ${locales('labels.kiloGram')}`
        if (amount == 1000)
            return `${locales('labels.one')} ${locales('labels.ton')}`
        if (amount > 1000)
            return `${numberWithCommas(amount / 1000)} ${locales('labels.ton')}`
        return null;
    };

    renderGoldenListItem = ({ item }) => {
        const {
            selectedButton
        } = this.state;
        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info;

        const {
            isUserAllowedToSendMessageLoading
        } = this.props;

        return (
            <View
                style={{
                    borderColor: '#c7a84f',
                    borderWidth: 2,
                    borderTopWidth: 0,
                    backgroundColor: 'white',
                    width: deviceWidth
                }}>
                <View style={{
                    paddingHorizontal: 15,
                    alignSelf: 'center',
                    width: '100%',
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse'
                }}
                >
                    <View
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 15,
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <FontAwesome5
                            solid
                            name='user-circle'
                            color='#adadad'
                            size={16}
                        />
                        <Text
                            style={{
                                marginHorizontal: 5,
                                color: '#adadad',
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {`${item.first_name} ${item.last_name}`}
                        </Text>
                    </View>
                </View>

                { active_pakage_type > 0 ?
                    <View
                        style={{
                            padding: 10,
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row-reverse' }}>

                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#676772',
                                    fontSize: 14,
                                }}
                            >
                            </Text>
                        </View>
                        <Text
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777777',
                                    fontSize: 18
                                }}
                            >
                                {`${locales('labels.buyer')} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    color: '#676772',
                                    fontSize: 18
                                }}
                            >
                                <Text style={{
                                    color: '#E41C38',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18,
                                }}>
                                    {this.renderRequirementAmount(item.requirement_amount)}
                                </Text>
                                {` ${item.subcategory_name} `}
                            </Text>
                            {item.name ? <>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777777',
                                        fontSize: 18
                                    }}
                                >
                                    {`${locales('labels.fromType')} `}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#556083',
                                        fontSize: 18
                                    }}
                                >
                                    {`${item.name} `}
                                </Text>
                            </>
                                :
                                null}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777777',
                                    fontSize: 18
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                        <View
                            style={{ alignSelf: 'center', marginVertical: 10 }}
                        >

                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: 10,
                                    color: '#BEBEBE',
                                    fontSize: 14,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('labels.notifMeIfExists')}
                            </Text>
                        </View>
                        <Button
                            onPress={event => this.openChat(event, item, true)}
                            style={[styles.loginButton,
                            {
                                alignSelf: 'center', backgroundColor: 'transparent', borderWidth: 0,
                                justifyContent: 'center', alignItems: 'center'
                            }]}
                        >

                            <LinearGradient
                                start={{ x: 0, y: 0.51, z: 1 }}
                                end={{ x: 0.8, y: 0.2, z: 1 }}
                                colors={['#c7a84f', '#f9f29f', '#c7a84f']}
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    paddingHorizontal: 10,
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                    borderRadius: 4,
                                }}
                            >
                                <MaterialCommunityIcons name='message' color={!item.is_golden ? 'black' : '#333'} size={20} />
                                <Text style={[
                                    styles.textBold, {
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#333',
                                        fontSize: 18,
                                        paddingHorizontal: 3
                                    }]}>
                                    {locales('labels.messageToBuyer')}


                                </Text>
                                <ActivityIndicator size={20} color={'#333'}
                                    animating={selectedButton == item.id &&
                                        !!isUserAllowedToSendMessageLoading}
                                    style={{
                                        position: 'relative',
                                        width: 10, height: 10, borderRadius: 5,
                                        marginLeft: -10,
                                        marginRight: 5
                                    }}
                                />
                            </LinearGradient>
                        </Button>
                    </View>
                    :

                    <View
                        style={{
                            padding: 10,
                            overflow: 'hidden',
                        }}
                    >

                        <Image source={require('../../../assets/images/blur-items.jpg')}
                            style={{
                                height: '100%',
                                position: 'absolute',
                                top: -45,
                                right: 10,
                                width: '100%',
                                zIndex: -1
                            }}
                        />
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 43,
                                top: -10
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777',
                                    fontSize: 20
                                }}
                            >
                                {`${locales('labels.buyer')} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#556083',
                                    fontSize: 20
                                }}
                            >
                                {/* {this.renderRequirementAmount(item.requirement_amount)} {`${item.subcategory_name} `} */}
                                {`${item.subcategory_name} `}
                            </Text>
                            {item.name ? <>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777',
                                        fontSize: 20
                                    }}
                                >
                                    {`${locales('labels.fromType')} `}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#556083',
                                        fontSize: 20
                                    }}
                                >
                                    {`${item.name} `}
                                </Text>
                            </>
                                : null}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777777',
                                    fontSize: 20
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                        <Button
                            onPress={event => this.openChat(event, item, true)}
                            style={[styles.loginButton,
                            { alignSelf: 'center', backgroundColor: 'transparent', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }]}
                        >

                            <LinearGradient
                                start={{ x: 0, y: 0.51, z: 1 }}
                                end={{ x: 0.8, y: 0.2, z: 1 }}
                                colors={['#c7a84f', '#f9f29f', '#c7a84f']}
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    paddingHorizontal: 10,
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                    borderRadius: 6,
                                }}
                            >
                                <MaterialCommunityIcons name='message' color={!item.is_golden ? 'black' : '#333'} size={20} />
                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: '#333',
                                    paddingHorizontal: 3
                                }}>
                                    {locales('labels.messageToBuyer')}


                                </Text>
                                <ActivityIndicator size={20} color={'#333'}
                                    animating={selectedButton == item.id &&
                                        !!isUserAllowedToSendMessageLoading}
                                    style={{
                                        position: 'relative',
                                        width: 10, height: 10, borderRadius: 5,
                                        marginLeft: -10,
                                        marginRight: 5
                                    }}
                                />
                            </LinearGradient>
                        </Button>
                    </View>
                }
            </View>

        )
    };

    renderItem = ({ item }) => {
        const {
            selectedButton
        } = this.state;

        const {
            isUserAllowedToSendMessageLoading
        } = this.props;

        return (
            <View
                style={{ backgroundColor: 'white', width: deviceWidth, borderBottomWidth: 2, borderBottomColor: '#EFEFEF' }}>
                <View style={{
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    alignSelf: 'center',
                    width: '100%',
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse'
                }}
                >
                    <View
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 10,
                            flexDirection: 'row-reverse'
                        }}
                    >

                        <FontAwesome5
                            solid
                            name='user-circle'
                            color='#adadad'
                            size={16}
                        />
                        <Text
                            style={{
                                marginHorizontal: 5,
                                color: '#adadad',
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {`${item.first_name} ${item.last_name}`}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        padding: 10,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 18,
                                color: '#777777',
                            }}
                        >
                            {`${locales('labels.buyer')} `}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                color: '#676772',
                                fontSize: 18
                            }}
                        >
                            <Text style={{
                                color: '#E41C38',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 18,
                            }}>
                                {this.renderRequirementAmount(item.requirement_amount)}
                            </Text>
                            <Text
                                style={{
                                    color: '#556083',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18,
                                }}>
                                {` ${item.subcategory_name} `}
                            </Text>
                        </Text>
                        {item.name ? <>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777777',
                                    fontSize: 18
                                }}
                            >
                                {`${locales('labels.fromType')} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#556083',
                                    fontSize: 18
                                }}
                            >
                                {`${item.name} `}
                            </Text>
                        </>
                            : null}
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777777',
                                fontSize: 18
                            }}
                        >
                            {locales('labels.is')}
                        </Text>
                    </Text>
                    {!item.expired ?
                        <View
                            style={{ alignSelf: 'center', marginVertical: 10 }}
                        >
                            <View
                                style={{ flexDirection: 'row-reverse' }}>
                                <FontAwesome5 name='hourglass-half' size={20} color='#E41C38' style={{
                                    marginLeft: 3
                                }} />
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        color: '#E41C38',
                                        fontSize: 14,

                                    }}>
                                    {`${item.remaining_time == 1 ? locales('labels.one') : item.remaining_time} ${locales('labels.hour')} `}

                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#676772',
                                        fontSize: 14
                                    }}
                                >
                                    {locales('labels.remainedTimeToResponseToRequest')}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: 10,
                                    color: '#BEBEBE',
                                    fontSize: 14,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('labels.notifMeIfExists')}
                            </Text>
                        </View>
                        :
                        <Text
                            style={{
                                color: '#E41C38',
                                marginTop: 15,
                                marginBottom: 15,
                                paddingHorizontal: 40,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                textAlign: 'center'
                            }}
                        >
                            {locales('labels.responseToRequestExpired')}
                        </Text>
                    }
                    <Button
                        onPress={event => !item.expired && this.openChat(event, item, false)}
                        style={[item.expired ? styles.disableLoginButton : styles.loginButton,
                        { alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }]}
                    >
                        <ActivityIndicator size={20} color='white'
                            animating={selectedButton == item.id &&
                                !!isUserAllowedToSendMessageLoading}
                            style={{
                                position: 'relative',
                                width: 10, height: 10, borderRadius: 5,
                                marginLeft: -15,
                                marginRight: 5
                            }}
                        />
                        <Text style={[styles.textWhite, styles.textBold, styles.textSize18, { marginTop: -3 }]}>
                            {locales('labels.messageToBuyer')}
                        </Text>
                        <MaterialCommunityIcons name='message' color={!item.is_golden ? 'white' : '#333'} size={20}
                            style={{
                                marginHorizontal: 5
                            }}
                        />
                    </Button>
                </View>
            </View>

        )
    };

    refreshList = () => {
        this.props.fetchRelatedRequests().then(result => {
            this.setState({ relatedBuyAdRequestsList: result.payload.buyAds, goldenBuyAdsList: result.payload.golden_buyAds })
        });
    }

    openChat = (event, item, isGolden) => {
        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info;

        event.preventDefault();

        this.setState({ selectedButton: item.id })
        if (isGolden) {
            if (active_pakage_type != 0) {
                this.checkUserPermissionToSendMessage(item)
            }
            else {
                this.setState({ showGoldenModal: true });
            }
        }
        else {
            this.checkUserPermissionToSendMessage(item);
        }
    };

    checkUserPermissionToSendMessage = item => {
        this.props.isUserAllowedToSendMessage(item.id).then(() => {
            if (this.props.isUserAllowedToSendMessagePermission.permission) {
                analytics().logEvent('buyAd_suggestion_chat_opened', {
                    buyAd_id: item.id
                });
                this.setState({
                    modalFlag: true,
                    selectedBuyAdId: item.id,
                    selectedContact: {
                        contact_id: item.buyer_id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                    }
                });
            }
            else {
                analytics().logEvent('buyAd_suggestion_permission_denied', {
                    buyAd_id: item.id
                });
                this.setState({ showDialog: true })
            }
        })
    };

    hideDialog = () => this.setState({ showDialog: false });

    renderHeaderComponent = _ => {

        const {
            goldenBuyAdsList
        } = this.state;

        if (goldenBuyAdsList && goldenBuyAdsList.length)
            return (
                <FlatList
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    windowSize={10}
                    data={goldenBuyAdsList}
                    maxToRenderPerBatch={3}
                    keyExtractor={this.keyExtractor}
                    initialNumToRender={2}
                    renderItem={this.renderGoldenListItem}
                    refreshing={false}
                    onRefresh={this.refreshList}
                />

            )
        return null;
    }

    render() {
        let {
            modalFlag,
            selectedContact,
            showDialog,
            selectedBuyAdId,
            relatedBuyAdRequestsList,
            showGoldenModal
        } = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >


                {modalFlag && <ChatModal
                    transparent={false}
                    {...this.props}
                    visible={modalFlag}
                    buyAdId={selectedBuyAdId}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}


                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showGoldenModal}
                        onDismiss={() => { this.setState({ showGoldenModal: false }) }}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => { this.setState({ showGoldenModal: false }) }}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.goldenRequests')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('labels.accessToGoldensDeined')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('labels.icreaseToSeeGoldens')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.setState({ showGoldenModal: false })
                                    this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ showGoldenModal: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >

                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showDialog}
                        onDismiss={this.hideDialog}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={this.hideDialog}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.buyRequests')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('titles.maximumBuyAdResponse')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#E41C38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('titles.icreaseYouRegisterRequstCapacity')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('MyBuskool', { screen: 'ExtraBuyAdCapacity' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.increaseCapacity')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={this.hideDialog}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >


                <FlatList
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    ListHeaderComponent={this.renderHeaderComponent}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    windowSize={10}
                    data={relatedBuyAdRequestsList}
                    maxToRenderPerBatch={3}
                    keyExtractor={this.keyExtractor}
                    initialNumToRender={2}
                    renderItem={this.renderItem}
                    refreshing={false}
                    onRefresh={this.refreshList}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        paddingHorizontal: deviceWidth * 0.025,
        alignSelf: 'center',
    },
    cardItemStyle: {
        borderRadius: 5,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 2,
        borderWidth: 1,
    },
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center',
    },
    disableLoginButton: {
        textAlign: 'center',
        width: '60%',
        height: 40,
        marginBottom: 10,
        elevation: 0,
        borderRadius: 4,
        backgroundColor: '#BEBEBE',
        color: 'white',
    },
    loginButton: {
        textAlign: 'center',
        width: '60%',
        height: 40,
        elevation: 0,
        marginBottom: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        color: 'white',
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
        maxWidth: 145,
        marginVertical: 10,
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
        backgroundColor: '#ddd',
        marginTop: 10
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
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#777777',
        fontSize: 16,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#777777'
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    actionsWrapper: {
        flexDirection: 'row-reverse',
        flex: 1,
        justifyContent: 'center',

    },
    elevatorIcon: {
        backgroundColor: '#777777',
        padding: 10,
        borderRadius: 4,
        height: 40,
        marginTop: 10,
        marginRight: 15
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize18: {
        fontSize: 18
    }
});


const mapStateToProps = (state) => {
    const {
        relatedBuyAdRequestsLoading,
        relatedBuyAdRequestsList,
        goldenBuyAdsList
    } = state.buyAdRequestReducer;

    const {
        userProfile,

        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading
    } = state.profileReducer;

    return {
        relatedBuyAdRequestsLoading,
        relatedBuyAdRequestsList,
        goldenBuyAdsList,

        userProfile,

        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchRelatedRequests: _ => dispatch(requestActions.fetchRelatedRequests()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(RequestsTab)