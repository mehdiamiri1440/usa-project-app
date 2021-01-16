import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Svg, { Path } from "react-native-svg"
import { Button, Input, Label, InputGroup } from 'native-base';

import { deviceWidth, validator } from '../../../utils';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceHeight } from '../../../utils/deviceDimenssions';


const CategoriesIcons = [
    {
        name: 'صیفی',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="31.32"
            height="24.469"
            viewBox="0 0 31.32 24.469"
        >
            <Path
                fill="#38485f"
                d="M26.427 12.234a.612.612 0 10.612.612.612.612 0 00-.612-.612zm0 0M17.145 15.517a.612.612 0 10-.224-.836.612.612 0 00.224.836zm0 0M15.293 17.978a.612.612 0 10-.836-.224.612.612 0 00.836.224zm0 0M11.623 18.963a.612.612 0 10-.612-.612.612.612 0 00.612.612zm0 0M7.948 17.978a.612.612 0 10-.224-.836.612.612 0 00.224.836zm0 0M5.266 15.293a.612.612 0 10.224-.836.612.612 0 00-.224.836zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M19.189 0h-.1A12.229 12.229 0 006.852 12.234H.612a.612.612 0 00-.612.612 11.629 11.629 0 0015.3 11.027 12.218 12.218 0 003.68.6h.1A12.237 12.237 0 0019.189 0zm-2.55 12.234c0-4.68 1.049-11.011 2.447-11.011 1.788 0 2.447 8.411 2.447 11.011zm2.913 1.223a7.953 7.953 0 01-15.858 0zM17.088 1.725c-1.318 2.7-1.672 7.49-1.672 10.509h-3.059c0-3.946 1.49-8.84 4.731-10.509zm-2.588.489c-2.36 2.561-3.367 6.486-3.367 10.02H8.075A11.024 11.024 0 0114.5 2.214zM1.241 13.458h1.227a9.175 9.175 0 0018.31 0H22a10.4 10.4 0 01-20.763 0zm22.451 8.773a13.708 13.708 0 003.083-6.848.612.612 0 10-1.206-.206c-.8 4.7-3.441 8.016-6.414 8.068h-.145a4.247 4.247 0 01-1.567-.336 11.651 11.651 0 005.8-10.062.612.612 0 00-.489-.6v-.012c0-3.044-.358-7.813-1.669-10.5 2.864 1.484 4.314 5.474 4.64 8.73a.612.612 0 001.217-.122 14.1 14.1 0 00-3.254-8.1 11 11 0 010 19.993zm0 0"
            ></Path>
        </Svg>
    },
    {
        name: 'میوه',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="27.763px"
            style={{ justifyContent: 'center', flex: 1 }}
            height="25.358px"
            viewBox="0 0 27.763 25.358"
        >
            <Path
                fill="#38485f"
                d="M23.29 4.751q.25-.091.488-.2a8.086 8.086 0 003.506-3.57.542.542 0 00-.351-.753 8.086 8.086 0 00-4.988.391 7.339 7.339 0 00-2.638 2.173 10.683 10.683 0 00-.819-2.077.542.542 0 00-.97.485 8.893 8.893 0 01.882 2.5 8.684 8.684 0 00-7.055 4.73 8.724 8.724 0 00-4.74-.171.542.542 0 00.258 1.053 7.592 7.592 0 11-5.779 7.374 7.535 7.535 0 012.276-5.422.542.542 0 10-.76-.774A8.676 8.676 0 1016.417 20.6 8.679 8.679 0 0023.29 4.751zM22.4 1.6a6.665 6.665 0 013.54-.45 6.635 6.635 0 01-2.62 2.417 5.587 5.587 0 01-1.728.469 8.665 8.665 0 00-1.618-.322A6.463 6.463 0 0122.4 1.6zm-3.313 18.336a7.581 7.581 0 01-2.239-.335 8.683 8.683 0 00-4.49-10.775 7.6 7.6 0 016.672-4.072h.057a7.591 7.591 0 110 15.183zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M8.676 23.19a6.507 6.507 0 10-6.507-6.507 6.513 6.513 0 006.507 6.507zm-4.2-9.937l2.728 2.728a1.559 1.559 0 00-.066.159H3.28a5.37 5.37 0 011.2-2.888zm9.592 2.888H10.21a1.66 1.66 0 00-.066-.159l2.728-2.728a5.37 5.37 0 011.197 2.887zm-1.199 3.975l-2.728-2.729a1.559 1.559 0 00.066-.159h3.862a5.371 5.371 0 01-1.2 2.888zm-3.654-3.43a.542.542 0 11-.542-.542.542.542 0 01.545.539zm-1.244 1.468a1.61 1.61 0 00.159.066v3.861a5.37 5.37 0 01-2.888-1.2zm1.244.066a1.666 1.666 0 00.159-.066l2.728 2.728a5.369 5.369 0 01-2.888 1.2zm.159-3a1.6 1.6 0 00-.159-.066v-3.861a5.371 5.371 0 012.888 1.2zm-1.244-.066a1.6 1.6 0 00-.159.066l-2.728-2.728a5.371 5.371 0 012.888-1.2zm-.992 2.077a1.634 1.634 0 00.066.159l-2.725 2.726a5.367 5.367 0 01-1.2-2.887zm0 0M4.717 9.037a.542.542 0 10.542.542.542.542 0 00-.542-.542zm0 0"
            ></Path>
        </Svg>
    },
    {
        name: 'غلات',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="27.772"
            height="24.734"
            viewBox="0 0 27.772 24.734"
        >
            <Path
                fill="#38485f"
                d="M.542 20.612a.542.542 0 000 1.085h26.687a.542.542 0 000-1.085H24.3v-2.031a4.04 4.04 0 002.65-1.151 4.308 4.308 0 00.774-3.232.541.541 0 00-.446-.505 4.714 4.714 0 00.446-2.777.541.541 0 00-.448-.506 4.712 4.712 0 00.448-2.779.542.542 0 00-.512-.514 4.926 4.926 0 00-.742.028V5.409a.542.542 0 10-1.085 0v1.969a3.2 3.2 0 00-1.378.866 2.6 2.6 0 00-.251.332 2.635 2.635 0 00-.251-.332 3.193 3.193 0 00-1.374-.865v-1.97a.542.542 0 00-1.085 0v1.737a4.975 4.975 0 00-.745-.029.543.543 0 00-.511.51 4.715 4.715 0 00.448 2.783.541.541 0 00-.447.5 4.716 4.716 0 00.446 2.781.541.541 0 00-.406.327.536.536 0 00-.04.175 4.309 4.309 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.031h-8.784V18.02a4.04 4.04 0 002.65-1.151 4.307 4.307 0 00.775-3.232.542.542 0 00-.446-.505 4.716 4.716 0 00.446-2.777.542.542 0 00-.448-.509 4.713 4.713 0 00.448-2.779.542.542 0 00-.447-.505 4.713 4.713 0 00.447-2.778.543.543 0 00-.512-.514 5 5 0 00-.743.029V1.584a.542.542 0 00-1.085 0v1.951a3.2 3.2 0 00-1.376.866 2.615 2.615 0 00-.251.332 2.634 2.634 0 00-.251-.332 3.2 3.2 0 00-1.376-.866V1.584a.542.542 0 00-1.085 0v1.718a4.932 4.932 0 00-.743-.029.542.542 0 00-.511.51 4.716 4.716 0 00.446 2.782.541.541 0 00-.446.5 4.713 4.713 0 00.447 2.781.541.541 0 00-.447.5 4.716 4.716 0 00.446 2.781.541.541 0 00-.406.327.535.535 0 00-.04.175 4.309 4.309 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.592H4.559v-2.027a4.04 4.04 0 002.65-1.151 4.307 4.307 0 00.775-3.232.542.542 0 00-.446-.505 4.716 4.716 0 00.446-2.777.542.542 0 00-.448-.506 4.711 4.711 0 00.448-2.779.542.542 0 00-.512-.514 4.939 4.939 0 00-.745.029V5.409a.542.542 0 10-1.085 0V7.38a3.193 3.193 0 00-1.374.865 2.615 2.615 0 00-.251.332 2.633 2.633 0 00-.251-.332 3.2 3.2 0 00-1.378-.866v-1.97a.542.542 0 10-1.085 0v1.737a4.976 4.976 0 00-.742-.029.542.542 0 00-.511.51A4.713 4.713 0 00.5 10.41a.542.542 0 00-.407.327.535.535 0 00-.04.175A4.716 4.716 0 00.5 13.693a.541.541 0 00-.446.5 4.31 4.31 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.031zm21.733-6.615a2.2 2.2 0 01-.9-.572 2.907 2.907 0 01-.545-1.925 4.071 4.071 0 01.982.2l.125.047a2.012 2.012 0 01.762.508 2.85 2.85 0 01.512 1.953 4.1 4.1 0 01-.923-.2l-.014-.005zm2.959 0a4.089 4.089 0 01-.926.205 2.851 2.851 0 01.512-1.953 2.015 2.015 0 01.763-.508l.123-.046a4.061 4.061 0 01.983-.2 2.906 2.906 0 01-.545 1.925 2.2 2.2 0 01-.9.574zm.91 2.706a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.727-.493c.068-.024.136-.049.2-.077a4.1 4.1 0 01.938-.183 2.9 2.9 0 01-.545 1.925zM24.82 8.964a2.882 2.882 0 011.869-.753 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.882 2.882 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 9.274a2.928 2.928 0 01-1.836-.782 2.906 2.906 0 01-.545-1.925 4.107 4.107 0 01.937.183c.069.028.139.054.208.078a1.986 1.986 0 01.725.492 2.852 2.852 0 01.512 1.954zm-10.855-4.07a2.168 2.168 0 01-.853-.555 2.907 2.907 0 01-.545-1.925 4.064 4.064 0 01.981.2l.126.047a2.013 2.013 0 01.762.508 2.851 2.851 0 01.512 1.954 4.082 4.082 0 01-.906-.2l-.077-.029zm2.986.028a4.081 4.081 0 01-.907.2 2.852 2.852 0 01.512-1.954 2.015 2.015 0 01.763-.508l.124-.047a4.067 4.067 0 01.983-.2 2.906 2.906 0 01-.545 1.925 2.166 2.166 0 01-.853.556l-.076.028zm-2.515-5.04a2.852 2.852 0 01.512 1.954 2.928 2.928 0 01-1.836-.782 2.905 2.905 0 01-.545-1.925 4.1 4.1 0 01.941.184c.066.027.132.052.2.075a1.991 1.991 0 01.73.494zm3.047-.568a4.1 4.1 0 01.942-.185 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.73-.495q.1-.034.2-.074zm.4 8.307a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.984 1.984 0 01.716-.488q.113-.039.226-.085a4.124 4.124 0 01.928-.18 2.9 2.9 0 01-.545 1.925zM14.949 5.124a2.881 2.881 0 011.869-.753 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.881 2.881 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 12.557a2.928 2.928 0 01-1.841-.782 2.906 2.906 0 01-.545-1.925 4.125 4.125 0 01.927.18q.114.046.227.085a1.981 1.981 0 01.715.488 2.852 2.852 0 01.512 1.954zm-10.81-2.931a2.2 2.2 0 01-.9-.572 2.906 2.906 0 01-.545-1.925 4.069 4.069 0 01.982.2l.125.047a2.013 2.013 0 01.762.508 2.852 2.852 0 01.512 1.953 4.1 4.1 0 01-.922-.2l-.015-.006zm2.96 0a4.089 4.089 0 01-.926.205 2.851 2.851 0 01.512-1.953 2.015 2.015 0 01.763-.503l.123-.046a4.061 4.061 0 01.983-.2 2.906 2.906 0 01-.546 1.924 2.2 2.2 0 01-.9.574h-.007zm.91 2.706a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.723-.485c.068-.024.136-.049.2-.077a4.1 4.1 0 01.938-.183 2.9 2.9 0 01-.538 1.921zM5.077 8.968a2.882 2.882 0 011.869-.753 2.906 2.906 0 01-.546 1.924 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.882 2.882 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 9.274a2.928 2.928 0 01-1.836-.782 2.906 2.906 0 01-.545-1.925 4.107 4.107 0 01.937.183c.069.028.139.054.208.078a1.986 1.986 0 01.725.492 2.852 2.852 0 01.512 1.954zm0 0M27.229 23.649H16.055a.542.542 0 100 1.085h11.174a.542.542 0 000-1.085zm0 0M.542 24.734h11.174a.542.542 0 100-1.085H.542a.542.542 0 100 1.085zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M13.888 3a.543.543 0 00.542-.542V.542a.542.542 0 10-1.085 0v1.92a.543.543 0 00.543.538zm0 0M4.015 6.83a.543.543 0 00.542-.542v-1.92a.542.542 0 00-1.085 0v1.919a.542.542 0 00.543.543zm0 0M23.762 6.83a.543.543 0 00.542-.542v-1.92a.542.542 0 00-1.085 0v1.919a.542.542 0 00.543.543zm0 0M13.512 23.808a.542.542 0 10.383-.159.545.545 0 00-.383.159zm0 0"
            ></Path>
        </Svg>
    }
];

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
            submitButtonClick: false,
            isFocused: false,
            loaded: false,
            subCategoriesList: [],
            categoriesList: [],
            subCategoryName: '',
            subCategoriesTogether: [],
            showParentCategoriesFlag: true,
            showProductTypeFlag: true,
            selectedSvgName: ''
        }
    }

    productTypxdeRef = React.createRef();


    componentDidMount() {
        this.props.fetchAllCategories().then(_ => {
            const { category, subCategory, productType, categoriesList } = this.props;

            if (this.productTypeRef && this.productTypeRef.current)
                this.productTypeRef.current.value = productType;

            this.setState({
                category, subCategory, productType,
                subCategoriesTogether: categoriesList.map(item => item.subcategories),
                categoriesList,
                loaded: true,
                subCategoriesList: category && categoriesList && categoriesList.length ?
                    Object.values(categoriesList.find(item => item.id == category).subcategories)
                    : []
            })

        });

        BackHandler.addEventListener('hardwareBackPress', _ => {

            const {
                category,
                subCategory,
            } = this.state;

            if (subCategory && category) {
                this.setState({ subCategory: '' })
                return true;
            }

            if (category) {
                this.setState({ category: '' })
                return true;
            }
            return false;
        });

    }


    componentWillUnmount() {
        BackHandler.removeEventListener();
    }

    // setCategory = (id) => {
    //     if (id >= 0) {

    //         let subCategory = this.props.categoriesList.some(item => item.id == id) ?
    //             this.props.categoriesList.find(item => item.id == id).subcategories : {};
    //         subCategory = Object.values(subCategory);

    //         this.setState({
    //             categoryError: '',
    //             category: id,
    //             subCategoriesList: subCategory,
    //         })
    //     }
    // };

    // setSubCategory = (id) => {
    //     if (id >= 0) {
    //         let subCategory = this.state.subCategoriesList.some(item => item.id == id) ?
    //             this.state.subCategoriesList.find(item => item.id == id).id : {};


    //         this.setState({
    //             subCategoryError: '',
    //             subCategory,
    //             subCategoryName: this.state.subCategoriesList.find(item => item.id == id).category_name
    //         })
    //     }
    // };

    onProductTypeSubmit = (field) => {
        this.setState(() => ({
            submitButtonClick: false,
            productType: field,
            productTypeError: (!field || validator.isPersianNameWithDigits(field)) ?
                '' : locales('titles.productTypeInvalid')
        }));
    };


    onSubmit = () => {

        let { productType, category, subCategory, subCategoryName } = this.state;
        let productTypeError = '', categoryError = '', subCategoryError = '';


        if (!productType) {
            productTypeError = locales('titles.productTypeEmpty');
        }
        else if (productType && !validator.isPersianNameWithDigits(productType)) {
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
        this.setState({ submitButtonClick: true, productTypeError, subCategoryError, categoryError })
        if (!productTypeError && !categoryError && !subCategoryError) {
            this.props.setProductType(productType, category, subCategory, subCategoryName);
        }
    }

    setSelectedSubCategory = (id, isSub, index) => {
        const { subCategoriesTogether, subCategoriesList, categoriesList } = this.state;
        if (!isSub) {
            let selectedSubs = [];
            subCategoriesTogether.forEach(item => {
                selectedSubs.push(Object.values(item).filter(sub => sub.parent_id == id))
            })
            selectedSubs = selectedSubs.filter(item => item && item.length).flatMap(item => item)
            this.setState({
                subCategoriesList: selectedSubs, category: id,
                selectedSvgName: categoriesList.find(item => item.id == id).category_name
            });
        }
        else {
            this.setState({
                subCategory: id,
                subCategoryName: subCategoriesList && subCategoriesList.length ? subCategoriesList.find(item => item.id == id).category_name : ''
            })
        }
    };


    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{
                    width: deviceWidth,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    justifyContent: 'space-between',
                    padding: 20,
                    flexDirection: 'row-reverse'
                }}
                onPress={_ => this.setSelectedSubCategory(item.id, !item.subcategories, index)}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                    }}
                >

                    <Text
                        style={{
                            color: '#38485F',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginHorizontal: 15
                        }}
                    >
                        {item.category_name}
                    </Text>
                </View>
                <FontAwesome5 name='angle-left' size={25} color='gray' />
            </TouchableOpacity>

        )
    };

    subCategoriesListFooterComponent = _ => {
        return (
            <View
                style={{ width: deviceWidth * 0.4, margin: 20, alignSelf: 'flex-end' }}
            >
                <Button
                    onPress={() => this.setState({ category: '' })}
                    style={[styles.backButtonContainer, { flex: 1 }]}
                    rounded
                >
                    <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                    <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                </Button>
            </View>
        )
    };


    renderListEmptyComponent = _ => {
        const {
            categoriesLoading
        } = this.props;

        return (
            !categoriesLoading ? <View style={{
                alignSelf: 'center', justifyContent: 'center',
                alignContent: 'center', alignItems: 'center',
                width: deviceWidth, height: deviceHeight * 0.7
            }}>
                <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                <Text style={{
                    color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 17, padding: 15, textAlign: 'center'
                }}>
                    {locales('labels.emptyList')}</Text>
            </View> : null
        )
    };


    render() {

        let { productType, category, subCategoriesList, categoriesList,
            subCategory, productTypeError, submitButtonClick, selectedSvgName } = this.state;

        const {
            categoriesLoading
        } = this.props;
        // categoriesList = categoriesList || this.props.categoriesList;
        // categoriesList = categoriesList.map(item => ({ ...item, value: item.category_name }));
        // subCategoriesList = subCategoriesList.map(item => ({ ...item, value: item.category_name }));
        const categoryIcon = categoriesList && categoriesList.length && category ?
            categoriesList.some(item => item.category_name == selectedSvgName) ?
                CategoriesIcons.find(item => item.name == selectedSvgName).svg : null : null

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
                        marginHorizontal: 10
                    }}
                >
                    {categoryIcon} {locales('labels.selectedProductCategory')}
                </Text>

                {!category ?
                    <FlatList
                        data={categoriesList}
                        ListEmptyComponent={this.renderListEmptyComponent}
                        keyExtractor={(item) => item.id.toString()}
                        refreshing={categoriesLoading}
                        renderItem={this.renderItem}
                    />
                    : null}

                {
                    !subCategory && category ?
                        <FlatList
                            data={subCategoriesList}
                            ListEmptyComponent={this.renderListEmptyComponent}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={this.renderItem}
                            ListFooterComponent={this.subCategoriesListFooterComponent}
                        />
                        : null
                }
                {
                    category && subCategory ?
                        <View style={{
                            paddingHorizontal: 20
                        }}
                        >
                            <Text
                                style={{
                                    color: '#555555', marginVertical: 20,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 18
                                }}
                            >
                                {`${locales('titles.productType')} `}
                                <Text
                                    style={{
                                        color: '#21AD93', paddingHorizontal: 50,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 18
                                    }}
                                >
                                    {
                                        subCategoriesList && subCategoriesList.length ?
                                            subCategoriesList.find(item => item.id == subCategory).category_name
                                            : null
                                    }
                                </Text>
                                <Text
                                    style={{
                                        marginHorizontal: 10, color: '#555555',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 18
                                    }}
                                >
                                    {` ${locales('titles.enterYours')}`} <Text
                                        style={{
                                            color: '#D44546'
                                        }}
                                    >*</Text>
                                </Text>
                            </Text>
                            <Text
                                style={{
                                    marginVertical: 10,
                                    color: '#777777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    fontSize: 16
                                }}
                            >
                                {locales('titles.productTypeExample')}
                            </Text>
                            <InputGroup
                                regular
                                style={{
                                    borderRadius: 4,
                                    borderWidth: 1,
                                    borderColor: productType ? productTypeError ? '#f08c9a' : '#7ee0b2' :
                                        submitButtonClick ? '#f08c9a' : '#000000'
                                }}>
                                <FontAwesome5 name={
                                    productType ? productTypeError ? 'times-circle' : 'check-circle' : submitButtonClick
                                        ? 'times-circle' : 'edit'}
                                    color={productType ? productTypeError ? '#f08c9a' : '#7ee0b2'
                                        : submitButtonClick ? '#f08c9a' : '#000000'}
                                />
                                <Input
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoCompleteType='off'
                                    style={{
                                        textDecorationLine: 'none',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        height: 45,
                                        backgroundColor: '#fff',
                                        direction: 'rtl',
                                        textAlign: 'right'
                                    }}
                                    onChangeText={this.onProductTypeSubmit}
                                    value={productType}
                                    placeholderTextColor="#BEBEBE"
                                    placeholder={locales('titles.enterYourProductType')}
                                    ref={this.productTypeRef}
                                />
                            </InputGroup>
                            {!!productTypeError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>
                                {productTypeError}
                            </Label>}
                            <View style={{
                                marginVertical: 20, paddingHorizontal: 10,
                                flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between'
                            }}>
                                <Button
                                    onPress={() => this.onSubmit()}
                                    style={!this.state.category || !this.state.subCategory || !productType ||
                                        !validator.isPersianNameWithDigits(productType)
                                        ? styles.disableLoginButton : styles.loginButton}
                                    rounded
                                >
                                    <AntDesign name='arrowleft' size={25} color='white' />
                                    <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                                </Button>
                                <Button
                                    onPress={() => this.setState({ productType: '', subCategory: '' })}
                                    style={[styles.backButtonContainer, { width: '40%', marginRight: 30 }]}
                                    rounded
                                >
                                    <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                                    <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                                </Button>
                            </View>

                        </View>
                        :
                        null
                }

                {/* 

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
                            Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
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
                </View> */}
                {/* 
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
                            Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
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
                                backgroundColor: '#fff',
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

                </View> */}

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
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    container: {
        flex: 1,
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-end',
        justifyContent: 'center'
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
        color: 'black',
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







