import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card, CardItem, Body, Button } from 'native-base';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

class RegisterProductSuccessfully extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryId: null,
            subCategoryName: '',
            loaded: false
        }
    }


    render() {
        const {
            route = {}
        } = this.props;
        const {
            params = {}
        } = route;
        let {
            subCategoryId,
            subCategoryName
        } = params;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;

        return (
            <View style={{ height: deviceHeight * 0.75, justifyContent: 'center' }}>
                <Card>
                    <CardItem header style={{
                        alignItems: 'center', justifyContent: 'center',
                        borderBottomColor: '#00C569', borderBottomWidth: 2
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            paddingHorizontal: 10,
                            textAlignVertical: 'center',
                            fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}>{locales('titles.registerProductDoneSuccessfully')}</Text>
                    </CardItem>
                    <CardItem>
                        <Body style={{ marginVertical: 20 }}>
                            <Text style={{
                                fontSize: 16, color: '#7E7E7E',
                                textAlign: 'center', textAlignVertical: 'center', width: '100%'
                            }}>
                                {locales('titles.registerProductSuccessfullyMessage')}
                            </Text>
                            <Text style={{
                                marginVertical: 10,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', width: '100%',
                                textAlign: 'center', textAlignVertical: 'center', fontSize: 20, color: '#E41C38'
                            }}>
                                {locales('titles.whoWantsWhat')}
                            </Text>
                            <Button
                                style={styles.loginButton}
                                onPress={() => {
                                    this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    {locales('titles.seeBuyAds')}</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            </View >
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
    }
});

export default RegisterProductSuccessfully;