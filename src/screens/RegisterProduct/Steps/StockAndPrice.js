import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, Label, Item } from 'native-base';
import OutlinedTextField from '../../../components/floatingInput';
import { deviceWidth, validator } from '../../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


class StockAndPrice extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (validator.isNumber(field))
            this.setState(() => ({
                amount: field,
            }));
        else
            this.setState(() => ({
                amount: ''
            }));
    };

    onMinimumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumPrice: field,
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
            }));
        else
            this.setState(() => ({
                minimumOrder: ''
            }));
    };

    onSubmit = () => {

        let { minimumOrder, maximumPrice, minimumPrice, amount } = this.state;
        this.props.setStockAndPrice(minimumOrder, maximumPrice, minimumPrice, amount);
    }

    render() {

        let {
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
                style={{ backgroundColor: 'white' }}
            >


                <Text
                    style={{
                        marginVertical: 10,
                        color: '#666666',
                        fontSize: 20,
                        fontFamily: 'Vazir-Bold-FD',
                        paddingHorizontal: 10
                    }}
                >
                    {locales('titles.stockAndPrice')}
                </Text>

                <View style={styles.textInputPadding}>
                    <Item fixedLabel>
                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                            {locales('titles.amount')}
                        </Label>
                    </Item>
                    <Item error='' regular style={{
                        borderColor: amount.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{ fontFamily: 'Vazir', flexDirection: 'row', textDecorationLine: 'none' }}
                            onChangeText={this.onAmountSubmit}
                            value={amount}
                            placeholder={locales('titles.amountWithExample')}
                            ref={this.amountRef}

                        />
                    </Item>
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
                    <Item fixedLabel>
                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                            {locales('titles.minimumOrder')}
                        </Label>
                    </Item>
                    <Item error='' regular style={{
                        borderColor: minimumOrder.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{ fontFamily: 'Vazir', textDecorationLine: 'none' }}
                            onChangeText={this.onMinimumOrderSubmit}
                            value={minimumOrder}
                            placeholder={locales('titles.minimumOrderWithExample')}
                            ref={this.minimumOrderRef}

                        />
                    </Item>
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
                    <Item fixedLabel>
                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                            {locales('titles.minimumPrice')}
                        </Label>
                    </Item>
                    <Item error='' regular style={{
                        borderColor: minimumPrice.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='number-pad'
                            autoCompleteType='off'
                            style={{ fontFamily: 'Vazir', textDecorationLine: 'none' }}
                            onChangeText={this.onMinimumPriceSubmit}
                            value={minimumPrice}
                            placeholder={locales('titles.minimumPriceWithExample')}
                            ref={this.minimumPriceRef}

                        />
                    </Item>
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
                    <Item fixedLabel>
                        <Label style={{ color: 'black', fontFamily: 'Vazir-Bold-FD', padding: 5 }}>
                            {locales('titles.maximumPrice')}
                        </Label>
                    </Item>
                    <Item error='' regular style={{
                        borderColor: maximumPrice.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                    }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            style={{ fontFamily: 'Vazir', textDecorationLine: 'none' }}
                            onChangeText={this.onMaximumPriceSubmit}
                            value={maximumPrice}
                            placeholder={locales('titles.maximumPriceWithExample')}
                            ref={this.maximumPriceRef}

                        />
                    </Item>
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
                <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!minimumOrder.length || !amount.length || !maximumPrice || !minimumPrice
                            ? styles.disableLoginButton : styles.loginButton}
                        rounded
                        disabled={!amount.length || !maximumPrice.length || !minimumPrice || !minimumOrder}
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
        textAlign: 'center'
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
})

export default StockAndPrice;


