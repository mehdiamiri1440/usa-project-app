import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, I18nManager } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base'
import { deviceHeight, deviceWidth } from '../../utils/index'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import OutlinedTextField from '../../components/floatingInput';
class Login extends React.Component {
    render() {
        return (
            <>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
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
                    {/* <OutlinedTextField
                        labelTextStyle={{ paddingTop: 5 }}
                        label={
                            <>
                                <AntDesign
                                    name="mobile1"
                                    style={{
                                        fontSize: 15,
                                        alignSelf: "center",
                                        color: '#7E7E7E',
                                    }}
                                />
                                <Text>{locales('titles.password')}</Text>
                            </>
                        }
                        keyboardType='phone-pad'
                    /> */}
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
        padding: 20,
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
export default Login