import React, { createRef, PureComponent } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon, InputGroup, Input, CardItem, Body, Item, Label, Button, Card } from 'native-base';


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
            refreshed: false,
            searchText: undefined,
            from_record_number: 0,
            productsListArray: [],
            categoryModalFlag: false,
            to_record_number: 15,
            sort_by: ENUMS.SORT_LIST.values.BM,
            loaded: false,
            searchFlag: false,
            showModal: false,
            selectedCategoryModal: ''
        }

    }


    productsListRef = createRef();

    componentDidMount() {

        this.fetchAllProducts();
        this.initialCalls().catch(error => {
            this.setState({ showModal: true })
        });
        if (this.props.productDetailsId) {
            this.props.navigation.navigate(`ProductDetails${this.props.productDetailsId}`, { productId: this.props.productDetailsId })
        }

    }

    componentDidUpdate(prevProps, prevState) {

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
        this.props.fetchAllProductsList(item).then(_ => {
            if (this.props.productsListRef && this.props.productsListRef.current && this.props.productsListArray.length)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
        }).catch(error => {
            this.setState({ showModal: true })
        });
    };


    handleSearch = (text) => {
        clearTimeout(myTimeout)
        const { sort_by, province, city } = this.state;

        this.setState({ searchText: text });
        let item = {
            sort_by,
            from_record_number: 0,
            to_record_number: 15
        };
        if (text)
            item = {
                search_text: text,
                sort_by,
            };
        myTimeout = setTimeout(() => {

            if (this.props.productsListRef && this.props.productsListRef.current && this.props.productsListArray.length)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 })
            if (province) {
                item = { ...item, province_id: province }
            }
            if (city) {
                item = { ...item, city_id: city }
            }

            this.props.fetchAllProductsList(item).then(_ => {
                this.setState({ searchFlag: true, to_record_number: 15, from_record_number: 0 })
            }).catch(error => {
                this.setState({ showModal: true })
            });
        }, 1500);

    };

    sortProducts = (id, name) => {
        this.setState({ categoryModalFlag: true, selectedCategoryModal: name }, () => {
            this.props.fetchAllSubCategories(id).catch(error => {
                this.setState({ showModal: true, categoryModalFlag: false })
            })
        })
    };



    setProvince = (value, index) => {
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value, provinceError: '' })
            this.props.fetchAllProvinces(value).catch(error => {
                this.setState({ showModal: true })
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
            if (this.props.productsListRef && this.props.productsListRef.current && this.props.productsListArray.length)
                this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 });
            this.setState({ locationsFlag: false, from_record_number: 0, to_record_number: 15, productsListArray: [...result.payload.products] })
        }).catch(error => {
            this.setState({ showModal: true })
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
            this.setState({ showModal: true })
        });;

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
            allCitiesObject
        } = this.props;

        const { searchText, loaded, productsListArray, selectedButton,
            categoryModalFlag, sortModalFlag, locationsFlag, province, city, selectedCategoryModal } = this.state;

        let { provinces = [] } = allProvincesObject;

        let cities = [];
        provinces = provinces.map(item => ({ ...item, value: item.id }));

        if (Object.entries(allCitiesObject).length) {
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
                        height: 57,
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
                                                    Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
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
                                                    Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
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
                        height: 57,
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
                                {locales('labels.sort')}
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
                                onPress={() => this.setState({ sort_by: item.value }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef.current && this.props.productsListArray.length)
                                        this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 })
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
                                        this.setState({ showModal: true, sortModalFlag: false })
                                    });
                                })}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                                }}>
                                <Ionicons name='ios-arrow-back' size={30} color='#BEBEBE' />
                                <Text style={{ fontSize: 18, color: '#7E7E7E' }}>{item.title}</Text>
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
                        height: 57,
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
                                onPress={() => this.setState({ searchText: item.category_name }, () => {
                                    if (this.props.productsListRef && this.props.productsListRef.current && this.props.productsListArray.length)
                                        this.props.productsListRef.current.scrollToIndex({ animated: true, index: 0 })

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
                                        this.setState({ showModal: true, categoryModalFlag: false })
                                    });
                                })}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                                }}>
                                <Ionicons name='ios-arrow-back' size={30} color='#BEBEBE' />
                                <Text style={{ fontSize: 18, color: '#7E7E7E' }}>{item.category_name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
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
                        <InputGroup style={{ backgroundColor: '#F2F2F2', borderRadius: 5 }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ locationsFlag: true })}
                                style={{ flexDirection: 'row' }}>
                                <Entypo name='location-pin' size={25} color='#BEBEBE' />
                                <Text
                                    style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', color: '#BEBEBE', fontSize: 16 }}
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
                                onChangeText={text => this.handleSearch(text)}
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', textAlignVertical: 'bottom' }}
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ sortModalFlag: true })}
                                style={{
                                    borderRadius: 18, marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    minWidth: 110, backgroundColor: '#556080', minHeight: 35
                                }}>
                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#fff', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                    {locales('labels.sort')}
                                </Text>
                                <FontAwesome name='sort-amount-desc' size={16} color='#fff' />
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
                                        onPress={() => this.sortProducts(item.id, item.category_name)}
                                        style={{
                                            borderRadius: 18, padding: 5, marginHorizontal: 3, flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'center',
                                            minWidth: deviceWidth * 0.25, borderWidth: 1, borderColor: '#7E7E7E', backgroundColor: '#eee'
                                        }}>
                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
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
                    ListEmptyComponent={!productsListLoading && <View style={{
                        alignSelf: 'center', justifyContent: 'center',
                        alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight * 0.7
                    }}>
                        <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                        <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noProductFound')}</Text>
                    </View>
                    }
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
                                    this.setState({ showModal: true })
                                });
                            })
                    }}
                    // initialNumToRender={2}
                    // initialScrollIndex={0}
                    refreshing={productsListLoading || categoriesLoading}
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
                                search_text: this.statesearchText
                            }
                        }
                        if (province) {
                            item = { ...item, province_id: province }
                        }
                        if (city) {
                            item = { ...item, city_id: city }
                        }

                        this.props.fetchAllProductsList(item).catch(error => {
                            this.setState({ showModal: true })
                        });
                    }
                    }
                    onEndReachedThreshold={0.2}
                    keyExtractor={(_, index) => index.toString()}
                    data={productsListArray}
                    renderItem={({ item }) => <Product
                        productItem={item}
                        fetchAllProducts={this.fetchAllProducts}
                        {...this.props}
                    />}
                />

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
        fontSize: 16,
        paddingHorizontal: 10,
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        paddingVertical: 8,
        height: 60,
        width: deviceWidth * 0.9,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
        left: 30,
        top: 17,
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


    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(false)),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item, true)),
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
