import React from 'react'
import { Text, View } from 'react-native'
import { Card, CardItem, Body, Button } from 'native-base'

const RegisterRequestSuccessfully = props => {

    return (
        <View style={{ marginHorizontal: 20, marginVertical: 40 }}>
            <Card>
                <CardItem>
                    <Body>
                        <Text style={{
                            borderBottomColor: '#00C569', borderBottomWidth: 3,
                            width: '100%', textAlign: 'center', paddingVertical: 20,
                            fontSize: 24, color: '#555555', fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}>
                            {locales('titles.requestSubmittedSuccessfully')}
                        </Text>
                        <Text
                            style={{
                                marginVertical: 20,
                                textAlign: 'center',
                                fontSize: 18
                            }}>
                            {locales('titles.registerRequestDescription')}
                        </Text>

                        <Button
                            onPress={() => props.navigation.navigate('Home')}
                            style={{
                                textAlign: 'center',
                                borderRadius: 5,
                                marginVertical: 10,
                                backgroundColor: '#00C569',
                                width: '70%',
                                color: 'white',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}
                            rounded
                        >
                            <Text style={{
                                color: 'white',
                                width: '100%',
                                textAlign: 'center'
                            }}>{locales('labels.productsList')}</Text>
                        </Button>
                    </Body>
                </CardItem>
            </Card>
        </View>
    )
}

export default RegisterRequestSuccessfully