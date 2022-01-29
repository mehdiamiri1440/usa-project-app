// import react-native element
import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

import { validator } from '../../../utils';
import { BuskoolButton, BuskoolTextInput } from '../../../components';

class ProductDecription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            isDescriptionFocused: false,
            descriptionError: '',
            descriptionClicked: false
        }
    }


    descriptionRef = React.createRef();
    isComponentMounted = false;
    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
            if (this.props.description) {
                const { description } = this.props;
                this.descriptionRef.current.value = description;
                this.setState({ description })
            }
            // BackHandler.addEventListener('hardwareBackPress', _ => {
            //     this.props.changeStep(4)
            //     return false;
            // })
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
        // BackHandler.removeEventListener();
    }

    handleHardWareBackButtonPressed = _ => {
        this.props.changeStep(5);
        return true;
    };

    onDescriptionSubmit = field => {
        this.setState(() => ({
            description: field,
            descriptionClicked: !!field,
            descriptionError: (!field || validator.isValidDescription(field)) ?
                '' : locales('errors.invalidDescription')
        }));
    };

    onSubmit = () => {
        const {
            description
        } = this.state;

        if (description && !validator.isValidDescription(description))
            this.setState({ descriptionError: locales('errors.invalidDescription') });
        else
            this.props.setProductDescription(this.state.description)
    };


    render() {
        let { description, descriptionError, descriptionClicked } = this.state;

        return (
            <ScrollView>
                <View
                    style={[{ backgroundColor: 'white' }]}>
                    <Text
                        style={{
                            margin: 10,
                            color: '#666666',
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.productDescription')}
                    </Text>

                    <View style={styles.textInputPadding}>
                        <BuskoolTextInput
                            multiline
                            onChangeText={this.onDescriptionSubmit}
                            error=''
                            value={description}
                            autoCapitalize='none'
                            autoCompleteType='off'
                            autoCorrect={false}
                            placeholderTextColor='#777777'
                            placeholder={locales('titles.descriptionWithExample')}
                            ref={this.descriptionRef}
                            style={{
                                paddingTop: 10,
                                direction: 'rtl',
                                textAlign: 'right',
                                width: '100%',
                                minHeight: deviceHeight * 0.4,
                                overflow: 'hidden',
                                paddingHorizontal: 15,
                                paddingVertical: 2,
                                color: '#333',
                                paddingTop: 20,
                                fontSize: 13,
                                textAlignVertical: 'top',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: description ? descriptionError ? '#E41C38' : description.length < 100 ? '#BDC4CC' : '#00C569' :
                                    descriptionClicked ? '#E41C38' : '#BDC4CC',
                                paddingLeft: 15,
                                backgroundColor: '#FBFBFB'
                            }}
                            rowSpan={5}
                        />
                        <FontAwesome5
                            name={
                                description ? descriptionError ? 'times-circle' : description.length < 100 ? 'edit' : 'check-circle' :
                                    descriptionClicked
                                        ? 'times-circle' : 'edit'}
                            color={description ? descriptionError ? '#E41C38' : description.length < 100 ? "#BDC4CC" : '#00C569'
                                : descriptionClicked ? '#E41C38' : '#BDC4CC'}
                            size={16}
                            solid
                            style={{
                                marginLeft: 15,
                                position: 'absolute',
                                top: '10%',
                                left: '5%'
                            }}
                        />
                        {description && description.length ?
                            <View
                                style={{
                                    borderTopWidth: 1,
                                    borderTopColor: '#E0E0E0',
                                    padding: 10,
                                    zIndex: 1000,
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '97%',
                                    bottom: 20,
                                    position: 'absolute'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        color: description.length >= 100 ? '#00C569' : '#E41C38'
                                    }}
                                >
                                    {description.length < 100 ? locales('labels.notSufficient') : locales('labels.sufficient')}
                                </Text>
                            </View>
                            : null
                        }
                    </View>
                    {description.length > 100 ? <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            height: 20, fontSize: 14, color: '#D81A1A',
                            marginRight: 20
                        }}>
                        {!!descriptionError && descriptionError}
                    </Text>
                        : null}

                    {/* 
                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#666666',
                            fontSize: 16,
                            paddingHorizontal: 20
                        }}
                    >
                        با کلیک روی دکمه ثبت نهایی موافقت خود را  با <Text
                            onPress={() => {
                                return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/privacy-and-policy`).then(supported => {
                                    if (supported) {
                                        Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/privacy-and-policy`);
                                    }
                                });
                            }}
                            style={{ color: '#1DA1F2' }}> قوانین و شرایط باسکول</Text> اعلام می کنید
                    </Text> */}

                    <View style={{
                        marginVertical: 20,
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <BuskoolButton
                            onPress={() => !descriptionError && this.onSubmit()}
                            style={descriptionError ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                            <FontAwesome5 name='arrow-left' style={{ marginRight: 10 }} size={14} color='white' />
                        </BuskoolButton>
                        <BuskoolButton
                            onPress={() => this.props.changeStep(5)}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <FontAwesome5 name='arrow-right' style={{ marginLeft: 10 }} size={14} color='#7E7E7E' />
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                        </BuskoolButton>
                    </View>

                </View>
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
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        height: 45,
        flexDirection: 'row-reverse',
        borderRadius: 5,
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        flexDirection: 'row-reverse',
        height: 45,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        backgroundColor: '#FF9828',
        borderRadius: 5,
        flexDirection: 'row-reverse',
        height: 45,
        width: '37%',
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    }
});

export default ProductDecription;