import { combineReducers } from 'redux';
import offlineNoticeManagerReducer from 't2sbasemodule/Managers/OfflineNoticeManager/Redux/OfflineNoticeManagerReducer';
import pushNotificationReducer from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotificationReducer';
import appsReducer from './AppReducers';
import authReducer from '../../../AppModules/AuthModule/Redux/AuthReducer';
import profileReducer from '../../../AppModules/ProfileModule/Redux/ProfileReducer';
import addressReducer from '../../../AppModules/AddressModule/Redux/AddressReducer';
import foodHubHomeReducer from '../../../FoodHubApp/HomeModule/Redux/HomeReducer';
import savedCardsReducer from '../../../AppModules/SavedCardsModule/Redux/SavedCardsReducer';
import notificationReducer from '../../../AppModules/NotificationModule/Redux/NotificationReducer';
import tableReservationReducer from '../../../AppModules/TableReservationModule/Redux/TableReservationReducer';
import reviewReducer from '../../../AppModules/ReviewModule/Redux/ReviewReducer';
import menuReducer from '../../../AppModules/MenuModule/Redux/MenuReducer';
import basketReducer from '../../../AppModules/BasketModule/Redux/BasketReducer';
import orderManagementReducer from '../../../AppModules/OrderManagementModule/Redux/OrderManagementReducer';
import homeReducer from '../../../AppModules/HomeModule/Redux/HomeReducer';
import takeawayDetailsReducer from '../../../AppModules/TakeawayDetailsModule/Redux/TakeawayDetailsReducer';
import totalSavingsReducer from '../../../AppModules/TotalSavingsModule/Redux/TotalSavingsReducer';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';
import sessionManagerReducer from 't2sbasemodule/Network/SessionManager/Redux/SessionManagerReducer';
import TakeawayListReducer from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListReducer';
import { persistConfig } from '../Store/ConfigureStore';
import { APP_ACTION_TYPE } from '../Actions/Types';
import WalletReducer from '../../../FoodHubApp/WalletModule/Redux/WalletReducer';
import VersionUpdateReducers from 't2sbasemodule/Managers/UpdateManager/Redux/VersionUpdateReducers';
import { persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import HomeAddressReducer from 'appmodules/HomeAddressModule/Redux/HomeAddressReducer';
import { isCustomerApp } from 't2sbasemodule/Utils/helpers';
import LandingReducer from '../../../FoodHubApp/LandingPage/Redux/LandingReducer';
import EnvConfigReducer from './EnvConfigReducer';
//blacklist the initAPIStatus key to avoid the splashscreen issue
const appPersistConfig = {
    key: 'appState',
    storage: FilesystemStorage,
    whitelist: isCustomerApp()
        ? [
              's3ConfigResponse',
              'policyLookupResponse',
              'language',
              'storeConfigResponse',
              'appVersion',
              'moengageUserMigrated',
              'googleSessionToken'
          ]
        : ['s3ConfigResponse', 'policyLookupResponse', 'language', 'appVersion', 'moengageUserMigrated', 'googleSessionToken']
};

const foodHubHomePersistConfig = {
    key: 'foodHubHomeState',
    storage: FilesystemStorage,
    blacklist: ['postcode', 'isAppOpen']
};

const authPersistConfig = {
    key: 'authState',
    storage: FilesystemStorage,
    blacklist: ['isExistingEmail']
};

const addressPersistConfig = {
    key: 'homeAddressState',
    storage: FilesystemStorage,
    blacklist: ['showHideAddressSelection']
};

const pushNotificationConfig = {
    key: 'notificationState',
    storage: FilesystemStorage,
    whitelist: ['brazeNotificationList']
};
const takeawayListReducerConfig = {
    key: 'takeawayListReducer',
    storage: FilesystemStorage,
    whitelist: ['isSavedAddress', 'searchAddress', 'selectedAddress']
};
const addressStateConfig = {
    key: 'addressState',
    storage: FilesystemStorage,
    blacklist: ['currentLocation']
};

const appReducer = combineReducers({
    offlineNoticeManagerState: offlineNoticeManagerReducer,
    pushNotificationState: persistReducer(pushNotificationConfig, pushNotificationReducer),
    appState: persistReducer(appPersistConfig, appsReducer),
    authState: persistReducer(authPersistConfig, authReducer),
    profileState: profileReducer,
    addressState: persistReducer(addressStateConfig, addressReducer),
    savedCardsState: savedCardsReducer,
    notificationState: notificationReducer,
    tableReservationState: tableReservationReducer,
    reviewState: reviewReducer,
    menuState: menuReducer,
    basketState: basketReducer,
    orderManagementState: orderManagementReducer,
    homeState: homeReducer,
    takeawayDetailsState: takeawayDetailsReducer,
    totalSavingsState: totalSavingsReducer,
    userSessionState: sessionManagerReducer,
    takeawayListReducer: persistReducer(takeawayListReducerConfig, TakeawayListReducer),
    foodHubHomeState: persistReducer(foodHubHomePersistConfig, foodHubHomeReducer),
    walletState: WalletReducer,
    updateState: VersionUpdateReducers,
    homeAddressState: persistReducer(addressPersistConfig, HomeAddressReducer),
    landingState: LandingReducer,
    envConfigState: EnvConfigReducer
});

const rootReducer = (state, action) => {
    /**
     *  ENABLE FOR LOGOUT
     */
    if (action.type === AUTH_TYPE.SET_LOGOUT_ACTION || action.type === AUTH_TYPE.INVALID_SESSION) {
        Object.keys(state).forEach((key) => {
            if (
                key === 'authState' ||
                key === 'profileState' ||
                key === 'addressState' ||
                key === 'savedCardsState' ||
                key === 'basketState' ||
                key === 'walletState' ||
                key === 'orderManagementState' ||
                key === 'totalSavingsState' ||
                key === 'foodHubHomeState' ||
                key === 'homeAddressState'
            ) {
                persistConfig.storage.removeItem(`persist:${key}`);
                state[key] = undefined;
            }
        });
    } else if (action.type === APP_ACTION_TYPE.APP_RESET_ACTION) {
        Object.keys(state).forEach((key) => {
            if (key !== 'envConfigState') {
                persistConfig.storage.removeItem(`persist:${key}`);
                state[key] = undefined;
            }
        });
    }
    return appReducer(state, action);
};

export default rootReducer;
