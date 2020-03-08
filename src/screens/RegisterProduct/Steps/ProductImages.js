// import react-native element
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import { ActionSheet } from 'native-base';
import {
    TouchableOpacity,
    Image, Dimensions, Text
} from "react-native";
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

class ProductImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
    }
    chooseProductImage = () => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex)
    )

    onActionSheetClicked = (index) => {
        switch (index) {
            case 0:
                ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: true,
                    mediaType: 'photo'
                }).then(image => {
                    this.setState(state => state.images.push(image.path))
                });
                break;
            case 1:
                ImagePicker.openPicker({
                    width: 300,
                    height: 400,
                    cropping: true,
                    mediaType: 'photo',
                }).then(image => {
                    this.setState(state => state.images.push(image.path))
                });
                break;
            default:
                break;
        }

    }
    render() {

        let { images } = this.state;
        console.warn('image--->>', images)
        return (
            <ScrollView>
                {images.length ? images.map((image, index) => <Image
                    resizeMode="cover"
                    key={index}
                    style={{ width: 50, height: 50 }} source={{ uri: image }} />) : null}

                <TouchableOpacity
                    onPress={this.chooseProductImage}
                    style={{
                        backgroundColor: 'green',
                        width: 100,
                        height: 100,
                        zIndex: 999999,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <Text>افزودن عکس</Text>

                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default ProductImages;