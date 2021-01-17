import React, { Component } from 'react';
import { Text, StyleSheet, Image, View, FlatList, ActivityIndicator, ScrollView } from 'react-native';
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

    renderItem = ({ item, index }) => {

        const { selectedButton, userProfile = {}, isUserAllowedToSendMessageLoading } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        return (

            <View
                style={{
                    padding: 20,
                    backgroundColor: index % 2 == 0 ? '#F7FCFF' : '#FFFFFF',
                    width: '100%',
                    borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                    borderWidth: 0.5,
                }}
                key={item.id}
            >

                {item.is_golden && active_pakage_type == 0 ?

                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        zIndex: 1
                    }}>

                        <Image source={require('../../../assets/images/blur-items-2.jpg')}
                            style={{
                                width: deviceWidth,
                            }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginVertical: 10,
                                right: -25,
                                position: 'absolute',
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <FontAwesome
                                name='user-circle'
                                color='#adadad'
                                size={20}
                            />
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    color: '#adadad',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {`${item.first_name} ${item.last_name}`}
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                position: 'absolute',
                                top: 50,
                                textAlign: 'center',
                                left: deviceWidth * 0.31,
                                fontSize: 18,
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.buyer')}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: '#556083',
                                    marginHorizontal: 2
                                }}
                            >
                                {` ${item.subcategory_name} `}
                            </Text>
                            {item.is_golden && active_pakage_type == 0 ?
                                <Text> </Text>
                                :
                                item.name ? <>
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
                                </> : null

                            }
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

                    : null}

                <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginVertical: 10,
                        flexDirection: 'row-reverse'
                    }}
                >

                    <FontAwesome
                        name='user-circle'
                        color='#adadad'
                        size={20}
                    />
                    <Text
                        style={{
                            marginHorizontal: 5,
                            color: '#adadad',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {`${item.first_name} ${item.last_name}`}
                    </Text>
                </View>

                {item.is_golden && active_pakage_type == 0 ?
                    <Text style={{ textAlign: 'center' }}>...</Text>
                    :
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
                            {item.is_golden && active_pakage_type == 0 ?
                                <Text> </Text>
                                :
                                item.name ? <>
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
                                </> : null

                            }
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
                }

                <View style={{ marginVertical: 15 }}>

                    <Button
                        small
                        onPress={event => {
                            event.stopPropagation();
                            this.props.openChat(event, item)
                        }}
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
                                height: 45,
                                borderRadius: 6,
                                elevation: 2
                            }}
                        >

                            <MaterialCommunityIcons name='message' color={!item.is_golden ? 'white' : '#333'} size={14} />
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
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
                    alignItems: 'center',
                    backgroundColor: 'white',
                    width: deviceWidth,
                    flexDirection: 'row-reverse',
                }
                }>
                <Text
                    onPress={() => {
                        this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                    }} style={[styles.buttonText, {
                        color: '#1da6f4', marginTop: 50,
                        paddingBottom: 50, width: '80%',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }]}>
                    {locales('titles.otherRelatedBuyads')}</Text>
                <FontAwesome5
                    size={17}
                    name='arrow-left'
                    color='#1DA1F2'
                />

            </View>
        )
    };

    renderListHeaderComponent = _ => {
        return (
            <View
                style={{
                    padding: 20, marginVertical: 20
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: 18,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}
                >
                    {locales('labels.buyers')}
                </Text>

                <Text
                    style={{
                        color: '#777777',
                        fontSize: 17,
                        marginVertical: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {locales('labels.suggestedBuyersForYou')} <Text
                        style={{
                            color: '#21AD93',
                            fontSize: 17,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('titles.buskool')}
                    </Text>
                    <Text
                        style={{
                            color: '#777777',
                            fontSize: 17,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.forYourProduct')}
                    </Text>
                </Text>

            </View>

        )
    }

    chooseBuyadsList = (buyAds, buyAdsFromParams) => {
        let buyAdsList = [];
        buyAdsList = buyAds.length ? [...buyAds] : [...buyAdsFromParams];
        return buyAdsList
    };

    render() {

        const {
            route = {},
            buyAds = [],
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName,
            buyAds: buyAdsFromParams = []
        } = params;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;


        return (
            <ScrollView>
                <View
                    style={{
                        marginVertical: 10,
                        backgroundColor: 'rgba(237,248,230,0.6)',
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
                            color: '#21AD93',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.productdAccepted')}
                    </Text>
                </View>

                {this.chooseBuyadsList(buyAds, buyAdsFromParams).length ?
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderItem}
                        data={this.chooseBuyadsList(buyAds, buyAdsFromParams)}
                        ListHeaderComponent={this.renderListHeaderComponent}
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
            </ScrollView>
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
        width: '82%',
        height: 60,
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