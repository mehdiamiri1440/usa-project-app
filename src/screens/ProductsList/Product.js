import React, { PureComponent } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    ScrollView,
    Modal
}
    from 'react-native';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Toast } from 'native-base';
import Svg, { Path, G } from "react-native-svg"
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import * as productListActions from '../../redux/productsList/actions'
import * as profileActions from '../../redux/profile/actions'
import ValidatedUserIcon from '../../components/validatedUserIcon';
import { formatter, validator } from '../../utils';
import { BuskoolTextInput, BuskoolButton } from '../../components';

class Product extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showValidatedUserModal: false,
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
            editionFlag: false,
            deleteProductFlag: false,
            showDeletationMessage: false,
            deleteMessageText: '',
            isProductImageBroken: false,
            deletedProductId: null,
        }
    }

    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "product",
            screen_class: "product",
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.productItem
            && Object.entries(this.props.productItem).length) {

            const {
                main = {}
            } = this.props.productItem;

            const {
                max_sale_price = '',
                min_sale_price = '',
                stock = '',
                min_sale_amount = ''
            } = main;

            this.setState({
                minimumOrder: min_sale_amount.toString(),
                maximumPrice: max_sale_price.toString(),
                minimumPrice: min_sale_price.toString(),
                amount: stock.toString(),
                loaded: true
            });
        }
    }


    onAmountSubmit = field => {
        this.setState(() => ({
            amountError: '',
            amount: field,
            amountClicked: true
        }));
        if (field) {
            if (!validator.isNumber(field)) {
                this.setState(() => ({
                    amountError: "لطفا  فقط عدد وارد کنید",
                    amountClicked: true
                }));
            }
            if (field >= 1000000000) {
                this.setState(() => ({
                    amountError: locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.qunatityAmount') }),
                    amountClicked: true
                }));
            }
            if (field <= 0) {
                this.setState(() => ({
                    amountError: locales('errors.canNotBeZero', { fieldName: locales('titles.qunatityAmount') }),
                    amountClicked: true
                }));
            }
            if (!this.amountError) {
                this.setState(() => ({
                    amountText: formatter.convertUnitsToText(field),
                    amountClicked: true
                }));
            }
        } else {
            this.setState(() => ({
                amount: '',
                amountText: '',
                amountClicked: false
            }));
        }

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

        this.setState(() => ({
            minimumOrderError: '',
            minimumOrder: field,
            minimumOrderClicked: true
        }));

        if (field) {
            if (!validator.isNumber(field)) {
                this.setState(() => ({
                    minimumOrderError: "لطفا  فقط عدد وارد کنید",
                    minimumOrderClicked: true
                }));
            }
            if (field >= 1000000000) {
                this.setState(() => ({
                    minimumOrderError: locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.minOrder') }),
                    minimumOrderClicked: true
                }));
            }
            if (field <= 0) {
                this.setState(() => ({
                    minimumOrderError: locales('errors.canNotBeZero', { fieldName: locales('titles.minOrder') }),
                    minimumOrderClicked: true
                }));
            }
            if (!this.minimumOrderError) {
                this.setState(() => ({
                    minimumOrderText: formatter.convertUnitsToText(field),
                    minimumOrderClicked: true
                }));
            }
        } else {
            this.setState(() => ({
                minimumOrder: '',
                minimumOrderText: '',
                minimumOrderClicked: false
            }));
        }

    };

    onSubmit = () => {
        const {
            productItem = {}
        } = this.props;

        const {
            user_info = {}
        } = productItem;
        const {
            user_name
        } = user_info;

        let { minimumOrder, maximumPrice, minimumPrice, amount } = this.state;

        let minimumOrderError = '', maximumPriceError = '', minimumPriceError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.pleaseEnterField', { fieldName: locales('titles.qunatityAmount') })
        }
        else if (amount && amount >= 1000000000) {
            amountError = locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.qunatityAmount') })
        }
        else if (amount && amount <= 0) {
            amountError = locales('errors.canNotBeZero', { fieldName: locales('titles.qunatityAmount') })
        }
        else {
            amountError = '';
        }


        if (!minimumOrder) {
            minimumOrderError = locales('errors.pleaseEnterField', { fieldName: locales('titles.minOrder') })
        }
        else if (minimumOrder && minimumOrder >= 1000000000) {
            minimumOrderError = locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.minOrder') })
        }
        else if (minimumOrder && minimumOrder <= 0) {
            minimumOrderError = locales('errors.canNotBeZero', { fieldName: locales('titles.minOrder') })
        }
        else {
            minimumOrderError = '';
        }


        if (!maximumPrice) {
            maximumPriceError = locales('errors.pleaseEnterField', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else if (maximumPrice && maximumPrice <= 0) {
            maximumPriceError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else {
            maximumPriceError = '';
        }



        if (!minimumPrice) {
            minimumPriceError = locales('errors.pleaseEnterField', { fieldName: locales('titles.minPriceNeeded') })
        }
        else if (minimumPrice && minimumPrice <= 0) {
            minimumPriceError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.minPriceNeeded') })
        }
        else {
            minimumPriceError = '';
        }

        this.setState({
            minimumOrderClicked: true, maxPriceClicked: true,
            minPriceClicked: true, amountClicked: true, minimumOrderError, maximumPriceError, minimumPriceError, amountError
        })

        if (!minimumOrderError && !minimumPriceError && !maximumPriceError && !amountError) {
            let productObject = {
                product_id: this.props.productItem.main.id,
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
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                    return new Promise.all([
                        this.props.fetchAllProducts(),
                        this.props.fetchAllMyProducts(user_name)
                    ]);
                });
            }).catch(_ => {
                const { editProductMessage } = this.props;
                this.setState({
                    showEditionMessage: true,
                    editionMessageText: editProductMessage
                }, () => {
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                    return new Promise.all([
                        this.props.fetchAllProducts(),
                        this.props.fetchAllMyProducts(user_name)
                    ]);
                });
            });
        }
    };

    deleteProduct = id => {
        this.props.deleteProduct(id).then(_ => {
            const { deleteProductMessage, productItem = {} } = this.props;
            const { user_info = {} } = productItem;
            const {
                user_name
            } = user_info;
            this.setState({
                showDeletationMessage: true,
                deleteMessageText: deleteProductMessage
            }, () => {
                setTimeout(() => {
                    this.setState({ showDeletationMessage: false, deleteProductFlag: false, deletedProductId: id })
                }, 4000);
                return new Promise.all([
                    this.props.fetchAllProducts(),
                    this.props.fetchAllMyProducts(user_name)
                ]);
            });
        }).catch(_ => {
            const { deleteProductMessage } = this.props;
            this.setState({
                showDeletationMessage: true,
                deleteMessageText: deleteProductMessage
            }, () => {
                setTimeout(() => {
                    this.setState({ showDeletationMessage: false, deleteProductFlag: false })
                }, 4000);
                return new Promise.all([
                    this.props.fetchAllProducts(),
                    this.props.fetchAllMyProducts(user_name)
                ]);
            });
        });
    };

    renderProductImage = (photos = []) => {
        const {
            isProductImageBroken,
        } = this.state;

        if (isProductImageBroken)
            return require('../../../assets/icons/image-load-faild.jpg');

        if (photos.length) {
            return {
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
                uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${photos[0].file_path}`
            }
        }

        return require('../../../assets/icons/placeholder-logo.png');

    };

    navigateToPaymentType = _ => {
        const {
            productItem = {}
        } = this.props;

        const {
            main = {},
        } = productItem;

        const {
            id: productId
        } = main;

        this.props.navigation.navigate('PaymentType', {
            price: 25000,
            type: 0,
            productId,
            bankUrl: `${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${productId}`
        });
    };

    render() {
        const {
            loggedInUserId,
            deleteProductStatus,
            deleteProductLoading,
            width = deviceWidth * 0.97,
            shouldShowMyButtons = false
        } = this.props;

        const {
            main = {},
            photos = [],
            profile_info = {},
            user_info = {}
        } = this.props.productItem;
        const {
            address,
            category_id,
            category_name,
            city_id,
            city_name,
            confirmed,
            description,
            is_elevated,
            min_sale_amount,
            max_sale_price,
            min_sale_price,
            myuser_id,
            id: productId,
            product_name,
            province_id,
            province_name,
            stock,
            sub_category_id,
            sub_category_name,
            updated_at,
            photos_count
        } = main;

        const {
            profile_photo
        } = profile_info;

        const {
            active_pakage_type,
            created_at,
            first_name,
            last_name,
            response_rate,
            response_time,
            ums,
            id: contact_id,
            is_verified,
            user_name
        } = user_info;

        const {
            showDeletationMessage,
            deleteMessageText,
            editionMessageText,
            editProductStatus,
            showEditionMessage,
            deleteProductFlag,
            editionFlag,
            minimumOrder,
            amount,
            loaded,
            maximumPrice,
            minimumPrice,
            minimumOrderError,
            maximumPriceError,
            minimumPriceError,
            amountError,
            editProductLoading,

            showValidatedUserModal,

            deletedProductId
        } = this.state;

        const selectedContact = {
            first_name,
            contact_id,
            user_name,
            last_name,
            is_verified
        }

        return (
            <>


                {(deleteProductLoading || editProductLoading) ? <ActivityIndicator size="large" color="#00C569"
                    style={{
                        position: 'absolute', left: '44%', top: '40%',
                        borderColor: 'black',
                        backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                    }}
                /> : null}


                {/* 
                    <Portal>
                        <Dialog
                            visible={showValidatedUserModal}
                            onDismiss={() => this.setState({ showValidatedUserModal: false })}>
                            <View style={{
                                padding: 10, marginBottom: 5,
                                borderBottomWidth: 0.7, width: '100%',
                                justifyContent: 'center', alignItems: 'center',
                                borderBottomColor: '#BEBEBE'
                            }}>
                                <Paragraph style={{
                                    textAlign: 'center', width: '100%',
                                    flexDirection: 'row-reverse', paddingTop: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#777777'
                                }}>
                                    {locales('labels.validatedUser')}
                                </Paragraph>
                            </View>
                            <Dialog.Content>
                                <Text style={{
                                    width: '100%', textAlign: 'center', fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    color: '#00C569'
                                }}>
                                    {locales('titles.thisUserIsValidated')}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        return Linking.canOpenURL('https://www.buskool.com/verification').then(supported => {
                                            if (supported) {
                                                Linking.openURL('https://www.buskool.com/verification');
                                            }
                                        })
                                    }}
                                    style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text
                                        style={{
                                            marginHorizontal: 2,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center',
                                            fontSize: 16, color: '#777777'
                                        }}
                                    >{locales('titles.forMoreDetails')}</Text>
                                    <Text style={{
                                        color: '#1DA1F2',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold', textAlign: 'center',
                                        fontSize: 18,
                                    }}>
                                        {locales('titles.here')}
                                    </Text>
                                    <Text style={{
                                        color: '#777777', marginHorizontal: 2,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center',
                                        fontSize: 16,
                                    }}>
                                        {locales('titles.goForClick')}
                                    </Text>
                                </Pressable>
                            </Dialog.Content>
                            <Dialog.Actions style={{
                                borderTopColor: '#BEBEBE',
                                borderTopWidth: 0.8,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <BuskoolButton
                                    style={[styles.loginButton, { width: '50%' }]}
                                    onPress={() => this.setState({ showValidatedUserModal: false })}>
                                    <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.close')}
                                    </Text>
                                </BuskoolButton>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>


 */}

                {editionFlag ? <Modal
                    onDismiss={() => this.setState({ editionFlag: false })}
                    onRequestClose={() => this.setState({ editionFlag: false })}
                    visible={editionFlag}
                    transparent={true}
                    animationType='fade'
                >
                    <Dialog
                        dismissable
                        visible={editionFlag}
                        onDismiss={() => this.setState({ editionFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderBottomColor: '#bebebe',
                                borderBottomWidth: 1
                            }}
                        >
                            <FontAwesome5
                                onPress={() => this.setState({ editionFlag: false })}
                                name="times"
                                color="red"
                                solid
                                size={18}
                            />
                            <Text
                                style={{
                                    textAlign: 'right',
                                    fontSize: 24,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#333',
                                    marginTop: 5
                                }}
                            >
                                {
                                    locales('labels.edition',
                                        {
                                            fieldName:
                                                `${category_name || '---'} ${category_name ? '|' : ''} ${sub_category_name || '---'}`
                                        })}
                            </Text>
                        </View>

                        {!showEditionMessage ?

                            <Dialog.ScrollArea>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardDismissMode='none'
                                    keyboardShouldPersistTaps='handled'
                                >
                                    <View style={[styles.textInputPadding]}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                padding: 5
                                            }}
                                        >
                                            {locales('titles.amount')}
                                        </Text>
                                        {/* <Item
                                            regular
                                            style={{
                                                borderColor: amountError ? '#D50000' : amount && amount.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5, padding: 3
                                            }}> */}
                                        <BuskoolTextInput
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 14,
                                                borderRadius: 4,
                                                flexDirection: 'row',
                                                textDecorationLine: 'none',
                                                borderWidth: 1,
                                                borderColor: '#ebebeb',
                                                padding: 10,
                                                direction: 'rtl',
                                                textAlign: 'right'
                                            }}
                                            placeholderTextColor="#BEBEBE"
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            keyboardType='number-pad'
                                            autoCompleteType='off'
                                            onChangeText={this.onAmountSubmit}
                                            value={amount}
                                            placeholder={locales('titles.amountWithExample')}
                                            ref={this.amountRef}

                                        />
                                        {/* </Item> */}
                                        <Text style={{
                                            height: 20,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            textAlign: !amountError && amount && amount.length ? 'left' : 'right'
                                        }}>

                                            {!!amountError && <Text style={{
                                                fontSize: 14, color: '#D81A1A',
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}> {amountError}</Text>}
                                        </Text>
                                    </View>
                                    <View
                                        style={[styles.textInputPadding]}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                padding: 5
                                            }}
                                        >
                                            {`${locales('titles.minOrder')} (${locales('labels.kiloGram')})`}
                                        </Text>
                                        {/* <Item
                                            regular
                                            style={{
                                                borderColor: minimumOrderError ? '#D50000' : minimumOrder && minimumOrder.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5,
                                                padding: 3
                                            }}> */}
                                        <BuskoolTextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            autoCompleteType='off'
                                            keyboardType='number-pad'
                                            onChangeText={this.onMinimumOrderSubmit}
                                            value={minimumOrder}
                                            placeholder={locales('titles.minimumOrderWithExample')}
                                            ref={this.minimumOrderRef}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 14,
                                                borderRadius: 4,
                                                flexDirection: 'row',
                                                borderWidth: 1,
                                                borderColor: '#ebebeb',
                                                padding: 10,
                                                textDecorationLine: 'none',
                                                direction: 'rtl',
                                                textAlign: 'right'
                                            }}
                                            placeholderTextColor="#BEBEBE"
                                        />
                                        {/* </Item> */}
                                        <Text style={{
                                            height: 20,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            textAlign: !minimumOrderError && minimumOrder && minimumOrder.length ? 'left' : 'right'
                                        }}>

                                            {!!minimumOrderError && <Text style={{
                                                fontSize: 14, color: '#D81A1A',
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}> {minimumOrderError}</Text>}
                                        </Text>
                                    </View>
                                    <View
                                        style={[styles.textInputPadding]}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                padding: 5
                                            }}
                                        >
                                            {locales('titles.minimumPrice')}
                                        </Text>
                                        {/* <Item
                                            regular
                                            style={{
                                                borderColor: minimumPriceError ? '#D50000' : minimumPrice && minimumPrice.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5,
                                                padding: 3
                                            }}> */}
                                        <BuskoolTextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            keyboardType='number-pad'
                                            autoCompleteType='off'
                                            onChangeText={this.onMinimumPriceSubmit}
                                            value={minimumPrice}
                                            placeholder={locales('titles.minimumPriceWithExample')}
                                            ref={this.minimumPriceRef}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 14,
                                                flexDirection: 'row',
                                                borderRadius: 4,
                                                borderWidth: 1,
                                                borderColor: '#ebebeb',
                                                padding: 10,
                                                textDecorationLine: 'none',
                                                direction: 'rtl',
                                                textAlign: 'right'
                                            }}
                                            placeholderTextColor="#BEBEBE"
                                        />
                                        {/* </Item> */}
                                        <Text style={{
                                            fontSize: 14, color: '#D81A1A', height: 20,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}>
                                            {!!minimumPriceError ? minimumPriceError : null}
                                        </Text>
                                    </View>
                                    <View
                                        style={[styles.textInputPadding]}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                padding: 5
                                            }}
                                        >
                                            {locales('titles.maximumPrice')}
                                        </Text>
                                        {/* <Item
                                            regular
                                            style={{
                                                borderColor: maximumPriceError ? '#D50000' : maximumPrice && maximumPrice.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5,
                                                padding: 3
                                            }}> */}
                                        <BuskoolTextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            autoCompleteType='off'
                                            keyboardType='number-pad'
                                            onChangeText={this.onMaximumPriceSubmit}
                                            value={maximumPrice}
                                            placeholder={locales('titles.maximumPriceWithExample')}
                                            ref={this.maximumPriceRef}
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 14,
                                                borderRadius: 4,
                                                flexDirection: 'row',
                                                borderWidth: 1,
                                                borderColor: '#ebebeb',
                                                padding: 10,
                                                textDecorationLine: 'none',
                                                direction: 'rtl',
                                                textAlign: 'right'

                                            }}
                                            placeholderTextColor="#BEBEBE"
                                        />
                                        {/* </Item> */}
                                        <Text style={{
                                            fontSize: 14, color: '#D81A1A', height: 20,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}>
                                            {!!maximumPriceError ? maximumPriceError : null}
                                        </Text>
                                    </View>
                                    <BuskoolButton
                                        style={[
                                            !minimumOrder.length ||
                                                !amount.length ||
                                                !maximumPrice ||
                                                !minimumPrice ||
                                                minimumOrderError ||
                                                amountError ||
                                                maximumPriceError ||
                                                minimumPriceError
                                                ? {
                                                    textAlign: 'center',
                                                    borderRadius: 5,
                                                    height: 45,
                                                    backgroundColor: '#B5B5B5',
                                                    color: 'white',
                                                }
                                                : styles.loginButton,
                                            {
                                                marginVertical: 0,
                                                width: '50%',
                                                height: 45,
                                                elevation: 0,
                                                alignItems: 'center',
                                                alignSelf: 'center',
                                                top: -10,
                                                justifyContent: 'center'
                                            }
                                        ]}
                                        onPress={() => this.onSubmit()}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                {
                                                    alignSelf: 'center'
                                                }]}>
                                            {locales('titles.submitChanges')}
                                        </Text>
                                    </BuskoolButton>
                                </ScrollView>
                            </Dialog.ScrollArea>
                            :
                            <>

                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center'
                                    }}>

                                    {editProductStatus ? <AntDesign
                                        name="close"
                                        color="#f27474"
                                        size={70}
                                        style={[
                                            styles.dialogIcon, {
                                                borderColor: '#f27474',
                                            }]} /> : <Feather
                                        name="check"
                                        color="#a5dc86"
                                        size={70}
                                        style={[
                                            styles.dialogIcon, {
                                                borderColor: '#edf8e6',
                                            }]} />
                                    }

                                </View>
                                <Dialog.Actions
                                    style={styles.mainWrapperTextDialogModal}
                                >

                                    <Text
                                        style={styles.mainTextDialogModal}
                                    >
                                        {editionMessageText}
                                    </Text>

                                </Dialog.Actions>
                            </>}
                    </Dialog>
                </Modal >
                    : null}


                {deleteProductFlag ? <Modal
                    onDismiss={() => this.setState({ deleteProductFlag: false })}
                    onRequestClose={() => this.setState({ deleteProductFlag: false })}
                    visible={deleteProductFlag}
                    transparent={true}
                    animationType='fade'
                >
                    <Dialog
                        visible={deleteProductFlag}
                        onDismiss={() => this.setState({ deleteProductFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <BuskoolButton
                                onPress={() => this.setState({ deleteProductFlag: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </BuskoolButton>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.deleteProduct')}
                            </Paragraph>
                        </Dialog.Actions>


                        {!showDeletationMessage ? <>
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center'
                                }}>

                                <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                    borderColor: '#facea8',
                                }]} />

                            </View>
                            <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                <Text style={styles.mainTextDialogModal}>
                                    {locales('titles.doYouWishToDeleteProduct')}
                                </Text>

                            </Dialog.Actions>
                            <View style={{
                                width: '100%',
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                <BuskoolButton
                                    style={[styles.modalButton, styles.redButton]}
                                    onPress={() => this.deleteProduct(productId)}
                                >

                                    <Text style={styles.buttonText}>{locales('titles.deleteIt')}
                                    </Text>
                                </BuskoolButton>
                            </View>
                        </>
                            : <>

                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center'
                                    }}>

                                    {!deleteProductStatus ? <AntDesign name="close" color="#f27474" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#f27474',
                                    }]} /> : <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#edf8e6',
                                    }]} />}

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {deleteMessageText}
                                    </Text>

                                </Dialog.Actions>
                            </>}


                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <BuskoolButton
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ deleteProductFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </BuskoolButton>
                        </Dialog.Actions>
                    </Dialog>
                </Modal >
                    : null}

                {deletedProductId != productId ?
                    <View transparent style={styles.cardWrapper, {
                        width: '100%',
                    }}>
                        <View style={[{ borderColor: active_pakage_type == 3 ? '#00C569' : '#dedede' }, styles.cardItemStyle]}>


                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                onPress={() => {
                                    analytics().logEvent('show_product_in_seperate_page', {
                                        product_id: productId
                                    });
                                    this.props.navigation.push('ProductDetails', { productId })
                                }}
                                style={{
                                    width: '100%',
                                    overflow: "hidden",

                                }}
                            >

                                <View
                                    style={{
                                        width: '100%',
                                        height: deviceHeight * 0.2,

                                    }}
                                >

                                    {active_pakage_type == 3 && <Svg
                                        style={{
                                            position: 'absolute', left: 10, top: 0, zIndex: 1,
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="27"
                                        height="37.007"
                                        viewBox="0 0 27 37.007"
                                    >
                                        <G data-name="Group 145" transform="translate(-261 -703.993)">
                                            <Path
                                                fill="#00c569"
                                                d="M0 0l27-.016v36.989l-13.741-5.989-13.259 6z"
                                                data-name="Path 1"
                                                transform="translate(261 704.016)"
                                            ></Path>
                                            <Path
                                                fill="#00b761"
                                                d="M0 0H27V1.072H0z"
                                                data-name="Rectangle 6"
                                                transform="translate(261 703.993)"
                                            ></Path>
                                            <G fill="#fff" data-name="Group 23" transform="translate(266 707)">
                                                <Path
                                                    d="M8.511 15.553A8.529 8.529 0 013.444.175l2.162 2.166a5.455 5.455 0 108.3 5.4l1.488-1.466 1.594 1.57a8.518 8.518 0 01-8.473 7.707zM17 6.384l-1.609-1.59-1.477 1.46a5.476 5.476 0 00-2.759-4.069L13.336 0A8.49 8.49 0 0117 6.382z"
                                                    data-name="Subtraction 1"
                                                    transform="translate(0 5.447)"
                                                ></Path>
                                                <G data-name="Group 24" transform="translate(3.292)">
                                                    <Path
                                                        d="M3 0h3.656v3.853H0V3a3 3 0 013-3z"
                                                        data-name="Rectangle 12"
                                                        transform="rotate(45 -.73 4.156)"
                                                    ></Path>
                                                    <Path
                                                        d="M0 0h9.459v3.5H3.5A3.5 3.5 0 010 0z"
                                                        data-name="Rectangle 13"
                                                        transform="rotate(135 5.244 3.623)"
                                                    ></Path>
                                                </G>
                                            </G>
                                        </G>
                                    </Svg>
                                    }
                                    {photos_count > 0 && <View
                                        style={{
                                            flexDirection: 'row-reverse', zIndex: 1,
                                            justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.6)', position: 'absolute',
                                            right: 5, top: 5, borderRadius: 50, width: 46
                                        }}>
                                        <Entypo name='images' size={15} color='white' />
                                        <Text style={{
                                            color: 'white', marginHorizontal: 2,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}>
                                            {photos_count <= 9 ? photos_count : '9+'}
                                        </Text>
                                    </View>}

                                    <View
                                        style={{
                                            backgroundColor: "#404B55",
                                            width: '100%',
                                            height: '100%',
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <FastImage
                                            resizeMode='contain'
                                            style={{
                                                borderTopLeftRadius: 12,
                                                height: '50%',
                                                width: '100%',
                                                top: '20%',
                                                borderTopRightRadius: 12,
                                            }}
                                            source={require('../../../assets/icons/placeholder-logo.png')}
                                        />
                                        <FastImage
                                            style={{
                                                borderRadius: 12,
                                                width: '100%',
                                                height: '100%',
                                                marginHorizontal: 0,
                                                borderBottomLeftRadius: 0,
                                                borderBottomRightRadius: 0,
                                                position: 'absolute',
                                                // paddingLeft: 10
                                            }}
                                            onError={_ => this.setState({ isProductImageBroken: true })}
                                            source={this.renderProductImage(photos)}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </View>
                                    <LinearGradient
                                        start={{ x: 0.5, y: 0 }}
                                        end={{ x: 0.5, y: 1 }}
                                        style={{
                                            width: '100%', height: 37,
                                            position: 'absolute',
                                            padding: 10,
                                            bottom: 0,
                                            alignSelf: 'center',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end'
                                        }}
                                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#E9ECEF', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 14,
                                                bottom: -7

                                            }}
                                        >
                                            {/* {category_name}  */}
                                            {sub_category_name} | <Text
                                                style={{
                                                    color: '#E9ECEF',
                                                    fontWeight: '200',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 14
                                                }}>
                                                {product_name}
                                            </Text>
                                        </Text>
                                    </LinearGradient>
                                </View>

                                <View

                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 5,
                                        borderBottomColor: '#E9ECEF',
                                        borderBottomWidth: 1,
                                        width: '95%',
                                        alignSelf: 'center'
                                    }}>
                                    <Pressable
                                        onPress={() => {
                                            this.props.navigation.push('Profile', { user_name })
                                        }}
                                        android_ripple={{
                                            color: '#ededed'
                                        }}
                                        style={{
                                            flexDirection: 'row-reverse',
                                            // marginTop: -9,
                                            alignItems: 'center',
                                            paddingVertical: 3,
                                            width: '100%',
                                        }}>
                                        {/* <Image
                                        style={{
                                            alignSelf: 'center',
                                            width: 45,
                                            height: 45,
                                            borderRadius: 45,
                                            marginLeft: 5
                                        }}
                                        source={!!profile_photo && profile_photo.length ?
                                            { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                            :
                                            require('../../../assets/icons/user.png')
                                        } /> */}
                                        <View
                                            style={{
                                                justifyContent: 'flex-start',
                                                maxWidth: '88%',
                                                alignItems: 'center',
                                                flexDirection: 'row-reverse'
                                            }}
                                        >
                                            <FontAwesome5
                                                name='user-circle'
                                                color='#777777'
                                                solid
                                                size={16}
                                            />
                                            <View
                                                style={{
                                                    width: '72%',
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                            marginHorizontal: 5,
                                                            fontSize: 13,
                                                            maxWidth: '95%',
                                                            color: '#666666',
                                                        }}>
                                                        {`${first_name} ${last_name}`}
                                                    </Text>
                                                    {is_verified ? <View
                                                        style={{
                                                        }}
                                                    >
                                                        <ValidatedUserIcon {...this.props} />
                                                    </View>
                                                        : null}
                                                </View>
                                                {/* {response_rate > 0 && loggedInUserId != myuser_id &&
                                                <Text style={{ color: '#BEBEBE', fontSize: 12, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                                    {locales('labels.responseRate')} <Text style={{
                                                        color: '#E41C38',
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                                    }}>%{response_rate}</Text>
                                                </Text>} */}
                                            </View>
                                        </View>

                                        {response_rate > 0 && loggedInUserId != myuser_id ?
                                            <Pressable
                                                android_ripple={{
                                                    color: '#ededed'
                                                }}
                                                onPress={() => Toast.show({
                                                    text: locales('labels.responseRate'),
                                                    position: "bottom",
                                                    style: {
                                                        borderRadius: 10,
                                                        bottom: 100, width: '90%',
                                                        alignSelf: 'center', textAlign: 'center'
                                                    },
                                                    textStyle: {
                                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                        textAlign: 'center'
                                                    },
                                                    duration: 3000
                                                })}
                                                style={{
                                                    backgroundColor: '#f2f2f2',
                                                    borderRadius: 20,
                                                    paddingHorizontal: 5,
                                                    flexDirection: 'row-reverse',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <FontAwesome5
                                                    name='exchange-alt'
                                                    size={10}
                                                    color='#e41c38'
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                        color: '#e41c38',
                                                        fontSize: 11,
                                                        marginHorizontal: 2
                                                    }}
                                                >
                                                    %{response_rate}
                                                </Text>
                                            </Pressable>
                                            :
                                            loggedInUserId == myuser_id && shouldShowMyButtons
                                                ?
                                                <Pressable
                                                    android_ripple={{
                                                        color: '#ededed'
                                                    }}
                                                    onPress={() => this.setState({ deleteProductFlag: true })}
                                                    style={{
                                                        alignItems: 'center',
                                                        flexDirection: 'row-reverse',
                                                        right: '-2%'
                                                    }}
                                                >
                                                    <FontAwesome5
                                                        name='trash'
                                                        size={13}
                                                        color='#E41C38'
                                                        style={{ marginHorizontal: 3 }}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#E41C38',
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 14,
                                                            textAlignVertical: 'center',
                                                        }}>
                                                        {locales('labels.deleteProduct')}
                                                    </Text>

                                                </Pressable>
                                                : null
                                        }

                                    </Pressable>

                                    {/* <Pressable
                                    style={{
                                        width: '40%',
                                        alignItems: 'flex-start',
                                        paddingLeft: 20
                                    }}
                                >
                                    {loggedInUserId == myuser_id ?
                                        <Text
                                            onPress={() => this.setState({ deleteProductFlag: true })}
                                            style={{ color: '#E41C38', fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 16, textAlignVertical: 'center' }}>
                                            {locales('labels.deleteProduct')}
                                        </Text>
                                        :
                                        <View
                                            style={{
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Text onPress={() => this.props.navigation.navigate('Profile', { user_name })} style={{
                                                textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#1DA1F2',
                                                fontSize: 16, textAlignVertical: 'center'
                                            }}>
                                                {locales('titles.seeProfile')}
                                            </Text>
                                            <FontAwesome5
                                                name='angle-left'
                                                size={20}
                                                style={{ marginRight: 5 }}
                                                color='#1DA1F2'
                                            />
                                        </View>
                                    }
                                </Pressable> */}

                                </View>

                                <View style={{
                                    width: '100%', paddingHorizontal: 10,
                                    paddingBottom: 5

                                }}>

                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3
                                    }}
                                    >

                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', paddingVertical: 3 }}>
                                            <Entypo name='location-pin' size={18} color='#999999' />
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 12,
                                                    textAlignVertical: 'center', width: '90%'
                                                }}
                                            >
                                                {province_name} - {city_name}
                                            </Text>
                                        </View>
                                        {/* 
                                    <Text
                                        style={{
                                            color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                            textAlignVertical: 'center'
                                        }}
                                    >
                                        {province_name} - {city_name}
                                    </Text> */}
                                    </View>

                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center', justifyContent: 'space-between',
                                    }}>

                                        <View style={{
                                            flexDirection: 'row-reverse', alignItems: 'center',
                                            justifyContent: 'center', paddingVertical: 3, paddingRight: 5,
                                        }}>
                                            <FontAwesome5 name='box-open'
                                                size={13}
                                                style={{ textAlign: 'center', textAlignVertical: 'center' }}
                                                color='#999999' />
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 12,
                                                    textAlignVertical: 'center', marginRight: 3
                                                }}
                                            >
                                                {formatter.convertedNumbersToTonUnit(stock)}
                                            </Text>
                                        </View>
                                        {!!is_elevated && <FontAwesome5
                                            onPress={() => Toast.show({
                                                text: locales('titles.elevatorHasAdded'),
                                                position: "bottom",
                                                style: { borderRadius: 8, bottom: 100, width: '90%', alignSelf: 'center', textAlign: 'center' },
                                                textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                                duration: 3000
                                            })}
                                            name='chart-line' size={14} color='white' style={[
                                                {
                                                    position: 'absolute', right: -5, bottom: -1,
                                                    width: 25, height: 25, backgroundColor: '#38485F', borderRadius: 8,
                                                    textAlign: 'center', textAlignVertical: 'center', margin: 5, padding: 5
                                                }]}
                                        />}
                                        {/* <Text
                                        style={{
                                            color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                            textAlignVertical: 'center'
                                        }}
                                    >
                                        {formatter.convertedNumbersToTonUnit(stock)}
                                    </Text> */}
                                    </View>
                                    {!!!loggedInUserId ?
                                        <Pressable
                                            onPress={_ => {
                                                analytics().logEvent('click_on_btn_in_product_list');
                                                this.props.navigation.push('ProductDetails', { productId });
                                            }}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                borderRadius: 6,
                                                borderColor: '#128C7E',
                                                borderWidth: 1,
                                                padding: 5,
                                                width: '100%',
                                                flexDirection: 'row-reverse',
                                                marginVertical: 8
                                            }}
                                        >
                                            <Svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 20 20"
                                            >
                                                <Path
                                                    fill="#128C7E"
                                                    d="M19.388.405a.605.605 0 00-1.141.399c.929 2.67-.915 4.664-2.321 5.732l-.568-.814c-.191-.273-.618-.5-.95-.504l-3.188.014a2.162 2.162 0 00-1.097.338L.729 12.157a1.01 1.01 0 00-.247 1.404l4.269 6.108c.32.455.831.4 1.287.082l9.394-6.588c.27-.191.582-.603.692-.918l.998-3.145c.11-.314.043-.793-.148-1.066l-.346-.496c1.888-1.447 3.848-4.004 2.76-7.133zm-4.371 9.358a1.608 1.608 0 01-2.24-.396 1.614 1.614 0 01.395-2.246 1.607 1.607 0 011.868.017c-.272.164-.459.26-.494.275a.606.606 0 00.259 1.153c.086 0 .174-.02.257-.059.194-.092.402-.201.619-.33a1.615 1.615 0 01-.664 1.586z"
                                                ></Path>
                                            </Svg>
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    textAlign: 'center',
                                                    color: '#128C7E',
                                                    fontSize: 16,
                                                    marginRight: 3
                                                }}
                                            >
                                                {locales('titles.achiveSaleStatus')}
                                            </Text>
                                        </Pressable>
                                        : null}
                                </View>

                                {loggedInUserId == myuser_id && shouldShowMyButtons ?
                                    <View style={[styles.actionsWrapper, {
                                        paddingHorizontal: 10,
                                    }]}>

                                        <View style={{
                                            flexWrap: 'wrap',
                                            flexDirection: 'row',
                                            justifyContent: !!is_elevated ? 'flex-end' : 'center',
                                            flex: 1,
                                            alignItems: !!is_elevated ? 'center' : 'flex-start',
                                            justifyContent: 'center',
                                            marginVertical: 10,

                                        }}>
                                            <BuskoolButton
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    // maxWidth: 130,
                                                    flex: 1,
                                                    marginRight: 15,
                                                    backgroundColor: '#140092',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: 40,
                                                    elevation: 0
                                                }}
                                                onPress={this.navigateToPaymentType}
                                            >

                                                <View
                                                    style={[styles.textCenterView, styles.buttonText]}>
                                                    <Text style={[styles.textWhite, { marginHorizontal: 5 }]}>
                                                        <MaterialCommunityIcons name='stairs-up' size={20} color='white' />
                                                    </Text>
                                                    <Text style={[styles.textWhite, {
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                                    }]}>
                                                        {locales('titles.elevateProduct')}
                                                    </Text>
                                                </View>
                                            </BuskoolButton>
                                            <BuskoolButton
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    // maxWidth: 130,
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: 'rgba(20, 0, 146, 0.25)',
                                                    height: 40,
                                                    elevation: 0
                                                }}
                                                onPress={() => this.setState({ editionFlag: true })}
                                            >
                                                <View
                                                    style={[styles.textCenterView, styles.buttonText]}>
                                                    <MaterialCommunityIcons
                                                        name='pencil'
                                                        size={20}
                                                        style={{
                                                            top: 7
                                                        }}
                                                        color='#140092'
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.textWhite,
                                                            styles.margin5,
                                                            {
                                                                color: '#140092',
                                                                fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                                            }
                                                        ]
                                                        }
                                                    >
                                                        {locales('titles.edit')}
                                                    </Text>
                                                </View>


                                            </BuskoolButton>
                                        </View>

                                    </View>
                                    : null
                                }

                            </Pressable>
                        </View>
                    </View>
                    : null
                }
            </>
        )
    }
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: '100%',
        borderRadius: 12
    },
    cardItemStyle: {
        borderRadius: 12,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 0,
        borderWidth: 1,
    },
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
        textAlign: 'center',
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: '100%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: '100%',
        height: 40,
        elevation: 0,
        borderRadius: 4,
        backgroundColor: '#FF9828',
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
        height: 45,
        padding: 15,
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
        height: 45,
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        height: 45,
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
        backgroundColor: '#FF9828',
    },
    redButton: {
        backgroundColor: '#E41C39',
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
    actionsWrapper: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',

    },
    elevatorIcon: {
        backgroundColor: '#7E7E7E',
        padding: 10,
        borderRadius: 4,
        height: 40,
        marginTop: 10,
        marginRight: 15
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
    textSize18: {
        fontSize: 18
    }
});

const mapStateToProps = (state) => {
    const {
        profileReducer
    } = state;

    const {
        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,
    } = profileReducer;

    return {
        loggedInUserId: state.authReducer.loggedInUserId,

        deleteProductStatus: state.productsListReducer.deleteProductStatus,
        deleteProductMessage: state.productsListReducer.deleteProductMessage,
        deleteProductLoading: state.productsListReducer.deleteProductLoading,

        editProductStatus: state.productsListReducer.editProductStatus,
        editProductMessage: state.productsListReducer.editProductMessage,
        editProductLoading: state.productsListReducer.editProductLoading,

        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        deleteProduct: id => dispatch(productListActions.deleteProduct(id)),
        editProduct: product => dispatch(productListActions.editProduct(product)),
        walletElevatorPay: productId => dispatch(profileActions.walletElevatorPay(productId)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        fetchAllMyProducts: userName => dispatch(productListActions.fetchAllMyProducts(userName)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Product)