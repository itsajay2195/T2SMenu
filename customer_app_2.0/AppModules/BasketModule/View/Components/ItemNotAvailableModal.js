import React, { Component } from 'react';
import { T2SModal } from 't2sbasemodule/UI';
import { connect } from 'react-redux';
import { selectOrderType } from '../../../OrderManagementModule/Redux/OrderManagementSelectors';
import { ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import { selectDeliveryAddressAction, updateSelectedOrderType } from '../../../AddressModule/Redux/AddressAction';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { selectPrimaryAddressSelector } from 't2sbasemodule/Utils/AppSelectors';
import {
    makeChangeAction,
    resetBasket,
    resetNewBasketResponse,
    setOrderTypeLoader,
    updateBasketAction,
    updateDriverTips
} from '../../Redux/BasketAction';
import { BASKET_UPDATE_TYPE } from '../../Utils/BasketConstants';
import {
    newBasketID,
    selectComment,
    selectCouponCode,
    selectIsFromReOrderScreen,
    selectItemMissingModal
} from '../../Redux/BasketSelectors';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { ORDER_TYPE_MODAL } from '../../../MenuModule/Utils/MenuConstants';
import * as NavigationService from '../../../../CustomerApp/Navigation/NavigationService';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleGoBack } from '../../../../CustomerApp/Navigation/Helper';
import { debounce } from 'lodash';

let timeout;
class ItemNotAvailableModal extends Component {
    constructor(props) {
        super(props);
        this.handlePositiveButtonClicked = this.handlePositiveButtonClicked.bind(this);
        this.handleNegativeButtonClicked = this.handleNegativeButtonClicked.bind(this);
        this.handleItemNotAvailableRequestClose = this.handleItemNotAvailableRequestClose.bind(this);
        this.state = {
            isVisible: false,
            modalType: null
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (isValidElement(this.props.itemModal) && this.props.itemModal !== prevProps.itemModal) {
            timeout = setTimeout(() => {
                this.setState({ isVisible: isValidElement(this.props.itemModal), modalType: this.props.itemModal });
            }, 200);
        }
    }

    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }
    handleNegativeButtonClicked = debounce(
        () => {
            const { selectedOrderType, primaryAddress, deliveryAddress } = this.props;
            if (selectedOrderType === ORDER_TYPE.COLLECTION) {
                const delivery_Address = isValidElement(deliveryAddress)
                    ? deliveryAddress
                    : isValidElement(primaryAddress)
                    ? primaryAddress
                    : null;
                if (isValidElement(delivery_Address) && isValidElement(delivery_Address.postcode) && isValidElement(delivery_Address.id)) {
                    this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, deliveryAddress.postcode, delivery_Address.id);
                    this.props.selectDeliveryAddressAction(delivery_Address);
                }
                this.props.makeChangeAction(ORDER_TYPE.DELIVERY, true);
            } else {
                this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
                this.props.makeChangeAction(ORDER_TYPE.COLLECTION, true);
            }
            this.props.setOrderTypeLoader(false);
            this.props.resetNewBasketResponse();
            this.setState({ isVisible: false });
        },
        1500,
        { leading: true, trailing: false }
    );

    handlePositiveButtonClicked = debounce(
        () => {
            const { newBasket, comments, coupon, driverTips, selectedDriverTips, driverTipsList } = this.props;
            const { modalType } = this.state;
            const noItems = modalType === ORDER_TYPE_MODAL.ALL_ITEMS_MISSING;
            if (noItems) {
                let currentRoute = NavigationService.navigationRef.current.getCurrentRoute();
                if (isValidElement(currentRoute) && currentRoute.name === SCREEN_OPTIONS.BASKET.route_name) {
                    handleGoBack();
                }
                this.props.resetBasket();
            } else {
                this.props.updateBasketAction(BASKET_UPDATE_TYPE.NEW_BASKET, comments, coupon, newBasket);
                if (isValidElement(driverTips)) {
                    if (isValidElement(selectedDriverTips.item) && selectedDriverTips.item === LOCALIZATION_STRINGS.OTHER_TEXT) {
                        this.props.updateDriverTips(driverTips);
                    } else if (
                        isArrayNonEmpty(driverTipsList) &&
                        isValidElement(selectedDriverTips?.itemIndex) &&
                        selectedDriverTips.itemIndex < 4
                    ) {
                        let tipsValue = driverTipsList[selectedDriverTips.itemIndex];
                        this.props.updateDriverTips(tipsValue + '%');
                    }
                }
            }
            this.props.setOrderTypeLoader(false);
            this.setState({ isVisible: false });
        },
        1500,
        { leading: true, trailing: false }
    );
    handleItemNotAvailableRequestClose() {
        this.setState({ isVisible: false });
    }
    render() {
        const { modalType } = this.state;
        const noItems = modalType === ORDER_TYPE_MODAL.ALL_ITEMS_MISSING;
        if (!isValidElement(modalType)) return null;
        return (
            <T2SModal
                dialogCancelable={false}
                requestClose={this.handleItemNotAvailableRequestClose}
                isVisible={this.state.isVisible}
                description={
                    noItems
                        ? `${LOCALIZATION_STRINGS.NONE_OF_THE_ITEMS}${this.props.selectedOrderType}. ${LOCALIZATION_STRINGS.DO_YOU_WANT_TO_PROCEED}`
                        : `${LOCALIZATION_STRINGS.SOME_OF_THE_ITEMS}${this.props.selectedOrderType}. ${LOCALIZATION_STRINGS.DO_YOU_WANT_TO_PROCEED}`
                }
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                positiveButtonClicked={this.handlePositiveButtonClicked}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                negativeButtonClicked={this.handleNegativeButtonClicked}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    selectedOrderType: selectOrderType(state),
    itemModal: selectItemMissingModal(state),
    deliveryAddress: state.addressState.deliveryAddress,
    primaryAddress: selectPrimaryAddressSelector(state),
    newBasket: newBasketID(state),
    isFromReOrderScreen: selectIsFromReOrderScreen(state),
    comments: selectComment(state),
    coupon: selectCouponCode(state),
    driverTips: state.basketState.viewBasketResponse?.driver_tip?.value,
    selectedDriverTips: state.basketState.selectedDriverTips,
    driverTipsList: state.appState.s3ConfigResponse?.driver_tip
});

const mapDispatchToProps = {
    updateSelectedOrderType,
    selectDeliveryAddressAction,
    updateBasketAction,
    resetNewBasketResponse,
    resetBasket,
    setOrderTypeLoader,
    updateDriverTips,
    makeChangeAction
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemNotAvailableModal);
