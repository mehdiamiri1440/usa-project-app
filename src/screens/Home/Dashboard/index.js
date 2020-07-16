import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils';
import * as homeActions from '../../../redux/home/actions';
import ENUMS from '../../../enums';

const Dashboard = props => {


    useEffect(() => {
        props.fetchAllDashboardData().catch(_ => setShowModal(true));
    },
        [])

    let [showModal, setShowModal] = useState(false);

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
        max_buyAds_reply: maxBuyAdsReply,
        is_valid: isValid,
        max_allowed_product_register_count: maxAllowedProductRegisterCount,
        confirmed_products_count: confirmedProductsCount
    } = dashboard;

    const closeModal = _ => {
        setShowModal(false);
        props.fetchAllDashboardData();
    };

    return (
        <>
            <NoConnection
                closeModal={closeModal}
                showModal={showModal}
            />
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={props.dashboardLoading}
                        onRefresh={() => props.fetchAllDashboardData()}
                    />
                }
                style={{ height: deviceHeight * 0.77 }}>

                <Card style={{ alignSelf: 'center' }}>
                    <CardItem style={{ width: deviceWidth * 0.85 }} >
                        <Body>
                            <Text style={{ textAlign: 'right', width: '100%', fontSize: 20 }}>
                                {locales('titles.yourActiveRegistration')}
                            </Text>
                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between', paddingVertical: 20 }}>
                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
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
                                    style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {maxAllowedProductRegisterCount == 0 ? locales('labels.zero') : maxAllowedProductRegisterCount}  {locales('labels.product')}
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {maxBuyAdsReply} {locales('labels.response')}
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {isValid ? locales('titles.yes') : locales('titles.no')}
                                </Text>
                                <FontAwesome5 name='award' size={95} color='#21AD93' style={{ opacity: 0.3 }} />
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26, paddingLeft: 10,
                                }}>
                                    {confirmedProductsCount == 0 ? locales('labels.zero') : confirmedProductsCount}
                                </Text>
                                <FontAwesome5 name='list-ol' size={95} color='#FFAC58' style={{ opacity: 0.3 }} />
                            </View>
                        </Body>
                    </CardItem>
                </Card>

            </ScrollView>
        </>

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