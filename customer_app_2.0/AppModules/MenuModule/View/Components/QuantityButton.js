import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import ItemAddButton from 't2sbasemodule/UI/CustomUI/ItemAddButton/AddButton';
import { addButtonTappedAction, deleteCartAction, resetBasket } from '../../../BasketModule/Redux/BasketAction';
import { isItemAvailableForSelectedOrderType } from '../../Utils/MenuHelpers';
import { selectCartItems, selectQty } from '../../../BasketModule/Redux/BasketSelectors';
import { debounce } from 'lodash';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getNetworkStatus } from 't2sbasemodule/Utils/AppSelectors';
import Colors from 't2sbasemodule/Themes/Colors';
import { selectOrderType } from '../../../OrderManagementModule/Redux/OrderManagementSelectors';
import { isOrderTypeAvailable, isPreOrderAvailableForType } from '../../../OrderManagementModule/Utils/OrderManagementHelper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { isValidElement, makeHapticFeedback } from 't2sbasemodule/Utils/helpers';
import { HapticFrom } from 't2sbasemodule/Utils/Constants';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import styles from '../../../../AppModules/OrderManagementModule/View/Styles/ViewOrderStyle';
import { isNotSameStore, skipStoreOpenStatus } from '../../../BasketModule/Utils/BasketHelper';
import { prevStoreConfigResponseAction } from '../../../../CustomerApp/Redux/Actions';
import {
    selectCollectionStatus,
    selectDeliveryStatus,
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';

let timeout;
class QuantityButton extends Component {
    constructor(props) {
        super(props);
        this.handleClearBasketYesClick = this.handleClearBasketYesClick.bind(this);
        this.updateClearBasketModal = this.updateClearBasketModal.bind(this);
        this.onUpdateCount = this.onUpdateCount.bind(this);
        this.state = {
            clearBasketModal: false,
            id: undefined,
            item: undefined,
            qty: undefined,
            type: undefined
        };
    }

    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }
    onUpdateCount(qty, id, type) {
        if (this.props.networkConnected) {
            this.makeAction(id, this.props.item, qty, type);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.GENERIC_ERROR_MSG, null, Colors.persianRed);
        }
        if (this.props.isFromBasketScreen) {
            Keyboard.dismiss();
        }
    }
    render() {
        const {
            item,
            screenName,
            selectedOrderType,
            isFromPreviousOrder,
            isFromBasketScreen,
            quantity,
            deliveryType,
            collectionType,
            storeConfigShowCollection,
            storeStatusCollection,
            storeConfigShowDelivery,
            storeStatusDelivery,
            storeConfigPreOrderDelivery,
            storeConfigPreOrderCollection,
            language,
            countryBaseFeatureGateResponse,
            storeConfigId
        } = this.props;
        const itemNotAvailable =
            isFromPreviousOrder &&
            !skipStoreOpenStatus(countryBaseFeatureGateResponse) &&
            !isItemAvailableForSelectedOrderType(selectedOrderType, collectionType, deliveryType);
        return (
            <>
                <ItemAddButton
                    itemName={item.name}
                    disableAddButton={
                        (isValidElement(storeConfigId) &&
                            !skipStoreOpenStatus(countryBaseFeatureGateResponse) &&
                            !isOrderTypeAvailable(
                                storeConfigShowDelivery,
                                storeStatusDelivery,
                                storeConfigShowCollection,
                                storeStatusCollection,
                                selectedOrderType
                            ) &&
                            !isPreOrderAvailableForType(storeConfigPreOrderDelivery, storeConfigPreOrderCollection, selectedOrderType)) ||
                        itemNotAvailable
                    }
                    quantity={isFromBasketScreen && quantity === 0 ? '1' : quantity}
                    itemId={isFromBasketScreen ? item.item_id : item.id}
                    onUpdateCount={this.onUpdateCount}
                    screenName={screenName}
                    itemNotAvailable={itemNotAvailable}
                    orderType={selectedOrderType}
                    language={language}
                    networkConnected={this.props.networkConnected}
                />
                {this.renderClearBasketModal()}
            </>
        );
    }

    makeAction = debounce(
        (id, item, qty, type) => {
            const {
                basketStoreID,
                cartItems,
                storeConfigResponse,
                isFromBasketScreen,
                fromHome,
                isFromReOrder,
                featureGateResponse,
                storeConfigId,
                isNewMenuBestSelling
            } = this.props;
            // if (!isValidElement(storeConfigId)) {
            //     showErrorMessage(LOCALIZATION_STRINGS.PLEASE_HOLD_ON_WHILE_WE_INITIALIZE);
            // } else
            if (isNotSameStore(basketStoreID, storeConfigId) && isValidElement(cartItems)) {
                if (cartItems.length > 0) {
                    this.setState({
                        id,
                        item,
                        qty,
                        type
                    });
                    this.updateClearBasketModal(true);
                } else {
                    this.props.resetBasket();
                }
            } else {
                if (!isValidElement(cartItems) || (isValidElement(cartItems) && cartItems.length === 0)) {
                    this.props.prevStoreConfigResponseAction(storeConfigResponse);
                }
                this.props.addButtonTappedAction(
                    id,
                    item,
                    qty,
                    type,
                    isFromBasketScreen,
                    fromHome,
                    isFromReOrder,
                    false,
                    isNewMenuBestSelling
                );
                makeHapticFeedback(featureGateResponse, HapticFrom.ITEM_ADDED);
            }
        },
        1,
        { leading: true, trailing: false }
    );

    renderClearBasketModal() {
        return (
            <T2SModal
                isVisible={this.state.clearBasketModal}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonClicked={this.updateClearBasketModal.bind(this, false)}
                titleTextStyle={styles.modalTitleStyle}
                title={''}
                description={LOCALIZATION_STRINGS.CLEAR_BASKET_TAKEAWAY_LIST}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                positiveButtonClicked={this.handleClearBasketYesClick}
                requestClose={this.updateClearBasketModal.bind(this, false)}
            />
        );
    }

    handleClearBasketYesClick() {
        const { storeConfigResponse } = this.props;
        this.props.deleteCartAction({ basketStoreID: this.props.basketStoreID });
        this.setState(
            {
                clearBasketModal: false
            },
            () => {
                timeout = setTimeout(() => {
                    const { id, item, qty, type } = this.state;
                    const { isFromBasketScreen, fromHome, isFromReOrder, featureGateResponse, isNewMenuBestSelling } = this.props;
                    this.props.prevStoreConfigResponseAction(storeConfigResponse);
                    this.props.addButtonTappedAction(
                        id,
                        item,
                        qty,
                        type,
                        isFromBasketScreen,
                        fromHome,
                        isFromReOrder,
                        false,
                        isNewMenuBestSelling
                    );
                    makeHapticFeedback(featureGateResponse, HapticFrom.ITEM_ADDED);
                }, 1000);
            }
        );
    }
    updateClearBasketModal(clearBasketModal = false) {
        this.setState({ clearBasketModal });
    }
}

