import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
    Pressable,
    Modal,
    ActivityIndicator
} from 'react-native'
import ContentLoader, { Rect } from "react-content-loader/native"
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth, dataGenerator, deviceHeight } from '../../utils';
import Header from '../../components/header';
class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoriesModal: false,
            subCategoriesList: [],
            categoriesList: [],
            loaded: false,
            modals: [],
            subCategoriesModalFlag: false
        }
    }

    componentDidMount() {
        this.props.fetchAllCategories();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.categoriesList.length) {
            this.setState({ categoriesList: this.props.categoriesList, loaded: true })
        }
    }

    sortProducts = ({ id, category_name, subcategories: subCategoriesList = {}, ...rest }) => {
        subCategoriesList = Object.values(subCategoriesList);

        let modals = [...this.state.modals];
        modals.push({
            id: dataGenerator.generateKey(`modal_${id}_`),
            category_name,
            subCategoriesList,
            ...rest
        })
        this.setState({ subCategoriesModalFlag: true, subCategoriesList, modals }, _ => {
            if (!this.state.subCategoriesList.length)
                this.handleSubCategoryItemClick({ id, category_name, subcategories: [], ...rest })
        })
    };

    omitItemFromModals = category_name => {
        let modals = [...this.state.modals];
        const foundIndex = this.state.modals.findIndex(item => item.category_name == category_name);
        modals.splice(foundIndex, 1);
        this.setState({ modals });
    };

    renderSubCategoriesListEmptyComponent = _ => {
        const {
            subCategoriesLoading,
            categoriesLoading
        } = this.props;

        if (!subCategoriesLoading && !categoriesLoading)
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth,
                        height: deviceHeight * 0.7,
                    }}
                >
                    <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                    <Text
                        style={{
                            color: '#7E7E7E',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17,
                            padding: 15,
                            textAlign: 'center'
                        }}
                    >
                        {locales('labels.emptyList')}</Text>
                </View>
            );

        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <View
                        key={index}
                        style={{
                            padding: 20,
                            flex: 1,
                            width: '100%',
                            height: deviceHeight * 0.1,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomWidth: 0.7,
                            borderBottomColor: '#e0e0e0',

                        }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={'100%'}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"

                        >
                            <Rect x="75%" y="20%" width="120" height="10" />
                        </ContentLoader>
                        <FontAwesome5 name='angle-left' size={26} color='#bebebe' />
                    </View>
                )
                )}
            </View>
        )
    };

    handleSubCategoryItemClick = item => {
        const {
            subCategoriesList = [],
        } = this.state;

        analytics().logEvent('apply_sort', {
            sort_type: item.name
        });

        if (!subCategoriesList.length) {
            this.setState({
                modals: [],
                subCategoriesModalFlag: false
            }, () => {
                this.props.closeFilters();
                this.props.selectedFilter(item.id, item.category_name);
            });
        }
        else {
            this.sortProducts(item)
        }
    };

    renderSubCategoriesListItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={_ => this.handleSubCategoryItemClick(item)}
                style={{
                    borderBottomWidth: 0.7,
                    justifyContent: 'space-between',
                    padding: 20,
                    borderBottomColor: '#e0e0e0',
                    flexDirection: 'row',
                    width: deviceWidth
                }}>
                <FontAwesome5
                    name='angle-left'
                    size={26}
                    color='#bebebe'
                />
                <Text
                    style={{
                        fontSize: 18,
                        color: '#555',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {item.category_name}
                </Text>
            </Pressable>
        )
    };

    renderModalItem = ({ item }) => {
        const
            {
                category_name,
                subCategoriesList
            } = item;

        const {
            modals = []
        } = this.state;

        return (
            <Modal
                animationType="slide"
                visible={modals.findIndex(item => item.category_name == category_name) > -1}
                onRequestClose={_ => this.omitItemFromModals(category_name)}
            >
                <Header
                    title={category_name}
                    onBackButtonPressed={_ => this.omitItemFromModals(category_name)}
                    {...this.props}
                />

                <FlatList
                    ListEmptyComponent={this.renderSubCategoriesListEmptyComponent}
                    data={subCategoriesList}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={this.renderSubCategoriesListItem}
                />
            </Modal >

        )
    };

    renderCategoriesListItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                activeOpacity={1}
                onPress={() => this.sortProducts(item)}
                style={{
                    borderBottomWidth: 0.7,
                    justifyContent: 'space-between',
                    padding: 20,
                    borderBottomColor: '#e0e0e0',
                    flexDirection: 'row',
                    width: deviceWidth
                }}
            >
                <FontAwesome5
                    name='angle-left'
                    size={26}
                    color='#bebebe'
                />
                <Text
                    style={{
                        fontSize: 18,
                        color: '#555',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {item.category_name}
                </Text>
            </Pressable>
        )
    };

    render() {

        const {
            modals
        } = this.state;

        const {
            showFilters
        } = this.props;

        const categoriesList = this.state.categoriesList.filter(item => item.parent_id == null);

        return (
            <>
                {!!showFilters ?
                    <Modal
                        animationType="slide"
                        visible={!!showFilters}
                        onRequestClose={() => this.props.closeFilters()}>

                        <Header
                            title={locales('titles.allOfTheCategories')}
                            onBackButtonPressed={_ => this.props.closeFilters()}
                            {...this.props}
                        />

                        <FlatList
                            data={categoriesList}
                            ListEmptyComponent={this.renderSubCategoriesListEmptyComponent}
                            style={{ marginVertical: 8 }}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={this.renderCategoriesListItem}
                        />

                    </Modal>
                    : null}

                {modals.length ?
                    <FlatList
                        data={modals}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderModalItem}
                    />
                    :
                    null}
            </>
        )
    }
}

const mapStateToProps = ({
    registerProductReducer
}) => {

    const {
        categories,
        categoriesList,
        categoriesFailed,
        categoriesError,
        categoriesMessage,
        categoriesLoading,

        subCategoriesLoading,
    } = registerProductReducer;

    return {
        categories,
        categoriesList,
        categoriesFailed,
        categoriesError,
        categoriesMessage,
        categoriesLoading,

        subCategoriesLoading,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true, true))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
