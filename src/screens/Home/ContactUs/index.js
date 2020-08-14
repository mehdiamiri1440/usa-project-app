import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceHeight } from '../../../utils/deviceDimenssions';
class ContactUs extends React.Component {

    componentDidMount() {
        analytics().logEvent('support');
    }
    render() {
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
                        onPress={() => this.props.navigation.goBack()}
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
                            {locales('titles.support')}
                        </Text>
                    </View>
                </View>


                <View style={{
                    padding: 15,
                    borderRadius: 5,
                    flex: 1,
                    backgroundColor: '#fff',

                }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}
                    >
                        <View style={{
                            // position: 'absolute',
                            // bottom: 45,
                            width: '100%',
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                style={{
                                    height: 75,
                                    width: 75,

                                }}
                                resizeMode={"contain"}
                                source={require('../../../../assets/icons/main-logo.png')}
                            />
                        </View>
                        <Text

                            style={{
                                textAlign: 'center',
                                marginVertical: 15,
                                fontSize: 23,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}

                        >
                            {locales('titles.contactUs')}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                paddingHorizontal: 15,
                                fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Medium'
                            }}
                        >
                            {locales('titles.phoneNumber')}
                        </Text>
                        <View style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingHorizontal: 25
                            }}>
                                <FontAwesome5 name="phone" solid size={15} style={{
                                    paddingTop: 15,
                                    color: '#00c569'
                                }} />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}
                                >
                                    09178928266
                            </Text>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingHorizontal: 25
                            }}>
                                <FontAwesome5 name="phone" solid size={15} style={{
                                    paddingTop: 10,
                                    color: '#00c569'
                                }} />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}
                                >
                                    ‌09118413054
                            </Text>

                            </View>
                        </View>


                    </View>



                </View>
            </>
        )
    }
}
export default ContactUs