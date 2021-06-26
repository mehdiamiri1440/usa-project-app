

import React, { Component } from 'react';
import { View, Text, Image, Linking } from 'react-native';
import { Button } from 'native-base';
import RNRestart from 'react-native-restart';

import { validator } from './src/utils';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true })
    }

    openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    render() {
        if (this.state.hasError)
            return (
                <View
                >
                    <Image
                        source={require('./assets/images/error.png')}
                        style={{
                            width: '100%',
                            marginVertical: 30
                        }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{
                            color: '#556080',
                            textAlign: 'center',
                            marginVertical: 30,
                            fontSize: 31,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('labels.problemHappened')}
                    </Text>
                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <Text
                            style={{
                                color: '#38485F',
                                textAlign: 'center',
                                fontSize: 19,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {locales('labels.somethingWentWrong')}
                        </Text>
                        <Text
                            style={{
                                color: '#38485F',
                                textAlign: 'center',
                                fontSize: 19,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {locales('labels.pleaseRetry')}
                        </Text>
                    </View>
                    <Button
                        onPress={_ => RNRestart.Restart()}
                        style={{
                            backgroundColor: '#21AD93',
                            width: '70%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginVertical: 30,
                            height: 50,
                            borderRadius: 8,
                            elevation: 0
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 19,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('titles.retry')}
                        </Text>

                    </Button>

                    <Text
                        style={{
                            color: '#7E7E7E',
                            textAlign: 'center',
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginVertical: 10
                        }}
                    >
                        {locales('titles.callUs')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 10
                        }}
                    >
                        <Text
                            onPress={_ => this.openCallPad('09178928266')}
                            style={{
                                color: '#808C9B',
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            09178928266
                        </Text>
                        <Text
                            style={{
                                color: '#808C9B',
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {` - `}
                        </Text>
                        <Text
                            onPress={_ => this.openCallPad('09118413054')}
                            style={{
                                color: '#808C9B',
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            09118413054
                        </Text>
                    </View>
                </View>
            )
        return this.props.children;
    }
};

export default ErrorBoundary;
