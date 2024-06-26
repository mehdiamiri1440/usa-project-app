import React, { Component } from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect } from "react-content-loader/native"

import * as productsListActions from '../../../redux/productsList/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import Product from '../../ProductsList/Product';
import Header from '../../../components/header';
import ENUMS from '../../../enums';
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
        if (this.props.myProductsArray.length != prevProps.myProductsArray.length) {
            this.setState({ myProductsArray: this.props.myProductsArray });
        }
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
    };

    renderMyPorductListEmptyComponent = _ => {
        const { myProductsLoading } = this.props;

        if (!myProductsLoading) {
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        height: deviceHeight * 0.78
                    }}>
                    <Image
                        style={{
                            width: deviceWidth * 0.4,
                            height: deviceWidth * 0.4
                        }}
                        source={require('../../../../assets/images/my-products-empty.png')}
                    />
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                            textAlign: 'center',
                        }}
                    >
                        {locales('labels.noNewProductOr')}<Text
                            style={{
                                color: '#0097C1',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                textAlign: 'center',
                                fontWeight: "200"
                            }}
                        >
                            {locales("labels.watingForAcceptance")}
                        </Text>
                        {` ${locales("labels.is(Verb)")}`} !
                    </Text>
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'IRANSansWeb(FaNum)',
                            fontSize: 14,
                            textAlign: 'center',
                            marginTop: 20,
                            width: '75%'
                        }}
                    >
                        {locales('labels.pressButtonToRegisterProduct')}
                    </Text>
                    <Button
                        onPress={_ => this.props.navigation.navigate('RegisterProductStack', { screen: 'RegisterProduct' })}
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: "center",
                            width: '50%',
                            borderRadius: 10,
                            backgroundColor: "#FF9828",
                            elevation: 0,
                            marginTop: 20
                        }}
                    >
                        <FontAwesome5
                            name='plus'
                            size={16}
                            color='white'
                        />
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 16,
                                textAlign: 'center',
                                marginHorizontal: 8
                            }}
                        >
                            {locales('labels.registerProduct')}
                        </Text>
                    </Button>
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
                <Header
                    title={locales('labels.myProducts')}
                    shouldShowAuthenticationRibbonFromProps
                    {...this.props}
                />

                <FlatList
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    refreshing={myProductsLoading}
                    ListEmptyComponent={this.renderMyPorductListEmptyComponent}
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
                            })
                    }}

                    onRefresh={() => {
                        if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
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