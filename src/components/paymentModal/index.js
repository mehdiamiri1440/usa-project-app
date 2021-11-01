import React, { useEffect } from 'react';
import { Modal, Text, View, Pressable, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as homeActions from '../../redux/home/actions';
import PromoteRegistration from '../../screens/Home/PromoteRegistration/PromoteRegistration';
import CreditCardPayment from '../../screens/Home/PromoteRegistration/CreditCardPayment';


const PaymentModal = props => {

    const closeAndNavigate = _ => {

        const { routeTo = {}, routeParams = {} } = props;
        const { parentScreen, childScreen } = routeTo;

        props.onRequestToClose();

        if (!!routeTo.childScreen) {
            return props.navigation.navigate(parentScreen, { screen: childScreen, ...routeParams });
        }
        props.navigation.navigate(parentScreen, routeParams);
    };

    const { visible } = props;

    useEffect(() => {

        props.fetchAllDashboardData();

        BackHandler.addEventListener('hardwareBackPress', closeAndNavigate);
        return _ => BackHandler.removeEventListener('hardwareBackPress', closeAndNavigate);

    }, []);

    return (
        <Modal
            animationType="fade"
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
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => closeAndNavigate()}
                >
                    <FontAwesome5 name="times" color="#777" solid size={18} />
                </Pressable>

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
            {/* <CreditCardPayment /> */}
        </Modal>
    )
};

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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);