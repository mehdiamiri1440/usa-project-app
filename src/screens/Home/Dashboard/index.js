import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../../utils';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import * as homeActions from '../../../redux/home/actions';
import Spin from '../../../components/loading/loading';
import ENUMS from '../../../enums';

const Dashboard = props => {


    useEffect(() => {
        props.fetchAllDashboardData();
    },
        [])


    let {
        dashboardLoading,
        dashboardError,
        dashboardFailed,
        dashboardMessage,
        dashboard
    } = props;

    let {
        active_package_type: activePackageType = 0,
        reputation_score: reputationScore,
        accessable_buyAds: accessableBuyAds,
        is_valid: isValid,
        max_allowed_product_register_count: maxAllowedProductRegisterCount,
        confirmed_products_count: confirmedProductsCount
    } = dashboard;

    return (
        <Spin spinning={dashboardLoading}>
            {dashboardError &&
                <View style={styles.loginFailedContainer}>
                    <Text style={styles.loginFailedText}>
                        {dashboardMessage}
                    </Text>
                </View>
            }
            {dashboardFailed &&
                <View style={styles.loginFailedContainer}>
                    <Text style={styles.loginFailedText}>
                        {dashboardMessage}
                    </Text>
                </View>
            }
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row-reverse',
                alignContent: 'center',
                alignItems: 'center',
                height: 57,
                shadowOffset: { width: 20, height: 20 },
                shadowColor: 'black',
                shadowOpacity: 1.0,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                    onPress={() => props.navigation.goBack()}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>
                <View style={{
                    width: deviceWidth * 0.6,
                    alignItems: 'flex-end'
                }}>
                    <Text
                        style={{ fontSize: 18 }}
                    >
                        {locales('labels.dashboard')}
                    </Text>
                </View>
            </View>
            <ScrollView style={{ height: deviceHeight * 0.77 }}>

                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }} >
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.yourActiveRegistration')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {ENUMS.PACKAGES_TYPES.list.filter(item => item.value == activePackageType)[0].title}
                                </Text>
                                <AntDesign name='idcard' size={95} color='#19668E' style={{ opacity: 0.3 }} />
                            </View>
                            {activePackageType < 3 && <TouchableOpacity
                                onPress={() => props.navigation.navigate('PromoteRegistration')}
                                style={{
                                    backgroundColor: '#00C569', flexDirection: 'row-reverse',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    bottom: -11,
                                    height: 40,
                                    width: deviceWidth * 0.84,
                                }}>
                                <AntDesign name='arrowup' color='white' size={25} />
                                <Text
                                    style={{ color: 'white', fontFamily: 'Vazir-Bold-FD' }}>
                                    {locales('labels.promoteRegistration')}</Text>
                            </TouchableOpacity>}
                        </Body>
                    </CardItem>
                </Card>
                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }}>
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.countOfRegisterableProducts')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {locales('labels.product')} {maxAllowedProductRegisterCount == 0 ? locales('labels.zero') : maxAllowedProductRegisterCount}
                                </Text>
                                <FontAwesome5 name='list-ol' size={95} color='#AA49C8' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>

                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }}>
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.viewableBuyRequests')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {locales('labels.request')} {accessableBuyAds}
                                </Text>
                                <FontAwesome5 name='list-alt' size={95} color='#D8A679' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>
                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }}>
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.authorizedSeller')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {isValid ? locales('titles.yes') : locales('titles.no')}
                                </Text>
                                <FontAwesome5 name='list-ol' size={95} color='#21AD93' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>

                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }}>
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.authorizationLevel')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {reputationScore}
                                </Text>
                                <AntDesign name='star' size={95} color='#00C5BE' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>
                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }}>
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.registeredProductsCount')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {confirmedProductsCount == 0 ? locales('labels.zero') : confirmedProductsCount}
                                </Text>
                                <FontAwesome5 name='list-ol' size={95} color='#FFAC58' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>

            </ScrollView>
        </Spin>

    )
}


styles = StyleSheet.create({
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
})

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)