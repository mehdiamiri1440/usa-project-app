import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

const Spin = props => {
    const { spinning = false, children = null, size = 'large', color = 'green' } = props;
    // if (!spinning) return children;

    return (
        <>
            {spinning && <View style={{
                position: 'absolute', flex: 1, backgroundColor: 'white',
                opacity: 0.4, zIndex: 999, width: deviceWidth, alignSelf: 'center', height: deviceHeight,
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 10
            }}>
                <ActivityIndicator animating size={size} color={color} />
            </View>}
            {children}
        </>
    );
}
export default Spin;