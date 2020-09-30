import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { Body, Card, CardItem, Label, Item, Input, Button } from 'native-base';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as registerProductActions from '../../redux/registerProduct/actions';
import * as productActions from '../../redux/registerProduct/actions';

import { deviceWidth, validator } from '../../utils';
import NoConnection from '../../components/noConnectionError';


class RegisterRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disableSubCategory: true,
            amountError: '',
            amount: '',
            category: '',
            subCategory: '',
            productTypeError: '',
            categoryError: '',
            subCategoryError: '',
            productType: '',
            isFocused: false,
            loaded: false,
            showModal: false
        }
    }

    amountRef = React.createRef();
    productTypeRef = React.createRef();


    componentDidMount() {
        analytics().logEvent('register_buyAd')
        global.resetRegisterProduct = data => {
            if (data) {
                this.props.navigation.navigate('RegisterRequest')
            }
        }
        if (this.props.resetTab) {
            this.props.resetRegisterProduct(false);
            this.props.navigation.navigate('RegisterRequest')
        }

        this.props.fetchAllCategories();
    }

    emptyState = () => {
        this.setState({
            amountError: '',
            amount: '',
            category: '',
            subCategory: '',
            productTypeError: '',
            categoryError: '',
            subCategoryError: '',
            productType: '',
            isFocused: false,
            loaded: false,
            showModal: false
        })
    }


    setCategory = (value) => {
        this.setState({ disableSubCategory: true })
        let { categoriesList = [] } = this.props;
        if (categoriesList.length && value) {
            this.setState({ category: value, categoryError: '', subCategoryError: '', subCategory: '' })
            this.props.fetchAllSubCategories(categoriesList.some(item => item.id == value) ? categoriesList.find(item => item.id == value).id : undefined).then(_ => {
                this.setState({ disableSubCategory: false })
            })
        }
    };


    setSubCategory = (value) => {
        if (!!value)
            this.setState({
                subCategoryError: '', subCategory: value
            }, () => {
            })
    };




    onAmountSubmit = field => {
        this.setState(() => ({
            amount: field,
            amountError: ''
        }));
    };


    onProductTypeSubmit = (field) => {
        this.setState(() => ({
            productType: field,
            productTypeError: ''
        }));
    };



    onSubmit = () => {

        let { productType, category, subCategory, amount } = this.state;
        let productTypeError = '', categoryError = '', subCategoryError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.fieldNeeded', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        // if (!productType) {
        //     productTypeError = locales('titles.productTypeEmpty');
        // }
        if (productType && !validator.isPersianNameWithDigits(productType)) {
            productTypeError = locales('titles.productTypeInvalid');
        }
        else {
            productTypeError = '';
        }

        if (!category) {
            categoryError = locales('titles.categoryError');
        }
        else {
            categoryError = '';
        }

        if (!subCategory) {
            subCategoryError = locales('titles.productNameError');
        }
        else {
            subCategoryError = '';
        }
        this.setState({ productTypeError, subCategoryError, categoryError, productTypeError, amountError })
        if (!categoryError && !subCategoryError && !amountError && !productTypeError) {
            let requestObj = {
                name: productType,
                requirement_amount: amount,
                category_id: subCategory
            };
            this.props.registerBuyAdRequest(requestObj).then(result => {
                this.setState({ category: '', subCategory: '', amount: '', productType: '' })
                this.props.navigation.navigate('RegisterRequestSuccessfully', { emptyState: this.emptyState });
            })
            // .catch(_ => this.setState({ showModal: true }));
        }
    }

    closeModal = _ => {
        this.setState({ showModal: false })
        this.componentDidMount()
    };

    render() {


        let { categoriesList, subCategoriesList, subCategoriesLoading, categoriesLoading } = this.props;

        let {
            productType, category, subCategory,
            subCategoryError, categoryError, productTypeError,
            amountError,
            showModal,
            amount
        } = this.state;

        categoriesList = categoriesList.map(item => ({ ...item, value: item.category_name }));
        subCategoriesList = subCategoriesList.map(item => ({ ...item, value: item.category_name }));


        return (
            <>
                <NoConnection
                    closeModal={this.closeModal}
                    showModal={showModal}
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
                            {locales('labels.registerRequest')}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    keyboardShouldPersistTaps='handled'
                >
                    <View style={{
                        paddingVertical: 15,
                        paddingHorizontal: 7
                    }} >
                        <Card style={{ marginBottom: 20, elevation: 2, borderRadius: 6 }} transparent>
                            <CardItem>
                                <Body style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 7 }}>
                                    <Text style={{ color: '#E51C38', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                        {locales('titles.doYouWishToBuy')}
                                    </Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                        {locales('titles.registerRequestNow')}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>


                        <Card >
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                <Text style={{
                                    borderBottomColor: '#00C569', borderBottomWidth: 2,
                                    paddingVertical: 5,
                                    width: '100%', textAlign: 'center',
                                    fontSize: 20, color: '#555555', fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}>
                                    {locales('titles.registerBuyAdRequest')}
                                </Text>
                                <Text style={{
                                    width: '100%', paddingTop: 20,
                                    paddingHorizontal: 15,
                                    color: '#333',
                                    fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}>
                                    {locales('titles.whatAndQuantity')}
                                </Text>
                                <View style={{

                                    width: '100%'
                                }}>

                                    <View style={styles.labelInputPadding}>
                                        <View style={{
                                            flexDirection: 'row-reverse',

                                        }}>
                                            <Label style={{ position: 'relative', color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                                {locales('labels.category')}
                                            </Label>
                                            {!!categoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                                            /> : null}
                                        </View>
                                        <Item regular
                                            style={{
                                                width: '100%',
                                                borderRadius: 5,
                                                alignSelf: 'center',
                                                borderColor: category ? '#00C569' : categoryError ? '#D50000' : '#a8a8a8'
                                            }}
                                        >
                                            <RNPickerSelect
                                                Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                                                useNativeAndroidPickerStyle={false}
                                                onValueChange={this.setCategory}
                                                disabled={categoriesLoading}
                                                style={styles}
                                                value={category}
                                                placeholder={{
                                                    label: locales('labels.selectCategory'),
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                }}
                                                items={[...categoriesList.map(item => ({
                                                    label: item.category_name, value: item.id
                                                }))]}
                                            />
                                        </Item>
                                        {!!categoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{categoryError}</Label>}
                                    </View>

                                    <View style={styles.labelInputPadding}>
                                        <View style={{
                                            flexDirection: 'row-reverse'
                                        }}>
                                            <Label style={{ color: '#333', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 15, padding: 5 }}>
                                                {locales('titles.productName')}
                                            </Label>
                                            {!!subCategoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                                                style={{
                                                    width: 30, height: 30, borderRadius: 15
                                                }}
                                            /> : null}
                                        </View>
                                        <Item regular
                                            style={{
                                                width: '100%',
                                                borderRadius: 5,
                                                alignSelf: 'center',
                                                borderColor: subCategory ? '#00C569' : subCategoryError ? '#D50000' : '#a8a8a8'
                                            }}
                                        >
                                            <RNPickerSelect
                                                Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                                                useNativeAndroidPickerStyle={false}
                                                onValueChange={this.setSubCategory}
                                                style={styles}
                                                disabled={this.state.disableSubCategory || categoriesLoading || subCategoriesLoading}
                                                value={subCategory}
                                                placeholder={{
                                                    label: locales('titles.selectProductName'),
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                }}
                                                items={[...subCategoriesList.map(item => ({
                                                    label: item.category_name, value: item.id
                                                }))]}
                                            />
                                        </Item>
                                        {!!subCategoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{subCategoryError}</Label>}
                                    </View>


                                    <View style={styles.labelInputPadding}>
                                        <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.enterYourProductType')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: (productTypeError ? '#D50000' :
                                                (productType.length && validator.isPersianNameWithDigits(productType)) ? '#00C569' : '#a8a8a8'),
                                            borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    textDecorationLine: 'none',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                                onChangeText={this.onProductTypeSubmit}
                                                value={productType}
                                                placeholderTextColor="#BEBEBE"
                                                placeholder={locales('titles.productTypeWithExample')}
                                                ref={this.productTypeRef}
                                            />
                                        </Item>
                                        {!!productTypeError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{productTypeError}</Label>}

                                    </View>



                                    <View style={styles.labelInputPadding}>
                                        <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.requestQuantity')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: amountError ? '#D50000' : amount.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'IRANSansWeb(FaNum)',
                                                    flexDirection: 'row',
                                                    textDecorationLine: 'none',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholderTextColor="#BEBEBE"

                                                placeholder={locales('titles.maximumPriceWithExample')}
                                                ref={this.amountRef}

                                            />
                                        </Item>
                                        {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}
                                    </View>



                                    <View style={[styles.labelInputPadding], {

                                        alignItems: 'center',

                                    }}>

                                        <Button
                                            onPress={() => this.onSubmit()}
                                            style={[!this.state.category || !this.state.subCategory || !amount

                                                ? styles.disableLoginButton : styles.loginButton, {
                                                marginBottom: 25,
                                                marginTop: 25
                                            }]}

                                        >
                                            <ActivityIndicator size="small"
                                                animating={!!this.props.registerBuyAdRequestLoading} color="white"
                                                style={{
                                                    position: 'relative',
                                                    marginRight: -30,
                                                    width: 25, height: 25, borderRadius: 15
                                                }}
                                            />
                                            <Text style={styles.buttonText}>{locales('labels.registerRequest')}</Text>


                                        </Button>

                                    </View>
                                </View>
                            </View>

                        </Card>
                    </View>

                </ScrollView>


            </>
        )
    }
}


const styles = StyleSheet.create({
    textInputPadding: {
        padding: 20,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '100%',
        maxWidth: 200,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#00C569',
        width: '100%',
        maxWidth: 200,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 15
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
        fontSize: 14,
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
        paddingHorizontal: deviceWidth * 0.062,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
})


const mapStateToProps = (state) => {
    return {
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

        registerBuyAdRequestLoading: state.registerProductReducer.registerBuyAdRequestLoading,
        registerBuyAdRequest: state.registerProductReducer.registerBuyAdRequest,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        registerBuyAdRequest: requestObj => dispatch(registerProductActions.registerBuyAdRequest(requestObj)),
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(false)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id)),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterRequest);

