import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base'
import { deviceHeight, deviceWidth } from '../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
class Login extends React.Component {
    render() {
        return (
            <>
                <LinearGradient
                    colors={['#21AD93', '#12B87F', '#21AD93']}
                >
                    <View style={styles.linearGradient}>
                        <Text
                            style={styles.headerTextStyle}
                        >
                            {locales('titles.enterToBuskool')}
                        </Text>
                    </View >
                </LinearGradient>
                <Text style={styles.userText}>
                    {locales('messages.signedUpUser')}
                </Text>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.phoneNumber')}
                        keyboardType='phone-pad'
                    />
                </View>
                <View style={styles.textInputPadding}>
                    <OutlinedTextField
                        labelTextStyle={{ paddingTop: 5 }}
                        label={locales('titles.password')}
                        keyboardType='phone-pad'
                    />
                </View>
                <TouchableOpacity style={styles.forgotContainer}>
                    <EvilIcons
                        name="refresh"
                        style={{
                            fontSize: 30,
                            alignSelf: "center",
                            color: '#7E7E7E',
                        }}
                    />
                    <Text style={styles.forgotPassword}>{locales('messages.forgotPassword')}</Text>
                </TouchableOpacity>
                <Button style={styles.loginButton} rounded disabled>
                    <Text style={{ color: 'white' }}>{locales('titles.login')}</Text>
                </Button>
                <Text style={styles.forgotPassword}>
                    {locales('messages.startToSignUp')}
                </Text>
                <Button style={styles.loginButton} success rounded>
                    <Text style={{ color: 'white' }}>{locales('titles.signUpInBuskool')}</Text>
                </Button>
            </>
        )
    }
}
const styles = StyleSheet.create({
    loginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
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
        height: deviceHeight * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 20
    },
    textInputPadding: {
        padding: 20
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
export default Login