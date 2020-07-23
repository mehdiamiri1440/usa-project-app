import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Linking, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Card, Body, InputGroup, CardItem, Input, Button } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as homeActions from '../../../redux/home/actions';
import { color } from 'react-native-reanimated';
import { formatter } from '../../../utils'

class ExtraProductCapacity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            productCount: 1,
            productUnitPice: 25000,
            productTotalCount: 25000
        }
    }



    pay = () => {
        return Linking.canOpenURL('https://www.buskool.com/payment/3').then(supported => {
            if (supported) {
                Linking.openURL('https://www.buskool.com/payment/3');
            }
        })
    };

    closeModal = _ => {
        this.setState({ showModal: false });
        this.props.fetchAllDashboardData()
    };

    changeCount = type => {
        this.setState({
            productCount: type == 'asc' ? this.state.productCount + 1 : this.state.productCount <= 1 ? 1 : this.state.productCount - 1,
        }, () => {
            this.setState({
                productTotalCount: this.state.productCount * this.state.productUnitPice

            })
        })
    }

    render() {

        let {
            dashboard
        } = this.props;

        let {
            active_package_type: activePackageType = 0,
        } = dashboard;
        const {
            productCount,
            productTotalCount
        } = this.state;
        return (
            <>

                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />


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
                            {locales('titles.extraProduct')}
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
                        paddingHorizontal: 15,
                    }}
                >

                    <View style={{
                        paddingBottom: 60

                    }}>


                        <Card transparent>
                            <View style={{
                                borderRadius: 4,
                                elevation: 3,
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                paddingHorizontal: 5,
                                paddingVertical: 15,
                                marginBottom: 30
                            }}>

                                {/* header contents */}
                                <View >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#00C569',
                                        fontSize: 16
                                    }}>
                                        {locales('titles.extraProduct')}

                                    </Text>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: '#777',
                                        paddingTop: 5,
                                        fontSize: 14
                                    }}>
                                        {locales('labels.extraProductDescription')}

                                    </Text>
                                </View>
                                {/* end header contents */}

                                <View style={{
                                    paddingHorizontal: 15,
                                    marginVertical: 10
                                }}>
                                    <View style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#E41C38',
                                        borderRadius: 4,
                                    }}>
                                        <Text style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 14,
                                            color: '#fff'

                                        }}>
                                            {locales('titles.extraProductCount')}

                                        </Text>
                                        <Text style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 14,
                                            color: '#fff'

                                        }}>
                                            {productCount + ' ' + locales('titles.number')}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={{
                                        fontSize: 17,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        textAlign: 'center',
                                        marginBottom: 5
                                    }}>
                                        {locales('titles.count')}
                                    </Text>
                                    {/* #region counter  */}
                                    <View style={{
                                        paddingHorizontal: 15
                                    }}>
                                        <InputGroup
                                            regular
                                            style={{
                                                backgroundColor: 'red',
                                                flexDirection: 'row-reverse',
                                                justifyContent: "space-between",
                                                paddingLeft: 0,
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                borderWidth: 2,
                                                borderColor: '#707070'
                                            }}
                                        >

                                            <Button
                                                onPress={() => this.changeCount('asc')}
                                                style={{
                                                    paddingHorizontal: 20,
                                                    height: '100%',
                                                    color: '#333',
                                                    backgroundColor: '#f0f0f0'
                                                }}>
                                                <FontAwesome5 name="plus" solid size={18} />
                                            </Button>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                value={productCount.toString()}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        productCount: value
                                                    })
                                                }}
                                                style={{
                                                    backgroundColor: '#fcfcfc',
                                                    textAlign: "center"
                                                }}>

                                            </Input>
                                            <Button
                                                onPress={() => this.changeCount('desc')}

                                                style={{
                                                    paddingHorizontal: 20,
                                                    height: '100%',
                                                    color: '#333',
                                                    backgroundColor: '#f0f0f0'
                                                }}>
                                                <FontAwesome5 name="minus" solid size={18} />

                                            </Button>
                                        </InputGroup>
                                    </View>
                                    {/* #endregion */}
                                </View>


                                <View style={{
                                    padding: 15
                                }}>

                                    <View>
                                        <Text style={{
                                            fontSize: 17,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            textAlign: 'center',
                                            marginBottom: 5
                                        }}>
                                            {locales('titles.price')}
                                        </Text>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        borderRadius: 4,
                                        backgroundColor: '#efefef',
                                        justifyContent: 'center',
                                        paddingVertical: 5
                                    }}>
                                        <Text
                                            style={{
                                                color: "#00c569",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 23,
                                                paddingHorizontal: 5
                                            }}>
                                            {formatter.numberWithCommas(productTotalCount)}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 18,
                                                paddingTop: 4
                                            }}>
                                            {locales('titles.toman')}

                                        </Text>
                                        <Text
                                            style={{
                                                color: "#333",
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                fontSize: 15,
                                                paddingHorizontal: 5,
                                                paddingTop: 8

                                            }}>
                                            ({locales('titles.annuan')})
                                    </Text>
                                    </View>
                                    <View style={{
                                        marginTop: 20
                                    }}>
                                        <Button
                                            style={[styles.loginButton, { margin: 0, alignSelf: 'center' }]}
                                            onPress={() => this.pay()}>
                                            <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.moreCapacity')}
                                            </Text>
                                        </Button>
                                    </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(ExtraProductCapacity)