import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Icon, InputGroup, Input } from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Product from '../../ProductsList/Product';
import Spin from '../../../components/loading/loading';
import * as productsListActions from '../../../redux/productsList/actions';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import ENUMS from '../../../enums';

let myTimeout;
class MyProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sortModalFlag: false,
            refreshed: false,
            searchText: undefined,
            from_record_number: 0,
            myProductsArray: [],
            categoryModalFlag: false,
            to_record_number: 15,
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
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.loaded == false && this.props.myProductsArray.length) {
            this.setState({
                loaded: true,
                myProductsArray: [...this.state.myProductsArray, ...this.props.myProductsArray],
            })
        }

        if (this.state.searchFlag) {
            this.setState({ myProductsArray: [...this.props.myProductsArray], searchFlag: false })
        }


        if (this.state.refreshed) {
            this.setState({ myProductsArray: [...this.props.myProductsArray], refreshed: false })
        }
    }

    fetchAllProducts = () => {
        this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name);
    };


    render() {
        const {
            myProductsObject,
            myProductsLoading,
            myProductsFailed,
            myProductsMessage,
            myProductsError,
            subCategoriesList,
            categoriesList,
            categoriesLoading,
            subCategoriesLoading,
        } = this.props;

        const { searchText, loaded, myProductsArray, categoryModalFlag, sortModalFlag } = this.state;

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
                            {locales('labels.myProducts')}
                        </Text>
                    </View>
                </View>


                <FlatList
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    refreshing={myProductsLoading}
                    ListEmptyComponent={!myProductsLoading && <View style={{
                        alignSelf: 'center', justifyContent: 'center',
                        alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight * 0.78
                    }}>
                        <FontAwesome5 name='box-open' size={30} color='#BEBEBE' />
                        <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 22 }}>{locales('titles.noProductFound')}</Text>
                    </View>
                    }
                    // getItemLayout={(data, index) => (
                    //     { length: deviceHeight * 0.39, offset: deviceHeight * 0.39 * index, index }
                    // )}
                    extraData={this.state}
                    onEndReached={() => {
                        if (loaded && myProductsArray.length >= this.state.to_record_number)
                            this.setState({
                                from_record_number: this.state.from_record_number + 15,
                                to_record_number: this.state.to_record_number + 15,
                            }, () => {
                                this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name).then(_ => {
                                    this.setState({ loaded: false })
                                })
                            })
                    }}
                    // initialNumToRender={2}
                    // initialScrollIndex={0}
                    onRefresh={() => {
                        this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name).then(_ => {
                            this.setState({
                                searchText: '', sort_by: 'BM'
                                , refreshed: true, from_record_number: 0, to_record_number: 15
                            })
                        })
                    }
                    }
                    onEndReachedThreshold={0.2}
                    keyExtractor={(_, index) => index.toString()}
                    data={myProductsArray}
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

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        myProductsArray: state.productsListReducer.myProductsArray,
        myProductsObject: state.productsListReducer.myProductsObject,
        myProductsLoading: state.productsListReducer.myProductsLoading,
        myProductsError: state.productsListReducer.myProductsError,
        myProductsFailed: state.productsListReducer.myProductsFailed,
        myProductsMessage: state.productsListReducer.myProductsMessage,

        userProfile: state.profileReducer.userProfile,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllMyProducts: userName => dispatch(productsListActions.fetchAllMyProducts(userName)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts)