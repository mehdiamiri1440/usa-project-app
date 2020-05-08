import React from 'react';
import { Text, View, StyleSheet, BackHandler } from 'react-native'
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import GetMobileNumberStep from './Steps/GetMobileNumberStep';
import EnterActivisionCode from './Steps/EnterActivisionCode';
import UserBasicInfo from './Steps/userBasicInfo';
import UserAuthority from './Steps/userAuthority';
import ChooseCity from './Steps/chooseCity';
import UserActivity from './Steps/userActivity';
import * as authActions from '../../redux/auth/actions';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../utils';
import Spin from '../../components/loading/loading';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

let stepsArray = [1, 2, 3, 4, 5, 6]
class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mobileNumber: '',
            firstName: '',
            lastName: '',
            successfullAlert: false,
            gender: '',
            userName: '',
            password: '',
            activityZone: '',
            activityType: '',
            city: '',
            province: '',
            stepNumber: 1
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.stepNumber > 1) {
                this.setState({ stepNumber: this.state.stepNumber - 1 })
                return true;
            }
        })
    }


    componentWillUnmount() {
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
    setCityAndProvice = (city, province) => {
        this.setState({ city, province }, () => this.changeStep(5))
    };

    setUserAuthorities = (userName, password) => {
        this.setState({ userName, password }, () => this.changeStep(6))
    };

    setActivityZoneAndType = (activityZone, activityType) => {
        this.setState({ activityZone, activityType }, () => this.submitRegister());
    };

    submitRegister = () => {
        let {
            mobileNumber,
            firstName,
            lastName,
            gender,
            userName,
            password,
            activityZone,
            activityType,
            city,
            province,
        } = this.state;

        let registerObject = {
            phone: mobileNumber,
            first_name: firstName,
            last_name: lastName,
            password,
            user_name: userName,
            sex: gender,
            province,
            city,
            activity_type: activityType,
            category_id: activityZone
        };
        this.props.submitRegister(registerObject).then(() => {
            this.setState({ successfullAlert: true }, () => {
                setTimeout(() => {
                    this.props.login(mobileNumber, password).then((result) => {
                    })
                }, 1500);
            })
        });
    }

    renderSteps = () => {
        let { stepNumber } = this.state
        switch (stepNumber) {
            case 1: {
                return <GetMobileNumberStep {...this.props} setMobileNumber={this.setMobileNumber} />
            }
            case 2: {
                return <EnterActivisionCode changeStep={this.changeStep} mobileNumber={this.state.mobileNumber} {...this.props} />
            }
            case 3: {
                return <UserBasicInfo {...this.props} setFullNameAndGender={this.setFullNameAndGender} />
            }
            case 4: {
                return <ChooseCity {...this.props} setCityAndProvice={this.setCityAndProvice} />
            }
            case 5: {
                return <UserAuthority setUserAuthorities={this.setUserAuthorities} {...this.props} />
            }
            case 6: {
                return <UserActivity setActivityZoneAndType={this.setActivityZoneAndType} setUserAuthorities={this.setUserAuthorities} {...this.props} />
            }
            default:
                break;
        }

    }
    render() {
        let { submitError, submitLoading, submitFailed, sumbitMessage } = this.props;
        let { successfullAlert, stepNumber } = this.state;
        return (
            <ScrollView
                keyboardShouldPersistTaps='handled'
            >
                <Spin spinning={submitLoading}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0.8, y: 0.2 }}
                        colors={['#00C569', '#21AD93']}
                    >
                        <View style={styles.linearGradient}>
                            {stepNumber > 1 && <TouchableOpacity
                                onPress={this.onHeaderBackButtonClicked}
                                style={{ alignItems: 'flex-end', paddingBottom: 10, paddingHorizontal: 10, width: deviceWidth }}
                            >
                                <AntDesign name='arrowright' size={25} color='white' />
                            </TouchableOpacity>}
                            <Text
                                style={styles.headerTextStyle}
                            >
                                {locales('titles.signUpInBuskool')}
                            </Text>
                        </View >
                    </LinearGradient>
                    <View style={{
                        width: deviceWidth, paddingVertical: 10,
                        flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'stretch',
                            alignContent: 'center', alignSelf: 'center',
                            width: deviceWidth - 80,

                        }}>
                            {stepsArray.map((item, index) => {
                                return (
                                    <>
                                        <Text
                                            style={{
                                                textAlign: 'center', color: 'white', alignItems: 'center', justifyContent: 'center',
                                                alignSelf: 'center', alignContent: 'center',
                                                shadowOffset: { width: 20, height: 20 },
                                                shadowColor: 'black',
                                                shadowOpacity: 1.0,
                                                elevation: 10,
                                                textAlignVertical: 'center', borderColor: '#FFFFFF',
                                                backgroundColor: stepNumber >= item ? "#00C569" : '#BEBEBE',
                                                width: 30, height: 30, borderRadius: 15

                                            }}
                                        >
                                            {item}
                                        </Text>
                                        {index < stepsArray.length - 1 && <View
                                            style={{
                                                height: 8,
                                                flex: 1,
                                                alignSelf: 'center',
                                                backgroundColor: stepNumber - 1 >= item ? "#00C569" : '#BEBEBE',
                                            }}>
                                        </View>
                                        }
                                    </>
                                )
                            }
                            )}
                        </View>
                    </View>

                    <View style={styles.stepsContainer}>
                        {successfullAlert && <View style={styles.loginFailedContainer}>
                            <Text
                                style={styles.loginFailedText}
                            >
                                {locales('titles.signUpDoneSuccessfully')}
                            </Text>
                        </View >
                        }
                        {this.renderSteps()}
                    </View>
                </Spin>
            </ScrollView >
        )
    }
}
const styles = StyleSheet.create({
    stepsContainer: {
        marginVertical: 30
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
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
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
        submitRegister: (registerObject) => dispatch(authActions.submitRegister(registerObject)),
        login: (mobileNumber, password) => dispatch(authActions.login(mobileNumber, password))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)