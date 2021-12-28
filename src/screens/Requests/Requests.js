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
import Svg, { Path, G, Defs, ClipPath, } from 'react-native-svg';

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
import { responsiveHeight } from 'react-native-responsive-dimensions';

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
                    height: 190
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
                        top: -10,
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
                            width: '95%',
                            backgroundColor: '#FFC985',
                            borderRadius: 6,
                            overflow: 'hidden',
                            padding: 10,
                            borderWidth: 1,
                            borderColor: 'rgba(176, 190, 197, 0.15)',
                            height: 180,
                            alignSelf: 'center'
                        }}
                    >

                        <Svg
                            style={{
                                right: -120,
                                bottom: -30,
                                position: 'absolute',
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 250 85"
                        >
                            <Path
                                fill="#128C7E"
                                fillRule="evenodd"
                                d="M1 84.21l3.449-3.446c3.486-3.395 10.42-10.235 17.356-13.681 6.935-3.446 13.87-3.446 20.805-3.446 6.935 0 13.87 0 20.805-3.395 6.897-3.446 13.832-10.286 20.767-7.715 6.935 2.572 13.87 14.556 20.805 13.681 6.935-.822 13.87-14.555 17.356-21.396C125.83 37.972 125.792 27 125.792 27v57.21H1zM251 84l-3.454-3.416c-3.493-3.366-10.439-10.148-17.386-13.564-6.946-3.417-13.893-3.417-20.839-3.417-6.947 0-13.893 0-20.84-3.365-6.909-3.417-13.855-10.199-20.802-7.649-6.946 2.55-13.893 14.43-20.839 13.564-6.947-.816-13.893-14.43-17.385-21.213C125.962 38.158 126 30 126 30v54H251z"
                                clipRule="evenodd"
                            ></Path>
                            <Path
                                fill="#fff"
                                fillRule="evenodd"
                                d="M.5 85l3.454-2.977c3.493-2.933 10.44-8.844 17.386-11.82 6.946-2.978 13.893-2.978 20.84-2.978 6.946 0 13.892 0 20.839-2.933 6.909-2.978 13.855-8.888 20.802-6.666 6.946 2.222 13.893 12.576 20.839 11.82 6.947-.71 13.893-12.575 17.385-18.486C125.538 45.05 126 38 126 38v47H.5z"
                                clipRule="evenodd"
                            ></Path>
                            <Path
                                fill="#fff"
                                fillRule="evenodd"
                                d="M251 85l-3.454-2.977c-3.493-2.933-10.439-8.844-17.386-11.82-6.946-2.978-13.893-2.978-20.839-2.978-6.947 0-13.893 0-20.84-2.933-6.909-2.978-13.855-8.888-20.802-6.666-6.946 2.222-13.893 12.576-20.839 11.82-6.947-.71-13.893-12.575-17.385-18.486C125.962 45.05 125 38 125 38v47H251z"
                                clipRule="evenodd"
                            ></Path>
                            <G clipPath="url(#clip0_4046_7760)">
                                <Path
                                    fill="#FF9828"
                                    d="M122.55 3.33c.442-.698.922-1.371 1.437-2.017A13.214 13.214 0 01125.539 0c0 1.394-.01 2.788-.031 4.18l-.416.121c-1.176.357-1.691 1.062-1.679 2.29 0 1.08.556 1.717 1.744 2.03.692.525.249 1.242.351 1.89-.405.013-.81.05-1.21.112-4.286.931-6.393 6.148-3.157 9.931l.342.36.351.35c.223.283.391.687.682.826.987.475 2.018.857 3.032 1.273v2.26a8.196 8.196 0 00-1.893 5.49c.044 2.401.484 4.794.754 7.193l-.8.05-2.809.496-2.638.748-.931.31c-.202-.62-.385-1.2-.571-1.775l-.639-2.532-.86-8.026c.044-1.114.084-2.225.127-3.339l.227-2.768c.577-2.537 1.156-5.071 1.738-7.604l.847-2.29.621-1.552.596-1.266c.507-.927 1.014-1.858 1.523-2.793l.274-.518 1.436-2.117zm-4.76 21.966v-7.01l-.103-.016-.62 7.73a2.842 2.842 0 00-.134.665c.106 2.12.155 4.248.37 6.356.161 1.607.533 3.19.831 4.881l1.62-.484c-.565-3.212-1.117-6.287-1.638-9.372-.149-.91-.218-1.831-.326-2.75z"
                                ></Path>
                                <Path
                                    fill="#D35500"
                                    d="M125.517 25.622v-2.26c2.43.054 4.391-.877 5.642-2.972.993-1.66 1.3-3.458.31-5.276-.987-2.827-2.821-4.562-5.952-4.603-.103-.62.341-1.365-.351-1.89 1.015.069 1.933-.124 2.405-1.145.391-.847.382-1.76-.31-2.414-.456-.425-1.148-.596-1.738-.882 0-1.392.01-2.786.031-4.18l.801.602.145.14 3.774 5.22 2.691 5.44 1.682 4.944.593 2.973.487 3.001.165 1.887.021 3.029c-.068 1.241-.08 2.501-.217 3.743-.168 1.551-.441 3.084-.667 4.627-.109.552-.221 1.108-.329 1.66-.227.795-.45 1.586-.677 2.378v.021l-.08.214-2.275-.682-2.269-.55-2.467-.36c.146-1.418.183-2.858.462-4.252a11.087 11.087 0 00-1.114-7.693 3.377 3.377 0 00-.763-.72zm7.758-1.204c-.183 1.862-.31 3.724-.568 5.555-.223 1.639-.62 3.25-.862 4.882-.093.602-.363 1.455.844 1.322.146 0 .31.26.509.422 1.086-4.795 1.086-9.62.701-14.478-.121-.813-.245-1.623-.366-2.436h-.258v4.733z"
                                ></Path>
                                <Path
                                    fill="#184156"
                                    d="M125.517 10.512c3.132.04 4.966 1.775 5.984 4.596v1.139c.086 2.172-.736 3.929-2.533 5.148-1.241.842-2.61 1.406-4.152.932-1.015-.31-2.002-.708-2.998-1.068a19.343 19.343 0 01-.351-.35l-.335-.367c-3.237-3.777-1.13-9 3.156-9.931a9.82 9.82 0 011.229-.1zm-1.598 9.745a4.18 4.18 0 004.965-1.205c1.093-1.3 1.167-3.286.187-4.813-.121-.161-.233-.335-.364-.487a4.158 4.158 0 00-4.515-1.223 4.064 4.064 0 00-2.731 3.79c-.075 1.833.81 3.249 2.445 3.938h.013z"
                                ></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M125.517 25.621c.293.201.551.448.767.73a11.087 11.087 0 011.114 7.693c-.279 1.393-.31 2.833-.462 4.252-.112.653-.222 1.31-.329 1.967-.239 1.394-.472 2.793-.726 4.184-.028.14-.215.251-.311.375a1.596 1.596 0 01-.22-.397c-.14-.68-.258-1.362-.382-2.045l-.143-.54-.419-3.535c-.279-2.4-.72-4.789-.751-7.194a8.193 8.193 0 011.862-5.49zM115.161 27.576l.857 8.016-.168.1-.177.053-.884.462-4.215 1.943-.574.254a.123.123 0 00.05-.109v-6.827l1.073-.872 4.038-3.02z"
                                ></Path>
                                <Path
                                    fill="#E17C55"
                                    d="M117.79 25.295c.108.931.177 1.84.332 2.75.521 3.084 1.074 6.16 1.638 9.372l-1.62.484c-.31-1.691-.67-3.274-.831-4.882-.214-2.107-.264-4.236-.37-6.355.019-.226.063-.45.134-.665l.127.177c.019 0 .053-.034.056-.05l.192-3.624h.156v3.479h.155l.031-.686z"
                                ></Path>
                                <Path
                                    fill="#106D8A"
                                    d="M115.161 27.578l-4.035 3.007v-3.327l2.288-1.763 1.201-.875.661-.382a310.301 310.301 0 01-.115 3.34z"
                                ></Path>
                                <Path
                                    fill="#713E39"
                                    d="M121.824 21.266c.996.36 1.983.77 2.998 1.08 1.552.468 2.914-.097 4.153-.931 1.796-1.22 2.619-2.974 2.532-5.15v-1.138c.981 1.825.673 3.622-.31 5.276-1.242 2.095-3.212 3.026-5.642 2.973-1.015-.416-2.046-.798-3.033-1.273-.307-.152-.474-.555-.698-.837z"
                                ></Path>
                                <Path
                                    fill="#194257"
                                    d="M125.517 4.18c.59.285 1.282.456 1.738.881.698.655.708 1.567.31 2.415-.471 1.02-1.39 1.213-2.405 1.145-1.188-.31-1.732-.95-1.744-2.03 0-1.241.503-1.933 1.679-2.29l.422-.121zm1.412 2.259a1.511 1.511 0 00-1.412-1.316 1.327 1.327 0 00-1.241 1.418c.018.78.552 1.242 1.393 1.208a1.349 1.349 0 001.248-1.31h.012z"
                                ></Path>
                                <Path
                                    fill="#E39F82"
                                    d="M117.789 25.296l-.031.683h-.13v-3.476h-.18l-.205 3.625-.056.05-.127-.178.621-7.73.102.015.006 7.01z"
                                ></Path>
                                <Path fill="#713E39" d="M121.138 20.547l.345.366-.345-.366z"></Path>
                                <Path
                                    fill="#699CFF"
                                    d="M135.029 35.613c.227-1.552.5-3.079.668-4.624.136-1.242.149-2.483.217-3.743l3.879 3.293c.124-.202.208-.345.31-.487l.056.518 1.204 1.067v6.775l-1.573-.62-.369-.165-2.623-1.226-1.769-.788z"
                                ></Path>
                                <Path
                                    fill="#A05444"
                                    d="M133.921 22.121c.385 4.85.385 9.683-.701 14.478-.189-.162-.363-.438-.509-.422-1.207.133-.931-.72-.844-1.322.251-1.633.639-3.243.863-4.882.251-1.844.384-3.703.568-5.555.105-.146.273-.283.31-.444.127-.611.211-1.235.313-1.853z"
                                ></Path>
                                <Path
                                    fill="#106F8B"
                                    d="M140.103 30.051c-.086.143-.17.286-.31.488l-3.879-3.293c0-1.009 0-2.02-.022-3.03l3.687 2.716.158.14c.169.248.293.523.366.813.032.72 0 1.443 0 2.166z"
                                ></Path>
                                <Path
                                    fill="#C06E54"
                                    d="M133.921 22.12c-.102.62-.186 1.241-.31 1.862-.037.161-.205.31-.31.444v-4.742h.257c.118.813.242 1.623.363 2.436z"
                                ></Path>
                                <Path
                                    fill="#1E9FBD"
                                    d="M123.907 20.257c-1.636-.69-2.52-2.104-2.461-3.939a4.06 4.06 0 012.731-3.789 4.16 4.16 0 014.878 1.71c-1.157 1.061-2.405 2.045-3.445 3.212-.713.804-1.145 1.862-1.703 2.806z"
                                ></Path>
                                <Path
                                    fill="#83C8D8"
                                    d="M123.906 20.257c.559-.93.987-2.002 1.704-2.793 1.04-1.167 2.287-2.15 3.445-3.212.981 1.527.906 3.513-.186 4.813a4.183 4.183 0 01-4.963 1.192z"
                                ></Path>
                                <Path
                                    fill="#1E9FBD"
                                    d="M126.917 6.44a1.343 1.343 0 01-1.241 1.31c-.841.035-1.375-.428-1.393-1.207a1.336 1.336 0 01.738-1.284c.157-.077.328-.123.503-.134a1.513 1.513 0 011.393 1.316z"
                                ></Path>
                            </G>
                            <Defs>
                                <ClipPath id="clip0_4046_7760">
                                    <Path
                                        fill="#fff"
                                        d="M0 0H31.348V54.282H0z"
                                        transform="translate(110)"
                                    ></Path>
                                </ClipPath>
                            </Defs>
                        </Svg>
                        {/* <Image
                            source={require('../../../assets/icons/wave-3.png')}
                            style={{
                                right: 0,
                                bottom: -20,
                                width: '59%',
                                position: 'absolute',
                            }}
                        /> */}
                        <Text
                            style={{
                                color: '#004F46',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                right: '18%'
                            }}
                        >
                            {locales('labels.becomeBuskoolSpecialUser')}
                        </Text>
                        <Text
                            style={{
                                color: '#004F46',
                                fontFamily: 'IRANSansWeb(FaNum)',
                                fontSize: 14,
                                right: '16%',
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
                                bottom: 25,
                                left: '5%',
                                width: '47%'
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
                        style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 39) }}
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
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="74"
                            height="87"
                            fill="none"
                            viewBox="0 0 69 77"
                            style={{
                                alignSelf: 'center',
                                top: -25
                            }}
                        >
                            <Path
                                fill="#DEE9FF"
                                d="M64.721 25.892s-10.332 8.708.669 28.163C75.16 71.333 51.814 78.15 41.91 75.93c-12.829-2.875-19.737-19.598-29.766-14.597-10.03 5-19.086-18.99-4.463-27.38C25.87 23.519 14.6 16.92 16.447 8.989c1.325-5.694 17.977-14.14 26.504-3.834 7.175 8.672 10.913 5.723 14.345 4.672 4.95-1.515 15.387 7.25 7.425 16.066z"
                            ></Path>
                            <Path
                                fill="#0E84E5"
                                d="M54.27 13.12L31.979 9.467a3 3 0 00-3.446 2.475l-7.71 47.056a3 3 0 002.475 3.446l22.293 3.653a3 3 0 003.445-2.475l7.711-47.057a3 3 0 00-2.475-3.445z"
                            ></Path>
                            <Path
                                fill="#699CFF"
                                d="M53.538 14.446l-21.289-3.489a2 2 0 00-2.297 1.65L22.379 58.82a2 2 0 001.65 2.297l21.289 3.489a2 2 0 002.297-1.65l7.573-46.213a2 2 0 00-1.65-2.297z"
                            ></Path>
                            <Path
                                fill="#0E84E5"
                                d="M66.224 9.447c-1.619-.677-2.764-.028-3.034.62-.196.468.11.85.434.985.647.27.77-.764 1.993-.252.6.25.97.715.739 1.266-.271.648-1.098.74-1.634.91-.473.155-1.135.456-1.566 1.488-.26.624-.168.874.324 1.08.588.245.818.03.913-.197.26-.624.423-.979 1.299-1.219.429-.117 1.789-.506 2.26-1.634.471-1.128-.192-2.405-1.728-3.047zM63.146 16.376a1.001 1.001 0 00-.772 1.847 1 1 0 00.772-1.847z"
                            ></Path>
                            <Path
                                fill="#fff"
                                d="M35.766 30.955c.146-.9-.114-1.69-.58-1.766-.467-.076-.963.592-1.11 1.492-.145.9.114 1.69.58 1.766.467.076.964-.592 1.11-1.492zM45.493 32.552c.147-.908-.111-1.706-.578-1.782-.466-.076-.964.6-1.112 1.508-.147.908.111 1.706.578 1.782.466.076.964-.6 1.112-1.508zM41.522 40.384a.252.252 0 01-.181-.078l-.352-.37a3.733 3.733 0 00-4.472-.713l-.45.243a.25.25 0 01-.367-.195.249.249 0 01.13-.245l.449-.243a4.235 4.235 0 015.073.808l.352.37a.25.25 0 01-.182.423z"
                            ></Path>
                        </Svg>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                color: '#15313C',
                                top: -20

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
                                top: -25
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
                                style={[styles.modalButton, styles.greenButton, { width: '65%', top: -25, marginBottom: 30 }]}
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
                        style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 40) }}
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
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                alignSelf: 'center',
                                top: -35
                            }}
                            width="94"
                            height="87"
                            fill="none"
                            viewBox="0 0 70 67"
                        >
                            <Path
                                fill="#DEE9FF"
                                d="M36.911 6.601s1.798 11.562 21.178 11.88c17.21.284 11.74 20.755 5.632 27.192-7.914 8.338-23.424 6.157-24.238 15.862-.815 9.706-22.68 5.938-22.307-8.695.463-18.204-9.508-12.669-14.556-17.538-3.623-3.494-2.377-19.671 9.106-21.523 9.662-1.559 9.161-5.652 9.93-8.683C22.764.725 33.966-3.234 36.91 6.6z"
                            ></Path>
                            <Path
                                fill="#208AF2"
                                d="M55.143 47.756a2.232 2.232 0 01-2.232 2.24l-35.795.072a2.235 2.235 0 01-2.24-2.231l-.05-25.168 19.813-12.44a.56.56 0 01.593-.002L54.628 22.3l.464.288v.403l.05 24.766z"
                            ></Path>
                            <Path
                                fill="#699CFF"
                                d="M52.222 12.396H17.483a.15.15 0 00-.15.15V49.72c0 .083.068.15.15.15h34.74a.15.15 0 00.15-.15V12.547a.15.15 0 00-.15-.15z"
                            ></Path>
                            <Path
                                fill="#A2BDFF"
                                d="M52.875 49.96L35.11 36.414a.114.114 0 01.005-.185l19.8-13.532a.113.113 0 01.177.093l.05 24.953a2.237 2.237 0 01-2.191 2.242.12.12 0 01-.075-.025zM17.147 50.031l17.712-13.617a.114.114 0 00-.006-.184L15 22.776a.113.113 0 00-.178.095l.05 24.953a2.237 2.237 0 002.2 2.232.12.12 0 00.075-.025z"
                            ></Path>
                            <Path
                                fill="#418DF9"
                                d="M52.909 49.985l-35.795.071a2.242 2.242 0 01-2.22-1.937.56.56 0 01.186-.495l19.522-17.272a.56.56 0 01.74-.001l19.59 17.193a.56.56 0 01.189.495 2.242 2.242 0 01-2.212 1.946z"
                            ></Path>
                            <Path
                                fill="#fff"
                                d="M26.225 21.624c.695 0 1.259-.75 1.259-1.678 0-.926-.564-1.677-1.259-1.677s-1.258.75-1.258 1.677.563 1.678 1.258 1.678zM43.843 21.624c.695 0 1.259-.75 1.259-1.678 0-.926-.564-1.677-1.259-1.677s-1.258.75-1.258 1.677.563 1.678 1.258 1.678zM39.788 27.188a.25.25 0 01-.212-.117c-.013-.021-1.382-2.135-4.563-2.4-1.323-.11-2.58.258-3.732 1.096-.515.369-.971.812-1.355 1.315a.25.25 0 01-.41-.287c.021-.03.524-.741 1.456-1.422 1.238-.905 2.65-1.32 4.083-1.2 3.44.286 4.885 2.537 4.945 2.633a.25.25 0 01-.212.382z"
                            ></Path>
                        </Svg>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                top: -25,
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
                                top: -30
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
                                style={[styles.modalButton, styles.greenButton, { width: '65%', top: -25, marginBottom: 30 }]}
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
                        style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 45 : 41) }}
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
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="74"
                            height="87"
                            fill="none"
                            viewBox="0 0 69 77"
                            style={{
                                alignSelf: 'center',
                                top: -25
                            }}
                        >
                            <Path
                                fill="#DEE9FF"
                                d="M64.721 25.892s-10.332 8.708.669 28.163C75.16 71.333 51.814 78.15 41.91 75.93c-12.829-2.875-19.737-19.598-29.766-14.597-10.03 5-19.086-18.99-4.463-27.38C25.87 23.519 14.6 16.92 16.447 8.989c1.325-5.694 17.977-14.14 26.504-3.834 7.175 8.672 10.913 5.723 14.345 4.672 4.95-1.515 15.387 7.25 7.425 16.066z"
                            ></Path>
                            <Path
                                fill="#0E84E5"
                                d="M54.27 13.12L31.979 9.467a3 3 0 00-3.446 2.475l-7.71 47.056a3 3 0 002.475 3.446l22.293 3.653a3 3 0 003.445-2.475l7.711-47.057a3 3 0 00-2.475-3.445z"
                            ></Path>
                            <Path
                                fill="#699CFF"
                                d="M53.538 14.446l-21.289-3.489a2 2 0 00-2.297 1.65L22.379 58.82a2 2 0 001.65 2.297l21.289 3.489a2 2 0 002.297-1.65l7.573-46.213a2 2 0 00-1.65-2.297z"
                            ></Path>
                            <Path
                                fill="#0E84E5"
                                d="M66.224 9.447c-1.619-.677-2.764-.028-3.034.62-.196.468.11.85.434.985.647.27.77-.764 1.993-.252.6.25.97.715.739 1.266-.271.648-1.098.74-1.634.91-.473.155-1.135.456-1.566 1.488-.26.624-.168.874.324 1.08.588.245.818.03.913-.197.26-.624.423-.979 1.299-1.219.429-.117 1.789-.506 2.26-1.634.471-1.128-.192-2.405-1.728-3.047zM63.146 16.376a1.001 1.001 0 00-.772 1.847 1 1 0 00.772-1.847z"
                            ></Path>
                            <Path
                                fill="#fff"
                                d="M35.766 30.955c.146-.9-.114-1.69-.58-1.766-.467-.076-.963.592-1.11 1.492-.145.9.114 1.69.58 1.766.467.076.964-.592 1.11-1.492zM45.493 32.552c.147-.908-.111-1.706-.578-1.782-.466-.076-.964.6-1.112 1.508-.147.908.111 1.706.578 1.782.466.076.964-.6 1.112-1.508zM41.522 40.384a.252.252 0 01-.181-.078l-.352-.37a3.733 3.733 0 00-4.472-.713l-.45.243a.25.25 0 01-.367-.195.249.249 0 01.13-.245l.449-.243a4.235 4.235 0 015.073.808l.352.37a.25.25 0 01-.182.423z"
                            ></Path>
                        </Svg>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 17,
                                color: '#15313C',
                                top: -20

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
                                top: -25
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
                                    width: '65%',
                                    top: -15,
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