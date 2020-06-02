import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Icon, InputGroup, Input } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Product from './Product';
import Spin from '../../components/loading/loading';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import ENUMS from '../../enums';

let myTimeout;
class ProductsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sortModalFlag: false,
            searchText: undefined,
            from_record_number: 0,
            productsListArray: [],
            categoryModalFlag: false,
            to_record_number: 5,
            sort_by: ENUMS.SORT_LIST.values.BM,
            loaded: false,
            searchFlag: false
        }
    }

    serachInputRef = React.createRef();
    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();




    componentDidMount() {
        this.fetchAllProducts();
        this.props.fetchAllCategories();
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
        this.props.fetchAllProductsList(item);
    };


    handleSearch = (text) => {
        clearTimeout(myTimeout)
        const { from_record_number, to_record_number, sort_by } = this.state;

        this.setState({ searchText: text });
        let item = {
            from_record_number,
            to_record_number,
            sort_by
        };
        if (text)
            item = {
                from_record_number,
                search_text: text,
                to_record_number,
                sort_by
            };
        myTimeout = setTimeout(() => {
            this.props.fetchAllProductsList(item).then(_ => {
                this.setState({ searchFlag: true })
            });
        }, 1500);

    };

    changeLocation = event => {

    };

    sortProducts = id => {
        this.props.fetchAllSubCategories(id).then(_ => {
            this.setState({ categoryModalFlag: true })
        });
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
            categoriesLoading
        } = this.props;

        const { searchText, loaded, productsListArray, categoryModalFlag, sortModalFlag } = this.state;

        return (
            <>
                <Modal
                    animationType="slide"
                    visible={sortModalFlag}
                    onRequestClose={() => this.setState({ sortModalFlag: false })}>
                    <FlatList
                        data={ENUMS.SORT_LIST.list}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.setState({ sort_by: item.value }, () => {
                                    const { from_record_number, to_record_number, searchText } = this.state;
                                    let searchItem = {
                                        from_record_number,
                                        sort_by: item.value,
                                        to_record_number,
                                    };
                                    if (searchText && searchText.length) {
                                        searchItem = {
                                            from_record_number,
                                            sort_by: item.value,
                                            search_text: searchText,
                                            to_record_number
                                        }
                                    }
                                    this.props.fetchAllProductsList(searchItem).then(_ => {
                                        this.setState({ sortModalFlag: false, searchFlag: true })
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
                    <FlatList
                        data={subCategoriesList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.setState({ searchText: item.category_name }, () => {
                                    const { from_record_number, to_record_number, sort_by } = this.state;
                                    let searchItem = {
                                        from_record_number,
                                        sort_by,
                                        search_text: item.category_name,
                                        to_record_number,
                                    };
                                    this.props.fetchAllProductsList(searchItem).then(_ => {
                                        this.setState({ categoryModalFlag: false, searchFlag: true })
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
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.55,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.products')}
                        </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginTop: 5, padding: 4 }}>
                        <InputGroup style={{ backgroundColor: '#F2F2F2', borderRadius: 5 }}>
                            <TouchableOpacity
                                onPress={this.changeLocation}
                                style={{ flexDirection: 'row' }}>
                                <Entypo name='location-pin' size={25} color='#BEBEBE' />
                                <Text
                                    style={{ fontFamily: 'Vazir', color: '#BEBEBE', fontSize: 16 }}
                                >همه ایران</Text>
                            </TouchableOpacity>
                            <Input value={searchText}
                                ref={this.serachInputRef}
                                onChangeText={text => this.handleSearch(text)}
                                style={{ fontFamily: 'Vazir', height: 42, textAlignVertical: 'center' }}
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ sortModalFlag: true })}
                                style={{
                                    borderRadius: 18, marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    minWidth: deviceWidth * 0.25, borderWidth: 0.8, borderColor: '#060446'
                                }}>
                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#060446' }}>
                                    {locales('labels.sort')}
                                </Text>
                                <FontAwesome name='sort-amount-desc' size={20} color='#060446' />
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
                                        onPress={() => this.sortProducts(item.id)}
                                        style={{
                                            borderRadius: 18, padding: 5, marginHorizontal: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                            minWidth: deviceWidth * 0.25, borderWidth: 0.8, borderColor: '#7E7E7E'
                                        }}>
                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#7E7E7E' }}>
                                            {item.category_name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>

                </View>


                <Spin spinning={productsListLoading || categoriesLoading}>
                    <FlatList
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        ListEmptyComponent={<View style={{
                            alignSelf: 'center', justifyContent: 'flex-start', paddingTop: 80,
                            alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight
                        }}>
                            <FontAwesome5 name='box-open' size={30} color='#BEBEBE' />
                            <Text style={{ color: '#7E7E7E', fontFamily: 'Vazir-Bold-FD', fontSize: 28 }}>{locales('titles.noProductFound')}</Text>
                        </View>
                        }
                        getItemLayout={(data, index) => (
                            { length: deviceHeight * 0.39, offset: deviceHeight * 0.39 * index, index }
                        )}
                        extraData={this.state}
                        style={{ height: deviceHeight * 0.66 }}
                        onEndReached={() => {
                            if (loaded && productsListArray.length >= this.state.to_record_number)
                                this.setState({
                                    from_record_number: this.state.from_record_number + 5,
                                    to_record_number: this.state.to_record_number + 5,
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
                                    this.props.fetchAllProductsList(item).then(_ => {
                                        this.setState({ loaded: false })
                                    })
                                })
                        }}
                        initialNumToRender={2}
                        initialScrollIndex={0}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(_, index) => index.toString()}
                        data={productsListArray}
                        renderItem={({ item }) => <Product
                            minimumOrderRef={this.minimumOrderRef}
                            maximumPriceRef={this.maximumPriceRef}
                            amountRef={this.amountRef}
                            minimumPriceRef={this.minimumPriceRef}
                            productItem={item}
                            fetchAllProducts={this.fetchAllProducts}
                            {...this.props}
                        />}
                    />
                </Spin>

            </>
        )
    }
}

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

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories()),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList)