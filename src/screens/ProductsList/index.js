import React, { createRef, PureComponent } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import { useScrollToTop } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Svg, { Image as SvgImage, Defs, G, Circle as SvgCircle } from "react-native-svg";
import { Icon, InputGroup, Input, CardItem, Body, Item, Label, Button, Card } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Product from './Product';
import LinearGradient from 'react-native-linear-gradient';

import NoConnection from '../../components/noConnectionError';
import * as homeActions from '../../redux/home/actions';
import * as profileActions from '../../redux/profile/actions';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import * as locationActions from '../../redux/locations/actions'
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
// import Ionicons from 'react-native-vector-icons/dist/Ionicons';
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
            refreshed: false,
            searchText: undefined,
            from_record_number: 0,
            productsListArray: [],
            disableSubCategory: false,
            categoryModalFlag: false,
            to_record_number: 15,
            sort_by: ENUMS.SORT_LIST.values.BM,
            searchLoader: false,
            loaded: false,
            searchFlag: false,
            showModal: false,
            selectedCategoryModal: '',
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

        this.fetchAllProducts();
        this.initialCalls().catch(error => {
            this.setState({
                // showModal: true,
                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });
        if (this.props.productDetailsId) {
            this.props.navigation.navigate(`ProductDetails${this.props.productDetailsId}`, { productId: this.props.productDetailsId })
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.updateProductsListFlag) {
            let item = {
                from_record_number: 0,
                sort_by: ENUMS.SORT_LIST.values.BM,
                to_record_number: 15,
            };
            this.props.fetchAllProductsList(item).then(result => {
                this.setState({
                    productsListArray: [...this.props.productsListArray],
                    to_record_number: 15,
                    from_record_number: 0
                })
            })
            this.props.updateProductsList(false)
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
                to_record_number: 15,
            };
            this.props.fetchAllProductsList(item).then(result => {
                this.setState({
                    productsListArray: [...result.payload.products],
                    to_record_number: 15,
                    from_record_number: 0
                }, () => {
                    setTimeout(() => {
                        if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                            this.props.productsListRef.current && this.props.productsListRef.current != null &&
                            this.props.productsListRef.current != undefined && result.payload.products.length > 0 && !this.props.productsListLoading) {
                            this.props.productsListRef.current.scrollToOffset({ animated: true, offset: 0 });
                        }
                    }, 300);
                })
            })
        }

        if (this.state.loaded == false && this.props.productsListArray.length) {
            this.setState({
                loaded: true,
                productsListArray: [...this.state.productsListArray, ...this.props.productsListArray],
            })
        }

        if (this.state.searchFlag) {
            this.setState({ productsListArray: [...this.props.productsListArray], searchFlag: false })
        }


        if (this.state.refreshed) {
            this.setState({ productsListArray: [...this.props.productsListArray], refreshed: false })
        }
    }

    initialCalls = _ => {
        return new Promise((resolve, reject) => {
            this.props.fetchAllProvinces().catch(error => reject(error));
            this.props.fetchAllCategories().catch(error => reject(error));
        })

    }

    setShowModal = _ => {
        this.setState({ showModal: false }, () => {
            this.componentDidMount();
        });
    }

    fetchAllProducts = () => {
        const { from_record_number, to_record_number, sort_by, searchText } = this.state;

        let item = {
            from_record_number,
            sort_by,
            to_record_number,
        };
        if (searchText && searchText.length) {
            item = {
                from_record_number,
                sort_by,
                search_text: searchText,
                to_record_number,
            };
        };
        this.props.fetchAllProductsList(item).then(result => {
            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && result.payload.products.length > 0 && !this.props.productsListLoading)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
        }).catch(error => {
            this.setState({
                //  showModal: true,
                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });
    };


    handleSearch = (text) => {


        clearTimeout(myTimeout)
        const { sort_by, province, city } = this.state;

        this.setState({ searchText: text, searchLoader: true });
        let item = {
            sort_by,
            from_record_number: 0,
            to_record_number: 15
        };
        if (text)
            item = {
                ...item,
                search_text: text,
                sort_by,
            };
        myTimeout = setTimeout(() => {
            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && this.state.productsListArray.length > 0 && !this.props.productsListLoading) {
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
            }
            if (province) {
                item = { ...item, province_id: province }
            }
            if (city) {
                item = { ...item, city_id: city }
            }

            this.props.fetchAllProductsList(item).then(_ => {
                analytics().logEvent('search_text', {
                    text
                })
                this.setState({ searchFlag: true, to_record_number: 15, from_record_number: 0, searchLoader: false })
            }).catch(error => {
                this.setState({
                    //  showModal: true, 
                    searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false, searchLoader: false
                })
            });
        }, 1500);

    };

    sortProducts = (id, name) => {

        analytics().logEvent('apply_sort', {
            sort_type: name
        })
        this.setState({ categoryModalFlag: true, selectedCategoryModal: name }, () => {
            this.props.fetchAllSubCategories(id).catch(error => {
                this.setState({
                    // showModal: true,
                    searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                })
            })
        })
    };



    setProvince = (value, index) => {
        this.setState({ disableSubCategory: true })
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value, provinceError: '', cityError: '', city: '' })
            this.props.fetchAllProvinces(value).then(result => {
                this.setState({ disableSubCategory: false })
            }).catch(error => {
                this.setState({
                    //  showModal: true,
                    searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                })
            });
        }
    };

    setCity = (value) => {
        if (!!value)
            this.setState({ city: value, cityError: '' })
    };

    searchLocation = () => {
        const { searchText, province, city, sort_by } = this.state;
        this.setState({ selectedButton: 1 });
        let searchItem = {
            from_record_number: 0,
            sort_by,
            to_record_number: 15,
        };
        if (searchText && searchText.length) {
            searchItem = {
                from_record_number: 0,
                sort_by,
                search_text: searchText,
                to_record_number: 15
            }
        }
        if (province) {
            searchItem = { ...searchItem, province_id: province }
        }
        if (city) {
            searchItem = { ...searchItem, city_id: city }
        }

        return this.props.fetchAllProductsList(searchItem).then(result => {
            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && result.payload.products.length > 0 && !this.props.productsListLoading)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
            this.setState({ locationsFlag: false, from_record_number: 0, to_record_number: 15, productsListArray: [...result.payload.products] })
        }).catch(error => {
            this.setState({
                //  showModal: true, 
                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });;

    };

    deleteFilter = () => {
        const { searchText, province, city, sort_by } = this.state;
        this.setState({ selectedButton: 2 });
        let searchItem = {
            from_record_number: 0,
            sort_by,
            to_record_number: 15,
        };
        if (searchText && searchText.length) {
            searchItem = {
                from_record_number: 0,
                sort_by,
                search_text: searchText,
                to_record_number: 15
            }
        }

        this.props.fetchAllProductsList(searchItem).then(result => {
            this.setState({ locationsFlag: false, from_record_number: 0, to_record_number: 15, province: '', city: '', productsListArray: [...result.payload.products] })
        }).catch(error => {
            this.setState({
                //  showModal: true, 
                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
            })
        });;

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

        if (!productsListLoading)
            return (
                <View style={{
                    alignSelf: 'center', justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight * 0.7
                }}>
                    <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                    <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>
                        {locales('titles.noProductFound')}</Text>
                    {
                        is_seller ? <View >
                            <Button
                                onPress={() => this.props.navigation.navigate('RegisterProductStack')}

                                style={styles.loginButton}>
                                <Text style={[styles.buttonText, { width: deviceWidth * 0.9, fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>
                                    {locales('titles.registerNewProduct')}
                                </Text>
                            </Button>
                        </View> : <View >
                            <Button
                                onPress={() => this.props.navigation.navigate('RegisterRequest')}

                                style={styles.loginButton}>
                                <Text style={[styles.buttonText, { width: deviceWidth * 0.9, fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>
                                    {locales('titles.registerBuyAdRequest')}
                                </Text>
                            </Button>
                        </View>}
                </View>
            )
        if (!this.state.loaded || productsListLoading) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}>
                    {[1, 2, 3, 4, 5, 6].map((_, index) =>
                        // <ContentLoader key={index} />
                        <View
                            key={index}
                            style={{
                                borderRadius: 5,
                                borderWidth: 2,
                                borderColor: '#eee',
                                paddingBottom: 10,
                                marginBottom: 15

                            }}>
                            <ContentLoader
                                speed={2}
                                width={deviceWidth}
                                height={deviceHeight * 0.3}
                                viewBox="0 0 500 263"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"

                            >

                                <Rect x="296" y="24" rx="3" ry="3" width="88" height="10" />
                                <Rect x="273" y="47" rx="3" ry="3" width="110" height="8" />
                                <Rect x="79" y="96" rx="3" ry="3" width="209" height="15" />
                                <Rect x="149" y="141" rx="3" ry="3" width="139" height="15" />
                                <Rect x="196" y="185" rx="3" ry="3" width="93" height="15" />
                                <Circle cx="430" cy="39" r="30" />
                                <Rect x="17" y="30" rx="8" ry="8" width="84" height="17" />
                                <Rect x="337" y="88" rx="3" ry="3" width="122" height="122" />
                                <Rect x="0" y="74" rx="0" ry="0" width="472" height="2" />
                                <Circle cx="309" cy="105" r="12" />
                                <Circle cx="309" cy="148" r="12" />
                                <Circle cx="309" cy="191" r="12" />
                                <Rect x="15" y="223" rx="3" ry="3" width="445" height="46" />
                            </ContentLoader>
                        </View>
                    )}
                </View>
            )
        }
        return null;
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
            </ImageBackground>
        )
    };

    render() {
        const {
            productsListObject,
            productsListLoading,
            productsListFailed,
            productsListMessage,
            productsListError,
            subCategoriesList,
            categoriesList,
            categoriesLoading,
            subCategoriesLoading,

            allProvincesObject,
            allCitiesObject,
            userProfile = {}
        } = this.props;

        const { user_info = {} } = userProfile;
        const {
            is_seller
        } = user_info;

        const { searchText, loaded, productsListArray, selectedButton, searchLoader,
            categoryModalFlag, sortModalFlag, locationsFlag, sort_by, province, city, selectedCategoryModal } = this.state;

        let { provinces = [] } = allProvincesObject;

        let cities = [];
        provinces = provinces.map(item => ({ ...item, value: item.id }));

        if (allCitiesObject && Object.entries(allCitiesObject).length) {
            cities = allCitiesObject.cities.map(item => ({ ...item, value: item.id }))
        }

        let selectedCity = (city && cities.some(item => item.id == city)) ? cities.find(item => item.id == city).city_name : '';
        return (
            <>
                <NoConnection
                    closeModal={this.setShowModal}
                    showModal={this.state.showModal}
                />

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
                            style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
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
                                                    onOpen={() => { this.setState({ disableSubCategory: true }) }}
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
                                            {(this.props.provinceLoading || this.props.fetchCitiesLoading) ?
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
                                                    disabled={categoriesLoading || subCategoriesLoading || this.state.disableSubCategory}
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
                        refreshing={productsListLoading || categoriesLoading}
                        onRefresh={() => <ActivityIndicator size="small" color="#00C569"
                            style={{
                                position: 'absolute', right: '15%', top: '2%',
                                width: 50, height: 50, borderRadius: 25
                            }}
                        />}
                        data={ENUMS.SORT_LIST.list}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => !productsListLoading && this.setState({ sort_by: item.value }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                                        this.props.productsListRef.current && this.props.productsListRef.current != null &&
                                        this.props.productsListRef.current != undefined && this.state.productsListArray.length > 0 && !this.props.productsListLoading)
                                        this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
                                    const { searchText } = this.state;
                                    let searchItem = {
                                        from_record_number: 0,
                                        sort_by: item.value,
                                        to_record_number: 15,
                                    };
                                    if (searchText && searchText.length) {
                                        searchItem = {
                                            from_record_number: 0,
                                            sort_by: item.value,
                                            search_text: searchText,
                                            to_record_number: 15
                                        }
                                    }
                                    if (province) {
                                        searchItem = { ...searchItem, province_id: province }
                                    }
                                    if (city) {
                                        searchItem = { ...searchItem, city_id: city }
                                    }

                                    this.props.fetchAllProductsList(searchItem).then(_ => {
                                        this.setState({ sortModalFlag: false, searchFlag: true, from_record_number: 0, to_record_number: 15 })
                                    }).catch(error => {
                                        this.setState({
                                            // showModal: true, 
                                            searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                                        })
                                    });
                                })}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth,
                                    color: '#e41c38'
                                }}>
                                {sort_by == item.value ? <FontAwesome5 name='check' size={26} color='#00C569' /> : <FontAwesome5 name='angle-left' size={26} color='#777' />}
                                <Text style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: sort_by == item.value ? '#00C569' : '#777' }}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>

                <Modal
                    animationType="slide"
                    visible={categoryModalFlag}
                    onRequestClose={() => this.setState({ categoryModalFlag: false })}>

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
                            onPress={() => this.setState({ categoryModalFlag: false })}
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
                                {selectedCategoryModal}
                            </Text>
                        </View>
                    </View>
                    <FlatList
                        data={subCategoriesList}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={subCategoriesLoading || productsListLoading}
                        onRefresh={() => <ActivityIndicator size="small" color="#00C569"
                            style={{
                                position: 'absolute', right: '15%', top: '2%',
                                width: 50, height: 50, borderRadius: 25
                            }}
                        />}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => !productsListLoading && this.setState({ searchText: item.category_name }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                                        this.props.productsListRef.current && this.props.productsListRef.current != null &&
                                        this.props.productsListRef.current != undefined && this.state.productsListArray.length > 0 && !this.props.productsListLoading)
                                        setTimeout(() => {
                                            this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
                                        }, 300);

                                    const { sort_by } = this.state;
                                    let searchItem = {
                                        from_record_number: 0,
                                        sort_by,
                                        search_text: item.category_name,
                                        to_record_number: 15,
                                    };
                                    if (province) {
                                        searchItem = { ...searchItem, province_id: province }
                                    }
                                    if (city) {
                                        searchItem = { ...searchItem, city_id: city }
                                    }

                                    this.props.fetchAllProductsList(searchItem).then(_ => {
                                        this.setState({ categoryModalFlag: false, from_record_number: 0, to_record_number: 15, searchFlag: true })
                                    }).catch(error => {
                                        this.setState({
                                            //  showModal: true, 
                                            searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                                        })
                                    });
                                })}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                                }}>
                                <FontAwesome5 name='angle-left' size={26} color='#777' />
                                <Text style={{ fontSize: 18, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>{item.category_name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>

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
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', paddingBottom: 10, color: '#777', textAlignVertical: 'bottom' }}
                                placeholderTextColor="#bebebe"
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={() => !productsListLoading && this.setState({ sortModalFlag: true })}
                                style={{
                                    borderRadius: 18, marginTop: 7, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    minWidth: 110, backgroundColor: '#556080', minHeight: 30
                                }}>
                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#fff', marginRight: 2, fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
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
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => !productsListLoading && this.sortProducts(item.id, item.category_name)}
                                        style={{
                                            borderRadius: 18, marginHorizontal: 5, flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'center',
                                            minWidth: 85, borderWidth: 1, borderColor: '#7E7E7E', backgroundColor: '#eee', minHeight: 30
                                        }}>
                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                            {item.category_name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>

                </View>


                <FlatList
                    keyboardDismissMode='on-drag'
                    // ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    keyboardShouldPersistTaps='handled'
                    ListEmptyComponent={this.renderProductListEmptyComponent}
                    // getItemLayout={(data, index) => (
                    //     { length: deviceHeight * 0.3, offset: deviceHeight * 0.3 * index, index }
                    // )}
                    extraData={this.state}
                    ref={this.props.productsListRef}
                    onEndReached={() => {
                        if (loaded && productsListArray.length >= this.state.to_record_number)
                            this.setState({
                                from_record_number: this.state.from_record_number + 15,
                                to_record_number: this.state.to_record_number + 15,
                            }, () => {
                                const { from_record_number, to_record_number, sort_by, searchText } = this.state;

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
                                        searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                                    })
                                });
                            })
                    }}
                    onEndReachedThreshold={3.5}
                    // initialNumToRender={2}
                    ListFooterComponent={() => {
                        return ((loaded && productsListLoading)) ?
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
                            </View> : null
                    }
                    }
                    // initialScrollIndex={0}
                    // refreshing={(!loaded && productsListLoading) || categoriesLoading}
                    refreshing={!!productsListLoading && !!searchLoader}
                    onRefresh={() => {
                        let item = {
                            from_record_number: 0,
                            sort_by: this.state.sort_by,
                            to_record_number: 15,
                        };
                        if (searchText && searchText.length) {
                            item = {
                                from_record_number: 0,
                                sort_by: this.state.sort_by,
                                to_record_number: 15,
                                search_text: this.state.searchText
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
                                productsListArray: [...result.payload.products], from_record_number: 0, to_record_number: 15
                            })
                        }).catch(error => {
                            this.setState({
                                //  showModal: true,
                                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false
                            })
                        });
                    }
                    }
                    keyExtractor={(_, index) => index.toString()}
                    data={productsListArray}
                    style={{ backgroundColor: 'white' }}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                <Product
                                    productItem={item}
                                    fetchAllProducts={this.fetchAllProducts}
                                    {...this.props}
                                />
                                {!is_seller && this.renderItemSeparatorComponent(index)}
                            </>
                        )
                    }
                    }
                />

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

const mapStateToProps = (state) => {
    return {
        productsListArray: state.productsListReducer.productsListArray,
        productsListObject: state.productsListReducer.productsListObject,
        productsListLoading: state.productsListReducer.productsListLoading,
        productsListError: state.productsListReducer.productsListError,
        productsListFailed: state.productsListReducer.productsListFailed,
        productsListMessage: state.productsListReducer.productsListMessage,

        categoriesLoading: state.registerProductReducer.categoriesLoading,
        categoriesMessage: state.registerProductReducer.categoriesMessage,
        categoriesError: state.registerProductReducer.categoriesError,
        categoriesFailed: state.registerProductReducer.categoriesFailed,
        categoriesList: state.registerProductReducer.categoriesList,
        categories: state.registerProductReducer.categories,


        subCategoriesLoading: state.registerProductReducer.subCategoriesLoading,
        subCategoriesMessage: state.registerProductReducer.subCategoriesMessage,
        subCategoriesError: state.registerProductReducer.subCategoriesError,
        subCategoriesFailed: state.registerProductReducer.subCategoriesFailed,
        subCategoriesList: state.registerProductReducer.subCategoriesList,
        subCategories: state.registerProductReducer.subCategories,

        provinceLoading: state.locationsReducer.fetchAllProvincesLoading,
        provinceError: state.locationsReducer.fetchAllProvincesError,
        provinceFailed: state.locationsReducer.fetchAllProvincesFailed,
        provinceMessage: state.locationsReducer.fetchAllProvincesMessage,
        allProvincesObject: state.locationsReducer.allProvincesObject,

        fetchCitiesLoading: state.locationsReducer.fetchAllCitiesLoading,
        fetchCitiesError: state.locationsReducer.fetchAllCitiesError,
        fetchCitiesFailed: state.locationsReducer.fetchAllCitiesFailed,
        fetchCitiesMessage: state.locationsReducer.fetchAllCitiesMessage,
        allCitiesObject: state.locationsReducer.allCitiesObject,

        productDetailsId: state.productsListReducer.productDetailsId,

        updateProductsListFlag: state.productsListReducer.updateProductsListFlag,

        userProfile: state.profileReducer.userProfile,


    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(false)),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item, false)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id)),
        fetchAllProvinces: (provinceId) => dispatch(locationActions.fetchAllProvinces(provinceId)),
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

