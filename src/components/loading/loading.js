import React from 'react';
import { StyleSheet, View } from 'react-native'
import { Spinner } from 'native-base'
import { deviceHeight } from '../../utils';
import { deviceWidth } from '../../utils/deviceDimenssions';
const Spin = ({ spinning, children }) => {
    return <>
        <View
            style={spinning ? { ...styles.loadingContainer } : null} >
            {children}
            {
                spinning && <Spinner
                    style={styles.loadingSpinner}
                    color='red' />
            }
        </View>
    </>
}
const styles = StyleSheet.create({
    loadingContainer: {
        textAlign: "center",
        opacity: 0.4,
        height: "100%"
    },
    loadingProgress: {
        position: "absolute",
        top: "50%",
        left: "50%",
    },
    loadingSpinner: {
        top: deviceHeight * 0.5,
        left: deviceWidth * 0.5,
        right: deviceWidth * 0.5,
        position: "absolute",
    }
})
export default Spin