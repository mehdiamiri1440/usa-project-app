import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

const Comments = props => {
    return (
        <View>
            <Text>Comments</Text>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);