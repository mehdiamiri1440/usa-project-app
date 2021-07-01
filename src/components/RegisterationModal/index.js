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
    FlatList,
    Pressable
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
import Svg, { Path, G, Ellipse } from "react-native-svg";
import AsyncStorage from '@react-native-community/async-storage';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { validator, deviceHeight, deviceWidth, formatter } from '../../utils';
import * as authActions from '../../redux/auth/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import * as locationActions from '../../redux/locations/actions';
import Header from '../header';
import Timer from '../timer';
import ENUMS from '../../enums';

const RegisterationModal = props => {

    const {
        visible = false,
        onRequestClose = _ => { },
        subCategoryName = '',
        categoryId = '',
        fetchAllProductsList = _ => { },
        updateProductsList = _ => { },
        fetchUserProfile = _ => { },
        login = _ => { },
        subCategoryId,
        loginLoading,
        userProfileLoading,
        submitRegisterLoading,
        registerBuyAdRequestLoading,
        productName
    } = props;

    const [isAlreadySignedUp, setIsAlreadySignedUp] = useState(false);

    const [verificationCode, setVerificationCode] = useState(null);

    const [lastName, setLastName] = useState(null);

    const [firstName, setFirstName] = useState(null);

    const [mobileNumber, setMobileNumber] = useState(null);

    const [intent, setIntentType] = useState(null);

    const [showLoader, setShowLoader] = useState(false);
    const [intentTypeToSendBuyAdRequest, setIntentTypeToSendBuyAdRequest] = useState(null);

    const [province, setProvince] = useState(null);
    const [provinceName, setSelectedProvinceName] = useState(null);

    const [city, setCity] = useState(null);

    const [cities, setCities] = useState([]);

    const [step, setStep] = useState(1);

    useEffect(() => {
        if (isAlreadySignedUp && intentTypeToSendBuyAdRequest == 0)
            onRequestClose(true);
    }, [isAlreadySignedUp]);

    const changeStep = nextStep => {
        setStep(nextStep);
    };

    const saveIntentTypeToSendBuyAdRequest = type => {
        setIntentTypeToSendBuyAdRequest(type);
    };

    const saveProvince = (selectedProvince, selectedProvinceName, cities) => {
        setSelectedProvinceName(selectedProvinceName)
        setProvince(selectedProvince);
        setCities(cities);
        setStep(6);
    };

    const saveCity = (selectedCity, selectedCityName) => {
        setCity(selectedCity);

        if (intent == 1)
            setStep(7);
        else {
            setStep(1);
            setShowLoader(true);
        }

        submitRegister(selectedCityName).then(_ => {
            if (intent == 0) {
                setShowLoader(false);
                onRequestClose(true);
            }
        });
    };

    const saveMobileNumber = mobile => {
        setMobileNumber(mobile);
        setStep(2);
    };

    const saveVerificationCode = code => {
        setVerificationCode(code);
        setStep(3);
    };

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

    const saveIntentType = intent => {
        setIntentType(intent);
        setStep(5);
    };

    const submitRegister = city => {

        return new Promise((resolve, reject) => {
            const password = formatter.makeRandomString(8);

            let registerObject = {
                phone: formatter.toLatinNumbers(mobileNumber),
                first_name: firstName,
                last_name: lastName,
                password,
                user_name: '',
                sex: 'man',
                province: provinceName,
                city,
                activity_type: '1',
                category_id: categoryId,
                verification_code: formatter.toLatinNumbers(verificationCode)
            };

            if (!isAlreadySignedUp)
                props.submitRegister(registerObject)
                    .then(result => {
                        AsyncStorage.setItem('@IsNewSignedUpUser', JSON.stringify(true))
                        analytics().logEvent('successfull_register', {
                            mobile_number: mobileNumber
                        });
                        login(mobileNumber, password)
                            .then((result) => {
                                let item = {
                                    from_record_number: 0,
                                    sort_by: ENUMS.SORT_LIST.values.BM,
                                    to_record_number: 16,
                                };
                                fetchAllProductsList(item, true).then(_ => updateProductsList(true));
                                analytics().setUserId(result.payload.id.toString());
                                fetchUserProfile().then(_ => {
                                    setIsAlreadySignedUp(true);
                                    resolve(true)
                                });
                            })
                    })
                    .catch(err => {
                        // if (err && err.data){
                        //     this.setState({ signUpError: Object.values(err.data.errors)[0][0] });
                        // reject(err);
                        // }
                    });

        });
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

            case 4:
                return (
                    <GetIntentType
                        {...props}
                        saveIntentType={saveIntentType}
                        changeStep={changeStep}
                    />
                );

            case 5:
                return (
                    <GetProvince
                        {...props}
                        saveProvince={saveProvince}
                        changeStep={changeStep}
                    />
                );

            case 6:
                return (
                    <GetCity
                        {...props}
                        province={province}
                        city={city}
                        cities={cities}
                        saveCity={saveCity}
                        changeStep={changeStep}
                    />
                );

            case 7: {
                return (
                    <GetIntentToSendBuyAdRequest
                        {...props}
                        changeStep={changeStep}
                        subCategoryName={subCategoryName}
                        isAlreadySignedUp={isAlreadySignedUp}
                        productName={productName}
                        onRequestClose={onRequestClose}
                        saveIntentTypeToSendBuyAdRequest={saveIntentTypeToSendBuyAdRequest}
                        subCategoryId={subCategoryId}
                        setShowLoader={setShowLoader}
                    />
                );
            };

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

                {((showLoader == true) && (
                    userProfileLoading || registerBuyAdRequestLoading || submitRegisterLoading || loginLoading)
                ) ?
                    <Loader {...props} />
                    :
                    renderSteps()
                }
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

    useEffect(_ => {
        if (props.mobileNumber && props.mobileNumber.length)
            setMobileNumber(props.mobileNumber);
    }, []);

    const submitMobileNumber = _ => {

        // if (!!checkAlreadySignedUpMobileNumberLoading)
        //     return;

        if (!mobileNumber)
            setMobileNumberError(locales('titles.enterPhoneNumber'));

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
                    borderRadius: 8,
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
                    placeholder='09123456789'
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
        checkAlreadySingedUpMobileNumber = _ => { }
    } = props;


    useEffect(_ => {
        if (props.verificationCode && props.verificationCode.length)
            setValue(props.verificationCode);
    }, []);

    const onVerificationCodeSubmited = (value) => {
        if (!value) {
            setValueError(locales('labels.enterCode'))
        }
        else if (value.length != 4) {
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
                    })
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

            <SafeAreaView>
                <CodeField
                    ref={codeFieldRef}
                    {...codeProps}
                    value={value}
                    onChangeText={value => {
                        setValueError('');
                        setValue(value);
                    }}
                    cellCount={CELL_COUNT}
                    rootStyle={[styles.codeFiledRoot]}
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
                                borderColor: !!valueError ? '#de3545' : value.length == 4 ? "#00C569" : "#bebebe",
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                            }]}
                            onLayout={getCellOnLayoutHandler(index)}
                        >
                            {symbol || (isFocused ? <Cursor
                                cursorSymbol="|"
                                delay={500}
                            /> : '-')}
                        </Text>
                    )}
                />
                <Label style={{
                    fontSize: 14,
                    marginTop: 30,
                    color: '#D81A1A',
                    textAlign: 'center',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    height: 50
                }}>
                    {valueError}
                </Label>
            </SafeAreaView>

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginBottom: 20,
                }}
            >
                <Timer
                    inlineStyle
                    min={2}
                    sec={0}
                    substitutionTextStyle={{
                        color: '#1DA1F2',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 14
                    }}
                    isCountDownTimer={true}
                    onSubstitution={() => checkAlreadySingedUpMobileNumber(mobileNumber)}
                    substitutionText={locales('titles.sendCodeAgain')}
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
                    style={[value.length !== 4 ? styles.disableLoginButton : styles.loginButton, { paddingTop: 4 }]}
                    rounded
                >
                    <Text style={styles.buttonText}>
                        {locales('titles.checkCode')}
                    </Text>
                    {
                        !!checkActivisionCodeLoading || !!userProfileLoading || !!loginLoading ?
                            <ActivityIndicator
                                size="small"
                                color="white"
                                style={{
                                    position: 'absolute',
                                    left: '15%',
                                    top: '40%',
                                    borderRadius: 15
                                }}
                            />
                            :
                            <FontAwesome5
                                color="white"
                                size={15}
                                name='arrow-left'
                                style={{
                                    position: 'absolute',
                                    left: '17%',
                                    top: '40%',
                                    borderRadius: 15
                                }}
                            />
                    }
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
                        size={15}
                        color='#909090'
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
    const [firstNameError, setFirstNameError] = useState('');
    const [firstNameClicked, setFirstNameClicked] = useState(false);

    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [lastNameClicked, setLastNameClicked] = useState(false);

    useEffect(_ => {
        if (props.firstName && props.firstName.length && props.lastName && props.lastName.length) {
            setFirstName(props.firstName);
            setLastName(props.lastName);
        }
    }, []);

    const handleAutoFocus = _ => {

        if (!firstName || firstNameError) {
            firstNameRef?.current?._root.focus();
            return;
        }

        if (!lastName || lastNameError) {
            lastNameRef?.current?._root.focus();
            return;
        }

        return onSubmit();
    };

    const onFirstNameChanged = value => {
        setFirstNameError((!!!value || validator.isPersianName(value)) ? null : locales('errors.enterItPersian', { fieldName: locales('titles.firstName') }));
        setFirstNameClicked(!!value);
        setFirstName(value);
    };

    const onLastNameChanged = value => {
        setLastNameError((!!!value || validator.isPersianName(value)) ? null : locales('errors.enterItPersian', { fieldName: locales('titles.lastName') }));
        setLastNameClicked(!!value);
        setLastName(value);
    };

    const onSubmit = _ => {

        if (!firstName) {
            setFirstNameError(locales('errors.fieldNeeded', { fieldName: locales('titles.firstName') }));
            setFirstNameClicked(true);
        }
        else if (firstName && firstNameError) {
            setFirstNameError(locales('errors.enterItPersian', { fieldName: locales('titles.firstName') }));
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
            setLastNameError(locales('errors.enterItPersian', { fieldName: locales('titles.lastName') }));
            setLastNameClicked(true);
        }
        else {
            setLastNameError(null);
            setLastNameClicked(false);
        }

        if (firstName && lastName && !firstNameError && !lastNameError)
            props.saveFullName(firstName.trim(), lastName.trim());
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
                        borderRadius: 8,
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
                        onSubmitEditing={handleAutoFocus}
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
                        placeholder={locales('titles.yourName')}
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
                        borderRadius: 8,
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
                        onSubmitEditing={handleAutoFocus}
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
                        placeholder={locales('titles.yourFamilyName')}
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
                        alignItems: 'center',
                        marginTop: 20
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
                            size={15}
                            color='#909090'
                        />
                    </Button>
                </View>

            </View>

        </ScrollView>
    )
};

const GetIntentType = props => {

    const {
        changeStep = _ => { },
        fetchAllProvinces = _ => { },
        saveIntentType = _ => { },
    } = props;

    useEffect(_ => {
        fetchAllProvinces();
    });


    return (
        <View>
            <View
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    onPress={_ => saveIntentType(1)}
                    activeOpacity={1}
                    style={{
                        borderRadius: 11,
                        backgroundColor: '#556080',
                        width: deviceWidth * 0.43,
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        zIndex: 1000
                    }}
                >
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="52"
                        height="53"
                        viewBox="0 0 52 53"
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <G data-name="Group 111" transform="translate(-.155 .183)">
                            <Path
                                fill="#fff"
                                fillRule="evenodd"
                                d="M10.789 15.993a.868.868 0 010-1.71h9.5a.868.868 0 010 1.71zm15.672-.025v1.139a.2.2 0 01-.167.2 1.291 1.291 0 00-.273.048 4.352 4.352 0 00-.506.129 3.783 3.783 0 00-.886.407 3.246 3.246 0 00-.372.271 2.994 2.994 0 00-.321.311 2.961 2.961 0 00-.278.359 3.107 3.107 0 00-.506 1.771 5.146 5.146 0 00.028.539 4.048 4.048 0 00.089.486 3.037 3.037 0 00.147.428 2.381 2.381 0 00.2.372l.015.023a3.428 3.428 0 00.562.64 4.319 4.319 0 00.352.291 4.522 4.522 0 00.392.253c.276.149.592.331.875.458l.483.228.719.316c.121.061.223.111.342.177l.149.1c.043.03.081.061.114.089a.881.881 0 01.1.1l.071.091a.832.832 0 01.073.132.66.66 0 01.04.106.958.958 0 01.035.134 1.158 1.158 0 01.02.167v.3a1.655 1.655 0 01-.046.223 1.034 1.034 0 01-.086.195.759.759 0 01-.149.175l-.086.063a.828.828 0 01-.233.091 1.214 1.214 0 01-.534.025 1.346 1.346 0 01-.455-.162.964.964 0 01-.094-.068l-.094-.083a.815.815 0 01-.083-.1 1.03 1.03 0 01-.073-.109 1.75 1.75 0 01-.068-.129 1.233 1.233 0 01-.053-.134 1.232 1.232 0 01-.046-.154 1.686 1.686 0 01-.033-.182c0-.061-.015-.129-.02-.2v-.223a.112.112 0 00-.114-.111H22.83a.111.111 0 00-.078.033.106.106 0 00-.033.078 4.092 4.092 0 00.023.541c.023.167.04.334.071.506a3.478 3.478 0 00.119.445 3.328 3.328 0 00.159.4l.015.03a3.37 3.37 0 00.2.364 3.891 3.891 0 00.238.329 3.262 3.262 0 00.268.291 2.955 2.955 0 00.288.253l.023.018a3.641 3.641 0 00.319.21c.111.068.225.129.344.187s.235.1.359.152.253.083.372.119.2.051.3.071.207.043.3.058a.2.2 0 01.167.195v1.088a.691.691 0 00.091.293c.02.038 0 .068.023.068h1.313a.111.111 0 00.114-.114v-1.326a.2.2 0 01.164-.195l.167-.028a5.059 5.059 0 00.506-.124 4.2 4.2 0 00.886-.39 2.784 2.784 0 00.359-.253 2.94 2.94 0 00.326-.309 2.783 2.783 0 00.278-.359 2.512 2.512 0 00.223-.4 3.188 3.188 0 00.159-.435 3.516 3.516 0 00.094-.476 4.1 4.1 0 00.033-.506 4.464 4.464 0 00-.03-.534 3.9 3.9 0 00-.091-.483 2.783 2.783 0 00-.154-.438 2.442 2.442 0 00-.207-.374 3.462 3.462 0 00-.253-.339 3.6 3.6 0 00-.309-.314 4.023 4.023 0 00-.339-.276 4.647 4.647 0 00-.385-.253h-.018c-.134-.078-.276-.159-.428-.253s-.278-.152-.445-.235-.306-.154-.46-.228c-.253-.111-.486-.22-.726-.339l-.195-.106-.164-.1a3.112 3.112 0 01-.253-.187 1.285 1.285 0 01-.182-.2.536.536 0 01-.061-.1 1.033 1.033 0 01-.043-.106 1.086 1.086 0 01-.033-.111 1.1 1.1 0 01-.018-.132v-.263a1.918 1.918 0 01.046-.24l.04-.116a.59.59 0 01.048-.1.61.61 0 01.063-.089.759.759 0 01.167-.154.82.82 0 01.091-.051l.109-.035a.784.784 0 01.134-.025 1.424 1.424 0 01.147 0 .989.989 0 01.192.018.906.906 0 01.167.048h.013a.855.855 0 01.157.086.865.865 0 01.142.116l.015.015a.792.792 0 01.127.177 1.282 1.282 0 01.078.2v.025a2.075 2.075 0 01.056.319c0 .111.018.238.02.374a.116.116 0 00.025.073.111.111 0 00.078.033h2.839a.112.112 0 00.111-.114 4.707 4.707 0 00-.033-.574 4.345 4.345 0 00-.094-.534 3.628 3.628 0 00-.154-.486 3.289 3.289 0 00-.213-.435l-.018-.033a3.442 3.442 0 00-.278-.4 3.1 3.1 0 00-.326-.354 3.181 3.181 0 00-.377-.377 3.57 3.57 0 00-.425-.253 4.162 4.162 0 00-.951-.342h-.056a.2.2 0 01-.164-.195v-1.184a.121.121 0 00-.025-.073.111.111 0 00-.081-.033h-1.329a.116.116 0 00-.081.033.111.111 0 00-.033.078zm-6.9 12.593a.858.858 0 110 1.715H2a2 2 0 01-2-2V2a2 2 0 012-2h24.511a2 2 0 012 2v9.47a.858.858 0 01-1.715 0V2a.281.281 0 00-.083-.2.286.286 0 00-.2-.083H2a.3.3 0 00-.2.081.306.306 0 00-.081.2v26.279a.281.281 0 00.281.281h17.563zm-8.775-6.275a.886.886 0 010-1.738h7.474a.883.883 0 010 1.738zm0-12.57a.8.8 0 01-.719-.86.794.794 0 01.722-.856h9.5a.8.8 0 01.711.856.794.794 0 01-.708.86zM6.667 20.241a1.012 1.012 0 11-1.012 1.012 1.012 1.012 0 011.012-1.012zm0-6.2a1.012 1.012 0 11-1.012 1.012 1.012 1.012 0 011.012-1.008zm0-6.194a1.012 1.012 0 11-1.012 1.016 1.012 1.012 0 011.012-1.012z"
                                transform="translate(10.984 11.494)"
                            ></Path>
                            <G
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                                data-name="Ellipse 34"
                                transform="translate(.155 -.183)"
                            >
                                <Ellipse cx="26" cy="26.5" stroke="none" rx="26" ry="26.5"></Ellipse>
                                <Ellipse cx="26" cy="26.5" rx="25" ry="25.5"></Ellipse>
                            </G>
                        </G>
                    </Svg>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 15,
                            color: 'white',
                            textAlign: 'center',
                            marginTop: 5
                        }}
                    >
                        {locales('titles.withPrice')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 18,
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                        {locales('titles.iWantToBuy')}
                    </Text>
                </Pressable>

                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    onPress={_ => saveIntentType(0)}
                    activeOpacity={1}
                    style={{
                        borderRadius: 11,
                        backgroundColor: '#556080',
                        width: deviceWidth * 0.43,
                        paddingVertical: 20,
                        paddingHorizontal: 10
                    }}
                >
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="52"
                        height="53"
                        viewBox="0 0 52 53"
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <G data-name="Group 110" transform="translate(-.018)">
                            <Path
                                fill="#fff"
                                fillRule="evenodd"
                                d="M28.872 15.351v2.176a.382.382 0 01-.319.377 2.468 2.468 0 00-.522.092 8.319 8.319 0 00-.967.247 7.23 7.23 0 00-1.693.779 6.2 6.2 0 00-.711.517 5.721 5.721 0 00-.614.595 5.659 5.659 0 00-.532.687 5.939 5.939 0 00-.967 3.385 9.837 9.837 0 00.053 1.03 7.737 7.737 0 00.169.928 5.8 5.8 0 00.28.817 4.55 4.55 0 00.382.711l.029.044a6.552 6.552 0 001.074 1.223 8.254 8.254 0 00.672.556 8.644 8.644 0 00.75.484c.527.285 1.132.634 1.673.875l.924.435 1.373.6c.232.116.426.213.653.339l.285.189c.082.058.155.116.218.169a1.683 1.683 0 01.184.189l.135.174a1.591 1.591 0 01.14.251 1.261 1.261 0 01.077.2 1.831 1.831 0 01.068.256 2.213 2.213 0 01.039.319v.58a3.164 3.164 0 01-.087.426 1.977 1.977 0 01-.164.372 1.45 1.45 0 01-.285.334l-.164.121a1.581 1.581 0 01-.445.174 2.321 2.321 0 01-1.02.048 2.573 2.573 0 01-.87-.309 1.843 1.843 0 01-.179-.131l-.179-.16a1.557 1.557 0 01-.16-.184 1.969 1.969 0 01-.14-.208 3.606 3.606 0 01-.131-.247 2.358 2.358 0 01-.1-.256 2.356 2.356 0 01-.087-.295 3.224 3.224 0 01-.063-.348c0-.116-.029-.247-.039-.382v-.426a.215.215 0 00-.218-.213h-5.46a.213.213 0 00-.15.063.2.2 0 00-.063.15 7.821 7.821 0 00.044 1.035c.044.319.077.638.135.967a6.649 6.649 0 00.227.851 6.36 6.36 0 00.3.769l.029.058a6.442 6.442 0 00.387.7 7.435 7.435 0 00.455.629 6.235 6.235 0 00.513.556 5.649 5.649 0 00.551.484l.044.034a6.959 6.959 0 00.609.4 7.566 7.566 0 001.345.648c.237.09.484.16.711.227s.382.1.571.135.4.082.58.111a.377.377 0 01.319.372v2.079a1.32 1.32 0 00.174.561c.039.073 0 .131.044.131h2.51a.213.213 0 00.218-.218V41.1a.377.377 0 01.314-.372l.319-.053a9.672 9.672 0 00.967-.237 8.018 8.018 0 001.693-.745 5.321 5.321 0 00.687-.484 5.618 5.618 0 00.624-.59 5.319 5.319 0 00.532-.687 4.8 4.8 0 00.426-.759 6.094 6.094 0 00.3-.832 6.722 6.722 0 00.179-.909 7.836 7.836 0 00.063-.967 8.533 8.533 0 00-.058-1.02 7.451 7.451 0 00-.174-.924 5.319 5.319 0 00-.295-.837 4.668 4.668 0 00-.4-.716 6.618 6.618 0 00-.484-.648 6.883 6.883 0 00-.59-.6 7.687 7.687 0 00-.648-.527 9.814 9.814 0 00-.735-.484h-.034c-.256-.15-.527-.3-.817-.484s-.532-.29-.851-.45-.585-.295-.88-.435a34.25 34.25 0 01-1.388-.648l-.372-.2-.314-.184a5.95 5.95 0 01-.484-.358 2.457 2.457 0 01-.348-.392 1.025 1.025 0 01-.116-.193 1.975 1.975 0 01-.082-.2 2.077 2.077 0 01-.063-.213 2.1 2.1 0 01-.034-.251v-.5a3.667 3.667 0 01.087-.459l.077-.222a1.126 1.126 0 01.092-.189 1.165 1.165 0 01.121-.169 1.451 1.451 0 01.319-.295 1.567 1.567 0 01.174-.1l.208-.068a1.5 1.5 0 01.256-.048 2.72 2.72 0 01.28 0 1.891 1.891 0 01.368.034 1.731 1.731 0 01.319.092h.024a1.634 1.634 0 01.3.164 1.654 1.654 0 01.271.222l.029.029a1.514 1.514 0 01.242.339 2.451 2.451 0 01.15.392v.048a3.965 3.965 0 01.106.609c0 .213.034.455.039.716a.222.222 0 00.048.14.213.213 0 00.15.063h5.426a.215.215 0 00.213-.218 9 9 0 00-.063-1.1 8.3 8.3 0 00-.179-1.02 6.937 6.937 0 00-.295-.928 6.287 6.287 0 00-.406-.832l-.034-.063a6.577 6.577 0 00-.532-.769 5.915 5.915 0 00-.624-.677 6.078 6.078 0 00-.721-.721 6.823 6.823 0 00-.812-.484 7.955 7.955 0 00-1.818-.653h-.106a.377.377 0 01-.314-.372v-2.277a.232.232 0 00-.048-.14.213.213 0 00-.155-.063h-2.541a.222.222 0 00-.155.063.213.213 0 00-.063.15z"
                                transform="translate(-3.57 -2.829)"
                            ></Path>
                            <G
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                                data-name="Ellipse 34"
                                transform="translate(.018)"
                            >
                                <Ellipse cx="26" cy="26.5" stroke="none" rx="26" ry="26.5"></Ellipse>
                                <Ellipse cx="26" cy="26.5" rx="25" ry="25.5"></Ellipse>
                            </G>
                        </G>
                    </Svg>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 15,
                            color: 'white',
                            textAlign: 'center',
                            marginTop: 5
                        }}
                    >
                        {locales('titles.onlyWant')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 18,
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                        {locales('titles.getThePrice')}
                    </Text>
                </Pressable>

            </View>
            <Button
                onPress={() => changeStep(3)}
                style={[styles.backButtonContainer, { borderRadius: 8, marginTop: 50 }]}
                rounded
            >
                <Text style={styles.backButtonText}>
                    {locales('titles.previousStep')}
                </Text>
                <FontAwesome5
                    name='arrow-right'
                    size={15}
                    color='#909090'
                />
            </Button>
        </View>
    );
};

const GetProvince = props => {
    const {
        changeStep = _ => { },
        saveProvince = _ => { },
        allProvincesObject = {}
    } = props;

    let {
        provinces: provincesFromProps = []
    } = allProvincesObject;

    const [provinces, setProvinces] = useState(provincesFromProps);

    const [provinceSearch, setProvinceSearch] = useState(null);

    const onProvinceSearchChanged = pSearch => {

        setProvinceSearch(pSearch);

        if (!pSearch)
            return setProvinces(provincesFromProps);

        const tempProvinces = provinces.filter(item => item.province_name.includes(pSearch));
        setProvinces(tempProvinces);
    };

    const onProvinceSelected = (value) => {

        if (provinces.length) {

            const foundProvinceIndex = provinces.findIndex(item => item.id == value);

            let cities = {};
            let provinceName = '';

            if (foundProvinceIndex > -1) {
                cities = provinces[foundProvinceIndex].cities;
                provinceName = provinces[foundProvinceIndex].province_name;
            }

            if (!Array.isArray(cities))
                cities = Object.values(cities);

            saveProvince(value, provinceName, cities);
        }
    };

    const renderProvincesListEmptyComponent = _ => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: deviceHeight * 0.2
                }}
            >
                <FontAwesome5
                    name='search'
                    size={25}
                    color='#BEBEBE'
                />
                <Text
                    style={{
                        color: '#BEBEBE',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16,
                        textAlign: 'center',
                        marginVertical: 5
                    }}
                >
                    {locales('labels.noProvinceFound')}
                </Text>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                onPress={_ => onProvinceSelected(item.id)}
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: '#E0E0E0',
                    borderBottomWidth: 1,
                    padding: 20
                }}
            >
                <Text
                    style={{
                        color: '#38485F',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 12,
                        width: '90%'
                    }}
                >
                    {item.province_name}
                </Text>
                <FontAwesome5
                    name='angle-left'
                    size={20}
                    color='#38485F'
                />
            </Pressable>
        );
    };

    const renderKeyExtractor = item => item.id.toString();

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Text
                style={{
                    color: '#555555',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 18,
                }}
            >
                {locales('labels.selectTargetProvince')}
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
                {locales('labels.searchForTargetProvince')}
            </Text>

            <InputGroup
                regular
                style={{
                    borderRadius: 8,
                    borderColor: '#a8a8a8',
                    paddingHorizontal: 10,
                    backgroundColor: '#FBFBFB',
                }}
            >
                <FontAwesome5
                    name={provinceSearch ? 'times' : 'search'}
                    color='#a8a8a8'
                    size={16}
                    onPress={_ => {
                        if (provinceSearch) {
                            setProvinceSearch(null);
                            onProvinceSearchChanged();

                        }
                    }}
                    solid
                    style={{
                        marginLeft: 10,
                    }}
                />
                <Input
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
                    onChangeText={onProvinceSearchChanged}
                    value={provinceSearch}
                    placeholder={locales('labels.searchForProvince')}
                    placeholderTextColor="#BEBEBE"
                />
            </InputGroup>

            <FlatList
                keyboardDismissMode='none'
                keyboardShouldPersistTaps='handled'
                renderItem={renderItem}
                keyExtractor={renderKeyExtractor}
                data={provinces}
                style={{
                    borderWidth: 1,
                    borderColor: '#BDC4CC',
                    borderRadius: 8,
                    marginVertical: 20,

                }}
                ListEmptyComponent={renderProvincesListEmptyComponent}
            />

            <Button
                onPress={() => changeStep(4)}
                style={[styles.backButtonContainer, { borderRadius: 8, margin: 0 }]}
                rounded
            >
                <Text style={styles.backButtonText}>
                    {locales('titles.previousStep')}
                </Text>
                <FontAwesome5
                    name='arrow-right'
                    size={15}
                    color='#909090'
                />
            </Button>

        </View>
    )
};

const GetCity = props => {
    const {
        changeStep = _ => { },
        saveCity = _ => { },
        cities: citiesFromProps = []
    } = props;

    const [citySearch, setCitySearch] = useState(null);

    const [cities, setCities] = useState(citiesFromProps);

    const onCitySearchChanged = cSearch => {
        setCitySearch(cSearch);

        if (!cSearch)
            return setCities(citiesFromProps);

        const tempCities = cities.filter(item => item.city_name.includes(cSearch));
        setCities(tempCities);
    };

    const onCitySelected = (value) => {
        const cityName = cities.find(item => item.id == value)?.city_name ?? '';
        saveCity(value, cityName);
    };

    const renderCitiesListEmptyComponent = _ => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: deviceHeight * 0.2
                }}
            >
                <FontAwesome5
                    name='search'
                    size={25}
                    color='#BEBEBE'
                />
                <Text
                    style={{
                        color: '#BEBEBE',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16,
                        textAlign: 'center',
                        marginVertical: 5
                    }}
                >
                    {locales('labels.noCityFound')}
                </Text>
            </View>

        );
    };

    const renderItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                onPress={_ => onCitySelected(item.id)}
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: '#E0E0E0',
                    borderBottomWidth: 1,
                    padding: 20
                }}
            >
                <Text
                    style={{
                        color: '#38485F',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 12,
                        width: '90%'
                    }}
                >
                    {item.city_name}
                </Text>
                <FontAwesome5
                    name='angle-left'
                    size={20}
                    color='#38485F'
                />
            </Pressable>
        );
    };

    const renderKeyExtractor = item => item.id.toString();

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Text
                style={{
                    color: '#555555',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    fontSize: 18,
                }}
            >
                {locales('labels.selectTargetCity')}
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
                {locales('labels.searchForTargetCity')}
            </Text>

            <InputGroup
                regular
                style={{
                    borderRadius: 8,
                    borderColor: '#a8a8a8',
                    paddingHorizontal: 10,
                    backgroundColor: '#FBFBFB',
                }}
            >
                <FontAwesome5
                    name={citySearch ? 'times' : 'search'}
                    color='#a8a8a8'
                    size={16}
                    onPress={_ => {
                        if (citySearch) {
                            setCitySearch(null);
                            onCitySearchChanged();

                        }
                    }}
                    solid
                    style={{
                        marginLeft: 10,
                    }}
                />
                <Input
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
                    onChangeText={onCitySearchChanged}
                    value={citySearch}
                    placeholder={locales('labels.searchForCity')}
                    placeholderTextColor="#BEBEBE"
                />
            </InputGroup>

            <FlatList
                keyboardDismissMode='none'
                keyboardShouldPersistTaps='handled'
                renderItem={renderItem}
                keyExtractor={renderKeyExtractor}
                data={cities}
                style={{
                    borderWidth: 1,
                    borderColor: '#BDC4CC',
                    borderRadius: 8,
                    marginVertical: 20,

                }}
                ListEmptyComponent={renderCitiesListEmptyComponent}
            />

            <Button
                onPress={() => changeStep(5)}
                style={[styles.backButtonContainer, { borderRadius: 8, margin: 0 }]}
                rounded
            >
                <Text style={styles.backButtonText}>
                    {locales('titles.previousStep')}
                </Text>
                <FontAwesome5
                    name='arrow-right'
                    size={15}
                    color='#909090'
                />
            </Button>

        </View>
    )
};

const GetIntentToSendBuyAdRequest = props => {
    const {
        changeStep = _ => { },
        subCategoryName = '',
        onRequestClose = _ => { },
        subCategoryId,
        setShowLoader = _ => { },
        productName,
        isAlreadySignedUp,
        saveIntentTypeToSendBuyAdRequest = _ => { }
    } = props;

    const [showBuyAdFields, setShowBuyAdFields] = useState(false);


    const [productType, setProductType] = useState(productName);
    const [productTypeError, setProductTypeError] = useState(null);
    const [productTypeClicked, setProductTypeClicked] = useState(false);

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(null);
    const [amountClicked, setAmountClicked] = useState(false);
    const [amountText, setAmountText] = useState('');

    const onIntentButtonClicked = type => {
        saveIntentTypeToSendBuyAdRequest(type);
        if (type == 0) {
            setShowBuyAdFields(false);
            if (isAlreadySignedUp)
                onRequestClose(true);
            else
                setShowLoader(true);
        }
        else {
            setShowBuyAdFields(true);
        }
    };


    const onProductTypeChanged = value => {
        setProductTypeError((!!!value || validator.isPersianName(value)) ? null : locales('errors.invalidFormat', { fieldName: locales('titles.productType') }));
        setProductTypeClicked(!!value);
        setProductType(value);
    };

    const onAmountChanged = value => {
        setAmountError(value && (value <= 0 || value >= 1000000000) ? locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.amountNeeded') }) : null);
        setAmountClicked(!!value && value > 0 && value < 1000000000);
        setAmount(value);
        setAmountText(formatter.convertUnitsToText(value));
    };

    const onSubmit = () => {


        if (!amount) {
            setAmountError(locales('errors.pleaseEnterField', { fieldName: locales('titles.amountNeeded') }));
            setAmountClicked(true);
        }
        else if (amount && (amount <= 0 || amount >= 1000000000)) {
            setAmountError(locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.amountNeeded') }));
            setAmountClicked(true);
        }
        else {
            setAmountError(null);
            setAmountClicked(false);
        }

        if (productType && !validator.isPersianNameWithDigits(productType)) {
            setProductTypeError(locales('errors.invalidFormat', { fieldName: locales('titles.productType') }));
            setProductTypeClicked(true);
        }
        else {
            setProductTypeError(null);
            setProductTypeClicked(false);
        }

        if (!productTypeError && !amountError && amount && amount.length) {
            let requestObj = {
                name: productType,
                requirement_amount: amount,
                category_id: subCategoryId
            };
            setShowLoader(true);
            props.registerBuyAdRequest(requestObj).then(_ => {
                setShowLoader(false);
                onRequestClose(true);
            });
        }
    }
        ;

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
                    textAlign: 'center',
                    paddingHorizontal: 15
                }}
            >
                {locales('titles.intentToSendRequest')}
            </Text>


            <View
                style={{
                    flexDirection: 'row-reverse',
                    width: '100%',
                    justifyContent: 'space-around',
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginTop: 30
                }}
            >
                <Button
                    onPress={_ => onIntentButtonClicked(1)}
                    style={{
                        backgroundColor: showBuyAdFields ? '#E0E0E0' : '#00C569',
                        width: '35%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 0,
                        borderRadius: 8,
                        height: 50
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginHorizontal: 5
                        }}
                    >
                        {locales('labels.yes')}
                    </Text>
                </Button>

                <Button
                    onPress={_ => onIntentButtonClicked(0)}
                    style={{
                        backgroundColor: '#E41C38',
                        width: '35%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 0,
                        borderRadius: 8,
                        height: 50
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginHorizontal: 5
                        }}
                    >
                        {locales('labels.no')}
                    </Text>
                </Button>
            </View>
            {showBuyAdFields ?
                <View
                    style={{
                        marginTop: 50,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#777777',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                marginBottom: 8
                            }}
                        >
                            {locales('titles.type')}
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#21AD93',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200'
                                }}
                            >
                                {` ${subCategoryName} `}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#777777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200'
                                }}
                            >
                                {locales('titles.enterYouNeed')}
                            </Text>
                        </Text>

                        <InputGroup
                            regular
                            style={{
                                borderRadius: 8,
                                borderColor: (productTypeError ? '#D50000' : ((productType.length && validator.isPersianName(productType)) ? '#00C569' : '#a8a8a8')),
                                paddingHorizontal: 10,
                                backgroundColor: '#FBFBFB',
                            }}
                        >
                            <FontAwesome5
                                name={
                                    productType ? productTypeError ? 'times-circle' : 'check-circle' : productTypeClicked
                                        ? 'times-circle' : 'edit'}
                                color={productType ? productTypeError ? '#E41C38' : '#00C569'
                                    : productTypeClicked ? '#E41C38' : '#BDC4CC'}
                                size={16}
                                solid
                                style={{
                                    marginLeft: 10,
                                }}
                            />
                            <Input
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
                                onChangeText={onProductTypeChanged}
                                value={productType}
                                placeholder={locales('titles.enterYouNeedProduct')}
                                placeholderTextColor="#BEBEBE"

                            />
                        </InputGroup>
                        <Label
                            style={{
                                height: 25,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                textAlign: !productTypeError && productType.length ? 'left' : 'right'
                            }}
                        >
                            {!!productTypeError ?
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#D81A1A',
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}
                                >
                                    {productTypeError}
                                </Text>
                                : null
                            }
                        </Label>

                    </View>

                    <View
                        style={{
                            marginTop: 20
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#777777',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                marginBottom: 8
                            }}
                        >
                            {locales('titles.howMuch')}
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#21AD93',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200'
                                }}
                            >
                                {` ${subCategoryName} `}
                            </Text>
                            {productType && productType.length ?
                                <>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#777777',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontWeight: '200'
                                        }}
                                    >
                                        {locales('labels.fromType')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#21AD93',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontWeight: '200'
                                        }}
                                    >
                                        {` ${productType} `}
                                    </Text>
                                </>
                                :
                                null
                            }
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#777777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontWeight: '200'
                                }}
                            >
                                {locales('titles.youNeed')}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#E41C38',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    fontWeight: '200'
                                }}
                            >
                                {` (${locales('labels.kiloGram')}) `}
                            </Text>
                        </Text>

                        <InputGroup
                            regular
                            style={{
                                borderRadius: 8,
                                borderColor: (amountError ? '#D50000' : (amount.length ? '#00C569' : '#a8a8a8')),
                                paddingHorizontal: 10,
                                backgroundColor: '#FBFBFB',
                            }}
                        >
                            <FontAwesome5
                                name={
                                    amount ? amountError ? 'times-circle' : 'check-circle' : amountClicked
                                        ? 'times-circle' : 'edit'}
                                color={amount ? amountError ? '#E41C38' : '#00C569'
                                    : amountClicked ? '#E41C38' : '#BDC4CC'}
                                size={16}
                                solid
                                style={{
                                    marginLeft: 10,
                                }}
                            />
                            <Input
                                maxLength={13}
                                autoCapitalize='none'
                                keyboardType='number-pad'
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
                                onChangeText={onAmountChanged}
                                value={amount}
                                placeholder={locales('titles.amountWithExample')}
                                placeholderTextColor="#BEBEBE"

                            />
                        </InputGroup>

                        <Label style={{
                            height: 50,
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            textAlign: !amountError && amount.length ? 'left' : 'right'
                        }}>

                            {!!amountError && <Text style={{
                                fontSize: 14, color: '#D81A1A',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}> {amountError}</Text>}
                            {!amountError && amount.length ? <Text style={{
                                fontSize: 14, color: '#1DA1F2',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}>
                                {amountText}</Text> : null}

                        </Label>

                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: 40
                        }}
                    >
                        <Button
                            onPress={onSubmit}
                            style={{
                                backgroundColor: amount && amount.length && !amountError && !productTypeError ?
                                    '#00C569' :
                                    '#E0E0E0',
                                width: '45%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                elevation: 0,
                                borderRadius: 8,
                            }}
                        >
                            <FontAwesome5
                                name='check'
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
                                {locales('labels.justSubmit')}
                            </Text>
                        </Button>
                        <Button
                            onPress={() => changeStep(6)}
                            style={[styles.backButtonContainer, { borderRadius: 8 }]}
                            rounded
                        >
                            <Text style={styles.backButtonText}>
                                {locales('titles.previousStep')}
                            </Text>
                            <FontAwesome5
                                name='arrow-right'
                                size={15}
                                color='#909090'
                            />
                        </Button>
                    </View>

                </View>
                :
                <Button
                    onPress={() => changeStep(6)}
                    style={[styles.backButtonContainer, { borderRadius: 8, marginTop: 50 }]}
                    rounded
                >
                    <Text style={styles.backButtonText}>
                        {locales('titles.previousStep')}
                    </Text>
                    <FontAwesome5
                        name='arrow-right'
                        size={15}
                        color='#909090'
                    />
                </Button>
            }
        </ScrollView>
    );
};

const Loader = _ => {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
            }}
        >
            <ActivityIndicator
                color='#00C569'
                size={60}
            />
            <Text
                style={{
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 16,
                    color: '#595959',
                    textAlign: 'center',
                    marginTop: 20
                }}
            >
                {locales('labels.pleaseWait')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, paddingHorizontal: deviceWidth * 0.06 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 10, top: 20 },
    cell: {
        width: 75,
        height: 50,
        lineHeight: 50,
        borderRadius: 8,
        fontSize: 24,
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: '#FBFBFB',
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
        color: '#909090',
        width: '70%',
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        fontSize: 18,
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 8,
        elevation: 0,
        borderWidth: 1,
        borderColor: '#BEBEBE',
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
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        fontSize: 18,
        textAlignVertical: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        elevation: 0,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
    },
    loginButton: {
        textAlign: 'center',
        backgroundColor: '#00C569',
        elevation: 0,
        borderRadius: 8,
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
    profileReducer,
    locationsReducer,
    registerProductReducer,
}) => {

    const {
        registerBuyAdRequestLoading
    } = registerProductReducer;

    const {
        userProfileLoading
    } = profileReducer;

    const {
        checkAlreadySignedUpMobileNumberLoading,
        checkActivisionCodeLoading,
        loginLoading,
        submitRegisterLoading
    } = authReducer;

    const {
        provinceLoading,
        allProvincesObject,
    } = locationsReducer;

    return {
        checkAlreadySignedUpMobileNumberLoading,
        checkActivisionCodeLoading,
        loginLoading,
        submitRegisterLoading,

        userProfileLoading,

        provinceLoading,
        allProvincesObject,

        registerBuyAdRequestLoading
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
        fetchAllProvinces: _ => dispatch(locationActions.fetchAllProvinces(undefined, true)),
        submitRegister: (registerObject) => dispatch(authActions.submitRegister(registerObject)),
        login: (mobileNumber, password) => dispatch(authActions.login(mobileNumber, password)),
        registerBuyAdRequest: requestObj => dispatch(registerProductActions.registerBuyAdRequest(requestObj)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterationModal);