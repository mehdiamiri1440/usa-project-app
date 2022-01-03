import React from 'react';
import { Text, View, StyleSheet, BackHandler, ScrollView } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
            stepNumber: 1
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

    setFullNameAndGender = (
        firstName,
        lastName,
        province,
        provinceName,
        city,
        cityName,
        activityType,
        activityZone
    ) => {
        this.setState({
            firstName,
            lastName,
            province,
            provinceName,
            cityName,
            city,
            activityType,
            activityZone,
            gender: 'man',
            password: formatter.makeRandomString(8)
        }, () => this.submitRegister())
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
            profile_photo,
            isFromRequests,
            isFromAchivePrice,
            parentRoute
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
            activity_type: activityType,
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
                        this.props.fetchUserProfile().then((userProfileResult = {}) => {

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

                            if (parentRoute)
                                switch (parentRoute) {
                                    case 'buyers': {
                                        if (is_seller)
                                            return this.props.navigation.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 1 } });
                                        return this.props.navigation.navigate('MyBuskool',
                                            {
                                                screen: 'ChangeRole', params: {
                                                    parentRoute: 'Messages', childRoute: 'MessagesIndex',
                                                    routeParams: { tabIndex: 1 }
                                                }
                                            });

                                    };
                                    case 'pricing': {
                                        if (is_seller)
                                            return this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                        return this.props.navigation.navigate('MyBuskool',
                                            {
                                                screen: 'ChangeRole', params: {
                                                    parentRoute: 'MyBuskool', childRoute: 'PromoteRegistration'
                                                }
                                            });

                                    };
                                    case 'msg': {
                                        if (is_seller)
                                            return this.props.navigation.navigate('MyBuskool', { screen: 'MessagesIndex' });
                                    };
                                    default:
                                        break;
                                }

                            global.meInfo.is_seller = is_seller;
                            global.meInfo.loggedInUserId = id;

                            const popAction = StackActions.pop(1);

                            if (contact && Object.keys(contact).length) {
                                this.props.navigation.dispatch(popAction);
                                this.props.navigation.navigate('Home', { screen: 'Chat', params: { profile_photo, contact } })
                            }

                            if (isFromRequests == true) {
                                AsyncStorage.setItem('@isBuyAdRequestsFocused', JSON.stringify(true));
                                this.props.navigation.dispatch(popAction);
                                if (is_seller)
                                    return this.props.navigation.navigate('RequestsStack', { screen: 'Requests' });
                                return this.props.navigation.navigate('Home', { screen: 'ProductsList' });
                            }

                            if (isFromAchivePrice == true) {
                                this.props.navigation.dispatch(popAction);
                                return props.navigation.navigate('Home', { screen: 'ProductsList' });
                            }
                        })
                        this.setState({ signUpError: '' })
                    }, 100)
                })
            })
        }).catch(err => {
            if (err && err.data)
                return this.setState({ signUpError: Object.values(err.data.errors)[0][0] });
            return this.setState({ signUpError: locales('labels.problemHappened') })
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
            profile_photo,
            isFromRequests,
            isFromAchivePrice,
        } = params;
        switch (stepNumber) {

            case 1: {
                return <Login mobileNumber={mobileNumber} changeStep={this.changeStep} setMobileNumber={this.setMobileNumber}  {...this.props} />
            }
            case 2: {
                return <EnterActivisionCode
                    profile_photo={profile_photo}
                    contact={contact}
                    isFromRequests={isFromRequests}
                    isFromAchivePrice={isFromAchivePrice}
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
                    style={{
                        backgroundColor: 'white'
                    }}
                    keyboardShouldPersistTaps='handled'
                >

                    <Text
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            padding: 20,
                            backgroundColor: '#264653',
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16,
                        }}
                    >
                        {stepNumber >= 3 ?
                            locales('titles.welcomeToBuskool') :
                            locales('titles.enterToBuskool')
                        }
                    </Text>

                    {signUpError ?
                        <Text
                            style={{
                                color: 'white',
                                backgroundColor: '#DC3545',
                                padding: 10, textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                marginVertical: 10
                            }}>
                            {signUpError}
                        </Text>
                        : null}

                    <View style={styles.stepsContainer}>
                        {successfullAlert && <View style={[styles.loginFailedContainer, { marginVertical: 10 }]}>
                            <Text
                                style={[styles.loginFailedText,
                                {
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }
                                ]}
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
        backgroundColor: '#FF9828',
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
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)