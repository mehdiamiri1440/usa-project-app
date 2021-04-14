import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'native-base';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceWidth } from '../../../utils';

const ContactInfoGuid = props => {
    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}
        >
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
                        {locales('labels.contactInfoGuid')}
                    </Text>
                </View>
            </View>

            <ScrollView>

                <View
                    style={{
                        width: deviceWidth,
                        padding: 15,
                        backgroundColor: 'white'
                    }}
                >
                    <Text
                        style={{
                            color: '#333333',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16,
                            marginTop: 20
                        }}
                    >
                        {locales('labels.howToShowContactInfo')}
                    </Text>

                    <View
                        style={{
                            backgroundColor: '#EEFEF6',
                            borderRadius: 12,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 30,
                            padding: 15
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: '#21AD93',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('labels.promoteRegistrationInBuskool')}
                        </Text>
                        <Button
                            onPress={_ => props.navigation.navigate('PromoteRegistration')}
                            style={{
                                backgroundColor: '#21AD93',
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40%',
                                padding: 10
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                            >
                                {locales('titles.promoteRegistration')}
                            </Text>
                        </Button>
                    </View>


                    <View
                        style={{
                            backgroundColor: '#F6FBFF',
                            borderRadius: 12,
                            flexDirection: 'row-reverse',
                            padding: 15,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 20
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: '#1DA1F2',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('labels.increaseWalletValueInBuskool')}
                        </Text>
                        <Button
                            onPress={_ => props.navigation.navigate('Wallet')}
                            style={{
                                backgroundColor: '#1DA1F2',
                                borderRadius: 8,
                                alignItems: 'center',
                                width: '40%',
                                justifyContent: 'center',
                                padding: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                            >
                                {locales('titles.increaseInventory')}
                            </Text>
                        </Button>
                    </View>


                    <View
                        style={{
                            borderRadius: 12,
                            flexDirection: 'row-reverse',
                            padding: 20,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: '#E41C38',
                                fontSize: 20,
                                marginLeft: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                        <Text
                            style={{
                                color: '#556080',
                                fontSize: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('labels.beforeOfAmountOmit')}
                            <Text
                                style={{
                                    color: '#00C569',
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                            >
                                {` 500 `}
                            </Text>
                            <Text
                                style={{
                                    color: '#556080',
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                            >
                                {locales('labels.amountToOmitFromWallet')}
                            </Text>
                        </Text>
                    </View>


                    <View
                        style={{
                            borderRadius: 12,
                            flexDirection: 'row-reverse',
                            padding: 20,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: '#E41C38',
                                fontSize: 20,
                                marginLeft: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                        <Text
                            style={{
                                color: '#556080',
                                fontSize: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('labels.noNeedForAdvancedOnes')}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: deviceWidth,
                        padding: 40,
                        backgroundColor: '#FAFAFA'
                    }}
                >
                    <Text
                        style={{
                            color: '#333333',
                            fontSize: 14,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('labels.guidPoint')}
                    </Text>

                    <Text
                        style={{
                            color: '#556080',
                            fontSize: 14,
                            marginTop: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('labels.howToDisableIt')}
                    </Text>

                    <Text
                        style={{
                            color: '#333333',
                            fontSize: 14,
                            marginTop: 50,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('labels.secondGuidPoint')}
                    </Text>
                </View>

            </ScrollView>
        </View>

    )
};
export default ContactInfoGuid;