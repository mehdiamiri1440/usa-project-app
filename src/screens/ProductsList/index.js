import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, InputGroup, Input } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Product from './Product';
import Spin from '../../components/loading/loading';
import * as productsListActions from '../../redux/productsList/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
class ProductsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            from_record_number: 0,
            productsListArray: [],
            to_record_number: 20,
            response_rate: null,
            sort_by: '',
            loaded: false
        }
    }

    serachInputRef = React.createRef();

    componentDidMount() {
        const { from_record_number, to_record_number, sort_by, response_rate } = this.state;

        let item = {
            from_record_number,
            // response_rate,
            // sort_by,
            to_record_number,
        };
        this.props.fetchAllProductsList(item);
        this.props.fetchAllCategories();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.loaded == false && this.props.productsListArray.length) {
            this.setState({
                loaded: true,
                productsListArray: [...this.state.productsListArray, ...this.props.productsListArray],
            })
        }
    }


    handleSearch = text => {
        const { productsListArray } = this.props;

    };

    changeLocation = event => {

    };

    sortProducts = event => {

    };

    render() {
        const {
            productsListObject,
            productsListLoading,
            productsListFailed,
            productsListMessage,
            productsListError,

            categoriesList,
            categoriesLoading
        } = this.props;

        const { searchText, loaded, productsListArray } = this.state;
        console.log('le', productsListArray.length)

        return (
            <>

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
                                onChangeText={this.handleSearch}
                                style={{ fontFamily: 'Vazir', height: 42, textAlignVertical: 'center' }}
                                placeholder={locales('labels.searchProduct')} />
                            <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                        </InputGroup>

                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity
                                onPress={this.sortProducts}
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
                                style={{ marginVertical: 8 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={this.sortProducts}
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
                        ListEmptyComponent={<Text>nothing</Text>}
                        getItemLayout={(data, index) => (
                            { length: productsListArray.length, offset: 100 * index, index }
                        )}
                        extraData={this.state}
                        style={{ height: deviceHeight * 0.68 }}
                        onEndReached={() => {
                            if (loaded && productsListArray.length >= 20)
                                this.setState({
                                    from_record_number: this.state.from_record_number + 20,
                                    to_record_number: this.state.to_record_number + this.state.from_record_number + 20,
                                }, () => {
                                    const { from_record_number, to_record_number, sort_by, response_rate } = this.state;

                                    let item = {
                                        from_record_number,
                                        // response_rate,
                                        // sort_by,
                                        to_record_number,
                                    };
                                    this.props.fetchAllProductsList(item).then(_ => {
                                        this.setState({ loaded: false })
                                    })
                                })
                        }}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        data={productsListArray}
                        renderItem={({ item }) => <Product productItem={item} />}
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


    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories()),
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList)