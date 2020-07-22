import React, { PureComponent } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Linking, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Input, Label, Item } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Card, CardItem, Body, Toast, Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import * as productListActions from '../../redux/productsList/actions'
import ValidatedUserIcon from '../../components/validatedUserIcon';
import ChatModal from '../Messages/ChatModal';
import { formatter, validator, dataGenerator } from '../../utils';
import Spin from '../../components/loading/loading';

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
            modalFlag: false,
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


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && Object.entries(this.props.productItem).length) {
            const {
                max_sale_price,
                min_sale_price,
                stock,
                min_sale_amount
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


    pay = () => {
        return Linking.canOpenURL('https://www.buskool.com/app/payment/3/1').then(supported => {
            if (supported) {
                Linking.openURL('https://www.buskool.com/app/payment/3/1');
            }
        })
    };


    elevatorPay = () => {
        return Linking.canOpenURL(`http://192.168.1.46:3030/app/payment/elevator/${this.props.productItem.main.id}`).then(supported => {
            if (supported) {
                Linking.openURL(`http://192.168.1.46:3030/app/payment/elevator/${this.props.productItem.main.id}`);
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
            updated_at
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
            modalFlag,
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
                                {locales('labels.edition', { fieldName: `${category_name} | ${sub_category_name}` })}
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
                                        {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}
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
                                        {!!minimumOrderError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label>}
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
                                        {!!minimumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumPriceError}</Label>}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.maximumPrice')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: maximumPriceError ? '#D50000' : maximumPrice.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
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
                                        {!!maximumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{maximumPriceError}</Label>}
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
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.submitChanges')}
                                        </Text>
                                        <ActivityIndicator
                                            animating={!!editProductLoading}
                                            size="small" color="white"
                                            style={{
                                                position: 'absolute', left: '3%', top: '24%',
                                                width: 30, height: 30, borderRadius: 15
                                            }}
                                        />
                                    </Button>
                                </Dialog.Actions>
                            </>
                            :
                            <Dialog.Content style={{ padding: 50 }}>
                                <View style={[{ justifyContent: 'center', alignItems: 'center' },
                                !editProductStatus ? styles.deletationSuccessfullContainer : styles.loginFailedContainer]}>
                                    {editProductStatus ? <FontAwesome name='times-circle-o' size={40} color='#E41C39' /> : <MaterialCommunityIcons
                                        name='checkbox-marked-circle-outline' color='white' size={40}
                                    />}
                                    <Paragraph
                                        style={[!editProductStatus ? styles.deletationSuccessfullText : styles.loginFailedText, { width: '100%', fontFamily: 'IRANSansWeb(FaNum)_Light' }]}
                                    >
                                        {editionMessageText}
                                    </Paragraph>
                                </View>
                            </Dialog.Content>
                        }
                    </Dialog>
                </Portal>
                    : null}




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
                            <Text
                                style={{ width: '100%', textAlign: 'center', fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569' }}
                            >
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
                                    return this.elevatorPay()
                                })}>
                                <Text style={[styles.buttonText, { alignSelf: 'center' }]}>{locales('titles.pay')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>



                <Portal>
                    <Dialog
                        visible={deleteProductFlag}
                        onDismiss={() => this.setState({ deleteProductFlag: false })}>
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
                                {locales('labels.deleteProduct')}
                            </Paragraph>
                        </View>
                        {!showDeletationMessage ? <>
                            <Dialog.Content>
                                <Feather
                                    style={{ alignSelf: 'center', width: '100%', padding: 5, textAlign: 'center' }}
                                    name='alert-circle' size={40} color='#FFE484' />
                                <Paragraph style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center', fontSize: 16, color: '#7E7E7E' }}>
                                    {locales('titles.doYouWishToDeleteProduct')} ؟ </Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions style={{
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'space-between'
                            }}>
                                <Button
                                    style={[styles.loginButton, { width: '40%' }]}
                                    onPress={() => this.setState({ deleteProductFlag: false })}>
                                    <Text style={styles.buttonText}>{locales('titles.cancel')}
                                    </Text>
                                </Button>
                                <Button
                                    style={[styles.loginButton, { backgroundColor: '#E41C39', width: '40%' }]}
                                    onPress={() => this.deleteProduct(productId)}>
                                    <Text style={styles.buttonText}>
                                        {locales('titles.deleteIt')}
                                    </Text>
                                </Button>
                            </Dialog.Actions>
                        </> :
                            <Dialog.Content style={{ padding: 50 }}>
                                <View style={[{ justifyContent: 'center', alignItems: 'center' },
                                deleteProductStatus ? styles.deletationSuccessfullContainer : styles.loginFailedContainer]}>
                                    {!deleteProductStatus ? <FontAwesome name='times-circle-o' size={40} color='#E41C39' /> : <MaterialCommunityIcons
                                        name='checkbox-marked-circle-outline' color='white' size={40}
                                    />}
                                    <Paragraph
                                        style={[deleteProductStatus ? styles.deletationSuccessfullText : styles.loginFailedText, { width: '100%', fontFamily: 'IRANSansWeb(FaNum)_Light' }]}
                                    >
                                        {deleteMessageText}
                                    </Paragraph>
                                </View>
                            </Dialog.Content>
                        }
                    </Dialog>
                </Portal>


                {modalFlag && <ChatModal
                    transparent={false}
                    visible={modalFlag}
                    profile_photo={profile_photo}
                    {...this.props}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}

                <Card transparent style={styles.cardWrapper}>
                    <CardItem style={[{ borderColor: '#00C569', borderWidth: active_pakage_type > 1 ? 2 : 0 }, styles.cardItemStyle]}>
                        <Body >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('Profile', { user_name })
                                }}
                                activeOpacity={1}
                                style={{
                                    flexDirection: 'row-reverse', marginTop: -9, paddingVertical: 3,
                                    width: '100%', borderBottomWidth: 2, borderBottomColor: '#eee'
                                }}>
                                <Image
                                    style={{
                                        alignSelf: 'center', width: deviceWidth * 0.12,
                                        height: deviceWidth * 0.12, borderRadius: deviceWidth * 0.06,
                                        marginHorizontal: 5
                                    }}
                                    source={!!profile_photo && profile_photo.length ?
                                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                        :
                                        require('../../../assets/icons/user.png')
                                    } />
                                <View
                                    style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row-reverse' }}
                                >
                                    <View>
                                        <View style={{ flexDirection: 'row-reverse' }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    marginHorizontal: 5,
                                                    fontSize: 18,
                                                    marginTop: response_rate > 0 && loggedInUserId !== myuser_id ? 0 : 8,
                                                    paddingBottom: 2
                                                }}>
                                                {`${first_name} ${last_name}`}
                                            </Text>
                                            {is_verified ? <ValidatedUserIcon /> : null}
                                        </View>
                                        {response_rate > 0 && loggedInUserId != myuser_id &&
                                            <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                                {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                                            </Text>}
                                    </View>

                                </View>
                                {loggedInUserId == myuser_id ?
                                    <Text
                                        onPress={() => this.setState({ deleteProductFlag: true })}
                                        style={{ color: '#E41C38', fontSize: 16, textAlignVertical: 'center' }}>
                                        {locales('labels.deleteProduct')}
                                    </Text>
                                    :
                                    <Text onPress={() => this.props.navigation.navigate('Profile', { user_name })} style={{
                                        textAlign: 'center', color: '#00C569', fontSize: 16, textAlignVertical: 'center'
                                    }}>
                                        {locales('labels.seeProfile')}
                                    </Text>}
                            </TouchableOpacity>
                            {active_pakage_type > 1 && <Image
                                style={{ position: 'absolute', left: 0, top: 48, zIndex: 1 }}
                                source={require('../../../assets/icons/special-label.png')} />}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    // this.props.navigation.setParams({ productId, key: productId })
                                    // routes.push(productId);
                                    global.productIds.push(productId);
                                    this.props.navigation.navigate({ name: 'ProductDetails', params: { productId }, key: productId, index: productId })
                                }}
                                style={{ flexDirection: 'row-reverse', width: '100%', paddingTop: 10 }}>

                                <Image
                                    style={{
                                        borderRadius: 10,
                                        width: deviceWidth * 0.25,
                                        height: deviceWidth * 0.25,
                                        marginHorizontal: 0,
                                        backgroundColor: "#f0f3f6",
                                        marginLeft: 10
                                        // paddingLeft: 10
                                    }}
                                    source={photos.length ?
                                        { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${photos[0].file_path}` }
                                        :
                                        require('../../../assets/icons/user.png')
                                    } />

                                {photos.length > 0 && <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        backgroundColor: 'black', position: 'absolute',
                                        left: 5, bottom: 5, borderRadius: 4, padding: 3
                                    }}>
                                    <Entypo name='images' size={20} color='white' />
                                    <Text style={{ color: 'white', marginHorizontal: 2 }}>{photos.length <= 9 ? photos.length : '9+'}</Text>
                                </View>}

                                <View style={{ width: '60%', justifyContent: 'space-between' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18 }}>
                                        {category_name} | {sub_category_name} <Text
                                            style={{ color: '#777777', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 18 }}>
                                            {product_name}
                                        </Text>
                                    </Text>
                                    <View style={{ flexDirection: 'row-reverse', paddingVertical: 3 }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ textAlign: 'right' }}>
                                            <Entypo name='location-pin' size={25} color='#BEBEBE' />
                                        </Text>
                                        <Text style={{ color: '#BEBEBE', fontSize: 16 }}>
                                            {province_name} ، {city_name}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row-reverse', paddingVertical: 3 }}>
                                        <Text style={{ textAlign: 'right' }}>
                                            <FontAwesome5 name='box-open' size={20} color='#BEBEBE' />
                                        </Text>
                                        <Text style={{ color: '#BEBEBE', fontSize: 16 }}>
                                            {formatter.numberWithCommas(stock)} {locales('labels.kiloGram')}
                                        </Text>
                                    </View>

                                </View>

                            </TouchableOpacity>

                            <View style={styles.actionsWrapper}>
                                {loggedInUserId != myuser_id ?
                                    <Button
                                        onPress={() => this.setState({ modalFlag: true })}
                                        style={[styles.loginButton, { flex: 1 }]}
                                    >
                                        <View style={[styles.textCenterView, styles.buttonText]}>
                                            <Text style={[styles.textWhite, styles.margin5, { marginTop: 7 }]}>
                                                <FontAwesome name='envelope' size={23} />
                                            </Text>
                                            <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize20]}>
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
                                        marginTop: 10,

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
                                                backgroundColor: '#E41C38'
                                            }}
                                            onPress={() => this.setState({ elevatorFlag: true })}
                                        >

                                            <View
                                                style={[styles.textCenterView, styles.buttonText]}>
                                                <Text style={[styles.textWhite, , styles.marginTop10]}>
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
                                                backgroundColor: '#000546'
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
                                    name='chart-line' size={23} color='white' style={[styles.elevatorIcon]}
                                />}
                            </View>

                        </Body>
                    </CardItem>
                </Card>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: 'transparent',
        borderWidth: 10
    },
    cardItemStyle: {
        shadowOffset: { width: 20, height: 20 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 6,
        borderRadius: 5,
        width: '100%',
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
        flex: 1,
        justifyContent: 'center',

    },
    elevatorIcon: {
        backgroundColor: '#7E7E7E',
        padding: 10,
        borderRadius: 4,
        height: 45,
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
    textSize20: {
        fontSize: 20
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