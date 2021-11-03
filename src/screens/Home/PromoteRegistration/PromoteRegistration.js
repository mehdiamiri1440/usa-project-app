import React, { createRef } from 'react';
import {
    Text, View, Modal, Pressable, ScrollView,
    StyleSheet, Linking, RefreshControl,
    TouchableOpacity,
    LayoutAnimation, UIManager, Platform,
} from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path, G } from "react-native-svg";
import { Card, Button } from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';
import { numberWithCommas } from '../../../utils/formatter';
import CreditCardPayment from './CreditCardPayment';
import Header from '../../../components/header';
import { validator } from '../../../utils';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
class PromoteRegistration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibility: false,
            paymentType: 3,
            activeTab: 1,
            packageVisibility: false,
            elevatorVisibility: false,
            passwordVisibility: false
        }
    }

    wrapperRef = createRef();
    refRBSheet = createRef();
    scrollViewRef = createRef();

    componentDidMount() {
        analytics().logEvent('package_payment');
        this.props.fetchPackagesPrices();
    }

    pay = (type = 3) => {
        const {
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            id
        } = user_info;

        if (!!userProfile && !!user_info && !!id)
            return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${id}/${type}`).then(supported => {
                if (supported) {
                    Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${id}/${type}`).then(_ => global.isAppStateChangedCauseOfPayment = true);
                }
            })
    };

    handleScrollToTopButtonClick = () => {
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.scrollTo({ x: 0, y: deviceHeight * 0.55, animate: true })
        }
    }

    choosePrice = _ => {

        const {
            paymentType
        } = this.state;

        const {
            packagesPrices = {}
        } = this.props;

        const {
            prices = {}
        } = packagesPrices;

        const {
            "type-1": typeOne = 0,
            "type-3": typeThree = 0,
            "type-1-discount": typeOneDiscount = 0,
            "type-3-discount": typeThreeDiscount = 0,
        } = prices;

        if (paymentType == 3) {
            if (typeThreeDiscount)
                return typeThreeDiscount;
            return typeThree;
        }
        else {
            if (typeOneDiscount)
                return typeOneDiscount;
            return typeOne;
        }
    };


    navigateToPaymentType = _ => {

        const {
            userProfile = {},
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            id
        } = user_info;

        const {
            paymentType,
        } = this.state;

        this.props.navigation.navigate('PaymentType', {
            price: this.choosePrice() / 10,
            type: paymentType,
            bankUrl: `${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${id}/${paymentType}`
        });
    };

    handleVisibilityOfCards = name => {
        switch (name) {
            case 'package':
                return this.setState({ packageVisibility: !this.state.packageVisibility });
            case 'elevator':
                return this.setState({ elevatorVisibility: !this.state.elevatorVisibility });
            case 'password':
                return this.setState({ passwordVisibility: !this.state.passwordVisibility });
            default:
                break;
        }
    }

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

    renderPackagesDetails = _ => {

        let {
            dashboard,
            isUsedAsComponent = false,
            showBothPackages = true,
            packagesPrices = {},
        } = this.props;

        const {
            prices = {}
        } = packagesPrices;
        const {
            "type-1": typeOne = 0,
            "type-3": typeThree = 0,
            "type-1-discount": typeOneDiscount = 0,
            "type-3-discount": typeThreeDiscount = 0,
            "discount-deadline": discountDeadLine = {}
        } = prices;

        const {
            days = 0,
            hours = 0
        } = discountDeadLine;

        let {
            active_package_type: activePackageType = 0,
        } = dashboard;

        const {
            visibility,
            paymentType,
            activeTab,
            packageVisibility,
            elevatorVisibility,
            passwordVisibility
        } = this.state;

        const hasDiscount = typeThreeDiscount || typeThreeDiscount;

        return (
            <>
                {activeTab == 1 ?
                    <View
                        style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#140092',
                            width: '100%',
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                            padding: 5,
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 22,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}
                        >
                            {locales('labels.20%Better')}
                        </Text>
                    </View>
                    : null
                }
                <Text style={{
                    color: '#140092',
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 28,
                    textAlign: 'center',
                    marginTop: 5,
                    textAlignVertical: 'center',
                    textDecorationLine: (hasDiscount) ? 'line-through' : 'none'
                }}>
                    {
                        activeTab == 0 ?
                            locales('titles.threeMonths') :
                            locales('titles.annuan')
                    } {numberWithCommas((hasDiscount ?
                        activeTab == 0 ? typeOne : typeThree
                        : this.choosePrice()
                    ) / 10)}
                    <Text
                        style={{
                            color: '#140092',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontWeight: '200',
                            fontSize: 20,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}
                    >
                        {` ${locales('titles.toman')}`}
                    </Text>
                </Text>
                {hasDiscount ?
                    <Text
                        style={{
                            color: '#3888FF',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 22,
                            textAlign: 'center',
                            marginTop: 5,
                            textAlignVertical: 'center',
                        }}>
                        {numberWithCommas((activeTab == 0 ? typeOneDiscount : typeThreeDiscount) / 10)}
                        <Text
                            style={{
                                color: '#3888FF',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontWeight: '200',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}
                        >
                            {` ${locales('titles.toman')}`}
                        </Text>
                    </Text>
                    : null
                }
                <Text
                    style={{
                        textAlign: 'center',
                        width: '85%',
                        alignSelf: 'center',
                        color: 'rgba(0, 0, 0, 0.8)',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginVertical: 5
                    }}
                >
                    {activeTab == 0 ?
                        locales('labels.monthlyPackageDescription') :
                        locales('titles.specialPackageDescription')
                    }
                </Text>
                {hasDiscount ?
                    <>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            style={{
                                width: '60%',
                                marginTop: 15,
                                borderRadius: 32,
                                alignSelf: 'center',
                                padding: 10,
                            }}
                            colors={['#e5d05d', '#FEEE98', '#e5d05d']}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18,
                                }}
                            >
                                {locales('labels.30%DiscountForNewJoining')}
                            </Text>
                        </LinearGradient>
                        <Text
                            style={{
                                color: '#3888FF',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 22,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginTop: 10
                            }}>
                            {numberWithCommas((activeTab == 0 ? typeOneDiscount : typeThreeDiscount) / 10)}
                            <Text
                                style={{
                                    color: '#3888FF',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    fontWeight: '200',
                                    fontSize: 18,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                }}
                            >
                                {` ${locales('titles.toman')}`}
                            </Text>
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <FontAwesome5
                                name='clock'
                                color='#F03738'
                                size={18}
                                style={{ marginHorizontal: 3 }}
                            />

                            {days > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}
                                >
                                    {locales('labels.day', { fieldName: days })}
                                </Text>
                                : null}

                            {hours > 0 && days > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {` ${locales('labels.and')} `}
                                </Text>
                                : null
                            }

                            {hours > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}
                                >
                                    {locales('labels.hours', { fieldName: hours })}
                                </Text>
                                : null}

                            <Text
                                style={{
                                    color: '#F03738',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 15,
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}
                            >
                                {` ${locales('labels.tillEndOfTheDiscount')}`}
                            </Text>
                        </View>
                    </>
                    : null
                }
                <Button
                    style={
                        {
                            width: '75%',
                            borderRadius: 6,
                            height: 55,
                            marginTop: 10,
                            backgroundColor: '#FF6600',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    onPress={_ => this.pay(paymentType)}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Text style={
                            {
                                textAlign: 'center',
                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                            }
                        }
                        >
                            {locales('labels.promoteRegistration')
                            }
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={20}
                            style={{
                                left: 10
                            }}
                        />
                    </View>
                </Button>
                {/* end of three month package price */}
                <ShadowView
                    style={{
                        shadowColor: '#000000',
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        shadowOffset: { width: 0, height: 0 },
                        backgroundColor: 'white',
                        width: '100%',
                        marginTop: 20
                    }}
                >
                    <Text
                        style={{
                            backgroundColor: 'rgba(189, 216, 226, 0.35)',
                            textAlign: 'right',
                            color: 'black',
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                        }}
                    >
                        {activeTab == 0 ?
                            locales('labels.basicPackagesFeatures') :
                            locales('labels.annualPackageFeatures')
                        }
                    </Text>
                </ShadowView>

                <View>
                    <View
                        style={{
                            width: 1,
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            position: 'absolute',
                            left: '20%'
                        }}
                    ></View>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            padding: 10,
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000000',
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}>
                                {locales('labels.productCountToAdvertise')}
                            </Text>
                        </View>

                        <Text style={{
                            color: '#000000',
                            fontSize: 20,
                            textAlign: 'center',
                            left: -20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            textAlignVertical: 'center'
                        }}
                        >
                            {activeTab == 0 ? 3 : 7}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderBottomWidth: 1,
                            padding: 10,
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text style={{
                                fontSize: 16,
                                color: '#000000',
                                marginHorizontal: 5,
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                textAlignVertical: 'center',
                                paddingBottom: 5
                            }}>
                                {locales('labels.dailyBuyersCount')}
                            </Text>
                        </View>

                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 20,
                                textAlign: 'center',
                                top: activeTab == 0 ? -3 : 0,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlignVertical: 'center',
                                left: activeTab == 0 ? -20 : 0,
                            }}
                        >
                            {activeTab == 0 ? 10 : locales('titles.unlimited')}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            padding: 10,
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000000',
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}>
                                {locales('labels.abilityToConnectToGoldenBuyers')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name='check'
                            color='#0AA709'
                            style={{
                                marginHorizontal: 5,
                                left: -15,
                            }}
                            solid
                            size={20}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            marginTop: 10,
                            padding: 10,
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000000',
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}
                            >
                                {locales('labels.accessToBuyersContactInfo')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name='check'
                            color='#0AA709'
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000000',
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}>
                                {locales('labels.inquireDelsa')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name='check'
                            color='#0AA709'
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000000',
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}
                            >
                                {locales('labels.giveBuyersAccessToYourContactInfo')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name='check'
                            color='#0AA709'
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />

                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            padding: 10,
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 16,
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    color: activeTab == 0 ? 'rgba(0, 0, 0, 0.5)' : '#000000',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}>
                                {locales('labels.advertiseProductsInBuskoolChannel')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name={activeTab == 0 ? 'times' : 'check'}
                            color={activeTab == 0 ? '#F03738' : '#0AA709'}
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />

                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: 'rgba(0,0,0,0.1)',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 16,
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    color: activeTab == 0 ? 'rgba(0, 0, 0, 0.5)' : '#000000',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}>
                                {locales('labels.5xConnectionWithBuyers')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name={activeTab == 0 ? 'times' : 'check'}
                            color={activeTab == 0 ? '#F03738' : '#0AA709'}
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />

                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                            padding: 10,
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 16,
                                    marginHorizontal: 5,
                                    textAlign: 'center',
                                    color: activeTab == 0 ? 'rgba(0, 0, 0, 0.5)' : '#000000',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    textAlignVertical: 'center',
                                    paddingBottom: 5
                                }}
                            >
                                {locales('labels.validatedSellerSign')}
                            </Text>
                        </View>
                        <FontAwesome5
                            name={activeTab == 0 ? 'times' : 'check'}
                            color={activeTab == 0 ? '#F03738' : '#0AA709'}
                            style={{
                                marginHorizontal: 5,
                                left: -15
                            }}
                            solid
                            size={20}
                        />
                    </View>
                </View>
                {hasDiscount ?
                    <>
                        <Text style={{
                            color: '#140092',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 22,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            textDecorationLine: 'line-through'
                        }}>
                            {numberWithCommas((activeTab == 0
                                ? typeOne
                                : typeThree) / 10)
                            }
                            <Text
                                style={{
                                    color: '#140092',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                }}
                            >
                            </Text> {locales('titles.toman')}
                        </Text>
                        <Text
                            style={{
                                color: '#3888FF',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginTop: 10
                            }}>
                            {numberWithCommas((activeTab == 0 ? typeOneDiscount : typeThreeDiscount) / 10)}
                            <Text
                                style={{
                                    color: '#3888FF',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                }}
                            >
                                {` ${locales('titles.toman')}`}
                            </Text>
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                marginVertical: 10
                            }}
                        >
                            <FontAwesome5
                                name='clock'
                                color='#F03738'
                                size={18}
                                style={{ marginHorizontal: 3 }}
                            />

                            {days > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}
                                >
                                    {locales('labels.day', { fieldName: days })}
                                </Text>
                                : null}

                            {hours > 0 && days > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {` ${locales('labels.and')} `}
                                </Text>
                                : null
                            }

                            {hours > 0 ?
                                <Text
                                    style={{
                                        color: '#F03738',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}
                                >
                                    {locales('labels.hours', { fieldName: hours })}
                                </Text>
                                : null}

                            <Text
                                style={{
                                    color: '#F03738',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 15,
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}
                            >
                                {` ${locales('labels.tillEndOfTheDiscount')}`}
                            </Text>
                        </View>
                    </>
                    : null
                }
                <Button
                    style={
                        {
                            width: '60%',
                            borderRadius: 6,
                            height: 45,
                            marginTop: 30,
                            backgroundColor: '#FF6600',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    onPress={_ => this.pay(paymentType)}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Text style={
                            {
                                textAlign: 'center',
                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                            }
                        }
                        >
                            {locales('labels.promoteRegistration')
                            }
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={20}
                            style={{
                                left: 10
                            }}
                        />
                    </View>
                </Button>
            </>
        );
        return;
    }

    render() {

        let {
            dashboard,
            isUsedAsComponent = false,
            showBothPackages = true,
            packagesPrices = {},
        } = this.props;

        const {
            prices = {}
        } = packagesPrices;
        const {
            "type-1": typeOne = 0,
            "type-3": typeThree = 0,
            "type-1-discount": typeOneDiscount = 0,
            "type-3-discount": typeThreeDiscount = 0,
            "discount-deadline": discountDeadLine = {}
        } = prices;

        const {
            days = 0,
            hours = 0
        } = discountDeadLine;

        let {
            active_package_type: activePackageType = 0,
        } = dashboard;

        const {
            visibility,
            paymentType,
            activeTab,
            packageVisibility,
            elevatorVisibility,
            passwordVisibility
        } = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >
                <Modal
                    transparent={false}
                    animationType="fade"
                    onRequestClose={_ => this.setState({ visibility: false })}
                    visible={visibility}
                >
                    <View
                        style={{
                            flex: 1,
                            height: deviceHeight,
                            width: deviceWidth,
                            padding: 20
                        }}
                    >
                        <Text
                            style={{
                                color: '#000',
                                textAlign: 'right',
                                fontSize: 20,
                                marginVertical: 30,
                                marginHorizontal: 10,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}
                        >
                            {locales('titles.paymentDetails')}
                        </Text>

                        <View style={{
                            flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                            justifyContent: 'space-between', width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#F2F2F2'
                        }}>
                            <View style={{ flexDirection: 'row-reverse' }}>

                                <Text style={{
                                    fontSize: 16,
                                    color: '#556080', marginHorizontal: 5, textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    textAlignVertical: 'center', paddingBottom: 5
                                }}>
                                    {locales('titles.activeMonths')}
                                </Text>
                            </View>

                            <Text style={{
                                color: '#666666', fontSize: 20, textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',

                            }}>
                                <Text style={{
                                    fontSize: 20, textAlign: 'center',
                                    fontWeight: '200',
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#666666'
                                }}>{paymentType == 1 ? 3 : 12}</Text> <Text
                                    style={{
                                        color: '#666666',
                                        fontWeight: '200',
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}>
                                    {locales('labels.month')}
                                </Text>
                            </Text>

                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                            justifyContent: 'space-between', width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#F2F2F2'
                        }}>
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#556080', marginHorizontal: 5, textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    textAlignVertical: 'center', paddingBottom: 5
                                }}>
                                    {locales('titles.freeMonths')}
                                </Text>
                            </View>

                            <Text style={{
                                color: '#666666', fontSize: 20, textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
                                <Text style={{
                                    fontSize: 20, textAlign: 'center',
                                    fontWeight: '200',
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#666666'
                                }}>{paymentType == 1 ? locales('titles.dosentHave') : 1}</Text> {paymentType == 3 ? <Text
                                    style={{
                                        fontWeight: '200',
                                        color: '#666666',
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}>
                                    {locales('labels.month')}
                                </Text> : null}
                            </Text>

                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                            justifyContent: 'space-between', width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#F2F2F2'
                        }}>
                            <View style={{ flexDirection: 'row-reverse' }}>

                                <Text style={{
                                    fontSize: 16,
                                    color: '#556080', marginHorizontal: 5, textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    textAlignVertical: 'center', paddingBottom: 5
                                }}>
                                    {locales('titles.payableMonths')}
                                </Text>
                            </View>

                            <Text style={{
                                color: '#666666', fontSize: 20, textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
                                <Text style={{
                                    fontSize: 20, textAlign: 'center',
                                    textAlignVertical: 'center',
                                    fontWeight: '200',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#666666'
                                }}>{paymentType == 3 ? 11 : 3}</Text> <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '200',
                                        color: '#666666',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}>
                                    {locales('labels.month')}
                                </Text>
                            </Text>

                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                            justifyContent: 'space-between', width: '100%',
                            borderBottomWidth: 2,
                            borderBottomColor: '#BEBEBE'
                        }}>
                            <View style={{ flexDirection: 'row-reverse' }}>

                                <Text style={{
                                    fontSize: 16,
                                    color: '#556080', marginHorizontal: 5, textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    textAlignVertical: 'center', paddingBottom: 5
                                }}>
                                    {locales('titles.costOfMonth')}
                                </Text>
                            </View>

                            <Text style={{
                                color: '#666666', fontSize: 20, textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',

                            }}>
                                <Text style={{
                                    fontSize: 18, textAlign: 'center',
                                    fontWeight: '200',
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#666666'
                                }}>{paymentType == 3 ? '89,000' : '99,000'}</Text> <Text
                                    style={{
                                        fontWeight: '200',
                                        color: '#666666',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}>
                                    {locales('titles.toman')}
                                </Text>
                            </Text>

                        </View>


                        <View style={{
                            flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                            justifyContent: 'space-between', width: '100%',

                        }}>
                            <View style={{ flexDirection: 'row-reverse' }}>

                                <Text style={{
                                    fontSize: 16,
                                    color: '#00C569', marginHorizontal: 5, textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    textAlignVertical: 'center', paddingBottom: 5
                                }}>
                                    {locales('titles.total')}
                                </Text>
                            </View>

                            <Text style={{
                                color: '#666666', fontSize: 20, textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
                                <Text style={{
                                    fontSize: 18, textAlign: 'center',
                                    fontWeight: '200',
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#00C569'
                                }}>{paymentType == 3 ? numberWithCommas(typeThree) : numberWithCommas(typeOne)}</Text> <Text
                                    style={{
                                        fontWeight: '200',
                                        color: '#666666',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}>
                                    {locales('titles.toman')}
                                </Text>
                            </Text>

                        </View>

                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            style={{ width: '70%', borderRadius: 5, marginTop: 35, alignSelf: 'center', padding: 10, margin: 20 }}
                            colors={['#21AD93', '#00C569']}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                onPress={() => this.pay(paymentType)}
                            >
                                <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                </Text>
                            </Pressable>
                        </LinearGradient>

                    </View>
                </Modal>

                {!isUsedAsComponent ?
                    <Header
                        title={locales('labels.promoteRegistration')}
                        {...this.props}
                    />
                    :
                    null}

                <ScrollView
                    ref={this.scrollViewRef}
                    contentContainerStyle={{
                        paddingBottom: 20
                    }}
                >
                    <View
                        style={{
                            padding: 20
                        }}
                    >
                        {/* why promote ? */}
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="32"
                                fill="none"
                                viewBox="0 0 36 32"
                            >
                                <Circle cx="20" cy="16" r="16" fill="#BDD8E2"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#BDD8E2"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#BDD8E2"></Circle>
                                <Circle cx="20" cy="16" r="16" fill="#BDD8E2"></Circle>
                                <Circle cx="16" cy="16" r="15.5" stroke="#000"></Circle>
                                <Path
                                    fill="#000"
                                    d="M16 8.291a4.168 4.168 0 00-4.167 4.167.52.52 0 101.042 0 3.126 3.126 0 016.25 0c0 .781-.196 1.225-.459 1.56-.212.271-.46.473-.77.724-.126.103-.263.214-.412.342-.488.418-1.004.944-1.388 1.787-.381.835-.617 1.943-.617 3.504v.104a.52.52 0 001.042 0v-.104c0-1.46.22-2.41.522-3.072.3-.654.695-1.065 1.119-1.429.097-.083.202-.168.312-.257.34-.276.721-.585 1.012-.956.421-.537.68-1.213.68-2.203 0-2.3-1.866-4.167-4.166-4.167zM16 23.5a.624.624 0 100-1.249.624.624 0 000 1.249z"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    marginHorizontal: 7,
                                }}
                            >
                                {locales('titles.promoteDescriptionTitle')}
                            </Text>
                        </View>
                        {/* end of why promote */}

                        {/* title text */}
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 16,
                                textAlign: 'center',
                                marginVertical: 15,
                                paddingRight: 4
                            }}
                        >
                            {locales('titles.buyersAndSellersAccess')}
                        </Text>
                        {/* end of title text */}

                        {/* header buttons */}
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginVertical: 10
                            }}
                        >
                            <ShadowView
                                style={{
                                    shadowColor: 'rgba(0, 0, 0, 0.15)',
                                    shadowOpacity: 0.3,
                                    shadowRadius: activeTab == 0 ? 2 : 0,
                                    shadowOffset: { width: 0, height: 0 },
                                    backgroundColor: 'white',
                                    width: '50%',
                                    zIndex: activeTab == 0 ? 1 : 0

                                }}
                            >
                                <Pressable
                                    onPress={_ => this.setState(
                                        {
                                            activeTab: 0,
                                            paymentType: 1
                                        }
                                    )
                                    }
                                    style={{
                                        borderBottomWidth: 2,
                                        borderBottomColor: activeTab == 0 ?
                                            '#FF6600' :
                                            '#EAEAEA',
                                        padding: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: `rgba(0,0,0,${activeTab == 0 ? '1' : '0.5'})`
                                        }}
                                    >
                                        {locales('titles.threeMonthBasicPackage')}
                                    </Text>
                                </Pressable>
                            </ShadowView>
                            <ShadowView
                                style={{
                                    shadowColor: 'rgba(0, 0, 0, 0.15)',
                                    shadowOpacity: 0.3,
                                    shadowRadius: activeTab == 1 ? 2 : 0,
                                    shadowOffset: { width: 0, height: 0 },
                                    backgroundColor: 'white',
                                    width: '50%',
                                    zIndex: activeTab == 1 ? 1 : 0
                                }}
                            >
                                <Pressable
                                    onPress={_ => this.setState({ activeTab: 1, paymentType: 3 })}
                                    style={{
                                        borderBottomWidth: 2,
                                        borderBottomColor: activeTab == 1 ?
                                            '#FF6600' :
                                            '#EAEAEA',
                                        padding: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: `rgba(0,0,0,${activeTab == 1 ? '1' : '0.5'})`
                                        }}
                                    >
                                        {locales('titles.annualSpecialPackage')}
                                    </Text>
                                </Pressable>
                            </ShadowView>
                        </View>
                        {/* end of header buttons */}

                        {/* three month package price */}
                    </View>
                    {this.renderPackagesDetails()}
                    <ShadowView
                        style={{
                            shadowColor: 'black',
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 4 },
                            backgroundColor: '#E2F0F5',
                            width: '95%',
                            borderRadius: 12,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                width: '100%',
                                borderColor: '#e0e0e0',
                                padding: 10,
                            }}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                style={{

                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse'
                                }}
                                onPress={_ => this.handleVisibilityOfCards('package')}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 16
                                    }}
                                >
                                    {locales('titles.whatIsSpecialPaymentPackage')}
                                </Text>
                                <FontAwesome5
                                    name={`angle-${packageVisibility ? 'up' : 'down'}`}
                                    size={20}
                                    color='#bebebe'
                                />
                            </Pressable>
                            {packageVisibility ?
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        padding: 10,
                                        textAlign: 'right',
                                        color: '#2D3031'
                                    }}
                                >
                                    {locales('labels.specialPackageDescription')}
                                </Text>
                                : null}
                        </View>
                    </ShadowView>

                    <ShadowView
                        style={{
                            shadowColor: 'black',
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 4 },
                            backgroundColor: '#E2F0F5',
                            width: '95%',
                            borderRadius: 12,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                width: '100%',
                                borderColor: '#e0e0e0',
                                padding: 10,
                            }}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse'
                                }}
                                onPress={_ => this.handleVisibilityOfCards('elevator')}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 16
                                    }}
                                >
                                    {locales('titles.whatIsElevatorInSpecialPaymentPackage')}
                                </Text>
                                <FontAwesome5
                                    name={`angle-${elevatorVisibility ? 'up' : 'down'}`}
                                    size={20}
                                    color='#bebebe'
                                />
                            </Pressable>
                            {elevatorVisibility ?
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        padding: 10,
                                        textAlign: 'right',
                                        color: '#2D3031'
                                    }}
                                >
                                    {locales('labels.elevatorPackageDescription')}
                                </Text>
                                : null}
                        </View>
                    </ShadowView>

                    <ShadowView
                        style={{
                            shadowColor: 'black',
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 4 },
                            backgroundColor: '#E2F0F5',
                            width: '95%',
                            borderRadius: 12,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                width: '100%',
                                borderColor: '#e0e0e0',
                                padding: 10,
                            }}
                        >
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse'
                                }}
                                onPress={_ => this.handleVisibilityOfCards('password')}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 16
                                    }}
                                >
                                    {locales('titles.doesNotHaveSecondPasswordToPayOnLine')}
                                </Text>
                                <FontAwesome5
                                    name={`angle-${passwordVisibility ? 'up' : 'down'}`}
                                    size={20}
                                    color='#bebebe'
                                />
                            </Pressable>
                            {passwordVisibility ?
                                <>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 14,
                                            padding: 10,
                                            textAlign: 'right',
                                            color: '#2D3031'
                                        }}
                                    >
                                        {locales('labels.passwordPackageDescription')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            justifyContent: 'space-around'
                                        }}
                                    >
                                        <Pressable
                                            onPress={_ => this.openCallPad('09178928266')}
                                            style={{
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 14,
                                                    padding: 10,
                                                    textAlign: 'center',
                                                    color: '#2D3031'
                                                }}
                                            >
                                                09178928266
                                            </Text>
                                            <FontAwesome5
                                                name='phone-alt'
                                                color='black'
                                                size={15}
                                            />
                                        </Pressable>
                                        <Pressable
                                            onPress={_ => this.openCallPad('09118413054')}
                                            style={{
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 14,
                                                    padding: 10,
                                                    textAlign: 'center',
                                                    color: '#2D3031'
                                                }}
                                            >
                                                09118413054
                                            </Text>
                                            <FontAwesome5
                                                name='phone-alt'
                                                color='black'
                                                size={15}
                                            />
                                        </Pressable>
                                    </View>
                                </>
                                : null}
                        </View>
                    </ShadowView>
                    <Button
                        style={
                            {
                                width: '60%',
                                borderRadius: 6,
                                height: 45,
                                marginTop: 30,
                                backgroundColor: '#140092',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        onPress={_ => this.setState(
                            {
                                activeTab: this.state.activeTab == 0 ? 1 : 0,
                                paymentType: this.state.activeTab == 0 ? 3 : 1
                            }, _ => setTimeout(() => this.scrollViewRef.current?.scrollTo({
                                animated: true,
                                y: 0
                            }), 100)
                        )
                        }
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row-reverse'
                            }}
                        >
                            <Text style={
                                {
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    color: 'white',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                }
                            }
                            >
                                {activeTab == 1 ?
                                    locales('titles.threeMonthBasicPackage')
                                    : locales('titles.annualSpecialPackage')
                                }
                            </Text>
                        </View>
                    </Button>
                </ScrollView>


                {/* <ScrollView
                    ref={this.wrapperRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.dashboardLoading}
                            onRefresh={() => this.props.fetchAllDashboardData()
                            }
                        />
                    }
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 7
                    }}
                >

                    {!isUsedAsComponent ? <ShadowView
                        style={{
                            width: deviceWidth * 0.96,
                            alignSelf: 'center',
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}
                    >
                        <View style={{
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: 5,
                            paddingTop: 15,
                            marginBottom: 30,
                            padding: 5,
                        }}>
                            <Text style={{
                                color: '#333',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.didYouKnow')}؟
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    marginVertical: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F2F2F2',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <View
                                >
                                    <FontAwesome5
                                        name='frown-open'
                                        size={48}
                                        style={{ paddingRight: 7, paddingTop: 15 }}
                                        color='#E41C38'
                                        solid
                                    />
                                </View>
                                <View
                                    style={{ marginRight: 20, marginLeft: 13, maxWidth: '85%' }}
                                >

                                    <Text style={{
                                        color: '#707070',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        marginVertical: 7,
                                    }}>
                                        <Text style={{
                                            width: '100%',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            color: '#707070',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',

                                        }}>
                                            {locales('titles.promoteDescriptionTextFirst')}
                                        </Text>
                                        <Text style={{
                                            fontWeight: '200',
                                            color: '#E41C38',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18
                                        }}>
                                            {` ${locales('titles.promoteDescriptionTextSecend')} `}
                                        </Text>
                                        <Text
                                            style={{
                                                width: '100%',
                                                fontWeight: '200',
                                                fontSize: 16,
                                                color: '#707070',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            }}>
                                            {`${locales('titles.promoteDescriptionTextThird')}`}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    marginVertical: 10,
                                    justifyContent: 'space-around',
                                }}
                            >
                                <View
                                    style={{}}
                                >
                                    <FontAwesome5
                                        name='grin'
                                        size={48}
                                        style={{ paddingRight: 7, paddingTop: 15 }}
                                        color='#00C569'
                                        solid
                                    />
                                </View>
                                <View
                                    style={{ marginRight: 20, marginLeft: 13, maxWidth: '85%' }}
                                >

                                    <Text style={{
                                        color: '#707070',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        marginVertical: 7,
                                    }}>
                                        <Text style={{
                                            width: '100%',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            color: '#707070',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',

                                        }}>
                                            {locales('titles.promoteDescriptionTextFifth')}
                                        </Text>
                                        <Text style={{
                                            color: '#00C569',
                                            fontWeight: '200',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18
                                        }}>
                                            {` ${locales('titles.realBuyer')}`}
                                        </Text>
                                        <Text style={{
                                            color: '#707070',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                        }}>
                                            {` ${locales('titles.extraBuyAdRequestDescriptionTextThird')} `}
                                        </Text>
                                        <Text style={{
                                            fontWeight: '200',
                                            color: '#313A43',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18
                                        }}>
                                            {`${locales('titles.buskoolSpecialSellers')}`}
                                        </Text>
                                        <Text style={{
                                            color: '#707070',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                        }}>
                                            {` ${locales('titles.join')} `}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ShadowView>
                        : null}

                    <Card transparent>
                        <View style={{
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: 5,
                            borderWidth: 2,
                            borderColor: '#21AD93',
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: 17,
                                    padding: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    backgroundColor: '#21AD93'
                                }}
                            >
                                {locales('titles.suggesstionForYou')}
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                backgroundColor: '#E41C38',
                                color: 'white',
                                paddingBottom: 4,
                                transform: [{ rotate: '-45deg' }],
                                marginHorizontal: 6,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                width: 120,
                                position: 'absolute',
                                left: -45,
                                top: 7,
                            }}>
                                {locales('labels.special')}
                            </Text>
                            <Text style={{
                                color: '#21AD93',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 22,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.specialRegistration')}
                            </Text>
                            <Text style={{
                                color: '#808C9B',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}>
                                {locales('titles.annuan')} <Text
                                    style={{
                                        color: '#1DA1F2',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontWeight: '200',
                                        fontSize: 21,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {numberWithCommas(typeThree / 10)}
                                </Text>
                                {` ${locales('titles.toman')} `}
                            </Text>

                            <View style={{
                            }}>
                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10,
                                    padding: 10, justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.productCountToAdvertise')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlignVertical: 'center'
                                    }}>
                                        7
                                    </Text>

                                </View>



                                <View style={{
                                    backgroundColor: '#FAFAFA',
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.dailyBuyersCount')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                        textAlignVertical: 'center'
                                    }}>
                                        30
                                    </Text>

                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.abilityToConnectToGoldenBuyers')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.accessToBuyersContactInfo')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.inquireDelsa')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.giveBuyersAccessToYourContactInfo')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.advertiseProductsInBuskoolChannel')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.accessMoreToBuyers')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.validatedSellerSign')}
                                            <Text style={{
                                                fontSize: 16,
                                                color: '#E41C38', marginHorizontal: 5, textAlign: 'center',
                                                fontWeight: '200',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                                textAlignVertical: 'center', paddingBottom: 5
                                            }}>
                                                *
                                            </Text>
                                        </Text>

                                    </View>
                                    <FontAwesome5
                                        name='check-circle'
                                        color='#21AD93'
                                        style={{ marginHorizontal: 0 }}
                                        solid
                                        size={25}
                                    />

                                </View>
                                {activePackageType < 3 && typeThreeDiscount ? <View
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#E41C38',
                                            alignItems: 'center', justifyContent: 'center',
                                            width: '45%',
                                            padding: 10, borderRadius: 5
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 18
                                            }}
                                        >
                                            {locales('titles.discount', { fieldName: '30' })}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            color: '#777777',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 17,
                                            marginTop: 20
                                        }}
                                    >
                                        {locales('titles.forYouNewBuskoolUser')}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#1DA1F2',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 30,
                                            marginTop: 10
                                        }}
                                    >
                                        {numberWithCommas(typeThreeDiscount / 10)} {locales('titles.toman')}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#808C9B',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 20,
                                            textDecorationLine: 'line-through',
                                            marginTop: 10
                                        }}
                                    >
                                        {numberWithCommas(typeThree / 10)} {locales('titles.toman')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            marginVertical: 10
                                        }}
                                    >
                                        <FontAwesome5
                                            name='clock'
                                            color='#E41C38'
                                            size={18}
                                            style={{ marginHorizontal: 3 }}
                                            solid
                                        />

                                        {days > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center'
                                                }}
                                            >
                                                {locales('labels.day', { fieldName: days })}
                                            </Text>
                                            : null}

                                        {hours > 0 && days > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    marginHorizontal: 3
                                                }}
                                            >
                                                {locales('labels.and')}
                                            </Text>
                                            : null
                                        }

                                        {hours > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center'
                                                }}
                                            >
                                                {locales('labels.hours', { fieldName: hours })}
                                            </Text>
                                            : null}

                                        <Text
                                            style={{
                                                color: '#808C9B',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 15,
                                                marginHorizontal: 3,
                                                textAlign: 'center',
                                                textAlignVertical: 'center'
                                            }}
                                        >
                                            {locales('labels.tillEndOfTheDiscount')}
                                        </Text>

                                    </View>
                                </View>
                                    : null}
                                {activePackageType == 3 ? <View
                                    style={{
                                        backgroundColor: '#f6f6f6',
                                        width: deviceWidth * 0.45,
                                        padding: 10,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: 10,
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{
                                        color: '#000', fontSize: 20,
                                        width: '100%', textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                    }}>{locales('labels.inUse')}</Text>
                                </View>
                                    :
                                    <LinearGradient
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0.8, y: 0.2 }}
                                        style={{ width: '70%', borderRadius: 5, alignSelf: 'center', padding: 10, margin: 20 }}
                                        colors={['#21AD93', '#00C569']}
                                    >
                                        <TouchableOpacity
                                            onPress={_ => this.setState({ paymentType: 3 }, _ => this.navigateToPaymentType())}
                                        >
                                            <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('labels.promoteRegistration')}
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                }
                            </View>
                        </View>
                    </Card>

                    {showBothPackages ? <Card transparent>
                        <View style={{
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: 5,
                            marginTop: 15,
                            marginBottom: 50,

                        }}>
                            <Text style={{
                                color: '#556080',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 22,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.basicRegistration')}
                            </Text>
                            <Text style={{
                                color: '#808C9B',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}>
                                {locales('titles.threeMonths')} <Text
                                    style={{
                                        color: '#1DA1F2',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontWeight: '200',
                                        fontSize: 21,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {numberWithCommas(typeOne / 10)}
                                </Text> {locales('titles.toman')}
                            </Text>

                            <View style={{
                            }}>
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    backgroundColor: '#FAFAFA',
                                    marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%'
                                }}
                                >
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.productCountToAdvertise')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlignVertical: 'center'
                                    }}>
                                        3
                                    </Text>

                                </View>



                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.dailyBuyersCount')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                        textAlignVertical: 'center'
                                    }}>
                                        10
                                    </Text>
                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%', backgroundColor: '#FAFAFA'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.abilityToConnectToGoldenBuyers')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.accessToBuyersContactInfo')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.inquireDelsa')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.giveBuyersAccessToYourContactInfo')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}>
                                        <FontAwesome5
                                            name='check-circle'
                                            color='#21AD93'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>


                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#CCCCCC', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.advertiseProductsInBuskoolChannel')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}>
                                        <FontAwesome5
                                            name='times-circle'
                                            color='#E41C38'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>

                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>

                                        <Text style={{
                                            fontSize: 16,
                                            color: '#CCCCCC', marginHorizontal: 5, textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                            textAlignVertical: 'center', paddingBottom: 5
                                        }}>
                                            {locales('labels.validatedSellerSign')}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        color: '#666666', fontSize: 20, textAlign: 'center',
                                        textAlignVertical: 'center'
                                    }}>
                                        <FontAwesome5
                                            name='times-circle'
                                            color='#E41C38'
                                            style={{ marginHorizontal: 5 }}
                                            solid
                                            size={25}
                                        />
                                    </Text>
                                </View>

                                {activePackageType < 1 && typeOneDiscount ? <View
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#E41C38',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '45%',
                                            padding: 10,
                                            borderRadius: 5,
                                            marginTop: 20
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 18
                                            }}
                                        >
                                            {locales('titles.discount', { fieldName: '30' })}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            color: '#777777',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 17,
                                            marginTop: 20
                                        }}
                                    >
                                        {locales('titles.forYouNewBuskoolUser')}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#1DA1F2',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 30,
                                            marginTop: 10
                                        }}
                                    >
                                        {numberWithCommas(typeOneDiscount / 10)} {locales('titles.toman')}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#808C9B',
                                            textAlign: 'center',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 20,
                                            textDecorationLine: 'line-through',
                                            marginTop: 10
                                        }}
                                    >
                                        {numberWithCommas(typeOne / 10)} {locales('titles.toman')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            marginVertical: 10
                                        }}
                                    >
                                        <FontAwesome5
                                            name='clock'
                                            color='#E41C38'
                                            size={18}
                                            style={{ marginHorizontal: 3 }}
                                            solid
                                        />

                                        {days > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center'
                                                }}
                                            >
                                                {locales('labels.day', { fieldName: days })}
                                            </Text>
                                            : null}

                                        {hours > 0 && days > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    marginHorizontal: 3
                                                }}
                                            >
                                                {locales('labels.and')}
                                            </Text>
                                            : null
                                        }

                                        {hours > 0 ?
                                            <Text
                                                style={{
                                                    color: '#E41C38',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center'
                                                }}
                                            >
                                                {locales('labels.hours', { fieldName: hours })}
                                            </Text>
                                            : null}

                                        <Text
                                            style={{
                                                color: '#808C9B',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 15,
                                                marginHorizontal: 3,
                                                textAlign: 'center',
                                                textAlignVertical: 'center'
                                            }}
                                        >
                                            {locales('labels.tillEndOfTheDiscount')}
                                        </Text>

                                    </View>
                                </View>
                                    : null}

                                {activePackageType == 1 ? <View
                                    style={{
                                        backgroundColor: '#f6f6f6',
                                        width: deviceWidth * 0.45,
                                        padding: 10,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: 10,
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{
                                        color: '#000', fontSize: 20,
                                        width: '100%', textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                    }}>{locales('labels.inUse')}</Text>
                                </View>
                                    :
                                    <Button
                                        style={[styles.loginButton, {
                                            width: '70%', borderRadius: 6,
                                            height: 50,
                                            margin: 20, backgroundColor: '#556080', alignSelf: 'center'
                                        }]}
                                        onPress={_ => this.setState({ paymentType: 1 }, _ => this.navigateToPaymentType())}
                                    >
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('labels.promoteRegistration')}
                                        </Text>
                                    </Button>
                                }
                            </View>
                        </View>
                    </Card>
                        : null}
                    <ShadowView
                        style={{
                            width: deviceWidth * 0.96,
                            alignSelf: 'center',
                            marginBottom: 20,
                            marginTop: !showBothPackages ? 20 : 0,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}
                    >
                        {!isUsedAsComponent ? <View style={{
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: 5,
                            paddingTop: 15,
                            marginBottom: 30,
                            padding: 5,
                        }}>
                            <Text style={{
                                color: '#333',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}>
                                {locales('titles.whatIsSpecialPackage')}؟
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    marginVertical: 10,
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                }}
                            >

                                <View
                                    style={{ marginRight: 20, marginLeft: 13 }}
                                >

                                    <Text style={{
                                        color: '#707070',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        marginVertical: 7,
                                    }}>
                                        <Text style={{
                                            width: '100%',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            color: '#707070',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',

                                        }}>
                                            {locales('titles.specialPackageFirstDescription')}
                                        </Text>
                                        <Text style={{
                                            color: '#21AD93',
                                            fontWeight: '200',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        }}>
                                            {` ${locales('titles.specialPackageSecondDescription')} `}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                            : null}
                    </ShadowView>

                </ScrollView>
                {!isUsedAsComponent ? <CreditCardPayment /> : null}
      */}
            </View>
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
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
        color: '#7E7E7E'
    }
});

const mapStateToProps = (state) => {
    const {
        packagesPricesLoading,
        packagesPricesFailed,
        packagesPricesError,
        packagesPricesMessage,
        packagesPrices,

        dashboard,
        dashboardFailed,
        dashboardMessage,
        dashboardLoading,
        dashboardError
    } = state.homeReducer;

    return {
        dashboardLoading,
        dashboardError,
        dashboardMessage,
        dashboardFailed,
        dashboard,

        packagesPricesLoading,
        packagesPricesFailed,
        packagesPricesError,
        packagesPricesMessage,
        packagesPrices,

        userProfile: state.profileReducer.userProfile,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData()),
        fetchPackagesPrices: () => dispatch(homeActions.fetchPackagesPrices()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteRegistration)