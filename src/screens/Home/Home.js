import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
class Home extends React.Component {
    render() {
        console.warn('hello', process.env.NODE_ENV)
        return (
            <TouchableOpacity
                style={[styles.bgBlue, styles.colorr]}
                onPress={() => this.props.navigation.navigate('Tour')}
            >
                <Text
                >
                    {locales('alert.hello')}
                </Text>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    bgBlue: {
        justifyContent: 'flex-start', alignItems: 'flex-start',
        backgroundColor: 'red'
    },
    colorr: { color: 'yellow' }
})
export default Home