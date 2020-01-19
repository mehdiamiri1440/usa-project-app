import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
class Home extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Tour')}
            >
                <Text>
                    {locales('alert.hello')}
                </Text>
            </TouchableOpacity>
        )
    }
}
export default Home