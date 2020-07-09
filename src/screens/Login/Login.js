import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button, Input, Item, Label, Form, Container, Content, Header } from 'native-base';
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator, formatter } from '../../utils'
import OutlinedTextField from '../../components/floatingInput';
import * as authActions from '../../redux/auth/actions'
import * as profileActions from '../../redux/profile/actions'
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
            mobileNumberError: '',
            password: '',
            mobileNumberStatus: ''
        }
    }
    mobileNumberRef = React.createRef();
    passwordRef = React.createRef();

    componentDidMount() {
        if (!!this.props.mobileNumber) {
            this.setState({ mobileNumber: this.props.mobileNumber })
        }
    }

    onMobileNumberSubmit = mobileNumber => {
        this.setState(() => ({
            mobileNumber,
            mobileNumberError: '',
        }));
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
        let { mobileNumber, password } = this.state;
        let mobileNumberError = '', isMobileNumberValid;

        if (!mobileNumber) {
            mobileNumberError = locales('errors.fieldNeeded', { fieldName: locales('titles.phoneNumber') });
            isMobileNumberValid = false;
        }
        else if (mobileNumber && !validator.isMobileNumber(mobileNumber)) {
            mobileNumberError = locales('errors.mobileNumberInvalidFormat');
            isMobileNumberValid = false;
        }
        else {
            mobileNumberError = '';
            isMobileNumberValid = true;
        }
        if (isMobileNumberValid) {
            this.props.checkAlreadySingedUpMobileNumber(mobileNumber).then(_ => {
                this.props.setMobileNumber(mobileNumber);
            });
        }
        else {
            this.setState({ mobileNumberError })
        }
    };

    render() {
        let { message, loading, error } = this.props;
        let { mobileNumber, password, mobileNumberError } = this.state;

        return (
            <>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                >

                    <View style={{ alignSelf: 'flex-start' }}>
                        <Text style={[styles.userText, { fontSize: 18 }]}>
                            {locales('messages.signedUpUser')}
                        </Text>
                        {/* {!error && message && message.length &&
                            <View style={styles.loginFailedContainer}>
                                <Text style={styles.loginFailedText}>
                                    {message}
                                </Text>
                            </View>
                        } */}
                        <View style={[styles.labelInputPadding,]}>
                            <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                {locales('titles.enterPhoneNumber')}
                            </Label>
                            <Item regular style={{
                                borderColor: (mobileNumberError ? '#D50000' : (mobileNumber.length && validator.isMobileNumber(mobileNumber)) ? '#00C569' : '#a8a8a8'), borderRadius: 5, padding: 3
                            }}>
                                <Input
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoCompleteType='off'
                                    keyboardType='number-pad'
                                    style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none', fontSize: 16 }}
                                    onChangeText={this.onMobileNumberSubmit}
                                    value={mobileNumber}
                                    placeholder={locales('titles.phoneNumber')}
                                    ref={this.mobileNumberRef}

                                />
                            </Item>
                            {!!mobileNumberError && <Label style={{ fontSize: 14, color: '#D81A1A', textAlign: 'center' }}>{mobileNumberError}</Label>}
                        </View>
                        {/* <View style={styles.textInputPadding}>
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
                    </View> */}
                        {/* <View style={styles.textInputPadding}>
                        <OutlinedTextField
                            baseColor={password.length >= 8 ? '#00C569' : '#a8a8a8'}
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
                    </View> */}
                        {/* <TouchableOpacity style={styles.forgotContainer}>
                        <EvilIcons
                            name="refresh"
                            style={{
                                fontSize: 30,
                                alignSelf: "center",
                                color: '#7E7E7E',
                            }}
                        />
                        <Text style={styles.forgotPassword}>{locales('messages.forgotPassword')}</Text>
                    </TouchableOpacity> */}
                        <Button
                            onPress={() => this.onLogin()}
                            style={[!mobileNumber || !validator.isMobileNumber(mobileNumber)
                                ? styles.disableLoginButton : styles.loginButton,
                            { alignSelf: 'center', marginTop: 30, width: '80%' }]}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.login')}</Text>
                            <ActivityIndicator size="small"
                                animating={!!loading} color="white"
                                style={{
                                    position: 'absolute', left: '37%', top: '28%',
                                    width: 25, height: 25, borderRadius: 15
                                }}
                            />

                        </Button>
                        {/* <Button
                        onPress={() => this.onLogin()}
                        style={!mobileNumber.length || !password.length ? styles.disableLoginButton : styles.loginButton}
                        rounded
                        disabled={!mobileNumber.length || !password.length}
                    >
                        <Text style={styles.buttonText}>{locales('titles.login')}</Text>
                    </Button> */}
                        {/* <Text style={[{ fontFamily: 'IRANSansMobile' }, styles.forgotPassword]}>
                        {locales('messages.startToSignUp')}
                    </Text>
                    <Button
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        style={[styles.buttonText, styles.loginButton]} success rounded>
                        <Text style={{ color: 'white' }}>{locales('titles.signUpInBuskool')}</Text>
                    </Button> */}
                    </View>
                </ScrollView>
            </>
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
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
    return {
        loading: state.authReducer.checkAlreadySignedUpMobileNumberLoading,
        error: state.authReducer.checkAlreadySignedUpMobileNumberError,
        message: state.authReducer.checkAlreadySignedUpMobileNumberMessage,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)