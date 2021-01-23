import React, { createRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, BackHandler, Linking, RefreshControl } from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { connect } from 'react-redux';
import { Card, Button } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import analytics from '@react-native-firebase/analytics';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';

class PromoteRegistration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    wrapperRef = createRef();

    componentDidMount() {
        analytics().logEvent('package_payment');
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener()
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

    closeModal = _ => {
        this.setState({ showModal: false });
        this.props.fetchAllDashboardData()
    };

    handleScrollToTopButtonClick = () => {
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.scrollTo({ x: 0, y: deviceHeight * 0.55, animate: true })
        }
    }

    render() {

        let {
            dashboard
        } = this.props;

        let {
            active_package_type: activePackageType = 0,
        } = dashboard;

        return (
            <>

                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />


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
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
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

                <ScrollView
                    ref={this.wrapperRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.dashboardLoading}
                            onRefresh={() => this.props.fetchAllDashboardData()
                                // .catch(_ => this.setState({ showModal: true }))
                            }
                        />
                    }
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
                            // marginTop: 15,
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
                                {locales('titles.promoteDescriptionTitle')}

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
                                    {locales('titles.promoteDescriptionTextFirst')}

                                </Text>
                                <Text style={{
                                    color: '#e41c38'
                                }}>
                                    {locales('titles.promoteDescriptionTextSecend')}
                                </Text>
                                {locales('titles.promoteDescriptionTextThird')}
                                <Text style={{
                                    color: '#00c569'
                                }}>
                                    {locales('titles.promoteDescriptionTextFourth')}

                                </Text>
                                {locales('titles.promoteDescriptionTextFifth')}

                            </Text>
                            <Button
                                style={[styles.loginButton, { width: '70%', marginBottom: 30, alignSelf: 'center' }]}
                                onPress={() => this.handleScrollToTopButtonClick()}>
                                <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.promoteDescriptionButton')}
                                </Text>
                            </Button>
                        </View>
                    </Card>
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
                                        7
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
                                        30
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
                                        <Ionicons name='ios-checkmark-circle' size={30} color='#00C569' />
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
                                        689,000
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
                                        onPress={() => this.pay()}>
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
                                        249,000
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
                                    }}>/ {locales('titles.monthly')}</Text>
                                </View>


                                {activePackageType == 1 ? <Text style={{
                                    color: '#00C569', fontSize: 20,
                                    width: '100%', textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}>{locales('labels.inUse')}</Text>
                                    :
                                    <Button
                                        style={[styles.loginButton, { width: '50%', marginBottom: 30, alignSelf: 'center' }]}
                                        onPress={() => this.pay(1)}>
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                        </Text>
                                    </Button>
                                }
                            </View>
                        </View>
                    </Card>


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
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteRegistration)