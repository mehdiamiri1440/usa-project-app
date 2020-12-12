import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';


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

            console.log('333', subCategory, 'list', this.state.categoriesList, 'some', this.state.categoriesList.some(item => item.id == id),
                'find', this.state.categoriesList.find(item => item.id == id))

            if (subCategory == null || subCategory == undefined || !subCategory || typeof subCategory == 'undefined') {
                subCategory = {}
            }

            subCategory = Object.values(!!subCategory ? subCategory : {});
            console.log('444', subCategory)

            this.setState({
                subCategoriesModal: true,
                selectedCategoryName: name,
                subCategoriesList: subCategory
            }, () => {
                if (this.state.subCategoriesList.length <= 0) {
                    this.props.fetchAllCategories()
                    console.log('22222', id, 'name', name, 'categrory',
                        this.state.categoriesList, 'category len', this.state.categoriesList.length,
                        'sub', this.state.subCategoriesList, 'sub len', this.state.subCategoriesList.length)
                    this.setState({ subCategoriesModal: false })
                    this.props.closeFilters()
                }
            })
        }
        else {
            console.warn('1111', id, name, this.state.categoriesList, this.state.categoriesList.length)
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
                            onPress={() => this.setState({ subCategoriesModal: false })}
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
                                {selectedCategoryName}
                            </Text>
                        </View>
                    </View>


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
                            onPress={() => this.props.closeFilters()}
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
                                {locales('titles.categories')}
                            </Text>
                        </View>
                    </View>
                    {this.props.categoriesLoading ? <View style={{
                        width: deviceWidth,
                        padding: 20,
                        justifyContent: "center", alignItems: 'center'
                    }}>
                        <ActivityIndicator size="small" color="#00C569"
                            style={{
                                zIndex: 999,
                                width: 50, height: 50,
                                borderRadius: 50,
                                backgroundColor: '#fff',
                                elevation: 5,
                                padding: 0,
                            }}
                        /></View> : null}
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
