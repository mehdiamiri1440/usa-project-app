import React, { PureComponent, createRef } from 'react';
import { Text, View, Modal, FlatList, StyleSheet, Image, ImageBackground, Pressable } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import { deviceWidth, deviceHeight, enumHelper, dataGenerator } from '../../utils';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productActions from '../../redux/registerProduct/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';

import BuyAdList from './BuyAdList';
import Filters from './Filters';
import Header from '../../components/header';
import ENUMS from '../../enums';

Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });

let myTimeout, screenFocusedFlag;

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
            scrollOffset: 0,
            categoriesList: [],
            isFilterApplied: false,
            modals: []
        }
    }

    serachInputRef = createRef();

    requestsRef = React.createRef();
    updateFlag = React.createRef();
    categoryFiltersRef = createRef();

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

        screenFocusedFlag = this.props.navigation.addListener('focus', this.handleScreenFocused);

        this.is_mounted = true;
        if (this.is_mounted == true) {
            AsyncStorage.setItem('@registerProductParams', JSON.stringify({}))
            this.initialCalls()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.route && this.props.route.params &&
                this.props.route.params.needToRefreshKey &&
                (!prevProps.route || !prevProps.route.params))
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
        this.updateFlag.current.close();
        return screenFocusedFlag;
    }

    initialCalls = () => {
        return new Promise((resolve, reject) => {
            const {
                loggedInUserId
            } = this.props;
            this.props.fetchAllCategories()
                .then(result => this.setState({ categoriesList: result.payload.categories }));
            this.props.fetchAllBuyAdRequests(!!loggedInUserId).then(() => {
                this.checkForFiltering()
            }).catch(error => reject(error));
        })
    };

    handleScreenFocused = _ => {
        AsyncStorage.getItem('@isBuyAdRequestsFocuesd').then(result => {
            result = JSON.parse(result);
            if (result == true) {
                AsyncStorage.removeItem('@isBuyAdRequestsFocuesd');
                this.setState({
                    buyAdRequestsList: [],
                    selectedFilterId: null,
                    selectedFilterName: '',
                    sort_by: ENUMS.SORT_LIST.values.BM,
                    searchText: null
                });
                this.onRefresh();
            }
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

    setSelectedButton = id => {
        const {
            scrollOffset
        } = this.state;

        this.setState({ selectedButton: id });
        this.props.requestsRef?.current?.scrollToOffset({
            offset: scrollOffset + 100,
            animated: true
        });
    };

    setPromotionModalVisiblity = shouldShow => this.setState({ showGoldenModal: shouldShow });

    openChat = (event, item) => {
        let {
            userProfile = {},
            loggedInUserId
        } = this.props;

        const { user_info = {} } = userProfile;

        const { active_pakage_type } = user_info;


        event.preventDefault();
        event.stopPropagation();

        const selectedContact = {
            contact_id: item.myuser_id,
            first_name: item.first_name,
            last_name: item.last_name,
        };

        if (!!!loggedInUserId)
            return this.props.navigation.navigate('StartUp', { screen: 'SignUp', params: { isFromRequests: true } });

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
                        selectedContact
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
        const {
            loggedInUserId
        } = this.props
        this.props.fetchAllBuyAdRequests(!!loggedInUserId).then(result => {
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

        const offset = averageItemLength * index;

        this.props.requestsRef?.current?.scrollToOffset({ offset, animated: true });
        setTimeout(() => this.props.requestsRef?.current?.scrollToIndex({ index, animated: true }), 300);
    };

    closeFilters = _ => {
        this.setState({ showFilters: false }, _ => setTimeout(() => this.scrollToTop(), 300));
    };

    selectedFilter = (id, name) => {
        const {
            buyAdRequestsList = []
        } = this.props;

        if (!id || !name)
            return this.setState({ buyAdRequestsList });

        analytics().logEvent('buyAd_filter', {
            category: name
        })
        this.setState({
            selectedFilterName: name,
            selectedFilterId: id,
            searchText: name,
            modals: [],
            isFilterApplied: true,
            totalCategoriesModalFlag: false,
            subCategoriesModalFlag: false
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

        this.setState({
            selectedFilterName: '',
            selectedFilterId: '',
            searchText: text,
            isFilterApplied: false
        }, _ => {
            this.setState({
                buyAdRequestsList: [...tempList],
                isFilterApplied: false
            }, _ => this.scrollToTop());
        });
    };

    handleSortItemClick = value => {
        const {
            buyAdRequestsList = [],
            selectedFilterId,
            searchText
        } = this.state;

        let tempList = [...buyAdRequestsList];

        if (!!value && value != 'BM') {
            tempList.forEach(item => item.date = new Date(item.created_at));
            tempList = tempList.sort((a, b) => b.date - a.date);
        }

        else {
            tempList = [...this.props.buyAdRequestsList];
        }

        if (selectedFilterId) {
            tempList = tempList.filter(item => item.category_id == selectedFilterId);
        }

        if (searchText)
            tempList = [...tempList.filter(item => item.subcategory_name.includes(searchText) || (!!item.name && item.name.includes(searchText)))];

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
        } = user_info;

        if ((index + 1) % 9 != 0 || index == 0)
            return null;

        return (
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0.2 }}
                style={{
                    width: '95%',
                    borderRadius: 6,
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    padding: 15,
                    overflow: 'hidden',
                    height: 200
                }}
                colors={['#44A08D', '#093637']}
            >
                <View
                    style={{
                        backgroundColor: 'transparent',
                        width: 130,
                        height: 110,
                        borderWidth: 9,
                        borderBottomLeftRadius: 100,
                        borderBottomRightRadius: 100,
                        borderColor: 'rgba(196, 196, 196, 0.5)',
                        position: 'absolute',
                        right: -10,
                        top: -80,
                        overflow: 'hidden'
                    }}
                >
                </View>
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: 'white',
                    }}
                >
                    {locales('labels.CouldNotFindSellerYet')}
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'IRANSansWeb(FaNum)',
                        color: 'white',
                    }}
                >
                    {locales('labels.registerProductToAccessBuyerListMadeForYou')}
                </Text>
                <Button
                    onPress={_ => this.props.navigation.navigate('RegisterProductStack')}
                    style={{
                        backgroundColor: 'white',
                        elevation: 0,
                        borderRadius: 6,
                        width: '70%',
                        marginRight: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'flex-end'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)',
                            color: '#FF6600',
                        }}
                    >
                        {locales('labels.registerProductAndFindBuyer')}
                    </Text>
                </Button>
                <View
                    style={{
                        backgroundColor: 'transparent',
                        width: 140,
                        height: 150,
                        borderWidth: 9,
                        borderTopRightRadius: 100,
                        borderBottomRightRadius: 30,
                        borderColor: 'rgba(196, 196, 196, 0.5)',
                        position: 'absolute',
                        left: -40,
                        bottom: -60,
                        overflow: 'hidden'
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            width: 100,
                            height: 90,
                            top: 6,
                            borderWidth: 6,
                            borderTopRightRadius: 100,
                            borderBottomRightRadius: 10,
                            borderColor: 'rgba(196, 196, 196, 0.5)',
                            overflow: 'hidden'
                        }}
                    >
                    </View>
                </View>
            </LinearGradient>
        )
    };

    renderItem = ({ item, index, separators }) => {

        const {
            selectedButton,
            buyAdRequestsList
        } = this.state;
        const {
            isUserAllowedToSendMessageLoading,
            userProfile = {},
            loggedInUserId
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller,
            active_pakage_type
        } = user_info;


        return (
            <>
                {index == 3 && is_seller && active_pakage_type == 0 ?
                    <View
                        style={{
                            width: '98%',
                            backgroundColor: '#FFC985',
                            borderRadius: 4,
                            overflow: 'hidden',
                            padding: 10,
                            height: 160,
                            alignSelf: 'center'
                        }}
                    >
                        <Image
                            source={require('../../../assets/icons/wave-3.png')}
                            style={{
                                right: 0,
                                bottom: -20,
                                width: '59%',
                                position: 'absolute',
                            }}
                        />
                        <Text
                            style={{
                                color: '#004F46',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                right: '22%'
                            }}
                        >
                            {locales('labels.becomeBuskoolSpecialUser')}
                        </Text>
                        <Text
                            style={{
                                color: '#004F46',
                                fontFamily: 'IRANSansWeb(FaNum)',
                                fontSize: 14,
                                right: '20%',
                                marginTop: 5,
                                width: '78%',
                                marginRight: 10,
                                alignSelf: 'flex-end',
                            }}
                        >
                            {locales('labels.promoteYourAccountToAccessPhoneAndBuyers')}
                        </Text>
                        <Button
                            onPress={_ => this.props.navigation.navigate('PromoteRegistration')}
                            style={{
                                backgroundColor: "#128C7E",
                                elevation: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 6,
                                position: 'absolute',
                                bottom: 20,
                                left: 5,
                                width: '50%'
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                    fontSize: 16,
                                }}
                            >
                                {locales('titles.promoteRegistration')}
                            </Text>
                        </Button>
                    </View>
                    :
                    null
                }
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
                    loggedInUserId={loggedInUserId}
                />
                {is_seller ? this.renderItemSeparatorComponent(index) : null}
            </>
        )
    };

    renderListEmptyComponent = _ => {

        const {
            buyAdRequestLoading = false
        } = this.props;

        const {
            searchText,
            selectedFilterName
        } = this.state;

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
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: deviceWidth,
                    marginTop: 30
                }}>
                <Image
                    style={{
                        width: deviceWidth * 0.4,
                        height: deviceWidth * 0.4
                    }}
                    source={require('../../../assets/images/magnifire-empty.png')}
                />
                <Text
                    style={{
                        color: 'black',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 16,
                        textAlign: 'center',
                        marginTop: 10
                    }}
                >
                    {
                        selectedFilterName ?
                            locales('labels.noBuyerFound')
                            : searchText && searchText.length
                                ? <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        marginTop: 10
                                    }}
                                >
                                    {locales('labels.noCaseFor')}<Text
                                        style={{
                                            color: '#0097C1',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            marginTop: 10
                                        }}
                                    >
                                        {` ${searchText} `}
                                    </Text><Text
                                        style={{
                                            color: 'black',
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            marginTop: 10
                                        }}
                                    >
                                        {locales('labels.nothingFoundFor')}
                                    </Text>
                                </Text>
                                : locales('labels.noBuyerFound')
                    }
                </Text>
                {selectedFilterName || (!selectedFilterName && !searchText) ? <Text
                    style={{
                        color: 'black',
                        fontFamily: 'IRANSansWeb(FaNum)',
                        fontSize: 14,
                        textAlign: 'center',
                        marginTop: 20,
                        width: '75%'
                    }}
                >
                    {locales('titles.registerProductIfYouHaveThisProductForSale')}
                </Text>
                    : null
                }
                <Button
                    onPress={_ => this.props.navigation.navigate('RegisterProductStack', { screen: 'RegisterProduct' })}
                    style={{
                        alignSelf: "center",
                        width: '50%',
                        borderRadius: 10,
                        backgroundColor: "#FF9828",
                        elevation: 0,
                        marginTop: 20
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <FontAwesome5
                            name='plus'
                            size={14}
                            color='white'
                        />
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                textAlign: 'center',
                                marginRight: 5
                            }}
                        >
                            {locales('labels.registerProduct')}
                        </Text>
                    </View>
                </Button>
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
                        color: '#ededed',
                        radius: 12
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
                        justifyContent: 'center',
                        minWidth: 100,
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
                    borderColor: '#F03738',
                    borderWidth: 1,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: 120,
                    alignSelf: 'flex-end',
                    backgroundColor: 'rgba(240, 55, 56, 0.35)',
                    minHeight: 30,
                    paddingHorizontal: 10
                }}>
                <FontAwesome5 name='sort-amount-down-alt' size={12} color='#F24E1E' />
                <Text
                    style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 16,
                        paddingHorizontal: 3,
                        color: 'black',
                        marginRight: 2,
                        fontFamily: 'IRANSansWeb(FaNum)'
                    }}
                >
                    {enumHelper.convertEnumValueToTitle(list, sort_by)}
                </Text>
                <FontAwesome5 name='times' size={12} color='#F24E1E' />
            </Pressable>
        );
    };


    renderAllCategoriesIcon = _ => {

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed',
                    radius: 12
                }}
                onPress={() => this.setState({ showFilters: true })}
                style={{
                    borderRadius: 12,
                    marginTop: 7,
                    marginBottom: 8,
                    borderColor: '#EDEDED',
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FAFAFA',
                    minHeight: 30,
                    paddingHorizontal: 15,
                    marginHorizontal: 5
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 15,
                        color: '#707070',
                        marginRight: 2,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {locales('labels.classifications')}
                </Text>
                <FontAwesome5
                    name='list'
                    size={12}
                    color='#707070'
                />
            </Pressable>
        )
    };

    sortProducts = ({ id, category_name, subcategories: subCategoriesList = {}, ...rest }) => {
        subCategoriesList = Object.values(subCategoriesList);

        let modals = [...this.state.modals];
        modals.push({
            id: dataGenerator.generateKey(`modal_${id}_`),
            category_name,
            subCategoriesList,
            ...rest
        })
        this.setState({ subCategoriesModalFlag: true, subCategoriesList, modals }, _ => {
            if (!this.state.subCategoriesList.length)
                this.handleSubCategoryItemClick({ id, category_name, subcategories: [], ...rest })
        })
    };


    renderCategoriesListItem = (item, isFromModal) => {
        if (!isFromModal)
            return (
                <Pressable
                    android_ripple={{
                        color: '#ededed',
                        radius: 12
                    }}
                    onPress={() => this.sortProducts(item)}
                    style={{
                        borderRadius: 12,
                        marginHorizontal: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#EDEDED',
                        backgroundColor: '#FFFFFF',
                        minHeight: 30,
                        paddingHorizontal: 15,
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            color: '#707070',
                            fontSize: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                        }}
                    >
                        {item.category_name}
                    </Text>
                </Pressable>
            );

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={() => this.sortProducts(item)}
                style={{
                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                }}>
                <FontAwesome5 name='angle-left' size={26} color='#777' />
                <Text
                    style={{
                        fontSize: 18,
                        color: '#777',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {item.category_name}
                </Text>
            </Pressable>
        )
    };


    removeFilter = _ => {

        this.setState({ isFilterApplied: false, searchText: null, productsListArray: [] }, _ => {
            const {
                province,
                city,
                sort_by,
                selectedFilterId,
                selectedFilterName
            } = this.state;

            let searchItem = {
                from_record_number: 0,
                sort_by,
                to_record_number: 16,
            };

            if (province) {
                searchItem = { ...searchItem, province_id: province }
            }
            if (city) {
                searchItem = { ...searchItem, city_id: city }
            }
            this.selectedFilter();
        });

    };

    renderFilterHeaderComponent = _ => {

        const {
            isFilterApplied,
            searchText,
        } = this.state;

        return (

            <View
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // bottom: 5
                }}
            >
                {this.renderSortIcons()}

                {isFilterApplied ?
                    <Pressable
                        android_ripple={{
                            color: '#ededed',
                            radius: 12
                        }}
                        onPress={() => this.removeFilter()}
                        style={{
                            borderRadius: 12,
                            marginHorizontal: 5,
                            borderColor: '#F03738',
                            borderWidth: 1,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(240, 55, 56, 0.35)',
                            minHeight: 30,
                            paddingVertical: 1,
                            paddingHorizontal: 15
                        }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontSize: 16,
                                paddingLeft: 10,
                                color: 'black',
                                fontFamily: 'IRANSansWeb(FaNum)',
                            }}
                        >
                            {searchText}
                        </Text>
                        <FontAwesome5 name='times' size={12} color='#F24E1E' />
                    </Pressable>
                    :
                    null}
            </View>

        )
    };

    renderCategoriesFilterListEmptyComponent = _ => {
        const {
            isFilterApplied,
            searchText
        } = this.state;

        if (isFilterApplied && searchText && searchText.length)
            return null;
        return (

            <View
                style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <ContentLoader
                        key={index}
                        speed={2}
                        style={{
                            marginHorizontal: 5,
                            borderRadius: 12,
                            width: deviceWidth * 0.2,
                            borderWidth: 1,
                            height: 30,
                        }}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <Rect
                            x="0" y="0" width="100%" rx={10} ry={10} height="100%"
                        />
                    </ContentLoader>
                )
                )}
            </View>
        )

    };

    omitItemFromModals = category_name => {
        let modals = [...this.state.modals];
        const foundIndex = this.state.modals.findIndex(item => item.category_name == category_name);
        modals.splice(foundIndex, 1);
        this.setState({ modals });
    };

    handleSubCategoryItemClick = item => {
        const {
            sort_by,
            province,
            city,
            subCategoriesList = [],
        } = this.state;

        analytics().logEvent('apply_sort', {
            sort_type: item.name
        });

        if (!subCategoriesList.length) {
            this.setState({
                searchText: item.category_name,
                productsListArray: [],
                modals: [],
                isFilterApplied: true,
                totalCategoriesModalFlag: false,
                subCategoriesModalFlag: false
            }, () => {
                let searchItem = {
                    from_record_number: 0,
                    sort_by,
                    search_text: item.category_name,
                    to_record_number: 16,
                };
                if (province) {
                    searchItem = { ...searchItem, province_id: province }
                }
                if (city) {
                    searchItem = { ...searchItem, city_id: city }
                }

                this.categoryFiltersRef?.current.scrollToOffset({ animated: true, offset: 0 });

                this.selectedFilter(item.id, item.category_name);
            });
        }
        else {
            this.sortProducts(item)
        }
    };


    renderSubCategoriesListItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={_ => this.handleSubCategoryItemClick(item)}
                style={{
                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                }}>
                <FontAwesome5 name='angle-left' size={26} color='#777' />
                <Text
                    style={{
                        fontSize: 18,
                        color: '#777',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {item.category_name}
                </Text>
            </Pressable>
        )
    };

    renderSubCategoriesListEmptyComponent = _ => {
        const {
            subCategoriesLoading
        } = this.props;

        if (!subCategoriesLoading)
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        height: deviceHeight * 0.7,
                    }}
                >
                    <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                    <Text
                        style={{
                            color: '#7E7E7E',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17,
                            padding: 15,
                            textAlign: 'center'
                        }}
                    >
                        {locales('labels.emptyList')}</Text>
                </View>
            );

        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <View
                        key={index}
                        style={{
                            padding: 20,
                            flex: 1,
                            width: '100%',
                            height: deviceHeight * 0.1,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomWidth: 0.7,
                            borderBottomColor: '#BEBEBE',

                        }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={'100%'}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"

                        >
                            <Rect x="75%" y="20%" width="120" height="10" />
                        </ContentLoader>
                        <FontAwesome5 name='angle-left' size={26} color='#777' />
                    </View>
                )
                )}
            </View>
        )
    };

    renderModalItem = ({ item }) => {
        const
            {
                category_name,
                subCategoriesList
            } = item;

        const {
            modals = []
        } = this.state;

        return (
            <Modal
                animationType="fade"
                visible={modals.findIndex(item => item.category_name == category_name) > -1}
                onRequestClose={_ => this.omitItemFromModals(category_name)}
            >
                <Header
                    title={category_name}
                    onBackButtonPressed={_ => this.omitItemFromModals(category_name)}
                    {...this.props}
                />

                <FlatList
                    ListEmptyComponent={this.renderSubCategoriesListEmptyComponent}
                    data={subCategoriesList}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={this.renderSubCategoriesListItem}
                />
            </Modal >

        )
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
            sortModalFlag,
            isFilterApplied,
            categoriesList,
            modals
        } = this.state;

        const {
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            active_pakage_type
        } = user_info;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >
                {modals.length ?
                    <FlatList
                        data={modals}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderModalItem}
                    />
                    :
                    null}

                {sortModalFlag ?
                    <Modal
                        animationType="fade"
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
                    animationType='fade'
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
                                this.props.navigation.navigate('PromoteRegistration')
                            }}
                            style={{
                                borderRadius: 5, backgroundColor: '#FF9828',
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
                        style={{ ...styles.dialogWrapper, height: '52%' }}
                    >
                        <Dialog.Actions
                            style={{
                                alignSelf: 'flex-end',
                                paddingRight: 15,
                                paddingTop: 15
                            }}
                        >
                            <AntDesign
                                onPress={_ => this.openMobileNumberWarnModal(false)}
                                name="close"
                                color="#264653"
                                solid
                                size={22}
                            />
                        </Dialog.Actions>


                        <Image
                            source={require('../../../assets/icons/Connectivity.png')}
                            style={{
                                alignSelf: 'center',
                                top: -30
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                color: '#15313C',
                                top: -30

                            }]}>
                                {locales('titles.canNotAccessBuyersNumbers')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 13,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%',
                                top: -35
                            }}>
                                {accessToContactInfoErrorMessage}
                            </Text>

                        </Dialog.Actions>
                        {/* <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {accessToContactInfoErrorMessage}
                        </Paragraph> */}
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, { width: '80%', top: -35, marginBottom: 30 }]}
                                onPress={() => {
                                    this.openMobileNumberWarnModal(false);
                                    this.props.navigation.navigate('PromoteRegistration');
                                }}
                            >

                                <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                styles.buttonText]}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>
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
                        style={{ ...styles.dialogWrapper, height: '52%' }}
                    >
                        <Dialog.Actions
                            style={{
                                alignSelf: 'flex-end',
                                paddingRight: 15,
                                paddingTop: 15
                            }}
                        >
                            <AntDesign
                                onPress={this.hideDialog}
                                name="close"
                                color="#264653"
                                solid
                                size={22}
                            />
                        </Dialog.Actions>


                        <Image
                            source={require('../../../assets/icons/Connectivity.png')}
                            style={{
                                alignSelf: 'center',
                                top: -30
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                top: -30,
                                color: '#15313C',

                            }]}>
                                {locales('titles.youHaveReachedMaxSendingMessageLimitation')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 15,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%',
                                top: -35
                            }}>
                                {locales('titles.IncreaseYourCapacityToSendMoreMessagesToBuyers')}
                            </Text>

                        </Dialog.Actions>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, { width: '80%', top: -30, marginBottom: 30 }]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('ExtraBuyAdCapacity');
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    {locales('titles.increaseCapacity')}
                                </Text>
                            </Button>
                        </View>
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
                        style={{ ...styles.dialogWrapper, height: "52%" }}
                    >
                        <Dialog.Actions
                            style={{
                                alignSelf: 'flex-end',
                                paddingRight: 15,
                                paddingTop: 15
                            }}
                        >
                            <AntDesign
                                onPress={() => { this.setState({ showGoldenModal: false }) }}
                                name="close"
                                color="#264653"
                                solid
                                size={22}
                            />
                        </Dialog.Actions>


                        <Image
                            source={require('../../../assets/icons/Connectivity.png')}
                            style={{
                                alignSelf: 'center',
                                top: -30
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 17,
                                color: '#15313C',
                                top: -30

                            }]}>
                                {locales('titles.youDoNotHaveAccessToSpecialBuyersInBuskool')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 14,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%',
                                top: -35
                            }}>
                                {locales('titles.toAccessGoldenRequestsPleasePromoteYourAccount')}
                            </Text>

                        </Dialog.Actions>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, {
                                    width: '80%',
                                    top: -30,
                                    marginBottom: 30,
                                    borderRadius: 8,
                                    elevation: 0
                                }]}
                                onPress={() => {
                                    this.setState({ showGoldenModal: false })
                                    this.props.navigation.navigate('PromoteRegistration');
                                }}
                            >
                                <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>
                    </Dialog>
                </Portal >

                <Header
                    title={locales('labels.buyRequests')}
                    shouldShowBackButton={false}
                    onBackButtonPressed={() => {
                        this.updateFlag.current.close();
                        this.props.navigation.goBack()
                    }}
                    {...this.props}
                />


                <InputGroup
                    style={{
                        borderRadius: 5,
                        backgroundColor: '#F2F2F2',
                        paddingHorizontal: 10,
                        width: deviceWidth * 0.98,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}
                >
                    <Input
                        value={searchText}
                        ref={this.serachInputRef}
                        onChangeText={text => this.handleSearch(text)}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            paddingBottom: 10,
                            color: '#777',
                            textAlignVertical: 'bottom'
                        }}
                        placeholderTextColor="#bebebe"
                        placeholder={locales('labels.searchBuyAdRequest')}
                    />
                    <Icon
                        name='ios-search'
                        style={{
                            color: '#7E7E7E',
                            right: -5
                        }}
                    />
                </InputGroup>


                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 1,
                        height: 50,
                        maxHeight: 50,
                    }}
                >

                    {!isFilterApplied ? this.renderAllCategoriesIcon() : null}
                    {showFilters ?
                        <Filters
                            selectedFilter={this.selectedFilter}
                            closeFilters={this.closeFilters}
                            showFilters={showFilters}
                        />
                        : null}
                    {this.renderFilterHeaderComponent()}

                </View>

                <FlatList
                    ref={this.props.requestsRef}
                    refreshing={false}
                    onRefresh={this.onRefresh}
                    keyboardDismissMode='on-drag'
                    onScroll={event => this.setState({ scrollOffset: event.nativeEvent.contentOffset.y })}
                    keyboardShouldPersistTaps='handled'
                    ListEmptyComponent={this.renderListEmptyComponent}
                    data={!this.props.loggedInUserId ?
                        buyAdRequestsList
                        : buyAdRequestsList.filter(item => item.has_msg || item.has_phone)}
                    extraData={this.state}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this.renderItem}
                    windowSize={10}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                />
                {/* 
                <View style={{
                    zIndex: 1,
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
                            borderRadius: 8
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
                        <FontAwesome5
                            name="filter"
                            solid
                            color="#fff"
                            style={{
                                marginHorizontal: 5
                            }}
                        />

                    </Button>

                </View> */}
            </View>
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
        backgroundColor: '#FF9828',
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
        marginVertical: 10,
        alignSelf: 'center',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 0
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
        backgroundColor: '#FF9828',
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

const mapStateToProps = ({
    buyAdRequestReducer,
    profileReducer,
    authReducer,
    registerProductReducer
}) => {

    const {
        buyAdRequestLoading,
        buyAdRequestList,
        buyAdRequest
    } = buyAdRequestReducer;

    const {
        userProfile,
        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading
    } = profileReducer;

    const {
        loggedInUserId
    } = authReducer;

    const {
        categoriesLoading,
        categoriesMessage,
        categoriesError,
        categoriesFailed,
        categoriesList,
        categories,

        subCategoriesLoading,
        subCategoriesMessage,
        subCategoriesError,
        subCategoriesFailed,
        subCategories
    } = registerProductReducer;

    return {
        buyAdRequestLoading,
        buyAdRequestsList: buyAdRequestList,
        buyAdRequests: buyAdRequest,

        userProfile,
        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading,

        loggedInUserId,

        categoriesLoading,
        categoriesMessage,
        categoriesError,
        categoriesFailed,
        categoriesList,
        categories,

        subCategoriesLoading,
        subCategoriesMessage,
        subCategoriesError,
        subCategoriesFailed,
        subCategories,

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: (isLoggedIn) => dispatch(buyAdRequestActions.fetchAllBuyAdRequests(isLoggedIn)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        fetchAllDashboardData: _ => dispatch(homeActions.fetchAllDashboardData()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
        setSubCategoryIdFromRegisterProduct: (id, name) => dispatch(productActions.setSubCategoryIdFromRegisterProduct(id, name)),
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
    }
};

const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Requests {...props} requestsRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);