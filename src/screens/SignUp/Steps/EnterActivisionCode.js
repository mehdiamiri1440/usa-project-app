import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils';
import Timer from '../../../components/timer';
import { OutlinedTextField } from '../../../components/floatingInput';
import * as authActions from '../../../redux/auth/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';

const onSubmit = (props, value) => {
    props.checkActivisionCode(value).then((res) => {
        if (res.payload.status) props.changeStep(3)
    })

};



const EnterActivisionCode = (props) => {
    const CELL_COUNT = 4;

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [value, setValue] = useState('');
    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    let [timerFlag, setTimerFlag] = useState(false)
    let [flag, setFlag] = useState(false)
    let [activisionCode, setActivisionCode] = useState('');

    activisionCodeRef = React.createRef();

    let { message, loading, error, mobileNumber, getAgainLoading } = props
    return (
        <Spin spinning={loading || getAgainLoading} >
            <Text style={styles.userText}>
                {locales('messages.enterCode', { fieldName: mobileNumber })}
            </Text>
            {!error && value.length === 4 && flag && message && message.length &&
                <View style={styles.loginFailedContainer}>
                    <Text style={styles.loginFailedText}>
                        {locales('errors.errorInVerificationCode')}
                    </Text>
                </View>
            }
            <SafeAreaView style={styles.root}>
                <CodeField
                    ref={ref}
                    {...codeProps}
                    value={value}
                    onChangeText={value => {
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
                                borderColor: value.length === 4 && !error && !message ? "#155724"
                                    : value.length === 4 && flag && !error && message && message.length
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
            </SafeAreaView>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginVertical: 20 }}>
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
            <Button
                onPress={() => {
                    setFlag(true);
                    onSubmit(props, value)
                }}
                style={[value.length !== 4 ? styles.disableLoginButton : styles.loginButton, { marginVertical: 20 }]}
                rounded
                disabled={value.length !== 4}
            >
                <Text style={styles.buttonText}>{locales('titles.submitCode')}</Text>
            </Button>
        </Spin >
    )
}
const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 20 },
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
    focusCell: {
        borderColor: 'green',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
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
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.8,
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
        paddingTop: '3%',
        fontSize: 16,
        padding: 20,
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
        checkActivisionCode: (code) => dispatch(authActions.checkActivisionCode(code)),
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EnterActivisionCode)