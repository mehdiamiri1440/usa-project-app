import React, { PureComponent, createRef } from 'react';
import { Text, View, SafeAreaView, Modal, FlatList, StyleSheet, Image, ImageBackground, Pressable } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Icon, InputGroup, Input, Button } from 'native-base';
import RBSheet from "react-native-raw-bottom-sheet";
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import Jmoment from 'moment-jalaali';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect } from "react-content-loader/native"
import AsyncStorage from '@react-native-community/async-storage';

import { deviceWidth, deviceHeight, enumHelper } from '../../utils';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productActions from '../../redux/registerProduct/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import LinearGradient from 'react-native-linear-gradient';

import Entypo from 'react-native-vector-icons/dist/Entypo';

import BuyAdList from './BuyAdList';
import Filters from './Filters';
import Header from '../../components/header';
import ENUMS from '../../enums';

Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });

let myTimeout;

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
            selectedFilterName: '',
            selectedFilterId: null,

            showMobileNumberWarnModal: false,
            accessToContactInfoErrorMessage: '',
            statusCode: null,

            buyAdRequestsList: [],
            searchText: null,
            sortModalFlag: false,
            sort_by: ENUMS.SORT_LIST.values.BM,
        }
    }

    serachInputRef = createRef();

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
        }
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

    componentWillUnmount() {
        this.is_mounted = false;
        this.updateFlag.current.close()
    }

    initialCalls = () => {
        return new Promise((resolve, reject) => {
            this.props.fetchAllBuyAdRequests().then(() => {
                this.checkForFiltering()
            }).catch(error => reject(error));
        })
    };

    checkForFiltering = async () => {
        let isFilter = await this.checkForFilterParamsAvailability();
        if (isFilter) {
            this.selectedFilter(this.props.route?.params?.subCategoryId, this.props.route?.params?.subCategoryName)
        }
    };

    checkForFilterParamsAvailability = () => {
        return new Promise((resolve, reject) => {
            if (this.props.route?.params?.subCategoryId >= 0 && this.props.route?.params?.subCategoryName) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    };

    hideDialog = () => this.setState({ showDialog: false });

    setSelectedButton = id => this.setState({ selectedButton: id });

    setPromotionModalVisiblity = shouldShow => this.setState({ showGoldenModal: shouldShow });

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
                    }, _ => this.props.navigation.navigate('RequestsStack', {
                        screen: "Chat",
                        params: {
                            shouldHideGuidAndComment: true,
                            buyAdId: this.state.selectedBuyAdId,
                            contact: this.state.selectedContact
                        }
                    }));
                }
                else {
                    analytics().logEvent('permission_denied', {
                        golden: false
                    });
                    this.setState({ showDialog: true })
                }
            })
        }
        else {
            analytics().logEvent('permission_denied', {
                golden: true
            });
            this.setState({ showGoldenModal: true });
        }
    };

    openMobileNumberWarnModal = (shouldShow, msg, statusCode) => {
        this.setState({ showMobileNumberWarnModal: shouldShow, accessToContactInfoErrorMessage: msg, statusCode });
    };

    onRefresh = () => {
        this.props.fetchAllBuyAdRequests().then(result => {
            this.setState({ buyAdRequestsList: result.payload.buyAds }, _ => {
                const {
                    selectedFilterId,
                    selectedFilterName,
                    sort_by,
                    searchText
                } = this.state;

                if (searchText)
                    this.handleSearch(searchText);

                else if (selectedFilterName && selectedFilterId)
                    this.selectedFilter(selectedFilterId, selectedFilterName);

                this.handleSortItemClick(sort_by);
            })
        });
    };

    scrollToTop = _ => {
        clearTimeout(myTimeout);
        if (this.props.requestsRef && this.props.requestsRef != null && this.props.requestsRef != undefined &&
            this.props.requestsRef.current && this.props.requestsRef.current != null &&
            this.props.buyAdRequestsList && this.props.buyAdRequestsList.length &&
            this.props.requestsRef.current != undefined && this.state.buyAdRequestsList &&
            this.state.buyAdRequestsList.length > 0 && !this.props.buyAdRequestLoading) {
            myTimeout = setTimeout(() => {
                this.props.requestsRef?.current?.scrollToIndex({ animated: true, index: 0 });
            }, 300);
        }
    };

    onScrollToIndexFailed = (error = {}) => {
        const {
            averageItemLength,
            index
        } = error;

        console.log('scroll to index failed', error, 'avarage', averageItemLength, 'index', index);
        const offset = averageItemLength * index;

        this.props.requestsRef?.current?.scrollToOffset({ offset, animated: true });
        setTimeout(() => this.props.requestsRef?.current?.scrollToIndex({ index, animated: true }), 300);
    };

    closeFilters = _ => {
        this.setState({ showFilters: false }, () => this.scrollToTop());
    };

    selectedFilter = (id, name) => {
        const {
            buyAdRequestsList = []
        } = this.props;

        analytics().logEvent('buyAd_filter', {
            category: name
        })
        this.setState({
            selectedFilterName: name,
            selectedFilterId: id,
            searchText: ''
        }, _ => {
            this.setState({
                buyAdRequestsList: buyAdRequestsList &&
                    buyAdRequestsList.length ?
                    buyAdRequestsList.filter(item => item.category_id == id) : [],
            });
        });
    };

    handleSearch = (text) => {
        const {
            buyAdRequestsList = []
        } = this.props;

        let tempList = [...buyAdRequestsList];

        if (text && text.length)
            tempList = [...tempList.filter(item => item.subcategory_name.includes(text) || (!!item.name && item.name.includes(text)))];
        else
            tempList = [...buyAdRequestsList];

        this.setState({ selectedFilterName: '', searchText: text }, _ => {
            this.setState({
                buyAdRequestsList: [...tempList]
            }, _ => this.scrollToTop());
        });
    };

    handleSortItemClick = value => {
        const {
            buyAdRequestsList = []
        } = this.state;

        let tempList = [...buyAdRequestsList];

        if (!!value && value != 'BM') {
            tempList.forEach(item => item.date = new Date(item.created_at));
            tempList = tempList.sort((a, b) => b.date - a.date);
        }

        else {
            tempList = [...this.props.buyAdRequestsList];
        }
        this.setState({ sort_by: value, sortModalFlag: false, buyAdRequestsList: tempList }, _ => this.scrollToTop());
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

                    <Image
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                            position: 'absolute',
                            zIndex: 1,
                            top: 30
                        }}
                        source={require('../../../assets/images/photo_2021-04-14_16-12-18.jpg')}
                    />

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
    };

    renderListEmptyComponent = _ => {

        const {
            buyAdRequestLoading = false
        } = this.props;

        if (!!buyAdRequestLoading)
            return [1, 2, 3, 4, 5].map((_, index) =>
                <View
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                        paddingTop: 25,
                        flex: 1,
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
                </View>
            );

        return (
            <View style={{
                alignSelf: 'center', justifyContent: 'center',
                alignContent: 'center', alignItems: 'center',
                width: deviceWidth * 0.9, height: deviceHeight * 0.7
            }}>
                <Entypo name='list' size={80} color='#BEBEBE' />
                <Text style={{
                    textAlign: 'center', color: '#7E7E7E',
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 17, padding: 15, textAlign: 'center'
                }}
                >
                    {locales('titles.noBuyAdFound')}
                </Text>
            </View>
        )
    };

    renderSortListItem = ({ item }) => {
        const {
            sort_by,
        } = this.state;

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={_ => this.handleSortItemClick(item.value)}
                style={{
                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth,
                    color: '#e41c38'
                }}>
                {sort_by == item.value ?
                    <FontAwesome5 name='check' size={26} color='#00C569' />
                    :
                    <FontAwesome5 name='angle-left' size={26} color='#777' />
                }
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: sort_by == item.value ? '#00C569' : '#777'
                    }}
                >
                    {item.title}
                </Text>
            </Pressable>

        )
    };

    renderSortIcons = _ => {
        const {
            sort_by
        } = this.state;
        const {
            list,
            values
        } = ENUMS.SORT_LIST
        const {
            BM
        } = values;

        if (sort_by == BM)
            return (
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    onPress={() => this.setState({ sortModalFlag: true })}
                    style={{
                        borderRadius: 12,
                        marginTop: 7,
                        marginBottom: 8,
                        marginHorizontal: 5,
                        borderColor: '#EDEDED',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                        justifyContent: 'center',
                        maxWidth: 100,
                        backgroundColor: '#FFFFFF',
                        minHeight: 30
                    }}>
                    <FontAwesome5 name='sort-amount-down-alt' size={12} color='#707070' />
                    <Text
                        style={{
                            textAlign: 'center', textAlignVertical: 'center', fontSize: 15,
                            color: '#707070', marginRight: 2, fontFamily: 'IRANSansWeb(FaNum)_Medium'
                        }}
                    >
                        {locales('labels.sort')}
                    </Text>
                </Pressable>
            );
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                onPress={() => this.handleSortItemClick(BM)}
                style={{
                    borderRadius: 12,
                    marginTop: 7,
                    marginBottom: 8,
                    marginHorizontal: 5,
                    borderColor: '#FA8888',
                    borderWidth: 1,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: 120,
                    alignSelf: 'flex-end',
                    backgroundColor: '#FCF6F6',
                    minHeight: 30,
                    paddingHorizontal: 10
                }}>
                <FontAwesome5 name='sort-amount-down-alt' size={12} color='#E41C38' />
                <Text
                    style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 15,
                        paddingHorizontal: 3,
                        color: '#E41C38',
                        marginRight: 2,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {enumHelper.convertEnumValueToTitle(list, sort_by)}
                </Text>
                <FontAwesome5 name='times' size={12} color='#E41C38' />
            </Pressable>
        );
    };

    render() {

        let {
            buyAdRequestsList = [],
            showDialog,
            accessToContactInfoErrorMessage,
            showFilters,
            selectedFilterName,
            showGoldenModal,
            showMobileNumberWarnModal,
            statusCode,
            searchText,
            sortModalFlag
        } = this.state;
        return (
            <>

                {sortModalFlag ?
                    <Modal
                        animationType="slide"
                        visible={sortModalFlag}
                        onRequestClose={() => this.setState({ sortModalFlag: false })}>

                        <Header
                            title={locales('labels.sortBy')}
                            onBackButtonPressed={_ => this.setState({ sortModalFlag: false })}
                            {...this.props}
                        />

                        <FlatList
                            data={ENUMS.SORT_LIST.list.filter(item => item.value == 'RD' || item.value == 'BM')}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderSortListItem}
                        />
                    </Modal>
                    : null}

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
                            style={{
                                borderRadius: 5, backgroundColor: '#00C569',
                                alignSelf: 'center', margin: 10, width: deviceWidth * 0.3
                            }}
                        >
                            <Text style={{
                                color: 'white', textAlign: 'center', width: '100%',
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                            }}>{locales('titles.promoteRegistration')}</Text>
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
                        {statusCode == 423 ? <View style={{
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
                        </View> : null}




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
                                style={[styles.modalButton, styles.greenButton, { borderRadius: 8, elevation: 0 }]}
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

                <Header
                    title={locales('labels.buyRequests')}
                    onBackButtonPressed={() => {
                        this.updateFlag.current.close();
                        this.props.navigation.goBack()
                    }}
                    {...this.props}
                />

                <View
                    style={{ backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EDEDED' }}
                >
                    <InputGroup style={{ borderRadius: 5, backgroundColor: '#F2F2F2', paddingHorizontal: 10 }}>
                        <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        <Input
                            value={searchText}
                            ref={this.serachInputRef}
                            onChangeText={text => this.handleSearch(text)}
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                paddingBottom: 10, color: '#777', textAlignVertical: 'bottom'
                            }}
                            placeholderTextColor="#bebebe"
                            placeholder={locales('labels.searchBuyAdRequest')} />
                    </InputGroup>

                    <View
                        style={{
                            flexDirection: 'row-reverse'
                        }}
                    >
                        {this.renderSortIcons()}
                        {
                            selectedFilterName ?
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed',
                                        radius: 8
                                    }}
                                    onPress={() => this.setState({
                                        buyAdRequestsList: this.props.buyAdRequestsList,
                                        selectedFilterName: ''
                                    }, _ => this.scrollToTop())}
                                    style={{
                                        borderRadius: 12,
                                        marginTop: 7,
                                        marginBottom: 8,
                                        marginHorizontal: 5,
                                        borderColor: '#FA8888',
                                        borderWidth: 1,
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        maxWidth: 120,
                                        alignSelf: 'flex-end',
                                        backgroundColor: '#FCF6F6',
                                        minHeight: 30,
                                        paddingHorizontal: 10
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            textAlignVertical: 'center',
                                            fontSize: 15,
                                            color: '#E41C38',
                                            paddingLeft: 10,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                        }}
                                    >
                                        {selectedFilterName}
                                    </Text>
                                    <FontAwesome5 name='times' size={12} color='#E41C38' />
                                </Pressable>
                                :
                                null
                        }
                    </View>
                </View>


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
                        onRefresh={this.onRefresh}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        ListEmptyComponent={this.renderListEmptyComponent}
                        data={buyAdRequestsList}
                        extraData={this.state}
                        onScrollToIndexFailed={this.onScrollToIndexFailed}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem}
                        windowSize={10}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        style={{
                            marginBottom: selectedFilterName ? 140 : 136
                        }}
                    />

                    <View style={{
                        position: 'absolute',
                        zIndex: 1,
                        bottom: selectedFilterName ? 140 : 136,
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
};

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
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        fontSize: 16
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: () => dispatch(buyAdRequestActions.fetchAllBuyAdRequests()),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        fetchAllDashboardData: _ => dispatch(homeActions.fetchAllDashboardData()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
        setSubCategoryIdFromRegisterProduct: (id, name) => dispatch(productActions.setSubCategoryIdFromRegisterProduct(id, name))
    }
};

const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Requests {...props} requestsRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);