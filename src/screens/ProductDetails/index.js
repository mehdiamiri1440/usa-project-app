import React, { Component } from 'react';
import {
    Text, Image, View, StyleSheet, Modal, ScrollView, BackHandler,
    TouchableOpacity, Linking, Share, RefreshControl, ActivityIndicator
} from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { Input, Label, Item, Button, Body, Toast, CardItem, Card } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE, REACT_APP_API_ENDPOINT_BLOG_RELEASE } from 'react-native-dotenv';
import { SliderBox } from "react-native-image-slider-box";
import * as productListActions from '../../redux/productsList/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
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

            related_products: [],
            avg_score: 0,
            total_count: 0,

            active_pakage_type: 0,
            created_at: '',
            first_name: '',
            userId: '',
            is_verified: false,
            last_name: '',
            response_rate: 0,
            user_name: '',

            photos: [],
            description: '',

            myuser_id: '',
            product_name: '',
            province_id: null,
            province_name: '',
            sub_category_id: '',
            sub_category_name: '',
            updated_at: '',

            address: '',
            category_id: null,
            category_name: '',
            city_id: null,
            city_name: '',
            confirmed: false,
            is_elevated: false,
            stock: 0,

            max_sale_price: 0,
            min_sale_amount: 0,
            min_sale_price: 0,

            profile_photo: ''
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
        // BackHandler.addEventListener('hardwareBackPress', () => {
        //     global.productIds.pop();
        //     this.props.navigation.navigate({ name: 'ProductDetails', params: { productId: global.productIds[global.productIds.length - 1] }, key: global.productIds[global.productIds.length - 1], index: global.productIds[global.productIds.length - 1] })
        //     this.callApi();
        //     return true;
        // })
        // this.callApi()
        if (this.props.route.params.productId) {
            this.props.fetchAllProductInfo(this.props.route.params.productId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.route.params.productId != this.props.route.params.productId) {
            this.setState({ loaded: false });
            this.props.fetchAllProductInfo(this.props.route.params.productId);
        }
        if ((this.state.loaded == false || prevState.loaded == false) && this.props.productDetailsInfo.length) {
            const {
                main,
                photos,
                profile_info,
                user_info
            } = this.props.productDetailsInfo[0].product;

            const {
                profile_photo
            } = profile_info;

            const {
                address,
                category_id,
                category_name,
                city_id,
                city_name,
                confirmed,
                description,
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
                active_pakage_type,
                created_at,
                first_name,
                id,
                is_verified,
                last_name,
                response_rate,
                review_info = {},
                user_name
            } = user_info;

            const {
                avg_score,
                total_count
            } = review_info;

            const {
                related_products
            } = this.props.productDetailsInfo[1];

            this.setState({
                minimumOrder: min_sale_amount.toString(),
                maximumPrice: max_sale_price.toString(),
                minimumPrice: min_sale_price.toString(),
                amount: stock.toString(),
                loaded: true,

                related_products,
                avg_score,
                total_count,

                active_pakage_type,
                created_at,
                first_name,
                userId: id,
                is_verified,
                last_name,
                response_rate,
                user_name,

                photos,
                description,

                myuser_id,
                product_name,
                province_id,
                province_name,
                sub_category_id,
                sub_category_name,
                updated_at,

                address,
                category_id,
                category_name,
                city_id,
                city_name,
                confirmed,
                is_elevated,
                stock,
                max_sale_price,
                min_sale_amount,
                min_sale_price,

                profile_photo
            });
        }
    }


    callApi = param => {
        let code = param || global.productIds[global.productIds.length - 1];
        if (!global.productIds.length) return this.props.navigation.goBack();
        if (code) {
            this.props.fetchAllRelatedProducts(code).catch(_ => this.setState({ showModal: true }));
            this.props.fetchProductDetails(code).then(_ => {
                if (this.props.productDetailsInfo.length) {
                    const {
                        max_sale_price,
                        min_sale_price,
                        stock,
                        min_sale_amount
                    } = this.props.productDetailsInfo[0].product.main;

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
                product_id: this.props.productDetailsInfo[0].product.main.id,
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
                    this.props.fetchAllProductInfo(this.props.route.params.productId).catch(_ => this.setState({ showModal: true }));
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
                    this.props.fetchAllProductInfo(this.props.route.params.productId).catch(_ => this.setState({ showModal: true }));
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            });
        }
    }


    getProductUrl = _ => {
        if (this.props.productDetailsInfo.length)
            return (
                "/product-view/خرید-عمده-" +
                this.props.productDetailsInfo[0].product.main.sub_category_name.replace(" ", "-") +
                "/" +
                this.props.productDetailsInfo[0].product.main.category_name.replace(" ", "-") +
                "/" +
                this.props.productDetailsInfo[0].product.main.id
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
        if (this.props.productDetailsInfo.length)
            return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productDetailsInfo[0].product.main.id}`).then(supported => {
                if (supported) {
                    Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productDetailsInfo[0].product.main.id}`);
                }
            })
    };

    closeModal = _ => {
        this.setState({ showModal: false })
        this.componentDidMount();
    }

    render() {
        const {
            editProductLoading,
            editProductStatus,
            loggedInUserId,
            is_seller,
            productDetailsInfoLoading,
        } = this.props;


        let {
            showFullSizeImageModal,
            selectedImage,
            editionFlag,
            showEditionMessage,
            elevatorFlag,
            modalFlag,

            minimumOrder,
            amount,
            maximumPrice,
            minimumPrice,
            minimumOrderError,
            editionMessageText,
            maximumPriceError,
            minimumPriceError,
            amountError,

            related_products,
            avg_score,
            total_count,

            active_pakage_type,
            created_at,
            first_name,
            id,
            is_verified,
            last_name,
            response_rate,
            user_name,
            userId,

            photos,

            description,

            myuser_id,
            product_name,
            province_id,
            province_name,
            sub_category_id,
            sub_category_name,
            updated_at,

            address,
            category_id,
            category_name,
            city_id,
            city_name,
            confirmed,
            is_elevated,
            stock,

            max_sale_price,
            min_sale_amount,
            min_sale_price,

            profile_photo
        } = this.state;


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
                <Text>{this.props.route.params.productId}</Text>

                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                {(productDetailsInfoLoading || editProductLoading) ?
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






                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={elevatorFlag}
                        onDismiss={() => this.setState({ elevatorFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ elevatorFlag: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.doElevation')}
                            </Paragraph>
                        </Dialog.Actions>

                        <Text style={{
                            width: '100%', textAlign: 'center',
                            marginTop: 15,
                            fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569'
                        }}>
                            {formatter.numberWithCommas(25000)} {locales('titles.toman')}
                        </Text>

                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('titles.elevationText')}
                            </Text>

                        </Dialog.Actions>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => this.setState({ elevatorFlag: false }, () => {
                                    return this.elevatorPay();
                                })}
                            >

                                <Text style={styles.buttonText}>{locales('titles.pay')}
                                </Text>
                            </Button>
                        </View>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ elevatorFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >




                {editionFlag ? < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={editionFlag}
                        onDismiss={() => this.setState({ editionFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ editionFlag: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.edition', { fieldName: `${category_name || '---'}  ${category_name ? ' | ' : ''} ${sub_category_name || '---'}` })}
                            </Paragraph>
                        </Dialog.Actions>


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
                            </> :
                            <>

                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center'
                                    }}>

                                    {!editProductStatus ? <AntDesign name="close" color="#f27474" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#f27474',
                                    }]} /> : <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#edf8e6',
                                    }]} />}

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {editionMessageText}
                                    </Text>

                                </Dialog.Actions>
                            </>}



                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ elevatorFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal > : null}




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
                            // global.productIds.pop();
                            this.props.navigation.goBack()
                            // this.callApi();
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
                            refreshing={!!this.props.productDetailsInfoLoading}
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
                            dotStyle={{ bottom: -30, width: 10, height: 10, borderRadius: 5 }}
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
                                            backgroundColor: 'white', alignSelf: 'center'
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
                                                return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`).then(supported => {
                                                    if (supported) {
                                                        Linking.openURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`);
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
                            relatedProductsArray={related_products}
                        />
                    </View>

                </ScrollView>

                {!this.props.productDetailsInfoLoading && userId != loggedInUserId ? <View style={{
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
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        // alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
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

        productDetailsInfo,
        productDetailsInfoLoading

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


        productDetailsInfo,
        productDetailsInfoLoading,

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
        editProduct: product => dispatch(productListActions.editProduct(product)),

        fetchAllProductInfo: id => dispatch(productListActions.fetchAllProductInfo(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
