import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button, Input, Item, Label, Form, Container, Content, Header } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import OutlinedTextField from '../../../components/floatingInput';
import { deviceWidth, validator, formatter } from '../../../utils';
import RNPickerSelect from 'react-native-picker-select';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Spin from '../../../components/loading/loading';

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
            this.setState({ category, subCategory, productType, loaded: true }, () => {
            })
        }
    }

    setCategory = (value) => {
        let { categoriesList = [] } = this.props;
        if (categoriesList.length && value) {
            this.setState({ category: value, categoryError: '' })
            this.props.fetchAllSubCategories(categoriesList.find(item => item.id == value).id)
        }
    };

    setSubCategory = (value) => {
        if (!!value)
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
            this.props.setProductType(productType, category, subCategory);
        }
    }

    render() {

        let { categoriesList, subCategoriesList, subCategoriesLoading, categoriesLoading } = this.props;
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
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#666666',
                        fontSize: 20,
                        paddingHorizontal: 10
                    }}
                >
                    {locales('labels.selectProductType')}
                </Text>

                <View style={styles.labelInputPadding}>
                    <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                        {locales('labels.category')}
                    </Label>
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
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                            items={[...categoriesList.map(item => ({
                                label: item.category_name, value: item.id
                            }))]}
                        />
                    </Item>
                    {!!categoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{categoryError}</Label>}
                </View>
                {/* <Item regular
                    style={styles}
                    useNativeAndroidPickerStyle={false}
                >
                    <Picker
                        useNativeAndroidPickerStyle={false}
                        style={styles}
                        mode="dialog"
                        iosIcon={<AntDesign name='plus' size={25} color='#00C569' />}
                        selectedValue={category}
                        onValueChange={this.setCategory}

                    >
                        <Picker.Item
                            useNativeAndroidPickerStyle={false}
                            style={styles} label={locales('labels.selectCategory')} value='' />
                        {categoriesList.map((item, index) => {
                            return (
                                <Picker.Item
                                    label={item.category_name}
                                    value={item.id}
                                    key={index}
                                />
                            )
                        })}
                    </Picker>
                </Item> */}
                {/* <Dropdown
                    error={categoryError}
                    onChangeText={(value, index) => this.setCategory(value, index)}
                    label={locales('labels.selectCategory')}
                    data={categoriesList}
                    value={category}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                /> */}
                <Spin spinning={categoriesLoading || subCategoriesLoading}>
                    <View style={styles.labelInputPadding}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.subCategory')}
                        </Label>
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                                items={[...subCategoriesList.map(item => ({
                                    label: item.category_name, value: item.id
                                }))]}
                            />
                        </Item>
                        {!!subCategoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{subCategoryError}</Label>}
                    </View>
                    {/* <Dropdown
                    error={subCategoryError}
                    onChangeText={(value) => this.setSubCategory(value)}
                    label={locales('labels.selectSubCategory')}
                    data={subCategoriesList}
                    value={subCategory}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                /> */}
                    <View style={styles.labelInputPadding}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('titles.enterYourProductType')}
                        </Label>
                        <Item regular style={{
                            borderColor: (productTypeError ? '#D50000' : (productType.length && validator.isPersianNameWithDigits(productType)) ? '#00C569' : '#a8a8a8'), borderRadius: 5, padding: 3
                        }}>
                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoCompleteType='off'
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', textDecorationLine: 'none' }}
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
                        labelTextStyle={{ paddingTop: 5, fontFamily: 'IRANSansWeb(FaNum)_Light' }}
                        label={this.state.isFocused || productType.length
                            ? locales('titles.productType') :
                            locales('titles.productTypeWithExample')}
                    /> */}
                    </View>
                </Spin>
                <Button
                    onPress={() => this.onSubmit()}
                    style={!this.state.category || !this.state.subCategory || !productType || !validator.isPersianNameWithDigits(productType)
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










