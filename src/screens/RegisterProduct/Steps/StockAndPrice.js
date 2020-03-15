import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
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
            maximumPrice: '',
            minimumPrice: ''
        }
    }

    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();



    onAmountSubmit = () => {
        let { current: field } = this.amountRef;
        setTimeout(() => {
            if (validator.isNumber(field.value()))
                this.setState(() => ({
                    amount: field.value(),
                }));
            else
                this.setState(() => ({
                    amount: ''
                }));
        }, 10);
    };

    onMinimumPriceSubmit = () => {
        let { current: field } = this.minimumPriceRef;
        setTimeout(() => {
            if (validator.isNumber(field.value()))
                this.setState(() => ({
                    minimumPrice: field.value(),
                }));
            else
                this.setState(() => ({
                    minimumPrice: ''
                }));
        }, 10);
    };

    onMaximumPriceSubmit = () => {
        let { current: field } = this.maximumPriceRef;
        setTimeout(() => {
            if (validator.isNumber(field.value()))
                this.setState(() => ({
                    maximumPrice: field.value(),
                }));
            else
                this.setState(() => ({
                    maximumPrice: ''
                }));
        }, 10);
    };

    onMinimumOrderSubmit = () => {
        let { current: field } = this.minimumOrderRef;
        setTimeout(() => {
            if (validator.isNumber(field.value()))
                this.setState(() => ({
                    minimumOrder: field.value(),
                }));
            else
                this.setState(() => ({
                    minimumOrder: ''
                }));
        }, 10);
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
                    <OutlinedTextField
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
                    />
                </View>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={minimumOrder.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onMinimumOrderSubmit}
                        keyboardType='phone-pad'
                        ref={this.minimumOrderRef}
                        isRtl={true}
                        onFocus={() => this.setState({ isMinimumOrderFocused: true })}
                        onBlur={() => this.setState({ isMinimumOrderFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isMinimumOrderFocused || minimumOrder.length
                            ? locales('titles.minimumOrder') :
                            locales('titles.minimumOrderWithExample')}
                    />
                </View>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        baseColor={minimumPrice.length ? '#00C569' : '#a8a8a8'}
                        onChangeText={this.onMinimumPriceSubmit}
                        ref={this.minimumPriceRef}
                        isRtl={true}
                        keyboardType='phone-pad'
                        onFocus={() => this.setState({ isMinimumPriceFocused: true })}
                        onBlur={() => this.setState({ isMinimumPriceFocused: false })}
                        labelTextStyle={{ paddingTop: 5 }}
                        label={isMinimumPriceFocused || minimumPrice.length
                            ? locales('titles.minimumPrice') :
                            locales('titles.minimumPriceWithExample')}
                    />
                </View>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
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
                    />
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
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
})

export default StockAndPrice;


