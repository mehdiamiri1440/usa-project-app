import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { View, Text, Modal, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';

const ViolationReport = props => {

    const {
        visible,
        onRequestClose
    } = props;


    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={_ => onRequestClose()}
        >
            <Text>
                asdf
        </Text>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViolationReport);