import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils'
import OutlinedTextField from '../../../components/floatingInput';
import * as authActions from '../../../redux/auth/actions'
import Spin from '../../../components/loading/loading'
class GetMobileNumberStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
        }
    }
    mobileNumberRef = React.createRef();

    onSubmit = () => {
        this.props.setMobileNumber(this.state.mobileNumber)
    }

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

    render() {
        let { message, loading, error } = this.props
        let { mobileNumber } = this.state
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
                                {locales('titles.signUpInBuskool')}
                            </Text>
                        </View >
                    </LinearGradient>
                    <Text style={styles.userText}>
                        {locales('messages.enterPhoneNumberToGetCode')}
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
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!mobileNumber.length ? styles.disableLoginButton : styles.loginButton}
                        rounded
                        disabled={!mobileNumber.length}
                    >
                        <Text style={styles.buttonText}>{locales('titles.submitNumber')}</Text>
                    </Button>
                    <Text
                        style={styles.forgotPassword}>
                        {locales('messages.backToLogin')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text
                            style={styles.enterText}>
                            {locales('titles.enterToBuskool')}
                        </Text>
                    </TouchableOpacity>
                </Spin>
            </ScrollView >
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
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
const mapStateToProps = state => {
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
export default connect(mapStateToProps, mapDispatchToProps)(GetMobileNumberStep)