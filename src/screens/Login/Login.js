import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
class Login extends React.Component {
    render() {
        return (
            <TouchableOpacity
                style={[styles.backgroundColor]}
                onPress={() => this.props.navigation.navigate('Tour')}
            >
                <Text
                >
                    آخرین درخواست های خرید

                    {locales('alert.hello')}
                </Text>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    backgroundColor: {
        backgroundColor: '#21AD93'
    }
})
export default Login