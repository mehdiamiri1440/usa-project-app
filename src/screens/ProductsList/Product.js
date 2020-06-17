import React, { PureComponent } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Input, Label, Item } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Card, CardItem, Body, Toast, Button } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import * as productListActions from '../../redux/productsList/actions'
import ChatModal from '../Messages/ChatModal';
import { formatter, validator, dataGenerator } from '../../utils';
import Spin from '../../components/loading/loading';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


class Product extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
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
            editProductLoading
        } = this.state;

        const selectedContact = {
            first_name,
            contact_id,
            last_name,
        }

        return (
            <SafeAreaView>
                <Spin spinning={deleteProductLoading || editProductLoading}>


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
                                            {!!minimumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumPriceError}</Label>}
                                        </View>
                                        <View style={styles.textInputPadding}>
                                            <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
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
                                                    style={{ fontFamily: 'Vazir-FD', textDecorationLine: 'none' }}
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
                                            style={[!editProductStatus ? styles.deletationSuccessfullText : styles.loginFailedText, { width: '100%', fontFamily: 'Vazir' }]}
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
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#7E7E7E'
                                }}>
                                    {locales('labels.doElevation')}
                                </Paragraph>
                            </View>
                            <Dialog.Content>
                                <Text style={{ width: '100%', textAlign: 'center', fontSize: 24, fontFamily: 'Vazir-Bold-FD', color: '#00C569' }}>
                                    {formatter.numberWithCommas(25000)} {locales('titles.toman')}
                                </Text>
                                <Text style={{ fontFamily: 'Vazir', textAlign: 'center', fontSize: 16, color: '#7E7E7E' }}>
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
                                        return this.props.navigation.navigate('Payment')
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
                                    fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#7E7E7E'
                                }}>
                                    {locales('labels.deleteProduct')}
                                </Paragraph>
                            </View>
                            {!showDeletationMessage ? <>
                                <Dialog.Content>
                                    <Feather
                                        style={{ alignSelf: 'center', width: '100%', padding: 5, textAlign: 'center' }}
                                        name='alert-circle' size={40} color='#FFE484' />
                                    <Paragraph style={{ fontFamily: 'Vazir', textAlign: 'center', fontSize: 16, color: '#7E7E7E' }}>
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
                                            style={[deleteProductStatus ? styles.deletationSuccessfullText : styles.loginFailedText, { width: '100%', fontFamily: 'Vazir' }]}
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
                        {...this.props}
                        contact={{ ...selectedContact }}
                        onRequestClose={() => this.setState({ modalFlag: false })}
                    />}

                    <Card style={{ width: width, alignSelf: 'center' }}>
                        <CardItem style={{ borderColor: '#00C569', borderWidth: active_pakage_type > 1 ? 1.3 : 0 }}>
                            <Body >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Profile', { user_name })}
                                    activeOpacity={1}
                                    style={{
                                        flexDirection: 'row-reverse', marginTop: -9, paddingVertical: 3,
                                        width: '100%', borderBottomWidth: 1, borderBottomColor: '#7E7E7E'
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
                                        style={{ width: '62%', justifyContent: 'flex-start' }}
                                    >
                                        <Text style={{
                                            fontFamily: 'Vazir-Bold-FD',
                                            fontSize: 18, marginTop: response_rate > 0 && loggedInUserId !== myuser_id ? 0 : 8,
                                            paddingHorizontal: 7, paddingBottom: 2
                                        }}>
                                            {`${first_name} ${last_name}`}
                                        </Text>
                                        {response_rate > 0 && loggedInUserId != myuser_id &&
                                            <Text style={{ color: '#BEBEBE', fontSize: 14, fontFamily: 'Vazir-Bold-FD' }}>
                                                {locales('labels.responseRate')} <Text style={{ color: '#E41C38' }}>%{response_rate}</Text>
                                            </Text>}
                                    </View>
                                    {loggedInUserId == myuser_id ?
                                        <Text
                                            onPress={() => this.setState({ deleteProductFlag: true })}
                                            style={{ color: '#E41C38', fontSize: 16, textAlignVertical: 'center' }}>
                                            {locales('labels.deleteProduct')}
                                        </Text>
                                        :
                                        <Text onPress={() => this.props.navigation.navigate('Profile', { user_name })} style={{
                                            width: '30%', textAlign: 'center', color: '#00C569', fontSize: 16, textAlignVertical: 'center'
                                        }}>
                                            {locales('labels.seeProfile')}
                                        </Text>}
                                </TouchableOpacity>
                                {active_pakage_type > 1 && <Image
                                    style={{ position: 'absolute', left: 0, top: 48 }}
                                    source={require('../../../assets/icons/special-label.png')} />}
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        this.props.navigation.navigate(`ProductDetails`, { productId })
                                    }}
                                    style={{ flexDirection: 'row-reverse', width: '100%', paddingVertical: 5 }}>
                                    <Image
                                        style={{
                                            borderRadius: 10,
                                            width: deviceWidth * 0.25,
                                            height: deviceWidth * 0.25,
                                            marginHorizontal: 5
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
                                        <Text style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                            {category_name} | {sub_category_name} <Text style={{ color: '#777777', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                                {product_name}
                                            </Text>
                                        </Text>
                                        <View style={{ flexDirection: 'row-reverse', paddingVertical: 3 }}>
                                            <Text style={{ textAlign: 'right' }}>
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

                                <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center', padding: 5,
                                    width: '100%', justifyContent: 'center'
                                }}>
                                    {loggedInUserId != myuser_id ?
                                        <Button
                                            onPress={() => this.setState({ modalFlag: true })}
                                            style={[styles.loginButton, {
                                                width: !!is_elevated ? '92%' : '88%'
                                            }]}
                                        >
                                            <Text style={[styles.buttonText, { paddingRight: 30 }]}>
                                                {locales('titles.achiveSaleStatus')}</Text>
                                            <FontAwesome name='envelope' size={20} color='white'
                                                style={{ position: 'absolute', right: !is_elevated ? (this.props.width ? 94 : 101) : (this.props.width ? 99 : 108) }} />
                                        </Button>
                                        :
                                        <View style={{
                                            flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10,
                                            width: !this.props.width ? (!!is_elevated ? deviceWidth * 0.88 : deviceWidth) : (!!is_elevated ? deviceWidth * 0.82 : deviceWidth * 0.94)
                                        }}>
                                            <Button
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                    fontFamily: 'Vazir-Bold-FD',
                                                    width: !!is_elevated ? '45%' : '55%',
                                                    paddingRight: 40,
                                                    backgroundColor: '#E41C38'
                                                }}
                                            >
                                                <Text
                                                    onPress={() => this.setState({ elevatorFlag: true })}
                                                    style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>
                                                    {locales('titles.elevateProduct')}</Text>
                                                <FontAwesome5 name='chart-line' size={30} color='white' style={{ position: 'absolute', right: 15 }} />
                                            </Button>
                                            <Button
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
                                                <Text onPress={() => this.setState({ editionFlag: true })} style={[styles.buttonText, { fontFamily: 'Vazir-Bold-FD' }]}>{locales('titles.edit')}</Text>
                                                <EvilIcons name='pencil' size={30} color='white' style={{ position: 'absolute', right: 15 }} />
                                            </Button>
                                        </View>
                                    }
                                    {!!is_elevated && <FontAwesome5
                                        onPress={() => Toast.show({
                                            text: locales('titles.elevatorHasAdded'),
                                            position: "bottom",
                                            style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                            textStyle: { fontFamily: 'Vazir' },
                                            duration: 3000
                                        })}
                                        name='chart-line' size={30} color='white' style={{
                                            backgroundColor: '#7E7E7E',
                                            padding: 7, right: loggedInUserId == myuser_id ? 10 : 0, borderRadius: 4
                                        }}
                                    />}
                                </View>

                            </Body>
                        </CardItem>
                    </Card>
                </Spin>
            </SafeAreaView >
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
        deleteProduct: id => dispatch(productListActions.deleteProduct(id)),
        editProduct: product => dispatch(productListActions.editProduct(product))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Product)