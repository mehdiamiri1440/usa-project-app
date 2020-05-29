import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Product from './Product';
import Spin from '../../components/loading/loading';
import * as productsListActions from '../../redux/productsList/actions';
import { deviceWidth } from '../../utils/deviceDimenssions';
class ProductsList extends Component {


    componentDidMount() {
        this.props.fetchAllProductsList();
    }

    render() {
        const {
            productsListObject,
            productsListArray,
            productListLoading,
            productListFailed,
            productListMessage,
            productListError,
        } = this.props;
        return (
            <Spin spininng={productListLoading}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={productsListArray}
                    renderItem={({ item }) => <Product productItem={item} />}
                />
            </Spin>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        productsListArray: state.productsListReducer.productsListArray,
        productsListObject: state.productsListReducer.productsListObject,
        productListLoading: state.productsListReducer.productListLoading,
        productListError: state.productsListReducer.productListError,
        productListFailed: state.productsListReducer.productListFailed,
        productListMessage: state.productsListReducer.productListMessage,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllProductsList: item => dispatch(productsListActions.fetchAllProductsList(item))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList)