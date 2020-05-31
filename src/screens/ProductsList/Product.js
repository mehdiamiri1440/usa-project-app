import React, { PureComponent } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardItem, Body, Toast, Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';


class Product extends PureComponent {
    render() {

        const { loggedInUserId } = this.props;
        const { main, photos, profile_info, user_info } = this.props.productItem;
        console.log('pri', loggedInUserId, this.props.productItem)
        const {
            address,
            category_id,
            category_name,
            city_id,
            city_name,
            confirmed,
            description,
            is_elevated,
            max_sale_price,
            min_sale, price,
            myuser_id,
            product_name,
            province_id,
            province_name,
            stock,
            sub_category_id,
            sub_category_name,
            updated_at
        } = main;

        const {
            profile_photo
        } = profile_info;

        const {
            active_pakage_type,
            created_at,
            first_name,
            last_name,
            response_rate,
            response_time,
            ums,
            user_name
        } = user_info;
        return (
            <Card>
                <CardItem>
                    <Body>
                        <View style={{
                            flexDirection: 'row-reverse',
                            width: '100%', borderBottomWidth: 0.6, borderBottomColor: '#EEEEEE', paddingVertical: 4
                        }}>
                            <Image
                                style={{
                                    alignSelf: 'center', width: deviceWidth * 0.12,
                                    height: deviceWidth * 0.12, borderRadius: deviceWidth * 0.06,
                                    marginHorizontal: 5
                                }}
                                source={!!profile_photo && profile_photo.length ?
                                    { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                    :
                                    require('../../../assets/icons/user.png')
                                } />
                            <View style={{ width: '59%', justifyContent: 'flex-start' }}>
                                <Text style={{
                                    fontFamily: 'Vazir-Bold-FD',
                                    fontSize: 18, marginTop: response_rate > 0 && loggedInUserId !== myuser_id ? 0 : 8,
                                    paddingHorizontal: 7, paddingBottom: 2
                                }}>
                                    {`${first_name} ${last_name}`}
                                </Text>
                                {response_rate > 0 && loggedInUserId != myuser_id &&
                                    <Text style={{ color: '#7E7E7E', fontSize: 16, fontFamily: 'Vazir-Bold-FD' }}>
                                        {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                                    </Text>}
                            </View>
                            {loggedInUserId == myuser_id ?
                                <Text style={{ color: '#E41C38', fontSize: 16, textAlignVertical: 'center' }}>
                                    {locales('labels.deleteProduct')}
                                </Text>
                                :
                                <Text style={{ color: '#00C569', fontSize: 16, textAlignVertical: 'center' }}>
                                    {locales('labels.seeProfile')}
                                </Text>}
                        </View>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ProductDetails')}
                            style={{ flexDirection: 'row-reverse', width: '100%', paddingVertical: 5 }}>
                            <Image
                                style={{
                                    width: deviceWidth * 0.25,
                                    borderWidth: 0.4,
                                    borderColor: '#BEBEBE',
                                    height: deviceWidth * 0.25, borderRadius: 10,
                                    marginHorizontal: 5
                                }}
                                source={photos.length ?
                                    { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${photos[0].file_path}` }
                                    :
                                    require('../../../assets/icons/user.png')
                                } />

                            {photos.length > 0 && <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    backgroundColor: 'black', position: 'absolute',
                                    left: 5, bottom: 5, borderRadius: 4, padding: 3
                                }}>
                                <Entypo name='images' size={20} color='white' />
                                <Text style={{ color: 'white', marginHorizontal: 2 }}>{photos.length <= 9 ? photos.length : '9+'}</Text>
                            </View>}

                            <View style={{ width: '60%', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                    {category_name} | {sub_category_name} <Text style={{ color: '#777777', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                        {product_name}
                                    </Text>
                                </Text>
                                <View style={{ flexDirection: 'row-reverse', paddingVertical: 3 }}>
                                    <Text style={{ textAlign: 'right' }}>
                                        <Entypo name='location-pin' size={25} color='#BEBEBE' />
                                    </Text>
                                    <Text style={{ color: '#BEBEBE', fontSize: 16 }}>
                                        {province_name} ، {city_name}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row-reverse', paddingVertical: 3 }}>
                                    <Text style={{ textAlign: 'right' }}>
                                        <FontAwesome5 name='box-open' size={20} color='#BEBEBE' />
                                    </Text>
                                    <Text style={{ color: '#BEBEBE', fontSize: 16 }}>
                                        {stock} {locales('labels.kiloGram')}
                                    </Text>
                                </View>

                            </View>

                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center', padding: 5,
                            width: '100%', justifyContent: 'center'
                        }}>
                            {loggedInUserId != myuser_id ?
                                <Button
                                    style={[styles.loginButton, { width: !!is_elevated ? '92%' : '100%' }]}
                                >
                                    <Text style={styles.buttonText}>{locales('titles.achiveSaleStatus')}</Text>
                                </Button>
                                :
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'space-around',
                                    width: !!is_elevated ? deviceWidth * 0.88 : deviceWidth
                                }}>
                                    <Button
                                        style={{
                                            color: 'white',
                                            fontSize: 18,
                                            borderRadius: 5,
                                            fontFamily: 'Vazir-Bold-FD',
                                            width: !!is_elevated ? '45%' : '55%',
                                            paddingRight: 40,
                                            backgroundColor: '#E41C38'
                                        }}
                                    >
                                        <Text style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>{locales('titles.elevateProduct')}</Text>
                                        <FontAwesome5 name='chart-line' size={30} color='white' style={{ position: 'absolute', right: 15 }} />
                                    </Button>
                                    <Button
                                        style={{
                                            color: 'white',
                                            fontSize: 18,
                                            borderRadius: 5,
                                            fontFamily: 'Vazir-Bold-FD',
                                            width: '40%',
                                            paddingRight: 15,
                                            backgroundColor: '#000546'
                                        }}
                                    >
                                        <Text style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>{locales('titles.edit')}</Text>
                                        <EvilIcons name='pencil' size={30} color='white' style={{ position: 'absolute', right: 15 }} />
                                    </Button>
                                </View>
                            }
                            {!!is_elevated && <FontAwesome5
                                onPress={() => Toast.show({
                                    text: locales('titles.elevatorHasAdded'),
                                    position: "bottom",
                                    style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                    textStyle: { fontFamily: 'Vazir' },
                                    duration: 3000
                                })}
                                name='chart-line' size={30} color='white' style={{ backgroundColor: '#7E7E7E', padding: 7, borderRadius: 4 }}
                            />}
                        </View>

                    </Body>
                </CardItem>
            </Card>
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Vazir-Bold-FD',
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
        padding: 20,
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
        loggedInUserId: state.authReducer.loggedInUserId
    }
};

export default connect(mapStateToProps)(Product)