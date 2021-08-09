import React,
{
    useState
} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Linking,
    ActivityIndicator
} from 'react-native';
import {
    Dialog,
    Portal,
    Paragraph
} from 'react-native-paper';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import * as profileActions from '../../redux/profile/actions';

import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { formatter } from '../../utils';

const PaymentTypeModal = props => {

    const {
        bankUrl = '',
        setFlag = _ => { },
        flag = false,
        productId = null,

        walletElevatorPayLoading,

        type = 0,
        body = '',
        title = '',
        successBody = '',
        successTitle = '',
        price = 0
    } = props;

    const [walletPaymentError, setWalletPaymentError] = useState('');

    const [walletPaySuccessMessage, setWalletPaySuccessMessage] = useState('');

    const closeModal = _ => {
        setFlag(false);
        setWalletPaymentError('');
    };

    const bankPay = () => {
        return Linking.canOpenURL(bankUrl)
            .then(supported => {
                if (supported) {
                    Linking.openURL(bankUrl);
                }
            })
    };

    const doWalletPay = _ => {

        let url = '', params;

        switch (type) {

            case 0: {
                url = 'walletElevatorPay';
                params = productId;
                break
            };

            case 1: {
                url = 'promoteRegistrationWalletPay';
                params = null;
                break
            };

            case 2: {
                url = 'productCapacityWalletPay';
                params = null;
                break
            };

            case 3: {
                url = 'promoteRegistrationWalletPay';
                params = null;
                break
            };

            case 4: {
                url = 'buyAdCapacityWalletPay';
                params = null;
                break
            };

            default:
                break;
        };

        return props[url](params)
            .then(_ => {
                setWalletPaymentError('');
                setWalletPaySuccessMessage(successBody);

                setTimeout(() => {
                    props.fetchUserProfile();
                    setWalletPaySuccessMessage('');
                    setFlag(false);
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
                    setWalletPaymentError(msg);
                    setWalletPaySuccessMessage('');
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
                    visible={flag}
                    onDismiss={closeModal}
                    style={[styles.dialogWrapper, { display: !walletPaySuccessMessage ? 'flex' : 'none' }]}
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
                            {title}
                        </Paragraph>
                    </Dialog.Actions>

                    <Text style={{
                        width: '100%', textAlign: 'center',
                        marginTop: 15,
                        fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569'
                    }}>
                        {formatter.numberWithCommas(price)} {locales('titles.toman')}
                    </Text>

                    <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                        <Text style={styles.mainTextDialogModal}>
                            {body}
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
                                return setTimeout(() => bankPay(), 1000);
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
                            onPress={_ => doWalletPay()}
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

                    {walletPaymentError ? <Text
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginVertical: 15,
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#E41C38'
                        }}
                    >
                        {walletPaymentError}
                    </Text>
                        : null}

                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={styles.modalCloseButton}
                            onPress={() => setFlag(false)}
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
                    visible={!!walletPaySuccessMessage}
                    style={styles.dialogWrapper}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >
                        <Button
                            onPress={() => setWalletPaySuccessMessage('')}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>
                        <Paragraph style={styles.headerTextDialogModal}>
                            {successTitle}
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
                    <Dialog.Actions style={[styles.mainWrapperTextDialogModal, { paddingBottom: 10 }]}>

                        <Text style={styles.mainTextDialogModal}>
                            {walletPaySuccessMessage}
                        </Text>

                    </Dialog.Actions>
                </Dialog>
            </Portal >
        </>
    )
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
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
    } = profileReducer;

    return {
        walletElevatorPayLoading,
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        walletElevatorPay: productId => dispatch(profileActions.walletElevatorPay(productId)),
        buyAdCapacityWalletPay: _ => dispatch(profileActions.buyAdCapacityWalletPay()),
        productCapacityWalletPay: _ => dispatch(profileActions.productCapacityWalletPay()),
        promoteRegistrationWalletPay: _ => dispatch(profileActions.promoteRegistrationWalletPay()),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentTypeModal);