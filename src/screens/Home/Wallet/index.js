import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView,
    RefreshControl, Linking
} from 'react-native';
import { connect } from 'react-redux';
import { Label, InputGroup, Input, Button } from 'native-base';
import { TextInputMask } from 'react-native-masked-text';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import LinearGradient from 'react-native-linear-gradient';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { formatter, deviceWidth, deviceHeight } from '../../../utils';
import * as profileActions from '../../../redux/profile/actions';

const Wallet = props => {

    const inputRef = useRef();

    const [inventory, setInventory] = useState(50000);
    const [inventoryError, setInventoryError] = useState('');

    const {
        userProfile = {},
        loggedInUserId,
        route = {},
        userProfileLoading
    } = props;

    const {
        params = {}
    } = route;

    const {
        needToRefreshKey
    } = params;

    const {
        user_info = {},
    } = userProfile;

    const {
        wallet_balance = 0,
        first_name = '',
        last_name = ''
    } = user_info;



    useEffect(() => {
        props.fetchUserProfile();
    }, [needToRefreshKey])

    const changeValueToNumber = value => {

        if (!value)
            value = 0;

        if (typeof value === 'number')
            value = formatter.numberWithCommas(value);

        value = parseInt(value.split(',').join(''))
        return value;
    }
    const changeCount = type => {
        const tempInventory = changeValueToNumber(inventory)
        setInventory(type == 'asc' ? tempInventory + 5000 : tempInventory <= 10000 ? 10000 : tempInventory - 5000);

    };

    const handleInputChange = value => {
        value = changeValueToNumber(value)
        if (value < 10000) {
            setInventoryError(locales('errors.canNotBeLessThan', { fieldName: locales('titles.stockQuantity'), number: '10,000' }))
        }
        else {
            setInventoryError('');
        }
        setInventory(value)
    };


    const handleInventoryByDefaultValues = value => {
        const tempInventory = changeValueToNumber(value);
        setInventory(tempInventory);
    };

    const submitEditing = _ => {
        setInventoryError('');
        let tempInventory = changeValueToNumber(inventory);
        if (tempInventory <= 10000) {
            tempInventory = 10000;
            setInventory(tempInventory);
        }
    };

    const onSubmit = _ => {
        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-wallet-payment/charge/${loggedInUserId}/${inventory}`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-wallet-payment/charge/${loggedInUserId}/${inventory}`);
            }
        })
    };

    const onRefresh = _ => {
        props.fetchUserProfile();
    };

    return (
        <>
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
                        {locales('titles.wallet')}
                    </Text>
                </View>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={userProfileLoading}
                        onRefresh={onRefresh}
                    />
                }
                keyboardShouldPersistTaps='handled'
                style={{ backgroundColor: 'white' }}
            >
                <View
                    style={{
                        backgroundColor: 'rgba(55,174,222,0.3)',
                        width: deviceWidth * 0.81,
                        borderRadius: 12,
                        marginTop: 50,
                        alignSelf: 'center'
                    }}
                >

                    <View
                        style={{
                            backgroundColor: 'rgba(55,174,222,0.3)',
                            width: deviceWidth * 0.86,
                            borderRadius: 12,
                            alignSelf: 'center',
                            marginTop: 10,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ marginTop: 10 }}
                            onPress={_ => props.navigation.navigate('Wallet')}
                        >
                            <ImageBackground
                                source={require('../../../../assets/images/wallet-bg.jpg')}
                                style={styles.image}
                                imageStyle={{ borderRadius: 10 }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <FontAwesome5
                                            name='wallet'
                                            size={18}
                                            solid
                                            color='white'
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                color: 'white',
                                                fontSize: 20,
                                                marginHorizontal: 5
                                            }}
                                        >
                                            {locales('titles.walletInventory')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: '#F7F7F7',
                                            fontSize: 16,
                                            opacity: 0.3
                                        }}
                                    >
                                        Buskool.com
                        </Text>
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: 'white',
                                            fontSize: 35,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {formatter.numberWithCommas(wallet_balance)} <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                color: 'white',
                                                fontSize: 25,
                                            }}
                                        >
                                            {locales('titles.toman')}
                                        </Text>
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: 'white',
                                        fontSize: 20,
                                        marginHorizontal: 5
                                    }}
                                >
                                    {`${first_name} ${last_name}`}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        color: '#556080',
                        fontSize: 20,
                        marginTop: 30,
                        alignSelf: 'flex-end',
                        padding: 3,
                        marginHorizontal: 10
                    }}
                >
                    {locales('titles.increaseInventory')}
                </Text>
                <View
                    style={{
                        backgroundColor: '#00C569',
                        width: 100,
                        height: 4,
                        alignSelf: 'flex-end',
                        marginHorizontal: 10,
                        marginTop: 15
                    }}
                ></View>
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20,
                        flex: 1,
                        padding: 10,
                        alignSelf: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={_ => handleInventoryByDefaultValues(150000)}
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: inventory == 150000 ? '#00C569' : '#F9FAF5',
                            borderRadius: 25,
                            padding: 11,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 19,
                                color: inventory == 150000 ? 'white' : 'black'
                            }}
                        >
                            150,000
                    </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 15,
                                color: inventory == 150000 ? 'white' : 'black'
                            }}>
                            {` ${locales('titles.toman')}`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={_ => handleInventoryByDefaultValues(100000)}
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: inventory == 100000 ? '#00C569' : '#F9FAF5',
                            borderRadius: 25,
                            marginHorizontal: 5,
                            padding: 11
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 19,
                                color: inventory == 100000 ? 'white' : 'black'
                            }}
                        >
                            100,000
                    </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 15,
                                color: inventory == 100000 ? 'white' : 'black'
                            }}>
                            {` ${locales('titles.toman')}`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={_ => handleInventoryByDefaultValues(50000)}
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: inventory == 50000 ? '#00C569' : '#F9FAF5',
                            borderRadius: 25,
                            padding: 11
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 19,
                                color: inventory == 50000 ? 'white' : 'black'
                            }}
                        >
                            50,000
                    </Text>
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 15,
                                color: inventory == 50000 ? 'white' : 'black'
                            }}>
                            {` ${locales('titles.toman')}`}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    paddingHorizontal: 15,
                    marginTop: 30
                }}>
                    <InputGroup
                        regular
                        style={{
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
                            onPress={() => changeCount('asc')}
                            style={{
                                paddingHorizontal: 20,
                                height: '100%',
                                color: '#333',
                                backgroundColor: '#f0f0f0'
                            }}>
                            <FontAwesome5 name="plus" solid size={18} />
                        </Button>
                        <TextInputMask
                            type={'money'}
                            onBlur={submitEditing}
                            onSubmitEditing={submitEditing}
                            value={inventory}
                            onChangeText={handleInputChange}
                            style={{
                                minHeight: 60,
                                color: '#00C569',
                                fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                            options={{
                                precision: 0,
                                separator: '.',
                                delimiter: ',',
                                unit: '',
                                suffixUnit: '',
                                zeroCents: false,
                            }}
                            ref={inputRef}
                        />

                        <Button
                            onPress={() => changeCount('desc')}

                            style={{
                                paddingHorizontal: 20,
                                height: '100%',
                                color: '#333',
                                backgroundColor: '#f0f0f0'
                            }}>
                            <FontAwesome5 name="minus" solid size={18} />

                        </Button>
                    </InputGroup>
                    <Label style={{ height: 20, fontSize: 14, color: '#D81A1A', textAlign: 'center' }}>
                        {!!inventoryError && inventoryError}
                    </Label>
                </View>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
                    style={{ width: '70%', borderRadius: 5, alignSelf: 'center', padding: 10, margin: 20 }}
                    colors={['#21AD93', '#00C569']}
                >
                    <TouchableOpacity
                        onPress={onSubmit}
                    >
                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.increaseInventory')}</Text>

                    </TouchableOpacity>
                </LinearGradient>

            </ScrollView>

        </>
    );
};


const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    image: {
        resizeMode: "cover",
        width: deviceWidth * 0.91,
        justifyContent: 'space-between',
        height: deviceHeight * 0.25,
        padding: 20,
        alignSelf: 'center',
    },
});

const mapStateToProps = state => {
    const {
        profileReducer,
        authReducer
    } = state;
    const {
        userProfile,
        userProfileLoading
    } = profileReducer;
    const {
        loggedInUserId
    } = authReducer;

    return {
        userProfile,
        userProfileLoading,
        loggedInUserId
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);