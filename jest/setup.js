const ReactNative = require('react-native');
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'; // or use require
import React from 'react';
import { View } from 'react-native';
import * as nativeBase from 'native-base';

jest.useFakeTimers()
// function MockIcon(props) { return <View {...props} />; }
// nativeBase.Icon = MockIcon;
jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);


jest.mock('redux-persist', () => {
    const real = jest.requireActual('redux-persist');
    return {
        ...real,
        persistReducer: jest
            .fn()
            .mockImplementation((config, reducers) => reducers),
    };
});
jest.mock('react-native-vector-icons', () => {
    return {
        RNVectorIconsManager: jest.mock(),
        export: {
            default: jest.fn()
        },
        createIconSetFromIcoMoon: jest.fn()
    }
});
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons')
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome')
jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5')
jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign')
jest.mock('react-native-vector-icons/EvilIcons', () => 'EvilIcons')
jest.mock('react-native-vector-icons/Entypo', () => 'Entypo')
jest.mock('react-native-vector-icons/Feather', () => 'Feather')
jest.mock('react-native-vector-icons/Foundation', () => 'Foundation')
jest.mock('react-native-vector-icons/Fontisto', () => 'Fontisto')
jest.mock('@react-native-firebase/analytics', _ => ({
    logEvent: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
}))


jest.doMock("react-native", () => {
    // Extend ReactNative
    return Object.setPrototypeOf(
        {
            // Redefine an export, like a component
            Button: "Button",
            // Mock out properties of an already mocked export
            LayoutAnimation: {
                ...ReactNative.LayoutAnimation,
                configureNext: jest.fn()
            },
            Platform: {
                ...ReactNative.Platform,
                OS: "ios",
                Version: 123,
                isTesting: true,
                select: objs => objs["ios"]
            },
            BackHandler: {
                ...ReactNative.BackHandler,
                addEventListener: jest.fn(),
            },
            // Mock a native module

            NativeModules: {
                ...ReactNative.NativeModules,
                Override: { great: "success" },
                RNPasscodeStatus: {
                    supported: jest.fn(),
                    status: jest.fn(),
                    get: jest.fn(),
                },
            },
        },
        ReactNative
    );
});

jest.mock('react-native/Libraries/Lists/FlatList', () => {
    const RN = jest.requireActual('react-native');
    return RN.ScrollView;
});
