import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView, ActivityIndicator, Keyboard } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { StackActions } from '@react-navigation/native';
import { Button, Label } from 'native-base'
import { connect } from 'react-redux'
import analytics from '@react-native-firebase/analytics';
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils';
import Timer from '../../../components/timer';
import * as authActions from '../../../redux/auth/actions'
import * as productsListActions from '../../../redux/productsList/actions';
import * as profileActions from '../../../redux/profile/actions'
import ENUMS from '../../../enums';
import NoConnection from '../../../components/noConnectionError';




const EnterActivisionCode = (props) => {


    const CELL_COUNT = 4;

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [value, setValue] = useState('');
    const [valueError, setValueError] = useState(null);
    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    let [showModal, setShowModal] = useState(false);
    let [flag, setFlag] = useState(false)

    const activisionCodeRef = React.createRef();

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
            props.checkActivisionCode(value, mobileNumber).then((res = {}) => {
                setValueError('');
                if (res.payload.redirected) {
                    props.fastLogin(res.payload).then(result => {
                        let item = {
                            from_record_number: 0,
                            sort_by: ENUMS.SORT_LIST.values.BM,
                            to_record_number: 16,
                        };
                        props.fetchAllProductsList(item, true).then(_ => props.updateProductsList(true));
                        analytics().setUserId(result.payload.id.toString());
                        props.fetchUserProfile().then(_ => {
                            const {
                                contact,
                                profile_photo
                            } = props;
                            if (contact && Object.keys(contact).length) {
                                const popAction = StackActions.pop(1);
                                props.navigation.dispatch(popAction);
                                props.navigation.navigate('Home', { screen: 'Chat', params: { profile_photo, contact } })
                            }
                        })
                        // .catch(_ => setShowModal(true));;
                    })
                    // .catch(_ => setShowModal(true));
                }
                else if (res.payload.status) { props.setVerificationCode(value) }
                else if (!res.payload.status) {
                    const {
                        payload = {}
                    } = res;
                    const {
                        msg = ''
                    } = payload;
                    setValueError(msg);
                }
            }).catch(err => {
                if (err && err.data)
                    setValueError(err.data.errors.phone[0])
                // else
                //     setShowModal(true)
            })
        }

    };

    const closeModal = _ => {
        setShowModal(false);
        props.checkActivisionCode(value, mobileNumber);
    }


    return (
        <>
            <NoConnection
                showModal={showModal}
                closeModal={closeModal}
            />

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
                    onSubmitEditing={event => {
                        Keyboard.dismiss();
                        onSubmit(event.nativeEvent.text);

                    }}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell,
                            {
                                borderColor: value.length === 4 && !valueError ? "#00C569"
                                    : value.length === 4 && valueError
                                        ? '#de3545' :
                                        "#bebebe",
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                            }]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor
                                cursorSymbol="|"
                                delay={500}
                            /> : null)}
                        </Text>
                    )}
                />
                {!!valueError && <Label style={{
                    fontSize: 14, marginVertical: 5, color: '#D81A1A', textAlign: 'center',
                    fontFamily: 'IRANSansWeb(FaNum)_Light'
                }}>{valueError}</Label>}
            </SafeAreaView>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginVertical: 10 }}>
                <Timer
                    min={2}
                    sec={0}
                    isCountDownTimer={true}
                    containerStyle={{
                        justifyContent: 'center', alignItems: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                    substitutionTextStyle={{
                        color: '#1CC625', textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                    timerStyle={{ color: '#1CC625', fontSize: 18 }}
                    onSubstitution={() => props.checkAlreadySingedUpMobileNumber(mobileNumber).catch(_ => setShowModal(true))}
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
                        animating={loading || props.loginLoading || props.userProfileLoading} color="white"
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
    root: { flex: 1, paddingHorizontal: deviceWidth * 0.06 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 20 },
    cell: {
        width: 70,
        backgroundColor: '#fff',
        elevation: 1,
        height: 60,
        lineHeight: 65,
        borderRadius: 5,
        fontSize: 24,
        borderWidth: 1,
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

    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
        justifyContent: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
        justifyContent: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        loginLoading: state.authReducer.loginLoading,
        userProfileLoading: state.profileReducer.userProfileLoading,

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
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber)),
        updateProductsList: flag => dispatch(productsListActions.updateProductsList(flag)),
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EnterActivisionCode)