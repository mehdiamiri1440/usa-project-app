
import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Item, Input } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../../utils';


const UserFriends = props => {



    return (
        <>





            <ScrollView style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>


                <View style={{
                    padding: 10
                }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#333',
                            borderBottomWidth: 2,
                            borderBottomColor: '#ccc',
                            paddingBottom: 5,
                        }}
                    >
                        {locales('titles.doing')}
                    </Text>
                    {[1, 2].map((_, index) =>
                        <View
                            key={index}
                            style={{
                                paddingVertical: 10,
                                flexDirection: 'row-reverse',
                                flex: 1,
                                justifyContent: 'space-around',
                                justifyContent: 'center',
                                borderBottomColor: '#eeeeee',
                                borderBottomWidth: index < 1 ? 2 : 0
                            }}>
                            <Image source={require('../../../../assets/images/intro-slide1.jpg')}
                                style={{
                                    width: deviceWidth * 0.18,
                                    height: deviceWidth * 0.18,
                                    borderRadius: 50
                                }} />
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 15

                                }}>
                                <Text style={{
                                    marginBottom: 5,
                                    fontSize: 16,
                                    color: '#444',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                }}>
                                    محمدامین دلداری
                                </Text>
                                <View >
                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'space-between',

                                    }}>
                                        <Text style={{
                                            fontSize: 13,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: "#556080"
                                        }}>
                                            20%
                                       </Text>

                                        <Text style={{
                                            fontSize: 13,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: '#777'
                                        }}>
                                            <Text style={{
                                                fontSize: 13,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                color: "#556080",

                                            }}>
                                                80%
                                            </Text>
                                            {locales('titles.referralToFree')}

                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    color: "#00c569",

                                                }}
                                            >
                                                {locales('titles.referralSecondMainTitle')}
                                            </Text>
                                            {locales('titles.toman')}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flex: 1
                                    }}>
                                        <View style={{
                                            height: 5,
                                            width: '100%',
                                            backgroundColor: '#eeeeee',
                                            borderRadius: 5,
                                            overflow: "hidden"
                                        }}>
                                        </View>
                                        <View style={{
                                            height: 5,
                                            width: '30%',
                                            backgroundColor: '#00c569',
                                            borderRadius: 5,
                                            overflow: "hidden",
                                            marginTop: 0,
                                            position: 'absolute',
                                            right: 0
                                        }}>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                <View style={{
                    padding: 10
                }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#333',
                            borderBottomWidth: 2,
                            borderBottomColor: '#ccc',
                            paddingBottom: 5,
                        }}
                    >
                        {locales('titles.done')}
                    </Text>
                    {[1, 2, 3].map((_, index) =>
                        <View
                            key={index}
                            style={{
                                paddingVertical: 10,
                                flexDirection: 'row-reverse',
                                flex: 1,
                                justifyContent: 'space-around',
                                justifyContent: 'center',
                                borderBottomColor: '#eeeeee',
                                borderBottomWidth: index < 2 ? 2 : 0
                            }}>
                            <Image source={require('../../../../assets/images/intro-slide1.jpg')}
                                style={{
                                    width: deviceWidth * 0.18,
                                    height: deviceWidth * 0.18,
                                    borderRadius: 50
                                }} />
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 15,
                                    alignItems: 'center',
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between'
                                }}>
                                <Text style={{
                                    marginBottom: 5,
                                    fontSize: 16,
                                    color: '#444',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                }}>
                                    محمدامین دلداری
                                </Text>
                                <View style={{
                                    fontSize: 13,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: "#556080",
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'flex-end'
                                }}>

                                    <FontAwesome5 name="check" size={16} color="#00c569" solid />
                                    <Text style={{
                                        marginHorizontal: 5,
                                        color: '#00c569'
                                    }}>
                                        {locales('titles.done')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    )

}


const styles = StyleSheet.create({

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '70%',
        color: 'white',
    },
})
export default UserFriends