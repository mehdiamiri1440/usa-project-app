import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Button, Input, Item, Label, Radio } from 'native-base';
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { validator } from '../../../utils';
import OutlinedTextField from '../../../components/floatingInput';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import * as authActions from '../../../redux/auth/actions'
import ENUMS from '../../../enums';


class UserBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNameError: '',
            lastNameError: '',
            genderError: '',
            firstName: '',
            lastName: '',
            gender: ''
        }
    }
    lastNameRef = React.createRef();
    firstNameRef = React.createRef();

    componentDidMount() {
        if (!!this.props.gender && !!this.props.firstName && !!this.props.lastName) {
            this.setState({ gender: this.props.gender, lastName: this.props.lastName, firstName: this.props.firstName });
        }
    }

    onSubmit = () => {

        let {
            gender, firstName, lastName
        } = this.state;

        let isGenderValid, isFirstNameValid, isLastNameValid, firstNameError, lastNameError, genderError;

        if (!gender) {
            genderError = locales('errors.fieldNeeded', { fieldName: locales('labels.gender') })
            isGenderValid = false;
        }
        else {
            genderError = '';
            isGenderValid = true;
        }

        if (!firstName) {
            firstNameError = locales('errors.fieldNeeded', { fieldName: locales('titles.firstName') })
            isFirstNameValid = false;
        }
        else if (!validator.isPersianName(firstName)) {
            firstNameError = locales('errors.invalidFormat', { fieldName: locales('titles.firstName') });
            isFirstNameValid = false;
        }
        else {
            firstNameError = '';
            isFirstNameValid = true;
        }


        if (!lastName) {
            lastNameError = locales('errors.fieldNeeded', { fieldName: locales('titles.lastName') })
            isLastNameValid = false;
        }
        else if (!validator.isPersianName(lastName)) {
            lastNameError = locales('errors.invalidFormat', { fieldName: locales('titles.lastName') });
            isLastNameValid = false;
        }
        else {
            lastNameError = '';
            isLastNameValid = true;
        }

        if (isLastNameValid && isFirstNameValid && isGenderValid) {
            this.props.setFullNameAndGender(this.state.firstName, this.state.lastName, this.state.gender);
        }
        else {
            this.setState({ firstNameError, lastNameError, genderError })
        }

    }

    onFirstNameSubmit = firstName => {
        this.setState(() => ({
            firstName,
            firstNameError: ''
        }));
    };

    onLastNameRef = lastName => {
        this.setState(() => ({
            lastName,
            lastNameError: ''
        }));
    };

    render() {
        let { message, loading, error } = this.props
        let { lastName, firstName, firstNameError, lastNameError, genderError } = this.state
        return (
            <View >
                <Text style={styles.userText}>
                    {locales('messages.enterUserBasicInfo')}
                </Text>
                <View style={[styles.textInputPadding, {
                    marginTop: -20,
                    alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 50
                }]}>
                    <TouchableOpacity
                        style={{
                            width: deviceWidth * 0.3,
                            borderWidth: 1, borderColor: this.state.genderError ? '#D50000' : (this.state.gender == 'woman' ? '#00C569' : '#BDC4CC'),
                            padding: 20, borderRadius: 5, flexDirection: 'row-reverse', marginHorizontal: 20
                        }}
                        onPress={() => this.setState({ gender: 'woman', genderError: '' })}
                    >
                        <Radio
                            onPress={() => this.setState({ gender: 'woman', genderError: '' })}
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
                        onPress={() => this.setState({ gender: 'man', genderError: '' })}
                        style={{
                            borderWidth: 1, borderColor: this.state.genderError ? '#D50000' : (this.state.gender == 'man' ? '#00C569' : '#BDC4CC'),
                            padding: 20, borderRadius: 5,
                            flexDirection: 'row-reverse',
                            width: deviceWidth * 0.3
                        }}>
                        <Radio
                            onPress={() => this.setState({ gender: 'man', genderError: '' })}
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
                {!!genderError && <Label
                    style={{ fontSize: 14, color: '#D81A1A', textAlign: 'center', marginVertical: -10, marginHorizontal: 20 }}>
                    {genderError}
                </Label>}

                <View style={[styles.labelInputPadding]}>
                    <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                        {locales('titles.enterFirstName')}
                    </Label>
                    <Item regular style={{
                        borderColor: (firstNameError ? '#D50000' : ((firstName.length && validator.isPersianName(firstName)) ? '#00C569' : '#a8a8a8')), borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none', fontSize: 16 }}
                            onChangeText={this.onFirstNameSubmit}
                            value={firstName}
                            placeholder={locales('titles.firstName')}
                            ref={this.firstNameRef}

                        />
                    </Item>
                    {!!firstNameError && <Label style={{ fontSize: 14, textAlign: 'center', color: '#D81A1A' }}>{firstNameError}</Label>}
                </View>
                {/* <View style={styles.textInputPadding}>
                        <OutlinedTextField
                            baseColor={firstName.length ? '#00C569' : '#a8a8a8'}
                            onChangeText={this.onFirstNameSubmit}
                            ref={this.firstNameRef}
                            isRtl={true}
                            error={error && message.length && message[0]}
                            labelTextStyle={{ paddingTop: 5 }}
                            label={locales('titles.firstName')}
                        />
                    </View> */}

                <View style={[styles.labelInputPadding, { marginTop: 10 }]}>
                    <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                        {locales('titles.enterLastName')}
                    </Label>
                    <Item regular style={{
                        borderColor: (lastNameError ? '#D50000' : ((lastName.length && validator.isPersianName(lastName)) ? '#00C569' : '#a8a8a8')), borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none', fontSize: 16 }}
                            onChangeText={this.onLastNameRef}
                            value={lastName}
                            placeholder={locales('titles.lastName')}
                            ref={this.lastNameRef}

                        />
                    </Item>
                    {!!lastNameError && <Label style={{ fontSize: 14, textAlign: 'center', color: '#D81A1A' }}>{lastNameError}</Label>}
                </View>
                {/* <View style={styles.textInputPadding}>
                        <OutlinedTextField
                            baseColor={lastName.length ? '#00C569' : '#a8a8a8'}
                            onChangeText={this.onLastNameRef}
                            ref={this.lastNameRef}
                            isRtl={true}
                            error={error && message.length && message[0]}
                            labelTextStyle={{ paddingTop: 5 }}
                            label={locales('titles.lastName')}
                        />
                    </View> */}
                <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between', marginTop: 5 }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!firstName.length || !this.state.gender || !lastName.length ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <Text style={styles.buttonText}>{locales('titles.submitInformation')}</Text>
                    </Button>
                    <Button
                        onPress={() => this.props.changeStep(2)}
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
    backButtonText: {
        color: '#7E7E7E',
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