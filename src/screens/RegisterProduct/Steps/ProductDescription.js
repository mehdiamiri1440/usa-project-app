// import react-native element
import React, { Component } from 'react';
import { Button, Textarea, InputGroup, Label } from 'native-base';
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

import { validator } from '../../../utils';

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

    componentDidMount() {
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

    componentWillUnmount() {
        // BackHandler.removeEventListener();
    }

    onDescriptionSubmit = field => {
        this.setState(() => ({
            description: field,
            descriptionClicked: !!field,
            descriptionError: (!field || validator.isValidDescription(field)) ?
                '' : locales('errors.invalidDescription')
        }));
    };

    onSubmit = () => {
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
                        {/* <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5, fontSize: 15, marginVertical: 5 }}>
                            {locales('titles.writeYourFinalDescription')}
                        </Label> */}
                        <InputGroup
                            regular
                            style={{
                                borderRadius: 4,
                                borderColor: description ? descriptionError ? '#E41C38' : '#00C569' :
                                    descriptionClicked ? '#E41C38' : '#666',
                                paddingLeft: 15,
                                paddingHorizontal: 10,
                                backgroundColor: '#FBFBFB'
                            }}>
                            <FontAwesome5 name={
                                description ? descriptionError ? 'times-circle' : 'check-circle' : descriptionClicked
                                    ? 'times-circle' : 'edit'}
                                color={description ? descriptionError ? '#E41C38' : '#00C569'
                                    : descriptionClicked ? '#E41C38' : '#BDC4CC'}
                                size={16}
                                solid
                                style={{ position: 'absolute', top: 10, left: 10 }}
                            />
                            <Textarea
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    paddingTop: 10,
                                    direction: 'rtl',
                                    textAlign: 'right',
                                    width: '100%'
                                }}
                                rowSpan={5}
                            />
                        </InputGroup>
                        <Label style={{ height: 20, fontSize: 14, color: '#D81A1A' }}>
                            {!!descriptionError && descriptionError}
                        </Label>
                    </View>

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
                        <Button
                            onPress={() => !descriptionError && this.onSubmit()}
                            style={descriptionError ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <FontAwesome5 name='arrow-left' style={{ marginRight: 10 }} size={14} color='white' />
                            <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.changeStep(4)}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                            <FontAwesome5 name='arrow-right' style={{ marginLeft: 10 }} size={14} color='#7E7E7E' />
                        </Button>
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
        backgroundColor: '#00C569',
        borderRadius: 5,
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