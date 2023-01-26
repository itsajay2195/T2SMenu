import React from 'react';
import { View } from 'react-native';
import { batch, connect } from 'react-redux';
import { T2SModal } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import styles from '../Styles/ViewOrderStyle';
import { deleteCartAction, fetchingBasketResponse, fromReOrderScreenAction } from '../../../BasketModule/Redux/BasketAction';
import { setSideMenuActiveAction } from '../../../../CustomerApp/Redux/Actions';
import { CHECK_ORDER_TYPE, ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import { selectDeliveryAddressAction, updateSelectedOrderType } from '../../../AddressModule/Redux/AddressAction';
import {
    disableReorderButtonAction,
    resetReOrderResponseAction,
    resetReOrderStoreConfigAction,
    showBasketReplaceModelAction,
    showSwitchOrderTypeModalAction,
    showTakeawayClosedModal,
    updateCreateBasketAction
} from '../../Redux/OrderManagementAction';
import { selectPrimaryAddressSelector, selectReOrderStoreConfigResponse } from 't2sbasemodule/Utils/AppSelectors';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { debounce } from 'lodash';
import { updateStoreConfigResponseAction } from '../../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { getValidAddress } from '../../Utils/OrderManagementHelper';

const ReOrderMissingItemModal = (props) => {
    return (
        <View>
            {renderOneOrMoreMissingItemModal(props)}
            {renderAllMissingItemModal(props)}
            {renderTakeawayClosedModal(props)}
            {renderReplaceBasketModal(props)}
            {renderSwitchOrderTypeModal(props)}
        </View>
    );
};
const renderOneOrMoreMissingItemModal = (props) => {
    return (
        <T2SModal
            isVisible={props.oneOrMoreItemMissingModalVisible}
            positiveButtonText={LOCALIZATION_STRINGS.YES}
            negativeButtonClicked={() => {
                batch(() => {
                    props.updateCreateBasketAction(null);
                    props.hideOneOrMoreItemMissingModal();
                    commonNegativeButtonAction(props);
                    props.resetReOrderResponseAction();
                });
            }}
            title={LOCALIZATION_STRINGS.HEY_THERE.toUpperCase()}
            titleTextStyle={styles.modalTitleStyle}
            description={LOCALIZATION_STRINGS.SOME_ITEMS_MISSING}
            negativeButtonText={LOCALIZATION_STRINGS.NO}
            positiveButtonClicked={() => {
                batch(() => {
                    props.updateStoreConfigResponseAction(props.reOrderStoreConfiguration);
                    props.resetReOrderStoreConfigAction(null);
                    props.fromReOrderScreenAction(true);
                    props.showOneOrMoreItemModalPositiveTapped();
                });
            }}
            requestClose={() => {
                props.updateCreateBasketAction(null);
                props.hideOneOrMoreItemMissingModal();
                commonNegativeButtonAction(props);
                props.resetReOrderResponseAction();
            }}
        />
    );
};
const renderAllMissingItemModal = (props) => {
    return (
        <T2SModal
            isVisible={props.allItemMissingModalVisible}
            positiveButtonText={LOCALIZATION_STRINGS.OK}
            negativeButtonText={null}
            positiveButtonClicked={() => {
                batch(() => {
                    props.updateCreateBasketAction(null);
                    props.resetReOrderStoreConfigAction(null);
                    props.navigation.goBack();
                    props.resetReOrderResponseAction();
                });
            }}
            title={LOCALIZATION_STRINGS.HEY_THERE.toUpperCase()}
            titleTextStyle={styles.modalTitleStyle}
            description={LOCALIZATION_STRINGS.ALL_ITEMS_MISSING}
            requestClose={() => {
                props.updateCreateBasketAction(null);
                props.hideAllItemMissingModal();
                commonNegativeButtonAction(props);
                props.resetReOrderResponseAction();
            }}
        />
    );
};
const renderTakeawayClosedModal = (props) => {
    return (
        <T2SModal
            isVisible={props.takeawayClosedModalVisible}
            positiveButtonText={LOCALIZATION_STRINGS.OK}
            negativeButtonText={null}
            title={''}
            positiveButtonClicked={() => {
                batch(() => {
                    props.showTakeawayClosedModal(false);
                    commonNegativeButtonAction(props);
                });
            }}
            description={LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW}
            requestClose={() => {
                props.showTakeawayClosedModal(false);
                commonNegativeButtonAction(props);
            }}
        />
    );
};
const renderReplaceBasketModal = (props) => {
    return (
        <T2SModal
            isVisible={props.replaceBasketModalVisible}
            positiveButtonText={LOCALIZATION_STRINGS.PROCEED}
            negativeButtonClicked={() => {
                props.showBasketReplaceModelAction(false);
                commonNegativeButtonAction(props);
            }}
            title={LOCALIZATION_STRINGS.REORDER.toUpperCase()}
            description={LOCALIZATION_STRINGS.RE_ORDER_CLEAR_BASKET}
            negativeButtonText={LOCALIZATION_STRINGS.NO}
            positiveButtonClicked={() => {
                handleBasketReplace(props);
            }}
            requestClose={() => {
                props.showBasketReplaceModelAction(false);
                commonNegativeButtonAction(props);
            }}
        />
    );
};
const handleBasketReplace = debounce(
    (props) => {
        props.showBasketReplaceModelAction(false);
        props.deleteCartAction({
            orderId: props.orderID,
            storeID: props.oreOrderStoreID,
            navigation: props.navigation,
            sending: props.orderType,
            isFromReOrder: true,
            basketStoreID: props.basketStoreID
        });
        props.rePlaceBasketPositiveButtonTapped();
    },
    300,
    { leading: true, trailing: false }
);

const commonNegativeButtonAction = (props) => {
    props.disableReorderButtonAction(false);
    props.resetReOrderStoreConfigAction(null);
    props.navigation.goBack();
    props.fetchingBasketResponse(false);
};

const renderSwitchOrderTypeModal = (props) => {
    const isCollection = props.orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION;
    return (
        <T2SModal
            isVisible={props.orderTypeSwitchModalVisible}
            positiveButtonText={LOCALIZATION_STRINGS.OK}
            negativeButtonClicked={() => {
                props.showSwitchOrderTypeModalAction(false);
                commonNegativeButtonAction(props);
            }}
            description={
                LOCALIZATION_STRINGS.ORDER_TYPE_NOT_AVAILABLE +
                (isCollection ? ORDER_TYPE.COLLECTION : ORDER_TYPE.DELIVERY) +
                LOCALIZATION_STRINGS.CHOOSE_OTHER_OPTIONS
            }
            negativeButtonText={LOCALIZATION_STRINGS.CANCEL}
            title={''}
            positiveButtonClicked={() => {
                batch(() => {
                    switchOrderTypeForReOrder(props, isCollection);
                    props.showSwitchOrderTypeModalAction(false);
                    props.switchOrderTypePositiveButtonTapped(isCollection ? ORDER_TYPE.DELIVERY : ORDER_TYPE.COLLECTION);
                });
            }}
            requestClose={() => {
                props.showSwitchOrderTypeModalAction(false);
                commonNegativeButtonAction(props);
            }}
        />
    );
};
const switchOrderTypeForReOrder = (props, isCollection) => {
    if (isCollection) {
        const { deliveryAddress, primaryAddress } = props;
        let address = getValidAddress(deliveryAddress, primaryAddress);
        if (isValidElement(address)) {
            props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, address.postcode, address.id);
            props.selectDeliveryAddressAction(address);
        }
    } else {
        props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
    }
};

const mapStateToProps = (state) => ({
    deliveryAddress: state.addressState.deliveryAddress,
    primaryAddress: selectPrimaryAddressSelector(state),
    basketStoreID: state.basketState.storeID,
    reOrderStoreConfiguration: selectReOrderStoreConfigResponse(state)
});
const mapDispatchToProps = {
    fromReOrderScreenAction,
    setSideMenuActiveAction,
    deleteCartAction,
    updateSelectedOrderType,
    selectDeliveryAddressAction,
    showTakeawayClosedModal,
    showSwitchOrderTypeModalAction,
    updateCreateBasketAction,
    showBasketReplaceModelAction,
    disableReorderButtonAction,
    resetReOrderStoreConfigAction,
    updateStoreConfigResponseAction,
    fetchingBasketResponse,
    resetReOrderResponseAction
};
export default connect(mapStateToProps, mapDispatchToProps)(ReOrderMissingItemModal);
