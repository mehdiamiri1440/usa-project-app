import React from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet, Animated, TouchableOpacity, BackHandler } from 'react-native';
import { Button } from 'native-base';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Dialog, Portal } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import analytics from '@react-native-firebase/analytics';

import * as registerProductActions from '../../../redux/registerProduct/actions';
import * as homeActions from '../../../redux/home/actions';
import * as profileActions from '../../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

class GuidToRegisterProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            animation: new Animated.Value(0)
        }
    }

    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
            Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
                if (componentType === 'Component') {
                    analytics().logScreenView({
                        screen_name: componentName,
                        screen_class: componentName,
                    });
                }
            });
            analytics().logScreenView({
                screen_name: "GuidToRegisterProduct",
                screen_class: "GuidToRegisterProduct",
            });
            this.animateTheArrow();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey && (!prevProps.route || !prevProps.route.params))
            ||
            (prevProps.route && prevProps.route.params && this.props.route && this.props.route.params &&
                this.props.route.params.needToRefreshKey != prevProps.route.params.needToRefreshKey
            )
        ) {
            this.props.fetchAllDashboardData()
            this.props.fetchUserProfile()
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
    }


    handleHardWareBackButtonPressed = _ => {

    };

    animateTheArrow = _ => {
        const { animation } = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 10,
                    useNativeDriver: true,
                    duration: 500,
                    tension: 1,
                    friction: 1
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                    tension: 1,
                    friction: 1
                })
            ]),
        ).start();
    };

    onSubmit = () => {
        let { checkUserPermissionToRegisterProduct, changeStep } = this.props;

        checkUserPermissionToRegisterProduct().then((result) => {
            if (result.payload.status && !result.payload.is_limited) {
                this.props.resetAndChangeStep();
            }
            else {
                this.setState({ showModal: true })
            }
        })
    };



    hideDialog = () => this.setState({ showModal: false });

    render() {
        const animationStyles = {
            transform: [
                { translateY: this.state.animation }
            ]
        };

        let {
            userPermissionToRegisterProductLoading,
            userPermissionToRegisterProductError,
            userProfileLoading
        } = this.props;
        let { showModal } = this.state;

        return (
            <>
                <Portal
                    style={{
                        padding: 0,
                        margin: 0
                    }}>
                    <Dialog
                        visible={showModal}
                        onDismiss={this.hideDialog}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={{
                                alignSelf: 'flex-end',
                                paddingRight: 15,
                                paddingTop: 15
                            }}
                        >
                            <AntDesign
                                onPress={this.hideDialog}
                                name="close"
                                color="#264653"
                                solid
                                size={22}
                            />
                        </Dialog.Actions>


                        <Image
                            source={require('../../../../assets/icons/E-Commerce.png')}
                            style={{
                                alignSelf: 'center'
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 18,
                                color: '#15313C',

                            }]}>
                                {locales('titles.maximumProductRegisteration')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 14,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%'
                            }}>
                                {locales('titles.clickExtraCapacityButton')}
                            </Text>
                        </Dialog.Actions>

                        <Button
                            style={[styles.modalButton, styles.greenButton, {
                                width: '55%',
                                marginBottom: 35
                            }]}
                            onPress={() => {
                                this.hideDialog();
                                this.props.navigation.navigate('ExtraProductCapacity');
                            }}
                        >

                            <Text style={[styles.buttonText, {
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)',
                            }]}>{locales('titles.increaseCapacity')}
                            </Text>
                        </Button>

                    </Dialog>
                </Portal >





                {/* <View style={{ width: deviceWidth, paddingVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 28 }}>
                        {locales('labels.registerProduct')}
                    </Text>
                </View> */}
                <View style={{ height: deviceHeight / 1.3, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>



                    {/* <View
                        style={{
                            width: deviceWidth,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                width: '70%',
                                fontSize: 16,
                                textAlign: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            {locales('titles.sellerHintToRegisterProduct')}
                        </Text>
                    </View> */}


                    <View
                        style={{
                            width: deviceWidth,
                            alignSelf: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 40,
                            alignItems: 'center',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlignVertical: 'center',
                                fontSize: 18,
                                color: '#374761'
                            }}
                        >
                            {locales('labels.noRelateRequstFoundFirst')}
                        </Text>
                        <Text

                            style={{
                                textAlignVertical: 'center',
                                color: '#e41c38',
                                paddingHorizontal: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlign: 'center',
                                fontSize: 18,
                                color: '#000546'
                            }}
                        >
                            {locales('labels.buyer')}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlignVertical: 'center',
                                fontSize: 18,
                                color: '#374761'
                            }}
                        >
                            {locales('labels.noRelateRequstFoundSecond')}
                        </Text>
                    </View>


                    <View
                        style={{
                            marginTop: 30,
                            width: deviceWidth,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{

                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 17,
                                textAlign: 'center',
                                flexWrap: 'wrap',
                                color: '#000546'
                            }}
                        >
                            {locales('titles.registerYourProductNow')}

                        </Text>

                        {/* <View style={{
                            textAlign: 'left',
                            alignItems: 'flex-start',
                            width: deviceWidth - 50,
                        }}>
                            <Image source={require('../../../../assets/images/arrow-mobile.png')} />

                        </View> */}
                    </View>
                    <Animated.View useNativeDriver style={[animationStyles]}

                    >
                        <FontAwesome5
                            name='arrow-down'
                            size={30}
                            color='#FF9828'
                            style={{ marginTop: 20, marginBottom: 10 }}
                        />
                    </Animated.View>
                    <TouchableOpacity
                        style={{ alignSelf: 'center' }}
                        activeOpacity={1}
                        onPress={() => !userProfileLoading && this.onSubmit()}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            style={[styles.loginButton, { width: 240, height: 55 }]}
                            end={{ x: 0.8, y: 0.2 }}
                            colors={['#FF9727', '#FF6701']}
                        >
                            <FontAwesome name='plus-square' size={25} color='white' style={{ marginHorizontal: 9 }} />
                            <Text style={[styles.buttonText, { fontSize: 18 }]}>{locales('titles.registerNewProduct')}</Text>
                            <ActivityIndicator size="small" color="white"
                                animating={!!userPermissionToRegisterProductLoading}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    fontSize: 20,
                                    marginLeft: -30
                                }}
                            />
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
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
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        fontSize: 20,
    },
    backButtonText: {
        color: '#7E7E7E',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#FF9828',
        width: deviceWidth * 0.7,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        flexDirection: 'row-reverse',
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
        marginBottom: 0
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
        fontSize: 16,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 0,
        alignSelf: 'center',
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
        backgroundColor: '#ddd',
        marginTop: 10
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
        backgroundColor: '#FF9828',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
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
        padding: 20,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    }
});


const mapStateToProps = (state) => {
    return {
        userPermissionToRegisterProductLoading: state.registerProductReducer.userPermissionToRegisterProductLoading,
        userPermissionToRegisterProductMessage: state.registerProductReducer.userPermissionToRegisterProductMessage,
        userPermissionToRegisterProductError: state.registerProductReducer.userPermissionToRegisterProductError,
        userPermissionToRegisterProductFailed: state.registerProductReducer.userPermissionToRegisterProductFailed,
        isUserLimitedToRegisterProduct: state.registerProductReducer.isUserLimitedToRegisterProduct,
        userPermissionToRegisterProductStatus: state.registerProductReducer.userPermissionToRegisterProductStatus,
        userProfileLoading: state.profileReducer.userProfileLoading,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkUserPermissionToRegisterProduct: () => dispatch(registerProductActions.checkUserPermissionToRegisterProduct()),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        fetchAllDashboardData: _ => dispatch(homeActions.fetchAllDashboardData()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GuidToRegisterProduct);