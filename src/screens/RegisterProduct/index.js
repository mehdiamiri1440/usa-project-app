import React from 'react';
import { Text, View, StyleSheet, BackHandler, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import * as authActions from '../../redux/auth/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

let stepsArray = [1, 2, 3, 4, 5, 6]
class RegisterProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            successfullAlert: false,
            stepNumber: 1,
            x: 1
        }
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.stepNumber > 1) {
                this.setState({ stepNumber: this.state.stepNumber - 1 })
                return true;
            }
        })
    }


    componentWillUnmount() {
        this.setState({ successfullAlert: false })
        BackHandler.removeEventListener();
    }

    changeStep = stepNumber => {
        this.setState({ stepNumber })
    };


    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => console.warn('hello mehdi ')}
                    >
                        <AntDesign name='arrowright' size={25} color='red' />
                    </TouchableOpacity>
                    <View style={{ width: deviceWidth * 0.6, alignItems: 'flex-end' }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.registerProduct')}
                        </Text>
                    </View>
                </View>
                <Text> Mehdi amiri</Text>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    stepsContainer: {
        marginVertical: 30
    },
    loginFailedContainer: {
        backgroundColor: '#D4EDDA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#155724'
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
})

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProduct)