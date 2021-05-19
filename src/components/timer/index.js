import React, { Component } from "react";
import { Text, View, StyleSheet } from 'react-native';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min: this.props.min,
            sec: this.props.sec
        };
    }

    componentDidMount() {
        this.renderTimer()
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    renderTimer = () => {
        this.myInterval = setInterval(() => {
            const { sec, min } = this.state;

            if (sec > 0) {
                this.setState(({ sec }) => ({
                    sec: sec - 1
                }));
            }
            if (sec === 0) {
                if (min === 0) {
                    clearInterval(this.myInterval);
                } else {
                    this.setState(({ min }) => ({
                        min: min - 1,
                        sec: 59
                    }));
                }
            }
        }, 1000);
    }

    restartTimer = () => {
        return this.setState({ min: this.props.min, sec: this.props.sec }, () => this.renderTimer())
    };

    render() {
        const { min, sec } = this.state;
        let { substitutionText, timerStyle, isCountDownTimer, substitutionTextStyle, containerStyle, onSubstitution } = this.props;
        return (
            <View style={containerStyle}>
                {isCountDownTimer && (min !== 0 || sec !== 0) && <Text
                    style={styles.forgotPassword}>
                    {locales('messages.codeExpirationTime')}
                </Text>
                }
                {min === 0 && sec === 0 ? (
                    <Text
                        onPress={() => {
                            onSubstitution();
                            this.restartTimer();
                        }}
                        style={{
                            ...substitutionTextStyle,
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                        }}>{substitutionText}</Text>
                ) : (
                    <Text style={{
                        ...timerStyle,
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}>
                        {min}:{sec < 10 ? `0${sec}` : sec}
                    </Text>
                )
                }
            </View>
        );
    }
}
export default Timer;


const styles = StyleSheet.create({
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 18,
        padding: 10,
        fontFamily: 'IRANSansWeb(FaNum)_Light'
    }
})