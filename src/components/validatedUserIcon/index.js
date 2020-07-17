import React, { useRef } from 'react';
import { TouchableOpacity, Linking, View, Text } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';

const ValidatedUserIcon = _ => {

    const refRBSheet = useRef();

    return (
        <>
            <TouchableOpacity
                onPress={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    refRBSheet.current.open()
                }}
                style={{ marginTop: 3, alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name='certificate' color='#1DA1F2' size={25} />
                <FontAwesome5 color='white' name='check' size={15} style={{ position: 'absolute' }} />

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
                        onPress={() => {
                            return Linking.canOpenURL('https://www.buskool.com/verification').then(supported => {
                                if (supported) {
                                    Linking.openURL('https://www.buskool.com/verification');
                                }
                            })
                        }}
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
                        onPress={() => {
                            return Linking.canOpenURL('https://www.buskool.com/verification').then(supported => {
                                if (supported) {
                                    Linking.openURL('https://www.buskool.com/verification');
                                }
                            })
                        }}
                        style={{ marginVertical: 30, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name='exclamation-circle' size={25} color='#E41C38' />
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
export default ValidatedUserIcon