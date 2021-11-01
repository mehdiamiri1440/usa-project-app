import React, { createRef } from 'react';
import { Text, View, ScrollView, StyleSheet, Linking, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Card, InputGroup, Input, Button } from 'native-base';
import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';
import { formatter } from '../../../utils';
import PromoteRegistration from './PromoteRegistration';
import CreditCardPayment from './CreditCardPayment';
import Header from '../../../components/header';
class ExtraBuyAdCapacity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buyAdCount: 1,
            buyAdUnitPice: 25000,
            buyAdTotalCount: 25000,
        }
    }

    wrapperRef = createRef();

    componentDidMount() {
        analytics().logEvent('extra_buyAd_capacity_payment');
    }

    changeCount = type => {
        this.setState({
            buyAdCount: type == 'asc' ? JSON.parse(this.state.buyAdCount) + 1 :
                JSON.parse(this.state.buyAdCount) <= 1 ? 1 : JSON.parse(this.state.buyAdCount) - 1,
        }, () => {
            this.setState({
                disableInputFlag: this.state.buyAdCount * this.state.buyAdUnitPice > 50000000,
                buyAdTotalCount: this.state.buyAdCount * this.state.buyAdUnitPice,

            })
        })
    };

    handleInputChange = value => {
        this.setState({ buyAdCount: value <= 1 ? 1 : value }, () => {
            this.setState({
                disableInputFlag: this.state.buyAdCount * this.state.buyAdUnitPice > 50000000,
                buyAdTotalCount: this.state.buyAdCount * this.state.buyAdUnitPice,
            })
        });
    };
    handleScrollToTopButtonClick = () => {
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.scrollTo({ x: 0, y: deviceHeight * 0.5, animate: true })
        }
    };


    navigateToPaymentType = _ => {
        const {
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            id: userId
        } = user_info;

        const {
            buyAdCount,
        } = this.state;

        this.props.navigation.navigate('PaymentType', {
            price: buyAdCount * 25000,
            type: 4,
            count: buyAdCount,
            bankUrl: `${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/buyAd-reply-capacity/${userId}/${buyAdCount}`
        });
    };

    render() {
        const {
            buyAdCount,
            buyAdTotalCount,
        } = this.state;
        return (
            <>
                <Header
                    title={locales('titles.extra‌BuyAd')}
                    shouldShowAuthenticationRibbonFromProps
                    {...this.props}
                />

                <ScrollView
                    ref={this.wrapperRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.dashboardLoading}
                            onRefresh={() => this.props.fetchAllDashboardData()
                            }
                        />
                    }
                >

                    <Card transparent>
                        <View style={{
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: 5,
                            paddingTop: 15,
                            marginBottom: 30,
                            elevation: 2
                        }}>
                            <Text style={{
                                color: '#333',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.extraBuyAdRequestDescriptionTitle')}

                            </Text>
                            <Text style={{
                                color: '#777',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7,
                                paddingHorizontal: 15
                            }}>
                                {locales('titles.extraBuyAdRequestDescriptionTextFirst')}
                                <Text style={{
                                    color: '#00c569',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                }}>
                                    {locales('titles.extraBuyAdRequestDescriptionTextSecend')}
                                </Text>
                                {locales('titles.is')}

                            </Text>
                            <Button
                                style={[styles.loginButton, { width: '50%', marginBottom: 30, alignSelf: 'center' }]}
                                onPress={() => this.handleScrollToTopButtonClick()}>
                                <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.moreCapacity')}
                                </Text>
                            </Button>
                        </View>
                    </Card>


                    <View>
                        <Card transparent>
                            <View style={{
                                borderRadius: 4,
                                elevation: 3,
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                paddingHorizontal: 5,
                                paddingVertical: 15,
                                marginBottom: 30
                            }}>

                                {/* header contents */}
                                <View >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#00C569',
                                        fontSize: 16
                                    }}>
                                        {locales('titles.extra‌BuyAdCount')}

                                    </Text>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: '#777',
                                        paddingTop: 5,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        fontSize: 14
                                    }}>
                                        {locales('labels.extraBuyAdDescription')}

                                    </Text>
                                </View>
                                {/* end header contents */}

                                <View style={{
                                    paddingHorizontal: 15,
                                    marginVertical: 10
                                }}>
                                    <View style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#E41C38',
                                        borderRadius: 4,
                                    }}>
                                        <Text style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 12,
                                            color: '#fff'

                                        }}>
                                            {locales('titles.extra‌BuyAdCount')}

                                        </Text>
                                        <Text style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 14,
                                            color: '#fff'

                                        }}>
                                            {`${buyAdCount} ${locales('titles.number')}`}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={{
                                        fontSize: 17,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlign: 'center',
                                        marginBottom: 5
                                    }}>
                                        {locales('titles.count')}
                                    </Text>
                                    {/* #region counter  */}
                                    <View style={{
                                        paddingHorizontal: 15
                                    }}>
                                        <InputGroup
                                            regular
                                            style={{
                                                backgroundColor: '#e41c38',
                                                flexDirection: 'row-reverse',
                                                justifyContent: "space-between",
                                                paddingLeft: 0,
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                borderWidth: 2,
                                                borderColor: '#707070'
                                            }}
                                        >

                                            <Button
                                                onPress={() => this.changeCount('asc')}
                                                style={{
                                                    paddingHorizontal: 20,
                                                    height: '100%',
                                                    color: '#333',
                                                    backgroundColor: '#f0f0f0'
                                                }}>
                                                <FontAwesome5 name="plus" solid size={18} />
                                            </Button>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                value={buyAdCount.toString()}
                                                onChangeText={this.handleInputChange}
                                                style={{
                                                    backgroundColor: '#fcfcfc',
                                                    textAlign: "center"
                                                }}>

                                            </Input>
                                            <Button
                                                onPress={() => this.changeCount('desc')}

                                                style={{
                                                    paddingHorizontal: 20,
                                                    height: '100%',
                                                    color: '#333',
                                                    backgroundColor: '#f0f0f0'
                                                }}>
                                                <FontAwesome5 name="minus" solid size={18} />

                                            </Button>
                                        </InputGroup>
                                    </View>
                                    {/* #endregion */}
                                </View>


                                <View style={{
                                    padding: 15
                                }}>

                                    <View>
                                        <Text style={{
                                            fontSize: 17,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            textAlign: 'center',
                                            marginBottom: 5
                                        }}>
                                            {locales('titles.price')}
                                        </Text>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        borderRadius: 4,
                                        backgroundColor: '#efefef',
                                        justifyContent: 'center',
                                        paddingVertical: 5
                                    }}>
                                        <Text
                                            style={{
                                                color: "#00c569",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 23,
                                                paddingHorizontal: 5
                                            }}>
                                            {formatter.numberWithCommas(buyAdTotalCount)}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 18,
                                                paddingTop: 4
                                            }}>
                                            {locales('titles.toman')}

                                        </Text>
                                        <Text
                                            style={{
                                                color: "#333",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 15,
                                                paddingHorizontal: 5,
                                                paddingTop: 8

                                            }}>
                                            ({locales('titles.annuan')})
                                        </Text>
                                    </View>
                                    <View style={{
                                        marginTop: 20
                                    }}>
                                        <Button
                                            style={[styles.loginButton, { margin: 0, alignSelf: 'center' }]}
                                            onPress={this.navigateToPaymentType}
                                        >
                                            <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                            </Text>
                                        </Button>
                                    </View>

                                </View>
                            </View>
                        </Card>

                        <PromoteRegistration isUsedAsComponent={true} showBothPackages={false} {...this.props} />
                    </View>
                </ScrollView>
                {/* <CreditCardPayment /> */}
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
    return {
        dashboardLoading: state.homeReducer.dashboardLoading,
        dashboardError: state.homeReducer.dashboardError,
        dashboardMessage: state.homeReducer.dashboardMessage,
        dashboardFailed: state.homeReducer.dashboardFailed,
        dashboard: state.homeReducer.dashboard,

        userProfile: state.profileReducer.userProfile,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtraBuyAdCapacity)