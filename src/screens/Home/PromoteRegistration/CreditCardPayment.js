import React, { useRef } from 'react';
import {
    Text, View, TouchableOpacity, Linking
} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import ShadowView from 'react-native-simple-shadow-view';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';

import { deviceWidth, validator } from '../../../utils';


const CreditCardPayment = props => {

    const refRBSheet = useRef();


    const openCallPad = phoneNumber => {

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

    return (
        <>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask
                height={300}
                animationType='slide'
                customStyles={{
                    draggableIcon: {
                        backgroundColor: "#000"
                    },
                    container: {
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        backgroundColor: '#FAFAFA'
                    }
                }}
            >
                <Text
                    onPress={() => refRBSheet.current.close()}
                    style={{ width: '100%', textAlign: 'right', paddingHorizontal: 20 }}>
                    <EvilIcons name='close-o' size={35} color='#777777' />
                </Text>

                <FontAwesome5 name='credit-card' style={{ alignSelf: 'center' }} color='#1DA1F2' size={75} />
                <Text style={{
                    width: '100%', textAlign: 'center', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    marginTop: 20,
                    color: '#777',
                }}>
                    {locales('labels.transferViaCardDescription')}
                </Text>

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: 20,
                    }}>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <FontAwesome5 name="phone" solid size={15}
                            onPress={_ => openCallPad('09178928266')}
                            style={{
                                paddingTop: 15,
                                color: '#00c569'
                            }} />
                        <Text
                            onPress={_ => openCallPad('09178928266')}
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
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <FontAwesome5 name="phone" solid size={15}
                            onPress={_ => openCallPad('09118413054')}
                            style={{
                                paddingTop: 15,
                                color: '#00c569'
                            }} />
                        <Text
                            onPress={_ => openCallPad('09118413054')}
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                paddingHorizontal: 15,
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                            }}
                        >
                            09118413054
                            </Text>
                    </TouchableOpacity>

                </View>

            </RBSheet>

            <ShadowView
                style={{
                    width: deviceWidth,
                    padding: 10,
                    shadowColor: 'black',
                    shadowOpacity: 0.13,
                    shadowRadius: 1,
                    shadowOffset: { width: 0, height: 2 },
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    onPress={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        refRBSheet.current.open()
                    }}
                    activeOpacity={1}
                    style={{
                        width: '100%',
                        borderRadius: 4,
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#556080',
                        padding: 15,
                    }}
                >
                    <FontAwesome5
                        name='credit-card'
                        color='white'
                        size={20}
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginHorizontal: 7,
                            fontSize: 16
                        }}
                    >
                        {locales('labels.transferAmongCreditCart')}
                    </Text>
                </TouchableOpacity>
            </ShadowView>

        </>
    )
};
export default CreditCardPayment