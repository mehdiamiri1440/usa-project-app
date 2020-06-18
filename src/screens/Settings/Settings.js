import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import * as authReducer from '../../redux/auth/actions';
import Spin from '../../components/loading/loading';
import { deviceWidth } from '../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


let settingRoutes = [
    // { label: 'labels.changePassword', icon: <FontAwesome size={25} name='unlock-alt' color='white' />, name: 'ChangePassword' },
    { label: 'labels.signOut', icon: <SimpleLineIcons size={25} name='logout' color='white' />, name: 'SignOut' },
];


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleRouteChange = (name) => {
        if (name == 'SignOut') {
            this.props.logOut();
        }
        else {
            this.props.navigation.navigate(name)
        }

    };


    render() {
        return (
            <>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.55,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.settings')}
                        </Text>
                    </View>
                </View>

                <ScrollView style={{ padding: 20, flex: 1, backgroundColor: '#F2F2F2' }}>
                    <Spin spinning={this.props.logOutLoading}>
                        {settingRoutes.map((route, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.handleRouteChange(route.name)}
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
                                            backgroundColor: '#666666',
                                            padding: 5
                                        }}>
                                            {route.icon}
                                        </View>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, textAlignVertical: 'center' }}>
                                            {locales(route.label)}
                                        </Text>
                                    </View>
                                    <View style={{ width: '55%', flexDirection: 'row' }}>
                                        <Text style={{ textAlignVertical: 'center' }}>
                                            <Ionicons color={'#666666'} size={25} name='ios-arrow-back' />
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </Spin>
                </ScrollView>
            </>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch(authReducer.logOut())
    }
}
const mapStateToProps = (state) => {
    return {
        logOutLoading: state.authReducer.logOutLoading
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)