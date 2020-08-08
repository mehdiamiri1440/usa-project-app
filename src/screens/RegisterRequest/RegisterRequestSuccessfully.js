import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Card, CardItem, Body, Button } from 'native-base'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

const RegisterRequestSuccessfully = props => {

    const handleBack = () => {
        if (props.route && props.route.params) {
            props.route.params.emptyState();
            props.navigation.goBack();
        }

    }


    return (

        <>

            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={handleBack}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('labels.registerRequest')}
                    </Text>
                </View>
            </View>

            <View style={{
                paddingVertical: 80,
                paddingHorizontal: 7
            }}>
                <Card>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <Text style={{
                            borderBottomColor: '#00C569', borderBottomWidth: 2,
                            paddingVertical: 5,
                            width: '100%', textAlign: 'center',
                            fontSize: 20, color: '#555555', fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}>
                            {locales('titles.requestSubmittedSuccessfully')}
                        </Text>
                        <Text
                            style={{
                                marginTop: 40,
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
                                marginVertical: 40,
                                backgroundColor: '#00C569',
                                width: '70%',
                                color: 'white',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}
                            rounded
                        >
                            <Text style={{
                                color: 'white',
                                width: '100%',
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}>{locales('labels.productsList')}</Text>
                        </Button>
                    </View>
                </Card>
            </View>

        </>
    )
}

export default RegisterRequestSuccessfully