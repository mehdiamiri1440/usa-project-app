// import react-native element
import React, { Component } from 'react';
import { Button, Textarea, Label } from 'native-base';
import { View, Text, StyleSheet, Linking } from "react-native";
import OutlinedTextField from '../../../components/floatingInput';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

class ProductDecription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            isDescriptionFocused: false
        }
    }


    descriptionRef = React.createRef();

    componentDidMount() {
        if (this.props.description) {
            const { description } = this.props;
            this.descriptionRef.current.value = description;
            this.setState({ description })
        }
    }

    onDescriptionSubmit = field => {
        this.setState(() => ({
            description: field
        }));
    };

    onSubmit = () => {
        this.props.setProductDescription(this.state.description)
    };


    render() {
        let { description, isDescriptionFocused } = this.state;

        return (
            <ScrollView>
                <View
                    style={[{ backgroundColor: 'white' }, styles.labelInputPadding]}>
                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#666666',
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.productDescription')}
                    </Text>

                    <View style={styles.textInputPadding}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('titles.description')}
                        </Label>
                        <Textarea
                            onChangeText={this.onDescriptionSubmit}
                            error=''
                            value={description}
                            autoCapitalize='none'
                            autoCompleteType='off'
                            autoCorrect={false}
                            placeholder={locales('titles.descriptionWithExample')}
                            ref={this.descriptionRef}
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light', borderRadius: 5,
                                borderColor: description.length ? '#00C569' : '#a8a8a8'
                            }}
                            rowSpan={5} bordered
                        />
                    </View>


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
                            style={{ color: '#00C569' }}> قوانین و شرایط باسکول</Text> اعلام می کنید
                    </Text>

                    <View style={{
                        marginVertical: 20, flexDirection: 'row',
                        width: '100%', justifyContent: 'space-between'
                    }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={styles.loginButton}
                            rounded
                        >
                            <AntDesign name='arrowleft' size={25} color='white' />
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
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
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
        textAlign: 'right',
        color: '#7E7E7E'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    }
});

export default ProductDecription;