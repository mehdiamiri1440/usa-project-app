import React from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet, Animated, TouchableOpacity, BackHandler } from 'react-native';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Dialog } from 'react-native-paper';
import Svg, {
    Path
} from 'react-native-svg';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import analytics from '@react-native-firebase/analytics';

import * as registerProductActions from '../../../redux/registerProduct/actions';
import * as homeActions from '../../../redux/home/actions';
import * as profileActions from '../../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { BuskoolButton } from '../../../components';

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
                {showModal ?
                    <Modal
                        onRequestClose={this.hideDialog}
                        visible={showModal}
                        transparent={true}
                        animationType="fade"
                        onDismiss={this.hideDialog}
                    >
                        <Dialog
                            visible={showModal}
                            onDismiss={this.hideDialog}
                            style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 40) }}
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
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="94"
                                height="87"
                                fill="none"
                                style={{
                                    alignSelf: 'center',
                                    top: -35
                                }}
                                viewBox="0 0 77 76"
                            >
                                <Path
                                    fill="#DEE9FF"
                                    d="M19.412 12.717s11.486 8.716 28.946-7.58c15.507-14.474 28.169 8.361 28.257 19.297.115 14.165-15.506 25.5-7.925 34.804 7.58 9.304-15.035 24.668-27.224 11.372-15.162-16.541-19.27-3.102-27.912-3.102-6.203 0-18.938-15.412-10.338-26.878 7.237-9.649 3.29-12.851 1.379-16.196-2.757-4.825 3.79-17.92 14.817-11.717z"
                                ></Path>
                                <Path
                                    fill="#418DF9"
                                    d="M37.995 32.534v32.343L12.883 54.031l.12-32.226 24.992 10.73z"
                                ></Path>
                                <Path
                                    fill="#A2BDFF"
                                    d="M37.995 32.554v32.343l24.99-10.472V21.908l-24.99 10.646z"
                                ></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M37.995 32.535l25.111-10.518-24.914-11.044-25.309 10.78 25.112 10.782z"
                                ></Path>
                                <Path
                                    fill="#418DF9"
                                    d="M22.35 17.722L47.365 28.61l.228 7.935 6.999-2.888-.212-7.985-25.756-10.623-6.274 2.673z"
                                ></Path>
                                <Path
                                    fill="#fff"
                                    d="M45.94 44.158c.397 0 .718-.587.718-1.31 0-.724-.321-1.31-.717-1.31-.397 0-.718.586-.718 1.31 0 .723.321 1.31.718 1.31zM57.506 39.446c.397 0 .718-.587.718-1.31 0-.724-.321-1.31-.718-1.31-.397 0-.718.586-.718 1.31 0 .723.322 1.31.718 1.31zM50.1 51.076l-.466-.181c1.033-2.66 2.328-4.124 3.85-4.354 1.456-.22 2.682.783 3.127 1.344l-.392.31c-.308-.388-1.385-1.352-2.66-1.16-1.313.199-2.509 1.596-3.459 4.04z"
                                ></Path>
                            </Svg>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={[styles.mainTextDialogModal, {
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 19,
                                    color: '#15313C',
                                    top: -25

                                }]}>
                                    {locales('titles.maximumProductRegisteration')}
                                </Text>

                            </Dialog.Actions>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={{
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    textAlign: 'center',
                                    fontSize: 15,
                                    color: '#15313C',
                                    paddingHorizontal: 15,
                                    width: '100%',
                                    top: -30
                                }}>
                                    {locales('titles.clickExtraCapacityButton')}
                                </Text>
                            </Dialog.Actions>

                            <BuskoolButton
                                style={[styles.modalButton, styles.greenButton, {
                                    width: '65%',
                                    top: -30,
                                    marginBottom: 30,
                                    borderRadius: 8,
                                    height: 45,
                                    elevation: 0
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
                            </BuskoolButton>

                        </Dialog>
                    </Modal>
                    : null}






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