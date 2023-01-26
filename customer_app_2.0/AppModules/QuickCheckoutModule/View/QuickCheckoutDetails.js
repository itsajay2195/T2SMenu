import React, { Component } from 'react';
import { CONSTANTS, PAYMENT_TYPE, QUICK_CHECKOUT_SCREEN_KEYS, SCREEN_NAME } from '../Utils/QuickCheckoutConstants';
import { connect } from 'react-redux';
import DeliveryComponent from './DeliveryComponent';
import CardComponent from './CardComponent';
import GetItByComponent from './GetItByComponent';
import TotalComponent from './TotalComponent';
import { isCollectionAvailableSelector, isDeliveryAvailableSelector, selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import * as Analytics from '../../AnalyticsModule/Analytics';
import {
    selectBasketID,
    getPaymentModeForBasket,
    selectPaymentErrorMessage,
    selectPreOrderDatesForCollection,
    selectPreOrderDatesForDelivery
} from '../../BasketModule/Redux/BasketSelectors';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import {
    checkDeliveryAddressAvailability,
    selectDeliveryAddressAction,
    updateSelectedOrderType
} from '../../AddressModule/Redux/AddressAction';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import {
    paymentErrorMessageAction,
    selectedDriverTipsItem,
    updateDriverTips,
    updateUserPaymentMode,
    updateUserSelectedCardId
} from '../../BasketModule/Redux/BasketAction';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { getFormattedFullAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import styles from './Styles/QuickCheckoutStyles';
import { View } from 'react-native';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import { constructPreOrderDate, isImmediateOptionAvailable } from '../Utils/Helper';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';

class QuickCheckoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            defaultValue: this.props.defaultValue
        };

        this.handleAddressItemClicked = this.handleAddressItemClicked.bind(this);
        this.handleGetItByItemClicked = this.handleGetItByItemClicked.bind(this);
        this.handleCardComponentClicked = this.handleCardComponentClicked.bind(this);
    }

    handleAddressItemClicked(item) {
        const { screenKey } = this.props;
        if (isValidElement(item) && item === ORDER_TYPE.COLLECTION.toUpperCase()) {
            this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            this.props.onClose(screenKey, item);
        } else {
            if (isValidElement(item)) {
                this.props.checkDeliveryAddressAvailability(item);
                this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, item.postcode, item.id);
                this.props.selectDeliveryAddressAction(item);
                this.props.onClose(screenKey, item);
            }
        }
        Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_TYPE, ANALYTICS_EVENTS.DELIVERY_ADDRESS_CHANGE, {
            selected_address: getFormattedFullAddress(item)
        });
    }

    handleGetItByItemClicked(item, isPreOrderASAP = false) {
        const { screenKey, onClose } = this.props;
        if (isValidElement(onClose)) {
            onClose(screenKey, item, isPreOrderASAP);
            Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_TYPE, ANALYTICS_EVENTS.DELIVERY_TIME_CHANGE, {
                type: item === CONSTANTS.IMMEDIATELY ? item : CONSTANTS.PRE_ORDER
            });
        }
    }

    handleCardComponentClicked(analyticsId, item, selectedCardId) {
        const {
            screenKey,
            paymentErrorMessage,
            driverTips,
            storeConfigName,
            featureGateResponse,
            cartID,
            selectedPaymentMode
        } = this.props;
        if (isValidElement(paymentErrorMessage)) {
            this.props.paymentErrorMessageAction(null);
        }
        this.props.updateUserPaymentMode(item);
        if (isValidElement(selectedCardId)) {
            this.props.updateUserSelectedCardId(selectedCardId);
        }
        if (item === PAYMENT_TYPE.CASH && isValidElement(driverTips)) {
            this.props.updateDriverTips(0.0, selectedPaymentMode);
            this.props.selectedDriverTipsItem(null, null);
        }
        this.props.onClose(screenKey, item);
        let eventObj = {
            payment_mode: item,
            takeaway: storeConfigName
        };
        if (isValidElement(cartID)) eventObj.order_id = cartID;
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.UPDATE_PAYMENT_MODE, eventObj);
        Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_TYPE, ANALYTICS_EVENTS.PAYMENT_TYPE_CHANGE, {
            payment_mode: item,
            item_selected: analyticsId
        });
    }

    render() {
        const { screenKey } = this.props;
        return <View style={styles.cardComponentStyle}>{this.renderComponents(screenKey)}</View>;
    }

    renderComponents(screenKey) {
        switch (screenKey) {
            case QUICK_CHECKOUT_SCREEN_KEYS.QC_ADDRESS: {
                return this.renderDeliveryAddress();
            }
            case QUICK_CHECKOUT_SCREEN_KEYS.PAYMENT: {
                return this.renderCardComponent();
            }
            case QUICK_CHECKOUT_SCREEN_KEYS.DELIVERY_TIME: {
                return this.renderGetItByComponent();
            }
            case QUICK_CHECKOUT_SCREEN_KEYS.AMOUNT: {
                return this.renderTotalComponent();
            }
        }
    }

    renderDeliveryAddress() {
        return (
            <DeliveryComponent
                data={this.props.addressResponse.data}
                screenName={SCREEN_NAME.QC_DETAILS_DELIVERY_ADDRESS_SCREEN}
                deliveryAddressId={this.props.deliveryAddress?.id}
                isUkTakeaway={isUKApp(this.props.countryID)}
                itemClicked={this.handleAddressItemClicked}
            />
        );
    }

    renderCardComponent() {
        const { defaultValue } = this.props;
        return <CardComponent selectedType={defaultValue} itemClicked={this.handleCardComponentClicked} />;
    }

    renderTotalComponent() {
        const { paymentType } = this.props;
        return <TotalComponent paymentType={paymentType} showPaymentType={true} />;
    }

    renderGetItByComponent() {
        const {
            isCollectionAvailable,
            isDeliveryAvailable,
            selectedOrderType,
            preOrderCollectionDates,
            preOrderDeliveryDates
        } = this.props;
        return (
            <GetItByComponent
                selectedType={this.props.defaultValue}
                screenName={SCREEN_NAME.QUICK_CHECKOUT_DETAIL_SCREEN}
                itemClicked={this.handleGetItByItemClicked}
                isImmediateAvailable={isImmediateOptionAvailable(isCollectionAvailable, isDeliveryAvailable, selectedOrderType)}
                preOrderDates={constructPreOrderDate(preOrderCollectionDates, preOrderDeliveryDates, selectedOrderType)}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    addressResponse: state.addressState.addressResponse,
    currency: selectCurrencyFromStore(state),
    deliveryAddress: state.addressState.deliveryAddress,
    preOrderCollectionDates: selectPreOrderDatesForCollection(state),
    preOrderDeliveryDates: selectPreOrderDatesForDelivery(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    paymentErrorMessage: selectPaymentErrorMessage(state),
    countryID: state.appState.s3ConfigResponse?.country?.id,
    selectedOrderType: selectOrderType(state),
    isCollectionAvailable: isCollectionAvailableSelector(state),
    isDeliveryAvailable: isDeliveryAvailableSelector(state),
    driverTips: state.basketState.viewBasketResponse?.driver_tip?.value,
    storeConfigName: state.appState.storeConfigResponse?.name,
    cartID: selectBasketID(state),
    selectedPaymentMode: getPaymentModeForBasket(state)
});
const mapDispatchToProps = {
    updateSelectedOrderType,
    selectDeliveryAddressAction,
    updateUserPaymentMode,
    updateUserSelectedCardId,
    checkDeliveryAddressAvailability,
    paymentErrorMessageAction,
    updateDriverTips,
    selectedDriverTipsItem
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickCheckoutDetails);
