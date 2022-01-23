import React, { createRef, PureComponent } from 'react';
import {
    Text,
    View,
    FlatList,
    Pressable,
    Modal,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import ContentLoader, { Rect } from "react-content-loader/native"
import { useScrollToTop } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';

import Product from './Product';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import * as locationActions from '../../redux/locations/actions'
import { dataGenerator, enumHelper, deviceWidth, deviceHeight } from '../../utils';
import ENUMS from '../../enums';
import Header from '../../components/header';
import { BuskoolButton, BuskoolTextInput } from '../../components';

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
            subCategoriesList: [],
            cities: [],
            totalCategoriesModalFlag: false,
            modals: [],
            isFilterApplied: false,
            preFetchLoading: true,
            showRefreshButton: false,
            categoriesList: [],
            tempCities: [],
            tempProvince: null,
            tempCity: []
        }

        this.isComponentMounted = false;
    }

    productsListRef = createRef();
    categoryFiltersRef = createRef();

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            this.blurListener = this.props.navigation.addListener('blur', this.handleScreenBlured);
            this.screenFocused = this.props.navigation.addListener('focus', this.handleScreenFocused);

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
                    searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
                })
            });

        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.updateProductsListFlag) {
            this.setState({
                productsListArray: [...this.props.productsListArray],
                to_record_number: 16,
                from_record_number: 0,
                searchText: '',
                selectedButton: null,
                city: '',
                province: '',
                sortModalFlag: false,
                locationsFlag: false,
                subCategoriesModalFlag: false,
                sort_by: ENUMS.SORT_LIST.values.BM,
                searchLoader: false,
                searchFlag: false,
                subCategoriesList: [],
                cities: [],
                totalCategoriesModalFlag: false,
                isFilterApplied: false,
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

    componentWillUnmount() {
        this.isComponentMounted = false;
        this.screenFocused;
        return this.blurListener;
    }

    handleScreenFocused = _ => {
        if (global.refreshProductList) {

            global.refreshProductList = false;

            this.setState({
                selectedButton: null,
                city: '',
                province: '',
                sortModalFlag: false,
                locationsFlag: false,
                searchText: undefined,
                from_record_number: 0,
                subCategoriesModalFlag: false,
                sort_by: ENUMS.SORT_LIST.values.BM,
                searchLoader: false,
                searchFlag: false,
                subCategoriesList: [],
                cities: [],
                totalCategoriesModalFlag: false,
                isFilterApplied: false,
            });
        }
    };

    handleScreenBlured = _ => {
        const {
            productsListArray = []
        } = this.state;

        const {
            categoriesList = []
        } = this.props;

        let tempProductsList = productsListArray.slice(0, 16);
        AsyncStorage.multiSet([
            ['@productsList', JSON.stringify(tempProductsList)],
            ['@categoriesList', JSON.stringify(categoriesList)],
        ]
        );

    };

    initialCalls = _ => {
        return new Promise.all([
            this.getItemsFromStorage(),
            this.props.fetchAllProvinces(),
        ])
            .then(result => resolve(result))
            .catch(error => reject(error))
    };

    AreArraysTheSame = (pFromProps = [], pFromState = []) => {
        for (let iFromProps = 0; iFromProps < pFromProps.length; iFromProps++)
            if (pFromState.every(item => item?.main?.id != pFromProps[iFromProps]?.main?.id))
                return false;
        return true;
    };

    getItemsFromStorage = _ => {
        AsyncStorage.multiGet(['@productsList', '@categoriesList']).then(multiGetResult => {

            let resultFromStorage = JSON.parse(multiGetResult[0][1]);
            let categoriesListFromStorage = JSON.parse(multiGetResult[1][1]);

            this.props.fetchAllCategories()
                .then(_ => this.setState({ categoriesList: this.props.categoriesList }))
                .catch(_ => this.setState({ categoriesList: categoriesListFromStorage ?? [] }));
            this.setState({ categoriesList: categoriesListFromStorage ?? [] });


            const {
                from_record_number,
                to_record_number,
                sort_by,
            } = this.state;

            const {
                loggedInUserId
            } = this.props;

            let item = {
                from_record_number,
                sort_by,
                to_record_number,
            };

            if (!resultFromStorage || !Array.isArray(resultFromStorage) || !resultFromStorage.length) {
                this.fetchAllProducts();
            }
            else {
                this.setState({ productsListArray: resultFromStorage, preFetchLoading: false });
                this.props.fetchAllProductsList(item, !!loggedInUserId).then((resultFromProps = {}) => {

                    const {
                        payload = {}
                    } = resultFromProps;

                    const {
                        products = []
                    } = payload;


                    if (products && products.length && resultFromStorage && resultFromStorage.length && products.length == resultFromStorage.length) {
                        const condition = this.AreArraysTheSame(products, resultFromStorage);
                        this.setState({ showRefreshButton: !condition });
                    }
                });
            }
        })
            .catch(_ => {
                this.fetchAllProducts();
            })
    };

    fetchAllProducts = (itemFromResult, scrollObject = {}) => {

        const {
            from_record_number,
            to_record_number,
            sort_by,
            searchText
        } = this.state;

        const {
            loggedInUserId
        } = this.props;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };

        if (!!itemFromResult)
            item = itemFromResult;

        if (searchText && searchText.length) {
            item = {
                ...item,
                search_text: searchText,
            };
        };
        this.props.fetchAllProductsList(item, !!loggedInUserId)
            .then(result => {
                this.setState({
                    from_record_number: 0,
                    to_record_number: 16,

                    searchLoader: false,

                    sortModalFlag: false,

                    subCategoriesModalFlag: false,

                    totalCategoriesModalFlag: false,

                    locationsFlag: false,

                    preFetchLoading: false,

                    productsListArray: [...result?.payload?.products]
                }, _ => this.scrollToTop({ ...scrollObject, result }));
            })
            .catch(error => {
                this.setState({
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

    handleSortItemClick = value => {
        const {
            searchText,
            province,
            city
        } = this.state;

        this.setState({ sort_by: value, sortModalFlag: false, productsListArray: [] }, () => {
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

                this.fetchAllProducts(searchItem, { needsTimeout: true });
            });
        }
        else {
            this.sortProducts(item)
        }
    };

    handleSearch = (text) => {


        clearTimeout(myTimeout)
        const { sort_by, province, city } = this.state;

        this.setState({ searchText: text, searchLoader: true, isFilterApplied: false });
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

        this.setState({ productsListArray: [], isFilterApplied: false })
        this.fetchAllProducts(item);
    };

    omitItemFromModals = category_name => {
        let modals = [...this.state.modals];
        const foundIndex = this.state.modals.findIndex(item => item.category_name == category_name);
        modals.splice(foundIndex, 1);
        this.setState({ modals });
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
        const { searchText, province, city, sort_by, cities } = this.state;
        this.setState({
            selectedButton: 1,
            productsListArray: [],
            locationsFlag: false,
            tempProvince: province,
            tempCity: city,
            tempCities: cities
        });
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

    onScrollToIndexFailed = (error = {}) => {
        const {
            averageItemLength,
            index
        } = error;

        const offset = averageItemLength * index;

        this.props.productsListRef?.current?.scrollToOffset({ offset, animated: true });
        setTimeout(() => this.props.productsListRef?.current?.scrollToIndex({ index, animated: true }), 300);
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

                const {
                    loggedInUserId
                } = this.props;

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
                this.props.fetchAllProductsList(item, !!loggedInUserId).then(_ => {
                    this.setState({ loaded: false })
                }).catch(error => {
                    this.setState({
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

        const {
            loggedInUserId
        } = this.props;

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

        this.props.fetchAllProductsList(item, !!loggedInUserId).then(result => {
            this.setState({
                productsListArray: [...result.payload.products], from_record_number: 0, to_record_number: 16
            })
        }).catch(error => {
            this.setState({
                searchFlag: false, subCategoriesModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });
        this.props.fetchAllProvinces();
        this.props.fetchAllCategories().then(_ => this.setState({ categoriesList: this.props.categoriesList }));

    };

    removeFilter = _ => {

        this.setState({ isFilterApplied: false, searchText: null, productsListArray: [] }, _ => {
            const {
                province,
                city,
                sort_by
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
            this.fetchAllProducts(searchItem);
        });

    };

    removeLocations = _ => {
        this.setState({ province: null, city: null, productsListArray: [] }, _ => {
            const {
                sort_by,
                searchText
            } = this.state;

            let searchItem = {
                from_record_number: 0,
                sort_by,
                to_record_number: 16,
            };

            if (searchText && searchText.length) {
                searchItem = {
                    ...searchItem,
                    search_text: searchText,
                };
            };
            this.fetchAllProducts(searchItem);
        });

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
            loaded,
            preFetchLoading,
            isFilterApplied,
            searchText
        } = this.state;

        if (!productsListLoading && !preFetchLoading)
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        marginTop: 80
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
                            isFilterApplied ?
                                locales('labels.noSellerFound')
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
                                    : locales('labels.noSellerFound')
                        }
                    </Text>
                    <Button
                        onPress={_ => is_seller ?
                            this.props.navigation.navigate('RegisterProductStack', { screen: 'RegisterProduct' })
                            :
                            this.props.navigation.navigate('RegisterRequestStack', { screen: 'RegisterRequest' })
                        }
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
                                {is_seller ? locales('labels.registerProduct') : locales('labels.registerRequest')}
                            </Text>
                        </View>
                    </Button>
                </View>
            )
        if (!loaded || productsListLoading || preFetchLoading) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, marginTop: 10 }}>
                    {[1, 2, 3, 4, 5, 6].map((_, index) =>
                        // <ContentLoader key={index} />
                        <View
                            key={index}
                            style={{
                                paddingBottom: 10,
                                marginBottom: 15,
                                flex: 1,
                                width: '100%',
                                height: deviceHeight * 0.34,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-around',
                                alignItems: 'center'

                            }}>
                            <View
                                style={{
                                    borderRadius: 12, marginHorizontal: 3, overflow: 'hidden',
                                    borderWidth: 1, borderColor: '#eee', width: '47.5%', height: '100%'
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
                                    borderRadius: 12, marginHorizontal: 3, overflow: 'hidden',
                                    borderWidth: 1, borderColor: '#eee', width: '47.5%', height: '100%'
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

                <BuskoolButton
                    style={{
                        backgroundColor: '#1DA1F2', borderRadius: 5,
                        width: deviceWidth * 0.6, flexDirection: 'row-reverse',
                        justifyContent: 'space-around', alignItems: 'center',
                        alignSelf: 'flex-end', padding: 10
                    }}
                    onPress={_ => this.props.navigation.navigate(is_seller ? 'RegisterProductStack' : 'RegisterRequestStack')}
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
                </BuskoolButton>
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
            <Pressable
                android_ripple={{
                    color: '#ededed',
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

    renderProductListFooterComponent = _ => {
        const {
            loaded
        } = this.state;

        const {
            productsListLoading
        } = this.props;

        if (loaded && productsListLoading)
            return (
                <View
                    style={{
                        textAlign: 'center',
                        alignItems: 'center',
                        marginBottom: 15
                    }}>
                    <ShadowView
                        style={{
                            backgroundColor: 'white',
                            shadowColor: 'black',
                            shadowOpacity: 0.13,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 2 },
                            zIndex: 999,
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            padding: 0,
                        }}
                    >
                        <ActivityIndicator size="small" color="#00C569"
                            style={{
                                top: 14
                            }}
                        />
                    </ShadowView>
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

    renderSelectedLocation = _ => {

        const {
            province,
            city,
            cities
        } = this.state;

        const {
            allProvincesObject = {},
        } = this.props;

        let {
            provinces = []
        } = allProvincesObject;


        let selectedLocation = '';

        if (province)
            selectedLocation = provinces.find(item => item.id == province)?.province_name;

        if (city)
            selectedLocation = cities.find(item => item.id == city)?.city_name;

        if (!!selectedLocation)
            return (
                <Pressable
                    android_ripple={{
                        color: '#ededed',
                        radius: 12
                    }}
                    onPress={() => this.removeLocations()}
                    style={{
                        borderRadius: 12,
                        marginHorizontal: 5,
                        borderColor: '#FA8888',
                        borderWidth: 1,
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FCF6F6',
                        minHeight: 30,
                        paddingHorizontal: 15
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 15,
                            paddingLeft: 10,
                            color: '#E41C38',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {selectedLocation}
                    </Text>
                    <FontAwesome5 name='times' size={12} color='#E41C38' />
                </Pressable>
            );
        return null;
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

                {this.renderSelectedLocation()}

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
                            borderColor: '#FA8888',
                            borderWidth: 1,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FCF6F6',
                            minHeight: 30,
                            paddingHorizontal: 15
                        }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontSize: 15,
                                paddingLeft: 10,
                                color: '#E41C38',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {searchText}
                        </Text>
                        <FontAwesome5 name='times' size={12} color='#E41C38' />
                    </Pressable>
                    :
                    null}
            </View>

        )
    };

    renderAllCategoriesIcon = _ => {

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed',
                    radius: 12
                }}
                onPress={() => this.setState({ totalCategoriesModalFlag: true })}
                style={{
                    borderRadius: 12, marginTop: 7, marginBottom: 8,
                    borderColor: '#EDEDED',
                    borderWidth: 1,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#FAFAFA', minHeight: 30, paddingHorizontal: 15
                }}>
                <Text
                    style={{
                        textAlign: 'center', textAlignVertical: 'center', fontSize: 15,
                        color: '#707070', marginRight: 2, fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {locales('labels.classifications')}
                </Text>
                <FontAwesome5 name='list' size={12} color='#707070' />
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
                    color: '#ededed',
                    radius: 12
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
                    minWidth: 120,
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

    // getItemLayout = (data, index) => {
    //     return { length: 293.2, offset: 273.2 * index, index };
    // };

    render() {

        const {
            productsListLoading,

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
            sortModalFlag,
            locationsFlag,
            province,
            city,
            cities,
            totalCategoriesModalFlag,
            modals,
            isFilterApplied,
            showRefreshButton,
            categoriesList,
            tempCities,
            tempProvince,
            tempCity
        } = this.state;


        let {
            provinces = []
        } = allProvincesObject;


        provinces = provinces.map(item => ({ ...item, value: item.id }));

        let selectedCity = (city && cities.some(item => item.id == city)) ? cities.find(item => item.id == city).city_name : '';


        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >
                {showRefreshButton ?
                    <Pressable
                        android_ripple={{
                            color: '#ededed',
                            radius: 16
                        }}
                        onPress={_ => {
                            this.setState({
                                from_record_number: 0,
                                to_record_number: 16,

                                searchLoader: false,

                                sortModalFlag: false,

                                subCategoriesModalFlag: false,

                                totalCategoriesModalFlag: false,

                                locationsFlag: false,

                                preFetchLoading: false,

                                showRefreshButton: false,

                                productsListArray: [...this.props.productsListArray]
                            }, _ => this.scrollToTop({ type: 'offset' }));
                        }}
                        style={{
                            position: 'absolute',
                            top: '30%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 16,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            backgroundColor: 'black',
                            zIndex: 999999999
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',

                            }}
                        >
                            {locales('labels.newProducts')}
                        </Text>
                    </Pressable>
                    : null
                }

                {locationsFlag ?
                    <Modal
                        animationType="fade"
                        visible={locationsFlag}
                        onRequestClose={() => this.setState({ locationsFlag: false })}>

                        <View
                            style={{
                                flex: 1,
                                height: deviceHeight,
                                width: deviceWidth,
                            }}
                        >
                            <Header
                                title={locales('labels.locationsFilter')}
                                onBackButtonPressed={_ => this.setState({
                                    locationsFlag: false,
                                    cities: tempCities,
                                    province: tempProvince,
                                    city: tempCity
                                })}
                                {...this.props}
                            />

                            <View style={{
                                padding: 20,
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                width: deviceWidth,
                                height: '70%'
                            }}>

                                <View style={[{ alignSelf: 'center' }, styles.labelInputPadding]}>
                                    <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                        {locales('labels.targetProvince')}
                                    </Text>
                                    <RNPickerSelect
                                        Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                        useNativeAndroidPickerStyle={false}
                                        onValueChange={this.setProvince}
                                        style={styles}
                                        value={province}
                                        disabled={categoriesLoading}
                                        placeholder={{
                                            label: locales('labels.pleaseSelectTargetProvince'),
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        }}
                                        items={[...provinces.map(item => ({
                                            label: item.province_name, value: item.id
                                        }))]}
                                    />
                                </View>

                                <View style={[{ marginTop: 30 }, styles.labelInputPadding]}>
                                    <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                        {locales('labels.targetCity')}
                                    </Text>
                                    {(provinceLoading || fetchCitiesLoading) ?
                                        <ActivityIndicator size="small" color="#00C569"
                                            style={{
                                                position: 'absolute', right: '15%', top: '2%',
                                                width: 50, height: 50, borderRadius: 25
                                            }}
                                        /> : null}
                                    <RNPickerSelect
                                        Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                        useNativeAndroidPickerStyle={false}
                                        onValueChange={this.setCity}
                                        disabled={provinceLoading || !province}
                                        style={styles}
                                        value={city}
                                        placeholder={{
                                            label: locales('labels.pleaseSelectTargetCity'),
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        }}
                                        items={[...cities.map(item => ({
                                            label: item.city_name, value: item.id
                                        }))]}
                                    />
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', justifyContent: 'space-between', marginVertical: 25,
                                    alignItems: 'center'
                                }}>
                                    <BuskoolButton
                                        style={[styles.loginButton, { width: '60%', padding: 10 }]}
                                        onPress={this.searchLocation}>
                                        <ActivityIndicator size="small" color="white"
                                            animating={selectedButton == 1 && !!productsListLoading}
                                            style={{
                                                justifyContent: 'center',
                                                position: 'absolute',
                                                left: 40,
                                                width: 30, height: 30, borderRadius: 15
                                            }}
                                        />
                                        <Text style={[styles.buttonText, {
                                            alignSelf: 'center', fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }]}>
                                            {locales('labels.applyFilter')}
                                        </Text>

                                    </BuskoolButton>
                                    {/* <Button
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

                                                </Button> */}
                                </View>

                            </View>
                        </View>
                    </Modal>
                    : null}

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
                            data={ENUMS.SORT_LIST.list}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderSortListItem}
                        />
                    </Modal>
                    : null}

                {!!totalCategoriesModalFlag ?
                    <Modal
                        animationType="fade"
                        visible={!!totalCategoriesModalFlag}
                        onRequestClose={() => this.setState({ totalCategoriesModalFlag: false })}>

                        <Header
                            title={locales('titles.allOfTheCategories')}
                            onBackButtonPressed={_ => this.setState({ totalCategoriesModalFlag: false })}
                            {...this.props}
                        />

                        <FlatList
                            data={categoriesList}
                            style={{ marginVertical: 8 }}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => this.renderCategoriesListItem(item, true)}
                        />

                    </Modal>
                    : null}

                {modals.length ?
                    <FlatList
                        data={modals}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderModalItem}
                    />
                    :
                    null}

                <Header
                    title={locales('labels.products')}
                    shouldShowBackButton={false}
                    {...this.props}
                />

                <View
                    style={{
                        backgroundColor: '#f2f2f2',
                        marginTop: 10
                    }}
                >
                    {/* <InputGroup style={{ borderRadius: 5, backgroundColor: '#F2F2F2' }}> */}
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        onPress={() => this.setState({ locationsFlag: true })}
                        style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            zIndex: 1,
                            top: '27%',
                            left: '1%'
                        }}
                    >
                        <Entypo
                            name='location-pin'
                            size={25}
                            style={{
                                color: (selectedCity) ||
                                    (province && provinces.find(item => item.id == province).province_name) ? '#556080' : '#777',

                            }} />
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
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
                    </Pressable>
                    <BuskoolTextInput
                        value={searchText}
                        ref={this.serachInputRef}
                        disabled={!!productsListLoading}
                        onChangeText={text => this.handleSearch(text)}
                        onSubmitEditing={this.submitSearching}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#777',
                            alignSelf: 'center',
                            right: '-8%',
                            width: '70%',
                            paddingVertical: 18,
                            paddingHorizontal: 10
                        }}
                        placeholderTextColor="#bebebe"
                        placeholder={locales('labels.searchProduct')} />
                    <FontAwesome5
                        name='search'
                        size={18}
                        style={{
                            color: '#7E7E7E',
                            marginHorizontal: 5,
                            position: 'absolute',
                            right: '1%',
                            top: '27%'
                        }}
                    />
                    {/* </InputGroup> */}

                </View>

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 1,
                        height: 50,
                        maxHeight: 50,
                    }}
                >
                    {this.renderAllCategoriesIcon()}

                    <FlatList
                        contentContainerStyle={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            minWidth: '100%'
                        }}
                        ref={this.categoryFiltersRef}
                        data={(isFilterApplied && searchText && searchText.length) ? [] : categoriesList}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        inverted={true}
                        ListEmptyComponent={this.renderCategoriesFilterListEmptyComponent}
                        ListHeaderComponent={this.renderFilterHeaderComponent}
                        renderItem={({ item }) => this.renderCategoriesListItem(item, false)}
                    />
                </View>

                <FlatList
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='none'
                    ref={this.props.productsListRef}
                    data={productsListArray}
                    ListEmptyComponent={this.renderProductListEmptyComponent}
                    ListFooterComponent={this.renderProductListFooterComponent}
                    ItemSeparatorComponent={({ _, leadingItem }) => !is_seller && this.renderItemSeparatorComponent(leadingItem)}
                    renderItem={this.renderProductListItem}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                    onRefresh={this.onProductListRefreshed}
                    onEndReached={this.onEndOfProductListReached}
                    onEndReachedThreshold={3}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                    removeClippedSubviews
                    maxToRenderPerBatch={3}
                    windowSize={10}
                    initialNumToRender={4}
                    numColumns={2}
                    // getItemLayout={this.getItemLayout}
                    style={{
                        backgroundColor: 'white'
                    }}
                    columnWrapperStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row-reverse'
                    }}

                />

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
        width: '60%',
        textAlign: 'center'
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        backgroundColor: '#FF9828',
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
        color: 'rgba(0,0,0,0.7)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#a8a8a8',
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
    profileReducer,
    authReducer
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

    const {
        loggedInUserId
    } = authReducer;

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

        userProfile,

        loggedInUserId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
        fetchAllProductsList: (item, isLoggedIn) => dispatch(productsListActions.fetchAllProductsList(item, false, isLoggedIn)),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)

