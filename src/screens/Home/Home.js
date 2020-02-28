import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';



let homeRoutes = [
    { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' /> },
    { label: 'labels.editProfile', icon: <FontAwesome5 size={25} name='user-circle' color='white' /> },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='white' /> },
    { label: 'labels.guid', icon: <Entypo size={25} name='help' color='white' /> },
    { label: 'labels.promoteRegistration', icon: <MaterialCommunityIcons size={25} name='speedometer' color='white' /> },
];
class Requests extends React.Component {
    render() {
        return (
            <View style={{ padding: 20, flex: 1, backgroundColor: '#F2F2F2' }}>
                {homeRoutes.map((route, index) => {
                    return (
                        <TouchableOpacity
                            style={{
                                alignContent: 'center',
                                backgroundColor: 'white',
                                borderRadius: 5,
                                padding: 20,
                                marginVertical: 10,
                                flexDirection: 'row-reverse',
                            }}
                            key={index}>
                            <View style={{ width: '45%', flexDirection: 'row-reverse' }}>
                                <View style={{
                                    borderRadius: 5,
                                    backgroundColor: '#666666', padding: 5
                                }}>
                                    {route.icon}
                                </View>
                                <Text style={{ paddingHorizontal: 10, textAlignVertical: 'center' }}>
                                    {locales(route.label)}
                                </Text>
                            </View>
                            <View style={{ width: '55%', flexDirection: 'row' }}>
                                <Text style={{ textAlignVertical: 'center' }}>
                                    <Ionicons color='#666666'
                                        size={25} name='ios-arrow-back' />
                                </Text>
                                {route.label == 'labels.promoteRegistration' ?
                                    <Text style={{
                                        fontSize: 16,
                                        backgroundColor: '#E41C38', color: 'white',
                                        borderRadius: 20, marginHorizontal: 10, textAlign: 'center', textAlignVertical: 'center',
                                        textAlignVertical: 'center', width: 60
                                    }}>
                                        {locales('labels.special')}
                                    </Text>
                                    : null
                                }
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }
}

export default Requests