// https://github.com/react-native-netinfo/react-native-netinfo#errors-while-running-jest-tests
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
mockRNCNetInfo.addEventListener = jest.fn(() => {
    return jest.fn();
});
module.exports = mockRNCNetInfo;
