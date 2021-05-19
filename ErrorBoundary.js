

import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import RNRestart from 'react-native-restart';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceHeight, deviceWidth } from './src/utils/deviceDimenssions';


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }



    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ height: deviceHeight }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            style={{ width: deviceWidth, height: deviceHeight }}
                            source={require('./assets/images/warning.png')}
                        />
                    </View>
                    <View style={{ position: 'absolute', bottom: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)Light'
                                }}
                            >{locales('labels.somethingWentWrong')}</Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)Light'
                                }}
                            >{locales('labels.pleaseRetry')}</Text>
                        </View>
                        <Button
                            onPress={() => RNRestart.Restart()}
                            style={styles.loginButton}
                        >
                            <View style={[styles.textCenterView, styles.buttonText]}>
                                <Text style={[styles.textWhite, styles.margin5, {
                                    marginTop: 7,
                                    fontFamily: 'IRANSansWeb(FaNum)Light'
                                }]}>
                                    <MaterialCommunityIcons name='reload' size={23} />
                                </Text>
                                <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize20]}>
                                    {locales('titles.retry')}
                                </Text>
                            </View>
                        </Button>
                    </View>
                </View>)
        }

        return this.props.children;
    }
}


const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: 'transparent',
        borderWidth: 10
    },
    cardItemStyle: {
        shadowOffset: { width: 20, height: 20 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 6,
        borderRadius: 5
    },
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
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center',
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
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
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
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        // top: '15px',
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    actionsWrapper: {
        flexDirection: 'row-reverse',
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    elevatorIcon: {
        backgroundColor: '#7E7E7E',
        padding: 10,
        borderRadius: 4,
        height: 45,
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize20: {
        fontSize: 20
    }
});

const mapDispatchToProps = dispatch => {
    return {
    }
}
const mapStateToProps = state => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary)
