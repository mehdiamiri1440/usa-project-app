import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { validator } from '../../utils';

class StarRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            half: false,
            names: [
            ],
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
                hoveredIndex: isDefaultRateInteger ? defaultRate : Math.round(defaultRate) < defaultRate ? defaultRate : defaultRate - 0.5,
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
                    state.names.push({ title: 'star', color: '#FFBB00' })
                }
                else if (index == hoveredIndex && this.state.half) {
                    state.names.push({ title: 'star-half-alt', color: '#FFBB00' })
                }
                else if (index == hoveredIndex && !this.state.half) {
                    state.names.push({ title: 'star', color: '#BEBEBE' })
                }
                else {
                    state.names.push({ title: 'star', color: '#BEBEBE' })
                }
            }
            return [{
                title: '',
                color: ''
            }];
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
                                name={names[index]?.title}
                                style={{ transform: names[index]?.title == 'star-half-alt' ? [{ scaleX: -1 }] : [{ rotate: '0deg' }] }}
                                key={index}
                                size={size}
                                solid
                                style={{
                                    transform: [{ rotateY: '180deg' }],
                                    color: index < this.state.hoveredIndex || names[index]?.title == 'star-half-alt' ? color : '#BEBEBE'
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