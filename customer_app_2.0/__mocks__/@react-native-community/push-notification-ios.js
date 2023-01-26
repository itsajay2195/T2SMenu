// https://github.com/zo0r/react-native-push-notification/issues/347#issuecomment-283094161
export default {
    configure: jest.fn(),
    onRegister: jest.fn(),
    onNotification: jest.fn(),
    addEventListener: jest.fn(),
    requestPermissions: jest.fn()
};
