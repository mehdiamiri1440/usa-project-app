import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Modal } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { Input, Label, Item, Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { SliderBox } from "react-native-image-slider-box";
import * as productListActions from '../../redux/productsList/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { validator } from '../../utils';
import Spin from '../../components/loading/loading';
class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edittionFlag: false,
            showEditionMessage: false,
            showFullSizeImageModal: false,
            selectedImage: -1,

            minimumOrder: '',
            amount: '',
            loaded: false,
            maximumPrice: '',
            minimumPrice: '',
            minimumOrderError: '',
            editionMessageText: '',
            showEditionMessage: '',
            maximumPriceError: '',
            minimumPriceError: '',
            amountError: '',
        }
    }


    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();


    componentDidMount() {
        this.props.fetchProductDetails(this.props.route.params.productId).then(_ => {
            const {
                max_sale_price,
                min_sale_price,
                stock,
                min_sale_amount
            } = this.props.productDetails.main;

            this.setState({
                minimumOrder: min_sale_amount.toString(),
                maximumPrice: max_sale_price.toString(),
                minimumPrice: min_sale_price.toString(),
                amount: stock.toString(),
                loaded: true
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && Object.entries(this.props.productDetails).length) {
            const {
                max_sale_price,
                min_sale_price,
                stock,
                min_sale_amount
            } = this.props.productDetails.main;

            this.setState({
                minimumOrder: min_sale_amount.toString(),
                maximumPrice: max_sale_price.toString(),
                minimumPrice: min_sale_price.toString(),
                amount: stock.toString(),
                loaded: true
            });
        }
    }


    showFullSizeImage = index => {
        this.setState({ showFullSizeImageModal: true, selectedImage: index })
    };



    onAmountSubmit = field => {
        this.setState(() => ({
            amount: field,
            amountError: ''
        }));
    };

    onMinimumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumPrice: field,
                minimumPriceError: ''
            }));
        else
            this.setState(() => ({
                minimumPrice: ''
            }));
    };

    onMaximumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                maximumPrice: field,
                maximumPriceError: ''
            }));
        else
            this.setState(() => ({
                maximumPrice: ''
            }));
    };

    onMinimumOrderSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumOrder: field,
                minimumOrderError: ''
            }));
        else
            this.setState(() => ({
                minimumOrder: ''
            }));
    };




    onSubmit = () => {

        let { minimumOrder, maximumPrice, minimumPrice, amount } = this.state;

        let minimumOrderError = '', maximumPriceError = '', minimumPriceError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.fieldNeeded', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        if (!minimumOrder) {
            minimumOrderError = locales('errors.fieldNeeded', { fieldName: locales('titles.minimumOrderNeeded') })
        }
        else {
            minimumOrderError = '';
        }


        if (!maximumPrice) {
            maximumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else {
            maximumPriceError = '';
        }


        if (!minimumPrice) {
            minimumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.minPriceNeeded') })
        }
        else {
            minimumPriceError = '';
        }
        this.setState({ minimumOrderError, maximumPriceError, minimumPriceError, amountError })
        if (!minimumOrderError && !minimumPriceError && !maximumPriceError && !amountError) {
            let productObject = {
                product_id: this.props.productDetails.main.id,
                stock: amount,
                min_sale_amount: minimumOrder,
                max_sale_price: maximumPrice,
                min_sale_price: minimumPrice
            };
            this.props.editProduct(productObject).then(_ => {
                const { editProductMessage } = this.props;
                this.setState({
                    showEditionMessage: true,
                    editionMessageText: editProductMessage
                }, () => {
                    this.props.fetchProductDetails(this.props.route.params.productId);
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            }).catch(_ => {
                const { editProductMessage } = this.props;
                this.setState({
                    showEditionMessage: true,
                    editionMessageText: editProductMessage
                }, () => {
                    this.props.fetchProductDetails(this.props.route.params.productId);
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            });
        }
    }




    render() {
        const { editProductLoading, editProductStatus, productDerailsLoading, loggedInUserId } = this.props;

        const {
            main = {},
            photos = [],
            profile_info = {},
            user_info = {},
        } = this.props.productDetails;

        let {
            showFullSizeImageModal,
            selectedImage,
            editionFlag,
            showEditionMessage,

            minimumOrder,
            amount,
            loaded,
            maximumPrice,
            minimumPrice,
            minimumOrderError,
            editionMessageText,
            maximumPriceError,
            minimumPriceError,
            amountError,
        } = this.state;

        const { profile_photo } = profile_info;

        const {
            active_pakage_type,
            created_at,
            first_name,
            id: userId,
            last_name,
            response_rate,
            review_info = {}
        } = user_info;

        const {
            address,
            category_id,
            category_name,
            city_id,
            city_name,
            confirmed,
            description,
            id: productId,
            is_elevated,
            max_sale_price,
            min_sale_amount,
            min_sale_price,
            myuser_id,
            product_name,
            province_id,
            province_name,
            stock,
            sub_category_id,
            sub_category_name,
            updated_at
        } = main;

        const {
            avg_score,
            total_count
        } = review_info

        let photosWithCompletePath = Array.from(photos).map(item => `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.file_path}`);

        return (
            <>
                <Spin spininng={productDerailsLoading || editProductLoading}></Spin>
                {editionFlag ? <Portal>
                    <Dialog
                        visible={editionFlag}
                        onDismiss={() => this.setState({ editionFlag: false })}>
                        <View style={{
                            padding: 10, marginBottom: 5,
                            borderBottomWidth: 0.7, width: '100%',
                            justifyContent: 'center', alignItems: 'center',
                            borderBottomColor: '#BEBEBE'
                        }}>
                            <Text style={{
                                textAlign: 'center', width: '100%',
                                fontFamily: 'Vazir-Bold-FD', fontSize: 18, color: '#7E7E7E'
                            }}>
                                {locales('labels.edition', { fieldName: `${category_name} | ${sub_category_name}` })}
                            </Text>
                        </View>
                        {!showEditionMessage ?
                            <>
                                <Dialog.ScrollArea>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                                            {locales('titles.amount')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: amountError ? '#D50000' : amount.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{ fontFamily: 'Vazir-FD', flexDirection: 'row', textDecorationLine: 'none' }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholder={locales('titles.amountWithExample')}
                                                ref={this.amountRef}

                                            />
                                        </Item>
                                        {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                                            {locales('titles.minimumOrder')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: minimumOrderError ? '#D50000' : minimumOrder.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                style={{ fontFamily: 'Vazir-FD', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumOrderSubmit}
                                                value={minimumOrder}
                                                placeholder={locales('titles.minimumOrderWithExample')}
                                                ref={this.minimumOrderRef}

                                            />
                                        </Item>
                                        {!!minimumOrderError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label>}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                                            {locales('titles.minimumPrice')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: minimumPriceError ? '#D50000' : minimumPrice.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{ fontFamily: 'Vazir-FD', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumPriceSubmit}
                                                value={minimumPrice}
                                                placeholder={locales('titles.minimumPriceWithExample')}
                                                ref={this.minimumPriceRef}

                                            />
                                        </Item>
                                        {!!minimumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>
                                            {minimumPriceError}</Label>}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                                            {locales('titles.maximumPrice')}
                                        </Label>
                                        <Item regular
                                            style={{
                                                borderColor: maximumPriceError ? '#D50000' : maximumPrice.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5, padding: 3
                                            }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                style={{ fontFamily: 'Vazir-FD', textDecorationLine: 'none' }}
                                                onChangeText={this.onMaximumPriceSubmit}
                                                value={maximumPrice}
                                                placeholder={locales('titles.maximumPriceWithExample')}
                                                ref={this.maximumPriceRef}

                                            />
                                        </Item>
                                        {!!maximumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>
                                            {maximumPriceError}
                                        </Label>}
                                    </View>
                                </Dialog.ScrollArea>
                                <Dialog.Actions style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Button
                                        style={[styles.loginButton, { width: '50%' }]}
                                        onPress={this.onSubmit}>
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>
                                            {locales('titles.submitChanges')}
                                        </Text>
                                    </Button>
                                </Dialog.Actions>
                            </>
                            :
                            <Dialog.Content style={{ padding: 50 }}>
                                <View style={[{ justifyContent: 'center', alignItems: 'center' },
                                editProductStatus ? styles.deletationSuccessfullContainer : styles.loginFailedContainer]}>
                                    {!editProductStatus ? <FontAwesome name='times-circle-o' size={40} color='#E41C39' /> : <MaterialCommunityIcons
                                        name='checkbox-marked-circle-outline' color='white' size={40}
                                    />}
                                    <Paragraph
                                        style={[editProductStatus ? styles.deletationSuccessfullText : styles.loginFailedText,
                                        { width: '100%', fontFamily: 'Vazir' }]}
                                    >
                                        {editionMessageText}
                                    </Paragraph>
                                </View>
                            </Dialog.Content>
                        }
                    </Dialog>
                </Portal>
                    : null}

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={showFullSizeImageModal}
                    onRequestClose={() => this.setState({ showFullSizeImageModal: false })}
                >
                    <Button
                        style={[styles.loginButton, { width: '30%', alignSelf: 'flex-end' }]}
                        onPress={() => this.setState({ showFullSizeImageModal: false })}>
                        <Text style={styles.buttonText}>
                            {locales('titles.close')}
                        </Text>
                    </Button>
                    <Image
                        style={{
                            alignSelf: 'center', width: deviceWidth,
                            height: deviceHeight,
                            resizeMode: 'contain'
                        }}
                        source={{ uri: photosWithCompletePath[selectedImage] }} />
                </Modal>

                <View style={{ backgroundColor: 'white' }}>
                    <SliderBox
                        dotStyle={{ bottom: -30, backgroundColor: 'red', width: 15, height: 15, borderRadius: 7.5 }}
                        images={photosWithCompletePath}
                        onCurrentImagePressed={this.showFullSizeImage}
                    // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                    />
                    <View style={{
                        flexDirection: 'row-reverse', alignItems: 'center',
                        marginVertical: 10, width: deviceWidth, justifyContent: 'space-between', paddingHorizontal: 5
                    }}>
                        <Text style={{ fontFamily: 'Vazir-Bold-FD', fontSize: 20 }}>
                            {product_name}
                        </Text>
                        <Text style={{
                            color: '#777777', borderWidth: 0.8, borderColor: '#777777', fontSize: 14,
                            textAlign: 'center', textAlignVertical: 'center', width: '30%', borderRadius: 6, padding: 5
                        }}>
                            <FontAwesome name='share' size={14} color='#777777' /> {locales('labels.share')}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row-reverse', alignItems: 'center',
                        marginVertical: 10, width: deviceWidth, justifyContent: 'space-between', paddingHorizontal: 5
                    }}>
                        {userId == loggedInUserId ? <Button
                            onPress={() => this.setState({ editionFlag: true })}
                            style={{
                                color: 'white',
                                fontSize: 18,
                                borderRadius: 5,
                                fontFamily: 'Vazir-Bold-FD',
                                width: '40%',
                                paddingRight: 15,
                                backgroundColor: '#000546'
                            }}
                        >
                            <Text
                                style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>
                                {locales('titles.edit')}
                            </Text>
                        </Button> :
                            <Button
                                onPress={() => this.setState({ modalFlag: true })}
                                style={[styles.loginButton, {
                                    width: !!is_elevated ? '92%' : '88%'
                                }]}
                            >
                                <Text style={[styles.buttonText, { paddingRight: 30 }]}>
                                    {locales('titles.achiveSaleStatus')}</Text>
                                <FontAwesome name='envelope' size={20} color='white'
                                    style={{ position: 'absolute', right: !is_elevated ? 101 : 108 }} />
                            </Button>
                        }
                        <FontAwesome5 name='chart-line' size={30} color='white' style={{ backgroundColor: '#7E7E7E', borderRadius: 4, padding: 7 }} />
                    </View>

                </View>
            </>
        )
    }
}



const styles = StyleSheet.create({
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Vazir-Bold-FD',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});

const mapStateToProps = (state) => {
    const {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDerailsLoading,
        productDerailsStatus,

    } = state.productsListReducer
    return {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDerailsLoading,
        productDerailsStatus,

        editProductStatus: state.productsListReducer.editProductStatus,
        editProductMessage: state.productsListReducer.editProductMessage,
        editProductLoading: state.productsListReducer.editProductLoading,

        loggedInUserId: state.authReducer.loggedInUserId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductDetails: id => dispatch(productListActions.fetchProductDetails(id)),
        editProduct: product => dispatch(productListActions.editProduct(product))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
