import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Pressable,
    Linking, BackHandler,
    LayoutAnimation, UIManager, Platform,
    Modal
} from 'react-native';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Dialog } from 'react-native-paper';
import Svg, { Path, Circle } from "react-native-svg";

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { formatter, deviceHeight, deviceWidth, validator } from '../../utils';
import * as productActions from '../../redux/registerProduct/actions';
import * as requestActions from '../../redux/buyAdRequest/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { BuskoolButton } from '../../components';
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

class RegisterProductSuccessfully extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryId: null,
            selectedBuyAdId: -1,
            showGoldenModal: false,
            scrollToOffset: 0,
            selectedContact: {},
            subCategoryName: '',
            loaded: false,
            showMobileNumberWarnModal: false,
            accessToContactInfoErrorMessage: '',
            showBox: true
        }
    }

    flatListRef = React.createRef();
    scrollViewRef = React.createRef();
    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed)
            if (this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
                this.props.fetchBuyAdsAfterPayment();
            }
        }
        // BackHandler.addEventListener('hardwareBackPress', _ => {
        //     this.props.resetRegisterProduct(true)
        //     return false;
        // });
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
        // BackHandler.removeEventListener('hardwareBackPress');
    }
    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.loaded == false && this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
    //         this.props.fetchBuyAdsAfterPayment().then(_ => {
    //             this.setState({ loaded: true })
    //         })
    //     }
    // }

    handleHardWareBackButtonPressed = _ => {
        this.props.resetRegisterProduct(1);
        this.props.navigation.navigate('RegisterProductStack', { screen: 'RegisterProduct' })
        return true;
    };

    fetchContactInfo = (item, index) => {
        const { id, is_golden, myuser_id } = item;
        this.props.setSelectedButton(id);
        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info
        const shouldShowPromotionModal = !!is_golden && active_pakage_type == 0;
        if (shouldShowPromotionModal) {
            this.setState({ showGoldenModal: true })
        }
        else {
            const contactInfoObject = {
                b_id: myuser_id,
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
                    return this.scrollViewRef?.current?.scrollTo({
                        x: 0,
                        y: this.state.scrollToOffset + 105,
                        animated: true
                    })
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


    renderItem = ({ item, index }) => {

        const {
            selectedButton, userProfile = {},
            isUserAllowedToSendMessageLoading,
            buyerMobileNumberLoading
        } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        return (

            <View
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    padding: 20,
                    borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                    borderWidth: !!item.is_golden ? 2 : 0.5,
                    marginVertical: 5,
                    borderRadius: 8
                }}
                key={item.id}
            >

                {item.is_golden && active_pakage_type == 0 ?

                    <View style={{
                        minHeight: 90,
                        marginTop: -5,
                        marginLeft: -20
                    }}>

                        <Image
                            source={require('../../../assets/images/blur-items-2.png')}
                            style={{
                                zIndex: 0,
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                borderWidth: 0,
                                top: '55%'
                            }}
                            resizeMode='cover'
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginVertical: 10,
                                right: 0,
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
                        <View
                            style={{
                                top: -10,
                                zIndex: 1000,
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: '1%',
                                right: 0,
                                marginVertical: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.buyer')}
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        fontWeight: '200',
                                        color: '#556083',
                                        marginHorizontal: 2
                                    }}
                                >
                                    {` ${item.subcategory_name} `}
                                </Text>
                                {item.name ?
                                    <>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontWeight: '200',
                                                fontSize: 18,
                                                marginHorizontal: 2,
                                                color: '#777777'
                                            }}
                                        >
                                            {locales('labels.fromType')}
                                        </Text>
                                        <Text
                                            style={{
                                                fontWeight: '200',
                                                color: '#556083',
                                                fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                marginHorizontal: 2
                                            }}
                                        >
                                            {` ${item.name} `}
                                        </Text>
                                    </>
                                    :
                                    null
                                }
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontWeight: '200',
                                        fontSize: 18,
                                        marginHorizontal: 2,
                                        color: '#777777'
                                    }}
                                >
                                    {locales('labels.is')}
                                </Text>
                            </Text>

                        </View>
                    </View>

                    : null}

                {item.is_golden && active_pakage_type == 0 ? null : <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginVertical: 10,
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
                </View>}

                {item.is_golden && active_pakage_type == 0 ?
                    null
                    :
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 5,
                            flexDirection: 'row-reverse',
                            marginVertical: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                color: '#777777',
                                textAlign: 'center'
                            }}
                        >
                            {locales('labels.buyer')}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontWeight: '200',
                                    fontSize: 18,
                                    color: '#556083',
                                    marginHorizontal: 2
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontWeight: '200',
                                        fontSize: 18,
                                        color: '#e41c38',
                                        marginHorizontal: 2
                                    }}
                                > {formatter.convertedNumbersToTonUnit(item.requirement_amount)}</Text> {`${item.subcategory_name} `}
                            </Text>
                            {item.name ?
                                <>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontWeight: '200',
                                            fontSize: 18,
                                            marginHorizontal: 2,
                                            color: '#777777'
                                        }}
                                    >
                                        {locales('labels.fromType')}
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#556083',
                                            fontWeight: '200',
                                            fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            marginHorizontal: 2
                                        }}
                                    >
                                        {` ${item.name} `}
                                    </Text>
                                </>
                                :
                                null
                            }
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontWeight: '200',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                    </View>
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
                        <BuskoolButton
                            small

                            onPress={event => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.fetchContactInfo(item, index);
                            }}
                            style={{
                                borderColor: !!item.is_golden ? '#c7a84f' : '#FF9828',
                                width: '50%',
                                zIndex: 1000,
                                height: 45,
                                marginHorizontal: 10,
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
                                    height: 47,
                                    elevation: 0
                                }}
                            >
                                {buyerMobileNumberLoading && selectedButton == item.id ?
                                    <ActivityIndicator
                                        size={16}
                                        color={(!item.is_golden ? 'white' : '#333')}
                                        animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                    />
                                    :
                                    <FontAwesome5
                                        solid
                                        name='phone-alt'
                                        color={!item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white'}
                                        size={14} />
                                }
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        marginHorizontal: 3,
                                        fontSize: 16,
                                        color: !item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white',
                                        paddingHorizontal: 3
                                    }}
                                >
                                    {locales('labels.callWithBuyer')}
                                </Text>

                            </LinearGradient>

                        </BuskoolButton>
                        : null}
                    <BuskoolButton
                        small
                        onPress={event => !item.expired && this.openChat(event, item, false)}
                        style={[item.expired ? styles.disableLoginButton : styles.loginButton,
                        {
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            width: item.has_phone ? '50%' : '70%',
                            zIndex: 1000,
                            marginHorizontal: 10,
                            borderRadius: 8,
                            height: 45,
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
                                height: 47,
                                elevation: 0
                            }}
                        >

                            <MaterialCommunityIcons
                                name='message'
                                color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
                                size={16}
                                style={{
                                    marginLeft: 3
                                }}
                            />
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                color: item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333'),
                            }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                            <ActivityIndicator
                                size={16}
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

                    </BuskoolButton>

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
                                    name='phone-alt'
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

                {/* <View style={{ marginVertical: 15 }}>

                    <Button
                        small
                        onPress={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.openChat(event, item)
                        }}
                        style={{
                            borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                            width: "80%",
                            position: 'relative',
                            zIndex: 10000,
                            alignSelf: 'center',

                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f']}
                            style={{
                                width: '100%',
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                height: 45,
                                borderRadius: 6,

                            }}
                        >

                            <MaterialCommunityIcons
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                name='message' color={!item.is_golden ? 'white' : '#333'} size={16} />
                            <Text
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: !item.is_golden ? 'white' : '#333',
                                    paddingHorizontal: 3
                                }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                            <ActivityIndicator size={20} color={!item.is_golden ? 'white' : '#333'}
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
            */}
            </View>

        )
    };

    renderListFooterComponent = _ => {
        const {
            route = {},
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName
        } = params;

        const {
            showBox
        } = this.state;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;

        return (

            <Pressable
                onPress={() => {
                    this.props.navigation.navigate('RequestsStack', { subCategoryId, subCategoryName })
                }} style={{
                    marginTop: 50,
                    paddingBottom: 50,
                    flexDirection: 'row-reverse',
                    width: deviceWidth,
                    justifyContent: 'center',
                }}>
                <Text style={{
                    color: showBox ? 'white' : '#1da6f4',
                    fontSize: 16,
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    marginLeft: 5,
                }}>
                    {locales('titles.otherRelatedBuyads')}

                </Text>
                <Text style={{
                    top: 3
                }}>
                    <FontAwesome5
                        size={15}
                        name='arrow-left'
                        color={showBox ? 'white' : '#1DA1F2'}
                    />
                </Text>
            </Pressable>

        )
    };

    renderListHeaderComponent = _ => {
        const {
            showBox
        } = this.state;

        if (showBox)
            return (
                <TouchableOpacity
                    onPress={_ => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        this.setState({ showBox: false })
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}
                >
                    <FontAwesome5
                        name='angle-up'
                        color='white'
                        size={20}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.suggestedBuyers')}
                    </Text>
                </TouchableOpacity>
            );
        return null;

        // return (
        //     <View
        //         style={{
        //             padding: 20, marginVertical: 0,
        //             backgroundColor: 'white'
        //         }}
        //     >
        //         <Text
        //             style={{
        //                 color: 'black',
        //                 fontSize: 22,
        //                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
        //             }}
        //         >
        //             {locales('labels.buyers')}
        //         </Text>

        //         <Text
        //             style={{
        //                 color: '#777777',
        //                 fontSize: 16,
        //                 marginVertical: 10,
        //                 fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //             }}
        //         >
        //             {locales('labels.suggestedBuyersForYou')} <Text
        //                 style={{
        //                     color: '#21AD93',
        //                     fontWeight: '200',
        //                     fontSize: 16,
        //                     fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //                 }}
        //             >
        //                 {locales('titles.buskool')}
        //             </Text>
        //             <Text
        //                 style={{
        //                     color: '#777777',
        //                     fontWeight: '200',
        //                     fontSize: 16,
        //                     fontFamily: 'IRANSansWeb(FaNum)_Medium',
        //                 }}
        //             >
        //                 {locales('labels.forYourProduct')}
        //             </Text>
        //         </Text>

        //     </View>

        // )
    }

    chooseBuyadsList = (buyAds, buyAdsFromParams, buyAdsAfterPaymentList) => {
        let buyAdsList = [];
        buyAdsList = buyAdsAfterPaymentList.length ? [...buyAdsAfterPaymentList] : buyAds.length ? [...buyAds] : [...buyAdsFromParams];
        return buyAdsList
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

    openChat = (event, item) => {
        let { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;
        event.stopPropagation()
        event.preventDefault();
        if (!item.is_golden || (item.is_golden && active_pakage_type > 0)) {
            this.setState({ selectedButton: item.id })

            this.setState({
                selectedBuyAdId: item.id,
                selectedContact: {
                    contact_id: item.myuser_id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                }
            }, _ => this.props.navigation.navigate('Chat', {
                contact: this.state.selectedContact, buyAdId: this.state.selectedBuyAdId,
                shouldHideGuidAndComment: true
            }));
            // .catch(_ => this.setState({ showModal: true }));
        }
        else {
            this.setState({ showGoldenModal: true });
        }
    };

    keyExtractor = item => item.id.toString();

    render() {

        const {
            route = {},
            buyAds = [],
            buyAdsAfterPaymentList = [],
            buyAdsAfterPaymentLoading,
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            active_pakage_type
        } = user_info;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName,
            buyAds: buyAdsFromParams = [],
        } = params;

        const {
            selectedBuyAdId,
            showGoldenModal,
            accessToContactInfoErrorMessage,
            showMobileNumberWarnModal,
            selectedContact,
            showBox
        } = this.state;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;


        return (
            <>
                {showMobileNumberWarnModal ?
                    <Modal
                        onRequestClose={_ => this.setState({ showMobileNumberWarnModal: false })}
                        visible={showMobileNumberWarnModal}
                        transparent={true}
                        animationType="fade"
                        onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                    >
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
                                {active_pakage_type == 0 ?
                                    <BuskoolButton
                                        style={[styles.modalButton, styles.greenButton, {
                                            width: '65%', top: -25, marginBottom: 30, height: 45
                                        }]}
                                        onPress={() => {
                                            this.setState({ showMobileNumberWarnModal: false })
                                            this.props.navigation.navigate('PromoteRegistration');
                                        }}
                                    >

                                        <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                        styles.buttonText]}>{locales('titles.promoteRegistration')}
                                        </Text>
                                    </BuskoolButton>
                                    : null
                                }
                            </View>
                        </Dialog>
                    </Modal>
                    :
                    null
                }

                {showGoldenModal ?
                    <Modal
                        onRequestClose={_ => this.setState({ showGoldenModal: false })}
                        visible={showGoldenModal}
                        transparent={true}
                        animationType="fade"
                        onDismiss={_ => this.setState({ showGoldenModal: false })}
                    >
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
                    </Modal>
                    :
                    null}

                <ScrollView
                    onScroll={event => {
                        this.setState({ scrollToOffset: event.nativeEvent.contentOffset.y })
                    }}
                    ref={this.scrollViewRef}
                    style={{
                        flex: 1,
                        backgroundColor: 'white'
                    }}
                >
                    {buyAdsAfterPaymentList.length || showBox == false ? null :
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={['#aef8d6', '#67ce9e']}
                            style={{
                                borderRadius: 8,
                                padding: 20,
                                width: '90%',
                                alignSelf: 'center',
                                marginVertical: 15,
                                marginHorizontal: 25,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    opacity: 0.3,
                                    width: 100,
                                    height: 100,
                                    borderRadius: 100,
                                    top: '-35%',
                                    overflow: 'hidden',
                                    position: 'absolute',
                                }}
                            >
                            </View>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    opacity: 0.3,
                                    width: 100,
                                    height: 100,
                                    borderRadius: 100,
                                    left: '-15%',
                                    overflow: 'hidden',
                                    position: 'absolute',
                                }}
                            >
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="36"
                                    height="32"
                                    fill="none"
                                    viewBox="0 0 36 32"
                                >
                                    <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                    <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                    <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                    <Circle cx="20" cy="16" r="16" fill="#fff"></Circle>
                                    <Circle cx="16" cy="16" r="15.5" stroke="#000"></Circle>
                                    <Path stroke="#000" d="M9.778 16l5.333 4.445 7.111-8.89"></Path>
                                </Svg>
                                <Text
                                    style={{
                                        marginVertical: 10,
                                        textAlign: 'center',
                                        color: '#264653',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 18,
                                        marginHorizontal: 10
                                    }}
                                >
                                    {locales('titles.productRegisteredSuccessfully')}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: 'rgba(38,70,83,0.8)',
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    fontSize: 15
                                }}
                            >
                                {locales('titles.productdAccepted')}
                            </Text>
                        </LinearGradient>
                    }

                    <ActivityIndicator size={30} color='#00C569' animating={buyAdsAfterPaymentLoading} />

                    {this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList).length ?
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={showBox ? ['#9FBDCA', '#548DA5'] : ['white', 'white']}
                            style={{
                                borderRadius: 8,
                                alignSelf: 'center',
                                flex: 1
                            }}
                        >

                            <FlatList
                                renderItem={this.renderItem}
                                data={this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList)}
                                ListHeaderComponent={this.renderListHeaderComponent}
                                ListFooterComponent={this.renderListFooterComponent}
                                keyExtractor={this.keyExtractor}
                                ref={this.flatListRef}
                                contentContainerStyle={{
                                    padding: 10,
                                }}
                            />
                        </LinearGradient>
                        :
                        <View>
                            <Text
                                style={{
                                    color: '#e51c38',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    marginVertical: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('titles.whoWantsWhat')}
                            </Text>
                            <BuskoolButton
                                style={[styles.loginButton, {
                                    justifyContent: 'center', width: '75%', height: 45,
                                    alignItems: 'center', alignSelf: 'center', marginVertical: 20
                                }]}
                                onPress={() => this.props.navigation.navigate('RequestsStack', { screen: 'Requests', params: { subCategoryId, subCategoryName } })}
                            >
                                <Text style={styles.buttonText}>
                                    {locales('titles.seeBuyAds')}</Text>
                            </BuskoolButton>
                        </View>
                    }
                </ScrollView>
            </>
        )
    }
}


const styles = StyleSheet.create({
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

    greenButton: {
        backgroundColor: '#FF9828',
    },
    redButton: {
        backgroundColor: '#E41C39',
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
        alignSelf: 'center',
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
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
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchBuyAdsAfterPayment: _ => dispatch(registerProductActions.fetchBuyAdsAfterPayment()),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        fetchBuyerMobileNumber: contactInfoObject => dispatch(requestActions.fetchBuyerMobileNumber(contactInfoObject)),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
    }
};
const mapStateToProps = (state) => {
    const {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment
    } = state.registerProductReducer;

    const {
        userProfile
    } = state.profileReducer;

    const {
        buyerMobileNumberLoading
    } = state.buyAdRequestReducer;

    return {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment,

        userProfile,

        buyerMobileNumberLoading
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProductSuccessfully)