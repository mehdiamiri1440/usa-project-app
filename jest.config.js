
const { defaults } = require('jest-config');
const locales = require('./locales');


module.exports = {
    "preset": "react-native",
    "verbose": true,
    "setupFiles": [
        "./jest/setup.js",
        "./node_modules/react-native-gesture-handler/jestSetup.js"
    ],
    "transformIgnorePatterns": [
        "/node_modules/(?!native-base)/"
    ],
    "moduleNameMapper": {
        "\\.svg": "./__mocks__/svgMock.js"
    },
    moduleFileExtensions: [
        'tsx',
        ...defaults.moduleFileExtensions
    ],

    "resolver": "./preprocessor.js",
    setupFilesAfterEnv: ['./__mocks__/mockFirebase.js', './jest/setup.js'],
    globals: {
        locales: locales.localize
    }
};