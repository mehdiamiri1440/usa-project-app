import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
} from 'react-native';
import { Button } from 'native-base';
import {
    Dialog,
    Paragraph
} from 'react-native-paper';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../utils';

const ContactsListModal = props => {

    const {
        visible,
        onRequestClose = _ => { },
        onReject = _ => { },
        navigation = {},
        sharingUrlPostFix = ''
    } = props;

    const {
        navigate = _ => { }
    } = navigation;


    const navigateToUserContacts = _ => {
        onRequestClose();
        navigate('MyBuskool', {
            screen: 'UserContacts', params: {
                sharingUrlPostFix
            }
        });
    };

    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={onRequestClose}
            onDismiss={onRequestClose}
        >
            <Dialog
                onDismiss={onRequestClose}
                dismissable
                visible={visible}
                style={styles.dialogWrapper}
            >

                <Dialog.Actions
                    style={styles.dialogHeader}
                >
                    <Button
                        onPress={onRequestClose}
                        style={styles.closeDialogModal}>
                        <FontAwesome5 name="times" color="#777" solid size={18} />
                    </Button>
                    <Paragraph style={styles.headerTextDialogModal}>
                        {locales('labels.chooseShareWay')}
                    </Paragraph>
                </Dialog.Actions>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>

                    <FontAwesome5 name="handshake" solid color="#FFBB00" size={70} />

                </View>
                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                    <Text style={styles.mainTextDialogModal}>
                        {locales('labels.youCanSendToYourContacts')}
                    </Text>

                </Dialog.Actions>
                <Dialog.Actions
                    style={{
                        justifyContent: 'center',
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        padding: 0
                    }}>
                    <Button
                        onPress={navigateToUserContacts}
                        style={[styles.loginButton, { width: '45%' }]}
                    >

                        <Text style={[styles.closeButtonText, { color: 'white' }]}>
                            {locales('labels.allowed')}
                        </Text>
                    </Button>
                    <Button
                        onPress={onReject}
                        style={[styles.loginButton, { width: '45%', backgroundColor: '#BEBEBE', elevation: 0 }]}
                    >

                        <Text style={[styles.closeButtonText, { color: 'white', elevation: 0 }]}>
                            {locales('labels.noJustCopy')}
                        </Text>
                    </Button>
                </Dialog.Actions>
            </Dialog>

        </Modal>
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

export default ContactsListModal;