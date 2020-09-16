

// import React from 'react';
// import { Text, View, StyleSheet } from 'react-native';
// import { Button, Item, Input } from 'native-base';
// import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
// import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';


// class Referral extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         }
//     }

//     render() {
//         return (
//             <>
//                 <View style={{
//                     backgroundColor: '#fff',
//                     elevation: 3,
//                     borderRadius: 4,
//                     paddingTop: 5,
//                     overflow: 'hidden',
//                     paddingBottom: 20,
//                     marginBottom: 10
//                 }}>
//                     <View style={{
//                         alignItems: 'center',
//                         borderBottomColor: '#eee',
//                         borderBottomWidth: 2
//                     }}>
//                         <Text style={{
//                             fontSize: 22,
//                             fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                             color: '#333',
//                         }}>
//                             {locales('titles.referralTitle')}
//                         </Text>
//                         <View style={{
//                             flexDirection: 'row-reverse'
//                         }}>
//                             <Text style={{
//                                 fontSize: 22,
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                                 color: '#00C569',
//                             }}>
//                                 25,000
//                             </Text>
//                             <Text style={{
//                                 fontSize: 17,
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                                 color: '#777',
//                                 marginHorizontal: 3,
//                                 marginTop: 4
//                             }}>
//                                 تومان
//                             </Text>
//                         </View>
//                         <View style={{

//                             backgroundColor: '#E41C38',
//                             paddingBottom: 4,
//                             transform: [{ rotate: '-45deg' }],
//                             marginHorizontal: 6,
//                             textAlign: 'center',
//                             textAlignVertical: 'center',
//                             width: 150,
//                             position: 'absolute',
//                             left: -55,
//                             top: 10,
//                             elevation: 2,
//                             alignItems: 'center'
//                         }}>
//                             <Text style={{
//                                 fontSize: 14,
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                                 color: 'white',

//                             }}>
//                                 {locales('titles.referralGift')}
//                             </Text>
//                         </View>
//                     </View>


//                     <View style={{

//                         paddingHorizontal: 10,
//                         paddingTop: 10
//                     }}>
//                         <Text style={{
//                             fontSize: 14,
//                             fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                             color: '#556080'
//                         }}>
//                             <Text style={{
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                             }}>
//                                 {locales('titles.referralMainTitle')}

//                             </Text>
//                             <Text style={{
//                                 color: '#00C569',
//                                 marginHorizontal: 5,
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',

//                             }}>
//                                 {locales('titles.referralSecondMainTitle')}
//                             </Text>
//                             <Text style={{
//                                 fontFamily: 'IRANSansWeb(FaNum)_Bold',
//                             }}>
//                                 {locales('titles.referralThirdMainTitle')}
//                             </Text>
//                         </Text>


//                         <Text style={{
//                             color: "#777"
//                         }}>
//                             {locales('titles.referralMainContents')}

//                         </Text>


//                         <Button
//                             style={[styles.loginButton, { width: '70%', marginTop: 10, marginBottom: 0, alignSelf: 'center' }]}
//                         >
//                             <Text style={[styles.buttonText, { alignSelf: 'center' }]}>

//                                 {locales('titles.referralButton')}

//                             </Text>
//                         </Button>
//                     </View>

//                     <View style={{

//                         padding: 10
//                     }}>
//                         <Text style={{
//                             color: '#556080',
//                             marginHorizontal: 5,
//                             fontFamily: 'IRANSansWeb(FaNum)_Bold',

//                         }}>
//                             {locales('titles.referralShareLink')}

//                         </Text>

//                         <View>
//                             <Item style={{
//                                 borderBottomWidth: 0,
//                                 marginTop: 10
//                             }}>
//                                 <Input disabled style={{ fontSize: 14, height: 35, color: '#777', padding: 5, margin: 0, backgroundColor: '#eee', borderWidth: 0, borderRadius: 4, textAlign: 'left' }} placeholder="https://buskool.com/profile/del" />
//                                 <Button style={{
//                                     backgroundColor: '#556080',
//                                     paddingHorizontal: 20,
//                                     height: 35,
//                                     elevation: 0
//                                 }}>
//                                     <Text style={{
//                                         color: '#fff',
//                                         fontFamily: 'IRANSansWeb(FaNum)_Bold',

//                                     }}>
//                                         کپی
//                                     </Text>
//                                 </Button>
//                             </Item>
//                         </View>
//                     </View>
//                     <View style={{
//                         paddingHorizontal: 10
//                     }}>
//                         <Text style={{
//                             color: '#556080',
//                             marginHorizontal: 5,
//                             fontFamily: 'IRANSansWeb(FaNum)_Bold',

//                         }}>
//                             {locales('titles.referralShareButton')}

//                         </Text>

//                         <View style={{
//                             flexDirection: 'row-reverse',
//                             paddingTop: 5
//                         }}>
//                             <Button style={styles.iconWrapper}>
//                                 <FontAwesome5 name="whatsapp" color="#777" size={15} />
//                                 <Text style={styles.iconContents}>
//                                     واتساپ
//                                 </Text>
//                             </Button>
//                             <Button style={[styles.iconWrapper, { marginLeft: 3 }]}>

//                                 <FontAwesome5 name="instagram" color="#777" size={15} />
//                                 <Text style={styles.iconContents}>
//                                     اینستاگرام
//                                 </Text>
//                             </Button>
//                             <Button style={[styles.iconWrapper, { marginLeft: 3 }]}>

//                                 <FontAwesome5 name="telegram-plane" color="#777" size={15} />
//                                 <Text style={styles.iconContents}>
//                                     تلگرام
//                                 </Text>
//                             </Button>
//                             <Button style={[styles.iconWrapper, { marginLeft: 3 }]}>

//                                 <FontAwesome5 name="comment-alt" color="#777" size={15} />
//                                 <Text style={styles.iconContents}>
//                                     پیامک
//                                 </Text>
//                             </Button>
//                         </View>
//                     </View>
//                 </View>
//             </>
//         )
//     }

// }





// const styles = StyleSheet.create({

//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontFamily: 'IRANSansWeb(FaNum)_Bold',
//         width: '100%',
//         textAlign: 'center'
//     },
//     disableLoginButton: {
//         textAlign: 'center',
//         margin: 10,
//         width: deviceWidth * 0.8,
//         color: 'white',
//         alignItems: 'center',
//         alignSelf: 'center',
//         justifyContent: 'center'
//     },
//     loginButton: {
//         textAlign: 'center',
//         margin: 10,
//         borderRadius: 4,
//         backgroundColor: '#00C569',
//         width: '92%',
//         color: 'white',
//     },
//     iconWrapper: {
//         flex: 1,
//         flexDirection: 'row-reverse',
//         borderRadius: 5,
//         borderColor: '#777',
//         borderWidth: 1,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff'
//     },
//     iconContents: {
//         color: '#777',
//         marginRight: 3,
//         fontSize: 13
//     }
// });




// export default Referral



import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import NoConnection from '../../../components/noConnectionError';
import { deviceWidth, deviceHeight } from '../../../utils';
import * as homeActions from '../../../redux/home/actions';
import ENUMS from '../../../enums';

const Refferral = props => {



    return (
        <>
            <Text>
                Referral
            </Text>
        </>

    )
}


styles = StyleSheet.create({
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
})


export default Refferral