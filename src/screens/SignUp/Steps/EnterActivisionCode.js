import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Button, Label } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils';
import Timer from '../../../components/timer';
import { OutlinedTextField } from '../../../components/floatingInput';
import * as authActions from '../../../redux/auth/actions'
import * as profileActions from '../../../redux/profile/actions'
import ENUMS from '../../../enums';




const EnterActivisionCode = (props) => {


    const CELL_COUNT = 4;

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [value, setValue] = useState('');
    const [valueError, setValueError] = useState(null);
    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    let [timerFlag, setTimerFlag] = useState(false)
    let [flag, setFlag] = useState(false)
    let [activisionCode, setActivisionCode] = useState('');

    activisionCodeRef = React.createRef();

    let { verificationCode, message, loading, error, mobileNumber, getAgainLoading } = props


    useEffect(() => {
        if (!!verificationCode) {
            setValue(verificationCode);
        }
    }, [])

    const onSubmit = (value) => {
        if (!value || value.length != 4) {
            setValueError(locales('errors.errorInVerificationCode'))
        }

        else {
            setValueError('')
            props.checkActivisionCode(value, mobileNumber).then((res) => {
                setValueError('');
                if (res.payload.redirected) {
                    props.fastLogin(res.payload).then(_ => {
                        props.fetchUserProfile();
                    })
                }
                else if (res.payload.status) { props.setVerificationCode(value) }
                else if (!res.payload.status) {
                    setValueError(locales('labels.invalidCode'));
                }
            }).catch(err => {
                setValueError(err.data.errors.phone[0])
            })
        }

    };



    return (
        <>
            <Text style={styles.buttonText}>{locales('titles.login')}</Text>

            <Text style={[styles.userText, { marginTop: 12 }]}>
                {locales('messages.enterCode', { fieldName: mobileNumber })}
            </Text>
            {/* {!error && value.length === 4 && flag && message && message.length &&
                <View style={styles.loginFailedContainer}>
                    <Text style={styles.loginFailedText}>
                        {locales('errors.errorInVerificationCode')}
                    </Text>
                </View>
            } */}
            <SafeAreaView style={[styles.root]}>
                <CodeField
                    ref={ref}
                    {...codeProps}
                    value={value}
                    onChangeText={value => {
                        setValueError('');
                        setValue(value);
                        setFlag(false)
                    }}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFiledRoot}
                    keyboardType="number-pad"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell,
                            {
                                borderColor: value.length === 4 && !valueError ? "#155724"
                                    : value.length === 4 && valueError
                                        ? '#de3545' :
                                        "grey"
                            }]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor
                                cursorSymbol="|"
                                delay={500}
                            /> : null)}
                        </Text>
                    )}
                />
                {!!valueError && <Label style={{ fontSize: 14, marginVertical: 5, color: '#D81A1A', textAlign: 'center' }}>{valueError}</Label>}
            </SafeAreaView>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginVertical: 10 }}>
                <Timer
                    min={2}
                    sec={0}
                    isCountDownTimer={true}
                    containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    substitutionTextStyle={{ color: '#1CC625', textAlign: 'center' }}
                    timerStyle={{ color: '#1CC625', fontSize: 18 }}
                    onSubstitution={() => props.checkAlreadySingedUpMobileNumber(mobileNumber)}
                    substitutionText={locales('titles.sendVerificationCodeAgain')}
                />
            </View>
            <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
                <Button
                    onPress={() => {
                        setFlag(true);
                        onSubmit(value)
                    }}
                    style={[value.length !== 4 ? styles.disableLoginButton : styles.loginButton]}
                    rounded
                >
                    <Text style={styles.buttonText}>{locales('titles.submitCode')}</Text>
                    <ActivityIndicator size="small"
                        animating={loading} color="white"
                        style={{
                            position: 'absolute', left: '20%', top: '28%',
                            width: 25, height: 25, borderRadius: 15
                        }}
                    />
                </Button>
                <Button
                    onPress={() => props.changeStep(1)}
                    style={styles.backButtonContainer}
                    rounded
                >
                    <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                    <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                </Button>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    root: { flex: 1, paddingHorizontal: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 10 },
    cell: {
        width: 70,
        height: 70,
        lineHeight: 70,
        borderRadius: 5,
        fontSize: 24,
        borderWidth: 2,
        alignContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    focusCell: {
        borderColor: 'green',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
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
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
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
        fontSize: 16,
        marginTop: -10,
        paddingHorizontal: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
const mapStateToProps = state => {
    return {
        loading: state.authReducer.checkActivisionCodeLoading,
        error: state.authReducer.checkActivisionCodeError,
        failed: state.authReducer.checkActivisionCodeFailed,
        message: state.authReducer.checkActivisionCodeMessage,

        getAgainLoading: state.authReducer.checkAlreadySignedUpMobileNumberLoading,
        getAgainError: state.authReducer.checkAlreadySignedUpMobileNumberError,
        getAgainFailed: state.authReducer.checkAlreadySignedUpMobileNumberFailed,
        getAgainMessage: state.authReducer.checkAlreadySignedUpMobileNumberMessage,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        fastLogin: (payload) => dispatch(authActions.fastLogin(payload)),
        checkActivisionCode: (code, mobileNumber) => dispatch(authActions.checkActivisionCode(code, mobileNumber)),
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EnterActivisionCode)