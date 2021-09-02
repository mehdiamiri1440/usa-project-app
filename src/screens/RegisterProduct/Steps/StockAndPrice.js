import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { Button, Input, Label, InputGroup } from 'native-base';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, validator, formatter } from '../../../utils';
import * as locationActions from '../../../redux/locations/actions';

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
            maximumPrice: '',
            minimumPrice: '',
            amountClicked: false,
            minimumOrderClicked: false,
            minPriceClicked: false,
            maxPriceClicked: false,
            isAmountFocused: false,
            minimumPriceText: '',
            maximumPriceText: '',
        }
    }

    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();

    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            const { minimumOrder, maximumPrice, minimumPrice, amount } = this.props;

            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);

            this.amountRef.current.value = amount;
            this.minimumPriceRef.current.value = minimumPrice;
            this.maximumPriceRef.current.value = maximumPrice;
            this.minimumOrderRef.current.value = minimumOrder;
            this.setState({ minimumOrder, maximumPrice, minimumPrice, amount });
            // BackHandler.addEventListener('hardwareBackPress', _ => {
            //     this.props.changeStep(1);
            //     return true;
            // });
            this.props.fetchAllProvinces();
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && (!this.props.provinces || !this.props.provinces.length)) {
            this.setState({ loaded: true });
            this.props.fetchAllProvinces()
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
        // BackHandler.removeEventListener()
    }

    handleHardWareBackButtonPressed = _ => {
        this.props.changeStep(2);
        return true;
    };

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
        this.setState(() => ({
            minPriceError: '',
            minPrice: field,
            minPriceClicked: true
        }));
        if (field) {
            if (validator.isNumber(field))
                this.setState(() => ({
                    minimumPrice: field,
                    minimumPriceError: '',
                    minPriceClicked: true,
                    minimumPriceText: formatter.convertUnitsToPrice(field)
                }));
            if (field <= 0) {
                this.setState(() => ({
                    minimumPriceError: locales('errors.canNotBeZero', { fieldName: locales('titles.minPriceNeeded') }),
                    minPriceClicked: true
                }));
            }
        }
        else
            this.setState(() => ({
                minimumPrice: '',
                minPriceClicked: false,
                minPriceError: '',
            }));
    };

    onMaximumPriceSubmit = field => {
        this.setState(() => ({
            maxPriceError: '',
            maxPrice: field,
            maxPriceClicked: true,
            maximumPriceText: formatter.convertUnitsToPrice(field)
        }));
        if (field) {
            if (validator.isNumber(field))
                this.setState(() => ({
                    maximumPrice: field,
                    maximumPriceError: '',
                    maxPriceClicked: true
                }));
            if (field <= 0) {
                this.setState(() => ({
                    maximumPriceError: locales('errors.canNotBeZero', { fieldName: locales('titles.maxPriceNeeded') }),
                    maxPriceClicked: true
                }));
            }
        }
        else
            this.setState(() => ({
                maximumPrice: '',
                maximumPriceError: '',
                maxPriceClicked: false
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
                    minimumOrderError: locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.minimumOrderWithOutKilo') }),
                    minimumOrderClicked: true
                }));
            }
            if (field <= 0) {
                this.setState(() => ({
                    minimumOrderError: locales('errors.canNotBeZero', { fieldName: locales('titles.minimumOrderWithOutKilo') }),
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
            minimumOrderError = locales('errors.pleaseEnterField', { fieldName: locales('titles.minimumOrderWithOutKilo') })
        }
        else if (minimumOrder && minimumOrder >= 1000000000) {
            minimumOrderError = locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.minimumOrderWithOutKilo') })
        }
        else if (minimumOrder && minimumOrder <= 0) {
            minimumOrderError = locales('errors.canNotBeZero', { fieldName: locales('titles.minimumOrderWithOutKilo') })
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
            this.props.setStockAndPrice(minimumOrder, maximumPrice, minimumPrice, amount);
        }
    }

    handleAutoFocus = _ => {

        const {
            amount,
            amountError,
            minimumOrder,
            minimumOrderError,
            minPrice,
            minPriceError,
            maximumPrice,
            maxPriceError
        } = this.state;

        if (!amount || amountError) {
            this.amountRef.current._root.focus()
            return;
        }

        if (!minimumOrder || minimumOrderError) {
            this.minimumOrderRef.current._root.focus()
            return;
        }

        if (!minPrice || minPriceError) {
            this.minimumPriceRef.current._root.focus()
            return;
        }

        if (!maximumPrice || maxPriceError) {
            this.maximumPriceRef.current._root.focus()
            return;
        }

        return this.onSubmit();

    }

    render() {

        let {
            minimumOrderError,
            maximumPriceError,
            minimumPriceError,
            amountError,
            minimumOrder,
            minimumOrderText,
            amountClicked,
            minimumOrderClicked,
            minPriceClicked,
            maxPriceClicked,
            amount,
            amountText,
            minimumPrice,
            maximumPrice,

            isAmountFocused,
            isMinimumOrderFocused,
            isMinimumPriceFocused,
            isMaximumPriceFocused,
            maximumPriceText,
            minimumPriceText
        } = this.state;

        return (
            <View
                style={[{ backgroundColor: 'white' }, styles.labelInputPadding]}
            >


                {/* <Text
                    style={{
                        marginVertical: 10,
                        color: '#666666',
                        fontSize: 20,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        paddingHorizontal: 10
                    }}
                >
                    {locales('titles.stockAndPrice')}
                </Text> */}

                <View style={styles.textInputPadding}>
                    <Label style={{ color: '#333', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.qunatityAmount')} <Text
                            style={{
                                color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', fontWeight: '200'
                            }}>({locales('labels.kiloGram')})</Text><Text
                                style={{
                                    color: '#D44546',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
                            // borderWidth: 2,
                            borderColor: amount ? amountError ? '#E41C38' : '#00C569' :
                                amountClicked ? '#E41C38' : '#666',
                            paddingHorizontal: 10,
                            backgroundColor: '#FBFBFB'
                        }}
                    >
                        <FontAwesome5 name={
                            amount ? amountError ? 'times-circle' : 'check-circle' : amountClicked
                                ? 'times-circle' : 'edit'}
                            color={amount ? amountError ? '#E41C38' : '#00C569'
                                : amountClicked ? '#E41C38' : '#BDC4CC'}
                            size={16}
                            solid
                            style={{
                                marginLeft: 10
                            }}
                        />
                        <Input
                            onFocus={_ => this.setState({ isAmountFocused: true })}
                            onBlur={_ => this.setState({ isAmountFocused: false })}
                            onSubmitEditing={this.handleAutoFocus}
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                borderRadius: 4,
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
                        <ToolTipComponent
                            isFocused={isAmountFocused}
                            text={amountText}
                        />
                    </InputGroup>
                    <Label style={{
                        height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        textAlign: !amountError && amount.length ? 'left' : 'right'
                    }}>

                        {!!amountError && <Text style={{
                            fontSize: 14, color: '#D81A1A',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}> {amountError}</Text>}
                        {/* {!amountError && amount.length ? <Text style={{
                            fontSize: 14, color: '#1DA1F2',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>
                            {amountText}</Text> : null} */}

                    </Label>


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
                                color: '#D44546',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
                            // borderWidth: 2,
                            borderColor: minimumOrder ? minimumOrderError ? '#E41C38' : '#00C569' :
                                minimumOrderClicked ? '#E41C38' : '#666',
                            paddingHorizontal: 10,
                            backgroundColor: '#FBFBFB'
                        }}
                    >
                        <FontAwesome5 name={
                            minimumOrder ? minimumOrderError ? 'times-circle' : 'check-circle' : minimumOrderClicked
                                ? 'times-circle' : 'edit'}
                            color={minimumOrder ? minimumOrderError ? '#E41C38' : '#00C569'
                                : minimumOrderClicked ? '#E41C38' : '#BDC4CC'}
                            size={16}
                            solid
                            style={{
                                marginLeft: 10
                            }}
                        />
                        <Input
                            onFocus={_ => this.setState({ isMinimumOrderFocused: true })}
                            onBlur={_ => this.setState({ isMinimumOrderFocused: false })}
                            autoCapitalize='none'
                            autoCorrect={false}
                            onSubmitEditing={this.handleAutoFocus}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                borderRadius: 4,
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
                        <ToolTipComponent
                            isFocused={isMinimumOrderFocused}
                            text={minimumOrderText}
                            width={deviceWidth * 0.4}
                        />
                    </InputGroup>
                    <Label style={{
                        height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        textAlign: !minimumOrderError && minimumOrder.length ? 'left' : 'right'
                    }}>

                        {!!minimumOrderError && <Text style={{
                            fontSize: 14, color: '#D81A1A',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}> {minimumOrderError}</Text>}
                        {/* {!minimumOrderError && minimumOrder.length ? <Text style={{
                            fontSize: 14, color: '#1DA1F2',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>
                            {minimumOrderText}</Text> : null} */}

                    </Label>
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
                    <Label style={{ color: '#333', fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                        {locales('titles.minPriceNeeded')} <Text
                            style={{
                                color: '#333', fontSize: 14, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontWeight: '200',
                            }}>({locales('titles.kiloInToman')})</Text><Text
                                style={{
                                    color: '#D44546',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
                            // borderWidth: 2,
                            borderColor: minimumPrice ? minimumPriceError ? '#E41C38' : '#00C569' :
                                minPriceClicked ? '#E41C38' : '#666',
                            paddingHorizontal: 10,
                            backgroundColor: '#FBFBFB'
                        }}
                    >
                        <FontAwesome5 name={
                            minimumPrice ? minimumPriceError ? 'times-circle' : 'check-circle' : minPriceClicked
                                ? 'times-circle' : 'edit'}
                            color={minimumPrice ? minimumPriceError ? '#E41C38' : '#00C569'
                                : minPriceClicked ? '#E41C38' : '#BDC4CC'}
                            size={16}
                            solid
                            style={{
                                marginLeft: 10
                            }}
                        />
                        <Input
                            autoCapitalize='none'
                            onFocus={_ => this.setState({ isMinimumPriceFocused: true })}
                            onBlur={_ => this.setState({ isMinimumPriceFocused: false })}
                            onSubmitEditing={this.handleAutoFocus}
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                borderRadius: 4,
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
                        <ToolTipComponent
                            isFocused={isMinimumPriceFocused}
                            text={minimumPriceText}
                            width={deviceWidth * 0.4}
                        />
                    </InputGroup>
                    <Label style={{
                        fontSize: 14, color: '#D81A1A', height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}>
                        {!!minimumPriceError ? minimumPriceError : null}
                    </Label>
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
                        {locales('titles.maxPriceNeeded')} <Text
                            style={{
                                color: '#333', fontSize: 14, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontWeight: '200',

                            }}>({locales('titles.kiloInToman')})</Text><Text
                                style={{
                                    color: '#D44546',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
                            // borderWidth: 2,
                            borderColor: maximumPrice ? maximumPriceError ? '#E41C38' : '#00C569' :
                                maxPriceClicked ? '#E41C38' : '#666',
                            paddingHorizontal: 10,
                            backgroundColor: '#FBFBFB'
                        }}
                    >
                        <FontAwesome5 name={
                            maximumPrice ? maximumPriceError ? 'times-circle' : 'check-circle' : maxPriceClicked
                                ? 'times-circle' : 'edit'}
                            color={maximumPrice ? maximumPriceError ? '#E41C38' : '#00C569'
                                : maxPriceClicked ? '#E41C38' : '#BDC4CC'}
                            size={16}
                            solid
                            style={{
                                marginLeft: 10
                            }}
                        />
                        <Input
                            onFocus={_ => this.setState({ isMaximumPriceFocused: true })}
                            onBlur={_ => this.setState({ isMaximumPriceFocused: false })}
                            onSubmitEditing={this.handleAutoFocus}
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                borderRadius: 4,
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
                        <ToolTipComponent
                            isFocused={isMaximumPriceFocused}
                            text={maximumPriceText}
                            width={deviceWidth * 0.4}
                        />
                    </InputGroup>
                    <Label style={{
                        fontSize: 14, color: '#D81A1A', height: 25,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}>
                        {!!maximumPriceError ? maximumPriceError : null}
                    </Label>
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
                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 30, width: deviceWidth, justifyContent: 'space-between', width: '100%' }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!minimumOrder.length || !amount.length || !maximumPrice || !minimumPrice
                            ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <FontAwesome5 name='arrow-left' style={{ marginRight: 10 }} size={14} color='white' />
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>
                    <Button
                        onPress={() => this.props.changeStep(2)}
                        style={styles.backButtonContainer}
                        rounded
                    >
                        <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                        <FontAwesome5 name='arrow-right' size={14} style={{ marginLeft: 10 }} color='#7E7E7E' />
                    </Button>
                </View>

            </View>
        );
    }
}

const ToolTipComponent = ({
    text = '',
    isFocused = false,
    width
}) => {
    if (text && text.length && isFocused)
        return (
            <View
                style={{
                    backgroundColor: '#578ffe',
                    borderRadius: 8,
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    width: width ?? deviceWidth * 0.5,
                    position: 'absolute',
                    top: -50
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: "IRANSansWeb(FaNum)_Bold",
                        color: '#fff',
                        width: '100%',
                        fontSize: 13,
                        letterSpacing: 1,
                        textAlign: 'center',
                    }}>
                    {text}
                </Text>
                <View
                    style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: 7,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderRightWidth: 7,
                        borderTopWidth: 7,
                        borderTopColor: '#578ffe',
                        left: '50%',
                        bottom: -6,
                        position: 'absolute'
                    }}
                >
                </View>
            </View>
        )
    return null;
};

const styles = StyleSheet.create({
    textInputPadding: {
        paddingHorizontal: 10,
        paddingTop: 5
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: '37%',

        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '37%',

        color: 'white',
        elevation: 0,
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: '37%',

        elevation: 0,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    labelInputPadding: {
        // paddingVertical: 5,
        paddingHorizontal: 10
    }
})

const mapStateToProps = state => {
    return {
        loading: state.locationsReducer.fetchAllProvincesLoading,
        error: state.locationsReducer.fetchAllProvincesError,
        failed: state.locationsReducer.fetchAllProvincesFailed,
        message: state.locationsReducer.fetchAllProvincesMessage,
        provinces: state.locationsReducer.provinces,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchAllProvinces: _ => dispatch(locationActions.fetchAllProvinces(undefined, true)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StockAndPrice)


