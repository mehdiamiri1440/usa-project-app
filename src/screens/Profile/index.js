import React, { PureComponent } from 'react';
import {
    Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, RefreshControl, Share, Modal, Linking
} from 'react-native';
import { Button } from 'native-base';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import ImageZoom from 'react-native-image-pan-zoom';

import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import Product from '../ProductsList/Product';
import StarRating from '../../components/StarRating'
import ValidatedUserIcon from '../../components/validatedUserIcon';
import NoConnection from '../../components/noConnectionError';
import RelatedPhotos from './RelatedPhotos';
import Certificates from './certificates';
import Rating from './Rating';
import Comments from './Comments';
import Header from '../../components/header';
class Profile extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
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
            productsListByUserName: [],
        }
    }

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "profile",
            screen_class: "profile",
        });

        this.initProfileContent()
        // .catch(_ => this.setState({ showModal: false }))
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

        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            user_name
        } = params;

        return new Promise((resolve, reject) => {
            if (user_name) {
                this.props.fetchAllProfileInfo(user_name)
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

        const {
            loggedInUserId
        } = this.props;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };
        this.props.fetchAllProductsList(item, !!loggedInUserId)
        // .catch(_ => this.setState({ showModal: false }));
    };

    shareProfileLink = async () => {
        analytics().logEvent('profile_share', {
            contact_id: this.state.userIdFromByUserName
        });
        // try {
        //     const result = await Share.share({
        //         message:
        //             `${REACT_APP_API_ENDPOINT_RELEASE}/profile/${this.props.route.params.user_name}`,
        //     });
        //     if (result.action === Share.sharedAction) {
        //         if (result.activityType) {
        //             // shared with activity type of result.activityType
        //         } else {
        //             // shared
        //         }
        //     } else if (result.action === Share.dismissedAction) {
        //         // dismissed
        //     }
        // } catch (error) {
        // }
        const url = `whatsapp://send?text=${REACT_APP_API_ENDPOINT_RELEASE}/shared-profile/${this.props.route && this.props.route.params && this.props.route.params.user_name || ''}`;

        Linking.canOpenURL(url).then((supported) => {
            if (!!supported) {
                Linking.openURL(url)
            } else {
                Linking.openURL(url)
            }
        })
            .catch(() => {
                Linking.openURL(url)
            })
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

    openChat = () => {

        const {
            loggedInUserId,
        } = this.props;

        let {
            firstNameFromByUserName,
            lastNameFromByUserName,
            userIdFromByUserName,
            is_verified,
            profilePhotoFromByUserName,
        } = this.state;


        const selectedContact = {
            first_name: firstNameFromByUserName,
            contact_id: userIdFromByUserName,
            last_name: lastNameFromByUserName,
            is_verified
        };

        if (!loggedInUserId)
            return this.props.navigation.navigate('StartUp', {
                screen: 'SignUp', params: {
                    profile_photo: profilePhotoFromByUserName,
                    contact: selectedContact
                }
            });
        analytics().logEvent('open_chat', {
            contact_id: userIdFromByUserName
        });
        this.props.navigation.navigate('Chat', {
            profile_photo: profilePhotoFromByUserName,
            contact: selectedContact
        })
    };

    render() {
        const {
            profileInfo,
            profileInfoLoading,
            userProfile = {},
            loggedInUserId
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            id: idOfLoggedInUser
        } = user_info;

        let {
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

            productsListByUserName,

        } = this.state;


        return (
            <>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

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
                        <ImageZoom
                            cropWidth={deviceWidth}
                            cropHeight={deviceHeight * 0.9}
                            imageWidth={deviceWidth}
                            imageHeight={deviceHeight * 0.6}
                        >
                            <Image
                                style={{
                                    alignSelf: 'center', width: deviceWidth,
                                    height: '100%',
                                    resizeMode: 'contain'
                                }}
                                source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${relatedsFromByUserName[selectedImageIndex]}` }} />
                        </ImageZoom>
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
                        <ImageZoom
                            cropWidth={deviceWidth}
                            cropHeight={deviceHeight * 0.9}
                            imageWidth={deviceWidth}
                            imageHeight={deviceHeight * 0.6}
                        >
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    width: deviceWidth,
                                    height: '100%',
                                    resizeMode: 'contain'
                                }}
                                source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${certificatesFromByUserName[selectedEvidenceIndex]}` }} />
                        </ImageZoom>
                    </View>
                </Modal>

                <Header
                    title={locales('labels.seeProfile')}
                    {...this.props}
                />


                {(profileInfoLoading) ?
                    <ScrollView style={{
                        flex: 1, width: deviceWidth, height: deviceHeight,

                        // borderColor: 'black',
                        backgroundColor: 'white',

                    }}>
                        <View style={{
                        }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={120}
                                viewBox="0 0 420 120"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                            >
                                <Rect x="55" y="15" rx="3" ry="3" width="60" height="35" />
                                <Rect x="195" y="16" rx="3" ry="3" width="60" height="35" />
                                <Rect x="18" y="69" rx="3" ry="3" width="272" height="51" />
                                <Circle cx="361" cy="65" r="47" />
                            </ContentLoader>

                        </View>

                        <View style={{
                            marginTop: 20,
                        }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={200}
                                viewBox="0 0 420 200"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                            >
                                <Rect x="11" y="0" rx="3" ry="3" width="128" height="38" />
                                <Rect x="254" y="4" rx="3" ry="3" width="161" height="25" />
                                <Rect x="12" y="93" rx="3" ry="3" width="185" height="33" />
                                <Rect x="188" y="41" rx="3" ry="3" width="225" height="21" />
                                <Rect x="220" y="91" rx="3" ry="3" width="193" height="33" />
                                <Rect x="13" y="136" rx="3" ry="3" width="185" height="33" />
                                <Rect x="221" y="134" rx="3" ry="3" width="193" height="33" />
                                {/* <Rect x="13" y="178" rx="3" ry="3" width="185" height="33" />
                                <Rect x="221" y="176" rx="3" ry="3" width="193" height="33" /> */}
                            </ContentLoader>

                        </View>
                        <View style={{
                            marginBottom: 20,
                        }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={160}
                                viewBox="0 0 420 160"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                            >
                                <Rect x="36" y="53" rx="3" ry="3" width="386" height="18" />
                                <Rect x="61" y="112" rx="3" ry="3" width="353" height="18" />
                                <Rect x="145" y="83" rx="3" ry="3" width="262" height="18" />
                                <Rect x="0" y="35" rx="0" ry="0" width="417" height="2" />
                                <Rect x="110" y="0" rx="3" ry="3" width="202" height="24" />
                            </ContentLoader>

                        </View>
                        <View

                            style={{
                                borderRadius: 5,
                                borderWidth: 2,
                                borderColor: '#eee',
                                paddingBottom: 10,
                                marginBottom: 15

                            }}>
                            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}>
                                {[1, 2, 3, 4, 5, 6].map((_, index) =>
                                    // <ContentLoader key={index} />
                                    <View
                                        key={index}
                                        style={{
                                            paddingBottom: 10,
                                            marginBottom: 15,
                                            flex: 1,
                                            width: '100%',
                                            height: deviceHeight * 0.35,
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'space-around',
                                            alignItems: 'center'

                                        }}>
                                        <View
                                            style={{
                                                borderRadius: 12, marginHorizontal: 3,
                                                borderWidth: 1, borderColor: '#eee', width: '95%', height: '100%'
                                            }}
                                        >
                                            <ContentLoader
                                                speed={2}
                                                width={'100%'}
                                                height={'100%'}
                                                backgroundColor="#f3f3f3"
                                                foregroundColor="#ecebeb"

                                            >
                                                <Rect x="0" y="0" width="100%" height="60%" />
                                                <Rect x="25%" y="65%" width="240" height="10" />
                                                <Rect x="20%" y="73%" width="270" height="10" />
                                                <Rect x="20%" y="80%" width="270" height="10" />
                                            </ContentLoader>
                                        </View>

                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{
                            marginBottom: 20,
                        }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={190}
                                viewBox="0 0 420 190"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                            >
                                <Rect x="0" y="35" rx="0" ry="0" width="417" height="2" />
                                <Rect x="202" y="0" rx="3" ry="3" width="202" height="24" />
                                <Rect x="12" y="55" rx="3" ry="3" width="121" height="124" />
                                <Rect x="144" y="54" rx="3" ry="3" width="131" height="124" />
                                <Rect x="285" y="54" rx="3" ry="3" width="121" height="124" />
                            </ContentLoader>

                        </View>
                        <View style={{
                            marginBottom: 20,
                        }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={190}
                                viewBox="0 0 420 190"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                            >
                                <Rect x="0" y="35" rx="0" ry="0" width="417" height="2" />
                                <Rect x="202" y="0" rx="3" ry="3" width="202" height="24" />
                                <Rect x="12" y="55" rx="3" ry="3" width="121" height="124" />
                                <Rect x="144" y="54" rx="3" ry="3" width="131" height="124" />
                                <Rect x="285" y="54" rx="3" ry="3" width="121" height="124" />
                            </ContentLoader>

                        </View>
                    </ScrollView>


                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={profileInfoLoading}
                                onRefresh={() => this.initProfileContent()}
                            />
                        }
                        style={{ backgroundColor: 'white' }}
                    >
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
                                            profilePhotoFromByUserName ?
                                                { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profilePhotoFromByUserName}` }
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
                                                    style={{
                                                        textAlign: 'center', color: '#7E7E7E', fontSize: 18,
                                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                    }}>{product_count > 0 ? product_count : 0}</Text>
                                                <Text style={{
                                                    textAlign: 'center', color: '#7E7E7E', fontSize: 16,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                }}>{locales('labels.products')}</Text>
                                            </>
                                                :
                                                <>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center', color: '#7E7E7E', fontSize: 18,
                                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                        }}>{buyAd_count > 0 ? buyAd_count : 0}</Text>
                                                    <Text style={{
                                                        textAlign: 'center', color: '#7E7E7E', fontSize: 16,
                                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                    }}>{locales('labels.requests')}</Text>
                                                </>
                                            }
                                        </View>
                                        <View>
                                            <Text style={{
                                                textAlign: 'center', color: '#7E7E7E', fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}>{reputation_score > 0 ? reputation_score : 0}</Text>
                                            <Text style={{
                                                textAlign: 'center', color: '#7E7E7E', fontSize: 16,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}>{locales('labels.credit')}</Text>
                                        </View>
                                    </View>
                                    {userIdFromByUserName != idOfLoggedInUser ?
                                        <Button

                                            onPress={this.openChat}
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
                                                    {locales('labels.sendMessage')}
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
                                    {is_verified ? <ValidatedUserIcon {...this.props} /> : null}
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
                                            color: '#777777', fontSize: 14, paddingHorizontal: 5,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}>
                                            {locales('labels.share')}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            {response_rate > 0 ? <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                    {locales('labels.responseRate')} <Text style={{
                                        color: '#E41C38',
                                        fontWeight: '200',
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>%{response_rate}</Text>
                                </Text>
                            </View> : null}

                        </View>
                        {(rating_info && rating_info.avg_score > 0) ? <View style={{
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
                                <Text style={{
                                    fontSize: 20, color: '#777777', paddingHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>{rating_info.avg_score}</Text>
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
                                <Text style={{
                                    fontSize: 16, color: '#777777', paddingVertical: 2,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>
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
                                    <Text style={{
                                        marginHorizontal: 5, color: '#7E7E7E', fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{locales('labels.activityZone')}</Text>
                                </View>
                                <Text style={{
                                    width: deviceWidth * 0.45, color: '#556080', fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>{activityDomainFromByUserName}</Text>
                            </View>

                            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <Entypo name='location-pin' size={25} color='#7E7E7E' />
                                    <Text style={{
                                        marginHorizontal: 5, color: '#7E7E7E', fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{locales('labels.address')}</Text>
                                </View>
                                <Text
                                    style={{
                                        width: deviceWidth * 0.45, color: '#556080', fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{`${provinceFromByUserName} - ${cityFromByUserName}`}</Text>
                            </View>

                            {companyNameFromByUserName ? <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FAFAFA', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <FontAwesome name='building' size={25} color='#7E7E7E' />
                                    <Text style={{
                                        marginHorizontal: 5, color: '#7E7E7E', fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{locales('labels.companyName')}</Text>
                                </View>
                                <Text style={{
                                    width: deviceWidth * 0.45, color: '#556080', fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>{companyNameFromByUserName || locales('labels.notRegistered')}</Text>
                            </View> : null}

                            {companyRegisterCodeFromByUserName ? <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10 }}>
                                <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4 }}>
                                    <FontAwesome name='file-text' size={25} color='#7E7E7E' />
                                    <Text style={{
                                        marginHorizontal: 5, color: '#7E7E7E', fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{locales('labels.registrationNumber')}</Text>
                                </View>
                                <Text style={{
                                    width: deviceWidth * 0.45, color: '#556080', fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>{companyRegisterCodeFromByUserName || locales('labels.notRegistered')}</Text>
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

                            <View style={{
                                marginVertical: 10, width: '95%', alignItems: 'flex-end',
                                borderBottomWidth: 1, borderBottomColor: '#F2F2F2'
                            }}>
                                <Text style={{ color: '#666666', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 }}>
                                    {locales('titles.headerDescription')}
                                </Text>
                                <Text style={{
                                    color: '#777777', marginVertical: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}>
                                    {descriptionFromByUserName}
                                </Text>
                            </View>

                        </View>
                        {!!loggedInUserId ? <>
                            <Rating
                                userId={userIdFromByUserName}
                                fullName={`${firstNameFromByUserName} ${lastNameFromByUserName}`}
                                userName={this.props.route && this.props.route.params && this.props.route.params.user_name || ''}
                            />
                            <Comments
                                userId={userIdFromByUserName}
                                userName={this.props.route && this.props.route.params && this.props.route.params.user_name || ''}
                                fullName={`${firstNameFromByUserName} ${lastNameFromByUserName}`}
                            />
                        </>
                            : null
                        }
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
                                    <View
                                        key={index}
                                        style={{
                                            marginVertical: 10,
                                            width: deviceWidth * 0.93
                                        }}
                                    >
                                        <Product
                                            key={index}
                                            shouldShowMyButtons
                                            productItem={item}
                                            fetchAllProducts={this.fetchAllProducts}
                                            {...this.props}
                                            width={'100%'}
                                        />
                                    </View>
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
                }

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

    const {
        loggedInUserId
    } = state.authReducer;

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
        profileInfoLoading,

        loggedInUserId
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchAllProfileInfo: user_name => dispatch(profileActions.fetchAllProfileInfo(user_name)),
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn)),
        // fetchProfileStatistics: userName => dispatch(profileActions.fetchProfileStatistics(userName)),
        // fetchProfileByUserName: userName => dispatch(profileActions.fetchProfileByUserName(userName)),
        // fetchProductsListByUserName: userName => dispatch(profileActions.fetchProductsListByUserName(userName)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)


// promise all