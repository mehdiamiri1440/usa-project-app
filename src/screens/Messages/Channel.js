import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from "react-redux";

const Channel = _ => {
    return (
        <ScrollView
        >
            <Text>
                chjannle
        </Text>
        </ScrollView>
    )
}

const mapStateToProps = (state) => {
    return {
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);