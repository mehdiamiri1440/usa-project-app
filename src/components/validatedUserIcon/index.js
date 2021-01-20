import React, { useRef, useState } from 'react';
import { TouchableOpacity, Modal, View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'native-base';
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';

const ValidatedUserIcon = props => {

    const refRBSheet = useRef();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {
                showModal ?
                    <ValidatedUserDescription
                        shwModal={showModal}
                        onRequestClose={() => { refRBSheet.current.close(); setShowModal(false); }}
                        {...props}
                    />
                    : null
            }

            <TouchableOpacity
                onPress={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    refRBSheet.current.open()
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name='certificate' color='#1DA1F2' size={20} />
                <FontAwesome5 color='white' name='check' size={11} style={{ position: 'absolute' }} />

            </TouchableOpacity>

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
                <View style={{ paddingVertical: 10, marginVertical: 15 }}>
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={{ width: '100%', justifyContent: 'center', marginTop: 8, alignItems: 'center' }}>
                        <FontAwesome5 name='certificate' color='#1DA1F2' size={75} />
                        <FontAwesome5 color='white' name='check' size={45} style={{ position: 'absolute' }} />
                    </TouchableOpacity>
                    <Text style={{
                        width: '100%', textAlign: 'center', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#00C569', marginVertical: 7
                    }}>
                        {locales('titles.thisUserIsValidated')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={{ marginVertical: 30, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name='exclamation-circle' size={25} color='#E41C38' />
                        <Text style={{
                            color: '#E41C38', marginHorizontal: 4,
                            fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center',
                            fontSize: 18,
                        }}>
                            {locales('titles.moreDetails')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </>
    )
}

export const ValidatedUserDescription = ({ showModal, onRequestClose, navigation }) => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={showModal}
            onRequestClose={() => onRequestClose()}

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
                    onPress={() => onRequestClose()}
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
                        {locales('labels.authentication')}
                    </Text>
                </View>
            </View>
            <ScrollView style={{
                flex: 1,
                backgroundColor: '#efefef'
            }}>



                <Text style={{
                    fontSize: 19,
                    textAlign: 'center',
                    marginVertical: 15,
                    marginTop: 40,
                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                }}>
                    {locales('labels.authenticationTitle')}
                </Text>

                <View style={{
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    alignItems: 'center',
                    marginHorizontal: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    elevation: 2,
                    borderRadius: 6,
                    marginBottom: 15,
                    flexDirection: 'row-reverse'
                }}>
                    <Image source={require('../../../assets/images/verification-icons/verify-icon-1.jpg')} />
                    <Text style={
                        {
                            fontSize: 18,
                            textAlign: 'right',
                            flex: 1,
                            marginRight: 20
                        }
                    }>
                        {locales('labels.authenticationFirst')}

                    </Text>
                </View>

                <View style={{
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    marginHorizontal: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    elevation: 2,
                    borderRadius: 6,
                    marginBottom: 15,
                    flexDirection: 'row-reverse'
                }}>
                    <Image source={require('../../../assets/images/verification-icons/verify-icon-2.jpg')} />
                    <Text style={
                        {
                            fontSize: 18,
                            textAlign: 'right',
                            flex: 1,
                            marginRight: 20
                        }
                    }>
                        {locales('labels.authenticationSecond')}
                    </Text>
                </View>

                <View style={{
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    alignItems: 'center',
                    marginHorizontal: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    elevation: 2,
                    borderRadius: 6,
                    marginBottom: 15,
                    flexDirection: 'row-reverse'
                }}>
                    <Image source={require('../../../assets/images/verification-icons/verify-icon-3.jpg')} />
                    <Text style={
                        {
                            fontSize: 18,
                            textAlign: 'right',
                            flex: 1,
                            marginRight: 20
                        }
                    }>
                        {locales('labels.authenticationThird')}
                    </Text>
                </View>


                <Button
                    style={[styles.loginButton, { width: '80%', marginBottom: 10, alignSelf: 'center' }]}
                    onPress={_ => {
                        onRequestClose();
                        navigation.navigate('MyBuskool', { screen: 'Authentication' })
                    }}
                >
                    <Text style={[styles.buttonText, { alignSelf: 'center' }]}>  {locales('labels.authenticationButton')}
                    </Text>
                </Button>


                <Text style={{
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    textAlign: 'center'
                }}>
                    {locales('labels.authenticationDescription')}
                </Text>
            </ScrollView>
        </Modal >
    )
}
export default ValidatedUserIcon


const styles = StyleSheet.create({
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
})