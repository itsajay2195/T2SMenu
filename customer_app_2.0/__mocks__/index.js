import './react-native-firebase-mock';

// https://reactnavigation.org/docs/testing/
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-community/google-signin', () => {
    console.log('here');
    return {
        GoogleSignin: {
            configure: jest.fn()
        },
        statusCodes: jest.fn()
    };
});

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// https://github.com/expo/expo/blob/efd52c55d552812b605620da56b47d1b26ce59f8/packages/jest-expo/jest-preset.json#L24-L26

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: () => null
}));
