import React from 'react';
import { Text, View, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import GetMobileNumberStep from './Steps/GetMobileNumberStep';
import EnterActivisionCode from './Steps/EnterActivisionCode';
import UserBasicInfo from './Steps/userBasicInfo';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight } from '../../utils/index'
class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mobileNumber: '09367751890',
            stepNumber: 3
        }
    }

    changeStep = stepNumber => {
        this.setState({ stepNumber })
    }
    setMobileNumber = mobileNumber => {
        this.setState({ mobileNumber }, () => this.changeStep(2))
    }
    renderSteps = () => {
        let { stepNumber } = this.state
        switch (stepNumber) {
            case 1: {
                return <GetMobileNumberStep {...this.props} setMobileNumber={this.setMobileNumber} />
            }
            case 2: {
                return <EnterActivisionCode
                    changeStep={this.changeStep}
                    mobileNumber={this.state.mobileNumber} {...this.props}
                />
            }
            case 3: {
                return <UserBasicInfo {...this.props} setMobileNumber={this.setMobileNumber} />
            }
            default:
                break;
        }

    }
    render() {
        return (
            <ScrollView>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
                    colors={['#21AD93', '#12B87F', '#21AD93']}
                >
                    <View style={styles.linearGradient}>
                        <Text
                            style={styles.headerTextStyle}
                        >
                            {locales('titles.signUpInBuskool')}
                        </Text>
                    </View >
                </LinearGradient>
                {this.renderSteps()}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
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
})
export default SignUp