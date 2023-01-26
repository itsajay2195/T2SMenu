import versionUpdateSaga from 't2sbasemodule/Managers/UpdateManager/Redux/VersionUpdateSaga';
import pushNotificationSaga from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotificationSaga';
import appSaga from './AppSaga';
import AuthSaga from '../../AppModules/AuthModule/Redux/AuthSaga';
import ProfileSaga from '../../AppModules/ProfileModule/Redux/ProfileSaga';
import AddressSaga from '../../AppModules/AddressModule/Redux/AddressSaga';
import SavedCardsSaga from '../../AppModules/SavedCardsModule/Redux/SavedCardsSaga';
import NotificationSaga from '../../AppModules/NotificationModule/Redux/NotificationSaga';
import TableReservationSaga from '../../AppModules/TableReservationModule/Redux/TableReservationSaga';
import ReviewSaga from '../../AppModules/ReviewModule/Redux/ReviewSaga';
import MenuSaga from '../../AppModules/MenuModule/Redux/MenuSaga';
import BasketSaga from '../../AppModules/BasketModule/Redux/BasketSaga';
import OrderManagementSaga from '../../AppModules/OrderManagementModule/Redux/OrderManagementSaga';
import HomeSaga from '../../AppModules/HomeModule/Redux/HomeSaga';
import TakeawayDetailsSaga from '../../AppModules/TakeawayDetailsModule/Redux/TakeawayDetailsSaga';
import TotalSavingsSaga from '../../AppModules/TotalSavingsModule/Redux/TotalSavingsSaga';
import { all } from 'redux-saga/effects';
import QuickCheckoutSaga from 'appmodules/QuickCheckoutModule/Redux/QuickCheckoutSaga';
import FoodHubHomeSaga from '../../FoodHubApp/HomeModule/Redux/HomeSaga';
import TakeawayListSaga from '../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSaga';
import WalletSaga from '../../FoodHubApp/WalletModule/Redux/WalletSaga';
import LandingSaga from '../../FoodHubApp/LandingPage/Redux/LandingSaga';
import RouterSaga from 'appmodules/RouterModule/Redux/RouterSaga';
import FhLogsSaga from 'appmodules/FHLogsModule/Redux/FhLogsSaga';

export default function* IndexSaga() {
    yield all([
        versionUpdateSaga(),
        pushNotificationSaga(),
        appSaga(),
        AuthSaga(),
        ProfileSaga(),
        AddressSaga(),
        SavedCardsSaga(),
        NotificationSaga(),
        TableReservationSaga(),
        ReviewSaga(),
        MenuSaga(),
        BasketSaga(),
        OrderManagementSaga(),
        HomeSaga(),
        RouterSaga(),
        TakeawayDetailsSaga(),
        TotalSavingsSaga(),
        TakeawayListSaga(),
        QuickCheckoutSaga(),
        FoodHubHomeSaga(),
        WalletSaga(),
        LandingSaga(),
        FhLogsSaga()
    ]);
}
