import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import { Card, CardItem, Body, Icon, InputGroup, Input } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';



export default class Product extends Component {
    render() {

        const { main, photos, profile_info, user_info } = this.props.productItem;
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
                        <View style={{ flexDirection: 'row-reverse', width: '100%', borderBottomWidth: 0.6, borderBottomColor: '#EEEEEE', paddingVertical: 5 }}>
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
                            <View style={{ width: '52%', justifyContent: 'flex-start' }}>
                                <Text style={{ fontFamily: 'Vazir-Bold-FD', fontSize: 18, paddingHorizontal: 7, paddingBottom: 2 }}>
                                    {`${first_name} ${last_name}`}
                                </Text>
                                <Text style={{ color: '#7E7E7E', fontSize: 16, fontFamily: 'Vazir-Bold-FD' }}>
                                    {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                                </Text>
                            </View>
                            <Text style={{ color: '#00C569', fontSize: 18, textAlignVertical: 'center' }}>
                                {locales('labels.seeProfile')}
                            </Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        )
    }
}
