// https://github.com/Instabug/Instabug-React-Native/issues/232
const BugReporting = {
    onSDKDismissedHandler: jest.fn(),
    setReportTypes: jest.fn(),
    reportType: {},
    showWithOptions: jest.fn(),
    option: {}
};

const Replies = {
    setInAppNotificationsEnabled: jest.fn(),
    setOnNewReplyReceivedCallback: jest.fn((callback) => null),
    show: jest.fn(),
    getUnreadRepliesCount: jest.fn(() => Promise.resolve(0))
};

const Chats = {
    setEnabled: jest.fn(),
    show: jest.fn()
};

export { BugReporting, Replies, Chats };

export default {
    startWithToken: jest.fn(),
    setUserAttribute: jest.fn(),
    setChatNotificationEnabled: jest.fn(),
    setTrackUserSteps: jest.fn(),
    setPrimaryColor: jest.fn(),
    invocationEvent: {},
    BugReporting,
    Replies,
    Chats
};
