import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth } from '../../utils/deviceDimenssions';
import Header from '../../components/header';


class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoriesModal: false,
            subCategoriesList: [],
            categoriesList: [],
            loaded: false,
            selectedCategoryName: ''
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

    sortProducts = (id = '', name = '') => {
        if (!!id && !!name && this.state.categoriesList.length) {

            let subCategory = this.state.categoriesList.some(item => item.id == id) ?
                this.state.categoriesList.find(item => item.id == id).subcategories : {};

            if (subCategory == null || subCategory == undefined || !subCategory || typeof subCategory == 'undefined') {
                subCategory = {}
            }

            subCategory = Object.values(!!subCategory ? subCategory : {});

            this.setState({
                subCategoriesModal: true,
                selectedCategoryName: name,
                subCategoriesList: subCategory
            }, () => {
                if (this.state.subCategoriesList.length <= 0) {
                    this.props.fetchAllCategories()
                    this.setState({ subCategoriesModal: false })
                    this.props.closeFilters()
                }
            })
        }
        else {
            this.setState({ subCategoriesModal: false }, () => {
                this.props.closeFilters()
            })
            this.props.fetchAllCategories()
        }
    };

    render() {

        const {
            subCategoriesModal,
            subCategoriesList,
            selectedCategoryName
        } = this.state;

        const {
            showFilters
        } = this.props;

        const categoriesList = this.state.categoriesList.filter(item => item.parent_id == null);

        return (
            <>
                <Modal
                    animationType="slide"
                    visible={subCategoriesModal}
                    onRequestClose={() => this.setState({ subCategoriesModal: false })}>
                    <Header
                        title={selectedCategoryName}
                        onBackButtonPressed={_ => this.setState({ subCategoriesModal: false })}
                        {...this.props}
                    />

                    <FlatList
                        ListEmptyComponent={() => (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{ color: '#BEBEBE', fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.emptyList')}
                            </Text>
                        </View>)}
                        refreshing={this.props.categoriesLoading}
                        data={subCategoriesList}
                        style={{ marginVertical: 8 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ subCategoriesModal: false }, () => {
                                        this.props.closeFilters()
                                        this.props.selectedFilter(item.id, item.category_name)
                                    })
                                }}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                                }}
                            >
                                <FontAwesome5 name='angle-left' size={30} color='#777' />

                                <Text style={{ fontSize: 18, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                    {item.category_name}
                                </Text>

                            </TouchableOpacity>
                        )}
                    />
                </Modal>






                <Modal
                    animationType="slide"
                    visible={showFilters}
                    onRequestClose={() => this.props.closeFilters()}>

                    <Header
                        title={locales('titles.categories')}
                        onBackButtonPressed={_ => this.props.closeFilters()}
                        {...this.props}
                    />

                    {this.props.categoriesLoading ? <View style={{
                        width: deviceWidth,
                        padding: 20,
                        justifyContent: "center", alignItems: 'center'
                    }}>
                        <ShadowView
                            style={{
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 2 },
                                zIndex: 999,
                                width: 50, height: 50,
                                borderRadius: 50,
                                backgroundColor: 'white',
                                padding: 0,
                            }}
                        >
                            <ActivityIndicator size="small" color="#00C569"
                                style={{
                                    top: 14
                                }}
                            />
                        </ShadowView>
                    </View>
                        :
                        null
                    }
                    <FlatList
                        data={categoriesList}
                        refreshing={this.props.categoriesLoading}
                        ListEmptyComponent={() => !this.props.categoriesLoading && (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{ color: '#BEBEBE', fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                {locales('labels.emptyList')}
                            </Text>
                        </View>)}
                        style={{ marginVertical: 8 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.sortProducts(item.id, item.category_name)}
                                style={{
                                    borderBottomWidth: 0.7, justifyContent: 'space-between', padding: 20,
                                    borderBottomColor: '#BEBEBE', flexDirection: 'row', width: deviceWidth
                                }}
                            >
                                <FontAwesome5 name='angle-left' size={30} color='#777' />
                                <Text style={{ fontSize: 18, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                    {item.category_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />



                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        categoriesLoading: state.registerProductReducer.categoriesLoading,
        categoriesMessage: state.registerProductReducer.categoriesMessage,
        categoriesError: state.registerProductReducer.categoriesError,
        categoriesFailed: state.registerProductReducer.categoriesFailed,
        categoriesList: state.registerProductReducer.categoriesList,
        categories: state.registerProductReducer.categories,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true, true)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
