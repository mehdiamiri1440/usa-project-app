import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceWidth } from '../../../utils';

const AuthenticatedSuccessfully = props => {

    const {
        userProfile = {}
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_seller
    } = user_info

    const navigateToOtherPage = _ => {
        if (!!!is_seller)
            return props.navigation.navigate('Home', { screen: 'ProductsList' });
        return props.navigation.navigate('RequestsStack');
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    backgroundColor: 'rgba(237,248,230,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
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
                    {locales('labels.authenticatedSuccessfully')}
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#21AD93',
                        paddingHorizontal: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16
                    }}
                >
                    {locales('labels.willBeAuthenticatedAfterApprovment')}
                </Text>
            </View>

            <Button
                onPress={navigateToOtherPage}
                style={{
                    textAlign: 'center',
                    backgroundColor: '#00C569',
                    elevation: 0,
                    borderRadius: 5,
                    width: deviceWidth * 0.6,
                    color: 'white',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 60,
                    justifyContent: 'center'
                }}
            >
                <AntDesign name='arrowleft' size={25} color='white' />
                <Text
                    style={{
                        color: 'white',
                        width: '60%',
                        textAlign: 'center',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                >
                    {!!is_seller ? locales('titles.buyLoading') : locales('labels.productsList')}
                </Text>
            </Button>
        </View>
    )
};

const mapStateToProps = state => {
    const {
        profileReducer
    } = state;

    const {
        userProfile
    } = profileReducer;

    return {
        userProfile
    }
}
export default connect(mapStateToProps)(AuthenticatedSuccessfully);