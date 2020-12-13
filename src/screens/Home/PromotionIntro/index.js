import React from 'react';
import { Text, View, BackHandler, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

class PromotionIntro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [
                {
                    name: 'محمدامین دلداری',
                    city: 'فارس - شیراز',
                    text: 'لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی ',
                    picture: ''
                },

                {
                    name: 'علی دلخوش',
                    city: 'فارس - شیراز',
                    text: 'لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی ',
                    picture: ''
                },

                {
                    name: 'علی قاسمی',
                    city: 'فارس - شیراز',
                    text: 'لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی ',
                    picture: ''
                },

                {
                    name: 'مهدی امیری',
                    city: 'فارس - شیراز',
                    text: 'لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی لورم ایپسوم متن ساختگی در زمینه طراحی صفحات وب ومحتوای اینترنتی ',
                    picture: ''
                },

            ]
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener()
    }

    renderComment = (item) => {


        return (
            <View style={{
                width: deviceWidth,
                paddingHorizontal: 15
            }}>
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',

                }}>
                    <View style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row-reverse'
                    }}>
                        <View style={{
                            width: 60,
                            height: 60,
                            borderRadius: 60,
                            overflow: 'hidden',
                            elevation: 13,
                            marginLeft: 10,
                            marginRight: 20
                        }}>
                            <Image style={{
                                width: '100%',
                                height: '100%'
                            }} source={require('../../../../assets/images/verifi-user-image.jpg')} />
                        </View>
                        <Text
                            style={{
                                paddingTop: 13,
                                fontSize: 14,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: '#556080',
                            }}
                        >{item.name}</Text>

                    </View>
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#BEBEBE',
                            paddingTop: 13
                        }}
                    >{item.city}</Text>
                </View>


                <View style={{
                    backgroundColor: '#efefef',
                    borderRadius: 5,
                    paddingTop: 25,
                    paddingHorizontal: 20,
                    paddingBottom: 15,
                    marginTop: -16
                }}>
                    <Text style={{
                        color: '#7E7E7E'
                    }}>
                        {item.text}
                    </Text>
                </View>

            </View>
        )
    }

    render() {


        const { posts } = this.state;


        return (
            <>

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('labels.myBuskool')}
                        </Text>
                    </View>
                </View>




                <ScrollView style={{
                    flex: 1,
                    backgroundColor: '#fff',

                }}>

                    <View style={{
                        width: 425,
                        height: 425,
                        right: '27%',
                        top: '-17%',
                        zIndex: -1,
                        position: 'absolute'
                    }}>
                        <Image style={{
                            width: '100%',
                            height: '100%',
                            opacity: 0.2,

                        }} source={require('../../../../assets/images/earth.png')} />

                    </View>


                    <Text style={{
                        color: "#21AD93",
                        fontSize: 22,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        textAlign: 'center',
                        padding: 15
                    }}>
                        یه متن خوب برای متقاعد کردن کاربر که حدود دو خط میشه
                    </Text>


                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',

                        }}>
                            <FontAwesome5 name="boxes" size={45} color="#556080" solid />
                            <Text style={{
                                color: "#21AD93",
                                fontSize: 22,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginTop: 5
                            }}>
                                +20,000
                            </Text>
                            <Text style={{
                                color: "#666666",
                                fontSize: 15,
                                marginTop: -5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}>
                                خریدار
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',

                        }}>
                            <FontAwesome5 name="user-tie" size={45} color="#556080" solid />
                            <Text style={{
                                color: "#21AD93",
                                fontSize: 22,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginTop: 5
                            }}>
                                +50,000
                            </Text>
                            <Text style={{
                                color: "#666666",
                                fontSize: 15,
                                marginTop: -5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}>
                                خریدار
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',

                        }}>
                            <FontAwesome5 name="list-alt" size={45} color="#556080" solid />
                            <Text style={{
                                color: "#21AD93",
                                fontSize: 22,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginTop: 5
                            }}>
                                +13,000
                            </Text>
                            <Text style={{
                                color: "#666666",
                                fontSize: 15,
                                marginTop: -5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}>
                                خریدار
                            </Text>
                        </View>

                    </View>


                    <View style={{
                        flexDirection: 'row-reverse',
                        marginTop: 40,
                    }}>
                        <View style={{
                            padding: 10,
                            opacity: 0.7,
                            marginRight: 30,
                            zIndex: 1
                        }}>
                            <FontAwesome5 name="award" size={85} color="#FFBB00" />
                        </View>

                        <View style={{

                            padding: 10,
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                            {[1, 2, 3, 4, 5].map((_, index) => <View style={{
                                flexDirection: 'row',
                            }}>
                                <Text style={{
                                    marginHorizontal: 10,
                                    color: '#7E7E7E',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}>
                                    آیتم شماره {index + 1} و با تمام شرایط
                                </Text>
                                <FontAwesome5 name="check" solid size={18} color="#00C569" />
                            </View>)}
                        </View>

                    </View>


                    <View style={{
                        width: '100%',
                        height: 200,
                        marginTop: -100,
                        zIndex: 0,
                    }}>
                        <Image style={{
                            width: '100%',
                            height: '100%',


                        }} source={require('../../../../assets/images/charts.png')} />

                    </View>
                    <View style={{
                        alignItems: 'center',
                        marginTop: -65
                    }}>
                        <LinearGradient
                            style={{
                                maxWidth: 250,
                                width: '100%',
                                marginVertical: 15,
                                borderRadius: 8,
                                elevation: 3,

                            }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            colors={['#00C569', '#21AD93']}
                        >
                            <TouchableOpacity style={{
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-around'
                            }}>
                                <FontAwesome5 style={{ paddingTop: 3 }} size={25} name='arrow-left' color="#fff" />
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 19,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}>
                                    افزایش میزان فروش
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>





                    <FlatList
                        horizontal
                        style={{
                            marginVertical: 20
                        }}
                        data={posts}
                        renderItem={({ item }) => this.renderComment(item)}
                        keyExtractor={item => item.id}
                    />




                    <View>
                        <Text style={{
                            color: '#556080',
                            fontSize: 17,
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}>
                            یه عنوان خوب برای تماس با ما
                        </Text>

                        <View style={{
                            paddingHorizontal: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <LinearGradient
                                style={{
                                    flex: 1,
                                    marginVertical: 15,
                                    borderRadius: 8,
                                    elevation: 3,

                                }}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#556080', '#556080']}
                            >

                                <TouchableOpacity style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }}>

                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 14,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    }}>
                                        پیام به پشتیبانی
                                    </Text>
                                    <FontAwesome5 style={{ paddingTop: 3, marginHorizontal: 5 }} size={15} name='comment-alt' solid color="#fff" />

                                </TouchableOpacity>
                            </LinearGradient>
                            <LinearGradient
                                style={{
                                    flex: 1,
                                    marginVertical: 15,
                                    borderRadius: 8,
                                    elevation: 3,
                                    marginLeft: 15,

                                }}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#00C569', '#21AD93']}
                            >

                                <TouchableOpacity style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>

                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 14,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    }}>
                                        تماس با ما
                                    </Text>
                                    <FontAwesome5 style={{ marginHorizontal: 5 }} size={20} name='phone-square' color="#fff" />

                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>





                </ScrollView>


            </>
        )
    }
}
export default PromotionIntro