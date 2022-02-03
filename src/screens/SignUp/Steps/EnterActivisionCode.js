import React, { useState, useEffect } from 'react'
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { Button, Label } from 'native-base';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import SmsListener from 'react-native-android-sms-listener'

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceHeight, deviceWidth } from '../../../utils';
import Timer from '../../../components/timer';
import * as authActions from '../../../redux/auth/actions';
import * as productsListActions from '../../../redux/productsList/actions';
import * as profileActions from '../../../redux/profile/actions';
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
    let [flag, setFlag] = useState(false)


    let { verificationCode, loading, mobileNumber } = props


    useEffect(() => {
        let subscription = SmsListener.addListener(onSmsListened)
        if (!!verificationCode) {
            setValue(verificationCode);
        }
        return _ => subscription.remove();
    }, [])

    const onSmsListened = (message = {}) => {
        const {
            body = ''
        } = message;

        if (body && body.length) {
            let oneTimeCode = body.match(/\d+/g);
            if (oneTimeCode && oneTimeCode.length) {
                setValue(oneTimeCode[0]);
                onSubmit(oneTimeCode[0]);
            }
        }

    };

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
                        props.fetchAllProductsList(item, true)
                            .then(_ => props.updateProductsList(true));
                        analytics().setUserId(result.payload.id.toString());
                        props.fetchUserProfile().then((userProfileResult = {}) => {
                            const {
                                payload = {}
                            } = userProfileResult;

                            const {
                                user_info = {}
                            } = payload;

                            const {
                                is_seller,
                                id
                            } = user_info;

                            const {
                                contact,
                                profile_photo,
                                isFromRequests,
                                isFromAchivePrice,
                                route = {},
                            } = props;

                            const {
                                params = {}
                            } = route;

                            const {
                                parentRoute,
                            } = params;

                            if (parentRoute)
                                switch (parentRoute) {
                                    case 'buyers': {
                                        if (is_seller)
                                            return props.navigation.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 1 } });
                                        return props.navigation.navigate('MyBuskool',
                                            {
                                                screen: 'ChangeRole', params: {
                                                    parentRoute: 'Messages', childRoute: 'MessagesIndex',
                                                    routeParams: { tabIndex: 1 }
                                                }
                                            });

                                    };
                                    case 'pricing': {
                                        if (is_seller)
                                            return props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                        return props.navigation.navigate('MyBuskool',
                                            {
                                                screen: 'ChangeRole', params: {
                                                    parentRoute: 'MyBuskool', childRoute: 'PromoteRegistration'
                                                }
                                            });

                                    };
                                    case 'msg': {
                                        if (is_seller)
                                            return props.navigation.navigate('MyBuskool', { screen: 'MessagesIndex' });
                                    };
                                    default:
                                        break;
                                }

                            global.meInfo.is_seller = is_seller;
                            global.meInfo.loggedInUserId = id;

                            const popAction = StackActions.pop(1);

                            if (contact && Object.keys(contact).length) {
                                props.navigation.dispatch(popAction);
                                props.navigation.navigate('Home', { screen: 'Chat', params: { profile_photo, contact } })
                            }
                            if (isFromRequests == true) {
                                AsyncStorage.setItem('@isBuyAdRequestsFocused', JSON.stringify(true));
                                props.navigation.dispatch(popAction);
                                if (is_seller)
                                    return props.navigation.navigate('RequestsStack', { screen: 'Requests' });
                                return props.navigation.navigate('Home', { screen: 'ProductsList' });
                            }

                            if (isFromAchivePrice == true) {
                                return props.navigation.navigate('Home', { screen: 'ProductsList' });
                            }

                        })
                    })
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
                    return setValueError(err?.data?.errors?.phone[0]);
                return setValueError(locales('labels.somethingWentWrong'))

            })
        }

    };

    return (
        <>

            <Text style={[styles.userText, { marginTop: 12 }]}>
                {locales('messages.enterSentCode', { fieldName: mobileNumber })}
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
                    onChangeText={val => {
                        setValueError('');
                        setValue(val);
                        setFlag(false)
                        if (val && val.length == 4)
                            onSubmit(val);
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
                                marginTop: 20,
                                borderColor: value.length === 4 &&
                                    !valueError ? "#00C569"
                                    : value.length === 4 && valueError
                                        ? '#de3545' :
                                        "rgba(0, 0, 0, 0.15)",
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
                <Text
                    style={{
                        fontSize: 14,
                        color: '#D81A1A',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}>
                    {valueError}
                </Text>
            </SafeAreaView>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
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
                    style={[
                        value.length !== 4
                            ? styles.disableLoginButton
                            : styles.loginButton,
                        {
                            borderRadius: 8
                        }]}
                    rounded
                >
                    <Text style={[styles.buttonText,
                    {
                        color: value.length !== 4 ?
                            '#777' :
                            'white'
                    }]}>
                        {locales('titles.submitCode')}
                    </Text>
                    <ActivityIndicator
                        size="small"
                        animating={
                            loading
                            || props.loginLoading
                            || props.userProfileLoading
                        }
                        color="white"
                        style={{
                            position: 'absolute', left: '20%', top: '28%',
                            width: 25, height: 25, borderRadius: 15
                        }}
                    />
                </Button>
                <Button
                    onPress={() => props.changeStep(1)}
                    style={[styles.backButtonContainer, {
                        backgroundColor: 'white',
                        borderColor: '#747474'
                    }]}
                    rounded
                >
                    <Text
                        style={[styles.backButtonText, {
                            color: '#747474'
                        }]}>
                        {locales('titles.previousStep')}
                    </Text>
                    <AntDesign
                        name='arrowright'
                        size={25}
                        color='#747474'
                    />
                </Button>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    root: { flex: 1, paddingHorizontal: deviceWidth * 0.06 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 20 },
    cell: {
        width: 70,
        backgroundColor: '#fff',
        height: 60,
        lineHeight: 65,
        borderRadius: 8,
        fontSize: 24,
        borderWidth: 1,
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

    },
    backButtonText: {
        color: '#00C569',
        width: '60%',
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        elevation: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00C569',
        borderRadius: 8,
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
        elevation: 0,
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#FF9828',
        borderRadius: 5,
        elevation: 0,
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