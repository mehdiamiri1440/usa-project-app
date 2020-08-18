import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils';
import * as homeActions from '../../../redux/home/actions';
import ENUMS from '../../../enums';

const Dashboard = props => {


    useEffect(() => {
        analytics().logEvent('dashboard');
        props.fetchAllDashboardData()
        // .catch(_ => setShowModal(true));
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
        active_pakage_type: activePackageType = 0,
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
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => props.navigation.goBack()}
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
                style={{ paddingHorizontal: 30, paddingTop: 30 }}
            >

                <Card transparent  >
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            minHeight: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.yourActiveRegistration')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {ENUMS.PACKAGES_TYPES.list.find(item => item.value == activePackageType).title}
                            </Text>
                            <FontAwesome5 name='address-card' size={75} color='#19668E' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: 10,
                                    right: -15
                                }} />
                        </View>
                        {activePackageType < 3 && <TouchableOpacity
                            onPress={() => props.navigation.navigate('PromoteRegistration')}
                            style={{
                                backgroundColor: '#00C569',
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                bottom: 0,
                                height: 40,
                                position: 'absolute',
                                width: '100%'
                            }}>
                            <AntDesign name='arrowup' color='white' size={25} />
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.promoteRegistration')}</Text>
                        </TouchableOpacity>}

                    </View>
                </Card>

                <Card transparent  >
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.countOfRegisterableProducts')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {maxAllowedProductRegisterCount == 0 ? locales('labels.zero') : maxAllowedProductRegisterCount}  {locales('labels.product')}
                            </Text>
                            <FontAwesome5 name='list-ol' size={75} color='#AA49C8' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: 10,
                                    right: -15
                                }} />
                        </View>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('ExtraProductCapacity')}
                            style={{
                                backgroundColor: '#556080',
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                bottom: 0,
                                height: 40,
                                position: 'absolute',
                                width: '100%'
                            }}>
                            <AntDesign name='plus' color='white' size={25} />
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('titles.moreCapacity')}</Text>
                        </TouchableOpacity>

                    </View>
                </Card>

                <Card transparent  >
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.viewableBuyRequests')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                paddingVertical: 0,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {maxBuyAdsReply} {locales('labels.response')}
                            </Text>
                            <FontAwesome5 name='list-alt' size={75} color='#D8A679' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: -15,
                                    right: -15
                                }} />
                        </View>

                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('ExtraBuyAdCapacity')}
                            style={{
                                backgroundColor: '#556080',
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                bottom: 0,
                                height: 40,
                                position: 'absolute',
                                width: '100%'
                            }}>
                            <AntDesign name='plus' color='white' size={25} />
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('titles.moreCapacity')}</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                <Card transparent  >
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.authorizedSeller')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {isValid ? locales('titles.yes') : locales('titles.no')}
                            </Text>
                            <FontAwesome5 name='award' size={75} color='#21AD93' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: 0,
                                    right: -15
                                }} />
                        </View>


                    </View>
                </Card>

                <Card transparent  >
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.authorizationLevel')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {reputationScore}
                            </Text>
                            <FontAwesome5 name='star' size={75} color='#00C5BE' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: 0,
                                    right: -15
                                }} />
                        </View>


                    </View>
                </Card>

                <Card transparent style={{
                    marginBottom: 40
                }}>
                    <View
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: '#fff',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            elevation: 1
                        }}>

                        <View>
                            <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>
                                {locales('titles.registeredProductsCount')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {confirmedProductsCount == 0 ? locales('labels.zero') : confirmedProductsCount}
                            </Text>
                            <FontAwesome5 name='list-ol' size={75} color='#FFAC58' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: 0,
                                    right: -15
                                }} />
                        </View>


                    </View>
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