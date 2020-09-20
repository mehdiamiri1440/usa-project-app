
import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Item, Input } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../../utils';

import UsersList from './UserLists';

const UserFriends = props => {



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
                    onPress={() => props.navigation.goBack()}
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
                        {locales('titles.referralListTitle')}
                    </Text>
                </View>
            </View>





            <ScrollView style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>

                <View style={{
                    alignItems: 'center',

                }}>
                    <Text style={{
                        fontSize: 20,
                        paddingTop: 15,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#555',
                    }}>
                        {locales('titles.referralTitle')}
                    </Text>
                    <View style={{
                        flexDirection: 'row-reverse'
                    }}>
                        <Text style={{
                            fontSize: 22,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#00C569',
                        }}>
                            25,000
                                    </Text>
                        <Text style={{
                            fontSize: 17,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#777',
                            marginHorizontal: 3,
                            marginTop: 4
                        }}>
                            {locales('titles.toman')}
                        </Text>
                    </View>
                    <Button
                        style={[styles.loginButton, { width: '55%', marginTop: 0, marginBottom: 0, elevation: 0, height: 40, alignSelf: 'center' }]}
                    >
                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>

                            {locales('titles.referralButton')}

                        </Text>
                    </Button>
                </View>


                <UsersList />
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