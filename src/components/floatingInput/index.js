import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import TextField from './src/components/field';
import Outline from './src/components/outline';

export { TextField };
export default class OutlinedTextField extends TextField {
    static contentInset = {
        ...TextField.contentInset,

        input: 16,

        top: 0,
        left: 12,
        right: 12,
    };

    static labelOffset = {
        ...TextField.labelOffset,

        y0: 0,
        y1: -10,
    };

    static defaultProps = {
        ...TextField.defaultProps,

        lineWidth: 1,
        disabledLineWidth: StyleSheet.hairlineWidth,
    };

    constructor(props) {
        super(props);

        this.onTextLayout = this.onTextLayout.bind(this);
        this.state.labelWidth = new Animated.Value(0);
    }

    onTextLayout({ nativeEvent: { lines } }) {
        let { fontSize, labelFontSize } = this.props;
        let { labelWidth } = this.state;

        let scale = labelFontSize / fontSize;

        labelWidth.setValue(lines[0].width * scale);
    }

    renderLabel(props) {
        let { onTextLayout } = this;
        let { icon } = this.props
        return super.renderLabel({ ...props, onTextLayout, icon });
    }

    renderLine(props) {
        let { labelWidth } = this.state;

        return (
            <Outline isRtl={this.props.isRtl} {...props} labelWidth={labelWidth} />
        );
    }
}
