import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { Button, Input, Label, InputGroup } from 'native-base';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { deviceWidth, validator, formatter } from '../../../utils';

class StockAndPrice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minimumOrderError: '',
            maximumPriceError: '',
            minimumPriceError: '',
            amountError: '',
            isAmountFocused: false,
            isMinimumOrderFocused: false,
            isMinimumPriceFocused: false,
            isMaximumPriceFocused: false,
            minimumOrder: '',
            minimumOrderText: '',
            amount: '',
            amountText: '',
            loaded: false,
            submitButtonClick: false,
            maximumPrice: '',
            minimumPrice: ''
        }
    }

    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();


    componentDidMount() {
        const { minimumOrder, maximumPrice, minimumPrice, amount } = this.props;
        this.amountRef.current.value = amount;
        this.minimumPriceRef.current.value = minimumPrice;
        this.maximumPriceRef.current.value = maximumPrice;
        this.minimumOrderRef.current.value = minimumOrder;
        this.setState({ minimumOrder, maximumPrice, minimumPrice, amount, loaded: true });

        BackHandler.addEventListener('hardwareBackPress', _ => {
            this.props.changeStep(1)
            return true;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener()
    }

    onAmountSubmit = field => {
        this.setState(() => ({
            amountError: '',
            amount: field,
            submitButtonClick: false

        }));

        if (field) {
            if (!validator.isNumber(field)) {
                this.setState(() => ({
                    amountError: "لطفا  فقط عدد وارد کنید"
                }));
            }
            if (!this.amountError) {
                this.setState(() => ({
                    amountText: formatter.convertUnitsToText(field)
                }));
            }
        } else {
            this.setState(() => ({
                amount: '',
                amountText: ''
            }));
        }


    };

    onMinimumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumPrice: field,
                minimumPriceError: '',
                submitButtonClick: false
            }));
        else
            this.setState(() => ({
                minimumPrice: '',
                submitButtonClick: false
            }));
    };

    onMaximumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                maximumPrice: field,
                maximumPriceError: '',
                submitButtonClick: false
            }));
        else
            this.setState(() => ({
                maximumPrice: '',
                submitButtonClick: false
            }));
    };

    onMinimumOrderSubmit = field => {

        this.setState(() => ({
            minimumOrderError: '',
            minimumOrder: field,
            submitButtonClick: false
        }));

        if (field) {
            if (!validator.isNumber(field)) {
                this.setState(() => ({
                    minimumOrderError: "لطفا  فقط عدد وارد کنید"
                }));
            }
            if (!this.minimumOrderError) {
                this.setState(() => ({
                    minimumOrderText: formatter.convertUnitsToText(field)
                }));
            }
        } else {
            this.setState(() => ({
                minimumOrder: '',
                minimumOrderText: ''
            }));
        }

    };


    onSubmit = () => {

        let { minimumOrder, maximumPrice, minimumPrice, amount } = this.state;

        let minimumOrderError = '', maximumPriceError = '', minimumPriceError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.fieldNeeded', { fieldName: locales('titles.amountNeeded') })
        }
        else if (amount && (amount <= 0 || amount >= 1000000000)) {
            amountError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        if (!minimumOrder) {
            minimumOrderError = locales('errors.fieldNeeded', { fieldName: locales('titles.minimumOrderNeeded') })
        }
        else if (minimumOrder && (minimumOrder <= 0 || minimumOrder >= 1000000000)) {
            minimumOrderError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.minimumOrderNeeded') })
        }
        else {
            minimumOrderError = '';
        }


        if (!maximumPrice) {
            maximumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else if (maximumPrice && maximumPrice <= 0) {
            maximumPriceError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else {
            maximumPriceError = '';
        }



        if (!minimumPrice) {
            minimumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.minPriceNeeded') })
        }
        else if (minimumPrice && minimumPrice <= 0) {
            minimumPriceError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.minPriceNeeded') })
        }
        else {
            minimumPriceError = '';
        }

        this.setState({ submitButtonClick: true, minimumOrderError, maximumPriceError, minimumPriceError, amountError })
        if (!minimumOrderError && !minimumPriceError && !maximumPriceError && !amountError) {
            this.props.setStockAndPrice(minimumOrder, maximumPrice, minimumPrice, amount);
        }
    }

    render() {

        let {
            minimumOrderError,
            maximumPriceError,
            minimumPriceError,
            amountError,
            isMinimumOrderFocused,
            isMaximumPriceFocused,
            isAmountFocused,
            isMinimumPriceFocused,
            submitButtonClick,
            minimumOrder,
            minimumOrderText,
            amount,
            amountText,
            minimumPrice,
            maximumPrice
        } = this.state;

        return (
            <View
                style={[{ backgroundColor: 'white' }, styles.labelInputPadding]}
            >


                <Text
                    style={{
                        marginVertical: 10,
                        color: '#666666',
                        fontSize: 20,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        paddingHorizontal: 10
                    }}
                >
                    {locales('titles.stockAndPrice')}
                </Text>

                <View style={styles.textInputPadding}>
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.amount')} <Text
                            style={{
                                color: '#D44546'
                            }}
                        >*</Text>
                    </Label>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            marginBottom: 5
                        }}
                    >
                        {locales('titles.amountWithExample')}
                    </Text>

                    <InputGroup
                        regular
                        style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: amount ? amountError ? '#f08c9a' : '#7ee0b2' :
                                submitButtonClick ? '#f08c9a' : '#000000'
                        }}
                    >
                        <FontAwesome5 name={
                            amount ? amountError ? 'times-circle' : 'check-circle' : submitButtonClick
                                ? 'times-circle' : 'edit'}
                            style={{ paddingHorizontal: 4 }}
                            color={amount ? amountError ? '#f08c9a' : '#7ee0b2'
                                : submitButtonClick ? '#f08c9a' : '#000000'}
                        />
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none',
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                            onChangeText={this.onAmountSubmit}
                            value={amount}
                            placeholder={locales('titles.enterAmount')}
                            placeholderTextColor="#BEBEBE"
                            ref={this.amountRef}

                        />
                    </InputGroup>
                    {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}
                    {!amountError && amount.length ? <Label style={{ fontSize: 14, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>{amountText}</Label> : null}

                    {/* <OutlinedTextField
                        placeholder={(this.state.isAmountFocused || amount.length) ? locales('titles.amountWithExample') : ''}
                        type='number'
                        baseColor={amount.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onAmountSubmit}
                        ref={this.amountRef}
                        keyboardType='phone-pad'
                        isRtl={true}
                        onFocus={() => this.setState({ isAmountFocused: true })}
                        onBlur={() => this.setState({ isAmountFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isAmountFocused || amount.length
                            ? locales('titles.amount') :
                            locales('titles.amountWithExample')}
                    /> */}
                </View>
                <View style={styles.textInputPadding}>
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.minimumOrder')} <Text
                            style={{
                                color: '#D44546'
                            }}
                        >*</Text>
                    </Label>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            marginBottom: 5
                        }}
                    >
                        {locales('titles.minimumOrderWithExample')}
                    </Text>
                    <InputGroup
                        regular
                        style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: minimumOrder ? minimumOrderError ? '#f08c9a' : '#7ee0b2' :
                                submitButtonClick ? '#f08c9a' : '#000000'
                        }}
                    >
                        <FontAwesome5 name={
                            minimumOrder ? minimumOrderError ? 'times-circle' : 'check-circle' : submitButtonClick
                                ? 'times-circle' : 'edit'}
                            style={{ paddingHorizontal: 4 }}
                            color={minimumOrder ? minimumOrderError ? '#f08c9a' : '#7ee0b2'
                                : submitButtonClick ? '#f08c9a' : '#000000'}
                        />
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none',
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                            onChangeText={this.onMinimumOrderSubmit}
                            value={minimumOrder}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.enterMinOrder')}
                            ref={this.minimumOrderRef}

                        />
                    </InputGroup>
                    {!!minimumOrderError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label>}
                    {!minimumOrderError && minimumOrder.length ? <Label style={{ fontSize: 14, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>{minimumOrderText}</Label> : null}

                    {/* <OutlinedTextField
                        baseColor={minimumOrder.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onMinimumOrderSubmit}
                        keyboardType='phone-pad'
                        placeholder={(this.state.isMinimumOrderFocused || minimumOrder.length) ? locales('titles.minimumOrderWithExample') : ''}
                        ref={this.minimumOrderRef}
                        isRtl={true}
                        onFocus={() => this.setState({ isMinimumOrderFocused: true })}
                        onBlur={() => this.setState({ isMinimumOrderFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isMinimumOrderFocused || minimumOrder.length
                            ? locales('titles.minimumOrder') :
                            locales('titles.minimumOrderWithExample')}
                    /> */}
                </View>
                <View style={styles.textInputPadding}>
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.minimumPrice')} <Text
                            style={{
                                color: '#D44546'
                            }}
                        >*</Text>
                    </Label>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            marginBottom: 5
                        }}
                    >
                        {locales('titles.minimumPriceWithExample')}
                    </Text>
                    <InputGroup
                        regular
                        style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: minimumPrice ? minimumPriceError ? '#f08c9a' : '#7ee0b2' :
                                submitButtonClick ? '#f08c9a' : '#000000'
                        }}
                    >
                        <FontAwesome5 name={
                            minimumPrice ? minimumPriceError ? 'times-circle' : 'check-circle' : submitButtonClick
                                ? 'times-circle' : 'edit'}
                            style={{ paddingHorizontal: 4 }}
                            color={minimumPrice ? minimumPriceError ? '#f08c9a' : '#7ee0b2'
                                : submitButtonClick ? '#f08c9a' : '#000000'}
                        />
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none',
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                            onChangeText={this.onMinimumPriceSubmit}
                            value={minimumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.enterMinPrice')}
                            ref={this.minimumPriceRef}

                        />
                    </InputGroup>
                    {!!minimumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumPriceError}</Label>}
                    {/* <OutlinedTextField
                        baseColor={minimumPrice.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onMinimumPriceSubmit}
                        ref={this.minimumPriceRef}
                        placeholder={(this.state.isMinimumPriceFocused || minimumPrice.length) ? locales('titles.minimumPriceWithExample') : ''}
                        isRtl={true}
                        keyboardType='phone-pad'
                        onFocus={() => this.setState({ isMinimumPriceFocused: true })}
                        onBlur={() => this.setState({ isMinimumPriceFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isMinimumPriceFocused || minimumPrice.length
                            ? locales('titles.minimumPrice') :
                            locales('titles.minimumPriceWithExample')}
                    /> */}
                </View>
                <View style={styles.textInputPadding}>
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.maximumPrice')} <Text
                            style={{
                                color: '#D44546'
                            }}
                        >*</Text>
                    </Label>
                    <Text
                        style={{
                            color: '#777777',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            marginBottom: 5
                        }}
                    >
                        {locales('titles.maximumPriceWithExample')}
                    </Text>
                    <InputGroup
                        regular
                        style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: maximumPrice ? maximumPriceError ? '#f08c9a' : '#7ee0b2' :
                                submitButtonClick ? '#f08c9a' : '#000000'
                        }}
                    >
                        <FontAwesome5 name={
                            maximumPrice ? maximumPriceError ? 'times-circle' : 'check-circle' : submitButtonClick
                                ? 'times-circle' : 'edit'}
                            style={{ paddingHorizontal: 4 }}
                            color={maximumPrice ? maximumPriceError ? '#f08c9a' : '#7ee0b2'
                                : submitButtonClick ? '#f08c9a' : '#000000'}
                        />
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none',
                                direction: 'rtl',
                                textAlign: 'right'

                            }}
                            onChangeText={this.onMaximumPriceSubmit}
                            value={maximumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.enterMaxPrice')}
                            ref={this.maximumPriceRef}

                        />
                    </InputGroup>
                    {!!maximumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{maximumPriceError}</Label>}
                    {/* <OutlinedTextField
                        baseColor={maximumPrice.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onMaximumPriceSubmit}
                        ref={this.maximumPriceRef}
                        keyboardType='phone-pad'
                        isRtl={true}
                        onFocus={() => this.setState({ isMaximumPriceFocused: true })}
                        onBlur={() => this.setState({ isMaximumPriceFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isMaximumPriceFocused || maximumPrice.length
                            ? locales('titles.maximumPrice') :
                            locales('titles.maximumPriceWithExample')}
                    /> */}
                </View>
                <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between', width: '100%' }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!minimumOrder.length || !amount.length || !maximumPrice || !minimumPrice
                            ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <AntDesign name='arrowleft' size={25} color='white' />
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>
                    <Button
                        onPress={() => this.props.changeStep(1)}
                        style={styles.backButtonContainer}
                        rounded
                    >
                        <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                        <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                    </Button>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInputPadding: {
        padding: 10,
    },
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    }
})

export default StockAndPrice;


