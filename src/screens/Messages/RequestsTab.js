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
import Svg, { Path } from 'react-native-svg';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as requestActions from '../../redux/buyAdRequest/actions';
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight, validator } from '../../utils';
import { numberWithCommas } from '../../utils/formatter';
import { responsiveHeight } from 'react-native-responsive-dimensions';

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
                    <Portal
                        style={{
                            padding: 0,
                            margin: 0

                        }}>
                        <Dialog
                            visible={showMobileNumberWarnModal}
                            onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                            style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 39) }}
                        >
                            <Dialog.Actions
                                style={{
                                    alignSelf: 'flex-end',
                                    paddingRight: 15,
                                    paddingTop: 15
                                }}
                            >
                                <AntDesign
                                    onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                                    name="close"
                                    color="#264653"
                                    solid
                                    size={22}
                                />
                            </Dialog.Actions>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="74"
                                height="87"
                                fill="none"
                                viewBox="0 0 69 77"
                                style={{
                                    alignSelf: 'center',
                                    top: -25
                                }}
                            >
                                <Path
                                    fill="#DEE9FF"
                                    d="M64.721 25.892s-10.332 8.708.669 28.163C75.16 71.333 51.814 78.15 41.91 75.93c-12.829-2.875-19.737-19.598-29.766-14.597-10.03 5-19.086-18.99-4.463-27.38C25.87 23.519 14.6 16.92 16.447 8.989c1.325-5.694 17.977-14.14 26.504-3.834 7.175 8.672 10.913 5.723 14.345 4.672 4.95-1.515 15.387 7.25 7.425 16.066z"
                                ></Path>
                                <Path
                                    fill="#0E84E5"
                                    d="M54.27 13.12L31.979 9.467a3 3 0 00-3.446 2.475l-7.71 47.056a3 3 0 002.475 3.446l22.293 3.653a3 3 0 003.445-2.475l7.711-47.057a3 3 0 00-2.475-3.445z"
                                ></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M53.538 14.446l-21.289-3.489a2 2 0 00-2.297 1.65L22.379 58.82a2 2 0 001.65 2.297l21.289 3.489a2 2 0 002.297-1.65l7.573-46.213a2 2 0 00-1.65-2.297z"
                                ></Path>
                                <Path
                                    fill="#0E84E5"
                                    d="M66.224 9.447c-1.619-.677-2.764-.028-3.034.62-.196.468.11.85.434.985.647.27.77-.764 1.993-.252.6.25.97.715.739 1.266-.271.648-1.098.74-1.634.91-.473.155-1.135.456-1.566 1.488-.26.624-.168.874.324 1.08.588.245.818.03.913-.197.26-.624.423-.979 1.299-1.219.429-.117 1.789-.506 2.26-1.634.471-1.128-.192-2.405-1.728-3.047zM63.146 16.376a1.001 1.001 0 00-.772 1.847 1 1 0 00.772-1.847z"
                                ></Path>
                                <Path
                                    fill="#fff"
                                    d="M35.766 30.955c.146-.9-.114-1.69-.58-1.766-.467-.076-.963.592-1.11 1.492-.145.9.114 1.69.58 1.766.467.076.964-.592 1.11-1.492zM45.493 32.552c.147-.908-.111-1.706-.578-1.782-.466-.076-.964.6-1.112 1.508-.147.908.111 1.706.578 1.782.466.076.964-.6 1.112-1.508zM41.522 40.384a.252.252 0 01-.181-.078l-.352-.37a3.733 3.733 0 00-4.472-.713l-.45.243a.25.25 0 01-.367-.195.249.249 0 01.13-.245l.449-.243a4.235 4.235 0 015.073.808l.352.37a.25.25 0 01-.182.423z"
                                ></Path>
                            </Svg>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={[styles.mainTextDialogModal, {
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 16,
                                    color: '#15313C',
                                    top: -20

                                }]}>
                                    {locales('titles.canNotAccessBuyersNumbers')}
                                </Text>

                            </Dialog.Actions>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    textAlign: 'center',
                                    fontSize: 13,
                                    color: '#15313C',
                                    paddingHorizontal: 15,
                                    width: '100%',
                                    top: -25
                                }}>
                                    {accessToContactInfoErrorMessage}
                                </Text>

                            </Dialog.Actions>
                            {/* <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {accessToContactInfoErrorMessage}
                        </Paragraph> */}
                            <View style={{
                                width: '100%',
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    style={[styles.modalButton, styles.greenButton, { width: '65%', top: -25, marginBottom: 30 }]}
                                    onPress={() => {
                                        this.setState({ showMobileNumberWarnModal: false })
                                        this.props.navigation.navigate('PromoteRegistration');
                                    }}
                                >

                                    <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                    styles.buttonText]}>{locales('titles.promoteRegistration')}
                                    </Text>
                                </Button>
                            </View>
                        </Dialog>
                    </Portal>
                    :
                    null
                }

                {showGoldenModal ?
                    <Portal
                        style={{
                            padding: 0,
                            margin: 0

                        }}>
                        <Dialog
                            visible={showGoldenModal}
                            onDismiss={() => { this.setState({ showGoldenModal: false }) }}
                            style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 45 : 41) }}
                        >
                            <Dialog.Actions
                                style={{
                                    alignSelf: 'flex-end',
                                    paddingRight: 15,
                                    paddingTop: 15
                                }}
                            >
                                <AntDesign
                                    onPress={() => { this.setState({ showGoldenModal: false }) }}
                                    name="close"
                                    color="#264653"
                                    solid
                                    size={22}
                                />
                            </Dialog.Actions>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="74"
                                height="87"
                                fill="none"
                                viewBox="0 0 69 77"
                                style={{
                                    alignSelf: 'center',
                                    top: -25
                                }}
                            >
                                <Path
                                    fill="#DEE9FF"
                                    d="M64.721 25.892s-10.332 8.708.669 28.163C75.16 71.333 51.814 78.15 41.91 75.93c-12.829-2.875-19.737-19.598-29.766-14.597-10.03 5-19.086-18.99-4.463-27.38C25.87 23.519 14.6 16.92 16.447 8.989c1.325-5.694 17.977-14.14 26.504-3.834 7.175 8.672 10.913 5.723 14.345 4.672 4.95-1.515 15.387 7.25 7.425 16.066z"
                                ></Path>
                                <Path
                                    fill="#0E84E5"
                                    d="M54.27 13.12L31.979 9.467a3 3 0 00-3.446 2.475l-7.71 47.056a3 3 0 002.475 3.446l22.293 3.653a3 3 0 003.445-2.475l7.711-47.057a3 3 0 00-2.475-3.445z"
                                ></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M53.538 14.446l-21.289-3.489a2 2 0 00-2.297 1.65L22.379 58.82a2 2 0 001.65 2.297l21.289 3.489a2 2 0 002.297-1.65l7.573-46.213a2 2 0 00-1.65-2.297z"
                                ></Path>
                                <Path
                                    fill="#0E84E5"
                                    d="M66.224 9.447c-1.619-.677-2.764-.028-3.034.62-.196.468.11.85.434.985.647.27.77-.764 1.993-.252.6.25.97.715.739 1.266-.271.648-1.098.74-1.634.91-.473.155-1.135.456-1.566 1.488-.26.624-.168.874.324 1.08.588.245.818.03.913-.197.26-.624.423-.979 1.299-1.219.429-.117 1.789-.506 2.26-1.634.471-1.128-.192-2.405-1.728-3.047zM63.146 16.376a1.001 1.001 0 00-.772 1.847 1 1 0 00.772-1.847z"
                                ></Path>
                                <Path
                                    fill="#fff"
                                    d="M35.766 30.955c.146-.9-.114-1.69-.58-1.766-.467-.076-.963.592-1.11 1.492-.145.9.114 1.69.58 1.766.467.076.964-.592 1.11-1.492zM45.493 32.552c.147-.908-.111-1.706-.578-1.782-.466-.076-.964.6-1.112 1.508-.147.908.111 1.706.578 1.782.466.076.964-.6 1.112-1.508zM41.522 40.384a.252.252 0 01-.181-.078l-.352-.37a3.733 3.733 0 00-4.472-.713l-.45.243a.25.25 0 01-.367-.195.249.249 0 01.13-.245l.449-.243a4.235 4.235 0 015.073.808l.352.37a.25.25 0 01-.182.423z"
                                ></Path>
                            </Svg>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={[styles.mainTextDialogModal, {
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 17,
                                    color: '#15313C',
                                    top: -20

                                }]}>
                                    {locales('titles.youDoNotHaveAccessToSpecialBuyersInBuskool')}
                                </Text>

                            </Dialog.Actions>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    textAlign: 'center',
                                    fontSize: 14,
                                    color: '#15313C',
                                    paddingHorizontal: 15,
                                    width: '100%',
                                    top: -25
                                }}>
                                    {locales('titles.toAccessGoldenRequestsPleasePromoteYourAccount')}
                                </Text>

                            </Dialog.Actions>
                            <View style={{
                                width: '100%',
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    style={[styles.modalButton, styles.greenButton, {
                                        width: '65%',
                                        top: -15,
                                        marginBottom: 30,
                                        borderRadius: 8,
                                        elevation: 0
                                    }]}
                                    onPress={() => {
                                        this.setState({ showGoldenModal: false })
                                        this.props.navigation.navigate('PromoteRegistration');
                                    }}
                                >
                                    <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                    </Text>
                                </Button>
                            </View>
                        </Dialog>
                    </Portal>
                    :
                    null}

                {showDialog ?
                    <Portal
                        style={{
                            padding: 0,
                            margin: 0

                        }}>
                        <Dialog
                            visible={showDialog}
                            onDismiss={this.hideDialog}
                            style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 40) }}
                        >
                            <Dialog.Actions
                                style={{
                                    alignSelf: 'flex-end',
                                    paddingRight: 15,
                                    paddingTop: 15
                                }}
                            >
                                <AntDesign
                                    onPress={this.hideDialog}
                                    name="close"
                                    color="#264653"
                                    solid
                                    size={22}
                                />
                            </Dialog.Actions>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    alignSelf: 'center',
                                    top: -35
                                }}
                                width="94"
                                height="87"
                                fill="none"
                                viewBox="0 0 70 67"
                            >
                                <Path
                                    fill="#DEE9FF"
                                    d="M36.911 6.601s1.798 11.562 21.178 11.88c17.21.284 11.74 20.755 5.632 27.192-7.914 8.338-23.424 6.157-24.238 15.862-.815 9.706-22.68 5.938-22.307-8.695.463-18.204-9.508-12.669-14.556-17.538-3.623-3.494-2.377-19.671 9.106-21.523 9.662-1.559 9.161-5.652 9.93-8.683C22.764.725 33.966-3.234 36.91 6.6z"
                                ></Path>
                                <Path
                                    fill="#208AF2"
                                    d="M55.143 47.756a2.232 2.232 0 01-2.232 2.24l-35.795.072a2.235 2.235 0 01-2.24-2.231l-.05-25.168 19.813-12.44a.56.56 0 01.593-.002L54.628 22.3l.464.288v.403l.05 24.766z"
                                ></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M52.222 12.396H17.483a.15.15 0 00-.15.15V49.72c0 .083.068.15.15.15h34.74a.15.15 0 00.15-.15V12.547a.15.15 0 00-.15-.15z"
                                ></Path>
                                <Path
                                    fill="#A2BDFF"
                                    d="M52.875 49.96L35.11 36.414a.114.114 0 01.005-.185l19.8-13.532a.113.113 0 01.177.093l.05 24.953a2.237 2.237 0 01-2.191 2.242.12.12 0 01-.075-.025zM17.147 50.031l17.712-13.617a.114.114 0 00-.006-.184L15 22.776a.113.113 0 00-.178.095l.05 24.953a2.237 2.237 0 002.2 2.232.12.12 0 00.075-.025z"
                                ></Path>
                                <Path
                                    fill="#418DF9"
                                    d="M52.909 49.985l-35.795.071a2.242 2.242 0 01-2.22-1.937.56.56 0 01.186-.495l19.522-17.272a.56.56 0 01.74-.001l19.59 17.193a.56.56 0 01.189.495 2.242 2.242 0 01-2.212 1.946z"
                                ></Path>
                                <Path
                                    fill="#fff"
                                    d="M26.225 21.624c.695 0 1.259-.75 1.259-1.678 0-.926-.564-1.677-1.259-1.677s-1.258.75-1.258 1.677.563 1.678 1.258 1.678zM43.843 21.624c.695 0 1.259-.75 1.259-1.678 0-.926-.564-1.677-1.259-1.677s-1.258.75-1.258 1.677.563 1.678 1.258 1.678zM39.788 27.188a.25.25 0 01-.212-.117c-.013-.021-1.382-2.135-4.563-2.4-1.323-.11-2.58.258-3.732 1.096-.515.369-.971.812-1.355 1.315a.25.25 0 01-.41-.287c.021-.03.524-.741 1.456-1.422 1.238-.905 2.65-1.32 4.083-1.2 3.44.286 4.885 2.537 4.945 2.633a.25.25 0 01-.212.382z"
                                ></Path>
                            </Svg>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={[styles.mainTextDialogModal, {
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    top: -25,
                                    color: '#15313C',

                                }]}>
                                    {locales('titles.youHaveReachedMaxSendingMessageLimitation')}
                                </Text>

                            </Dialog.Actions>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    textAlign: 'center',
                                    fontSize: 15,
                                    color: '#15313C',
                                    paddingHorizontal: 15,
                                    width: '100%',
                                    top: -30
                                }}>
                                    {locales('titles.IncreaseYourCapacityToSendMoreMessagesToBuyers')}
                                </Text>

                            </Dialog.Actions>
                            <View style={{
                                width: '100%',
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    style={[styles.modalButton, styles.greenButton, { width: '65%', top: -25, marginBottom: 30 }]}
                                    onPress={() => {
                                        this.hideDialog();
                                        this.props.navigation.navigate('ExtraBuyAdCapacity');
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        {locales('titles.increaseCapacity')}
                                    </Text>
                                </Button>
                            </View>
                        </Dialog>
                    </Portal>
                    : null
                }

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