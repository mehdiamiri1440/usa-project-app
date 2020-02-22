import React from 'react';
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import GetMobileNumberStep from './Steps/GetMobileNumberStep';
import EnterActivisionCode from './Steps/EnterActivisionCode';
import UserBasicInfo from './Steps/userBasicInfo';
import UserAuthority from './Steps/userAuthority';
import ChooseCity from './Steps/chooseCity';
import UserActivity from './Steps/userActivity';
import * as authActions from '../../redux/auth/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../utils';
import Spin from '../../components/loading/loading';

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
            stepNumber: 2
        }
    }
    componentWillUnmount() {
        this.setState({ successfullAlert: false })
    }

    changeStep = stepNumber => {
        this.setState({ stepNumber })
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
        this.setState({ activityZone, activityType }, () => this.submitRegitster());
    };

    submitRegitster = () => {
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
                    this.props.navigation.navigate('Login');
                }, 3000);
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
            <ScrollView>
                <Spin spinning={submitLoading}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0.8, y: 0.2 }}
                        colors={['#00C569', '#21AD93']}
                    >
                        <View style={styles.linearGradient}>
                            <Text
                                style={styles.headerTextStyle}
                            >
                                {locales('titles.signUpInBuskool')}
                            </Text>
                        </View >
                        <View style={{
                            width: deviceWidth, position: 'absolute', bottom: -15,
                            flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                        }}>
                            <View style={{
                                justifyContent: 'space-between',
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
                                                    textAlign: 'center', alignItems: 'center', justifyContent: 'center',
                                                    alignSelf: 'center', alignContent: 'center',
                                                    textAlignVertical: 'center',
                                                    backgroundColor: stepNumber >= item ? "pink" : 'gray',
                                                    width: 30, height: 30, borderWidth: 1, borderRadius: 15

                                                }}
                                            >
                                                {item}
                                            </Text>
                                        </>
                                    )
                                }
                                )}
                            </View>
                        </View>
                    </LinearGradient>
                    {successfullAlert && <View style={styles.loginFailedContainer}>
                        <Text
                            style={styles.loginFailedText}
                        >
                            {locales('titles.signUpDoneSuccessfully')}
                        </Text>
                    </View >
                    }
                    {this.renderSteps()}
                </Spin>
            </ScrollView >
        )
    }
}
const styles = StyleSheet.create({
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
        submitRegister: (registerObject) => dispatch(authActions.submitRegister(registerObject))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)