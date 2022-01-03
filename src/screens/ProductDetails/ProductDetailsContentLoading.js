import React, { memo } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import { deviceWidth, deviceHeight } from '../../utils';

const ProductDetailsContentLoading = _ => {
    return (
        <>
            <View>
                <ContentLoader
                    speed={2}
                    width={deviceWidth}
                    height={deviceHeight * 0.305}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Rect x="0" y="0" rx="2" ry="2" width="100%" height='100%' />
                </ContentLoader>
            </View>

            <ShadowView
                style={{
                    shadowColor: 'black',
                    shadowOpacity: 0.13,
                    shadowRadius: 1,
                    shadowOffset: { width: 0, height: 2 },

                }}
            >
                <View style={{
                    paddingTop: 20,
                    alignItems: 'center',

                }}>

                    <ContentLoader
                        speed={2}
                        width={deviceWidth}
                        height={124}
                        viewBox="0 0 410 124"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <Rect x="174" y="1" rx="3" ry="3" width="221" height="30" />
                        <Rect x="14" y="1" rx="3" ry="3" width="91" height="30" />
                    </ContentLoader>
                </View>
                <View style={{
                    paddingTop: 20,
                    alignItems: 'center',
                    paddingBottom: 30
                }}>

                    <ContentLoader
                        speed={2}
                        width={deviceWidth}
                        style={{ top: -70 }}
                        height={350}
                        viewBox="0 0 410 350"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <Rect x="249" y="1" rx="3" ry="3" width="146" height="18" />
                        <Rect x="15" y="1" rx="3" ry="3" width="133" height="18" />
                        <Rect x="15" y="35" rx="3" ry="3" width="379" height="2" />
                        <Rect x="207" y="52" rx="3" ry="3" width="187" height="18" />
                        <Rect x="14" y="52" rx="3" ry="3" width="98" height="18" />
                        <Rect x="14" y="86" rx="3" ry="3" width="379" height="2" />
                        <Rect x="285" y="108" rx="3" ry="3" width="108" height="18" />
                        <Rect x="13" y="108" rx="3" ry="3" width="156" height="18" />
                        <Rect x="13" y="142" rx="3" ry="3" width="379" height="2" />
                        <Rect x="258" y="160" rx="3" ry="3" width="134" height="18" />
                        <Rect x="12" y="160" rx="3" ry="3" width="122" height="18" />
                        <Rect x="12" y="194" rx="3" ry="3" width="379" height="2" />
                        <Rect x="173" y="211" rx="3" ry="3" width="218" height="18" />
                        <Rect x="12" y="211" rx="3" ry="3" width="99" height="18" />
                        <Rect x="12" y="245" rx="3" ry="3" width="379" height="2" />
                        <Rect x="223" y="267" rx="3" ry="3" width="168" height="18" />
                        <Rect x="120" y="267" rx="3" ry="3" width="84" height="18" />
                        <Rect x="15" y="267" rx="3" ry="3" width="83" height="18" />
                        <Rect x="306" y="300" rx="3" ry="3" width="84" height="18" />
                        <Rect x="155" y="300" rx="3" ry="3" width="134" height="18" />
                        <Rect x="15" y="300" rx="3" ry="3" width="121" height="18" />
                        <Rect x="307" y="330" rx="3" ry="3" width="84" height="18" />
                        <Rect x="202" y="331" rx="3" ry="3" width="84" height="18" />
                        <Rect x="15" y="330" rx="3" ry="3" width="156" height="18" />
                    </ContentLoader>
                </View>
            </ShadowView>
            <ShadowView style={{
                marginTop: 30,
                paddingVertical: 30,
                shadowColor: 'black',
                shadowOpacity: 0.13,
                shadowRadius: 1,
                shadowOffset: { width: 0, height: 2 },
            }}>
                <ContentLoader
                    speed={2}
                    width={deviceWidth}
                    height={325}
                    viewBox="0 0 476 325"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Circle cx="237" cy="65" r="60" />
                    <Rect x="141" y="137" rx="3" ry="3" width="185" height="20" />
                    <Rect x="132" y="168" rx="3" ry="3" width="208" height="31" />
                    <Rect x="25" y="225" rx="3" ry="3" width="423" height="43" />
                    <Rect x="24" y="280" rx="3" ry="3" width="423" height="43" />
                </ContentLoader>
            </ShadowView>
        </>
    )
};

export default memo(ProductDetailsContentLoading);