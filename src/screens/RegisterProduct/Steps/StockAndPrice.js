import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, Label, Item } from 'native-base';
import { deviceWidth, validator, formatter } from '../../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { BtnSmall } from '../../../components/buttons'
import myStyles from '../../../styles'
import units from '../../../styles/fonts/units'


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
            amount: '',
            loaded: false,
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
        else if (amount && amount <= 0) {
            amountError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        if (!minimumOrder) {
            minimumOrderError = locales('errors.fieldNeeded', { fieldName: locales('titles.minimumOrderNeeded') })
        }
        else if (minimumOrder && minimumOrder <= 0) {
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

        this.setState({ minimumOrderError, maximumPriceError, minimumPriceError, amountError })
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
            minimumOrder,
            amount,
            minimumPrice,
            maximumPrice
        } = this.state;

        return (
            <View

            >


                <Text
                    style={[
                        myStyles.mTop10,
                        myStyles.ph10,
                        myStyles.textGray1,
                        myStyles.h2,
                    ]}
                >
                    {locales('titles.stockAndPrice')}
                </Text>

                <View style={[myStyles.ph10, myStyles.pTop10]}>
                    <Label style={[myStyles.textGray, myStyles.textBold, myStyles.p5, myStyles.mBottom5]}>
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
                            style={[
                                myStyles.p,
                                myStyles.rtl,
                                myStyles.textRight,
                                {
                                    height: units.n37,
                                }
                            ]}
                            onChangeText={this.onAmountSubmit}
                            value={amount}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.amountWithExample')}
                            ref={this.amountRef}

                        />
                    </Item>
                    {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}

                </View>
                <View style={[myStyles.ph10, myStyles.pTop10]}>
                    <Label style={[myStyles.textGray, myStyles.textBold, myStyles.p5, myStyles.mBottom5]}>
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
                            style={[
                                myStyles.p,
                                myStyles.rtl,
                                myStyles.textRight,
                                {
                                    height: units.n37,
                                }
                            ]}
                            onChangeText={this.onMinimumOrderSubmit}
                            value={minimumOrder}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.minimumOrderWithExample')}
                            ref={this.minimumOrderRef}

                        />
                    </Item>
                    {!!minimumOrderError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label>}
                </View>
                <View style={myStyles.p10}>
                    <Label style={[myStyles.textGray, myStyles.textBold, myStyles.p5]}>
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
                            style={[
                                myStyles.p,
                                myStyles.rtl,
                                myStyles.textRight,
                                {
                                    height: units.n37,
                                }
                            ]}
                            onChangeText={this.onMinimumPriceSubmit}
                            value={minimumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.minimumPriceWithExample')}
                            ref={this.minimumPriceRef}

                        />
                    </Item>
                    {!!minimumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumPriceError}</Label>}
                </View>
                <View style={myStyles.p10}>
                    <Label style={[myStyles.textGray, myStyles.textBold, myStyles.p5]}>
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
                            style={[
                                myStyles.p,
                                myStyles.rtl,
                                myStyles.textRight,
                                {
                                    height: units.n37,
                                }
                            ]}
                            onChangeText={this.onMaximumPriceSubmit}
                            value={maximumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.maximumPriceWithExample')}
                            ref={this.maximumPriceRef}

                        />
                    </Item>
                    {!!maximumPriceError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{maximumPriceError}</Label>}

                </View>
                <View style={
                    [
                        myStyles.mv20,
                        myStyles.ph10,
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%'
                        }
                    ]}>
                    <BtnSmall
                        leftIcon='arrow-left'
                        onPressOut={() => this.onSubmit()}
                        disabled={
                            !minimumOrder.length ||
                            !amount.length ||
                            !maximumPrice ||
                            !minimumPrice
                        }
                        style={
                            {
                                ...myStyles.contentLeft,
                                ...myStyles.ph30
                            }
                        }
                        text={locales('titles.nextStep')}
                    />
                    <BtnSmall
                        rightIcon='arrow-right'
                        onPressOut={() => this.props.changeStep(1)}
                        style={
                            {
                                ...myStyles.contentRight,
                                ...myStyles.ph30,
                                ...myStyles.bgPrimary
                            }
                        }
                        textStyle={
                            {
                                ...myStyles.textGray1,
                            }}
                        iconStyle={{
                            ...myStyles.textGray1,

                        }}
                        text={locales('titles.previousStep')}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
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


