import React, {
    useEffect,
    useRef
} from 'react';
import {
    Text,
    View,
    Pressable
} from 'react-native';
import { Button } from 'native-base';
import RBSheet from "react-native-raw-bottom-sheet";
import BgLinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

const ContactsListModal = props => {

    const {
        visible,
        onRequestClose = _ => { },
        onReject = _ => { },
        navigation = {},
        sharingUrlPostFix = '',
        image = ''
    } = props;

    const {
        navigate = _ => { }
    } = navigation;

    const refRBSheet = useRef();

    useEffect(() => {
        if (visible)
            refRBSheet.current.open();
        else
            refRBSheet.current.close();
    }, [visible]);

    const navigateToUserContacts = _ => {
        onRequestClose();
        navigate('MyBuskool', {
            screen: 'UserContacts', params: {
                sharingUrlPostFix,
                image
            }
        });
    };

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown
            closeOnPressMask
            height={200}
            onClose={props.onRequestClose}
            animationType='fade'
            customStyles={{
                draggableIcon: {
                    backgroundColor: "#E0E0E0"
                },
                container: {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    backgroundColor: '#FAFAFA',
                }
            }}
        >

            <View
                style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: 15,
                    width: '80%'
                }}>
                <BgLinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
                    colors={['#00C569', '#00C569']}
                    style={{
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: 60,
                        alignSelf: 'center',
                        marginTop: 10,
                        position: 'absolute',
                        zIndex: 1
                    }}
                >
                    <Button
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={navigateToUserContacts}
                    >

                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome5
                                name='users'
                                color='white'
                                size={20}
                                style={{

                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    flexDirection: 'row',
                                    color: 'white',
                                    marginRight: 5
                                }}>
                                {locales('titles.chooseFromContacts')}
                            </Text>
                        </View>
                    </Button>
                </BgLinearGradient>
                <View style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: '#0D9355',
                    height: 60,
                    borderRadius: 12,
                }}>
                </View>
            </View>

            <Pressable
                onPress={onReject}
                style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10
                }}
            >
                <FontAwesome5
                    name='link'
                    color='#313A43'
                    size={15}
                />
                <Text
                    style={{
                        fontSize: 15,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        color: '#313A43',
                        textAlign: 'center',
                        marginHorizontal: 5
                    }}
                >
                    {locales('labels.copyLink')}
                </Text>
            </Pressable>
        </RBSheet >
    )
};

export default ContactsListModal;