import React, { PureComponent } from 'react';
import { View } from 'react-native';
import styles from '../Styles/TotalSummaryStyle';
import { getPriceSummary } from '../../Utils/BasketHelper';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SDivider from 't2sbasemodule/UI/CommonUI/T2SDivider';
import { selectCurrencyFromBasket } from 't2sbasemodule/Utils/AppSelectors';
import {
    selectAdminFee,
    selectBasketSubTotal,
    selectCarryBag,
    selectCollectionDiscount,
    selectCouponSummary,
    selectDeliveryCharge,
    selectOnlineDiscount,
    selectRedeemAmount,
    selectServiceCharge,
    selectSurcharge,
    selectTotal,
    selectVAT,
    selectDriverTipValue
} from '../../Redux/BasketSelectors';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { getSelectedPaymentTypeValue } from 'appmodules/QuickCheckoutModule/Utils/Helper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import TotalSummaryItemComponent from './MicroComoponent/TotalSummaryItemComponent';
import TotalValueComponent from './MicroComoponent/TotalValueComponent';
import { selectedDriverTipsItem, updateDriverTips } from '../../Redux/BasketAction';
class TotalSummary extends PureComponent {
    render() {
        return (
            <View style={styles.rootStyle}>
                {this.renderDiscountsAndTotal()}
                <T2SDivider style={styles.marginHorizontalStyle} />
                {this.renderTotal()}
            </View>
        );
    }
    renderDiscountsAndTotal() {
        let summaries = getPriceSummary(this.props);
        const { currency, screenName } = this.props;
        if (isValidElement(summaries) && summaries.length > 0 && isValidElement(currency)) {
            return (
                <T2SView style={styles.priceSummaryContainer}>
                    {summaries.map((item, index) => {
                        let subTotal = item.label === LOCALIZATION_STRINGS.SUB_TOTAL;
                        return (
                            <TotalSummaryItemComponent
                                screenName={screenName}
                                key={index.toString()}
                                label={item.label}
                                subTotal={subTotal}
                                type={item.type}
                                value={item.value}
                                driverTips={this.removeDriverTips}
                            />
                        );
                    })}
                </T2SView>
            );
        }
    }
    renderTotal() {
        const { total, currency, paymentType, showPaymentType, screenName } = this.props;
        if (isValidElement(total)) {
            return (
                <TotalValueComponent
                    screenName={screenName}
                    label={total.label}
                    showPaymentType={showPaymentType}
                    currency={currency}
                    paymentType={paymentType}
                    value={total.value}
                    selectedPaymentValue={showPaymentType && getSelectedPaymentTypeValue(paymentType, this.props)}
                />
            );
        }
    }

    removeDriverTips = () => {
        this.props.updateDriverTips(0.0);
        this.props.selectedDriverTipsItem(null, null);
    };
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromBasket(state),
    subTotal: selectBasketSubTotal(state),
    deliveryCharge: selectDeliveryCharge(state),
    serviceCharge: selectServiceCharge(state),
    vat: selectVAT(state),
    adminFee: selectAdminFee(state),
    onlineDiscount: selectOnlineDiscount(state),
    collectionDiscount: selectCollectionDiscount(state),
    couponSummary: selectCouponSummary(state),
    carryBag: selectCarryBag(state),
    redeemAmount: selectRedeemAmount(state),
    total: selectTotal(state),
    walletBalance: state.walletState.walletBalance,
    savedCardDetails: state.profileState.savedCardDetails,
    user_selected_card_id: state.basketState.user_selected_card_id,
    surcharge: selectSurcharge(state),
    driverTips: selectDriverTipValue(state)
});
const mapDispatchToProps = {
    updateDriverTips,
    selectedDriverTipsItem
};
export default connect(mapStateToProps, mapDispatchToProps)(TotalSummary);
