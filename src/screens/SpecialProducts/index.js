import React, { createRef, PureComponent } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import Svg, { Image as SvgImage, Defs, G, Circle as SvgCircle } from "react-native-svg";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import RNPickerSelect from 'react-native-picker-select';
import { Icon, InputGroup, Input, CardItem, Body, Item, Label, Button, Card } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import Product from '../ProductsList/Product';
import NoConnection from '../../components/noConnectionError';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import * as locationActions from '../../redux/locations/actions'
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import ENUMS from '../../enums';

let myTimeout;
class SpecialProducts extends PureComponent {
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
            specialProductsListArray: [],
            categoryModalFlag: false,
            to_record_number: 16,
            searchLoader: false,
            sort_by: ENUMS.SORT_LIST.values.BM,
            loaded: false,
            searchFlag: false,
            showModal: false,
            selectedCategoryModal: ''
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
            screen_name: "special_products",
            screen_class: "special_products",
        });

        this.fetchAllProducts();
        this.initialCalls()
        // .catch(error => {
        //     this.setState({ showModal: true })
        // });

    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.loaded == false && this.props.specialProductsListArray.length) {
            this.setState({
                loaded: true,
                specialProductsListArray: [...this.state.specialProductsListArray, ...this.props.specialProductsListArray],
            })
        }

        if (this.state.searchFlag) {
            this.setState({ specialProductsListArray: [...this.props.specialProductsListArray], searchFlag: false })
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
        this.props.fetchAllSpecialProductsList(item).then(result => {
            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && result.payload.products.length > 0 && !this.props.specialProductsListLoading)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
        })
        // .catch(error => {
        //     this.setState({ showModal: true })
        // });
    };


    handleSearch = (text) => {

        clearTimeout(myTimeout)
        const { sort_by, province, city } = this.state;

        this.setState({ searchText: text });
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

            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && this.state.specialProductsListArray.length > 0 && !this.props.specialProductsListLoading)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
            if (province) {
                item = { ...item, province_id: province }
            }
            if (city) {
                item = { ...item, city_id: city }
            }

            this.props.fetchAllSpecialProductsList(item).then(_ => {
                analytics().logEvent('search_text', {
                    text
                })
                this.setState({ searchFlag: true, to_record_number: 16, from_record_number: 0, searchLoader: false })
            })
            // .catch(error => {
            //     this.setState({ showModal: true })
            // });
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

        this.props.fetchAllSpecialProductsList(item).then(_ => {
            analytics().logEvent('search_text', {
                text
            })
            this.setState({ searchFlag: true, to_record_number: 16, from_record_number: 0, searchLoader: false })
        }).catch(error => {
            this.setState({
                //  showModal: true, 
                searchFlag: false, categoryModalFlag: false, locationsFlag: false, sortModalFlag: false, searchLoader: false
            })
        });
    };

    sortProducts = (id, name) => {
        analytics().logEvent('apply_sort', {
            sort_type: name
        })
        this.setState({ categoryModalFlag: true, selectedCategoryModal: name }, () => {
            this.props.fetchAllSubCategories(id).catch(error => {
                this.setState({
                    //  showModal: true,
                    categoryModalFlag: false
                })
            })
        })
    };

    renderItemSeparatorComponent = (leading = [{}]) => {

        const {
            userProfile = {}
        } = this.props;
        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller = true
        } = user_info;

        const { specialProductsListArray } = this.state;
        const foundIndex = specialProductsListArray.findIndex(item => item?.main?.id == leading[0]?.main?.id);

        if ((foundIndex + 1) % 9 != 0)
            return null;
        return (
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


    setProvince = (value, index) => {
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value, provinceError: '' })
            this.props.fetchAllProvinces(value).catch(error => {
                // this.setState({ showModal: true })
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

        return this.props.fetchAllSpecialProductsList(searchItem).then(result => {
            if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                this.props.productsListRef.current && this.props.productsListRef.current != null &&
                this.props.productsListRef.current != undefined && result.payload.products.length > 0 && !this.props.specialProductsListLoading)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
            this.setState({ locationsFlag: false, from_record_number: 0, to_record_number: 16, specialProductsListArray: [...result.payload.products] })
        }).catch(error => {
            // this.setState({ showModal: true })
        });;

    };

    deleteFilter = () => {
        const { searchText, province, city, sort_by } = this.state;
        this.setState({ selectedButton: 2 });
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

        this.props.fetchAllSpecialProductsList(searchItem).then(result => {
            this.setState({ locationsFlag: false, from_record_number: 0, to_record_number: 16, province: '', city: '', specialProductsListArray: [...result.payload.products] })
        }).catch(error => {
            // this.setState({ showModal: true })
        });;

    };


    renderProductListEmptyComponent = _ => {

        const { specialProductsListLoading } = this.props;

        if (!specialProductsListLoading)
            return (
                <View style={{
                    alignSelf: 'center', justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight * 0.7
                }}>
                    <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                    <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>
                        {locales('titles.noProductFound')}</Text>
                    {
                        !!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.is_seller ? <View >
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
        if (!this.state.loaded || specialProductsListLoading) {
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

    render() {
        const {
            specialProductsListObject,
            specialProductsListLoading,
            specialProductsListFailed,
            specialProductsListMessage,
            specialProductsListError,
            subCategoriesList,
            categoriesList,
            categoriesLoading,
            subCategoriesLoading,

            allProvincesObject,
            allCitiesObject
        } = this.props;

        const { searchText, loaded, specialProductsListArray, selectedButton, searchLoader,
            categoryModalFlag, sortModalFlag, locationsFlag, sort_by, province, city, selectedCategoryModal } = this.state;

        let { provinces = [] } = allProvincesObject;

        let cities = [];
        provinces = provinces.map(item => ({ ...item, value: item.id }));

        if (allCitiesObject && Object.entries(allCitiesObject).length) {
            cities = allCitiesObject.cities.map(item => ({ ...item, value: item.id }))
        }
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
                                                    style={styles}
                                                    value={province}
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
                                                    animating={selectedButton == 1 && !!specialProductsListLoading}
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
                                                    animating={selectedButton == 2 && !!specialProductsListLoading}
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
                        refreshing={specialProductsListLoading || categoriesLoading}
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
                                onPress={() => !specialProductsListLoading && this.setState({ sort_by: item.value }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                                        this.props.productsListRef.current && this.props.productsListRef.current != null &&
                                        this.props.productsListRef.current != undefined && this.state.specialProductsListArray.length > 0 && !this.props.specialProductsListLoading)
                                        this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
                                    const { searchText } = this.state;
                                    let searchItem = {
                                        from_record_number: 0,
                                        sort_by: item.value,
                                        to_record_number: 16,
                                    };
                                    if (searchText && searchText.length) {
                                        searchItem = {
                                            from_record_number: 0,
                                            sort_by: item.value,
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

                                    this.props.fetchAllSpecialProductsList(searchItem).then(_ => {
                                        this.setState({ sortModalFlag: false, searchFlag: true, from_record_number: 0, to_record_number: 16 })
                                    }).catch(error => {
                                        this.setState({
                                            //  showModal: true, 
                                            sortModalFlag: false
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
                        refreshing={subCategoriesLoading || specialProductsListLoading}
                        onRefresh={() => <ActivityIndicator size="small" color="#00C569"
                            style={{
                                position: 'absolute', right: '15%', top: '2%',
                                width: 50, height: 50, borderRadius: 25
                            }}
                        />}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => !specialProductsListLoading && this.setState({ searchText: item.category_name }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef != null && this.props.productsListRef != undefined &&
                                        this.props.productsListRef.current && this.props.productsListRef.current != null &&
                                        this.props.productsListRef.current != undefined && this.state.specialProductsListArray.length > 0 && !this.props.specialProductsListLoading)
                                        this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
                                    const { sort_by } = this.state;
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

                                    this.props.fetchAllSpecialProductsList(searchItem).then(_ => {
                                        this.setState({ categoryModalFlag: false, from_record_number: 0, to_record_number: 16, searchFlag: true })
                                    }).catch(error => {
                                        this.setState({
                                            //  showModal: true, 
                                            categoryModalFlag: false
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
                            {locales('labels.specialProducts')}
                        </Text>
                    </View>
                </View>


                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginTop: 5, padding: 4 }}>
                        <InputGroup style={{ backgroundColor: '#f2f2f2', borderRadius: 5 }}>
                            <TouchableOpacity
                                onPress={() => !specialProductsListLoading && this.setState({ locationsFlag: true })}
                                style={{ flexDirection: 'row' }}>
                                <Entypo name='location-pin' size={25} style={{
                                    color: (city && cities.find(item => item.id == city).city_name) ||
                                        (province && provinces.find(item => item.id == province).province_name) ? '#556080' : '#777',

                                }} />
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#777', fontSize: 16,
                                        color: (city && cities.find(item => item.id == city).city_name) ||
                                            (province && provinces.find(item => item.id == province).province_name) ? '#556080' : '#777',

                                    }}
                                >
                                    {
                                        (city && cities.find(item => item.id == city).city_name) ||
                                        (province && provinces.find(item => item.id == province).province_name) ||
                                        locales('titles.AllIran')
                                    }
                                </Text>
                            </TouchableOpacity>
                            <Input value={searchText}
                                ref={this.serachInputRef}
                                disabled={!!specialProductsListLoading}
                                onEndEditing={_ => this.setState({ searchLoader: true })}
                                onSubmitEditing={this.submitSearching}
                                onChangeText={text => this.handleSearch(text)}
                                style={{ paddingBottom: 10, fontFamily: 'IRANSansWeb(FaNum)_Medium', textAlignVertical: 'bottom' }}
                                placeholderTextColor="#bebebe"
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={() => !specialProductsListLoading && this.setState({ sortModalFlag: true })}
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
                                        onPress={() => !specialProductsListLoading && this.sortProducts(item.id, item.category_name)}
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
                    keyboardShouldPersistTaps='handled'
                    ListEmptyComponent={this.renderProductListEmptyComponent}
                    // getItemLayout={(data, index) => (
                    //     { length: deviceHeight * 0.3, offset: deviceHeight * 0.3 * index, index }
                    // )}
                    extraData={this.state}
                    ref={this.props.productsListRef}
                    onEndReached={() => {
                        if (loaded && specialProductsListArray.length >= this.state.to_record_number)
                            this.setState({
                                from_record_number: this.state.from_record_number + 16,
                                to_record_number: this.state.to_record_number + 16,
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

                                this.props.fetchAllSpecialProductsList(item).then(_ => {
                                    this.setState({ loaded: false })
                                }).catch(error => {
                                    // this.setState({ showModal: true })
                                });
                            })
                    }}
                    // initialNumToRender={2}
                    // initialScrollIndex={0}
                    refreshing={((!loaded && specialProductsListLoading) || categoriesLoading)
                        ||
                        (!!specialProductsListLoading && !!searchLoader)
                    }
                    onRefresh={() => {
                        let item = {
                            from_record_number: 0,
                            sort_by: this.state.sort_by,
                            to_record_number: 16,
                        };
                        if (searchText && searchText.length) {
                            item = {
                                from_record_number: 0,
                                sort_by: this.state.sort_by,
                                to_record_number: 16,
                                search_text: this.state.searchText
                            }
                        }
                        if (province) {
                            item = { ...item, province_id: province }
                        }
                        if (city) {
                            item = { ...item, city_id: city }
                        }

                        this.props.fetchAllSpecialProductsList(item).then(result => {
                            this.setState({
                                specialProductsListArray: [...result.payload.products],
                                from_record_number: 0,
                                to_record_number: 16
                            })
                        }).catch(error => {
                            // this.setState({ showModal: true })
                        });
                    }
                    }
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={() => {
                        return ((loaded && specialProductsListLoading)) ?
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
                    }}
                    keyExtractor={(_, index) => index.toString()}
                    data={specialProductsListArray}
                    horizontal={false}
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    columnWrapperStyle={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}
                    ItemSeparatorComponent={({ _, leadingItem }) => this.renderItemSeparatorComponent(leadingItem)}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{
                                    width: '47%', margin: 5,
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
        paddingHorizontal: 10,
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
        specialProductsListArray: state.productsListReducer.specialProductsListArray,
        specialProductsListObject: state.productsListReducer.specialProductsListObject,
        specialProductsListLoading: state.productsListReducer.specialProductsListLoading,
        specialProductsListError: state.productsListReducer.specialProductsListError,
        specialProductsListFailed: state.productsListReducer.specialProductsListFailed,
        specialProductsListMessage: state.productsListReducer.specialProductsListMessage,

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

        userProfile: state.profileReducer.userProfile

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(false)),
        fetchAllSpecialProductsList: item => dispatch(productsListActions.fetchAllSpecialProductsList(item, true)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id)),
        fetchAllProvinces: (provinceId) => dispatch(locationActions.fetchAllProvinces(provinceId)),
        fetchAllCities: () => dispatch(locationActions.fetchAllCities()),

    }
};


const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <SpecialProducts {...props} productsListRef={ref} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)