QuantityButton.propTypes = {
    quantity: PropTypes.number,
    isFromBasketScreen: PropTypes.bool,
    fromHome: PropTypes.bool
};
QuantityButton.defaultProps = {
    quantity: 0,
    isFromBasketScreen: false,
    fromHome: false,
    isFromPreviousOrder: false
};

const makeMapStateToProps = () => {
    const getQuantity = selectQty();
    return (state, props) => {
        return {
            selectedOrderType: selectOrderType(state),
            quantity: getQuantity(state, props),
            networkConnected: getNetworkStatus(state),
            storeConfigResponse: state.appState.storeConfigResponse,
            featureGateResponse: state.appState.countryBaseFeatureGateResponse,
            basketStoreID: state.basketState.storeID,
            cartItems: selectCartItems(state),
            storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
            storeStatusDelivery: selectDeliveryStatus(state),
            storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
            storeStatusCollection: selectCollectionStatus(state),
            storeConfigPreOrderDelivery: selectPreorderDeliveryStatus(state),
            storeConfigPreOrderCollection: selectPreorderCollectionStatus(state),
            storeConfigId: state.appState.storeConfigResponse?.id,
            language: state.appState.language,
            countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse
        };
    };
};

const mapDispatchToProps = {
    addButtonTappedAction,
    resetBasket,
    deleteCartAction,
    prevStoreConfigResponseAction
};
export default connect(makeMapStateToProps, mapDispatchToProps)(QuantityButton);
