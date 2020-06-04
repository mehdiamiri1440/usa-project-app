import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Spin = props => {
    const { spinning = false, children = null, size = 'large', color = 'green' } = props;
    if (!spinning) return children;

    return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <ActivityIndicator animating size={size} color={color} />
        </View>
    );
}
export default Spin;