import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

class ProductDetails extends Component {
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
