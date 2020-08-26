import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Input, Item, Label, Form, Container, Content, Header } from 'native-base';
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator, formatter } from '../../utils'
import * as authActions from '../../redux/auth/actions'
import * as profileActions from '../../redux/profile/actions';
import NoConnection from '../../components/noConnectionError';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
            mobileNumberError: '',
            password: '',
            mobileNumberStatus: '',
            showModal: false
        }
    }
    mobileNumberRef = React.createRef();
    passwordRef = React.createRef();

    componentDidMount() {

        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().setCurrentScreen(componentName, componentName);
            }
        });
        analytics().setCurrentScreen("register", "register");

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

        analytics().logEvent('send_verification_code', {
            mobile_number: mobileNumber
        })

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
            })
            // .catch(_ => { ; this.setState({ showModal: true }) });
        }
        else {
            this.setState({ mobileNumberError })
        }
    };

    closeModal = _ => {
        this.setState({ showModal: false });
        this.props.checkAlreadySingedUpMobileNumber(this.state.mobileNumber).then(_ => {
            this.props.setMobileNumber(this.state.mobileNumber);
        })
        // .catch(_ => { ; this.setState({ showModal: true }) });
    }

    render() {
        let { message, loading, error } = this.props;
        let { mobileNumber, password, mobileNumberError } = this.state;

        return (
            <>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                >

                    <View >
                        <Text style={[styles.userText, { fontSize: 18 }]}>
                            {locales('messages.signedUpUser')}
                        </Text>

                        <View style={{
                            width: '100%'
                        }}>
                            <View style={[styles.labelInputPadding]}>
                                <Label style={{ color: '#333', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5, marginBottom: 10 }}>
                                    {locales('titles.enterPhoneNumber')}
                                </Label>
                                <Item regular style={{
                                    borderRadius: 5,
                                    overflow: "hidden",
                                    borderColor: (mobileNumberError ? '#D50000' : (mobileNumber.length && validator.isMobileNumber(mobileNumber)) ? '#00C569' : '#a8a8a8'),

                                }} >
                                    <Input
                                        testID='mobileNumber'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoCompleteType='off'
                                        keyboardType='number-pad'
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            textDecorationLine: 'none',
                                            fontSize: 16,
                                            height: 50,
                                            backgroundColor: '#fff',
                                            padding: 3
                                        }}
                                        onChangeText={this.onMobileNumberSubmit}
                                        value={mobileNumber}
                                        placeholderTextColor="#bebebe"
                                        placeholder={locales('titles.phoneNumber')}
                                        ref={this.mobileNumberRef}

                                    />
                                </Item>
                                {!!mobileNumberError && <Label style={{ fontSize: 14, color: '#D81A1A', textAlign: 'center' }}>{mobileNumberError}</Label>}
                            </View>
                            <View style={[styles.labelInputPadding]}>
                                <Button
                                    style={[!mobileNumber || !validator.isMobileNumber(mobileNumber)
                                        ? styles.disableLoginButton : styles.loginButton,
                                    {
                                        alignSelf: 'center', marginTop: 30, width: '100%'
                                    }]}
                                    onPress={() => this.onLogin()}

                                >
                                    <Text style={[styles.buttonText, { margin: 0, alignSelf: 'center' }]}>
                                        {locales('titles.login')}
                                    </Text>
                                    <ActivityIndicator size="small"
                                        animating={!!loading}
                                        color="white"
                                        style={{
                                            position: 'absolute', left: '35%', top: '28%',
                                            width: 25, height: 25, borderRadius: 15
                                        }}
                                    />
                                </Button>

                            </View>
                        </View>
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
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%'
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
        justifyContent: 'center',
        width: '100%'
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
        justifyContent: 'center',
        width: '100%'

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