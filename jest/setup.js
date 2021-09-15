import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'; // or use require

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

jest.mock('react-native/Libraries/Lists/FlatList', () => {
    const RN = jest.requireActual('react-native');
    return RN.ScrollView;
});