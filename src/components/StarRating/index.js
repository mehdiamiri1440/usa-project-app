import React from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
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
                    state.names.push('star-half-o')
                }
                else if (index == hoveredIndex && !this.state.half) {
                    state.names.push('star-o')
                }
                else {
                    state.names.push('star-o')
                }
            }
            return '';
        })
    };



    render() {
        let {
            starsCount = 5,
            size = 25,
            disable = true
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
                        <FontAwesome
                            name={names[index]}
                            style={{ transform: names[index] == 'star-half-o' ? [{ scaleX: -1 }] : [{ rotate: '0deg' }] }}
                            key={index}
                            color={index < this.state.hoveredIndex ? color : '#BEBEBE'}
                            size={size}
                            onProgress={() => !disable && this.handleStarClick(index)}
                        />

                    ))
                }
            </View>
        )
    }
}
export default StarRating