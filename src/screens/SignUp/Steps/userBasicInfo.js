import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Radio, Button } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { validator } from '../../../utils';
import OutlinedTextField from '../../../components/floatingInput';
import * as authActions from '../../../redux/auth/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';


class UserBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            gender: 'woman'
        }
    }
    lastNameRef = React.createRef();
    firstNameRef = React.createRef();



    onSubmit = () => {
        this.props.setFullNameAndGender(this.state.firstName, this.state.lastName, this.state.gender)
    }

    onFirstNameSubmit = () => {
        let { current: field } = this.firstNameRef;
        setTimeout(() => {
            if (validator.isPersianName(field.value()))
                this.setState(() => ({
                    firstName: field.value(),
                }));
            else
                this.setState(() => ({
                    firstName: ''
                }));
        }, 10);
    };

    onLastNameRef = () => {
        let { current: field } = this.lastNameRef;
        setTimeout(() => {
            if (validator.isPersianName(field.value()))
                this.setState(() => ({
                    lastName: field.value(),
                }));
            else
                this.setState(() => ({
                    lastName: ''
                }));
        }, 10);
    };

    render() {
        let { message, loading, error } = this.props
        let { lastName, firstName } = this.state
        return (
            <Spin spinning={loading} >
                <Text style={styles.userText}>
                    {locales('messages.enterUserBasicInfo')}
                </Text>
                <View style={[styles.textInputPadding, {
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30
                }]}>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1, borderColor: this.state.gender == 'woman' ? '#00C569' : '#BDC4CC',
                            padding: 20, borderRadius: 5, flexDirection: 'row-reverse'
                            , justifyContent: 'space-between'
                        }}
                        onPress={() => this.setState({ gender: 'woman' })}
                    >
                        <Radio
                            onPress={() => this.setState({ gender: 'woman' })}
                            selected={this.state.gender === 'woman'}
                            color={"#BEBEBE"}
                            style={{ marginHorizontal: 10 }}
                            selectedColor={"#00C569"}
                        />
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Ionicons
                                name="ios-woman"
                                style={{
                                    fontSize: 25,
                                    alignSelf: "center",
                                }}
                            />
                            <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.woman')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ gender: 'man' })}
                        style={{
                            borderWidth: 1, borderColor: this.state.gender == 'man' ? '#00C569' : '#BDC4CC',
                            padding: 20, borderRadius: 5,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            marginHorizontal: 10,
                        }}>
                        <Radio
                            onPress={() => this.setState({ gender: 'man' })}
                            selected={this.state.gender === 'man'}
                            color={"#BEBEBE"}
                            style={{ marginHorizontal: 10 }}
                            selectedColor={"#00C569"}
                        />
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Ionicons
                                name="ios-man"
                                style={{
                                    fontSize: 25,
                                    alignSelf: "center",
                                }}
                            />
                            <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.man')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={firstName.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onFirstNameSubmit}
                        ref={this.firstNameRef}
                        isRtl={true}
                        error={error && message.length && message[0]}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.firstName')}
                    />
                </View>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={lastName.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onLastNameRef}
                        ref={this.lastNameRef}
                        isRtl={true}
                        error={error && message.length && message[0]}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.lastName')}
                    />
                </View>
                <Button
                    onPress={() => this.onSubmit()}
                    style={!firstName.length || !lastName.length ? styles.disableLoginButton : styles.loginButton}
                    rounded
                    disabled={!firstName.length || !lastName.length}
                >
                    <Text style={styles.buttonText}>{locales('titles.submitInformation')}</Text>
                </Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(UserBasicInfo)