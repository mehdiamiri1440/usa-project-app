import React, { useEffect, useRef } from 'react';
import { Modal, Text, ScrollView, View, TouchableOpacity, StyleSheet, Linking, BackHandler } from 'react-native';
import { Card, Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as homeActions from '../../redux/home/actions';
import PromoteRegistration from '../../screens/Home/PromoteRegistration/PromoteRegistration';
import CreditCardPayment from '../../screens/Home/PromoteRegistration/CreditCardPayment';


const PaymentModal = props => {


    const pay = (type = 3) => {
        let userId = '';
        if (!!props.userProfile && !!props.userProfile.user_info)
            userId = props.userProfile.user_info.id;

        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${userId}/${type}`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/payment/${userId}/${type}`);
            }
        })
    };


    const closeAndNavigate = _ => {

        const { routeTo = {}, routeParams = {} } = props;
        const { parentScreen, childScreen } = routeTo;

        props.onRequestToClose();

        if (!!routeTo.childScreen) {
            return props.navigation.navigate(parentScreen, { screen: childScreen, ...routeParams });
        }
        console.warn('route para', routeParams)
        props.navigation.navigate(parentScreen, routeParams);
    };

    const wrapperRef = useRef('');
    const { visible, dashboard } = props;

    let {
        active_package_type: activePackageType = 0,
    } = dashboard;

    useEffect(() => {

        props.fetchAllDashboardData();

        BackHandler.addEventListener('hardwareBackPress', closeAndNavigate);
        return _ => BackHandler.removeEventListener('hardwareBackPress', closeAndNavigate);

    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={() => closeAndNavigate()}
        >


            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => closeAndNavigate()}
                >
                    <FontAwesome5 name="times" color="#777" solid size={18} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('labels.promoteRegistration')}
                    </Text>
                </View>
            </View>
            <PromoteRegistration isUsedAsComponent showBothPackages {...props} />
            <CreditCardPayment />
            {/* <ScrollView
                contentContainerStyle={{ backgroundColor: '#F6F6F6' }}
                ref={wrapperRef}
                style={{
                    paddingVertical: 30,
                    paddingHorizontal: 15
                }}
            >

                <Card transparent>
                    <View style={{
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        borderRadius: 5,
                        elevation: 2
                    }}>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            colors={['#00C569', '#21AD93']}
                        >
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
                                elevation: 4
                            }}>
                                {locales('labels.special')}
                            </Text>
                            <Text style={{
                                color: '#fff',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.annualSpecialRegistration')}
                            </Text>
                        </LinearGradient>


                        <View style={{
                            paddingHorizontal: 10
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row-reverse', borderBottomWidth: deviceHeight * 0.002,
                                    borderBottomColor: '#bdc4cc', marginTop: 10, padding: 10, justifyContent: 'space-between',
                                    width: '100%'
                                }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlignVertical: 'center', paddingBottom: 5
                                    }}>
                                        {locales('labels.buyAdCount')}
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



                            <View
                                style={{
                                    flexDirection: 'row-reverse', marginTop: 10, padding: 10,
                                    borderBottomWidth: deviceHeight * 0.002, borderBottomColor: '#bdc4cc',
                                    justifyContent: 'space-between', width: '100%'
                                }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                        textAlignVertical: 'center', paddingBottom: 5
                                    }}>
                                        {locales('labels.countOfBuyAdRequests')}
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
                            <View
                                style={{
                                    flexDirection: 'row-reverse', marginTop: 10,
                                    padding: 10, borderBottomWidth: deviceHeight * 0.002, borderBottomColor: '#bdc4cc',
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
                                    </Text>
                                </View>

                                <Text style={{
                                    color: '#666666', fontSize: 20, textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>
                                    <Ionicons name='ios-checkmark-circle' size={30} color='#00C569' />
                                </Text>

                            </View>
                            <View
                                style={{
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
                                        {locales('labels.goldenBuyAdRequests')}
                                    </Text>
                                </View>

                                <Text style={{
                                    color: '#666666', fontSize: 20, textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>
                                    <Ionicons name='ios-checkmark-circle' size={30} color='#00C569' />
                                </Text>

                            </View>



                            <View style={{ flexDirection: 'row-reverse', justifyContent: 'center' }}>
                                <Text style={{
                                    color: '#00C569', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 22, textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>
                                    979,000
                                    </Text>
                                <Text style={{
                                    color: '#666666', fontSize: 16,
                                    textAlign: 'center', marginHorizontal: 5,
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'

                                }}>
                                    {locales('titles.toman')}
                                </Text>
                                <Text style={{
                                    color: '#666666', fontSize: 16,
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>/ {locales('titles.annuan')}</Text>
                            </View>


                            {activePackageType == 3 ? <Text style={{
                                color: '#00C569', fontSize: 20,
                                width: '100%', textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}>{locales('labels.inUse')}</Text>
                                :
                                <Button
                                    style={[styles.loginButton, { width: '50%', marginBottom: 30, alignSelf: 'center' }]}
                                    onPress={() => pay()}>
                                    <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                    </Text>
                                </Button>
                            }
                        </View>
                    </View>
                </Card>

                <Card transparent>
                    <View style={{
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        borderRadius: 5,
                        marginTop: 15,
                        elevation: 2,
                        marginBottom: 50,

                    }}>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            colors={['#556080', '#556080']}
                        >

                            <Text style={{
                                color: '#fff',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginVertical: 7
                            }}>
                                {locales('titles.monthlySpecialRegistration')}
                            </Text>
                        </LinearGradient>


                        <View style={{

                            paddingHorizontal: 10
                        }}>
                            <View style={{ flexDirection: 'row-reverse', borderBottomWidth: deviceHeight * 0.002, borderBottomColor: '#bdc4cc', marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlignVertical: 'center', paddingBottom: 5
                                    }}>
                                        {locales('labels.buyAdCount')}
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



                            <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, borderBottomWidth: deviceHeight * 0.002, borderBottomColor: '#bdc4cc', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                        textAlignVertical: 'center', paddingBottom: 5
                                    }}>
                                        {locales('labels.countOfBuyAdRequests')}
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
                            <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, borderBottomWidth: deviceHeight * 0.002, borderBottomColor: '#bdc4cc', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
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
                                    <Ionicons name='ios-close-circle' size={30} color='#e41c38' />
                                </Text>

                            </View>
                            <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666666', marginHorizontal: 5, textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                        textAlignVertical: 'center', paddingBottom: 5
                                    }}>
                                        {locales('labels.goldenBuyAdRequests')}
                                    </Text>
                                </View>

                                <Text style={{
                                    color: '#666666', fontSize: 20, textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>
                                    <Ionicons name='ios-checkmark-circle' size={30} color='#00C569' />
                                </Text>

                            </View>



                            <View style={{ flexDirection: 'row-reverse', justifyContent: 'center' }}>
                                <Text style={{
                                    color: '#00C569', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 22, textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>
                                    297,000
                                    </Text>
                                <Text style={{
                                    color: '#666666', fontSize: 16,
                                    textAlign: 'center', marginHorizontal: 5,
                                    textAlignVertical: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'

                                }}>
                                    {locales('titles.toman')}
                                </Text>
                                <Text style={{
                                    color: '#666666', fontSize: 16,
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>/ {locales('titles.threeMonths')}</Text>
                            </View>


                            {activePackageType == 1 ? <Text style={{
                                color: '#00C569', fontSize: 20,
                                width: '100%', textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}>{locales('labels.inUse')}</Text>
                                :
                                <Button
                                    style={[styles.loginButton, { width: '50%', marginBottom: 30, alignSelf: 'center' }]}
                                    onPress={() => pay(1)}>
                                    <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                    </Text>
                                </Button>
                            }
                        </View>
                    </View>
                </Card>


                <Card transparent>
                    <View style={{
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        borderRadius: 5,
                        // marginTop: 15,
                        paddingTop: 15,
                        marginBottom: 50,
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
                            {locales('titles.whatIsSpecialPaymentPackage')}

                        </Text>
                        <Text style={{
                            color: '#777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 15,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            marginVertical: 7,
                            paddingHorizontal: 15
                        }}>
                            <Text style={{
                                width: '100%',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',

                            }}>
                                {locales('titles.specialPackagefirstDescription')}

                            </Text>
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: '#00c569'
                            }}>
                                {` ${locales('titles.specialPackageSecondDescription')}`}
                            </Text>
                        </Text>
                    </View>
                </Card>

            </ScrollView>
    */}
        </Modal>
    )
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

        userProfile: state.profileReducer.userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal)