//

jest.mock('@react-native-firebase/crashlytics', () => () => ({
    recordError: jest.fn(),
    setAttributes: () => Promise.resolve({}),
    log: jest.fn(),
    setUserId: jest.fn().mockResolvedValue(true),
    setAttribute: jest.fn().mockResolvedValue(true)
}));

jest.mock('@react-native-firebase/analytics', () => () => ({
    logEvent: () => Promise.resolve({})
}));

jest.mock('@react-native-firebase/messaging', () =>
    jest.fn(() => ({
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken'))
    }))
);

// https://github.com/invertase/react-native-firebase/issues/3035
jest.mock('@react-native-firebase/app', () => () => {
    return {
        currentUser: { idToken: 'mocked-id-token' }
    };
});
