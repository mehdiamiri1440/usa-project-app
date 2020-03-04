import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {

        return (
            <View>
                <Text>change passwordS</Text>
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
        dispatch1: () => {
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)