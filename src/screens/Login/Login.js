import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../utils'
import OutlinedTextField from '../../components/floatingInput';
import * as authActions from '../../redux/auth/actions'
import Spin from '../../components/loading/loading'
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
            password: '',
            mobileNumberStatus: ''
        }
    }
    mobileNumberRef = React.createRef();
    passwordRef = React.createRef();

    onMobileNumberSubmit = () => {
        let { current: field } = this.mobileNumberRef;
        setTimeout(() => {
            if (validator.isMobileNumber(field.value()))
                this.setState(() => ({
                    mobileNumber: field.value(),
                }));
            else
                this.setState(() => ({
                    mobileNumber: ''
                }));
        }, 10);
    };
    onPasswordSubmit = () => {
        let { current: field } = this.passwordRef;
        setTimeout(() => {
            this.setState(() => ({
                password: field.value()
            }));
        }, 10);
    };
    onLogin = () => {
        let { mobileNumber, password } = this.state
        this.props.login(mobileNumber, password).then((result) => {
            if (this.props.error) this.props.navigation.navigate('SignUp')
        })
    }
    render() {
        let { message, loading, error } = this.props
        let { mobileNumber, password } = this.state
        return (
            <ScrollView>
                <Spin spinning={loading} >
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0.8, y: 0.2 }}
                        colors={['#21AD93', '#12B87F', '#21AD93']}
                    >
                        <View style={styles.linearGradient}>
                            <Text
                                style={styles.headerTextStyle}
                            >
                                {locales('titles.enterToBuskool')}
                            </Text>
                        </View >
                    </LinearGradient>
                    <Text style={styles.userText}>
                        {locales('messages.signedUpUser')}
                    </Text>
                    {!error && message && message.length &&
                        <View style={styles.loginFailedContainer}>
                            <Text style={styles.loginFailedText}>
                                {message}
                            </Text>
                        </View>
                    }
                    <View style={styles.textInputPadding}>
                        <OutlinedTextField
                            baseColor={mobileNumber.length ? '#00C569' : '#a8a8a8'}
                            onChangeText={this.onMobileNumberSubmit}
                            ref={this.mobileNumberRef}
                            error=''
                            labelTextStyle={{ paddingTop: 5 }}
                            icon={
                                <AntDesign
                                    name="mobile1"
                                    style={{
                                        fontSize: 15,
                                        alignSelf: "center",
                                    }}
                                />
                            }
                            label={locales('titles.phoneNumber')}
                            keyboardType='phone-pad'
                        />
                    </View>
                    <View style={styles.textInputPadding}>
                        <OutlinedTextField
                            baseColor={password.length ? '#00C569' : '#a8a8a8'}
                            labelTextStyle={{ paddingTop: 5 }}
                            icon={
                                <AntDesign
                                    name="lock1"
                                    style={{
                                        fontSize: 15,
                                        alignSelf: "center",
                                    }}
                                />
                            }
                            onChangeText={this.onPasswordSubmit}
                            ref={this.passwordRef}
                            password={true}
                            label={locales('titles.password')}
                        />
                    </View>
                    <TouchableOpacity style={styles.forgotContainer}>
                        <EvilIcons
                            name="refresh"
                            style={{
                                fontSize: 30,
                                alignSelf: "center",
                                color: '#7E7E7E',
                            }}
                        />
                        <Text style={styles.forgotPassword}>{locales('messages.forgotPassword')}</Text>
                    </TouchableOpacity>
                    <Button
                        onPress={() => this.onLogin()}
                        style={!mobileNumber.length || !password.length ? styles.disableLoginButton : styles.loginButton}
                        rounded
                        disabled={!mobileNumber.length || !password.length}
                    >
                        <Text style={styles.buttonText}>{locales('titles.login')}</Text>
                    </Button>
                    <Text style={styles.forgotPassword}>
                        {locales('messages.startToSignUp')}
                    </Text>
                    <Button style={[styles.buttonText, styles.loginButton]} success rounded>
                        <Text style={{ color: 'white' }}>{locales('titles.signUpInBuskool')}</Text>
                    </Button>
                </Spin>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
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
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
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
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
const mapStateToProps = state => {
    console.warn('state===>', state)
    return {
        loading: state.authReducer.loginLoading,
        error: state.authReducer.loginError,
        message: state.authReducer.loginMessage,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        login: (mobileNumber, password) => dispatch(authActions.login(mobileNumber, password))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)