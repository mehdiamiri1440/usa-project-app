import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image, StyleSheet, Share, FlatList, Modal } from 'react-native';
import { Button, CardItem, Card, Body } from 'native-base';
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import ChatModal from '../Messages/ChatModal';
import Product from '../ProductsList/Product';
import StarRating from '../../components/StarRating'
import Spin from '../../components/loading/loading';
import ValidatedUserIcon from '../../components/validatedUserIcon';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalFlag: false,
            selectedEvidenceModal: false,
            selectedImageModal: false,
            selectedEvidenceIndex: -1,
            selectedImageIndex: -1
        }
    }

    componentDidMount() {
        if (this.props.route && this.props.route.params && this.props.route.params.user_name) {
            this.props.fetchProfileStatistics(this.props.route.params.user_name);
            this.props.fetchProfileByUserName(this.props.route.params.user_name);
            this.props.fetchProductsListByUserName(this.props.route.params.user_name);
        }
    }



    fetchAllProducts = () => {
        const { from_record_number = 0, to_record_number = 15, sort_by = 'BM' } = this.state;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };
        this.props.fetchAllProductsList(item);
    };

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


            productsListByUserName = {},
            productsListByUserNameLoading,
            productsListByUserNameFailed,
            productsListByUserNameError,
            productsListByUserNameMessage,

        } = this.props;

        const {
            profile = {},
            user_info = {},
            certificates,
            relateds
        } = userProfile;

        const {
            activity_domain = '',
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
            related_activity_history = '',
            shaba_code,
            updated_at
        } = profile;

        const {
            active_pakage_type,
            activity_type = '',
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
            user_name,
        } = user_info

        const {
            product_count,
            rating_info = {},
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
            activity_type: activityTypeFromByUserName = '',
            contract_confirmed: contractConfirmedFromByUserName,
            is_buyer: isBuyerFromByUserName,
            is_seller: isSellerFromByUserName,
            is_blocked: isBlockedFromByUserName,
            category_id: categoryIdFromByUserName,
            profile_visit: profileVisitFromByUserName,
            active_pakage_type: activePackageTypeFromByUserName,
            is_verified
        } = userInfoFromByUserName;

        let { modalFlag, selectedEvidenceModal, selectedImageModal, selectedEvidenceIndex, selectedImageIndex } = this.state;

        const selectedContact = {
            first_name: firstNameFromByUserName,
            contact_id: userIdFromByUserName,
            last_name: lastNameFromByUserName,
            is_verified
        }

        return (
            <>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selectedImageModal}
                    onRequestClose={() => this.setState({ selectedImageModal: false })}
                >
                    <View style={{
                        backgroundColor: 'rgba(59,59,59,0.85)',
                        height: deviceHeight, alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AntDesign name='arrowright' size={30} color='white'
                            style={{ alignSelf: 'flex-end', justifyContent: 'center', position: 'absolute', right: 10, top: 10 }}
                            onPress={() => this.setState({ selectedImageModal: false })}
                        />
                        <Image
                            style={{
                                alignSelf: 'center', width: deviceWidth,
                                height: deviceHeight * 0.6,
                                resizeMode: 'contain'
                            }}
                            source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${relatedsFromByUserName[selectedImageIndex]}` }} />
                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selectedEvidenceModal}
                    onRequestClose={() => this.setState({ selectedEvidenceModal: false })}
                >
                    <View style={{
                        backgroundColor: 'rgba(59,59,59,0.85)',
                        height: deviceHeight, alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AntDesign name='arrowright' size={30} color='white'
                            style={{ alignSelf: 'flex-end', justifyContent: 'center', position: 'absolute', right: 10, top: 10 }}
                            onPress={() => this.setState({ selectedEvidenceModal: false })}
                        />
                        <Image
                            style={{
                                alignSelf: 'center', width: deviceWidth,
                                height: deviceHeight * 0.6,
                                resizeMode: 'contain'
                            }}
                            source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${certificatesFromByUserName[selectedEvidenceIndex]}` }} />
                    </View>
                </Modal>


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
                                        <Text style={[styles.buttonText, { paddingRight: 30, paddingBottom: 5 }]}>
                                            {locales('titles.sendMessage')}</Text>
                                        <FontAwesome name='envelope' size={20} color='white'
                                            style={{ position: 'absolute', right: 85, paddingBottom: 5 }} />
                                    </Button>
                                    : <Button
                                        small
                                        onPress={() => this.props.navigation.navigate('EditProfile')}
                                        style={[styles.loginButton]}
                                    >
                                        <Text style={[styles.buttonText, { paddingRight: 30, fontSize: 16, paddingBottom: 5 }]}>
                                            {locales('labels.editProfile')}</Text>
                                        <EvilIcons name='pencil' size={25} color='white'
                                            style={{ position: 'absolute', right: 73, paddingBottom: 5 }} />
                                    </Button>}
                            </View>
                        </View>

                        <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row-reverse' }}>
                            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                <Text
                                    style={{ color: '#666666', fontSize: 18, fontFamily: 'Vazir-Bold-FD', marginHorizontal: 5 }}>
                                    {`${firstNameFromByUserName} ${lastNameFromByUserName}`}
                                </Text>
                                {is_verified ? <ValidatedUserIcon /> : null}
                            </View>
                            <TouchableOpacity
                                onPress={() => this.shareProfileLink()}
                                style={{
                                    borderWidth: 0.8, borderColor: '#777777', borderRadius: 6, padding: 5, marginBottom: 5,
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

                        {response_rate > 0 ? <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'Vazir-Bold-FD' }}>
                                {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                            </Text>
                        </View> : null}

                        {(rating_info && rating_info.avg_score > 0 && rating_info.total_count > 0) ? <View style={{
                            width: deviceWidth * 0.6,
                            alignSelf: 'center', justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                        }}>
                            <View style={{
                                borderRadius: 4, borderWidth: 0.8, borderColor: '#777777', backgroundColor: '#FAFAFA',
                                padding: 5, borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                                marginVertical: 10,
                                justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                            }}>
                                <Text style={{ marginHorizontal: 15, fontSize: 20, color: '#777777' }}>{rating_info.avg_score}</Text>
                                <StarRating
                                    starsCount={5}
                                    defaultRate={rating_info.avg_score}
                                    disable={true}
                                    color='#FFBB00'
                                    size={25}
                                />
                            </View>
                            <View style={{
                                borderRadius: 4, borderWidth: 0.8, borderRightWidth: 0, borderColor: '#777777',
                                padding: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0,
                                marginVertical: 10,
                                justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                            }}
                            >
                                <Text style={{ fontSize: 20, color: '#777777', width: '43%' }}>
                                    {locales('labels.comment')} {rating_info.total_count}
                                </Text>
                            </View>
                        </View> : null}

                        <View style={{
                            borderRadius: 1, borderColor: '#FAFAFA',
                            borderWidth: 0.8, width: deviceWidth * 0.93, alignSelf: 'center'
                        }}>

                            <View style={{
                                flexDirection: 'row-reverse', justifyContent: 'space-between', borderColor: '#FAFAFA',
                                borderWidth: 0.7, backgroundColor: '#FAFAFA', padding: 10
                            }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <FontAwesome5 name='tasks' size={25} color='#7E7E7E' />
                                    <Text style={{ marginHorizontal: 5, color: '#7E7E7E', fontSize: 16 }}>{locales('labels.activityZone')}</Text>
                                </View>
                                <Text style={{ width: deviceWidth * 0.45, color: '#556080', fontSize: 16 }}>{activityDomainFromByUserName}</Text>
                            </View>

                            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <Entypo name='location-pin' size={25} color='#7E7E7E' />
                                    <Text style={{ marginHorizontal: 5, color: '#7E7E7E', fontSize: 16 }}>{locales('labels.address')}</Text>
                                </View>
                                <Text style={{ width: deviceWidth * 0.45, color: '#556080', fontSize: 16 }}>{`${provinceFromByUserName} - ${cityFromByUserName}`}</Text>
                            </View>

                            {companyNameFromByUserName ? <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FAFAFA', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <FontAwesome name='building' size={25} color='#7E7E7E' />
                                    <Text style={{ marginHorizontal: 5, color: '#7E7E7E', fontSize: 16 }}>{locales('labels.companyName')}</Text>
                                </View>
                                <Text style={{ width: deviceWidth * 0.45, color: '#556080', fontSize: 16 }}>{companyNameFromByUserName || locales('labels.notRegistered')}</Text>
                            </View> : null}

                            {companyRegisterCodeFromByUserName ? <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <FontAwesome name='file-text' size={25} color='#7E7E7E' />
                                    <Text style={{ marginHorizontal: 5, color: '#7E7E7E', fontSize: 16 }}>{locales('labels.registrationNumber')}</Text>
                                </View>
                                <Text style={{ width: deviceWidth * 0.45, color: '#556080', fontSize: 16 }}>{companyRegisterCodeFromByUserName || locales('labels.notRegistered')}</Text>
                            </View> : null}

                        </View>

                        <View style={{
                            width: deviceWidth, alignSelf: 'center', alignItems: 'center',
                            justifyContent: 'center', marginVertical: 10, padding: 5,
                        }}>

                            <View style={{
                                flexDirection: 'row-reverse', alignContent: 'center', borderBottomColor: '#00C569',
                                borderBottomWidth: 3, width: '95%',
                                padding: 10, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/icons/incobac-medium.png')}
                                    style={{ marginHorizontal: 5 }}
                                />
                                <Text style={{ color: '#556080', fontSize: 18, fontFamily: 'Vazir-Bold-FD' }}>
                                    {locales('titles.basicInfo')}
                                </Text>
                            </View>

                            <View style={{ marginVertical: 10, width: '95%', alignItems: 'flex-end' }}>
                                <Text style={{ color: '#666666', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                    {locales('titles.headerDescription')}
                                </Text>
                                <Text style={{ color: '#777777', marginVertical: 10 }}>
                                    {descriptionFromByUserName}
                                </Text>
                            </View>

                        </View>
                        <View style={{
                            alignSelf: 'center', alignItems: 'flex-end',
                            justifyContent: 'center', marginVertical: 10
                        }}>
                            <Text style={{ color: '#666666', fontSize: 18, }}>{locales('labels.myProducts')}</Text>
                            {productsListByUserName && productsListByUserName.products && productsListByUserName.products.length ?
                                productsListByUserName.products.map((item, index) => (
                                    <Product
                                        key={index}
                                        productItem={item}
                                        fetchAllProducts={this.fetchAllProducts}
                                        {...this.props}
                                        width={deviceWidth * 0.93}
                                    />
                                ))
                                : <View style={{
                                    alignSelf: 'center', justifyContent: 'flex-start',
                                    alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93
                                }}>
                                    <FontAwesome5 name='box-open' size={30} color='#BEBEBE' />
                                    <Text style={{ color: '#7E7E7E', fontFamily: 'Vazir-Bold-FD', fontSize: 22 }}>
                                        {locales('titles.noProductFound')}</Text>
                                </View>
                            }
                        </View>

                        <View style={{
                            width: deviceWidth * 0.93,
                            alignSelf: 'center', alignItems: 'flex-end',
                            justifyContent: 'center', marginVertical: 10
                        }}>
                            <Text style={{ color: '#666666', fontSize: 18, marginVertical: 5 }}>{locales('labels.relatedPhotos')}</Text>
                            <FlatList
                                data={relatedsFromByUserName}
                                horizontal
                                ListEmptyComponent={() => (
                                    <View style={{
                                        alignSelf: 'center', justifyContent: 'flex-start',
                                        alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93
                                    }}>
                                        <Entypo name='image' size={30} color='#BEBEBE' />
                                        <Text style={{ color: '#7E7E7E', fontFamily: 'Vazir-Bold-FD', fontSize: 28 }}>
                                            {locales('labels.noImageFound')}</Text>
                                    </View>
                                )}
                                keyExtractor={((_, index) => index.toString())}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ selectedImageModal: true, selectedImageIndex: index })}
                                    >
                                        <Image
                                            style={{
                                                width: deviceWidth * 0.4,
                                                borderWidth: 0.7,
                                                borderColor: '#BEBEBE',
                                                borderRadius: 4, marginHorizontal: 5, height: deviceWidth * 0.4
                                            }}
                                            source={{
                                                uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item}`
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        <View style={{
                            width: deviceWidth * 0.93,
                            alignSelf: 'center', alignItems: 'flex-end',
                            justifyContent: 'center', marginVertical: 10
                        }}>
                            <Text style={{ color: '#666666', fontSize: 18, marginVertical: 5 }}>{locales('labels.myEvidences')}</Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={certificatesFromByUserName}
                                horizontal
                                ListEmptyComponent={() => (
                                    <View style={{
                                        alignSelf: 'center', justifyContent: 'flex-start',
                                        alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93
                                    }}>
                                        <FontAwesome5 name='tasks' size={30} color='#BEBEBE' />
                                        <Text style={{ color: '#7E7E7E', fontFamily: 'Vazir-Bold-FD', fontSize: 28 }}>
                                            {locales('labels.noevidenceFound')}</Text>
                                    </View>
                                )}
                                keyExtractor={((_, index) => index.toString())}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ selectedEvidenceModal: true, selectedEvidenceIndex: index })}
                                    >
                                        <Image
                                            style={{
                                                borderWidth: 0.7,
                                                borderColor: '#BEBEBE',
                                                borderRadius: 4,
                                                width: deviceWidth * 0.4, borderRadius: 4,
                                                marginHorizontal: 5, height: deviceWidth * 0.4
                                            }}
                                            source={{
                                                uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item}`
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                    </ScrollView >


                </Spin>


            </ >
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
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item)),
        fetchProductsListByUserName: userName => dispatch(profileActions.fetchProductsListByUserName(userName)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
