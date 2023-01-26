const customEnhancer = () => (next) => (action) => next(action);

const reactotron = {
    configure: () => reactotron,
    useReactNative: () => reactotron,
    use: () => reactotron,
    connect: () => reactotron,
    clear: () => reactotron,
    createEnhancer: customEnhancer,
    createSagaMonitor: () => jest.fn()
};
export default reactotron;
