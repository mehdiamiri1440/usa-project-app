import React, { Component } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet,
    Modal, ActivityIndicator, AppState,
    Pressable, Linking
} from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import { useIsFocused } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as requestActions from '../../redux/buyAdRequest/actions';
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight, validator } from '../../utils';
import { numberWithCommas } from '../../utils/formatter';

class RequestsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: null,
            showDialog: false,
            selectedBuyAdId: -1,
            selectedContact: {},
            loaded: false,
            fromMyBuskool: false,
            relatedBuyAdRequestsList: [],
            goldenBuyAdsList: [],
            showGoldenModal: false,
            showMobileNumberWarnModal: false,
            accessToContactInfoErrorMessage: '',
            appState: AppState.currentState,
            scrollOffset: 0
        }
    }

    goldensRef = React.createRef();
    buyadsRef = React.createRef();


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

        this.props.fetchRelatedRequests().then(({ payload = {} }) => {
            const {
                golden_buyAds = [],
                buyAds = []
            } = payload;

            this.setState({
                relatedBuyAdRequestsList: buyAds,
                goldenBuyAdsList: golden_buyAds
            });
        });

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
            this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.props.isFocused
        ) {
            this.props.fetchRelatedRequests().then(result => {
                this.setState({ relatedBuyAdRequestsList: result.payload.buyAds, goldenBuyAdsList: result.payload.golden_buyAds })
            });
        }
        this.setState({ appState: nextAppState });
    };

    renderListEmptyComponent = _ => {
        const { relatedBuyAdRequestsLoading } = this.props;
        const { relatedBuyAdRequestsList = [], goldenBuyAdsList = [], searchText } = this.state;

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

        if (!relatedBuyAdRequestsList.length && !goldenBuyAdsList.length && !relatedBuyAdRequestsLoading) {
            return searchText ? <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: deviceWidth,
                    marginTop: 30
                }}>
                <Image
                    style={{
                        width: deviceWidth * 0.4,
                        height: deviceWidth * 0.4,
                    }}
                    source={require('../../../assets/images/magnifire-empty.png')}
                />
                <Text
                    style={{
                        color: 'black',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16,
                        textAlign: 'center',
                        marginTop: 10
                    }}
                >
                    {locales('labels.noBuyerFound')}
                </Text>
            </View> :
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        marginTop: deviceHeight * 0.13
                    }}>
                    <Image
                        style={{
                            width: deviceWidth * 0.4,
                            height: deviceWidth * 0.4
                        }}
                        source={require('../../../assets/images/envelop.png')}
                    />
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                            textAlign: 'center',
                        }}
                    >
                        {locales('labels.noRelatedBuyer')}
                    </Text>
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'IRANSansWeb(FaNum)',
                            fontSize: 14,
                            textAlign: 'center',
                            marginVertical: 20,
                            width: '75%'
                        }}
                    >
                        {locales('labels.registerProductToSeeBuyers')}
                    </Text>
                    <Button
                        onPress={_ => this.props.navigation.navigate('RegisterProductStack', { screen: 'RegisterProduct' })}
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: "center",
                            width: '50%',
                            borderRadius: 10,
                            backgroundColor: "#FF9828",
                            elevation: 0,
                        }}
                    >
                        <FontAwesome5
                            name='plus'
                            size={16}
                            color='white'
                        />
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                textAlign: 'center',
                                marginHorizontal: 8
                            }}
                        >
                            {locales('labels.registerProduct')}
                        </Text>
                    </Button>
                </View>
        }
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


    fetchContactInfo = (item, index, isFromGolden) => {

        const { id, is_golden, buyer_id } = item;

        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info;

        const shouldShowPromotionModal = !!is_golden && active_pakage_type == 0;
        if (shouldShowPromotionModal) {
            this.setState({ showGoldenModal: true })
        }
        else {
            this.setState({ selectedButton: id })
            const contactInfoObject = {
                b_id: buyer_id,
                ba_id: id,
                item: "BUYAD"
            }
            this.props.fetchBuyerMobileNumber(contactInfoObject).then(result => {
                const {
                    payload = {}
                } = result;
                const {
                    phone,
                    status
                } = payload;
                if (status == true && !!phone) {
                    item.isContactInfoShown = true;
                    item.mobileNumber = phone;
                    this.setState({});
                    if (isFromGolden)
                        return this.goldensRef?.current?.scrollToOffset({ offset: this.state.scrollOffset + 100, animated: true });
                    return this.buyadsRef?.current?.scrollToOffset({ offset: this.state.scrollOffset + 100, animated: true });
                }
            })
                .catch(err => {
                    const {
                        response = {}
                    } = err;
                    const {
                        data = {}
                    } = response;
                    const {
                        msg,
                        status
                    } = data;
                    if (status == false) {
                        this.setState({ showMobileNumberWarnModal: true, accessToContactInfoErrorMessage: msg })
                    }
                });
        }
    };


    renderGoldenListItem = ({ item, index }) => {
        const {
            selectedButton,
        } = this.state;
        const {
            userProfile = {},
            buyerMobileNumberLoading
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

                {active_pakage_type > 0 ?
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
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
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



                        <View style={{
                            marginVertical: 15,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '100%',
                            paddingHorizontal: 5,
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}
                        >
                            {item.has_phone ?
                                <Button
                                    small
                                    onPress={() => this.fetchContactInfo(item, index, true)}
                                    style={{
                                        borderColor: '#c7a84f',
                                        width: '47%',
                                        zIndex: 1000,
                                        position: 'relative',
                                        marginHorizontal: 15,
                                        alignSelf: 'center',

                                    }}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0.51, z: 1 }}
                                        end={{ x: 0.8, y: 0.2, z: 1 }}
                                        colors={!item.isContactInfoShown ? ['#c7a84f', '#f9f29f', '#c7a84f'] : ['#E0E0E0', '#E0E0E0']}
                                        style={{
                                            width: '100%',
                                            paddingHorizontal: 10,
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            paddingLeft: 20,
                                            padding: 8,
                                            elevation: 0
                                        }}
                                    >
                                        {buyerMobileNumberLoading && selectedButton == item.id ?
                                            <ActivityIndicator
                                                size={15}
                                                color='#333'
                                                animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                            />
                                            : <FontAwesome5
                                                solid
                                                name='phone-square-alt'
                                                color={!item.isContactInfoShown ? '#333' : 'white'}
                                                size={20} />
                                        }
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                marginHorizontal: 3,
                                                fontSize: 18,
                                                color: !item.isContactInfoShown ? '#333' : 'white',
                                                paddingHorizontal: 3
                                            }}
                                        >
                                            {locales('labels.callWithBuyer')}
                                        </Text>
                                    </LinearGradient>

                                </Button>
                                : null}
                            <Button
                                small

                                onPress={event => this.openChat(event, item, true)}
                                style={[styles.loginButton,
                                {
                                    alignSelf: 'center', backgroundColor: 'transparent', borderWidth: 0,
                                    justifyContent: 'center', alignItems: 'center',
                                    width: item.has_phone ? '47%' : '70%',
                                    zIndex: 1000,
                                    elevation: 0,
                                    marginBottom: 0,
                                    marginHorizontal: 15,
                                    position: 'relative',
                                }]}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0.51, z: 1 }}
                                    end={{ x: 0.8, y: 0.2, z: 1 }}
                                    colors={item.has_phone ? ['#fff', '#fff'] : ['#c7a84f', '#f9f29f', '#c7a84f']}
                                    style={{
                                        width: '100%',
                                        borderColor: item.has_phone ? '#556080' : '#c7a84f',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row-reverse',
                                        borderWidth: 1,
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        padding: 8,
                                        elevation: 0
                                    }}
                                >

                                    <MaterialCommunityIcons
                                        name='message'
                                        color={item.has_phone ? '#556080' : '#333'}
                                        size={20}
                                    />
                                    <Text style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: item.has_phone ? '#556080' : '#333',
                                        paddingHorizontal: 3
                                    }}>
                                        {locales('labels.messageToBuyer')}


                                    </Text>
                                    <ActivityIndicator size={20}
                                        color={item.has_phone ? '#556080' : '#333'}
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
                        {(item.isContactInfoShown) ?
                            <>
                                <View
                                    style={{
                                        zIndex: 1,
                                        flexDirection: 'row-reverse',
                                        padding: 20,
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18,
                                            color: '#404B55'
                                        }}>
                                        {locales('titles.phoneNumber')}
                                    </Text>
                                    <Pressable
                                        android_ripple={{
                                            color: '#ededed'
                                        }}
                                        onPress={_ => this.openCallPad(item.mobileNumber)}
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#404B55', fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5
                                            }}
                                        >
                                            {item.mobileNumber}
                                        </Text>
                                        <FontAwesome5
                                            name='phone-square-alt'
                                            size={20}
                                        />
                                    </Pressable>
                                </View>

                                <View
                                    style={{
                                        backgroundColor: '#FFFBE5',
                                        borderRadius: 12,
                                        alignSelf: 'center',
                                        padding: 20,
                                        width: '100%',
                                        zIndex: 1,
                                    }}
                                >

                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FontAwesome5
                                            color='#404B55'
                                            size={25}
                                            name='exclamation-circle'
                                        />
                                        <Text
                                            style={{
                                                color: '#404B55',
                                                marginHorizontal: 5,
                                                fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            }}
                                        >
                                            {locales('titles.policeWarn')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginVertical: 15,
                                            color: '#666666',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}
                                    >
                                        {locales('labels.policeWarnDescription')}
                                    </Text>
                                </View>
                            </>
                            : null}
                    </View>
                    :

                    <View
                        style={{
                            padding: 10,
                            overflow: 'hidden',
                        }}
                    >

                        <Image
                            source={require('../../../assets/images/blur-items.jpg')}
                            style={{
                                height: '100%',
                                position: 'absolute',
                                right: 10,
                                width: '100%',
                                zIndex: -1
                            }}
                        />
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 43,
                                top: -10,
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
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

                        <View style={{
                            marginVertical: 15,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '100%',
                            paddingHorizontal: 5,
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}
                        >
                            {item.has_phone ?
                                <Button
                                    small
                                    onPress={() => this.fetchContactInfo(item, index, true)}
                                    style={{
                                        borderColor: '#c7a84f',
                                        width: '47%',
                                        zIndex: 1000,
                                        position: 'relative',
                                        marginHorizontal: 15,
                                        alignSelf: 'center',

                                    }}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0.51, z: 1 }}
                                        end={{ x: 0.8, y: 0.2, z: 1 }}
                                        colors={!item.isContactInfoShown ? ['#c7a84f', '#f9f29f', '#c7a84f'] : ['#E0E0E0', '#E0E0E0']}
                                        style={{
                                            width: '100%',
                                            paddingHorizontal: 10,
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            paddingLeft: 20,
                                            padding: 8,
                                            elevation: 0
                                        }}
                                    >
                                        {buyerMobileNumberLoading && selectedButton == item.id ?
                                            <ActivityIndicator
                                                size={15}
                                                color='#333'
                                                animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                            />
                                            : <FontAwesome5
                                                solid
                                                name='phone-square-alt'
                                                color={!item.isContactInfoShown ? '#333' : 'white'}
                                                size={20} />}
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                marginHorizontal: 3,
                                                fontSize: 18,
                                                color: !item.isContactInfoShown ? '#333' : 'white',
                                                paddingHorizontal: 3
                                            }}
                                        >
                                            {locales('labels.callWithBuyer')}
                                        </Text>

                                    </LinearGradient>

                                </Button>
                                : null}
                            <Button
                                onPress={event => this.openChat(event, item, true)}
                                style={[styles.loginButton,
                                {
                                    alignSelf: 'center', backgroundColor: 'transparent',
                                    justifyContent: 'center', alignItems: 'center',
                                    width: item.has_phone ? '47%' : '60%',
                                    top: 5
                                }]}
                            >

                                <LinearGradient
                                    start={{ x: 0, y: 0.51, z: 1 }}
                                    end={{ x: 0.8, y: 0.2, z: 1 }}
                                    colors={['#ffffff', '#ffffff', '#ffffff']}
                                    style={{
                                        width: '100%',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        height: 45,
                                        borderRadius: 6,
                                        borderColor: '#556080',
                                        borderWidth: 1
                                    }}
                                >
                                    <MaterialCommunityIcons name='message' color={!item.is_golden ? 'black' : '#556080'} size={20} />
                                    <Text style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#556080',
                                        paddingHorizontal: 3
                                    }}>
                                        {locales('labels.messageToBuyer')}


                                    </Text>
                                    <ActivityIndicator size={20} color={'#556080'}
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
                    </View>
                }
            </View>

        )
    };


    openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    renderItem = ({ item, index }) => {
        const {
            selectedButton,
        } = this.state;

        const {
            isUserAllowedToSendMessageLoading,
            buyerMobileNumberLoading
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
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',

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


                    <View style={{
                        marginVertical: 15,
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        width: '100%',
                        paddingHorizontal: 5,
                        alignSelf: 'center',
                        justifyContent: 'center'
                    }}
                    >
                        {item.has_phone ?
                            <Button
                                small
                                onPress={() => this.fetchContactInfo(item, index, false)}
                                style={{
                                    borderColor: !!item.is_golden ? '#c7a84f' : '#FF9828',
                                    width: '47%',
                                    zIndex: 1000,
                                    marginHorizontal: 15,
                                    position: 'relative',
                                    alignSelf: 'center',

                                }}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0.51, z: 1 }}
                                    end={{ x: 0.8, y: 0.2, z: 1 }}
                                    colors={!item.isContactInfoShown ?
                                        (!item.is_golden ? ['#FF9828', '#FF9828', '#FF9828']
                                            : ['#c7a84f', '#f9f29f', '#c7a84f'])
                                        : ['#E0E0E0', '#E0E0E0']}
                                    style={{
                                        width: '100%',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        paddingLeft: 20,
                                        padding: 8,
                                        elevation: 0
                                    }}
                                >
                                    {buyerMobileNumberLoading && selectedButton == item.id ?
                                        <ActivityIndicator
                                            size={15}
                                            color={(!item.is_golden ? 'white' : '#333')}
                                            animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                        />
                                        : <FontAwesome5
                                            solid
                                            name='phone-square-alt'
                                            color={!item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white'}
                                            size={20} />}
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            marginHorizontal: 3,
                                            fontSize: 18,
                                            color: !item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white',
                                            paddingHorizontal: 3
                                        }}
                                    >
                                        {locales('labels.callWithBuyer')}
                                    </Text>

                                </LinearGradient>

                            </Button>
                            : null}
                        <Button
                            small
                            onPress={event => !item.expired && this.openChat(event, item, false)}
                            style={[item.expired ? styles.disableLoginButton : styles.loginButton,
                            {
                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                width: item.has_phone ? '47%' : '70%',
                                zIndex: 1000,
                                marginHorizontal: 15,
                                elevation: 0,
                                marginBottom: 0,
                                position: 'relative',
                            }]}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0.51, z: 1 }}
                                end={{ x: 0.8, y: 0.2, z: 1 }}
                                colors={item.has_phone ? ['#fff', '#fff']
                                    : (!item.is_golden ? ['#FF9828', '#FF9828', '#FF9828'] : ['#c7a84f', '#f9f29f', '#c7a84f'])
                                }
                                style={{
                                    width: '100%',
                                    borderColor: item.has_phone ? '#556080' : (!!item.is_golden ? '#c7a84f' : '#FF9828'),
                                    paddingHorizontal: 10,
                                    flexDirection: 'row-reverse',
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                    padding: 8,
                                    elevation: 0
                                }}
                            >

                                <MaterialCommunityIcons
                                    name='message'
                                    color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
                                    size={20}
                                />
                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333'),
                                    paddingHorizontal: 3
                                }}>
                                    {locales('labels.messageToBuyer')}


                                </Text>
                                <ActivityIndicator size={20}
                                    color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
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
                    {(item.isContactInfoShown) ?
                        <>
                            <View
                                style={{
                                    zIndex: 1,
                                    flexDirection: 'row-reverse',
                                    padding: 20,
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#404B55'
                                    }}>
                                    {locales('titles.phoneNumber')}
                                </Text>
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    onPress={_ => this.openCallPad(item.mobileNumber)}
                                    style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#404B55', fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5
                                        }}
                                    >
                                        {item.mobileNumber}
                                    </Text>
                                    <FontAwesome5
                                        name='phone-square-alt'
                                        size={20}
                                    />
                                </Pressable>
                            </View>

                            <View
                                style={{
                                    backgroundColor: '#FFFBE5',
                                    borderRadius: 12,
                                    alignSelf: 'center',
                                    padding: 20,
                                    width: '100%',
                                    zIndex: 1,
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome5
                                        color='#404B55'
                                        size={25}
                                        name='exclamation-circle'
                                    />
                                    <Text
                                        style={{
                                            color: '#404B55',
                                            marginHorizontal: 5,
                                            fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        }}
                                    >
                                        {locales('titles.policeWarn')}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        marginVertical: 15,
                                        color: '#666666',
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}
                                >
                                    {locales('labels.policeWarnDescription')}
                                </Text>
                            </View>
                        </>
                        : null}
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
                    selectedBuyAdId: item.id,
                    selectedContact: {
                        contact_id: item.buyer_id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                    }
                }, _ => this.props.navigation.navigate('Chat', {
                    contact: this.state.selectedContact,
                    buyAdId: this.state.selectedBuyAdId,
                    shouldHideGuidAndComment: true
                }));
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
                    onScroll={event => this.setState({ scrollOffset: event.nativeEvent.contentOffset.y })}
                    data={goldenBuyAdsList}
                    maxToRenderPerBatch={3}
                    keyExtractor={this.keyExtractor}
                    initialNumToRender={2}
                    renderItem={this.renderGoldenListItem}
                    refreshing={false}
                    onRefresh={this.refreshList}
                    ref={this.goldensRef}
                />
            )
        return null;
    }

    render() {
        let {
            showDialog,
            relatedBuyAdRequestsList,
            showGoldenModal,
            showMobileNumberWarnModal,
            accessToContactInfoErrorMessage,
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

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >

                {showMobileNumberWarnModal ?
                    <Modal
                        visible={showMobileNumberWarnModal}
                        onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                        onRequestClose={_ => this.setState({ showMobileNumberWarnModal: false })}
                        transparent
                        animationType='fade'
                    >
                        <Dialog
                            visible={showMobileNumberWarnModal}
                            onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                            style={styles.dialogWrapper}
                        >
                            <Dialog.Actions
                                style={styles.dialogHeader}
                            >
                                <Button
                                    onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                                    style={styles.closeDialogModal}>
                                    <FontAwesome5 name="times" color="#777" solid size={18} />
                                </Button>
                                <Paragraph style={styles.headerTextDialogModal}>
                                    {locales('labels.callWithBuyer')}
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
                            <Paragraph
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                                {accessToContactInfoErrorMessage}
                            </Paragraph>
                            <View style={{
                                width: '100%',
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                {active_pakage_type == 0 ? <Button
                                    style={[styles.modalButton, styles.greenButton]}
                                    onPress={() => {
                                        this.setState({ showMobileNumberWarnModal: false });
                                        this.props.navigation.navigate('PromoteRegistration');
                                    }}
                                >

                                    <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                    styles.buttonText]}>{locales('titles.promoteRegistration')}
                                    </Text>
                                </Button>
                                    : null}
                            </View>




                            <Dialog.Actions style={{
                                justifyContent: 'center',
                                width: '100%',
                                padding: 0
                            }}>
                                <Button
                                    style={styles.modalCloseButton}
                                    onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                                >

                                    <Text style={styles.closeButtonText}>{locales('titles.close')}
                                    </Text>
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Modal >
                    : null}

                {showGoldenModal ?
                    <Modal
                        visible={showGoldenModal}
                        onDismiss={() => { this.setState({ showGoldenModal: false }) }}
                        onRequestClose={() => { this.setState({ showGoldenModal: false }) }}
                        transparent
                        animationType='fade'
                    >
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
                                        this.props.navigation.navigate('PromoteRegistration');
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
                    </Modal >
                    : null}

                {showDialog ?
                    <Modal
                        visible={showDialog}
                        onDismiss={this.hideDialog}
                        onRequestClose={this.hideDialog}
                        transparent
                        animationType='fade'
                    >
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
                                        this.props.navigation.navigate('ExtraBuyAdCapacity');
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
                    </Modal >
                    : null}

                <FlatList
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    onScroll={event => this.setState({ scrollOffset: event.nativeEvent.contentOffset.y })}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    windowSize={10}
                    ListHeaderComponent={this.renderHeaderComponent}
                    data={relatedBuyAdRequestsList}
                    maxToRenderPerBatch={3}
                    keyExtractor={this.keyExtractor}
                    initialNumToRender={2}
                    renderItem={this.renderItem}
                    ref={this.buyadsRef}
                    refreshing={false}
                    onRefresh={this.refreshList}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
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
        backgroundColor: '#FF9828',
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
        elevation: 0,
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
        backgroundColor: '#FF9828',
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const mapStateToProps = (state) => {
    const {
        relatedBuyAdRequestsLoading,
        relatedBuyAdRequestsList,
        goldenBuyAdsList,
        buyerMobileNumberLoading
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
        isUserAllowedToSendMessageLoading,
        buyerMobileNumberLoading
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchRelatedRequests: _ => dispatch(requestActions.fetchRelatedRequests()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
        fetchBuyerMobileNumber: contactInfoObject => dispatch(requestActions.fetchBuyerMobileNumber(contactInfoObject)),
    }
};
const Wrapper = (props) => {
    const isFocused = useIsFocused();
    return <RequestsTab {...props} isFocused={isFocused} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)