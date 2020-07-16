import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';



const NoConnection = props => {

    return (

        < Portal >
            <Dialog
                visible={props.showModal}
            >
                <Dialog.Actions style={{ justifyContent: 'center', borderBottomWidth: 0.7, borderBottomColor: '#777777' }}>
                    <Paragraph style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        paddingTop: 30, textAlign: 'center', fontSize: 24,
                        color: 'red'
                    }}>
                        {locales('errors.error')}</Paragraph>
                </Dialog.Actions>
                <Dialog.Actions style={{
                    width: '100%',
                }}>
                    <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textAlign: 'center', fontSize: 16 }}>
                        {locales('titles.lostConectivity')}
                    </Text>

                </Dialog.Actions>
                <Dialog.Actions style={{ justifyContent: 'center', width: '100%' }}>
                    <Button
                        style={[styles.loginButton, { width: '90%' }]}
                        onPress={() => {
                            props.closeModal();
                        }}>
                        <Text style={styles.buttonText}>{locales('titles.retry')}
                        </Text>
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal >


    )
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
        backgroundColor: '#00C569',
        width: deviceWidth * 0.7,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center',

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


export default NoConnection;