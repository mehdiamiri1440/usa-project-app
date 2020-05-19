import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button, Input, Item, Label } from 'native-base';
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
        if (prevState.loaded == false) {
            const { category, subCategory, productType } = this.props;
            this.productTypeRef.current.value = productType;
            this.setState({ category, subCategory, productType, loaded: true })
        }
    }

    setCategory = (value, index) => {
        let { categoriesList = [] } = this.props;
        if (categoriesList.length) {
            this.setState({ category: value })
            this.props.fetchAllSubCategories(categoriesList[index].id)
        }
    };

    setSubCategory = (value) => {
        this.setState({ subCategory: formatter.toStandard(this.props.subCategoriesList.findIndex(item => item.category_name == value)) }, () => {
        })
    };


    onProductTypeSubmit = (field) => {
        if (validator.isPersianName(field))
            this.setState(() => ({
                productType: field,
            }));
        else
            this.setState(() => ({
                productType: ''
            }));
    };


    onSubmit = () => {

        let { productType, category, subCategory } = this.state;
        this.props.setProductType(productType, category, subCategory);
    }

    render() {

        let { categoriesList, subCategoriesList } = this.props;
        let { productType, category, subCategory } = this.state;

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
                    onChangeText={(value, index) => this.setCategory(value, index)}
                    label={locales('labels.selectCategory')}
                    data={categoriesList}
                    value={category}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <Dropdown
                    onChangeText={(value) => this.setSubCategory(value)}
                    label={locales('labels.selectSubCategory')}
                    data={subCategoriesList}
                    value={subCategory}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <View style={styles.textInputPadding}>
                    <Item fixedLabel>
                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                            {locales('titles.enterYourProductType')}
                        </Label>
                    </Item>
                    <Item error='' regular style={{
                        borderColor: productType.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
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
                    style={!this.state.category.length || !this.state.subCategory || !productType
                        ? styles.disableLoginButton : styles.loginButton}
                    rounded
                    disabled={!this.state.category.length || !this.state.subCategory || !productType}
                >
                    <AntDesign name='arrowleft' size={25} color='white' />
                    <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                </Button>

            </View>
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
        width: '40%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
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


