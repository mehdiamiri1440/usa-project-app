import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Modal, ScrollView, BackHandler, TouchableOpacity, Linking, Share, RefreshControl, ActivityIndicator } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { Input, Label, Item, Button, Body, Toast, CardItem, Card } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { SliderBox } from "react-native-image-slider-box";
import * as productListActions from '../../redux/productsList/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { validator, dataGenerator } from '../../utils';
import ChatModal from '../Messages/ChatModal';
import { formatter } from '../../utils'
import ValidatedUserIcon from '../../components/validatedUserIcon';
import RelatedProductsList from './RelatedProductsList';
import NoConnection from '../../components/noConnectionError';

let fromHardwareBack = false;
class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editionFlag: false,
            showEditionMessage: false,
            showFullSizeImageModal: false,
            selectedImage: -1,
            elevatorFlag: false,
            modalFlag: false,

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
            showModal: false,
        }
    }


    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();

    componentWillUnmount() {
        BackHandler.removeEventListener();
    }

    componentDidMount(param) {
        BackHandler.addEventListener('hardwareBackPress', () => {
            global.productIds.pop();
            this.props.navigation.navigate({ name: 'ProductDetails', params: { productId: global.productIds[global.productIds.length - 1] }, key: global.productIds[global.productIds.length - 1], index: global.productIds[global.productIds.length - 1] })
            this.callApi();
            return true;
        })
        this.callApi()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && Object.entries(this.props.productDetails).length && this.props.productDetails.main) {
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

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.route.params.productId == nextProps.route.params.productId)) {
            return true;
        }
        return true
    }

    callApi = param => {
        let code = param || global.productIds[global.productIds.length - 1];
        if (!global.productIds.length) return this.props.navigation.goBack();
        if (code) {
            this.props.fetchAllRelatedProducts(code).catch(_ => this.setState({ showModal: true }));
            this.props.fetchProductDetails(code).then(_ => {
                if (this.props.productDetails && this.props.productDetails.main) {
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
                else {
                    this.setState({ showModal: true })
                }
            }).catch(_ => this.setState({ showModal: true }))
        }
        else {
            this.setState({ showModal: true })
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
                    this.props.fetchProductDetails(this.props.route.params.productId).catch(_ => this.setState({ showModal: true }));
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
                    this.props.fetchProductDetails(this.props.route.params.productId).catch(_ => this.setState({ showModal: true }));
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            });
        }
    }


    getProductUrl = _ => {
        if (!!this.props.productDetails && !!this.props.productDetails.main)
            return (
                "/product-view/خرید-عمده-" +
                this.props.productDetails.main.sub_category_name.replace(" ", "-") +
                "/" +
                this.props.productDetails.main.category_name.replace(" ", "-") +
                "/" +
                this.props.productDetails.main.id
            );
    };

    shareProductLink = async (url) => {
        try {
            const result = await Share.share({
                message: url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
        }
    };



    elevatorPay = () => {
        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productDetails.main.id}`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productDetails.main.id}`);
            }
        })
    };

    closeModal = _ => {
        this.setState({ showModal: false })
        this.componentDidMount();
    }

    render() {
        const {
            relatedProductsArray,
            relatedProductsLoading,
            editProductLoading,
            editProductStatus,
            productDetailsLoading,
            loggedInUserId,
            is_seller
        } = this.props;


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
            elevatorFlag,
            modalFlag,

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
            active_pakage_type = '',
            created_at,
            first_name = '',
            id: userId = '',
            last_name = '',
            response_rate = '',
            review_info = {},
            user_name,
            is_verified
        } = user_info;

        const {
            address,
            category_id,
            category_name = '',
            city_id,
            city_name = '',
            confirmed,
            description = '',
            id: productId,
            is_elevated = '',
            max_sale_price,
            min_sale_amount = '',
            min_sale_price,
            myuser_id,
            product_name = '',
            province_id,
            province_name = '',
            stock = '',
            sub_category_id,
            sub_category_name = '',
            updated_at
        } = main;

        const {
            avg_score,
            total_count
        } = review_info


        const selectedContact = {
            first_name,
            contact_id: userId,
            last_name,
            is_verified
        }

        let photosWithCompletePath = Array.from(photos).map(item => `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.file_path}`);
        let descriptionWithoutHtml = '';
        if (description != undefined && typeof (description) == 'string' && !!description && description.length) {
            descriptionWithoutHtml = description.replace(new RegExp('<hr/>', 'g'), '\n')
        }



        var url = REACT_APP_API_ENDPOINT_RELEASE + this.getProductUrl();

        return (
            <>






                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                {(productDetailsLoading || editProductLoading || relatedProductsLoading) ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',

                        elevation: 5,
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size="large"
                            style={{
                                position: 'absolute', left: '44%', top: '40%',

                                elevation: 5,
                                borderColor: 'black',
                                backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                            }}
                            color="#00C569"

                        />
                    </View> : null}


                {modalFlag ? <ChatModal
                    transparent={false}
                    visible={modalFlag}
                    {...this.props}
                    profile_photo={profile_photo}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                /> : null}


                <Portal>
                    <Dialog
                        visible={elevatorFlag}
                        onDismiss={() => this.setState({ elevatorFlag: false })}>
                        <View style={{
                            padding: 10, marginBottom: 5,
                            borderBottomWidth: 0.7, width: '100%',
                            justifyContent: 'center', alignItems: 'center',
                            borderBottomColor: '#BEBEBE'
                        }}>
                            <Paragraph style={{
                                textAlign: 'center', width: '100%',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#7E7E7E'
                            }}>
                                {locales('labels.doElevation')}
                            </Paragraph>
                        </View>
                        <Dialog.Content>
                            <Text style={{
                                width: '100%', textAlign: 'center',
                                fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569'
                            }}>
                                {formatter.numberWithCommas(25000)} {locales('titles.toman')}
                            </Text>
                            <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center', fontSize: 16, color: '#7E7E7E' }}>
                                {locales('titles.elevationText')}</Text>
                        </Dialog.Content>
                        <Dialog.Actions style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.loginButton, { width: '50%' }]}
                                onPress={() => this.setState({ elevatorFlag: false }, () => {
                                    return this.elevatorPay();
                                })}>
                                <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>


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
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18, color: '#7E7E7E'
                            }}>
                                {locales('labels.edition', { fieldName: `${category_name || '---'}  ${category_name ? ' | ' : ''} ${sub_category_name || '---'}` })}
                            </Text>
                        </View>
                        {!showEditionMessage ?
                            <>
                                <Dialog.ScrollArea>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', flexDirection: 'row', textDecorationLine: 'none' }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholder={locales('titles.amountWithExample')}
                                                ref={this.amountRef}

                                            />
                                        </Item>
                                        {!!amountError ? <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumOrderSubmit}
                                                value={minimumOrder}
                                                placeholder={locales('titles.minimumOrderWithExample')}
                                                ref={this.minimumOrderRef}

                                            />
                                        </Item>
                                        {!!minimumOrderError ? <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumPriceSubmit}
                                                value={minimumPrice}
                                                placeholder={locales('titles.minimumPriceWithExample')}
                                                ref={this.minimumPriceRef}

                                            />
                                        </Item>
                                        {!!minimumPriceError ? <Label style={{ fontSize: 14, color: '#D81A1A' }}>
                                            {minimumPriceError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMaximumPriceSubmit}
                                                value={maximumPrice}
                                                placeholder={locales('titles.maximumPriceWithExample')}
                                                ref={this.maximumPriceRef}

                                            />
                                        </Item>
                                        {!!maximumPriceError ? <Label style={{ fontSize: 14, color: '#D81A1A' }}>
                                            {maximumPriceError}
                                        </Label> : null}
                                    </View>
                                </Dialog.ScrollArea>
                                <Dialog.Actions style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Button
                                        style={[styles.loginButton, { width: '50%' }]}
                                        onPress={() => this.onSubmit()}>
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
                                        { width: '100%', fontFamily: 'IRANSansWeb(FaNum)_Light' }]}
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
                    transparent={true}
                    visible={showFullSizeImageModal}
                    onRequestClose={() => this.setState({ showFullSizeImageModal: false })}
                >
                    <View style={{
                        backgroundColor: 'rgba(59,59,59,0.85)',
                        height: deviceHeight, alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AntDesign name='arrowright' size={30} color='white'
                            style={{ alignSelf: 'flex-end', justifyContent: 'center', position: 'absolute', right: 10, top: 10 }}
                            onPress={() => this.setState({ showFullSizeImageModal: false })}
                        />
                        <Image
                            style={{
                                alignSelf: 'center', width: deviceWidth,
                                height: deviceHeight * 0.6,
                                resizeMode: 'contain'
                            }}
                            source={{ uri: photosWithCompletePath[selectedImage] }} />
                    </View>
                </Modal>

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    elevation: 5,
                    shadowOffset: { width: 20, height: 20 },
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => {
                            global.productIds.pop();
                            this.props.navigation.navigate({ name: 'ProductDetails', params: { productId: global.productIds[global.productIds.length - 1] }, key: global.productIds[global.productIds.length - 1], index: global.productIds[global.productIds.length - 1] })
                            this.callApi();
                        }}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {(`${category_name} ${category_name ? ' | ' : ''} ${sub_category_name}`) || '---'}
                        </Text>
                    </View>
                </View>


                <ScrollView

                    refreshControl={
                        <RefreshControl
                            refreshing={!!this.props.productDetailsLoading}
                            onRefresh={() => this.componentDidMount()}
                        />
                    }>
                    <View style={{
                        backgroundColor: 'white', shadowOffset: { width: 10, height: 10 },
                        elevation: 5,
                    }}>
                        {(photosWithCompletePath && photosWithCompletePath.length) ? <SliderBox
                            dotColor='#0095F6'
                            inactiveDotColor='#A8A8A8'
                            sliderBoxHeight={400}
                            dotStyle={{ bottom: -30, backgroundColor: 'red', width: 10, height: 10, borderRadius: 5 }}
                            images={photosWithCompletePath}
                            onCurrentImagePressed={this.showFullSizeImage}
                        // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                        /> : null}
                        <View
                            style={{
                                flexDirection: 'row-reverse', alignItems: 'center',
                                marginVertical: 30, width: deviceWidth, justifyContent: 'space-between',
                                paddingHorizontal: 15
                            }}>
                            <Text
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', width: '68%', fontSize: 20 }}>
                                {product_name ? product_name : '---'}
                            </Text>
                            <View>
                                <TouchableOpacity
                                    onPress={() => this.shareProductLink(url)}
                                    style={{
                                        borderWidth: 0.8, borderColor: '#777777', borderRadius: 6, padding: 5,
                                        flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <FontAwesome name='share-alt' size={14} color='#777777' style={{ marginHorizontal: 5 }} />
                                    <Text style={{
                                        color: '#777777', fontSize: 14, marginLeft: 5
                                    }}>
                                        {locales('labels.share')}
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center',
                            width: deviceWidth, justifyContent: 'space-between', paddingHorizontal: 15,

                        }}>
                            {userId == loggedInUserId ? <View style={{
                                flexDirection: 'row', justifyContent: 'space-around',
                                flex: 1
                                // width: !!is_elevated ? deviceWidth * 0.88 : deviceWidth * 0.99
                            }}>
                                <Button
                                    style={{
                                        color: 'white',
                                        fontSize: 18,
                                        borderRadius: 5,
                                        marginLeft: !is_elevated ? 5 : 0,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        width: !!is_elevated ? '45%' : '55%',
                                        paddingRight: 40,
                                        backgroundColor: '#E41C38'
                                    }}
                                >
                                    <Text
                                        onPress={() => this.setState({ elevatorFlag: true })}
                                        style={[styles.buttonText, { fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>
                                        {locales('titles.elevateProduct')}</Text>
                                    <FontAwesome5
                                        name='chart-line' size={25} color='white' style={{ position: 'absolute', right: 15 }} />
                                </Button>
                                <Button
                                    style={{
                                        color: 'white',
                                        fontSize: 18,
                                        borderRadius: 5,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        width: '40%',
                                        paddingRight: 15,
                                        backgroundColor: '#000546'
                                    }}
                                >
                                    <Text onPress={() => this.setState({ editionFlag: true })} style={[styles.buttonText, { fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>{locales('titles.edit')}</Text>
                                    <FontAwesome name='pencil' size={23} color='white' style={{ position: 'absolute', right: 15 }} />
                                </Button>
                            </View> :

                                <Button
                                    onPress={() => this.setState({ modalFlag: true })}
                                    style={[styles.loginButton, {
                                        paddingBottom: 7, alignItems: 'center', justifyContent: 'center',
                                        maxWidth: 160,
                                        margin: 0
                                        // width: !!is_elevated ? '50%' : '46%'
                                    }]}
                                >
                                    <View style={[styles.textCenterView, styles.buttonText]}>
                                        <Text style={[styles.textWhite, styles.margin5, { marginTop: 7 }]}>
                                            <FontAwesome name='envelope' size={20} />
                                        </Text>
                                        <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18]}>
                                            {locales('titles.achiveSaleStatus')}
                                        </Text>
                                    </View>

                                </Button>
                            }
                            {is_elevated ? <FontAwesome5
                                onPress={() => Toast.show({
                                    text: locales('titles.elevatorHasAdded'),
                                    position: "bottom",
                                    style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                    textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                    duration: 3000
                                })} name='chart-line' size={25} color='white'
                                style={{ backgroundColor: '#7E7E7E', borderRadius: 4, padding: 10, elevation: 1 }} />
                                : null
                            }
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                            borderBottomWidth: 0.7, paddingVertical: 5,
                            marginVertical: 10, width: deviceWidth * 0.97, alignSelf: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 10
                        }}>
                            <Text style={{ color: '#777777', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>
                                {locales('titles.category')}
                            </Text>
                            <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>{category_name}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                            borderBottomWidth: 0.7, paddingVertical: 5,
                            marginVertical: 10, width: deviceWidth * 0.97, alignSelf: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 10
                        }}>
                            <Text style={{ color: '#777777', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>
                                {locales('titles.province/city')}
                            </Text>
                            <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>{`${province_name || '---'}-${city_name || '==='}`}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                            borderBottomWidth: 0.7, paddingVertical: 5,
                            marginVertical: 10, width: deviceWidth * 0.97, alignSelf: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 10
                        }}>
                            <Text style={{ color: '#777777', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>
                                {locales('titles.stockQuantity')}
                            </Text>
                            <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>{formatter.numberWithCommas(stock)} {locales('labels.kiloGram')}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                            borderBottomWidth: 0.7, paddingVertical: 5,
                            marginVertical: 10, width: deviceWidth * 0.97, alignSelf: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 10
                        }}>
                            <Text style={{
                                color: '#777777', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20
                            }}>
                                {locales('titles.minOrder')}
                            </Text>
                            <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>{formatter.numberWithCommas(min_sale_amount)} {locales('labels.kiloGram')}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                            borderBottomWidth: 0.7, paddingVertical: 5,
                            marginVertical: 10, width: deviceWidth * 0.97, alignSelf: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 10
                        }}>
                            <Text style={{ color: '#777777', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>
                                {locales('titles.price')}
                            </Text>
                            <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>{locales('titles.achiveThePrice')}</Text>
                        </View>

                        <View

                            style={{
                                paddingVertical: 5,
                                marginVertical: 10, width: deviceWidth * 0.97,
                                paddingHorizontal: 10
                            }}>
                            <Text style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 20 }}>
                                {locales('titles.headerDescription')}
                            </Text>
                            <Text style={{ fontSize: 16, color: '#777777', marginBottom: 20 }}>{descriptionWithoutHtml ? descriptionWithoutHtml : '---'}</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 30 }}>
                        <Card>
                            <CardItem style={{ borderWidth: active_pakage_type == 3 ? 1 : 0, borderColor: '#00C569' }}>
                                <Body>
                                    <View style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Image
                                            style={{ width: deviceWidth * 0.35, height: deviceWidth * 0.35, borderRadius: deviceWidth * 0.175 }}
                                            source={profile_photo ? { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                                : require('../../../assets/icons/user.png')}
                                        />
                                        {active_pakage_type == 3 ? <Image source={require('../../../assets/icons/valid_user.png')}
                                            style={{ bottom: 18, left: 3 }} /> : null}
                                    </View>
                                    <View
                                        style={{
                                            top: active_pakage_type == 3 ? -20 : 0,
                                            width: deviceWidth, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
                                        }}>
                                        <Text style={{
                                            color: '#777777', textAlign: 'center', width: '100%',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16
                                        }}>
                                            {is_seller ? locales('labels.seller') : locales('labels.buyer')}
                                        </Text>

                                        <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'center' }}>
                                            <Text style={{
                                                textAlign: 'center', marginHorizontal: 5,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 20
                                            }}>
                                                {`${first_name} ${last_name}`}
                                            </Text>
                                            {is_verified ? <ValidatedUserIcon /> : null}
                                        </View>

                                        {active_pakage_type == 3 ? <Text style={{
                                            color: '#00C569', textAlign: 'center', width: '100%', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18
                                        }}>
                                            {locales('labels.confirmedUser')}
                                        </Text> : null}

                                        {response_rate > 0 ? <Text style={{
                                            textAlign: 'center', width: '100%',
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18, color: '#777777'
                                        }}>
                                            {locales('labels.responseRate')} <Text style={{ color: 'red' }}>%{response_rate}</Text>
                                        </Text> : null}
                                    </View>
                                    <Button
                                        onPress={() => {
                                            this.props.navigation.navigate({ name: 'Profile', params: { user_name }, key: null, index: 0 })
                                        }}
                                        style={[styles.loginButton, {
                                            borderWidth: 1, borderColor: '#00C569',
                                            width: '90%', backgroundColor: 'white', alignSelf: 'center'
                                        }]}
                                    >
                                        <Text style={[styles.buttonText, { fontSize: 16, color: '#00C569' }]}>
                                            {locales('titles.seeProfile')}</Text>
                                    </Button>
                                    <Button
                                        onPress={() => userId == loggedInUserId ? this.props.navigation.navigate('MyBuskool', { screen: 'EditProfile' }) : this.setState({ modalFlag: true })}
                                        style={[styles.loginButton, {
                                            alignSelf: 'center'
                                        }]}
                                    >

                                        <Text style={[styles.buttonText, { fontSize: 16, color: '#fff' }]}>
                                            {loggedInUserId == userId ? locales('titles.editProfile') : locales('titles.sendMessage')}</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>

                        <View style={{ marginTop: 15 }}>
                            <Card>
                                <CardItem>
                                    <Body>
                                        <Text
                                            onPress={() => {
                                                return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/راهنمای-خرید-امن`).then(supported => {
                                                    if (supported) {
                                                        Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/راهنمای-خرید-امن`);
                                                    }
                                                });
                                            }}
                                            style={{ color: '#777777', textAlign: 'center', fontSize: 16 }}>
                                            {locales('labels.buskoolSmallTerms')} <Text style={{ color: '#00C569' }}>{locales('labels.safeShop')}</Text> , {locales('labels.dealEasier')}
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>

                    </View>
                    <View >
                        <View style={{ flexDirection: 'row-reverse', width: deviceWidth }}>
                            <Text style={{ fontSize: 20, color: '#00C569', paddingHorizontal: 10 }}>{locales('labels.relatedProducts')}</Text>
                            <View
                                style={{
                                    height: 2,
                                    flex: 1,
                                    alignSelf: 'center',
                                    backgroundColor: "#BEBEBE",
                                }}>
                                <View
                                    style={{
                                        height: 4,
                                        bottom: 2,
                                        width: 40,
                                        alignSelf: 'flex-end',
                                        backgroundColor: "#00C469",
                                    }}></View>
                            </View>
                        </View>
                        <RelatedProductsList
                            {...this.props}
                            relatedProductsArray={relatedProductsArray}
                        />
                    </View>

                </ScrollView>

                {!this.props.productDetailsLoading && userId != loggedInUserId ? <View style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    height: 65,
                    elevation: 5,
                }} >
                    <Button
                        onPress={() => this.setState({ modalFlag: true })}
                        style={[styles.loginButton, {
                            position: 'absolute',
                            left: 15,
                            right: 15,
                            bottom: 10,
                            zIndex: 1,
                            marginHorizontal: 10,
                            margin: 0
                        }]}
                    >
                        <View style={[styles.textCenterView, styles.buttonText]}>
                            <Text style={[styles.textWhite, styles.margin5, { marginTop: 7 }]}>
                                <FontAwesome name='envelope' size={20} />
                            </Text>
                            <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18]}>
                                {locales('titles.achiveSaleStatus')}
                            </Text>
                        </View>

                    </Button>

                </View>
                    : null}
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
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
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize15: {
        fontSize: 15
    },
    textSize18: {
        fontSize: 18
    },
    textSize20: {
        fontSize: 20
    },
});

const mapStateToProps = (state) => {
    const {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDetailsLoading,
        productDetailsStatus,


        relatedProductsLoading,
        relatedProductsFailed,
        relatedProductsError,
        relatedProductsMessage,
        relatedProductsObject,
        relatedProductsArray,

    } = state.productsListReducer
    return {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDetailsLoading,
        productDetailsStatus,

        relatedProductsLoading,
        relatedProductsFailed,
        relatedProductsError,
        relatedProductsMessage,
        relatedProductsObject,
        relatedProductsArray,

        editProductStatus: state.productsListReducer.editProductStatus,
        editProductMessage: state.productsListReducer.editProductMessage,
        editProductLoading: state.productsListReducer.editProductLoading,

        loggedInUserId: state.authReducer.loggedInUserId,
        is_seller: state.authReducer.is_seller
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setProductDetailsId: id => dispatch(productListActions.setProductDetailsId(id)),
        fetchProductDetails: id => dispatch(productListActions.fetchProductDetails(id)),
        fetchAllRelatedProducts: id => dispatch(productListActions.fetchAllRelatedProducts(id)),
        editProduct: product => dispatch(productListActions.editProduct(product))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
