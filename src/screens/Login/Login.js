import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux'
import { Button, Input } from 'native-base';

import { validator } from '../../utils';
import * as authActions from '../../redux/auth/actions'
import * as profileActions from '../../redux/profile/actions';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
            mobileNumberError: '',
            password: '',
            mobileNumberStatus: '',
            firstLoad: false,
            isMobileNumberSentToServer: false
        }
    }
    mobileNumberRef = React.createRef();
    passwordRef = React.createRef();

    componentDidMount() {
        this.setState({ firstLoad: true });
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

        this.setState({ firstLoad: false });
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
            if (this.state.isMobileNumberSentToServer == true)
                return;
            this.setState({ isMobileNumberSentToServer: true }, _ => {
                this.props.checkAlreadySingedUpMobileNumber(mobileNumber).then(_ => {
                    this.setState({ isMobileNumberSentToServer: false });
                    this.props.setMobileNumber(mobileNumber);
                });
            });
        }
        else {
            this.setState({ mobileNumberError })
        }
    };

    closeModal = _ => {
        this.props.checkAlreadySingedUpMobileNumber(this.state.mobileNumber).then(_ => {
            this.props.setMobileNumber(this.state.mobileNumber);
        })
    }

    render() {
        let { message, loading, error } = this.props;
        let { mobileNumber, password, mobileNumberError, firstLoad } = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 40,
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        fontSize: 16,
                    }}
                >
                    {locales('messages.signedUpUser')}
                </Text>

                <Input
                    onSubmitEditing={this.onLogin}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='number-pad'
                    autoCompleteType='off'
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        borderRadius: 8,
                        borderWidth: 1,
                        marginTop: 50,
                        marginBottom: 0,
                        width: '93%',
                        backgroundColor: 'white',
                        borderColor: validator.isMobileNumber(mobileNumber) ? '#00c569' : 'rgba(0, 0, 0, 0.15)',
                        flexDirection: 'row',
                    }}
                    onChangeText={this.onMobileNumberSubmit}
                    value={mobileNumber}
                    placeholder={locales('titles.mobileNumber')}
                    placeholderTextColor="#BEBEBE"
                />
                {
                    error && !firstLoad ?
                        <Text
                            style={{
                                height: 40,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                color: '#F03738',
                                marginTop: 10,
                                width: '93%'
                            }}
                        >
                            {locales('errors.retryLatter')}
                        </Text>
                        : <Text
                            style={{
                                height: 40,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                color: '#F03738',
                                marginTop: 10,
                                width: '93%'
                            }}
                        >
                            {mobileNumberError}
                        </Text>
                }
                <Button
                    style={{
                        width: '93%',
                        borderRadius: 8,
                        backgroundColor: validator.isMobileNumber(mobileNumber) ? '#00c569' : 'rgba(0, 0, 0, 0.15)',
                        elevation: 0,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this.onLogin}
                >
                    <Text
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            color: validator.isMobileNumber(mobileNumber) ? 'white' : 'black',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                        }}
                    >
                        {locales('titles.login')}
                    </Text>
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: '37%',
                        }}
                        animating={!!loading && !firstLoad}
                        size={20}
                        color='white'
                    />
                </Button>
            </View>
        )
    }
}

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