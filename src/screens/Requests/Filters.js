import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Modal } from 'react-native'
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as registerProductActions from '../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoriesModal: false,
            subCategoriesList: [],
            selectedCategoryName: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllCategories();
    }

    sortProducts = (id, name) => {
        this.setState({
            subCategoriesModal: true,
            selectedCategoryName: name,
            subCategoriesList: this.props.categoriesList.some(item => item.id == id) ?
                Object.values(this.props.categoriesList.find(item => item.id == id).subcategories) : []
        })
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

        const categoriesList = this.props.categoriesList.filter(item => item.parent_id == null);

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
                        height: 57,
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
                                <Ionicons name='ios-arrow-back' size={30} color='#BEBEBE' />
                                <Text style={{ fontSize: 18, color: '#7E7E7E' }}>
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
                        height: 57,
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

                    <FlatList
                        data={categoriesList}
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
                                <Ionicons name='ios-arrow-back' size={30} color='#BEBEBE' />
                                <Text style={{ fontSize: 18, color: '#7E7E7E' }}>
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
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
