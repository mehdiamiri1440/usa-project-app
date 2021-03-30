import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { validator } from '../../utils';

class StarRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            half: false,
            names: [],
            color: '#FFBB00',
            iconName: 'star-o',
            hoveredIndex: props.starsCount * 2.0 || 10.0,
            clicked: false,
            loaded: false
        }
    }


    componentDidMount() {

        if (!!this.props.defaultRate) {

            let { defaultRate, starsCount } = this.props;
            let isDefaultRateInteger = validator.isInt(defaultRate);

            this.setState({
                hoveredIndex: isDefaultRateInteger ? defaultRate : defaultRate - 0.5,
                half: !isDefaultRateInteger
            }, () => {
                this.renderStars();
            });
        }

    }



    renderStars = _ => {
        let { hoveredIndex } = this.state;
        hoveredIndex = Math.round(hoveredIndex);
        this.setState(state => {
            for (let index = 0; index < 5; index++) {
                if (index < hoveredIndex) {
                    state.names.push('star')
                }
                else if (index == hoveredIndex && this.state.half) {
                    state.names.push('star-half-alt')
                }
                else if (index == hoveredIndex && !this.state.half) {
                    state.names.push('star')
                }
                else {
                    state.names.push('star')
                }
            }
            return '';
        })
    };



    render() {
        let {
            starsCount = 5,
            size = 25,
            disable = true,
            showNumbers = false
        } = this.props;

        let { iconName, color = '#FFBB00', names } = this.state;
        let stars = []

        for (let i = 0; i < starsCount; i++) {
            stars.push(i);
        };

        return (
            <View style={{ flexDirection: 'row-reverse' }}>
                {
                    stars.map((_, index) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            key={index}
                            style={{ marginHorizontal: 1 }}
                        >
                            <FontAwesome5
                                name={names[index]}
                                style={{ transform: names[index] == 'star-half-alt' ? [{ scaleX: -1 }] : [{ rotate: '0deg' }] }}
                                key={index}
                                color={index <= this.state.hoveredIndex ? color : '#BEBEBE'}
                                size={size}
                                solid
                                style={{
                                    transform: [{ rotateY: '180deg' }]
                                }}
                                onProgress={() => !disable && this.handleStarClick(index)}
                            />
                            {showNumbers ? <Text
                                style={{
                                    position: 'absolute',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 11,
                                    color: '#777777',
                                    left: 11,
                                    top: 7
                                }}
                            >
                                {index + 1}
                            </Text> : null}
                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }
}
export default StarRating