import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"


import NoConnection from '../../../components/noConnectionError';
import Product from '../../ProductsList/Product';
import * as productsListActions from '../../../redux/productsList/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
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
            searchFlag: false,
            showModal: false
        }
    }

    serachInputRef = React.createRef();
    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();




    componentDidMount() {
        this.fetchAllProducts();
        analytics().logEvent('my_product');
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
        if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
            this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name)
        // .catch(_ => this.setState({ showModal: true }));
    };

    closeModal = _ => {
        this.setState({ showModal: false })
        this.props.fetchAllMyProducts();
    }

    renderMyPorductListEmptyComponent = _ => {
        const { myProductsLoading } = this.props;

        if (!myProductsLoading) {
            return (
                <View style={{
                    alignSelf: 'center', justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', width: deviceWidth, height: deviceHeight * 0.78
                }}>
                    <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                    <Text style={{ color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noUserProductFound')}</Text>
                </View>
            )
        }
        if (!this.state.loaded || myProductsLoading) {
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
                                    borderWidth: 1, borderColor: '#eee', width: '95%', height: '100%'
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
                                    <Rect x="25%" y="65%" width="240" height="10" />
                                    <Rect x="20%" y="73%" width="270" height="10" />
                                    <Rect x="20%" y="80%" width="270" height="10" />
                                </ContentLoader>
                            </View>

                        </View>
                    )}
                </View>
            )
        }
        return null;

    }

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
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />
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
                            {locales('labels.myProducts')}
                        </Text>
                    </View>
                </View>


                <FlatList
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    refreshing={myProductsLoading}
                    ListEmptyComponent={this.renderMyPorductListEmptyComponent()}
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
                                if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
                                    this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name).then(_ => {
                                        this.setState({ loaded: false })
                                    })
                                // .catch(_ => this.setState({ showModal: true }));
                            })
                    }}
                    // initialNumToRender={2}
                    // initialScrollIndex={0}
                    onRefresh={() => {
                        if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
                            this.props.fetchAllMyProducts(this.props.userProfile.user_info.user_name).then(_ => {
                                this.setState({
                                    searchText: '', sort_by: 'BM'
                                    , refreshed: true, from_record_number: 0, to_record_number: 15
                                })
                            })
                        // .catch(_ => this.setState({ showModal: true }));
                    }
                    }
                    onEndReachedThreshold={0.2}
                    keyExtractor={(_, index) => index.toString()}
                    data={myProductsArray}
                    horizontal={false}
                    style={{ backgroundColor: 'white' }}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{
                                    width: '95%', marginTop: 10, alignSelf: 'center',
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Product
                                    minimumOrderRef={this.minimumOrderRef}
                                    maximumPriceRef={this.maximumPriceRef}
                                    shouldShowMyButtons
                                    amountRef={this.amountRef}
                                    minimumPriceRef={this.minimumPriceRef}
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