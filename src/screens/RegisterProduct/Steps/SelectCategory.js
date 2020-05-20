import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button, Input, Item, Label, InputGroup } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import OutlinedTextField from '../../../components/floatingInput';
import { deviceWidth, validator, formatter } from '../../../utils';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceHeight } from '../../../utils/deviceDimenssions';


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
            loaded: false
        }
    }

    productTypeRef = React.createRef();


    componentDidMount() {
        this.props.fetchAllCategories();
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.subCategoriesList && this.props.subCategoriesList.length && this.props.subCategory) {
            const { category, subCategory, productType } = this.props;
            this.productTypeRef.current.value = productType;
            this.setState({ category, subCategory: this.props.subCategoriesList[this.props.subCategoriesList.findIndex(item => item.id == subCategory)].category_name, productType, loaded: true }, () => {
            })
        }
    }

    setCategory = (value, index) => {
        let { categoriesList = [] } = this.props;
        if (categoriesList.length) {
            this.setState({ category: value, categoryError: '' })
            this.props.fetchAllSubCategories(categoriesList[index].id)
        }
    };

    setSubCategory = (value) => {
        this.setState({
            subCategoryError: '', subCategory: value
        }, () => {
        })
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
            this.props.setProductType(productType, category, formatter.toStandard(this.props.subCategoriesList.find(item => item.category_name == subCategory).id));
        }
    }

    render() {

        let { categoriesList, subCategoriesList } = this.props;
        let { productType, category, subCategory, subCategoryError, categoryError, productTypeError } = this.state;

        categoriesList = categoriesList.map(item => ({ ...item, value: item.category_name }));
        subCategoriesList = subCategoriesList.map(item => ({ ...item, value: item.category_name }));

        return (
            <View
                style={{ backgroundColor: 'white' }}
            >


                <Text
                    style={{
                        marginVertical: 10,
                        fontFamily: 'Vazir-Bold-FD',
                        color: '#666666',
                        fontSize: 20,
                        paddingHorizontal: 10
                    }}
                >
                    {locales('labels.selectProductType')}
                </Text>


                <Dropdown
                    error={categoryError}
                    onChangeText={(value, index) => this.setCategory(value, index)}
                    label={locales('labels.selectCategory')}
                    data={categoriesList}
                    value={category}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <Dropdown
                    error={subCategoryError}
                    onChangeText={(value) => this.setSubCategory(value)}
                    label={locales('labels.selectSubCategory')}
                    data={subCategoriesList}
                    value={subCategory}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <View style={styles.textInputPadding}>
                    <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                        {locales('titles.enterYourProductType')}
                    </Label>
                    <Item regular style={{
                        borderColor: (productTypeError ? '#D50000' : (productType.length && validator.isPersianNameWithDigits(productType)) ? '#00C569' : '#a8a8a8'), borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{ fontFamily: 'Vazir', textDecorationLine: 'none' }}
                            onChangeText={this.onProductTypeSubmit}
                            value={productType}
                            placeholder={locales('titles.productTypeWithExample')}
                            ref={this.productTypeRef}
                        />
                    </Item>
                    {!!productTypeError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{productTypeError}</Label>}
                    {/* <OutlinedTextField
                        baseColor={productType.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onProductTypeSubmit}
                        ref={this.productTypeRef}
                        isRtl={true}
                        placeholder={(this.state.isFocused || productType.length) ? locales('titles.productTypeWithExample') : ''}
                        onFocus={() => this.setState({ isFocused: true })}
                        onBlur={() => this.setState({ isFocused: false })}
                        labelTextStyle={{ paddingTop: 5, fontFamily: 'Vazir' }}
                        label={this.state.isFocused || productType.length
                            ? locales('titles.productType') :
                            locales('titles.productTypeWithExample')}
                    /> */}
                </View>
                <Button
                    onPress={() => this.onSubmit()}
                    style={!this.state.category.length || this.state.subCategory === '' || !productType || !validator.isPersianNameWithDigits(productType)
                        ? styles.disableLoginButton : styles.loginButton}
                    rounded
                >
                    <AntDesign name='arrowleft' size={25} color='white' />
                    <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                </Button>

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
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
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
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
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
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories()),
        fetchAllSubCategories: id => dispatch(registerProductActions.fetchAllSubCategories(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);


