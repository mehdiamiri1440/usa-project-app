import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Linking,
    ActivityIndicator
} from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import * as profileActions from '../../redux/profile/actions';

import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { formatter, deviceWidth, deviceHeight } from '../../utils';

const PaymentTypeModal = props => {

    const {
        url = '',
        setElevatorFlag = _ => { },
        elevatorFlag = false,
        productId = null,

        walletElevatorPayLoading,
        userProfile
    } = props;

    const [walletElevatorPaymentError, setWalletElevatorPaymentError] = useState('');

    const [walletElevatorPaySuccessMessage, setWalletElevatorPaySuccessMessage] = useState('');

    const closeModal = _ => {
        setElevatorFlag(false);
        setWalletElevatorPaymentError('');
    };

    const elevatorPay = () => {
        return Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                }
            })
    };

    const doWalletElevatorPay = _ => {
        props.walletElevatorPay(productId).then(_ => {
            setWalletElevatorPaymentError('');
            setWalletElevatorPaySuccessMessage(locales('titles.walletElevatorPaymentSuccessMessage'));
            setTimeout(() => {
                props.fetchUserProfile();
                setWalletElevatorPaySuccessMessage('');
                setElevatorFlag(false);
            }, 3000);
        })
            .catch(error => {
                const {
                    response = {}
                } = error;
                const {
                    data = {}
                } = response;
                const {
                    msg,
                    status
                } = data;
                if (status == false) {
                    setWalletElevatorPaymentError(msg);
                    setWalletElevatorPaySuccessMessage('');
                }
            });
    };

    return (
        <>
            < Portal
                style={{
                    padding: 0,
                    margin: 0,
                }}>
                <Dialog
                    visible={elevatorFlag}
                    onDismiss={closeModal}
                    style={[styles.dialogWrapper, { display: !walletElevatorPaySuccessMessage ? 'flex' : 'none' }]}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >

                        <Button
                            onPress={closeModal}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>


                        <Paragraph style={styles.headerTextDialogModal}>
                            {locales('labels.doElevation')}
                        </Paragraph>
                    </Dialog.Actions>

                    <Text style={{
                        width: '100%', textAlign: 'center',
                        marginTop: 15,
                        fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569'
                    }}>
                        {formatter.numberWithCommas(25000)} {locales('titles.toman')}
                    </Text>

                    <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                        <Text style={styles.mainTextDialogModal}>
                            {locales('titles.elevationText')}
                        </Text>

                    </Dialog.Actions>
                    <View style={{
                        width: '100%',
                        textAlign: 'center',
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <Button
                            style={[styles.modalButton, styles.greenButton]}
                            onPress={_ => {
                                closeModal();
                                return setTimeout(() => elevatorPay(), 1000);
                            }
                            }
                        >

                            <Text style={styles.buttonText}>{locales('titles.portalPay')}
                            </Text>
                        </Button>
                        <Button
                            style={[styles.modalButton,
                            {
                                backgroundColor: '#151C2E', width: '50%', maxWidth: 170
                            }]}
                            onPress={_ => doWalletElevatorPay()}
                        >
                            <ActivityIndicator
                                color='white'
                                style={{ position: 'absolute', left: 0 }}
                                size={15}
                                animating={!!walletElevatorPayLoading}
                            />

                            <Text style={styles.buttonText}>
                                {locales('titles.walletPay')}
                            </Text>
                        </Button>
                    </View>

                    {walletElevatorPaymentError ? <Text
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginVertical: 15,
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#E41C38'
                        }}
                    >
                        {walletElevatorPaymentError}
                    </Text>
                        : null}

                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={styles.modalCloseButton}
                            onPress={() => setElevatorFlag(false)}
                        >

                            <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                            </Text>
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >

            <Portal
                style={{
                    padding: 0,
                    margin: 0

                }}>
                <Dialog
                    visible={!!walletElevatorPaySuccessMessage}
                    style={styles.dialogWrapper}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >
                        <Button
                            onPress={() => setWalletElevatorPaySuccessMessage('')}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>
                        <Paragraph style={styles.headerTextDialogModal}>
                            {locales('labels.doElevation')}
                        </Paragraph>
                    </Dialog.Actions>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>

                        <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                            borderColor: '#edf8e6',
                        }]} />

                    </View>
                    <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                        <Text style={styles.mainTextDialogModal}>
                            {walletElevatorPaySuccessMessage}
                        </Text>

                    </Dialog.Actions>
                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={styles.modalCloseButton}
                            onPress={() => setWalletElevatorPaySuccessMessage('')}
                        >

                            <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                            </Text>
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >
        </>
    )
};

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
        justifyContent: 'center',
        elevation: 0
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        color: 'white',
        elevation: 0
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
        maxWidth: 145,
        marginVertical: 10,
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
        backgroundColor: '#00C569',
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
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize15: {
        fontSize: 15
    },
    textSize18: {
        fontSize: 18
    },
    textSize20: {
        fontSize: 20
    },
});

const mapStateToProps = ({
    profileReducer
}) => {
    const {
        walletElevatorPayLoading,
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,

        userProfile
    } = profileReducer;

    return {
        walletElevatorPayLoading,
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,

        userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        walletElevatorPay: productId => dispatch(profileActions.walletElevatorPay(productId)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentTypeModal);