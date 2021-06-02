import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    Keyboard,
    StyleSheet,
} from 'react-native';
import {
    Button,
    Input,
    Label,
    InputGroup
} from 'native-base';
import { connect } from 'react-redux';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import analytics from '@react-native-firebase/analytics';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { validator, deviceHeight, deviceWidth } from '../../utils';
import * as authActions from '../../redux/auth/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import Header from '../header';
import Timer from '../timer';
import ENUMS from '../../enums';

const RegistrationModal = props => {

    const {
        visible = false,
        onRequestClose = _ => { }
    } = props;


    const [verificationCode, setVerificationCode] = useState(null);

    const [lastName, setLastName] = useState(null);

    const [firstName, setFirstName] = useState(null);

    const [mobileNumber, setMobileNumber] = useState(null);

    const [step, setStep] = useState(3);

    useEffect(() => {
        return () => {
        }
    }, []);


    const changeStep = nextStep => {
        setStep(nextStep);
    };

    const saveMobileNumber = mobile => {
        setMobileNumber(mobile);
        setStep(2);
    }

    const saveVerificationCode = code => {
        setVerificationCode(code);
        setStep(3);
    }

    const saveFullName = (fName, lName) => {
        setFirstName(fName);
        setLastName(lName);
        setStep(4);
    };

    const handleCloseModal = _ => {
        if (step > 1)
            setStep(prevStep => prevStep - 1);
        else
            onRequestClose();
    };

    const renderSteps = _ => {
        switch (step) {

            case 1:
                return (
                    <GetMobileNumber
                        {...props}
                        saveMobileNumber={saveMobileNumber}
                        mobileNumber={mobileNumber}
                    />
                );

            case 2:
                return (
                    <GetVerificationCode
                        {...props}
                        mobileNumber={mobileNumber}
                        saveVerificationCode={saveVerificationCode}
                        verificationCode={verificationCode}
                        changeStep={changeStep}
                        onRequestClose={onRequestClose}
                    />
                );

            case 3:
                return (
                    <GetFullName
                        {...props}
                        firstName={firstName}
                        lastName={lastName}
                        saveFullName={saveFullName}
                        changeStep={changeStep}
                    />
                );
            default:
                break;
        };
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={handleCloseModal}
            transparent={false}
        >
            <Header
                {...props}
                title={locales('titles.login/signUp')}
                iconName='times'
                onBackButtonPressed={onRequestClose}
            />
            <View
                style={{
                    flex: 1,
                    padding: 20,
                    marginTop: 20
                }}
            >

                {renderSteps()}
            </View>

        </Modal>
    )
};

const GetMobileNumber = props => {

    const mobileNumberRef = useRef();

    const {
        checkAlreadySingedUpMobileNumber = _ => { },
        saveMobileNumber = _ => { },

        checkAlreadySignedUpMobileNumberLoading
    } = props;


    const [mobileNumber, setMobileNumber] = useState('');

    const [mobileNumberError, setMobileNumberError] = useState(null);

    const submitMobileNumber = _ => {
        if (!mobileNumber)
            setMobileNumberError(locales('errors.fieldNeeded', { fieldName: locales('titles.mobileNumber') }));

        else if (mobileNumber && mobileNumber.length && !validator.isMobileNumber(mobileNumber))
            setMobileNumberError(locales('errors.invalidFormat', { fieldName: locales('titles.mobileNumber') }));

        else {
            setMobileNumberError(null);
            checkAlreadySingedUpMobileNumber(mobileNumber).then(_ => {
                saveMobileNumber(mobileNumber);
            });
        }
    };


    const onMobileNumberChanged = phone => {
        setMobileNumberError(null);
        setMobileNumber(phone);
    };

    return (
        <View>

            <Text
                style={{
                    color: '#555555',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 18,
                }}
            >
                {locales('titles.mobileNumber')}
                <Text
                    style={{
                        color: '#D44546',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 18,
                        fontWeight: '200'
                    }}
                >
                    *
                </Text>
            </Text>

            <Text
                style={{
                    color: '#777777',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 14,
                    marginTop: 15,
                    marginBottom: 5
                }}
            >
                {locales('titles.enterPhoneNumber')}
            </Text>

            <InputGroup
                regular
                style={{
                    borderRadius: 4,
                    // borderWidth: 2,
                    borderColor: (mobileNumberError ? '#D50000' :
                        (mobileNumber.length && validator.isMobileNumber(mobileNumber)) ?
                            '#00C569' :
                            '#a8a8a8'),
                    paddingHorizontal: 10,
                    backgroundColor: '#FBFBFB',
                }}
            >
                <FontAwesome5
                    name={mobileNumberError ? 'times-circle' : 'phone-square-alt'}
                    color={(mobileNumberError ? '#D50000' :
                        (mobileNumber.length && validator.isMobileNumber(mobileNumber)) ?
                            '#00C569' :
                            '#a8a8a8')}
                    size={16}
                    solid
                    style={{
                        marginLeft: 10,
                    }}
                />
                <Input
                    onSubmitEditing={submitMobileNumber}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='number-pad'
                    autoCompleteType='off'
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        borderRadius: 4,
                        height: 45,
                        flexDirection: 'row',
                        textDecorationLine: 'none',
                        direction: 'rtl',
                        textAlign: 'right'
                    }}
                    onChangeText={onMobileNumberChanged}
                    value={mobileNumber}
                    placeholder={locales('titles.entermobileNumber')}
                    placeholderTextColor="#BEBEBE"
                    ref={mobileNumberRef}

                />
            </InputGroup>
            <Label
                style={{
                    height: 25,
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    textAlign: !mobileNumberError && mobileNumber.length ? 'left' : 'right'
                }}
            >
                {!!mobileNumberError ?
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#D81A1A',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}
                    >
                        {mobileNumberError}
                    </Text>
                    : null
                }
            </Label>

            <Button
                onPress={submitMobileNumber}
                style={{
                    backgroundColor: mobileNumber.length && validator.isMobileNumber(mobileNumber) ?
                        '#00C569' :
                        '#E0E0E0',
                    width: '45%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 0,
                    borderRadius: 8,
                    height: 50
                }}
            >
                {
                    !!checkAlreadySignedUpMobileNumberLoading ?
                        <ActivityIndicator
                            size={15}
                            color='white'
                        />
                        :
                        <FontAwesome5
                            name='arrow-left'
                            size={15}
                            color='white'
                        />
                }
                <Text
                    style={{
                        fontSize: 18,
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        marginHorizontal: 5
                    }}
                >
                    {locales('titles.submitNumber')}
                </Text>
            </Button>
        </View>
    );
};

const GetVerificationCode = props => {

    const CELL_COUNT = 4;

    const codeFieldRef = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

    const [value, setValue] = useState('');

    const [valueError, setValueError] = useState(null);

    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const {
        mobileNumber,
        checkActivisionCodeLoading,
        userProfileLoading,
        loginLoading,
        changeStep = _ => { },
        saveVerificationCode = _ => { },
        fetchUserProfile = _ => { },
        checkActivisionCode = _ => { },
        onRequestClose = _ => { },
        fastLogin = _ => { },
        updateProductsList = _ => { },
        fetchAllProductsList = _ => { },
    } = props;

    const onVerificationCodeSubmited = (value) => {
        if (!value || value.length != 4) {
            setValueError(locales('errors.errorInVerificationCode'))
        }

        else {
            setValueError('')
            checkActivisionCode(value, mobileNumber).then((res = {}) => {
                setValueError('');
                if (res.payload.redirected) {
                    fastLogin(res.payload).then(result => {
                        analytics().setUserId(result.payload.id.toString());
                        fetchUserProfile().then(_ => {
                            let item = {
                                from_record_number: 0,
                                sort_by: ENUMS.SORT_LIST.values.BM,
                                to_record_number: 16,
                            };
                            fetchAllProductsList(item, true).then(_ => updateProductsList(true));
                            onRequestClose(true);
                        });

                        // .catch(_ => setShowModal(true));;
                    })
                    // .catch(_ => setShowModal(true));
                }
                else if (res.payload.status) { saveVerificationCode(value) }
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


    return (
        <ScrollView
            keyboardDismissMode='none'
            keyboardShouldPersistTaps='handled'
        >
            <Text
                style={{
                    color: '#555555',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 18,
                }}
            >
                {locales('titles.enterVerificationCode')}
                <Text
                    style={{
                        color: '#D44546',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 18,
                        fontWeight: '200'
                    }}
                >
                    *
                </Text>
            </Text>

            <Text
                style={{
                    color: '#777777',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 14,
                    marginTop: 15,
                    marginBottom: 5
                }}
            >
                {locales('titles.sentCodeTo')}
                <Text
                    style={{
                        color: '#21AD93',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginTop: 15,
                        marginBottom: 5
                    }}
                >
                    {` ${mobileNumber || ' '} `}
                </Text>
                <Text
                    style={{
                        color: '#777777',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginTop: 15,
                        marginBottom: 5
                    }}
                >
                    {locales('titles.writeDown')}
                </Text>
            </Text>

            <SafeAreaView style={[styles.root]}>
                <CodeField
                    ref={codeFieldRef}
                    {...codeProps}
                    value={value}
                    onChangeText={value => {
                        setValueError('');
                        setValue(value);
                    }}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFiledRoot}
                    onSubmitEditing={event => {
                        Keyboard.dismiss();
                        onVerificationCodeSubmited(event.nativeEvent.text);

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
                            onLayout={getCellOnLayoutHandler(index)}
                        >
                            {symbol || (isFocused ? <Cursor
                                cursorSymbol="|"
                                delay={500}
                            /> : null)}
                        </Text>
                    )}
                />
                {!!valueError ?
                    <Label style={{
                        fontSize: 14,
                        marginVertical: 5,
                        color: '#D81A1A',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}>
                        {valueError}
                    </Label>
                    : null
                }
            </SafeAreaView>

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginVertical: 10
                }}
            >
                <Timer
                    min={2}
                    sec={0}
                    isCountDownTimer={true}
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                    substitutionTextStyle={{
                        color: '#1CC625',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                    timerStyle={{
                        color: '#1CC625',
                        fontSize: 18
                    }}
                    onSubstitution={() => checkAlreadySingedUpMobileNumber(mobileNumber)}
                    substitutionText={locales('titles.sendVerificationCodeAgain')}
                />
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    alignItems: 'center'
                }}
            >
                <Button
                    onPress={() => onVerificationCodeSubmited(value)}
                    style={[value.length !== 4 ? styles.disableLoginButton : styles.loginButton]}
                    rounded
                >
                    <Text style={styles.buttonText}>
                        {locales('titles.submitCode')}
                    </Text>
                    <ActivityIndicator
                        size="small"
                        animating={!!checkActivisionCodeLoading || !!userProfileLoading || !!loginLoading}
                        color="white"
                        style={{
                            position: 'absolute',
                            left: '20%',
                            top: '28%',
                            width: 25,
                            height: 25,
                            borderRadius: 15
                        }}
                    />
                </Button>
                <Button
                    onPress={() => changeStep(1)}
                    style={[styles.backButtonContainer, { borderRadius: 8 }]}
                    rounded
                >
                    <Text style={styles.backButtonText}>
                        {locales('titles.previousStep')}
                    </Text>
                    <FontAwesome5
                        name='arrow-right'
                        size={25}
                        color='#7E7E7E'
                    />
                </Button>
            </View>

        </ScrollView>
    )

};

const GetFullName = props => {

    const firstNameRef = useRef();
    const lastNameRef = useRef();

    const {
        changeStep = _ => { }
    } = props;

    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState(null);
    const [firstNameClicked, setFirstNameClicked] = useState(false);

    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState(null);
    const [lastNameClicked, setLastNameClicked] = useState(false);

    const onFirstNameChanged = value => {
        setFirstNameError((!!!value || validator.isPersianName(value)) ? null : locales('errors.invalidFormat', { fieldName: locales('titles.firstName') }));
        setFirstNameClicked(!!value);
        setFirstName(value);
    };

    const onLastNameChanged = value => {
        setLastNameError((!!!value || validator.isPersianName(value)) ? null : locales('errors.invalidFormat', { fieldName: locales('titles.lastName') }));
        setLastNameClicked(!!value);
        setLastName(value);
    };

    const onSubmit = _ => {

        if (!firstName) {
            setFirstNameError(locales('errors.fieldNeeded', { fieldName: locales('titles.firstName') }));
            setFirstNameClicked(true);
        }
        else if (firstName && firstNameError) {
            setFirstNameError(locales('errors.invalidFormat', { fieldName: locales('titles.firstName') }));
            setFirstNameClicked(true);
        }
        else {
            setFirstNameError(null);
            setFirstNameClicked(false);
        }

        if (!lastName) {
            setLastNameError(locales('errors.fieldNeeded', { fieldName: locales('titles.lastName') }));
            setLastNameClicked(true);
        }
        else if (lastName && lastNameError) {
            setLastNameError(locales('errors.invalidFormat', { fieldName: locales('titles.lastName') }));
            setLastNameClicked(true);
        }
        else {
            setLastNameError(null);
            setLastNameClicked(false);
        }

        if (firstName && lastName && !firstNameError && !lastNameError)
            props.saveFullName(firstName, lastName);
    };

    return (
        <ScrollView
            keyboardDismissMode='none'
            keyboardShouldPersistTaps='handled'
        >
            <View>

                <Text
                    style={{
                        color: '#555555',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 18,
                    }}
                >
                    {locales('titles.fullName')}
                    <Text
                        style={{
                            color: '#D44546',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 18,
                            fontWeight: '200'
                        }}
                    >
                        *
                </Text>
                </Text>

                <Text
                    style={{
                        color: '#777777',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginTop: 15,
                        marginBottom: 5
                    }}
                >
                    {locales('titles.enterFirstName')}
                </Text>

                <InputGroup
                    regular
                    style={{
                        borderRadius: 4,
                        // borderWidth: 2,
                        borderColor: (firstNameError ? '#D50000' : ((firstName.length && validator.isPersianName(firstName)) ? '#00C569' : '#a8a8a8')),
                        paddingHorizontal: 10,
                        backgroundColor: '#FBFBFB',
                    }}
                >
                    <FontAwesome5
                        name={
                            firstName ? firstNameError ? 'times-circle' : 'check-circle' : firstNameClicked
                                ? 'times-circle' : 'edit'}
                        color={firstName ? firstNameError ? '#E41C38' : '#00C569'
                            : firstNameClicked ? '#E41C38' : '#BDC4CC'}
                        size={16}
                        solid
                        style={{
                            marginLeft: 10,
                        }}
                    />
                    <Input
                        onSubmitEditing={onFirstNameChanged}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='off'
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            borderRadius: 4,
                            height: 45,
                            flexDirection: 'row',
                            textDecorationLine: 'none',
                            direction: 'rtl',
                            textAlign: 'right'
                        }}
                        onChangeText={onFirstNameChanged}
                        value={firstName}
                        placeholder={locales('titles.enterFirstName')}
                        placeholderTextColor="#BEBEBE"
                        ref={firstNameRef}

                    />
                </InputGroup>
                <Label
                    style={{
                        height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        textAlign: !firstNameError && firstName.length ? 'left' : 'right'
                    }}
                >
                    {!!firstNameError ?
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#D81A1A',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}
                        >
                            {firstNameError}
                        </Text>
                        : null
                    }
                </Label>

                <Text
                    style={{
                        color: '#777777',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginTop: 15,
                        marginBottom: 5
                    }}
                >
                    {locales('titles.enterLastName')}
                </Text>

                <InputGroup
                    regular
                    style={{
                        borderRadius: 4,
                        // borderWidth: 2,
                        borderColor: (lastNameError ? '#D50000' : ((lastName.length && validator.isPersianName(lastName)) ? '#00C569' : '#a8a8a8')),
                        paddingHorizontal: 10,
                        backgroundColor: '#FBFBFB',
                    }}
                >
                    <FontAwesome5
                        name={
                            lastName ? lastNameError ? 'times-circle' : 'check-circle' : lastNameClicked
                                ? 'times-circle' : 'edit'}
                        color={lastName ? lastNameError ? '#E41C38' : '#00C569'
                            : lastNameClicked ? '#E41C38' : '#BDC4CC'}
                        size={16}
                        solid
                        style={{
                            marginLeft: 10,
                        }}
                    />
                    <Input
                        onSubmitEditing={onLastNameChanged}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='off'
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            borderRadius: 4,
                            height: 45,
                            flexDirection: 'row',
                            textDecorationLine: 'none',
                            direction: 'rtl',
                            textAlign: 'right'
                        }}
                        onChangeText={onLastNameChanged}
                        value={lastName}
                        placeholder={locales('titles.enterLastName')}
                        placeholderTextColor="#BEBEBE"
                        ref={lastNameRef}

                    />
                </InputGroup>
                <Label
                    style={{
                        height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        textAlign: !lastNameError && lastName.length ? 'left' : 'right'
                    }}
                >
                    {!!lastNameError ?
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#D81A1A',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}
                        >
                            {lastNameError}
                        </Text>
                        : null
                    }
                </Label>

                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        onPress={onSubmit}
                        style={{
                            backgroundColor: lastName.length && firstName.length && !firstNameError && !lastNameError ?
                                '#00C569' :
                                '#E0E0E0',
                            width: '45%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 0,
                            borderRadius: 8,
                            height: 50
                        }}
                    >
                        <FontAwesome5
                            name='arrow-left'
                            size={15}
                            color='white'
                        />
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                marginHorizontal: 5
                            }}
                        >
                            {locales('titles.nextStep')}
                        </Text>
                    </Button>
                    <Button
                        onPress={() => changeStep(2)}
                        style={[styles.backButtonContainer, { borderRadius: 8 }]}
                        rounded
                    >
                        <Text style={styles.backButtonText}>
                            {locales('titles.previousStep')}
                        </Text>
                        <FontAwesome5
                            name='arrow-right'
                            size={25}
                            color='#7E7E7E'
                        />
                    </Button>
                </View>

            </View>

        </ScrollView>
    )
};

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

const mapStateToProps = ({
    authReducer,
    profileReducer
}) => {

    const {
        userProfileLoading
    } = profileReducer;

    const {
        checkAlreadySignedUpMobileNumberLoading,
        checkActivisionCodeLoading,
        loginLoading
    } = authReducer;

    return {
        checkAlreadySignedUpMobileNumberLoading,
        checkActivisionCodeLoading,
        loginLoading,

        userProfileLoading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber)),
        checkActivisionCode: (code, mobileNumber) => dispatch(authActions.checkActivisionCode(code, mobileNumber)),
        fastLogin: (payload) => dispatch(authActions.fastLogin(payload)),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        updateProductsList: flag => dispatch(productsListActions.updateProductsList(flag)),
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationModal);