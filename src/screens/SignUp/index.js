import React from 'react';
import { Text, View, StyleSheet, BackHandler, ScrollView } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import EnterActivisionCode from './Steps/EnterActivisionCode';
import UserBasicInfo from './Steps/userBasicInfo';
import ChooseCity from './Steps/chooseCity';
import UserActivity from './Steps/userActivity';

import * as authActions from '../../redux/auth/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import { deviceHeight, deviceWidth, formatter } from '../../utils';
import Login from '../Login/Login';
import ENUMS from '../../enums';



let stepsArray = [1, 2, 3, 4, 5]
class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            verificationCode: '',
            mobileNumber: '',
            firstName: '',
            provinceName: '',
            cityName: '',
            lastName: '',
            successfullAlert: false,
            gender: '',
            userName: '',
            password: '',
            activityZone: '',
            signUpError: '',
            activityType: '',
            city: '',
            province: '',
            stepNumber: 1,
        }
    }

    _isMounted = true;

    componentDidMount() {

        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "register",
            screen_class: "register",
        });

        this._isMounted = true;
        if (this._isMounted) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.stepNumber > 1) {
                    this.setState({ stepNumber: this.state.stepNumber - 1 })
                    return true;
                }
            })
        }
    }


    componentWillUnmount() {
        this._isMounted = false;
        this.setState({ successfullAlert: false })
        BackHandler.removeEventListener();
    }

    changeStep = stepNumber => {
        this.setState({ stepNumber })
    };


    onHeaderBackButtonClicked = event => {
        this.setState({ stepNumber: this.state.stepNumber - 1 });
    };


    setMobileNumber = mobileNumber => {
        this.setState({ mobileNumber }, () => this.changeStep(2))
    };

    setFullNameAndGender = (firstName, lastName, gender) => {
        this.setState({ firstName, lastName, gender }, () => this.changeStep(4))
    };
    setCityAndProvice = (city, province, provinceName, cityName) => {
        this.setState({ city, province, provinceName, cityName }, () => this.changeStep(5))
    };

    setUserAuthorities = (userName, password) => {
        this.setState({ userName, password }, () => this.changeStep(6))
    };

    setActivityZoneAndType = (activityZone, activityType, fromBack) => {
        this.setState({ activityZone, activityType, password: formatter.makeRandomString(8) }, () => { if (!fromBack) this.submitRegister() });
    };

    submitRegister = () => {
        let {
            mobileNumber,
            firstName,
            lastName,
            gender,
            userName,
            password = '',
            activityZone,
            activityType,
            city,
            province,
            provinceName,
            cityName,
            verificationCode
        } = this.state;

        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            contact,
            profile_photo
        } = params;

        let registerObject = {
            phone: formatter.toLatinNumbers(mobileNumber),
            first_name: firstName,
            last_name: lastName,
            password,
            user_name: '',
            sex: gender,
            province: provinceName,
            city: cityName,
            activity_type: activityType == 'buyer' ? '1' : '0',
            category_id: activityZone,
            verification_code: formatter.toLatinNumbers(verificationCode)
        };
        this.props.submitRegister(registerObject).then(result => {
            AsyncStorage.setItem('@IsNewSignedUpUser', JSON.stringify(true))
            analytics().logEvent('successfull_register', {
                mobile_number: mobileNumber
            })
            this.setState({ successfullAlert: true }, () => {
                setTimeout(() => {
                    this.props.login(mobileNumber, password).then((result) => {
                        let item = {
                            from_record_number: 0,
                            sort_by: ENUMS.SORT_LIST.values.BM,
                            to_record_number: 16,
                        };
                        this.props.fetchAllProductsList(item, true).then(_ => this.props.updateProductsList(true));
                        analytics().setUserId(result.payload.id.toString());
                        this.props.fetchUserProfile().then(_ => {
                            if (contact && Object.keys(contact).length) {
                                const popAction = StackActions.pop(1);
                                this.props.navigation.dispatch(popAction);
                                this.props.navigation.navigate('Home', { screen: 'Chat', params: { profile_photo, contact } })
                            }
                        })
                        this.setState({ signUpError: '' })
                    }, 100)
                })
            })
        }).catch(err => {
            if (err && err.data)
                this.setState({ signUpError: Object.values(err.data.errors)[0][0] });
        });
    };

    setVerificationCode = verificationCode => {
        this.setState({ verificationCode }, () => {
            this.changeStep(3);
        })
    }

    renderSteps = () => {
        let {
            stepNumber,
            mobileNumber,
            verificationCode,
            gender,
            firstName,
            lastName,
            province,
            city,
            password,
            activityType,
            activityZone
        } = this.state;

        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            contact,
            profile_photo
        } = params;

        switch (stepNumber) {

            case 1: {
                return <Login mobileNumber={mobileNumber} changeStep={this.changeStep} setMobileNumber={this.setMobileNumber}  {...this.props} />
            }
            case 2: {
                return <EnterActivisionCode
                    profile_photo={profile_photo}
                    contact={contact}
                    setVerificationCode={this.setVerificationCode}
                    verificationCode={verificationCode}
                    changeStep={this.changeStep}
                    mobileNumber={this.state.mobileNumber}
                    {...this.props}
                />
            }
            case 3: {
                return <UserBasicInfo gender={gender} firstName={firstName} lastName={lastName} {...this.props} changeStep={this.changeStep} setFullNameAndGender={this.setFullNameAndGender} />
            }
            case 4: {
                return <ChooseCity province={province} city={city} {...this.props} changeStep={this.changeStep} setCityAndProvice={this.setCityAndProvice} />
            }
            // case 5: {
            //     return <UserAuthority password={password} changeStep={this.changeStep} setUserAuthorities={this.setUserAuthorities} {...this.props} />
            // }
            case 5: {
                return <UserActivity activityType={activityType} activityZone={activityZone} changeStep={this.changeStep} setActivityZoneAndType={this.setActivityZoneAndType} setUserAuthorities={this.setUserAuthorities} {...this.props} />
            }
            default:
                break;
        }

    };

    render() {
        let { successfullAlert, stepNumber, signUpError } = this.state;
        return (
            <>

                <ScrollView

                    keyboardShouldPersistTaps='handled'
                >

                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0.8, y: 0.2 }}
                        colors={['#00C569', '#21AD93']}
                    >
                        <View style={[styles.linearGradient, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text
                                style={[styles.headerTextStyle]}
                            >
                                {locales('titles.enterToBuskool')}
                            </Text>
                        </View >
                    </LinearGradient>
                    <View style={{
                        width: deviceWidth,
                        flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                    }}>
                        <View style={{
                            marginTop: 20,
                            flexDirection: 'row-reverse',
                            alignItems: 'stretch',
                            alignContent: 'center', alignSelf: 'center',
                            width: deviceWidth - 80,

                        }}>
                            {stepsArray.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <ShadowView
                                            style={{
                                                shadowColor: 'black',
                                                shadowOpacity: 0.13,
                                                shadowRadius: 1,
                                                shadowOffset: { width: 0, height: 2 },
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center', color: 'white', alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center', alignContent: 'center',
                                                    shadowOffset: { width: 10, height: 10 },
                                                    shadowColor: 'black',
                                                    shadowOpacity: 1.0,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                    textAlignVertical: 'center', borderColor: '#FFFFFF',
                                                    backgroundColor: stepNumber >= item ? "#00C569" : '#BEBEBE',
                                                    width: 26, height: 26, borderRadius: 13

                                                }}
                                            >
                                                {item}
                                            </Text>
                                        </ShadowView>
                                        {index < stepsArray.length - 1 && <View
                                            style={{
                                                height: 8,
                                                flex: 1,
                                                alignSelf: 'center',
                                                backgroundColor: stepNumber - 1 >= item ? "#00C569" : '#BEBEBE',
                                            }}>
                                        </View>
                                        }
                                    </React.Fragment>
                                )
                            }
                            )}
                        </View>
                    </View>

                    {signUpError ? <Text style={{
                        color: 'white',
                        backgroundColor: '#DC3545',
                        padding: 10, textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 16,
                        marginVertical: 10
                    }}>{signUpError}</Text> : null}
                    <View style={styles.stepsContainer}>
                        {successfullAlert && <View style={[styles.loginFailedContainer, { marginVertical: 10 }]}>
                            <Text
                                style={styles.loginFailedText}
                            >
                                {locales('titles.signUpDoneSuccessfully')}
                            </Text>
                        </View >
                        }
                        {this.renderSteps()}
                    </View>
                </ScrollView >
            </>
        )
    }
}
const styles = StyleSheet.create({
    stepsContainer: {
    },
    loginFailedContainer: {
        backgroundColor: '#D4EDDA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#155724'
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
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
        borderRadius: 5,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    headerTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 26,
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
})

const mapStateToProps = (state) => {
    return {
        submitLoading: state.authReducer.submitRegisterLoading,
        submitError: state.authReducer.submitRegisterError,
        submitFailed: state.authReducer.submitRegisterFailed,
        sumbitMessage: state.authReducer.submitRegisterMessage,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        submitRegister: (registerObject) => dispatch(authActions.submitRegister(registerObject)),
        login: (mobileNumber, password) => dispatch(authActions.login(mobileNumber, password)),
        updateProductsList: flag => dispatch(productsListActions.updateProductsList(flag)),
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)