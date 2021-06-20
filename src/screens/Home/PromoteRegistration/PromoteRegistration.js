import React, { createRef } from 'react';
import {
    Text, View, Modal, Pressable, ScrollView,
    StyleSheet, Linking, RefreshControl,
    TouchableOpacity
} from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Button } from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';
import { numberWithCommas } from '../../../utils/formatter';
import CreditCardPayment from './CreditCardPayment';
import Header from '../../../components/header';
class PromoteRegistration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibility: false,
            paymentType: 1
        }
    }

    wrapperRef = createRef();
    refRBSheet = createRef();

    componentDidMount() {
        analytics().logEvent('package_payment');
        this.props.fetchPackagesPrices();
    }

    pay = (type = 3) => {
        let userId = '';
        if (!!this.props.userProfile && !!this.props.userProfile.user_info)
            userId = this.props.userProfile.user_info.id;

        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${userId}/${type}`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${userId}/${type}`);
            }
        })
    };

    handleScrollToTopButtonClick = () => {
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.scrollTo({ x: 0, y: deviceHeight * 0.55, animate: true })
        }
    }




    render() {

        let {
            dashboard,
            isUsedAsComponent = false,
            showBothPackages = true,
            packagesPrices = {},
            packagesPricesLoading
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
            paymentType
        } = this.state;

        return (
            <>
                <Modal
                    transparent={false}
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
                                {/* {locales('titles.promoteDescriptionTitle')} */}
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
                                        {/* <Text style={{
                                            color: '#707070',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                        }}>
                                            {` ${locales('titles.extraBuyAdRequestDescriptionTextThird')} `}
                                        </Text> */}
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
                            {/* <Text
                                style={{
                                    color: '#38485F',
                                    textAlign: 'center',
                                    textAlignVertical: 'center', marginVertical: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18
                                }}>
                                {` ${locales('titles.promoteDescriptionTextFourth')} `}
                            </Text> */}
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
                            {/* <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#00C569', '#21AD93']}
                            > */}
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
                                    {/* {typeThree ? numberWithCommas(typeThree / 10) : ' '} */}
                                </Text>
                                {` ${locales('titles.toman')} `}
                            </Text>

                            {/* </LinearGradient> */}

                            {/* <View style={{
                                flexDirection: 'row-reverse', marginVertical: 10,
                                backgroundColor: '#EEFEF6', alignItems: 'center',
                                padding: 10, justifyContent: 'center', width: '100%'
                            }}>
                                <FontAwesome5
                                    name='plus-circle'
                                    color='#808C9B'
                                    style={{ marginHorizontal: 5 }}
                                    size={16}
                                />
                                <Text
                                    style={{
                                        color: '#808C9B',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {locales('titles.oneMonthFree')}
                                </Text>
                            </View> */}

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
                                {/* 
                                <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18, textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#1DA1F2'
                                    }}>
                                        {locales('labels.abilityToBuyYearly')}
                                    </Text>
                                </View> */}
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
                                            // onPress={() => this.pay()}
                                            onPress={_ => this.setState({ paymentType: 3 }, _ => this.pay(3))}
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
                            {/* <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#556080', '#556080']}
                            > */}

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
                                    {/* {typeOne ? numberWithCommas(typeOne / 10) : ' '} */}
                                    {numberWithCommas(typeOne / 10)}
                                </Text> {locales('titles.toman')}
                            </Text>
                            {/* </LinearGradient> */}


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
                                {/* <View style={{ flexDirection: 'row-reverse', justifyContent: 'center' }}>
                                    <Text style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18, textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#1DA1F2'
                                    }}>
                                        {locales('labels.abilityToBuyThreeMonth')}
                                    </Text>
                                </View> */}


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
                                        // onPress={() => this.pay(1)}
                                        onPress={_ => this.setState({ paymentType: 1 }, _ => this.pay(1))}
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
                                {/* {locales('titles.promoteDescriptionTitle')} */}
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