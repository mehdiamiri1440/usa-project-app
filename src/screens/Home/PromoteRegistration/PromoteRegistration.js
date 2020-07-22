import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Linking, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Card, Body, CardItem, Button } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

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



    pay = () => {
        return Linking.canOpenURL('http://192.168.1.46:3030/app/payment/1/3').then(supported => {
            if (supported) {
                Linking.openURL('http://192.168.1.46:3030/app/payment/1/3');
            }
        })
    };

    closeModal = _ => {
        this.setState({ showModal: false });
        this.props.fetchAllDashboardData()
    };


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
                    height: 57,
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
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.dashboardLoading}
                            onRefresh={() => this.props.fetchAllDashboardData().catch(_ => this.setState({ showModal: true }))}
                        />
                    }
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 15
                    }}
                >


                    <Card >
                        <CardItem>
                            <Body>
                                <View style={{ borderBottomWidth: 3, paddingVertical: 5, borderBottomColor: '#00C569', flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Text style={{
                                            color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18, textAlign: 'center',
                                            textAlignVertical: 'center'
                                        }}>
                                            {locales('titles.annualSpecialRegistration')}
                                        </Text>
                                        <Text style={{
                                            fontSize: 16,
                                            backgroundColor: '#E41C38', color: 'white', paddingBottom: 4,
                                            borderRadius: 20, marginHorizontal: 6, textAlign: 'center',
                                            textAlignVertical: 'center', width: 40
                                        }}>
                                            {locales('labels.special')}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Text style={{
                                            color: '#00C569', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 22, textAlign: 'center',
                                            textAlignVertical: 'center'
                                        }}>
                                            689,000
                                    </Text>
                                        <Text style={{
                                            color: '#666666', fontSize: 16,
                                            textAlign: 'center', marginHorizontal: 5,
                                            textAlignVertical: 'center'
                                        }}>
                                            {locales('titles.toman')}
                                        </Text>
                                    </View>

                                </View>

                                <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%' }}>
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



                                <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%' }}>
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
                                <View style={{ flexDirection: 'row-reverse', marginTop: 10, padding: 10, justifyContent: 'space-between', width: '100%' }}>
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
                                {activePackageType == 3 ? <Text style={{
                                    color: '#00C569', fontSize: 20,
                                    width: '100%', textAlign: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}>{locales('labels.inUse')}</Text>
                                    :
                                    <Button
                                        style={[styles.loginButton, { width: '50%', alignSelf: 'center' }]}
                                        onPress={() => this.pay()}>
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                        </Text>
                                    </Button>
                                }
                            </Body>
                        </CardItem>
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
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteRegistration)