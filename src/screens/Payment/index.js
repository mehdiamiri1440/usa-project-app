import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

class Payment extends Component {
    render() {
        return (
            <View>
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}
                > textInComponent </Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment)