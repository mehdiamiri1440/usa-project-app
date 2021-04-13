import React, { Component } from 'react';
import { Text, StyleSheet, Image, View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { formatter, deviceHeight, deviceWidth, validator } from '../../utils';
import * as productActions from '../../redux/registerProduct/actions';
import * as requestActions from '../../redux/buyAdRequest/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';

class RegisterProductSuccessfully extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryId: null,
            selectedBuyAdId: -1,
            showGoldenModal: false,
            selectedContact: {},
            subCategoryName: '',
            loaded: false,
            showMobileNumberWarnModal: false,
            accessToContactInfoErrorMessage: '',
        }
    }

    componentDidMount() {
        if (this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
            this.props.fetchBuyAdsAfterPayment();
        }
        // BackHandler.addEventListener('hardwareBackPress', _ => {
        //     this.props.resetRegisterProduct(true)
        //     return false;
        // });
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress');
    }
    // componentDidUpdate(prevProps, prevState) {
    //     console.log('the', this.state.loaded, prevState.loaded)
    //     if (this.state.loaded == false && this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
    //         console.log('called update')
    //         this.props.fetchBuyAdsAfterPayment().then(_ => {
    //             this.setState({ loaded: true })
    //         })
    //     }
    // }



    fetchContactInfo = (item) => {
        const { id, is_golden, myuser_id } = item;
        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info
        const shouldShowPromotionModal = !!is_golden && active_pakage_type != 3;
        if (shouldShowPromotionModal) {
            this.setState({ showGoldenModal: true })
        }
        else {
            this.props.setSelectedButton(id);
            const contactInfoObject = {
                b_id: myuser_id,
                ba_id: id,
                item: "BUYAD"
            }
            this.props.fetchBuyerMobileNumber(contactInfoObject).then(result => {
                const {
                    payload = {}
                } = result;
                const {
                    phone,
                    status
                } = payload;
                if (status == true && !!phone) {
                    item.isContactInfoShown = true;
                    item.mobileNumber = phone;
                    this.setState({});
                }
            })
                .catch(err => {
                    const {
                        response = {}
                    } = err;
                    const {
                        data = {}
                    } = response;
                    const {
                        msg,
                        status
                    } = data;
                    if (status == false) {
                        this.setState({ showMobileNumberWarnModal: true, accessToContactInfoErrorMessage: msg })
                    }
                });
        }
    };


    renderItem = ({ item, index }) => {

        const {
            selectedButton, userProfile = {},
            isUserAllowedToSendMessageLoading,
            buyerMobileNumberLoading
        } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        return (

            <View
                style={{
                    backgroundColor: index % 2 == 0 ? item.is_golden && active_pakage_type == 0 ? '#FFFFFF' : '#F7FCFF' : '#FFFFFF',
                    width: '100%',
                    padding: 20,
                    borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                    borderWidth: 0.5,
                }}
                key={item.id}
            >

                {item.is_golden && active_pakage_type == 0 ?

                    <View style={{
                        minHeight: 90,
                        marginTop: -5,
                        marginLeft: -20
                    }}>

                        <Image source={require('../../../assets/images/blur-items-2.jpg')}
                            style={{
                                zIndex: 0,
                                width: deviceWidth,
                                height: '100%',
                                position: 'absolute',
                                left: 0,
                                top: '35%'
                            }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginVertical: 10,
                                right: 0,

                                flexDirection: 'row-reverse'
                            }}
                        >

                            <FontAwesome5
                                solid
                                name='user-circle'
                                color='#adadad'
                                size={16}
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
                        <View
                            style={{
                                top: 0,
                                zIndex: 1000,
                                width: deviceWidth,
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: 0,
                                right: 0,
                                marginVertical: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#777777'
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
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        marginHorizontal: 2,
                                        color: '#777777'
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
                                        color: '#777777'
                                    }}
                                >
                                    {locales('labels.is')}
                                </Text>
                            </Text>

                        </View>
                    </View>

                    : null}

                {item.is_golden && active_pakage_type == 0 ? null : <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginVertical: 10,
                        flexDirection: 'row-reverse'
                    }}
                >

                    <FontAwesome5
                        solid
                        name='user-circle'
                        color='#adadad'
                        size={16}
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
                </View>}

                {item.is_golden && active_pakage_type == 0 ?
                    null
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
                                color: '#777777',
                                textAlign: 'center'
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
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#e41c38',
                                        marginHorizontal: 2
                                    }}
                                > {formatter.convertedNumbersToTonUnit(item.requirement_amount)}</Text> {`${item.subcategory_name} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    color: '#777777'
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
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                    </View>
                }



                <View style={{
                    marginVertical: 15,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 5,
                    alignSelf: 'center',
                    justifyContent: 'center'
                }}
                >
                    {item.has_phone ?
                        <Button
                            small

                            onPress={event => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.fetchContactInfo(item);
                            }}
                            style={{
                                borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                                width: '47%',
                                zIndex: 1000,
                                marginHorizontal: 15,
                                position: 'relative',
                                alignSelf: 'center',

                            }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0.51, z: 1 }}
                                end={{ x: 0.8, y: 0.2, z: 1 }}
                                colors={!item.isContactInfoShown ?
                                    (!item.is_golden ? ['#00C569', '#00C569', '#00C569']
                                        : ['#c7a84f', '#f9f29f', '#c7a84f'])
                                    : ['#E0E0E0', '#E0E0E0']}
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                    paddingLeft: 20,
                                    padding: 8,
                                    elevation: 0
                                }}
                            >
                                <FontAwesome5
                                    solid
                                    name='phone-square-alt'
                                    color={!item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white'}
                                    size={20} />
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        marginHorizontal: 3,
                                        fontSize: 18,
                                        color: !item.isContactInfoShown ? (!item.is_golden ? 'white' : '#333') : 'white',
                                        paddingHorizontal: 3
                                    }}
                                >
                                    {locales('labels.contactInfo')}
                                </Text>
                                {buyerMobileNumberLoading && selectedButton == item.id ?
                                    <ActivityIndicator
                                        size={15}
                                        color={(!item.is_golden ? 'white' : '#333')}
                                        animating={selectedButton == item.id && !!buyerMobileNumberLoading}
                                        style={{
                                            position: 'absolute', right: 10,
                                            width: 5, height: 5, borderRadius: 5,
                                        }}
                                    />
                                    : null}
                            </LinearGradient>

                        </Button>
                        : null}
                    <Button
                        small
                        onPress={event => !item.expired && this.openChat(event, item, false)}
                        style={[item.expired ? styles.disableLoginButton : styles.loginButton,
                        {
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            width: item.has_phone ? '47%' : '70%',
                            zIndex: 1000,
                            marginHorizontal: 15,
                            elevation: 0,
                            marginBottom: 0,
                            position: 'relative',
                        }]}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={item.has_phone ? ['#fff', '#fff']
                                : (!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f'])
                            }
                            style={{
                                width: '100%',
                                borderColor: item.has_phone ? '#556080' : (!!item.is_golden ? '#c7a84f' : '#00C569'),
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                borderWidth: 1,
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                padding: 8,
                                elevation: 0
                            }}
                        >

                            <MaterialCommunityIcons
                                name='message'
                                color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
                                size={20}
                            />
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                color: item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333'),
                                paddingHorizontal: 3
                            }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                            <ActivityIndicator size={20}
                                color={item.has_phone ? '#556080' : (!item.is_golden ? 'white' : '#333')}
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
                {(item.isContactInfoShown) ?
                    <>
                        <View
                            style={{
                                zIndex: 1,
                                flexDirection: 'row-reverse',
                                padding: 20,
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: '#404B55'
                                }}>
                                {locales('titles.phoneNumber')}
                            </Text>
                            <TouchableOpacity
                                onPress={_ => this.openCallPad(item.mobileNumber)}
                                style={{
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#404B55', fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5
                                    }}
                                >
                                    {item.mobileNumber}
                                </Text>
                                <FontAwesome5
                                    name='phone-square-alt'
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                backgroundColor: '#FFFBE5',
                                borderRadius: 12,
                                alignSelf: 'center',
                                padding: 20,
                                width: '100%',
                                zIndex: 1,
                            }}
                        >

                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesome5
                                    color='#404B55'
                                    size={25}
                                    name='exclamation-circle'
                                />
                                <Text
                                    style={{
                                        color: '#404B55',
                                        marginHorizontal: 5,
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    }}
                                >
                                    {locales('titles.policeWarn')}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    marginVertical: 15,
                                    color: '#666666',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}
                            >
                                {locales('labels.policeWarnDescription')}
                            </Text>
                        </View>
                    </>
                    : null}

                {/* <View style={{ marginVertical: 15 }}>

                    <Button
                        small
                        onPress={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.openChat(event, item)
                        }}
                        style={{
                            borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                            width: "80%",
                            position: 'relative',
                            zIndex: 10000,
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

                            }}
                        >

                            <MaterialCommunityIcons
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                name='message' color={!item.is_golden ? 'white' : '#333'} size={16} />
                            <Text
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
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
            */}
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

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;

        return (

            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                }} style={{
                    marginTop: 50,
                    paddingBottom: 50,
                    flexDirection: 'row-reverse',
                    width: deviceWidth,
                    justifyContent: 'center',
                    backgroundColor: 'white',

                }}>
                <Text style={{
                    color: '#1da6f4',
                    fontSize: 16,
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    marginLeft: 5,
                }}>
                    {locales('titles.otherRelatedBuyads')}

                </Text>
                <Text style={{
                    top: 3
                }}>
                    <FontAwesome5
                        size={15}
                        name='arrow-left'
                        color='#1DA1F2'

                    />
                </Text>
            </TouchableOpacity>

        )
    };

    renderListHeaderComponent = _ => {
        return (
            <View
                style={{
                    padding: 20, marginVertical: 0,
                    backgroundColor: 'white'
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: 22,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}
                >
                    {locales('labels.buyers')}
                </Text>

                <Text
                    style={{
                        color: '#777777',
                        fontSize: 16,
                        marginVertical: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {locales('labels.suggestedBuyersForYou')} <Text
                        style={{
                            color: '#21AD93',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('titles.buskool')}
                    </Text>
                    <Text
                        style={{
                            color: '#777777',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.forYourProduct')}
                    </Text>
                </Text>

            </View>

        )
    }

    chooseBuyadsList = (buyAds, buyAdsFromParams, buyAdsAfterPaymentList) => {
        let buyAdsList = [];
        buyAdsList = buyAdsAfterPaymentList.length ? [...buyAdsAfterPaymentList] : buyAds.length ? [...buyAds] : [...buyAdsFromParams];
        return buyAdsList
    };



    openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    openChat = (event, item) => {
        let { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;
        event.stopPropagation()
        event.preventDefault();
        if (!item.is_golden || (item.is_golden && active_pakage_type > 0)) {
            this.setState({ selectedButton: item.id })

            this.setState({
                selectedBuyAdId: item.id,
                selectedContact: {
                    contact_id: item.myuser_id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                }
            }, _ => this.props.navigation.navigate('Chat', { contact: this.state.selectedContact, buyAdId: this.state.selectedBuyAdId }));
            // .catch(_ => this.setState({ showModal: true }));
        }
        else {
            this.setState({ showGoldenModal: true });
        }
    };

    keyExtractor = item => item.id.toString();

    render() {

        const {
            route = {},
            buyAds = [],
            buyAdsAfterPaymentList = [],
            buyAdsAfterPaymentLoading
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName,
            buyAds: buyAdsFromParams = [],
        } = params;

        const {
            selectedBuyAdId,
            showGoldenModal,
            accessToContactInfoErrorMessage,
            showMobileNumberWarnModal,
            selectedContact
        } = this.state;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;


        return (
            <>



                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showMobileNumberWarnModal}
                        onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.contactInfo')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {accessToContactInfoErrorMessage}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.setState({ showMobileNumberWarnModal: false });
                                    this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                }}
                            >

                                <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                styles.buttonText]}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >



                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showGoldenModal}
                        onDismiss={() => { this.setState({ showGoldenModal: false }) }}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => { this.setState({ showGoldenModal: false }) }}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.goldenRequests')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('labels.accessToGoldensDeined')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('labels.icreaseToSeeGoldens')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, { elevation: 0 }]}
                                onPress={() => {
                                    this.setState({ showGoldenModal: false })
                                    this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ showGoldenModal: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >

                <ScrollView
                    style={{
                        marginTop: -4,
                        backgroundColor: 'white'
                    }}
                >
                    {buyAdsAfterPaymentList.length ? null :
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
                                {locales('titles.productRegisteredSuccessfully')}
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
                                {locales('titles.productdAccepted')}
                            </Text>
                        </View>}

                    <ActivityIndicator size={30} color='#00C569' animating={buyAdsAfterPaymentLoading} />

                    {this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList).length ?
                        <FlatList
                            renderItem={this.renderItem}
                            data={this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList)}
                            ListHeaderComponent={this.renderListHeaderComponent}
                            ListFooterComponent={this.renderListFooterComponent}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
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
                                    justifyContent: 'center', width: '75%',
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

    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },

    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        alignSelf: 'center',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

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
        width: '60%',
        height: 40,
        marginBottom: 10,
        elevation: 0,
        borderRadius: 4,
        backgroundColor: '#BEBEBE',
        color: 'white',
    },
    loginButton: {
        textAlign: 'center',
        width: '60%',
        height: 40,
        elevation: 0,
        marginBottom: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        color: 'white',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#777777',
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
        color: '#777777'
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchBuyAdsAfterPayment: _ => dispatch(registerProductActions.fetchBuyAdsAfterPayment()),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        fetchBuyerMobileNumber: contactInfoObject => dispatch(requestActions.fetchBuyerMobileNumber(contactInfoObject)),
    }
};
const mapStateToProps = (state) => {
    const {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment
    } = state.registerProductReducer;

    const {
        userProfile
    } = state.profileReducer;

    const {
        buyerMobileNumberLoading
    } = state.buyAdRequestReducer;

    return {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment,

        userProfile,

        buyerMobileNumberLoading
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProductSuccessfully)