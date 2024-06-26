import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'native-base';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../../utils';
import * as homeActions from '../../../redux/home/actions';
import ENUMS from '../../../enums';
import Header from '../../../components/header';

const Dashboard = props => {


    useEffect(() => {
        analytics().logEvent('dashboard');
        props.fetchAllDashboardData();
    },
        [])


    let {
        dashboardLoading,
        dashboardError,
        dashboardFailed,
        dashboardMessage,
        dashboard,

        userProfile = {}
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_seller
    } = user_info;

    let {
        active_pakage_type: activePackageType = 0,
        reputation_score: reputationScore,
        max_buyAds_reply: maxBuyAdsReply,
        is_valid: isValid,
        max_allowed_product_register_count: maxAllowedProductRegisterCount,
        confirmed_products_count: confirmedProductsCount,
        access_to_golden_buyAds,
        is_verified
    } = dashboard;



    return (
        <>

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


            <Header
                title={locales('labels.dashboard')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={props.dashboardLoading}
                        onRefresh={() => props.fetchAllDashboardData()}
                    />
                }
                style={{ paddingHorizontal: 30, paddingTop: 30, backgroundColor: 'white' }}
            >

                {
                    is_seller ?
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('UsersSeenMobile')}
                            style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                width: deviceWidth,
                                paddingBottom: 20
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#1DA1F2',
                                    fontSize: 16,
                                }}
                            >
                                {locales('titles.buyersSeenYourContactInfo')}
                            </Text>
                            <FontAwesome5
                                name='angle-left'
                                size={16}
                                style={{ marginRight: 5 }}
                                color='#1DA1F2'
                            />
                        </TouchableOpacity>
                        : null
                }

                <Card transparent  >
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            minHeight: 170,
                            marginBottom: 30,
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
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
                        {activePackageType < 3 && <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={() => props.navigation.navigate('PromoteRegistration')}
                            style={{
                                backgroundColor: '#FF9828',
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
                        </Pressable>}

                    </ShadowView>
                </Card>

                <Card transparent  >
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
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
                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
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
                                {locales('titles.increaseProductRegistrationCapacity')}</Text>
                        </Pressable>

                    </ShadowView>
                </Card>

                <Card transparent  >
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
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

                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
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
                                {locales('titles.increaseReplyCapacity')}</Text>
                        </Pressable>
                    </ShadowView>
                </Card>

                <Card transparent  >
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
                                {locales('titles.authroized')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {is_verified ? locales('titles.yes') : locales('titles.no')}
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

                        {!is_verified ? <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={() => props.navigation.navigate('Authentication')}
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
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.editProfileAuthentication')}</Text>
                        </Pressable> : null}
                    </ShadowView>
                </Card>

                <Card transparent  >
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
                                {locales('titles.accessToGoldens')}
                            </Text>
                        </View>
                        <View >
                            <Text style={{
                                padding: 15,
                                paddingTop: 10,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 26,
                            }}>
                                {access_to_golden_buyAds ? locales('titles.yes') : locales('titles.no')}
                            </Text>
                            <FontAwesome5 name='star' size={75} color='#00C5BE' solid
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: 0.14,
                                    top: -15,
                                    right: -15
                                }} />
                        </View>

                        {!access_to_golden_buyAds ? <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={() => props.navigation.navigate('PromoteRegistration')}
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
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('titles.accessToGoldens')}</Text>
                        </Pressable> : null}
                    </ShadowView>
                </Card>

                <Card transparent style={{
                    marginBottom: 40
                }}>
                    <ShadowView
                        style={{
                            flex: 1,
                            borderRadius: 5,
                            textAlign: 'right',
                            backgroundColor: 'white',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            paddingVertical: 15,
                            height: 170,
                            marginBottom: 30,
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                        }}>

                        <View>
                            <Text style={{
                                paddingHorizontal: 15, fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}>
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
                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={() => props.navigation.navigate('MyProducts')}
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
                            <FontAwesome5 name='list-ol' color='white' size={25} style={{ marginHorizontal: 5 }} />
                            <Text
                                style={{ color: 'white', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.myProducts')}</Text>
                        </Pressable>

                    </ShadowView>
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
        userProfile: state.profileReducer.userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)