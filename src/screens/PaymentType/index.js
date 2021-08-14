import React, {
    useEffect,
    useState
} from 'react';
import {
    View,
    Text,
    ImageBackground,
    Pressable,
    ActivityIndicator,
    Modal,
    StyleSheet,
    Linking
} from 'react-native';
import { connect } from 'react-redux';
import {
    Dialog,
    Paragraph
} from 'react-native-paper';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import Header from '../../components/header';
import { deviceWidth, formatter, deviceHeight } from '../../utils';
import * as profileActions from '../../redux/profile/actions';

const PaymentType = props => {

    const {
        userProfile = {},
        userProfileLoading,

        route = {},

        walletElevatorPayLoading,
        buyAdCapacityWalletPayLoading,
        productCapacityWalletPayLoading,
        promoteRegistrationWalletPayLoading,
    } = props;

    const {
        params = {}
    } = route;

    const {
        price = 0,

        bankUrl = '',
        productId = null,

        type = 0,
        count = 0,
    } = params;

    const {
        user_info = {},
    } = userProfile;

    const {
        wallet_balance = 0,
    } = user_info;

    const [isInventorySufficient, setIsInventorySufficient] = useState(false);

    const [showIncreaseInventoryModal, setShowIncreaseInventoryModal] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(_ => {
        setIsInventorySufficient(wallet_balance > price);

        const focusListener = props.navigation.addListener('focus', handleOnScreenFocused);

        return _ => focusListener;
    }, []);

    const handleOnScreenFocused = _ => {
        props.fetchUserProfile();
    };

    const onPayByWalletClicked = _ => {
        if (!isInventorySufficient)
            setShowIncreaseInventoryModal(true);

        else {
            let url = '', params;

            switch (type) {

                case 0: {
                    url = 'walletElevatorPay';
                    params = productId;
                    break
                };

                case 1: {
                    url = 'promoteRegistrationWalletPay';
                    params = 1;
                    break
                };

                case 2: {
                    url = 'productCapacityWalletPay';
                    params = count;
                    break
                };

                case 3: {
                    url = 'promoteRegistrationWalletPay';
                    params = 3;
                    break
                };

                case 4: {
                    url = 'buyAdCapacityWalletPay';
                    params = count;
                    break
                };

                default:
                    break;
            };

            return props[url](params)
                .then(_ => {
                    props.fetchUserProfile();
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        props.navigation.goBack();
                    }, 2000);
                })
        };
    };

    const bankPay = () => {
        return Linking.canOpenURL(bankUrl)
            .then(supported => {
                if (supported) {
                    Linking.openURL(bankUrl);
                }
            })
    };

    const closeIncreaseInventoryModal = _ => setShowIncreaseInventoryModal(false);

    const navigateToMyWallet = _ => {
        closeIncreaseInventoryModal();
        return props.navigation.navigate('MyBuskool', { screen: 'Wallet' })
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >

            {showIncreaseInventoryModal ?
                <Modal
                    onDismiss={closeIncreaseInventoryModal}
                    onRequestClose={closeIncreaseInventoryModal}
                    visible={showIncreaseInventoryModal}
                    transparent={true}
                >
                    <Dialog
                        onDismiss={closeIncreaseInventoryModal}
                        dismissable
                        visible={showIncreaseInventoryModal}
                        style={styles.dialogWrapper}
                    >

                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={closeIncreaseInventoryModal}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.pay')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                marginTop: 30
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    color: '#E41C38',
                                    fontSize: 18,
                                    marginHorizontal: 5
                                }}
                            >
                                {locales('titles.noSufficientInventory')}.
                            </Text>

                        </View>
                        <Dialog.Actions
                            style={{
                                justifyContent: 'center',
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row-reverse',
                                padding: 0
                            }}>

                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#1DA1F2', '#4DC0BB']}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    width: '75%',
                                    zIndex: 1,
                                    borderRadius: 12,
                                    height: 60,
                                    marginVertical: 30
                                }}
                            >
                                <Button
                                    onPress={navigateToMyWallet}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 12,
                                        flexDirection: 'row-reverse',
                                        backgroundColor: 'transparent',
                                    }}
                                >

                                    <FontAwesome5
                                        name='plus'
                                        solid
                                        color='white'
                                        size={17}
                                    />

                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: 'white',
                                            fontSize: 18,
                                            marginHorizontal: 5
                                        }}
                                    >
                                        {locales('titles.increaseWalletInventory')}
                                    </Text>
                                </Button>
                            </LinearGradient>

                        </Dialog.Actions>

                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={closeIncreaseInventoryModal}
                            >

                                <Text style={styles.closeButtonText}>
                                    {locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Modal >
                :
                null
            }

            {showSuccessModal ?
                <Modal
                    onRequestClose={() => setShowSuccessModal(false)}
                    visible={showSuccessModal}
                    transparent={true}
                    onDismiss={() => setShowSuccessModal(false)}

                >
                    <Dialog
                        onDismiss={() => setShowSuccessModal(false)}
                        dismissable
                        visible={showSuccessModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => setShowSuccessModal(false)}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.pay')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <FontAwesome5
                                name="check-circle"
                                color="#00C569"
                                size={70}
                                style={{
                                    marginVertical: 20
                                }}
                            />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, { marginBottom: 20 }]}>
                                {locales('titles.paymentDoneSuccessfully')}
                            </Text>

                        </Dialog.Actions>
                    </Dialog>
                </Modal >
                :
                null
            }

            <Header
                title={locales('titles.paymentType')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <View
                style={{
                    backgroundColor: 'rgba(55,174,222,0.3)',
                    width: deviceWidth * 0.92,
                    borderRadius: 12,
                    marginTop: 10,
                    alignSelf: 'center'
                }}
            >

                <View
                    style={{
                        backgroundColor: 'rgba(55,174,222,0.3)',
                        width: deviceWidth * 0.95,
                        borderRadius: 12,
                        alignSelf: 'center',
                        marginTop: 10,
                    }}
                >
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        activeOpacity={1}
                        style={{
                            marginTop: 10,
                        }}
                        onPress={_ => props.navigation.navigate('MyBuskool', { screen: 'Wallet' })}
                    >
                        <ImageBackground
                            source={require('../../../assets/images/wallet-bg.jpg')}
                            style={{
                                resizeMode: "cover",
                                width: deviceWidth * 0.98,
                                justifyContent: 'space-between',
                                height: deviceHeight * 0.2,
                                padding: 20,
                                alignSelf: 'center',
                            }}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FontAwesome5
                                        name='wallet'
                                        size={18}
                                        solid
                                        color='white'
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: 'white',
                                            fontSize: 20,
                                            marginHorizontal: 5
                                        }}
                                    >
                                        {locales('titles.walletInventory')}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#F7F7F7',
                                        fontSize: 16,
                                        opacity: 0.3
                                    }}
                                >
                                    Buskool.com
                                </Text>
                            </View>

                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'flex-start',
                                    left: -2,
                                    top: 10
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 8,
                                        padding: 10,
                                        width: '45%',
                                    }}
                                >
                                    <FontAwesome5
                                        name='plus'
                                        size={15}
                                        color='#00C569'
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: '#404B55',
                                            fontSize: 15,
                                            marginHorizontal: 5
                                        }}
                                    >
                                        {locales('titles.increaseInventory')}
                                    </Text>
                                </View>
                            </View>

                            <View>
                                {!userProfileLoading ?
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: 'white',
                                            fontSize: 30,
                                            marginHorizontal: 5,
                                        }}
                                    >
                                        {formatter.numberWithCommas(wallet_balance)} <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                color: 'white',
                                                fontSize: 20,
                                                marginHorizontal: 5,
                                                fontWeight: '200'
                                            }}
                                        >
                                            {locales('titles.toman')}
                                        </Text>
                                    </Text>
                                    :
                                    <ActivityIndicator
                                        size={30}
                                        color='white'
                                        style={{
                                            alignSelf: 'flex-end',
                                        }}
                                    />
                                }
                            </View>
                        </ImageBackground>
                    </Pressable>
                </View>
            </View>

            <View
                style={{
                    marginTop: 35,
                    width: '100%',
                    paddingHorizontal: 10
                }}
            >
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#556080',
                        fontSize: 20,
                    }}
                >
                    {locales('titles.chooseYourPaymentType')}
                </Text>
            </View>

            <Pressable
                onPress={onPayByWalletClicked}
                android_ripple={{
                    color: '#ededed'
                }}
                style={{
                    borderRadius: 12,
                    borderColor: isInventorySufficient ? '#1DA1F2' : '#E0E0E0',
                    borderWidth: 1,
                    marginTop: 35,
                    width: '95%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignSelf: 'center',
                    flexDirection: 'row-reverse',
                    height: 94,
                    backgroundColor: 'white',
                }}
            >

                <View
                    style={{
                        backgroundColor: isInventorySufficient ? '#1DA1F2' : '#E0E0E0',
                        height: '100%',
                        borderTopLeftRadius: 120,
                        borderBottomLeftRadius: 120,
                        borderTopRightRadius: 25,
                        borderBottomRightRadius: 25,
                        width: '17%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FontAwesome5
                        size={35}
                        name='wallet'
                        color='white'
                    />
                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        marginHorizontal: 20
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#424750',
                            fontSize: 19,
                        }}
                    >
                        {locales('titles.wallet')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#6D7179',
                            fontSize: 14,
                        }}
                    >
                        {locales('labels.transferAmongWallet')}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: isInventorySufficient ? '#00C569' : '#E41C38',
                            fontSize: 14,
                            marginHorizontal: 5
                        }}
                    >
                        {isInventorySufficient ? locales('titles.SufficientInventory') : locales('titles.noSufficientInventory')}
                    </Text>
                    {
                        buyAdCapacityWalletPayLoading ||
                            productCapacityWalletPayLoading ||
                            promoteRegistrationWalletPayLoading ||
                            walletElevatorPayLoading
                            ?
                            <ActivityIndicator
                                size={20}
                                color='#6D7179'
                            />
                            :
                            <FontAwesome5
                                name='angle-left'
                                size={20}
                                color='#6D7179'
                            />
                    }
                </View>

            </Pressable>


            <Pressable
                onPress={bankPay}
                android_ripple={{
                    color: '#ededed'
                }}
                style={{
                    borderRadius: 12,
                    borderColor: '#21AD93',
                    borderWidth: 1,
                    marginTop: 35,
                    width: '95%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignSelf: 'center',
                    flexDirection: 'row-reverse',
                    height: 94,
                    backgroundColor: 'white',
                }}
            >

                <View
                    style={{
                        backgroundColor: '#4DC0BB',
                        height: '100%',
                        borderTopLeftRadius: 120,
                        borderBottomLeftRadius: 120,
                        borderTopRightRadius: 25,
                        borderBottomRightRadius: 25,
                        width: '17%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FontAwesome5
                        size={35}
                        solid
                        name='credit-card'
                        color='white'
                    />
                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        marginHorizontal: 20
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#424750',
                            fontSize: 19,
                        }}
                    >
                        {locales('titles.internetPayment')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#6D7179',
                            fontSize: 14,
                        }}
                    >
                        {locales('titles.onlineWithAllCreditCards')}
                    </Text>
                </View>


                <FontAwesome5
                    name='angle-left'
                    size={20}
                    color='#21AD93'
                    style={{
                        left: '100%'
                    }}
                />

            </Pressable>

        </View>
    )
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        width: '100%',
        textAlign: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        maxWidth: 145,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
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

const mapStateToProps = ({
    profileReducer
}) => {

    const {
        userProfile = {},
        userProfileLoading,

        walletElevatorPayLoading,
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,

        buyAdCapacityWalletPayLoading,
        productCapacityWalletPayLoading,
        promoteRegistrationWalletPayLoading
    } = profileReducer;

    return {
        userProfile,
        userProfileLoading,

        walletElevatorPayLoading,
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,

        buyAdCapacityWalletPayLoading,
        productCapacityWalletPayLoading,
        promoteRegistrationWalletPayLoading,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        walletElevatorPay: productId => dispatch(profileActions.walletElevatorPay(productId)),
        buyAdCapacityWalletPay: count => dispatch(profileActions.buyAdCapacityWalletPay(count)),
        productCapacityWalletPay: count => dispatch(profileActions.productCapacityWalletPay(count)),
        promoteRegistrationWalletPay: type => dispatch(profileActions.promoteRegistrationWalletPay(type)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentType)