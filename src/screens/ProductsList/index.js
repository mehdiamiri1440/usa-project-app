import React, { createRef, PureComponent } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import ContentLoader, { Rect } from "react-content-loader/native"
import { useScrollToTop } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon, InputGroup, Input, CardItem, Body, Item, Label, Button, Card } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import Product from './Product';
import NoConnection from '../../components/noConnectionError';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import * as locationActions from '../../redux/locations/actions'
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import ENUMS from '../../enums';


let myTimeout;
class ProductsList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedButton: null,
            city: '',
            province: '',
            sortModalFlag: false,
            locationsFlag: false,
            searchText: undefined,
            from_record_number: 0,
            productsListArray: [],
            subCategoriesModalFlag: false,
            to_record_number: 16,
            sort_by: ENUMS.SORT_LIST.values.BM,
            searchLoader: false,
            loaded: false,
            searchFlag: false,
            showModal: false,
            selectedSubCategoryModal: '',
            subCategoriesList: [],
            middleCategoriesList: [],
            middleCategoriesModalFlag: false,
            selectedMiddleCategoryModal: '',
            cities: []
        }

    }


    productsListRef = createRef();

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
            screen_name: "product_list",
            screen_class: "product_list",
        });

        this.initialCalls().catch(error => {
            this.setState({
                // showModal: true,
                searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });


    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.updateProductsListFlag) {
            this.setState({
                productsListArray: [...this.props.productsListArray],
                to_record_number: 16,
                from_record_number: 0,
                searchText: ''
            })
            this.props.updateProductsList(false);
            this.scrollToTop({});
        }

        if (
            (this.props.route && this.props.route.params &&
                this.props.route.params.needToRefreshKey && (!prevProps.route || !prevProps.route.params))
            ||
            (prevProps.route && prevProps.route.params && this.props.route && this.props.route.params &&
                this.props.route.params.needToRefreshKey != prevProps.route.params.needToRefreshKey
            )
        ) {
            this.props.fetchAllDashboardData()
            this.props.fetchUserProfile()
        }

        if (((!prevProps.route || prevProps.route && !prevProps.route.params) && this.props.route && this.props.route.params &&
            this.props.route.params.productsListRefreshKey)
            ||
            (
                prevProps.route && prevProps.route.params && this.props.route && this.props.route.params &&
                prevProps.route.params.productsListRefreshKey != this.props.route.params.productsListRefreshKey)
        ) {

            let item = {
                from_record_number: 0,
                sort_by: ENUMS.SORT_LIST.values.BM,
                to_record_number: 16,
            };
            this.fetchAllProducts(item, { needsTimeout: true, type: 'offset' })
        }

        if (this.state.loaded == false && this.props.productsListArray.length) {
            this.setState({
                loaded: true,
                productsListArray: [...this.state.productsListArray, ...this.props.productsListArray],
            })
        }

    }

    initialCalls = _ => {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.fetchAllProducts(),
                this.props.fetchAllProvinces(),
                this.props.fetchAllCategories()
            ])
                .then(result => resolve(result))
                .catch(error => reject(error))
        });
    };

    fetchAllProducts = (itemFromResult, scrollObject = {}) => {

        const {
            from_record_number,
            to_record_number,
            sort_by,
            searchText
        } = this.state;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };

        if (itemFromResult)
            item = itemFromResult;

        if (searchText && searchText.length) {
            item = {
                ...item,
                search_text: searchText,
            };
        };
        this.props.fetchAllProductsList(item)
            .then(result => {
                this.setState({
                    from_record_number: 0,
                    to_record_number: 16,

                    searchLoader: false,

                    sortModalFlag: false,

                    subCategoriesModalFlag: false,

                    middleCategoriesModalFlag: false,

                    locationsFlag: false,

                    productsListArray: [...result?.payload?.products]
                }, _ => this.scrollToTop({ ...scrollObject, result }));
            })
            .catch(error => {
                this.setState({
                    //  showModal: true,
                    searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
                })
            });
    };

    scrollToTop = ({ result, needsTimeout, type }) => {
        let conditions = this.props.productsListRef && this.props.productsListRef != null
            && this.props.productsListRef != undefined &&
            this.props.productsListRef.current && this.props.productsListRef.current != null &&
            this.props.productsListRef.current != undefined && this.state.productsListArray.length > 0 &&
            this.props.productsListArray.length > 0 && !this.props.productsListLoading;

        if (result)
            conditions = conditions && result.payload.products.length > 0;

        if (type == 'offset')
            setTimeout(() => this.props.productsListRef.current.scrollToOffset({ animated: true, offset: 0 }), 300);

        else
            if (conditions)
                if (needsTimeout)
                    setTimeout(() => this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 })
                        , 300);
                else
                    this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });

    };

    setShowModal = _ => {
        this.setState({ showModal: false }, () => {
            this.componentDidMount();
        });
    };

    handleSortItemClick = value => {
        const {
            productsListLoading
        } = this.props;

        const {
            searchText,
            province,
            city
        } = this.state;

        !productsListLoading && this.setState({ sort_by: value, sortModalFlag: false, productsListArray: [] }, () => {
            let searchItem = {
                from_record_number: 0,
                sort_by: value,
                to_record_number: 16,
            };
            if (searchText && searchText.length) {
                searchItem = {
                    from_record_number: 0,
                    sort_by: value,
                    search_text: searchText,
                    to_record_number: 16
                }
            }
            if (province) {
                searchItem = { ...searchItem, province_id: province }
            }
            if (city) {
                searchItem = { ...searchItem, city_id: city }
            }

            this.fetchAllProducts(searchItem);
        })
    };

    handleMiddleCategoryItemClick = ({ id, category_name: name, subcategories: subCategoriesList = {} }) => {
        subCategoriesList = Object.values(subCategoriesList);
        this.setState({ subCategoriesModalFlag: true, selectedSubCategoryModal: name, subCategoriesList })
    };

    handleSubCategoryItemClick = item => {

        const {
            productsListLoading
        } = this.props;

        const {
            sort_by,
            province,
            city
        } = this.state;

        analytics().logEvent('apply_sort', {
            sort_type: item.name
        });

        !productsListLoading && this.setState({
            searchText: item.category_name,
            productsListArray: [],
            middleCategoriesModalFlag: false,
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

            this.fetchAllProducts(searchItem, { needsTimeout: true });
        })
    };

    handleSearch = (text) => {


        clearTimeout(myTimeout)
        const { sort_by, province, city } = this.state;

        this.setState({ searchText: text, searchLoader: true });
        let item = {
            sort_by,
            from_record_number: 0,
            to_record_number: 16
        };
        if (text)
            item = {
                ...item,
                search_text: text,
                sort_by,
            };
        myTimeout = setTimeout(() => {
            if (province) {
                item = { ...item, province_id: province }
            }
            if (city) {
                item = { ...item, city_id: city }
            }

            analytics().logEvent('search_text', {
                text
            });
            this.setState({ productsListArray: [] })
            this.fetchAllProducts(item);
            // this.setState({ searchFlag: true, to_record_number: 16, from_record_number: 0, searchLoader: false })
        }, 1500);

    };

    submitSearching = _ => {
        const { sort_by, province, city, searchText } = this.state;

        let item = {
            sort_by,
            search_text: searchText,
            from_record_number: 0,
            to_record_number: 16
        };

        if (province) {
            item = { ...item, province_id: province }
        }
        if (city) {
            item = { ...item, city_id: city }
        }

        analytics().logEvent('search_text', {
            text: searchText
        });

        this.setState({ productsListArray: [] })
        this.fetchAllProducts(item);
    };

    sortProducts = ({ id, category_name: name, middleCategories: middleCategoriesList = [] }) => {
        this.setState({ middleCategoriesModalFlag: true, selectedMiddleCategoryModal: name, middleCategoriesList })
    };

    setProvince = (value) => {
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {

            let cities = provinces.find(item => item.id == value)?.cities ?? {};

            if (!cities || (!Array.isArray(cities) && !Object.entries(cities).length))
                cities = {};

            if (!Array.isArray(cities))
                cities = Object.values(cities);

            this.setState({ province: value, provinceError: '', cityError: '', city: '', cities })
        }
    };

    setCity = (value) => {
        if (!!value)
            this.setState({ city: value, cityError: '' })
    };

    searchLocation = () => {
        const { searchText, province, city, sort_by } = this.state;
        this.setState({ selectedButton: 1, productsListArray: [], locationsFlag: false });
        let searchItem = {
            from_record_number: 0,
            sort_by,
            to_record_number: 16,
        };
        if (searchText && searchText.length) {
            searchItem = {
                from_record_number: 0,
                sort_by,
                search_text: searchText,
                to_record_number: 16
            }
        }
        if (province) {
            searchItem = { ...searchItem, province_id: province }
        }
        if (city) {
            searchItem = { ...searchItem, city_id: city }
        }

        return this.fetchAllProducts(searchItem);
    };

    deleteFilter = () => {
        const { searchText, sort_by } = this.state;
        this.setState({ selectedButton: 2, productsListArray: [], locationsFlag: false, city: '', province: '' });
        let searchItem = {
            from_record_number: 0,
            sort_by,
            to_record_number: 16,
        };
        if (searchText && searchText.length) {
            searchItem = {
                from_record_number: 0,
                sort_by,
                search_text: searchText,
                to_record_number: 16
            }
        }

        this.fetchAllProducts(searchItem);

    };

    onEndOfProductListReached = _ => {
        const {
            province,
            city,

            productsListArray,

            loaded,

            sort_by,

            searchText
        } = this.state;

        if (loaded && productsListArray.length >= this.state.to_record_number)
            this.setState({
                from_record_number: this.state.from_record_number + 16,
                to_record_number: this.state.to_record_number + 16,
            }, () => {
                const {
                    to_record_number,
                    from_record_number,
                } = this.state;

                let item = {
                    from_record_number,
                    sort_by,
                    to_record_number,
                };
                if (searchText && searchText.length) {
                    item = {
                        from_record_number,
                        sort_by,
                        to_record_number,
                        search_text: searchText
                    }
                }
                if (province) {
                    item = { ...item, province_id: province }
                }
                if (city) {
                    item = { ...item, city_id: city }
                }
                this.props.fetchAllProductsList(item).then(_ => {
                    this.setState({ loaded: false })
                }).catch(error => {
                    this.setState({
                        // showModal: true,
                        searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
                    })
                });
            })
    };

    onProductListRefreshed = _ => {
        const {
            searchText,

            province,
            city,

            sort_by
        } = this.state;


        let item = {
            from_record_number: 0,
            sort_by,
            to_record_number: 16,
        };
        if (searchText && searchText.length) {
            item = {
                from_record_number: 0,
                sort_by,
                to_record_number: 16,
                search_text: searchText
            }
        }
        if (province) {
            item = { ...item, province_id: province }
        }
        if (city) {
            item = { ...item, city_id: city }
        }
        this.props.fetchAllProductsList(item).then(result => {
            this.setState({
                productsListArray: [...result.payload.products], from_record_number: 0, to_record_number: 16
            })
        }).catch(error => {
            this.setState({
                //  showModal: true,
                searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });
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
                        height: deviceHeight * 0.7
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
                            borderBottomColor: '#BEBEBE'

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

    renderProductListEmptyComponent = _ => {
        const {
            userProfile = {},
            productsListLoading
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller = true
        } = user_info;

        const {
            loaded
        } = this.state;

        if (!productsListLoading)
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        height: deviceHeight * 0.7
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
                        {locales('titles.noProductFound')}</Text>
                    {
                        is_seller ?
                            <View >
                                <Button
                                    onPress={() => this.props.navigation.navigate('RegisterProductStack')}

                                    style={styles.loginButton}>
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                width: deviceWidth * 0.9,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                            }]}
                                    >
                                        {locales('titles.registerNewProduct')}
                                    </Text>
                                </Button>
                            </View>
                            :
                            <View >
                                <Button
                                    onPress={() => this.props.navigation.navigate('RegisterRequest')}
                                    style={styles.loginButton}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                width: deviceWidth * 0.9,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                            }]}
                                    >
                                        {locales('titles.registerBuyAdRequest')}
                                    </Text>
                                </Button>
                            </View>}
                </View>
            )
        if (!loaded || productsListLoading) {
            return (
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
                                    borderWidth: 1, borderColor: '#eee', width: '45%', height: '100%'
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
                                    <Rect x="30%" y="65%" width="100" height="10" />
                                    <Rect x="15%" y="73%" width="120" height="10" />
                                    <Rect x="15%" y="80%" width="120" height="10" />
                                </ContentLoader>
                            </View>

                            <View
                                style={{
                                    borderRadius: 12, marginHorizontal: 3,
                                    borderWidth: 1, borderColor: '#eee', width: '45%', height: '100%'
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
                                    <Rect x="30%" y="65%" width="100" height="10" />
                                    <Rect x="15%" y="73%" width="120" height="10" />
                                    <Rect x="15%" y="80%" width="120" height="10" />
                                </ContentLoader>
                            </View>

                        </View>
                    )}
                </View>
            )
        }
        return null;
    };

    renderItemSeparatorComponent = (leading = [{}]) => {

        const {
            userProfile = {},
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller = true
        } = user_info;

        const { productsListArray } = this.state;
        const foundIndex = productsListArray.findIndex(item => item?.main?.id == leading[0]?.main?.id);

        if ((foundIndex + 1) % 9 != 0)
            return null;

        return (

            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0.2 }}
                style={{
                    width: deviceWidth, alignSelf: 'center',
                    justifyContent: 'space-between', marginVertical: 20,
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
                    {locales('titles.didNotFindProduct')}
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
                    {locales('titles.registerNewBuyAdRequest')}
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
        )
    };

    renderSortListItem = ({ item }) => {
        const {
            sort_by,
        } = this.state;

        return (
            <TouchableOpacity
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
            </TouchableOpacity>

        )
    };

    renderMiddleCategoriesListItem = ({ item }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={_ => this.handleMiddleCategoryItemClick(item)}
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
            </TouchableOpacity>
        )
    };

    renderSubCategoriesListItem = ({ item }) => {
        return (
            <TouchableOpacity
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
            </TouchableOpacity>
        )
    };

    renderCategoriesListItem = ({ item }) => {
        const {
            productsListLoading
        } = this.props;

        return (
            <TouchableOpacity
                onPress={() => !productsListLoading && this.sortProducts(item)}
                style={{
                    borderRadius: 18,
                    marginHorizontal: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 85,
                    borderWidth: 1,
                    borderColor: '#7E7E7E',
                    backgroundColor: '#eee',
                    minHeight: 30
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: '#7E7E7E',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {item.category_name}
                </Text>
            </TouchableOpacity>
        )
    };

    renderProductListFooterComponent = _ => {
        const {
            loaded
        } = this.state;

        const {
            productsListLoading
        } = this.props;

        if (loaded && productsListLoading)
            return (
                <View style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    marginBottom: 15

                }}>
                    <ActivityIndicator size="small" color="#00C569"
                        style={{
                            zIndex: 999,
                            width: 50, height: 50,
                            borderRadius: 50,
                            backgroundColor: '#fff',
                            elevation: 5,
                            padding: 0,
                        }}
                    />
                </View>
            )
        return null;
    };

    renderProductListItem = ({ item }) => {
        return (
            <View
                style={{
                    width: '47%', marginVertical: 10,
                    marginHorizontal: 5,
                    alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Product
                    productItem={item}
                    fetchAllProducts={this.fetchAllProducts}
                    {...this.props}
                />
            </View>

        )
    };

    render() {

        const {
            productsListLoading,

            categoriesList,
            categoriesLoading,

            allProvincesObject,
            userProfile = {},

            provinceLoading,
            fetchCitiesLoading
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            is_seller
        } = user_info;

        const {
            searchText,
            productsListArray,
            selectedButton,
            subCategoriesModalFlag,
            sortModalFlag,
            locationsFlag,
            province,
            city,
            selectedSubCategoryModal,
            subCategoriesList,
            middleCategoriesList,
            cities,
            showModal,
            middleCategoriesModalFlag,
            selectedMiddleCategoryModal
        } = this.state;


        let {
            provinces = []
        } = allProvincesObject;


        provinces = provinces.map(item => ({ ...item, value: item.id }));

        let selectedCity = (city && cities.some(item => item.id == city)) ? cities.find(item => item.id == city).city_name : '';


        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <NoConnection
                    closeModal={this.setShowModal}
                    showModal={showModal}
                />

                {locationsFlag ?
                    <Modal
                        animationType="slide"
                        visible={locationsFlag}
                        onRequestClose={() => this.setState({ locationsFlag: false })}>


                        <View style={{
                            backgroundColor: 'white',
                            flexDirection: 'row-reverse',
                            alignContent: 'center',
                            alignItems: 'center',
                            height: 45,
                            elevation: 5,
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity
                                style={{
                                    width: deviceWidth * 0.4,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    paddingHorizontal: 10
                                }}
                                onPress={() => {
                                    this.setState({ locationsFlag: false });
                                }}
                            >
                                <AntDesign name='arrowright' size={25} />
                            </TouchableOpacity>

                            <View style={{
                                width: deviceWidth * 0.6,
                                alignItems: 'flex-end'
                            }}>
                                <Text
                                    style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                                >
                                    {locales('labels.locationsFilter')}
                                </Text>
                            </View>
                        </View>


                        <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                            <Card>
                                <CardItem>
                                    <Body>
                                        <View style={{ padding: 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>

                                            <View style={[{ alignSelf: 'center' }, styles.labelInputPadding]}>
                                                <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                                    {locales('labels.province')}
                                                </Label>
                                                <Item regular
                                                    style={{
                                                        width: deviceWidth * 0.9,
                                                        borderRadius: 5,
                                                        alignSelf: 'center',
                                                        borderColor: '#a8a8a8'
                                                    }}
                                                >
                                                    <RNPickerSelect
                                                        Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                                        useNativeAndroidPickerStyle={false}
                                                        onValueChange={this.setProvince}
                                                        style={styles}
                                                        value={province}
                                                        disabled={categoriesLoading}
                                                        placeholder={{
                                                            label: locales('labels.selectProvince'),
                                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        }}
                                                        items={[...provinces.map(item => ({
                                                            label: item.province_name, value: item.id
                                                        }))]}
                                                    />
                                                </Item>
                                            </View>

                                            <View style={[{ marginTop: 30 }, styles.labelInputPadding]}>
                                                <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                                    {locales('labels.city')}
                                                </Label>
                                                {(provinceLoading || fetchCitiesLoading) ?
                                                    <ActivityIndicator size="small" color="#00C569"
                                                        style={{
                                                            position: 'absolute', right: '15%', top: '2%',
                                                            width: 50, height: 50, borderRadius: 25
                                                        }}
                                                    /> : null}
                                                <Item regular
                                                    style={{
                                                        width: deviceWidth * 0.9,
                                                        borderRadius: 5,
                                                        alignSelf: 'center',
                                                        borderColor: '#a8a8a8'
                                                    }}
                                                >
                                                    <RNPickerSelect
                                                        Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                                        useNativeAndroidPickerStyle={false}
                                                        onValueChange={this.setCity}
                                                        disabled={provinceLoading || !province}
                                                        style={styles}
                                                        value={city}
                                                        placeholder={{
                                                            label: locales('labels.selectCity'),
                                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        }}
                                                        items={[...cities.map(item => ({
                                                            label: item.city_name, value: item.id
                                                        }))]}
                                                    />
                                                </Item>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row-reverse', justifyContent: 'space-between', marginVertical: 45,
                                                alignItems: 'center'
                                            }}>
                                                <Button
                                                    style={[styles.loginButton, { width: '50%' }]}
                                                    onPress={this.searchLocation}>
                                                    <ActivityIndicator size="small" color="white"
                                                        animating={selectedButton == 1 && !!productsListLoading}
                                                        style={{
                                                            marginLeft: -15,
                                                            justifyContent: 'center',

                                                            width: 30, height: 30, borderRadius: 15
                                                        }}
                                                    />
                                                    <Text style={[styles.buttonText, { alignSelf: 'center', fontSize: 16 }]}>
                                                        {locales('labels.search')}
                                                    </Text>

                                                </Button>
                                                <Button
                                                    style={[styles.loginButton, { width: '50%', flexDirection: 'row', backgroundColor: '#556080', }]}
                                                    onPress={this.deleteFilter}>
                                                    <ActivityIndicator size="small" color="white"
                                                        animating={selectedButton == 2 && !!productsListLoading}
                                                        style={{
                                                            marginLeft: -15,
                                                            justifyContent: 'center',

                                                            width: 30, height: 30, borderRadius: 15
                                                        }}
                                                    />
                                                    <Text style={[styles.buttonText, {
                                                        alignSelf: 'center',
                                                        fontSize: 16
                                                    }]}>
                                                        {locales('labels.deleteFilter')}
                                                    </Text>

                                                </Button>
                                            </View>

                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>

                        </View>

                    </Modal>
                    : null}

                {sortModalFlag ?
                    <Modal
                        animationType="slide"
                        visible={sortModalFlag}
                        onRequestClose={() => this.setState({ sortModalFlag: false })}>

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
                                onPress={() => this.setState({ sortModalFlag: false })}
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
                                    {locales('labels.sortBy')}
                                </Text>
                            </View>
                        </View>
                        <FlatList
                            data={ENUMS.SORT_LIST.list}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderSortListItem}
                        />
                    </Modal>
                    : null}

                {!!middleCategoriesModalFlag ?
                    <Modal
                        animationType="slide"
                        visible={!!middleCategoriesModalFlag}
                        onRequestClose={() => this.setState({ middleCategoriesModalFlag: false })}>

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
                                onPress={() => this.setState({ middleCategoriesModalFlag: false })}
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
                                    {selectedMiddleCategoryModal}
                                </Text>
                            </View>
                        </View>
                        <FlatList
                            ListEmptyComponent={this.renderMiddleCategoriesListEmptyComponent}
                            data={middleCategoriesList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderMiddleCategoriesListItem}
                        />
                    </Modal>
                    : null}

                {subCategoriesModalFlag ?
                    <Modal
                        animationType="slide"
                        visible={subCategoriesModalFlag}
                        onRequestClose={() => this.setState({ subCategoriesModalFlag: false })}>

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
                                onPress={() => this.setState({ subCategoriesModalFlag: false })}
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
                                    {selectedSubCategoryModal}
                                </Text>
                            </View>
                        </View>
                        <FlatList
                            ListEmptyComponent={this.renderSubCategoriesListEmptyComponent}
                            data={subCategoriesList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderSubCategoriesListItem}
                        />
                    </Modal>
                    : null}

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
                            {locales('labels.products')}
                        </Text>
                    </View>
                </View>


                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginTop: 5, padding: 4 }}>
                        <InputGroup style={{ borderRadius: 5, backgroundColor: '#F2F2F2' }}>
                            <TouchableOpacity
                                onPress={() => !productsListLoading && this.setState({ locationsFlag: true })}
                                style={{ flexDirection: 'row' }}>
                                <Entypo name='location-pin' size={25} style={{
                                    color: (selectedCity) ||
                                        (province && provinces.find(item => item.id == province).province_name) ? '#556080' : '#777',

                                }} />
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777', fontSize: 16,
                                        color: (selectedCity) ||
                                            (province && provinces.find(item => item.id == province).province_name) ? '#556080' : '#777',

                                    }}
                                >
                                    {
                                        (selectedCity) ||
                                        (province && provinces.find(item => item.id == province).province_name) ||
                                        locales('titles.AllIran')
                                    }
                                </Text>
                            </TouchableOpacity>
                            <Input
                                value={searchText}
                                ref={this.serachInputRef}
                                disabled={!!productsListLoading}
                                onChangeText={text => this.handleSearch(text)}
                                onSubmitEditing={this.submitSearching}
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    paddingBottom: 10, color: '#777', textAlignVertical: 'bottom'
                                }}
                                placeholderTextColor="#bebebe"
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={() => !productsListLoading && this.setState({ sortModalFlag: true })}
                                style={{
                                    borderRadius: 18, marginTop: 7, marginBottom: 8,
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    minWidth: 110, backgroundColor: '#556080', minHeight: 30
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center', textAlignVertical: 'center',
                                        color: '#fff', marginRight: 2, fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                    }}
                                >
                                    {locales('labels.sort')}
                                </Text>
                                <FontAwesome name='sort-amount-desc' size={12} color='#fff' />
                            </TouchableOpacity>

                            <FlatList
                                data={categoriesList}
                                horizontal={true}
                                inverted={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginVertical: 8 }}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={this.renderCategoriesListItem}
                            />

                        </View>
                    </View>

                </View>


                <FlatList
                    initialNumToRender={4}
                    ref={this.props.productsListRef}
                    keyExtractor={(_, index) => index.toString()}
                    data={productsListArray}
                    style={{ backgroundColor: 'white' }}
                    horizontal={false}
                    numColumns={2}
                    columnWrapperStyle={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}
                    refreshing={false}
                    onRefresh={this.onProductListRefreshed}
                    onEndReached={this.onEndOfProductListReached}
                    onEndReachedThreshold={3}
                    ListEmptyComponent={this.renderProductListEmptyComponent}
                    ListFooterComponent={this.renderProductListFooterComponent}
                    ItemSeparatorComponent={({ _, leadingItem }) => !is_seller && this.renderItemSeparatorComponent(leadingItem)}
                    renderItem={this.renderProductListItem}
                />

            </View>
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
        width: '60%',
        textAlign: 'center'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
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
        borderRadius: 5,
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
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.05,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
});

const mapStateToProps = ({
    productsListReducer,
    registerProductReducer,
    locationsReducer,
    profileReducer
}) => {

    const {
        productsListObject,
        productsListArray,
        productsListLoading,
        productsListError,
        productsListFailed,
        productsListMessage,

        updateProductsListFlag
    } = productsListReducer;

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

    const {
        provinceLoading,
        provinceError,
        provinceFailed,
        provinceMessage,
        allProvincesObject,

        fetchCitiesLoading,
        fetchCitiesError,
        fetchCitiesFailed,
        fetchCitiesMessage,
        allCitiesObject
    } = locationsReducer;

    const {
        userProfile
    } = profileReducer;

    return {
        productsListObject,
        productsListArray,
        productsListLoading,
        productsListError,
        productsListFailed,
        productsListMessage,

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

        provinceLoading,
        provinceError,
        provinceFailed,
        provinceMessage,
        allProvincesObject,


        fetchCitiesLoading,
        fetchCitiesError,
        fetchCitiesFailed,
        fetchCitiesMessage,
        allCitiesObject,

        updateProductsListFlag,

        userProfile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item, false)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id)),
        fetchAllProvinces: (provinceId) => dispatch(locationActions.fetchAllProvinces(provinceId, true)),
        fetchAllCities: () => dispatch(locationActions.fetchAllCities()),
        fetchAllDashboardData: () => dispatch(homeActions.fetchAllDashboardData()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        updateProductsList: flag => dispatch(productsListActions.updateProductsList(flag)),
    }
};


const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <ProductsList {...props} productsListRef={ref} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)

