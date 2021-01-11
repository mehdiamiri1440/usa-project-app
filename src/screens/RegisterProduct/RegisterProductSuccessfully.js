import React, { Component } from 'react';
import { Text, StyleSheet, Image, View, FlatList, ActivityIndicator } from 'react-native';
import { Button, Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { formatter } from '../../utils';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as registerProductActions from '../../redux/registerProduct/actions';

class RegisterProductSuccessfully extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryId: null,
            subCategoryName: '',
            loaded: false
        }
    }

    renderItem = ({ item }) => {

        const { selectedButton, userProfile = {}, isUserAllowedToSendMessageLoading } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        return (
            <View
                style={{
                    padding: 10,
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    borderColor: !!item.is_golden ? '#c7a84f' : '#aaa',
                    borderWidth: 1,
                    borderColor: '#ddd'
                }}
                key={item.id}
            >
                <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row-reverse'
                    }}
                >

                    <FontAwesome
                        name='user-circle'
                        color='#adadad'
                        size={25}
                    />
                    <Text
                        style={{
                            marginHorizontal: 5,
                            color: '#adadad',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {`${item.first_name} ${item.last_name}`}
                    </Text>
                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        marginVertical: 10,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 18,
                            color: '#7e7e7e'
                        }}
                    >
                        {locales('labels.buyer')}
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                color: '#e41c38',
                                marginHorizontal: 2
                            }}
                        >
                            {` ${formatter.convertedNumbersToTonUnit(item.requirement_amount)} ${item.subcategory_name} `}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                marginHorizontal: 2,
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.fromType')}
                        </Text>
                        <Text
                            style={{
                                color: '#556083',
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginHorizontal: 2
                            }}
                        >
                            {` ${item.name} `}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                marginHorizontal: 2,
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.is')}
                        </Text>
                    </Text>
                </View>
                {/* 
                <View >
                    {item.is_golden && active_pakage_type == 0 ?

                        <View style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                            zIndex: 1
                        }}>
                            <Image source={require('../../../assets/images/blur-items.jpg')}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            <Text style={{
                                position: 'absolute',
                                width: '100%',
                                top: 50,
                                fontSize: 23,
                                textAlign: 'center',
                                // backgroundColor: 'red',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                zIndex: 2
                            }}>
                                {item.subcategory_name}
                            </Text>
                        </View>

                        : null}
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                marginVertical: 5,
                                flexWrap: 'wrap', width: '100%', textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                            }}
                        >
                            {item.is_golden && active_pakage_type == 0
                                ? `${item.subcategory_name} | ${item.subcategory_name} ` :
                                `${item.category_name} | ${item.subcategory_name} ${!!item.name ? `| ${item.name}` : ''}`}
                        </Text>
                    </View>


                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                marginVertical: 5,
                                flexWrap: 'wrap', width: '100%', textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#333333'
                            }}
                        >

                            {item.is_golden && active_pakage_type == 0
                                ? `${locales('titles.requirementQuantity')} : نامشخص` :
                                `${locales('titles.requirementQuantity')} : ${formatter.convertedNumbersToTonUnit(item.requirement_amount)}`}
                        </Text>
                    </View>

                </View> */}

                <View style={{ marginVertical: 5 }}>

                    <Button
                        small
                        onPress={event => this.props.openChat(event, item)}
                        style={{
                            borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                            width: "80%",
                            position: 'relative',
                            alignSelf: 'center',

                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f']}
                            style={{
                                width: '100%',
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                height: 35,
                                borderRadius: 6,
                                elevation: 2
                            }}
                        >

                            <MaterialCommunityIcons name='message' color={!item.is_golden ? 'white' : '#333'} size={14} />
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 14,
                                color: !item.is_golden ? 'white' : '#333',
                                paddingHorizontal: 3
                            }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                            <ActivityIndicator size={20} color={!item.is_golden ? 'white' : '#333'}
                                animating={selectedButton == item.id &&
                                    !!isUserAllowedToSendMessageLoading}
                                style={{
                                    position: 'relative',
                                    width: 10, height: 10, borderRadius: 5,
                                    marginLeft: -10,
                                    marginRight: 5
                                }}
                            />
                        </LinearGradient>

                    </Button>

                </View>
            </View>

        )
    };

    renderListFooterComponent = _ => {
        const {
            route = {},
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName
        } = params;

        return (
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
                }>
                <Button
                    style={[styles.loginButton, {
                        justifyContent: 'center',
                        alignItems: 'center', alignSelf: 'center', marginVertical: 20
                    }]}
                    onPress={() => {
                        this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                    }}
                >
                    <Text style={styles.buttonText}>
                        {locales('titles.otherRelatedBuyads')}</Text>
                </Button>
            </View>
        )
    };

    render() {

        const {
            route = {},
            product = {},
            buyAds = []
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName
        } = params;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;

        return (
            <>
                <View
                    style={{
                        marginVertical: 10,
                        backgroundColor: '#edf8e6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: deviceWidth * 0.1,
                            height: deviceWidth * 0.2,
                            width: deviceWidth * 0.2,
                            borderWidth: 1,
                            borderColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FontAwesome
                            name='check'
                            size={50}
                            color='#21ad93'
                        />
                    </View>
                    <Text
                        style={{
                            marginVertical: 10,
                            textAlign: 'center',
                            color: '#21ad93',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20
                        }}
                    >
                        {locales('titles.productRegisteredSuccessfully')}
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#3ac9d3',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.productdAccepted')}
                    </Text>
                </View>

                {buyAds && buyAds.length ?
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderItem}
                        data={buyAds}
                        ListFooterComponent={this.renderListFooterComponent}
                    />
                    :
                    <View>
                        <Text
                            style={{
                                color: '#e51c38',
                                textAlign: 'center',
                                fontSize: 20,
                                marginVertical: 10,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {locales('titles.whoWantsWhat')}
                        </Text>
                        <Button
                            style={[styles.loginButton, {
                                justifyContent: 'center',
                                alignItems: 'center', alignSelf: 'center', marginVertical: 20
                            }]}
                            onPress={() => {
                                this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                            }}
                        >
                            <Text style={styles.buttonText}>
                                {locales('titles.seeBuyAds')}</Text>
                        </Button>
                    </View>
                }
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchBuyAdsAfterPayment: dispatch(registerProductActions.fetchBuyAdsAfterPayment())
    }
};
const mapStateToProps = (state) => {
    const {
        buyAdsAfterPayment
    } = state.registerProductReducer;

    const {
        userProfile
    } = state.profileReducer;


    return {
        buyAdsAfterPayment,
        userProfile
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProductSuccessfully)