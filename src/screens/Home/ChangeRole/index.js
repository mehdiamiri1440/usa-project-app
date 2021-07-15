import React, { Component } from 'react';
import { Text, View, BackHandler, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import { Button } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as authActions from '../../../redux/auth/actions';
import * as profileActions from '../../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import Header from '../../../components/header';
class ChangeRole extends Component {

    homeRef = React.createRef();

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackChange)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackChange);
    }

    handleBackChange = _ => {
        this.props.navigation.navigate('MyBuskool', { screen: 'HomeIndex' });
    };

    changeRole = _ => {
        this.props.changeRole().then(_ => {
            this.props.fetchUserProfile().then(_ => {
                const { userProfile = {}, changeRoleLoading } = this.props;
                const { user_info = {} } = userProfile;
                let { is_seller, id } = user_info;
                global.meInfo.is_seller = is_seller;
                global.meInfo.loggedInUserId = id;

                if (this.props.route && this.props.route.params) {
                    const {
                        route
                    } = this.props;
                    const {
                        params
                    } = route;
                    const {
                        parentRoute,
                        childRoute,
                        routeParams
                    } = params;
                    this.props.navigation.navigate(parentRoute, { screen: childRoute, params: { ...routeParams } })
                }
            });
        })
    }

    render() {
        const { userProfile = {}, changeRoleLoading } = this.props;
        const { user_info = {} } = userProfile;
        let { is_seller } = user_info;

        is_seller = is_seller == 0 ? false : true;


        return (
            <View
                ref={this.props.homeRef}
                style={{
                    flex: 1
                }}
            >


                {changeRoleLoading ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size={70}
                            style={{
                                position: 'absolute', left: '42%', top: '40%',
                                elevation: 0,
                                borderColor: 'black',
                                backgroundColor: 'white', borderRadius: 25
                            }}
                            color="#00C569"

                        />
                    </View> : null}

                <Header
                    onBackButtonPressed={() => this.props.navigation.navigate('MyBuskool', { screen: 'HomeIndex' })}
                    title={locales('titles.changeRole')}
                    {...this.props}
                />

                <View style={{
                    padding: 15,
                    margin: 0,
                    paddingTop: 80,
                    backgroundColor: '#fff',
                    flex: 1
                }}>

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>

                        <AntDesign name="exclamation" color="#3fc3ee" size={70} style={[styles.dialogIcon, {
                            borderColor: '#9de0f6',
                        }]} />

                    </View>
                    <View style={styles.mainWrapperTextDialogModal}>
                        <Text style={styles.mainTextDialogModal}>
                            {locales('labels.changeRole', { fieldName: is_seller ? locales('labels.buyer') : locales('labels.seller') })}

                        </Text>

                    </View>
                    <View style={{
                        width: '100%',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Button
                            style={[styles.modalButton, styles.greenButton]}
                            onPress={this.changeRole}
                        >

                            <Text style={styles.buttonText}>
                                {locales('titles.changeRole')}

                            </Text>
                        </Button>
                    </View>
                </View>

            </View>
        )
    }
}




const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        fontSize: 18,
        paddingVertical: 20,
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: '100%',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center',

    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0,
        marginTop: 30

    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'

    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 20,
        marginTop: 15,
        maxWidth: 180,
        marginTop: 30,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd'
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },

});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeRole: _ => dispatch(authActions.changeRole()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
    }
}
const mapStateToProps = (state, ownProps) => {

    return {
        userProfile: state.profileReducer.userProfile,
        changeRoleLoading: state.authReducer.changeRoleLoading,
        changeRoleObject: state.authReducer.changeRoleObject,
        userProfileLoading: state.profileReducer.userProfileLoading,
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <ChangeRole {...props} homeRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)