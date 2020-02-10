import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, I18nManager } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils'
import * as authActions from '../../../redux/auth/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';
class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            city: '',
            index: -1
        }
    }
    provinceRef = React.createRef();
    cityRef = React.createRef();

    onSubmit = () => {

    }

    onProvinceSubmit = () => {
        let { current: field } = this.provinceRef;
        setTimeout(() => {
            this.setState(() => ({
                mobileNumber: field.value(),
            }));
        }, 10);
    };

    onCitySubmit = () => {
        let { current: field } = this.cityRef;
        setTimeout(() => {
            this.setState(() => ({
                mobileNumber: field.value(),
            }));
        }, 10);
    };
    componentDidMount() {
        if (!I18nManager.isRTL) {
            I18nManager.forceRTL(true);
        }
    }

    render() {
        let { message, loading, error } = this.props
        let { city = 'Mango', province } = this.state
        let data = [{
            value: 'Banana',
        }, {
            value: 'Mango',
        }, {
            value: 'Pear',
        }];
        return (
            <Spin spinning={loading} >
                <Text style={styles.userText}>
                    {locales('messages.enterPhoneNumberToGetCode')}
                </Text>
                {!error && message && message.length &&
                    <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>
                            {ENUMS.VERIFICATION_MESSAGES.list.filter(item => item.value === message)[0].title}
                        </Text>
                    </View>
                }
                <Dropdown
                    label={locales('labels.selectProvince')}
                    data={data}
                    isRtl={true}
                    onChangeText={(value) => this.setState({ city: value })}

                />
                {/* <Button
                    onPress={() => this.onSubmit()}
                    style={!mobileNumber.length ? styles.disableLoginButton : styles.loginButton}
                    rounded
                    disabled={!mobileNumber.length}
                >
                    <Text style={styles.buttonText}>{locales('titles.submitNumber')}</Text>
                </Button> */}
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
        loading: state.authReducer.checkAlreadySignedUpMobileNumberLoading,
        error: state.authReducer.checkAlreadySignedUpMobileNumberError,
        failed: state.authReducer.checkAlreadySignedUpMobileNumberFailed,
        message: state.authReducer.checkAlreadySignedUpMobileNumberMessage,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        checkAlreadySingedUpMobileNumber: (mobileNumber) => dispatch(authActions.checkAlreadySingedUpMobileNumber(mobileNumber))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChooseCity)