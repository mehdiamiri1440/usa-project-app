import React, { Component, PureComponent } from 'react';
import {
    Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image, StyleSheet, RefreshControl, ActivityIndicator,
    Share, FlatList, Modal
} from 'react-native';
import { Button, CardItem, Card, Body } from 'native-base';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
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
import ValidatedUserIcon from '../../components/validatedUserIcon';
import NoConnection from '../../components/noConnectionError';
import RelatedPhotos from './RelatedPhotos';
import Certificates from './certificates';
class Profile extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalFlag: false,
            selectedEvidenceModal: false,
            selectedImageModal: false,
            selectedEvidenceIndex: -1,
            selectedImageIndex: -1,
            showModal: false,
            prevUserName: '',
            loaded: false,

            firstNameFromByUserName: '',
            lastNameFromByUserName: '',
            userIdFromByUserName: '',
            is_verified: false,
            relatedsFromByUserName: [],
            certificatesFromByUserName: [],
            profilePhotoFromByUserName: '',
            buyAd_count: null,
            product_count: null,
            reputation_score: 0,
            response_rate: 0,
            transaction_count: 0,
            validated_seller: false,
            avg_score: 0,
            total_count: 0,
            rating_info: {},
            provinceFromByUserName: '',
            cityFromByUserName: '',
            companyRegisterCodeFromByUserName: '',
            companyNameFromByUserName: '',
            descriptionFromByUserName: '',
            productsListByUserName: []
        }
    }

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().setCurrentScreen(componentName, componentName);
            }
        });
        analytics().setCurrentScreen("profile", "profile");

        this.initProfileContent().catch(_ => this.setState({ showModal: false }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.profileInfo.length) {

            const {
                product_count,
                buyAd_count,
                rating_info,
                reputation_score,
                response_rate,
                transaction_count,
                validated_seller
            } = this.props.profileInfo[0].statistics;

            const {
                avg_score,
                total_count
            } = rating_info;

            const {
                profile,
                user_info,
                certificates: certificatesFromByUserName,
                activity_domain: activityDomainFromByUserName,
                relateds: relatedsFromByUserName,
            } = this.props.profileInfo[1];

            const {
                products: productsListByUserName
            } = this.props.profileInfo[2];

            const {
                address,
                profile_photo: profilePhotoFromByUserName,
                company_name: companyNameFromByUserName,
                company_register_code: companyRegisterCodeFromByUserName,
                confirmed,
                description: descriptionFromByUserName
            } = profile;

            const {
                first_name: firstNameFromByUserName,
                last_name: lastNameFromByUserName,
                id: userIdFromByUserName,
                is_verified,
                province: provinceFromByUserName,
                city: cityFromByUserName,
            } = user_info;

            this.setState({
                loaded: true,

                activityDomainFromByUserName,
                firstNameFromByUserName,
                lastNameFromByUserName,
                userIdFromByUserName,
                is_verified,
                relatedsFromByUserName,
                certificatesFromByUserName,
                profilePhotoFromByUserName,
                product_count,
                buyAd_count,

                reputation_score,
                response_rate,
                transaction_count,
                validated_seller,
                avg_score,
                total_count,
                rating_info,
                provinceFromByUserName,
                cityFromByUserName,
                companyRegisterCodeFromByUserName,
                companyNameFromByUserName,
                descriptionFromByUserName,
                productsListByUserName
            })
        }
    }

    initProfileContent = _ => {
        return new Promise((resolve, reject) => {
            if (this.props.route && this.props.route.params && this.props.route.params.user_name) {
                this.props.fetchAllProfileInfo(this.props.route.params.user_name)
                // this.props.fetchProfileStatistics(this.props.route.params.user_name).catch(error => reject(error));
                // this.props.fetchProfileByUserName(this.props.route.params.user_name).catch(error => reject(error));
                // this.props.fetchProductsListByUserName(this.props.route.params.user_name).catch(error => reject(error));
            }
            else {
                resolve(true)
                this.props.navigation.goBack();
            }
        })
    };

    fetchAllProducts = () => {
        const { from_record_number = 0, to_record_number = 15, sort_by = 'BM' } = this.state;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };
        this.props.fetchAllProductsList(item).catch(_ => this.setState({ showModal: false }));
    };

    shareProfileLink = async () => {
        analytics().logEvent('profile_share', {
            'contact-id': this.state.userIdFromByUserName
        });
        try {
            const result = await Share.share({
                message:
                    `${REACT_APP_API_ENDPOINT_RELEASE}/profile/${this.props.route.params.user_name}`,
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

    closeModal = _ => {
        this.setState({ showModal: false });
        this.componentDidMount();
    };

    setSelectedImage = (selectedImageModal, selectedImageIndex) => {
        this.setState({ selectedImageModal, selectedImageIndex })
    }

    setSelectedEvidence = (selectedEvidenceModal, selectedEvidenceIndex) => {
        this.setState({ selectedEvidenceModal, selectedEvidenceIndex })
    }

    render() {
        const {
            profileInfo,
            profileInfoLoading
        } = this.props;

        let {
            modalFlag,
            selectedEvidenceModal,
            selectedImageModal,
            selectedEvidenceIndex,
            selectedImageIndex,


            firstNameFromByUserName,
            lastNameFromByUserName,
            userIdFromByUserName,
            is_verified,
            relatedsFromByUserName,
            certificatesFromByUserName,
            profilePhotoFromByUserName,

            product_count,
            buyAd_count,
            reputation_score,
            response_rate,
            transaction_count,
            validated_seller,
            avg_score,
            total_count,
            rating_info,

            activityDomainFromByUserName,

            provinceFromByUserName,
            cityFromByUserName,
            companyRegisterCodeFromByUserName,
            companyNameFromByUserName,
            descriptionFromByUserName,

            productsListByUserName
        } = this.state;

        const selectedContact = {
            first_name: firstNameFromByUserName,
            contact_id: userIdFromByUserName,
            last_name: lastNameFromByUserName,
            is_verified
        }

        return (
            <>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                {(profileInfoLoading) ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',
                        elevation: 5,
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size="large"
                            style={{
                                position: 'absolute', left: '44%', top: '40%',
                                elevation: 5,
                                borderColor: 'black',
                                backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                            }}
                            color="#00C569"

                        />
                    </View> : null}
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
                    profile_photo={profilePhotoFromByUserName}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}



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
                            {locales('labels.seeProfile')}
                        </Text>
                    </View>
                </View>


                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={
                            profileInfoLoading
                        } onRefresh={() => this.initProfileContent()} />
                    }
                    style={{ backgroundColor: 'white' }}>
                    <View style={{
                        paddingVertical: 20, width: '100%',

                    }}>
                        <View
                            style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <View style={{
                                width: '30%',
                                alignItems: 'center'
                            }}>
                                <Image
                                    style={{
                                        width: deviceWidth * 0.22,
                                        height: deviceWidth * 0.22, borderRadius: deviceWidth * 0.11
                                    }}
                                    source={
                                        profilePhotoFromByUserName ? { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profilePhotoFromByUserName}` }
                                            : require('../../../assets/icons/user.png')}
                                />

                            </View>

                            <View style={{
                                width: '70%'
                            }}>
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    marginVertical: 3,
                                }}>
                                    <View>
                                        {product_count >= 0 ? <>
                                            <Text
                                                style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 18 }}>{product_count > 0 ? product_count : 0}</Text>
                                            <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 16 }}>{locales('labels.products')}</Text>
                                        </>
                                            :
                                            <>
                                                <Text
                                                    style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 18 }}>{buyAd_count > 0 ? buyAd_count : 0}</Text>
                                                <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 16 }}>{locales('labels.requests')}</Text>
                                            </>
                                        }
                                    </View>
                                    <View>
                                        <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 18 }}>{reputation_score > 0 ? reputation_score : 0}</Text>
                                        <Text style={{ textAlign: 'center', color: '#7E7E7E', fontSize: 16 }}>{locales('labels.credit')}</Text>
                                    </View>
                                </View>
                                {userIdFromByUserName != (this.props.userProfile &&
                                    this.props.userProfile.user_info && this.props.userProfile.user_info.id) ?
                                    <Button

                                        onPress={() => {
                                            analytics().logEvent('open_chat', {
                                                'contact-id': userIdFromByUserName
                                            });
                                            this.setState({ modalFlag: true })
                                        }}
                                        style={[styles.loginButton, { flex: 1, height: 40, elevation: 0 }]}
                                    >
                                        <View
                                            style={[styles.textCenterView,
                                            styles.buttonText]}
                                        >
                                            <Text style={[styles.textWhite, styles.margin5, { marginTop: 8 }]}>
                                                <FontAwesome name='envelope' size={20} />
                                            </Text>
                                            <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18]}>
                                                {locales('titles.sendMessage')}
                                            </Text>
                                        </View>

                                    </Button>
                                    : <Button
                                        small
                                        onPress={() => this.props.navigation.navigate('MyBuskool', { screen: 'EditProfile' })}
                                        style={[styles.loginButton, { flex: 1, height: 40, elevation: 0 }]}
                                    >
                                        <View style={[styles.textCenterView, styles.buttonText]}>
                                            <Text style={[styles.textWhite, styles.margin5, { marginTop: 9 }]}>
                                                <FontAwesome name='pencil' size={20} />
                                            </Text>
                                            <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18]}>
                                                {locales('titles.editProfile')}
                                            </Text>
                                        </View>

                                    </Button>}
                            </View>


                        </View>
                    </View>

                    <View style={{
                        marginBottom: 10,
                    }}>

                        <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row-reverse' }}>
                            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{ color: '#666666', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5 }}>
                                    {`${firstNameFromByUserName} ${lastNameFromByUserName}`}
                                </Text>
                                {is_verified ? <ValidatedUserIcon /> : null}
                            </View>
                            <TouchableOpacity
                                onPress={() => this.shareProfileLink()}
                                style={{
                                    borderWidth: 0.8, borderColor: '#777777', borderRadius: 6, padding: 5,

                                    width: 120, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'
                                }}>

                                <View style={[styles.textCenterView, styles.buttonText]}>
                                    <Text style={{ marginTop: 5 }}>
                                        <FontAwesome name='share-alt' size={14} color='#777777' />
                                    </Text>
                                    <Text style={{
                                        color: '#777777', fontSize: 14, paddingHorizontal: 5
                                    }}>
                                        {locales('labels.share')}
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        {response_rate > 0 ? <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                            </Text>
                        </View> : null}

                    </View>
                    {(rating_info && rating_info.avg_score > 0 && rating_info.total_count > 0) ? <View style={{
                        flex: 1,
                        marginVertical: 10,
                        borderRadius: 4, borderWidth: 0.8, borderColor: '#777777',
                        overflow: 'hidden',
                        alignSelf: 'center', justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                    }}>
                        <View style={{
                            backgroundColor: '#FAFAFA',
                            padding: 5,
                            justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 20, color: '#777777', paddingHorizontal: 5 }}>{rating_info.avg_score}</Text>
                            <StarRating
                                starsCount={5}
                                defaultRate={rating_info.avg_score}
                                disable={true}
                                color='#FFBB00'
                                size={25}
                            />
                        </View>
                        <View style={{
                            width: 120,

                            justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                        }}
                        >
                            <Text style={{ fontSize: 16, color: '#777777', paddingVertical: 2 }}>
                                {rating_info.total_count} {locales('labels.comment')}
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
                            <Text
                                style={{ width: deviceWidth * 0.45, color: '#556080', fontSize: 16 }}>{`${provinceFromByUserName} - ${cityFromByUserName}`}</Text>
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
                            <Text style={{ color: '#556080', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('titles.basicInfo')}
                            </Text>
                        </View>

                        <View style={{ marginVertical: 10, width: '95%', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 }}>
                                {locales('titles.headerDescription')}
                            </Text>
                            <Text style={{ color: '#777777', marginVertical: 10 }}>
                                {descriptionFromByUserName}
                            </Text>
                        </View>

                    </View>
                    <View style={{
                        width: deviceWidth, alignSelf: 'center', alignItems: 'center',
                        justifyContent: 'center', marginVertical: 10, padding: 5,
                    }}>
                        <View style={{ marginVertical: 10, width: '95%', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 }}>
                                {locales('labels.myProducts')}
                            </Text>

                        </View>
                        {productsListByUserName && productsListByUserName.length ?
                            productsListByUserName.map((item, index) => (
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
                                <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                                <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noUserProductFound')}</Text>

                            </View>
                        }
                    </View>

                    <View style={{
                        width: deviceWidth, alignSelf: 'center', alignItems: 'center',
                        justifyContent: 'center', marginVertical: 10, padding: 5,
                    }}>
                        <View style={{ marginVertical: 10, width: '95%', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 }}>
                                {locales('labels.relatedPhotos')}
                            </Text>

                        </View>
                        <RelatedPhotos relatedsFromByUserName={relatedsFromByUserName} setSelectedImage={this.setSelectedImage} />
                    </View>

                    <View style={{
                        width: deviceWidth, alignSelf: 'center', alignItems: 'center',
                        justifyContent: 'center', marginVertical: 10, padding: 5,
                    }}>
                        <View style={{ marginVertical: 10, width: '95%', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 }}>
                                {locales('labels.myEvidences')}
                            </Text>

                        </View>

                        <Certificates setSelectedEvidence={this.setSelectedEvidence} certificatesFromByUserName={certificatesFromByUserName} />
                    </View>

                </ScrollView >


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
        fontSize: 16,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        // width: '100%',
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
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize18: {
        fontSize: 18
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

        profileInfo,
        profileInfoLoading

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

        profileInfo,
        profileInfoLoading
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchAllProfileInfo: user_name => dispatch(profileActions.fetchAllProfileInfo(user_name)),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item, false)),
        // fetchProfileStatistics: userName => dispatch(profileActions.fetchProfileStatistics(userName)),
        // fetchProfileByUserName: userName => dispatch(profileActions.fetchProfileByUserName(userName)),
        // fetchProductsListByUserName: userName => dispatch(profileActions.fetchProductsListByUserName(userName)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)


// promise all