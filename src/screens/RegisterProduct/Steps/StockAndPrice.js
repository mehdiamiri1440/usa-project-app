import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, Label, Item } from 'native-base';
import OutlinedTextField from '../../../components/floatingInput';
import { deviceWidth, validator, formatter } from '../../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


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
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none'
                            }}
                            onChangeText={this.onAmountSubmit}
                            value={amount}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.amountWithExample')}
                            ref={this.amountRef}

                        />
                    </Item>
                    {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}

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
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none'
                            }}
                            onChangeText={this.onMinimumOrderSubmit}
                            value={minimumOrder}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.minimumOrderWithExample')}
                            ref={this.minimumOrderRef}

                        />
                    </Item>
                    {!!minimumOrderError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{minimumOrderError}</Label>}
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
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none'
                            }}
                            onChangeText={this.onMinimumPriceSubmit}
                            value={minimumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.minimumPriceWithExample')}
                            ref={this.minimumPriceRef}

                        />
                    </Item>
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
                    <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
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
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                height: 45,
                                flexDirection: 'row',
                                textDecorationLine: 'none'

                            }}
                            onChangeText={this.onMaximumPriceSubmit}
                            value={maximumPrice}
                            placeholderTextColor="#BEBEBE"
                            placeholder={locales('titles.maximumPriceWithExample')}
                            ref={this.maximumPriceRef}

                        />
                    </Item>
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


