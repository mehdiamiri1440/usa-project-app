import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { Button, Input, Item, Label, Form, Container, Content, Header } from 'native-base';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import { validator } from '../../../utils';

class UserAuthority extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordError: '',
            userName: '',
            password: '',
            repeatPassword: '',
            errors: [],
            errorFlag: false
        }
    }

    userNameRef = React.createRef();
    passwordRef = React.createRef();
    repeatPasswordRef = React.createRef();

    componentDidMount() {
        // if (I18nManager.isRTL) {
        //     I18nManager.forceRTL(false);
        // }
        if (!!this.props.password) {
            this.setState({ password: this.props.password });
        }
    };

    onSubmit = () => {
        let { userName, password, repeatPassword } = this.state;

        let isPasswordValid, passwordError;
        if (!password) {
            passwordError = locales('errors.fieldNeeded', { fieldName: locales('titles.password') });
            isPasswordValid = false;
        }
        else if (password && password.length < 8) {
            passwordError = locales('errors.passwordShouldBe8AtLeast');
            isPasswordValid = false;
        }
        else {
            passwordError = '';
            isPasswordValid = true;
        }
        if (isPasswordValid)
            this.props.setUserAuthorities(userName, password)
        else {
            this.setState({ passwordError })
        }

    };

    onUserNameSubmit = () => {
        let { current: field } = this.userNameRef;
        setTimeout(() => {
            this.setState(state => {
                let index = -1
                if (state.errors.length)
                    index = state.errors.some(item => item.errorName == 'invalidUserName') ?
                        index = state.errors.findIndex(item => item.errorName == 'invalidUserName') : -1;
                state.errorFlag = false;
                if (index > -1)
                    delete state.errors[index];
                state.userName = field.value();
                return '';
            });
        }, 10);
    };

    onPasswordSubmit = password => {
        this.setState({ password, passwordError: '' });
    };

    onRepeatPasswordSubmit = () => {
        let { current: field } = this.repeatPasswordRef;
        setTimeout(() => {
            this.setState(state => {
                let index = -1;
                if (state.errors.length)
                    index = state.errors.some(item => item.errorName == 'passwordsNotSame') ?
                        state.errors.findIndex(item => item.errorName == 'passwordsNotSame') : -1
                if (index > -1)
                    delete state.errors[index]
                state.repeatPassword = field.value();
                state.errorFlag = false;
                return "";
            });
        }, 10);
    };
    render() {
        let { password, repeatPassword, userName, passwordError, errors, errorFlag } = this.state;

        return (
            <View>
                <Text style={styles.userText}>
                    {locales('labels.registerPassword')}
                </Text>
                {/* <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={userName.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onUserNameSubmit}
                        ref={this.userNameRef}
                        icon={
                            <AntDesign
                                name="user"
                                style={{
                                    fontSize: 15,
                                    alignSelf: "center",
                                }}
                            />
                        }
                        error={errorFlag && errors.filter(error => error.errorName == 'invalidUserName').length ?
                            errors.filter(error => error.errorName == 'invalidUserName')[0].errorText : null}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.userName')}
                    />
                </View> */}
                <View style={[styles.labelInputPadding, { marginTop: -10 }]}>
                    <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                        {locales('titles.enterPassword')} <Text style={{
                            color: '#e41c38',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>({locales('titles.8CharLeast')})</Text>
                    </Label>
                    <Item regular style={{
                        borderRadius: 5,
                        overflow: "hidden",
                        borderColor: (passwordError ? '#D50000' : (password.length && validator.hasMinLength(password, { minLength: 8 })) ? '#00C569' : '#a8a8a8'), borderRadius: 5,
                    }}>
                        <Input
                            last
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            secureTextEntry={true}
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                textDecorationLine: 'none',
                                fontSize: 16,
                                height: 50,
                                backgroundColor: '#fff',
                                padding: 3
                            }}
                            onChangeText={this.onPasswordSubmit}
                            value={password}
                            placeholder={locales('titles.password')}
                            ref={this.passwordRef}

                        />
                    </Item>
                    {!!passwordError && <Label style={{
                        fontSize: 14, textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        color: '#D81A1A'
                    }}>{passwordError}</Label>}
                </View>
                {/* <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={password.length >= 8 ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onPasswordSubmit}
                        ref={this.passwordRef}
                        icon={
                            <FontAwesome5
                                name="unlock"
                                style={{
                                    fontSize: 15,
                                    alignSelf: "center",
                                }}
                            />
                        }
                        password={true}
                        error={errorFlag && errors.filter(error => error.errorName == 'passwordsNotSame').length ?
                            errors.filter(error => error.errorName == 'passwordsNotSame')[0].errorText :
                            errors.filter(error => error.errorName == 'passwordLength').length ?
                                errors.filter(error => error.errorName == 'passwordLength')[0].errorText : null}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.password')}
                    />
                </View> */}
                {/* <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        icon={
                            <FontAwesome5
                                name="unlock"
                                style={{
                                    fontSize: 15,
                                    alignSelf: "center",
                                }}
                            />
                        }
                        baseColor={repeatPassword.length >= 8 ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onRepeatPasswordSubmit}
                        ref={this.repeatPasswordRef}
                        password={true}
                        error={errorFlag && errors.filter(error => error.errorName == 'passwordsNotSame').length ?
                            errors.filter(error => error.errorName == 'passwordsNotSame')[0].errorText :
                            errors.filter(error => error.errorName == 'passwordLength').length ?
                                errors.filter(error => error.errorName == 'passwordLength')[0].errorText : null}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.repeatPassword')}
                    />
                </View> */}
                <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, justifyContent: 'space-between', marginTop: 5 }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!password || password.length < 8
                            ? styles.disableLoginButton
                            : styles.loginButton
                        }
                        rounded
                    >
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>
                    <Button
                        onPress={() => this.props.changeStep(4)}
                        style={styles.backButtonContainer}
                        rounded
                    >
                        <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                        <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                    </Button>
                </View>

            </View>
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
    backButtonText: {
        color: '#7E7E7E',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        width: '60%',
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
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',

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
        alignSelf: 'center',
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
export default UserAuthority