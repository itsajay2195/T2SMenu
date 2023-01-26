import React, { Component } from 'react';
import { getTakeawayId, getTakeawayName, isValidElement, safeStringValue } from 't2sbasemodule/Utils/helpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { getDiscoveryScreenRecentOrdersStatus } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import PlaceHolderView from './PlaceHolderView';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import RecentOrderComponent from './RecentOrderComponent';
import { extractOrderType, getValidAddress } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { connect } from 'react-redux';
import {
    selectCurrencySymbol,
    selectHasUserLoggedIn,
    selectIsSpanishLanguage,
    selectLanguageKey,
    selectPrimaryAddressSelector,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { setSideMenuActiveAction } from '../../../../CustomerApp/Redux/Actions';
import {
    reOrderBasketNavigation,
    resetReOrderResponseAction,
    setOrderIDAction,
    updateOrderDetailsData
} from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import { debounce } from 'lodash';
import { RE_ORDER_TRIGGER_SCREEN } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { selectOrderType } from 'appmodules/OrderManagementModule/Redux/OrderManagementSelectors';
import { selectDeliveryAddressAction, updateSelectedOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import RecentOrderHeaderComponent from '../MicroComponents/RecentOrderHeaderComponent';

class RecentOrderAndPlaceHolderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingAndCompletedOrder: null,
            recentOrdersResponse: null
        };
        this.handleViewAllButtonAction = this.handleViewAllButtonAction.bind(this);
        this.handleOnPendingOrderAction = this.handleOnPendingOrderAction.bind(this);
        this.handleReOrderAction = this.handleReOrderAction.bind(this);
    }

    render() {
        const {
            isUserLoggedIn,
            recentOrdersResponse,
            recentTakeawayResponse,
            pendingAndCompletedOrder,
            language,
            countryBaseFeatureGateResponse,
            navigation
        } = this.props;
        if (
            isUserLoggedIn &&
            (recentOrdersResponse?.data?.length > 0 || pendingAndCompletedOrder?.length > 0 || recentTakeawayResponse?.length > 0)
        ) {
            return <T2SView>{getDiscoveryScreenRecentOrdersStatus(countryBaseFeatureGateResponse) && this.renderRecentOrders()}</T2SView>;
        } else {
            return <PlaceHolderView navigation={navigation} language={language} />;
        }
    }
    renderRecentOrders() {
        const { recentOrdersResponse, pendingAndCompletedOrder } = this.props;
        if (recentOrdersResponse?.data?.length > 0 || pendingAndCompletedOrder?.length > 0) {
            return (
                <T2SView screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RECENT_ORDERS}>
                    <RecentOrderHeaderComponent
                        title={LOCALIZATION_STRINGS.RECENT_ORDERS}
                        buttonText={LOCALIZATION_STRINGS.VIEW_ALL}
                        onPress={this.handleViewAllButtonAction}
                    />
                    <RecentOrderComponent
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        orderData={recentOrdersResponse}
                        timeZone={isValidElement(this.props.timeZone) && this.props.timeZone}
                        isSpanish={this.props.isSpanish}
                        onReOrderClicked={this.handleReOrderAction}
                        onPendingOrderClicked={this.handleOnPendingOrderAction}
                        pendingOrder={isValidElement(pendingAndCompletedOrder) && pendingAndCompletedOrder}
                        currency={this.props.currency}
                    />
                </T2SView>
            );
        }
    }
    handleReorderClick = debounce(
        (orderId, storeID, orderType) => {
            Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.REORDER_ACTION, {
                order_id: safeStringValue(orderId)
            });
            this.props.resetReOrderResponseAction();
            this.switchOrderTypeForReOrder(orderType);
            this.props.reOrderBasketNavigation(orderId, storeID, this.props.navigation, orderType, RE_ORDER_TRIGGER_SCREEN.HOME_SCREEN);
            this.props.setOrderIDAction(orderId);
        },
        300,
        { leading: true, trailing: false }
    );

    switchOrderTypeForReOrder(sending) {
        if (sending !== this.props.selectedOrderType) {
            if (sending === ORDER_TYPE.DELIVERY) {
                const { deliveryAddress, primaryAddress } = this.props;
                let address = getValidAddress(deliveryAddress, primaryAddress);
                if (isValidElement(address)) {
                    this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, address.postcode, address.id);
                    this.props.selectDeliveryAddressAction(deliveryAddress);
                }
            } else {
                this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            }
        }
    }

    handleViewAllButtonAction() {
        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.ORDER_HISTORY.route_name);
        handleNavigation(SCREEN_OPTIONS.ORDER_HISTORY.route_name);
    }

    handleOnPendingOrderAction(item) {
        /**
         * TODO
         * 1) Hit reorder API once session wrapper is done
         * 2) Disable Reorder click
         * 3) Check if the basket is empty when trying to reorder
         * */
        if (isValidElement(item)) {
            const { id, store, sending } = item;
            Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.CURRENT_ORDER_ITEM_CLICKED, {
                order_id: safeStringValue(id)
            });
            this.props.updateOrderDetailsData(item);
            let store_id = getTakeawayId(store);
            handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                data: item,
                orderId: id,
                storeID: store_id,
                sending: sending,
                name: getTakeawayName(store?.name),
                store: store,
                screenName: SCREEN_NAME.HOME_SCREEN,
                analyticsObj: {
                    order_id: id,
                    store_id: store_id
                }
            });
        }
    }

    handleReOrderAction(selectedOrder) {
        const orderType = extractOrderType(selectedOrder.sending);
        const storeId = getTakeawayId(selectedOrder.store);
        this.handleReorderClick(selectedOrder.id, storeId, orderType);
    }
}

const mapStateToProps = (state) => ({
    recentOrdersResponse: state.foodHubHomeState.recentOrdersResponse,
    recentTakeawayResponse: state.foodHubHomeState.recentTakeawayResponse,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    pendingAndCompletedOrder: state.orderManagementState.pendingAndCompletedOrder,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    timeZone: selectTimeZone(state),
    currency: selectCurrencySymbol(state),
    selectedOrderType: selectOrderType(state),
    deliveryAddress: state.addressState.deliveryAddress,
    primaryAddress: selectPrimaryAddressSelector(state),
    isSpanish: selectIsSpanishLanguage(state),
    language: selectLanguageKey(state)
});
const mapDispatchToProps = {
    setSideMenuActiveAction,
    updateOrderDetailsData,
    resetReOrderResponseAction,
    reOrderBasketNavigation,
    setOrderIDAction,
    updateSelectedOrderType,
    selectDeliveryAddressAction
};
export default connect(mapStateToProps, mapDispatchToProps)(RecentOrderAndPlaceHolderComponent);
