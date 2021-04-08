import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import { Button } from 'native-base';
import Svg, { Image as SvgImage, Defs, G, Circle as SvgCircle } from "react-native-svg";
import Jmoment from 'moment-jalaali';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect } from "react-content-loader/native"
import AsyncStorage from '@react-native-community/async-storage';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productActions from '../../redux/registerProduct/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import LinearGradient from 'react-native-linear-gradient';

import Entypo from 'react-native-vector-icons/dist/Entypo';

import BuyAdList from './BuyAdList';
import NoConnection from '../../components/noConnectionError';
import Filters from './Filters';

Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });
class Requests extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: null,
            from: 0,
            to: 15,
            loaded: false,

            showToast: false,
            showDialog: false,
            selectedBuyAdId: -1,
            selectedContact: {},
            showFilters: false,
            showGoldenModal: false,
            showModal: false,
            selectedFilterName: '',

            showMobileNumberWarnModal: false,
            accessToContactInfoErrorMessage: ''
        }
    }

    requestsRef = React.createRef();
    updateFlag = React.createRef();

    is_mounted = false;

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
            screen_name: "buyAds",
            screen_class: "buyAds",
        });

        this.is_mounted = true;
        if (this.is_mounted == true) {
            AsyncStorage.setItem('@registerProductParams', JSON.stringify({}))
            this.initialCalls()
            // .catch(_ => this.setState({ showModal: true }));
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
        this.updateFlag.current.close()
    }


    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey && (!prevProps.route || !prevProps.route.params))
            ||
            (prevProps.route && prevProps.route.params && this.props.route && this.props.route.params &&
                this.props.route.params.needToRefreshKey != prevProps.route.params.needToRefreshKey
            )
        ) {
            this.props.fetchAllDashboardData()
            this.props.fetchUserProfile()
        }

        if (prevState.loaded == false && this.props.buyAdRequestsList.length) {
            this.setState({ buyAdRequestsList: this.props.buyAdRequestsList, loaded: true })
        }
        if ((this.props.route && this.props.route.params && this.props.route.params.subCategoryId >= 0 &&
            prevProps.route && !prevProps.route.params)
            || (this.props.route && this.props.route.params && prevProps.route && prevProps.route.params &&
                this.props.route?.params?.subCategoryId != prevProps.route?.params?.subCategoryId)) {
            this.checkForFiltering()
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('this.props', this.props, 'nextprops', nextProps, 'this.state', this.state, 'nexststate', nextState)
    //     if (this.props.isUserAllowedToSendMessageLoading || (this.props.buyAdRequestLoading && this.props.buyAdRequestsList.length) || this.props.buyAdRequestsList.length)
    //         return false;
    //     return true
    // }

    checkForFiltering = async () => {
        let isFilter = await this.checkForFilterParamsAvailability();
        if (isFilter) {
            this.selectedFilter(this.props.route?.params?.subCategoryId, this.props.route?.params?.subCategoryName)
        }
    }

    checkForFilterParamsAvailability = () => {
        return new Promise((resolve, reject) => {
            if (this.props.route?.params?.subCategoryId >= 0 && this.props.route?.params?.subCategoryName) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    }

    initialCalls = () => {
        return new Promise((resolve, reject) => {
            this.props.fetchAllBuyAdRequests().then(() => {
                this.checkForFiltering()
            }).catch(error => reject(error));
        })
    }

    checkForSendingMessage = (item) => {

    };

    hideDialog = () => this.setState({ showDialog: false });

    setSelectedButton = id => this.setState({ selectedButton: id });

    setPromotionModalVisiblity = shouldShow => this.setState({ showDialog: shouldShow });

    openChat = (event, item) => {
        let { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        event.preventDefault();
        event.stopPropagation();
        if (!item.is_golden || (item.is_golden && active_pakage_type > 0)) {
            this.setState({ selectedButton: item.id })
            this.props.isUserAllowedToSendMessage(item.id).then(() => {
                if (this.props.isUserAllowedToSendMessagePermission.permission) {
                    if (!item.is_golden && item.id) {
                        analytics().logEvent('chat_opened', {
                            buyAd_id: item.id
                        });
                    }
                    this.setState({
                        selectedBuyAdId: item.id,
                        selectedContact: {
                            contact_id: item.myuser_id,
                            first_name: item.first_name,
                            last_name: item.last_name,
                        }
                    }, _ => this.props.navigation.navigate('Chat', { buyAdId: this.state.selectedBuyAdId, contact: this.state.selectedContact }));
                }
                else {
                    analytics().logEvent('permission_denied', {
                        golden: false
                    });
                    this.setState({ showDialog: true })
                }
            })
            // .catch(_ => this.setState({ showModal: true }));
        }
        else {
            analytics().logEvent('permission_denied', {
                golden: true
            });
            this.setState({ showGoldenModal: true });
        }
    };

    openMobileNumberWarnModal = (shouldShow, msg) => {
        this.setState({ showMobileNumberWarnModal: shouldShow, accessToContactInfoErrorMessage: msg });
    };


    renderItemSeparatorComponent = index => {

        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller = true
        } = user_info;

        if ((index + 1) % 9 != 0 || index == 0)
            return null;
        return (
            <ImageBackground
                source={require('../../../assets/images/pattern2.png')}
                style={styles.image}
            >
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
                    style={{
                        width: deviceWidth, alignSelf: 'center',
                        justifyContent: 'space-between',
                        padding: 15, overflow: 'hidden', height: 200
                    }}
                    colors={['#060446', '#21AD93']}
                >
                    <View
                        style={{
                            backgroundColor: 'rgba(140,166,236,0.8)',
                            width: 120,
                            position: 'absolute',
                            height: 120,
                            borderRadius: 60,
                            top: -60,
                            left: 40,
                            zIndex: 2
                        }}
                    >
                    </View>

                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="157"
                        style={{ position: 'absolute', zIndex: 1, top: 30 }}
                        height="157"
                        viewBox="0 0 127 127"
                    >

                        <G data-name="Group 321" transform="translate(-7 -379.064)">
                            <G filter="url(#Ellipse_52)" transform="translate(7 379.06)">
                                <SvgCircle
                                    cx="60.5"
                                    cy="60.5"
                                    r="60.5"
                                    fill="#feffff"
                                    data-name="Ellipse 52"
                                    transform="translate(3)"
                                ></SvgCircle>
                            </G>
                            <SvgImage
                                width="98"
                                height="98"
                                data-name="Image 7"
                                opacity="0.65"
                                transform="translate(30 393.064)"
                                xlinkHref="data:image/png;base64,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"
                            ></SvgImage>
                        </G>
                    </Svg>

                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: 'white',
                            textAlignVertical: 'top',
                            zIndex: 3
                        }}
                    >
                        {locales('titles.didNotFindBuyAd')}
                    </Text>
                    <Text
                        style={{
                            fontSize: 19,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: 'white',
                            textAlignVertical: 'top',
                            zIndex: 3
                        }}
                    >
                        {locales('titles.registerNewTestProduct')}
                    </Text>

                    <Button
                        style={{
                            backgroundColor: '#1DA1F2', borderRadius: 5,
                            width: deviceWidth * 0.6, flexDirection: 'row-reverse',
                            justifyContent: 'space-around', alignItems: 'center',
                            alignSelf: 'flex-end', padding: 10
                        }}
                        onPress={_ => this.props.navigation.navigate(is_seller ? 'RegisterProductStack' : 'RegisterRequest')}
                    >
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: 'white'
                        }}
                        >
                            {is_seller ? locales('titles.registerNewProduct') : locales('titles.registerBuyAdRequest')}
                        </Text>
                        <FontAwesome5
                            name='arrow-left'
                            color='white'
                            size={25}
                        />
                    </Button>
                    <View
                        style={{
                            backgroundColor: 'rgba(0,156,131,0.8)',
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            zIndex: 2,
                            position: 'absolute',
                            left: -60,
                            bottom: -60
                        }}
                    >
                    </View>
                </LinearGradient>
            </ImageBackground>
        )
    };


    renderItem = ({ item, index, separators }) => {

        const { selectedButton, buyAdRequestsList } = this.state;
        const { isUserAllowedToSendMessageLoading, userProfile = {} } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller
        } = user_info;


        return (
            <>
                <BuyAdList
                    item={item}
                    setSelectedButton={this.setSelectedButton}
                    openChat={this.openChat}
                    setPromotionModalVisiblity={this.setPromotionModalVisiblity}
                    selectedButton={selectedButton}
                    isUserAllowedToSendMessageLoading={isUserAllowedToSendMessageLoading}
                    index={index}
                    openMobileNumberWarnModal={this.openMobileNumberWarnModal}
                    buyAdRequestsList={buyAdRequestsList}
                    separators={separators}
                />
                {is_seller && this.renderItemSeparatorComponent(index)}
            </>
        )
    }

    closeModal = _ => {
        this.setState({ showModal: false });
        this.componentDidMount()
    }

    closeFilters = _ => {
        this.setState({ showFilters: false }, () => {
            if (this.props.requestsRef && this.props.requestsRef != null && this.props.requestsRef != undefined &&
                this.props.requestsRef.current && this.props.requestsRef.current != null &&
                this.props.requestsRef.current != undefined && this.state.buyAdRequestsList && this.state.buyAdRequestsList.length > 0 && !this.props.buyAdRequestLoading)
                setTimeout(() => {
                    this.props.requestsRef?.current.scrollToIndex({ animated: true, index: 0 });
                }, 300);
        })
    };

    selectedFilter = (id, name) => {
        analytics().logEvent('buyAd_filter', {
            category: name
        })
        this.setState({
            buyAdRequestsList: this.props.buyAdRequestsList.filter(item => item.category_id == id),
            selectedFilterName: name,
        })
    };


    render() {

        let {
            buyAdRequestLoading,
            userProfile = {} } = this.props;

        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        let { selectedContact,
            buyAdRequestsList,
            selectedButton, showDialog, selectedBuyAdId, from, to, accessToContactInfoErrorMessage,
            showFilters, selectedFilterName, showGoldenModal, showMobileNumberWarnModal } = this.state;
        return (
            <>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                <RBSheet
                    ref={this.updateFlag}
                    closeOnDragDown
                    closeOnPressMask
                    height={300}
                    animationType='slide'
                    customStyles={{
                        draggableIcon: {
                            backgroundColor: "#000"
                        },
                        container: {
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            backgroundColor: '#FAFAFA'
                        }
                    }}
                >

                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}
                    >
                        <Text style={{ textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: 'black' }}>
                            {locales('titles.buyadRequestsWith')} <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#E41C38' }}>{locales('titles.twoHoursDelay')}</Text> {locales('titles.youWillBeInformed')} .
                                </Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: 'black' }}>
                            {locales('titles.onTimeBuyAdRequestAndPromote')}
                        </Text>
                        <Button
                            onPress={() => {
                                this.updateFlag.current.close();
                                this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' })
                            }}
                            style={{ borderRadius: 5, backgroundColor: '#00C569', alignSelf: 'center', margin: 10, width: deviceWidth * 0.3 }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>{locales('titles.promoteRegistration')}</Text>
                        </Button>
                    </View>
                </RBSheet>





                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showMobileNumberWarnModal}
                        onDismiss={_ => this.openMobileNumberWarnModal(false)}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={_ => this.openMobileNumberWarnModal(false)}
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
                                    this.openMobileNumberWarnModal(false);
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
                                onPress={_ => this.openMobileNumberWarnModal(false)}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >






                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showDialog}
                        onDismiss={this.hideDialog}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={this.hideDialog}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.buyRequests')}
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
                                {locales('titles.maximumBuyAdResponse')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('titles.icreaseYouRegisterRequstCapacity')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('MyBuskool', { screen: 'ExtraBuyAdCapacity' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.increaseCapacity')}
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
                                onPress={this.hideDialog}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >





                < Portal
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
                                style={[styles.modalButton, styles.greenButton]}
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
                        onPress={() => {
                            this.updateFlag.current.close(); this.props.navigation.goBack()
                        }}
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
                            {locales('labels.buyRequests')}
                        </Text>
                    </View>
                </View>



                {/* {userInfo.active_pakage_type == 0 && <View style={{
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 10, marginHorizontal: 10,
                    backgroundColor: 'white', borderRadius: 6, padding: 6, alignItems: 'center',
                    flexDirection: 'row-reverse', justifyContent: 'space-around', marginTop: 5
                }}
                >
                    <Text style={{ color: '#666666' }}>{locales('titles.requestTooOld')}</Text>
                    <Button
                        small
                        onPress={() => this.updateFlag.current.open()}
                        style={{ backgroundColor: '#E41C38', width: '30%', borderRadius: 6 }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}> {locales('titles.update')}</Text>
                    </Button>
                </View>} */}


                {selectedFilterName ? <View style={{
                    backgroundColor: '#f6f6f6',
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-around',
                    position: 'relative'
                }}
                >
                    <Button
                        small
                        onPress={() => this.setState({
                            buyAdRequestsList: this.props.buyAdRequestsList,
                            selectedFilterName: ''
                        })}
                        style={{
                            borderWidth: 1,
                            borderColor: '#E41C38',
                            borderRadius: 50,
                            maxWidth: 250,
                            backgroundColor: '#fff',
                            height: 35,
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            width: '100%',
                            color: '#777',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17
                        }}>
                            {locales('titles.selectedBuyAdFilter', { fieldName: selectedFilterName })}
                            {/* {selectedFilterName} */}
                        </Text>
                        <FontAwesome5 color="#E41C38" name="times" solid style={{
                            fontSize: 18,
                            position: 'absolute',
                            right: 20,
                        }} />

                    </Button>
                </View> : null}
                <View>
                    {/* 
                <Button
                            style={{
                                flex: 2,
                                justifyContent: 'center',
                                backgroundColor: '#e51c38',
                                marginRight: 15,
                                borderRadius: 4
                            }}
                            onPress={() => this.setState({ buyAdRequestsList: this.props.buyAdRequestsList })}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#fff',
                            }}>
                                {locales('labels.deleteFilter')}
                            </Text>
                        </Button> */}
                </View>
                <SafeAreaView
                    // style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.783) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                    style={{ height: '100%', paddingBottom: 60, backgroundColor: 'white' }}
                >
                    {showFilters ? <Filters
                        selectedFilter={this.selectedFilter}
                        closeFilters={this.closeFilters}
                        showFilters={showFilters}
                    /> : null}
                    <FlatList
                        ref={this.props.requestsRef}
                        refreshing={false}
                        onRefresh={() => {
                            this.props.fetchAllBuyAdRequests().then(result => {
                                this.setState({ buyAdRequestsList: result.payload.buyAds })
                            });
                        }}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        ListEmptyComponent={() => !!buyAdRequestLoading ?
                            [1, 2, 3, 4, 5].map((_, index) =>
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: '#fff',
                                        paddingTop: 25,
                                        paddingBottom: 10,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#ddd'
                                    }}>
                                    <ContentLoader
                                        speed={2}
                                        width={deviceWidth}
                                        height={deviceHeight * 0.24}
                                        viewBox="0 0 340 160"
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                    >
                                        <Rect x="50" y="37" rx="3" ry="3" width="242" height="20" />
                                        <Rect x="85" y="3" rx="3" ry="3" width="169" height="20" />
                                        <Rect x="22" y="119" rx="3" ry="3" width="299" height="30" />
                                        <Rect x="116" y="74" rx="3" ry="3" width="105" height="20" />
                                    </ContentLoader>
                                </View>)
                            : <View style={{
                                alignSelf: 'center', justifyContent: 'center',
                                alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.9, height: deviceHeight * 0.7
                            }}>
                                <Entypo name='list' size={80} color='#BEBEBE' />
                                <Text style={{ textAlign: 'center', color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noBuyAdFound')}</Text>
                            </View>
                        }
                        data={buyAdRequestsList}
                        extraData={this.state}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem}
                        windowSize={10}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        style={{
                            // paddingHorizontal: 15,
                            marginBottom: selectedFilterName ? 92 : 45
                        }} />

                    <View style={{
                        position: 'absolute',
                        zIndex: 1,
                        bottom: selectedFilterName ? 92 : 45,
                        width: '100%',
                        righ: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 7,
                        elevation: 5
                    }}>
                        <Button
                            style={{
                                flex: 3,
                                justifyContent: 'center',
                                backgroundColor: '#556080',
                                borderRadius: 4
                            }}
                            onPress={() => this.setState({ showFilters: true })}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#fff',
                                flexDirection: 'row',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium'
                            }}>
                                {locales('titles.categories')}
                            </Text>
                            <FontAwesome5 name="filter" solid color="#fff" style={{
                                marginHorizontal: 5
                            }} />

                        </Button>

                    </View>


                </SafeAreaView>
            </>
        )
    }
}



const styles = StyleSheet.create({
    image: {
        resizeMode: "cover",
        width: deviceWidth,
    },
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
        width: '80%',
        textAlign: 'center'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    closeButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#777777',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
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
    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
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
        textAlign: 'right',
        color: '#7E7E7E'
    }
});



const mapStateToProps = (state) => {
    return {
        buyAdRequestLoading: state.buyAdRequestReducer.buyAdRequestLoading,
        buyAdRequestsList: state.buyAdRequestReducer.buyAdRequestList,
        buyAdRequests: state.buyAdRequestReducer.buyAdRequest,
        userProfile: state.profileReducer.userProfile,
        isUserAllowedToSendMessage: state.profileReducer.isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission: state.profileReducer.isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading: state.profileReducer.isUserAllowedToSendMessageLoading,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: () => dispatch(buyAdRequestActions.fetchAllBuyAdRequests()),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        fetchAllDashboardData: _ => dispatch(homeActions.fetchAllDashboardData()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
        setSubCategoryIdFromRegisterProduct: (id, name) => dispatch(productActions.setSubCategoryIdFromRegisterProduct(id, name))
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Requests {...props} requestsRef={ref} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);