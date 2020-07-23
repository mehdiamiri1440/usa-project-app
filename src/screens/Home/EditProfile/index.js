import React from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, StyleSheet, Linking, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Card, Body, InputGroup, CardItem, Input, Button, Textarea, Form, } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';
import { formatter } from '../../../utils'

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,

        }
    }


    render() {


        return (
            <>



                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
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
                            {locales('titles.editProfile')}
                        </Text>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.dashboardLoading}
                            onRefresh={() => this.props.fetchAllDashboardData().catch(_ => this.setState({ showModal: true }))}
                        />
                    }
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 15
                    }}
                >


                    <View style={{
                        paddingBottom: 60

                    }}>

                        <View
                        >
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    width: 130,
                                    height: 130,
                                    borderRadius: 130,
                                    overflow: "hidden",
                                    elevation: 6
                                }}
                                source={
                                    require('../../../../assets/icons/user.png')
                                } />
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    marginVertical: 10
                                }}>
                                محمد امین دلداری
                                </Text>
                        </View>

                        <Card transparent>
                            <View >

                                <Textarea
                                    style={{
                                        borderRadius: 4,
                                        elevation: 3,
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        paddingHorizontal: 5,
                                        paddingVertical: 15,
                                        marginBottom: 30
                                    }}
                                    rowSpan={5} bordered placeholder="توضیخات" />
                                <View style={{
                                    marginTop: 20
                                }}>
                                    <Button
                                        style={[styles.loginButton, { margin: 0, alignSelf: 'center' }]}
                                        onPress={() => this.pay()}>
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.submitChanges')}
                                        </Text>
                                    </Button>
                                </View>

                            </View>
                        </Card>


                    </View>
                </ScrollView>
            </>
        )
    }
}



const styles = StyleSheet.create({
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});

const mapStateToProps = (state) => {
    return {
        dashboardLoading: state.homeReducer.dashboardLoading,
        dashboardError: state.homeReducer.dashboardError,
        dashboardMessage: state.homeReducer.dashboardMessage,
        dashboardFailed: state.homeReducer.dashboardFailed,
        dashboard: state.homeReducer.dashboard,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)