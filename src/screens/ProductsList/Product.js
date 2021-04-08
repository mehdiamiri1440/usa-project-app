import React, { PureComponent } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Linking, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Card, Input, Label, Item, Toast, Button } from 'native-base';
import Svg, { Path, G } from "react-native-svg"
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import * as productListActions from '../../redux/productsList/actions'
import ValidatedUserIcon from '../../components/validatedUserIcon';
import { formatter, validator } from '../../utils';

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
            elevatorFlag: false,
            deleteProductFlag: false,
            showDeletationMessage: false,
            deleteMessageText: ''
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
                max_sale_price = '',
                min_sale_price = '',
                stock = '',
                min_sale_amount = ''
            } = this.props.productItem.main;

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
                    this.props.fetchAllProducts();
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
                    this.props.fetchAllProducts();
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            });
        }
    }



    deleteProduct = id => {
        this.props.deleteProduct(id).then(_ => {
            const { deleteProductMessage } = this.props;
            this.setState({
                showDeletationMessage: true,
                deleteMessageText: deleteProductMessage
            }, () => {
                this.props.fetchAllProducts();
                setTimeout(() => {
                    this.setState({ showDeletationMessage: false, deleteProductFlag: false })
                }, 4000);
            });
        }).catch(_ => {
            const { deleteProductMessage } = this.props;
            this.setState({
                showDeletationMessage: true,
                deleteMessageText: deleteProductMessage
            }, () => {
                this.props.fetchAllProducts();
                setTimeout(() => {
                    this.setState({ showDeletationMessage: false, deleteProductFlag: false })
                }, 4000);
            });
        });
    };

    elevatorPay = () => {
        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productItem.main.id}`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${this.props.productItem.main.id}`);
            }
        })
    };

    render() {
        const {
            loggedInUserId,
            deleteProductStatus,
            deleteProductLoading,

            width = deviceWidth * 0.97
        } = this.props;
        const { main, photos, profile_info, user_info } = this.props.productItem;
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
            elevatorFlag,
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

            showValidatedUserModal
        } = this.state;

        const selectedContact = {
            first_name,
            contact_id,
            user_name,
            last_name,
            is_verified
        }

        return (
            <SafeAreaView>


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
                                <TouchableOpacity
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
                                </TouchableOpacity>
                            </Dialog.Content>
                            <Dialog.Actions style={{
                                borderTopColor: '#BEBEBE',
                                borderTopWidth: 0.8,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    style={[styles.loginButton, { width: '50%' }]}
                                    onPress={() => this.setState({ showValidatedUserModal: false })}>
                                    <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.close')}
                                    </Text>
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>


 */}

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

                                    {editProductStatus ? <AntDesign name="close" color="#f27474" size={70} style={[styles.dialogIcon, {
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
                                onPress={() => this.setState({ editionFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal > : null}





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
                                    return this.elevatorPay()
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



                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={deleteProductFlag}
                        onDismiss={() => this.setState({ deleteProductFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ deleteProductFlag: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
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
                                <Button
                                    style={[styles.modalButton, styles.redButton]}
                                    onPress={() => this.deleteProduct(productId)}
                                >

                                    <Text style={styles.buttonText}>{locales('titles.deleteIt')}
                                    </Text>
                                </Button>
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
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ deleteProductFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >



                <View style={{
                    paddingVertical: 2,

                }}>
                    <Card transparent style={styles.cardWrapper}>
                        <View style={[{ borderColor: active_pakage_type == 3 ? '#00C569' : '#dedede', }, styles.cardItemStyle]}>


                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    analytics().logEvent('show_product_in_seperate_page', {
                                        product_id: productId
                                    });
                                    // this.props.navigation.setParams({ productId, key: productId })
                                    // routes.push(productId);
                                    // global.productIds.push(productId);
                                    this.props.navigation.navigate('ProductDetails', { productId })
                                }}
                                style={{
                                    width: '100%',
                                    overflow: "hidden",

                                }}
                            >

                                <View
                                    style={{
                                        width: '100%',
                                        height: deviceHeight * 0.25,

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
                                            right: 10, top: 5, borderRadius: 12, padding: 3, width: 48
                                        }}>
                                        <Entypo name='images' size={20} color='white' />
                                        <Text style={{ color: 'white', marginHorizontal: 2 }}>
                                            {photos_count <= 9 ? photos_count : '9+'}
                                        </Text>
                                    </View>}

                                    <Image
                                        style={{
                                            borderRadius: 4,
                                            width: '100%',
                                            height: '100%',
                                            marginHorizontal: 0,
                                            backgroundColor: "#f0f3f6",
                                            borderBottomLeftRadius: 0,
                                            borderBottomRightRadius: 0,
                                            // paddingLeft: 10
                                        }}
                                        source={photos.length ?
                                            { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${photos[0].file_path}` }
                                            :
                                            require('../../../assets/icons/user.png')
                                        } />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: '#CCCCCC', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 21,
                                            position: 'absolute',
                                            right: 10,
                                            bottom: 10,
                                        }}
                                    >
                                        {category_name} | {sub_category_name} <Text
                                            style={{ color: '#FFFFFF', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 21 }}>
                                            {product_name}
                                        </Text>
                                    </Text>
                                </View>

                                <View

                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 10
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('Profile', { user_name })
                                        }}
                                        activeOpacity={1}
                                        style={{
                                            flexDirection: 'row-reverse',
                                            // marginTop: -9,
                                            paddingHorizontal: 10,
                                            paddingVertical: 3,
                                            width: '60%',
                                        }}>
                                        <Image
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
                                            } />
                                        <View
                                            style={{
                                                flex: 1, justifyContent: 'space-between',
                                                alignItems: 'flex-start', flexDirection: 'row-reverse'
                                            }}
                                        >
                                            <View>
                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                            marginHorizontal: 5,
                                                            fontSize: 16,
                                                            color: '#333',
                                                            marginTop: response_rate > 0 && loggedInUserId !== myuser_id ? 0 : 9,
                                                        }}>
                                                        {`${first_name} ${last_name}`}
                                                    </Text>
                                                    {is_verified ? <View
                                                        style={{
                                                            marginTop: response_rate > 0 && loggedInUserId !== myuser_id ? 0 : 9
                                                        }}
                                                    >
                                                        <ValidatedUserIcon {...this.props} />
                                                    </View>
                                                        : null}
                                                </View>
                                                {response_rate > 0 && loggedInUserId != myuser_id &&
                                                    <Text style={{ color: '#BEBEBE', fontSize: 12, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                                        {locales('labels.responseRate')} <Text style={{
                                                            color: '#E41C38',
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                                        }}>%{response_rate}</Text>
                                                    </Text>}
                                            </View>

                                        </View>

                                    </TouchableOpacity>

                                    <TouchableOpacity
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
                                            <Text onPress={() => this.props.navigation.navigate('Profile', { user_name })} style={{
                                                textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#00C569', fontSize: 16, textAlignVertical: 'center'
                                            }}>
                                                {locales('labels.seeProfile')}
                                            </Text>}
                                    </TouchableOpacity>

                                </View>

                                <View style={{
                                    width: '100%', paddingHorizontal: 20,
                                    marginTop: 10,

                                }}>

                                    <View style={{
                                        borderBottomColor: '#E9ECEF',
                                        borderBottomWidth: 1,
                                        flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3
                                    }}
                                    >

                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', paddingVertical: 3 }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{ textAlign: 'right' }}>
                                                <Entypo name='location-pin' size={30} color='#999999' />
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#999999', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                                    textAlignVertical: 'center'
                                                }}
                                            >
                                                {locales('titles.province/city')}
                                            </Text>
                                        </View>

                                        <Text
                                            style={{
                                                color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                                textAlignVertical: 'center'
                                            }}
                                        >
                                            {province_name} ، {city_name}
                                        </Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3
                                    }}>

                                        <View style={{
                                            flexDirection: 'row-reverse', alignItems: 'center',
                                            justifyContent: 'center', paddingVertical: 3, paddingRight: 5,
                                        }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{ textAlign: 'right', left: 3 }}
                                            >
                                                <FontAwesome5 name='box-open'
                                                    size={20}
                                                    color='#999999' />
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#999999', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                                    textAlignVertical: 'center', marginRight: 3
                                                }}
                                            >
                                                {locales('titles.stockQuantity')}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                color: '#474747', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17,
                                                textAlignVertical: 'center'
                                            }}
                                        >
                                            {formatter.convertedNumbersToTonUnit(stock)}
                                        </Text>
                                    </View>

                                </View>

                                <View style={[styles.actionsWrapper, {
                                    paddingHorizontal: 10,
                                    marginTop: 30
                                }]}>
                                    {loggedInUserId != myuser_id ?
                                        <Button
                                            onPress={() => {
                                                analytics().logEvent('open_chat', {
                                                    product_id: productId
                                                });
                                                this.props.navigation.navigate('Chat', { profile_photo, contact: selectedContact })
                                            }}
                                            style={[styles.loginButton, { flex: 1 }]}
                                        >
                                            <View style={[styles.textCenterView, styles.buttonText]}>
                                                <Text style={[styles.textWhite, styles.margin5, { marginTop: 5 }]}>
                                                    <FontAwesome5 solid name='envelope' size={20} />
                                                </Text>
                                                <Text style={[styles.textWhite, styles.textBold, styles.textSize18, { marginTop: 3 }]}>
                                                    {locales('titles.achiveSaleStatus')}
                                                </Text>
                                            </View>

                                        </Button>
                                        :
                                        <View style={{
                                            flexWrap: 'wrap',
                                            flexDirection: 'row',
                                            justifyContent: !!is_elevated ? 'flex-end' : 'center',
                                            flex: 1,
                                            alignItems: !!is_elevated ? 'center' : 'flex-start',
                                            justifyContent: 'center',
                                            marginVertical: 10,

                                        }}>
                                            <Button
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    // maxWidth: 130,
                                                    flex: 1,
                                                    marginRight: 15,
                                                    backgroundColor: '#E41C38',
                                                    height: 40,
                                                    elevation: 0
                                                }}
                                                onPress={() => this.setState({ elevatorFlag: true })}
                                            >

                                                <View
                                                    style={[styles.textCenterView, styles.buttonText]}>
                                                    <Text style={[styles.textWhite, styles.marginTop10]}>
                                                        <FontAwesome5 name='chart-line' size={20} color='white' />
                                                    </Text>
                                                    <Text style={[styles.textWhite, styles.textBold, styles.margin5, { marginTop: 10 }]}>
                                                        {locales('titles.elevateProduct')}
                                                    </Text>
                                                </View>
                                            </Button>
                                            <Button
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    // maxWidth: 130,
                                                    flex: 1,
                                                    backgroundColor: '#000546',
                                                    height: 40,
                                                    elevation: 0
                                                }}
                                                onPress={() => this.setState({ editionFlag: true })}
                                            >
                                                <View
                                                    style={[styles.textCenterView, styles.buttonText]}>
                                                    <Text style={[styles.textWhite, styles.marginTop5]}>
                                                        <EvilIcons name='pencil' size={30} color='white' />
                                                    </Text>
                                                    <Text style={[styles.textWhite, styles.margin5, styles.textBold]}>
                                                        {locales('titles.edit')}
                                                    </Text>
                                                </View>


                                            </Button>
                                        </View>
                                    }
                                    {!!is_elevated && <FontAwesome5
                                        onPress={() => Toast.show({
                                            text: locales('titles.elevatorHasAdded'),
                                            position: "bottom",
                                            style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center', textAlign: 'center' },
                                            textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                            duration: 3000
                                        })}
                                        name='chart-line' size={20} color='white' style={[styles.elevatorIcon]}
                                    />}
                                </View>

                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        paddingHorizontal: deviceWidth * 0.025,
        alignSelf: 'center',
    },
    cardItemStyle: {
        borderRadius: 7,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 0,
        borderWidth: 2,
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
        alignSelf: 'center',
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
    return {
        loggedInUserId: state.authReducer.loggedInUserId,

        deleteProductStatus: state.productsListReducer.deleteProductStatus,
        deleteProductMessage: state.productsListReducer.deleteProductMessage,
        deleteProductLoading: state.productsListReducer.deleteProductLoading,

        editProductStatus: state.productsListReducer.editProductStatus,
        editProductMessage: state.productsListReducer.editProductMessage,
        editProductLoading: state.productsListReducer.editProductLoading
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setProductDetailsId: id => dispatch(productListActions.setProductDetailsId(id)),
        deleteProduct: id => dispatch(productListActions.deleteProduct(id)),
        editProduct: product => dispatch(productListActions.editProduct(product))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Product)