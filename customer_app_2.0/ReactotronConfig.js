import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

export default Reactotron.configure()
    .use(sagaPlugin())
    .use(reactotronRedux())
    .useReactNative()
    .connect();

export const sagaMonitor = Reactotron.createSagaMonitor();
