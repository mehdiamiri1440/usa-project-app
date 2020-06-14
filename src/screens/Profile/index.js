import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, Share } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as profileActions from '../../redux/profile/actions';
import ChatModal from '../Messages/ChatModal';
import StarRating from '../../components/StarRating'
import Spin from '../../components/loading/loading';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalFlag: false
        }
    }

    componentDidMount() {
        if (this.props.route && this.props.route.params && this.props.route.params.user_name) {
            this.props.fetchProfileStatistics(this.props.route.params.user_name);
            this.props.fetchProfileByUserName(this.props.route.params.user_name);
            this.props.fetchProductsListByUserName(this.props.route.params.user_name);
        }
    }

    shareProfileLink = async () => {
        try {
            const result = await Share.share({
                message:
                    `https://www.buskool.com/profile/${this.props.profileByUserName.user_info.user_name}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    render() {

        const {
            userProfileLoading,
            userProfileFailed,
            userProfileError,
            userProfileMessage,
            userProfile,


            profileStatistics,
            profileStatisticsLoading,
            profileStatisticsFailed,
            profileStatisticsError,
            profileStatisticsMessage,


            profileByUserName,
            profileByUserNameLoading,
            profileByUserNameFailed,
            profileByUserNameError,
            profileByUserNameMessage,


            productsListByUserName,
            productsListByUserNameLoading,
            productsListByUserNameFailed,
            productsListByUserNameError,
            productsListByUserNameMessage,

        } = this.props;

        const {
            profile,
            user_info,
            certificates,
            relateds
        } = userProfile;

        const {
            activity_domain,
            address,
            company_name,
            company_register_code,
            confirmed,
            created_at,
            description,
            human_resource_count,
            id: profileId,
            is_company,
            myuser_id,
            postal_code,
            profile_photo,
            public_phone,
            related_activity_history,
            shaba_code,
            updated_at
        } = profile;

        const {
            active_pakage_type,
            activity_type,
            category_id,
            city,
            contract_confirmed,
            first_name,
            id: userId = '',
            is_blocked,
            is_buyer,
            is_seller,
            last_name,
            profile_visit,
            province,
            sex,
            user_name
        } = user_info

        const {
            product_count,
            rating_info,
            reputation_score,
            response_rate,
            transaction_count,
            validated_seller,
        } = profileStatistics;

        const {
            profile: profileFromByUserName = {},
            user_info: userInfoFromByUserName = {},
            certificates: certificatesFromByUserName = [],
            relateds: relatedsFromByUserName = [],
            activity_domain: activityDomainFromByUserName = ''
        } = profileByUserName

        const {
            id: profileIdFromByUserName,
            description: descriptionFromByUserName,
            profile_photo: profilePhotoFromByUserName,
            address: addressFromByUserName,
            postal_code: postalCodeFromByUserName,
            is_company: isCompanyFromByUserName,
            company_name: companyNameFromByUserName,
            company_register_code: companyRegisterCodeFromByUserName,
            confirmed: confirmedFromByUserName,
            myuser_id: myUserIdFromByUserName,
        } = profileFromByUserName;

        const {
            id: userIdFromByUserName,
            user_name: userNameFromByUserName,
            first_name: firstNameFromByUserName,
            last_name: lastNameFromByUserName,
            sex: sexFromByUserName,
            province: provinceFromByUserName,
            city: cityFromByUserName,
            activity_type: activityTypeFromByUserName,
            contract_confirmed: contractConfirmedFromByUserName,
            is_buyer: isBuyerFromByUserName,
            is_seller: isSellerFromByUserName,
            is_blocked: isBlockedFromByUserName,
            category_id: categoryIdFromByUserName,
            profile_visit: profileVisitFromByUserName,
            active_pakage_type: activePackageTypeFromByUserName
        } = userInfoFromByUserName;

        let { modalFlag } = this.state;

        const selectedContact = {
            first_name: firstNameFromByUserName,
            contact_id: userIdFromByUserName,
            last_name: lastNameFromByUserName,
        }

        return (
            <View>

                {modalFlag && <ChatModal
                    transparent={false}
                    visible={modalFlag}
                    {...this.props}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}


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
                            {locales('labels.seeProfile')}
                        </Text>
                    </View>
                </View>


                <Spin spinning={userProfileLoading || profileStatisticsLoading
                    || profileByUserNameLoading || productsListByUserNameLoading}
                >

                    <ScrollView style={{ backgroundColor: 'white', padding: 5 }}>
                        <View style={{ padding: 20, width: deviceWidth, flexDirection: 'row-reverse' }}>
                            <Image
                                style={{ width: deviceWidth * 0.22, height: deviceWidth * 0.22, borderRadius: deviceWidth * 0.11 }}
                                source={
                                    profilePhotoFromByUserName ? { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profilePhotoFromByUserName}` }
                                        : require('../../../assets/icons/user.png')}
                            />
                            <View style={{ width: deviceWidth * 0.7 }}>
                                <View style={{
                                    flexDirection: 'row-reverse', justifyContent: 'space-around',
                                    alignItems: 'center', marginVertical: 3,
                                }}>
                                    <View>
                                        <Text
                                            style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 18 }}>{product_count}</Text>
                                        <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 16 }}>{locales('labels.products')}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 18 }}>{reputation_score}</Text>
                                        <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 16 }}>{locales('labels.credit')}</Text>
                                    </View>
                                </View>
                                {userIdFromByUserName != userId ?
                                    <Button
                                        small
                                        onPress={() => this.setState({ modalFlag: true })}
                                        style={[styles.loginButton]}
                                    >
                                        <Text style={[styles.buttonText, { paddingRight: 30 }]}>
                                            {locales('titles.sendMessage')}</Text>
                                        <FontAwesome name='envelope' size={20} color='white'
                                            style={{ position: 'absolute', right: 85 }} />
                                    </Button>
                                    : <Button
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
                                        <Text onPress={() => this.props.navigation.navigate('EditProfile')
                                        } style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>
                                            {locales('titles.edit')}</Text>
                                        <EvilIcons name='pencil' size={30}
                                            color='white' style={{ position: 'absolute', right: 10 }} />
                                    </Button>}
                            </View>
                        </View>

                        <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row-reverse' }}>
                            <Text
                                style={{ color: '#666666', fontSize: 18, fontFamily: 'Vazir-Bold-FD' }}>
                                {`${firstNameFromByUserName} ${lastNameFromByUserName}`}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.shareProfileLink()}
                                style={{
                                    borderWidth: 0.8, borderColor: '#777777', borderRadius: 6, padding: 5,
                                    width: '30%', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'
                                }}>
                                <FontAwesome name='share-alt' size={14} color='#777777' />
                                <Text style={{
                                    color: '#777777', fontSize: 14, paddingHorizontal: 5
                                }}>
                                    {locales('labels.share')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'Vazir-Bold-FD' }}>
                                {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                            </Text>
                        </View>
                        <StarRating
                            starsCount={5}
                            defaultRate={2.2}
                            disable={true}
                            color='#FFBB00'
                            size={25}
                        />
                    </ScrollView>

                </Spin>

            </View>
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
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '90%',
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
    const {
        userProfileLoading,
        userProfileFailed,
        userProfileError,
        userProfileMessage,
        userProfile = {},

        profileStatistics = {},
        profileStatisticsLoading,
        profileStatisticsFailed,
        profileStatisticsError,
        profileStatisticsMessage,


        profileByUserName = {},
        profileByUserNameLoading,
        profileByUserNameFailed,
        profileByUserNameError,
        profileByUserNameMessage,


        productsListByUserName,
        productsListByUserNameLoading,
        productsListByUserNameFailed,
        productsListByUserNameError,
        productsListByUserNameMessage,

    } = state.profileReducer;

    return {
        userProfileLoading,
        userProfileFailed,
        userProfileError,
        userProfileMessage,
        userProfile,


        profileStatistics,
        profileStatisticsLoading,
        profileStatisticsFailed,
        profileStatisticsError,
        profileStatisticsMessage,


        profileByUserName,
        profileByUserNameLoading,
        profileByUserNameFailed,
        profileByUserNameError,
        profileByUserNameMessage,


        productsListByUserName,
        productsListByUserNameLoading,
        productsListByUserNameFailed,
        productsListByUserNameError,
        productsListByUserNameMessage,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchProfileStatistics: userName => dispatch(profileActions.fetchProfileStatistics(userName)),
        fetchProfileByUserName: userName => dispatch(profileActions.fetchProfileByUserName(userName)),
        fetchProductsListByUserName: userName => dispatch(profileActions.fetchProductsListByUserName(userName)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
