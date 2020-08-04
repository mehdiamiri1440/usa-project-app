import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Button, Input, Item, Label, Form, Container, Content, Header } from 'native-base';

import { deviceWidth, validator, formatter } from '../../../utils';
import RNPickerSelect from 'react-native-picker-select';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { sub } from 'react-native-reanimated';

class SelectCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            subCategory: '',
            productTypeError: '',
            categoryError: '',
            subCategoryError: '',
            productType: '',
            isFocused: false,
            loaded: false,
            subCategoriesList: [],
            categoriesList: [],
        }
    }

    productTypeRef = React.createRef();


    componentDidMount() {
        this.props.fetchAllCategories().then(_ => {
            const { category, subCategory, productType, categoriesList } = this.props;
            this.productTypeRef.current.value = productType;
            this.setState({ category, subCategory, productType, categoriesList, loaded: true }, () => {
            })
        });

    }



    setCategory = (id) => {
        if (id >= 0) {

            let subCategory = this.props.categoriesList.some(item => item.id == id) ?
                this.props.categoriesList.find(item => item.id == id).subcategories : {};
            subCategory = Object.values(subCategory);

            this.setState({
                categoryError: '',
                category: id,
                subCategoriesList: subCategory,
            })
        }
    };

    setSubCategory = (id) => {
        console.log('item', this.state.subCategoriesList)
        if (id >= 0) {
            let subCategory = this.state.subCategoriesList.some(item => item.id == id) ?
                this.state.subCategoriesList.find(item => item.id == id).id : {};


            this.setState({
                subCategoryError: '',
                subCategory
            })
        }
    };

    onProductTypeSubmit = (field) => {
        this.setState(() => ({
            productType: field,
            productTypeError: ''
        }));
    };


    onSubmit = () => {

        let { productType, category, subCategory } = this.state;
        let productTypeError = '', categoryError = '', subCategoryError = '';


        if (!productType) {
            productTypeError = locales('titles.productTypeEmpty');
        }
        else if (!validator.isPersianNameWithDigits(productType)) {
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
            subCategoryError = locales('titles.subCategoryError');
        }
        else {
            subCategoryError = '';
        }
        this.setState({ productTypeError, subCategoryError, categoryError })
        if (!productTypeError && !categoryError && !subCategoryError) {
            this.props.setProductType(productType, category, subCategory);
        }
    }

    render() {

        let { subCategoriesLoading, categoriesLoading } = this.props;
        let { productType, category, subCategoriesList, categoriesList, subCategory, subCategoryError, categoryError, productTypeError } = this.state;

        categoriesList = categoriesList || this.props.categoriesList;
        categoriesList = categoriesList.map(item => ({ ...item, value: item.category_name }));
        subCategoriesList = subCategoriesList.map(item => ({ ...item, value: item.category_name }));

        return (
            <View
                style={{ backgroundColor: 'white' }}
            >


                <Text
                    style={{
                        marginVertical: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#666666',
                        fontSize: 20,
                        paddingHorizontal: 15
                    }}
                >
                    {locales('labels.selectProductType')}
                </Text>


                <View style={styles.labelInputPadding}>
                    <View style={{
                        flexDirection: 'row-reverse'
                    }}>
                        <Label style={{ position: 'relative', color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.category')}
                        </Label>
                        {!!categoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                        /> : null}
                    </View>
                    <Item regular
                        style={{
                            width: deviceWidth * 0.9,
                            borderRadius: 5,
                            alignSelf: 'center',
                            borderColor: category ? '#00C569' : categoryError ? '#D50000' : '#a8a8a8'
                        }}
                    >
                        <RNPickerSelect
                            Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                            useNativeAndroidPickerStyle={false}
                            onValueChange={this.setCategory}
                            style={styles}
                            value={category}

                            placeholder={{
                                label: locales('labels.selectCategory'),
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',

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
                        <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.subCategory')}
                        </Label>
                        {!!subCategoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                            style={{
                                width: 30, height: 30, borderRadius: 15
                            }}
                        /> : null}
                    </View>
                    <Item regular
                        style={{
                            width: deviceWidth * 0.9,
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
                            value={subCategory}
                            placeholder={{
                                label: locales('labels.selectSubCategory'),
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
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
                        borderColor: (productTypeError ? '#D50000' : (productType.length && validator.isPersianNameWithDigits(productType)) ? '#00C569' : '#a8a8a8'), borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{
                                textDecorationLine: 'none',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                backgroundColor: '#fff'
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

                    <Button
                        onPress={() => this.onSubmit()}
                        style={!this.state.category || !this.state.subCategory || !productType || !validator.isPersianNameWithDigits(productType)
                            ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <AntDesign name='arrowleft' size={25} color='white' />
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>

                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    textInputPadding: {
        padding: 20,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '40%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
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
        fontSize: 13,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: '#333',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.04,
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
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);










