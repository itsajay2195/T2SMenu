import React, { PureComponent } from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/BasketScreenStyles';
import { SizedBox, T2SFlatButton } from 't2sbasemodule/UI';
import { BASKET_UPDATE_TYPE, SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import { validAlphaNumericRegex } from 't2sbasemodule/Utils/ValidationUtil';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { convertMessageToAppLanguage, showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import {
    applyRedeemAction,
    isRedeemAppliedStatus,
    lookupCouponAction,
    removeCoupon,
    resetErrorResponseForCoupon,
    updateBasketAction
} from '../../Redux/BasketAction';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { selectLoyaltyPointMessage, selectLoyaltyPoints } from '../../Redux/BasketSelectors';
import { selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import CouponTextFieldComponent from './MicroComoponent/CouponTextFieldComponent';
import RedeemPointsComponent from './MicroComoponent/RedeemPointsComponent';
import { isAdvancedDiscount, logCouponStatus } from '../../Utils/BasketHelper';

let screenName = SCREEN_NAME.BASKET_SCREEN;
class CouponRowContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.handleApplyCoupon = this.handleApplyCoupon.bind(this);
        this.hideRemoveCouponModal = this.hideRemoveCouponModal.bind(this);
        this.removeCoupon = this.removeCoupon.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.redeemPointsClicked = this.redeemPointsClicked.bind(this);
        this.handleClickedApplyCoupon = this.handleClickedApplyCoupon.bind(this);
        this.handleOnchangeText = this.handleOnchangeText.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleRef = this.handleRef.bind(this);
        this.couponRef = null;
        this.state = {
            coupon: '',
            showCouponRemoveModal: false,
            redeem: isValidElement(this.props.redeemAmount) || this.props.isRedeemApplied
        };
    }

    componentDidMount() {
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            this.setState({ hideErrorAndWarningView: true });
            if (isValidElement(this.props.lookupCouponErrorResponse)) {
                this.props.resetErrorResponseForCoupon();
                this.setState({ coupon: '' });
            }
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        if (isValidElement(this.props.couponApplied)) {
            this.setState({ coupon: this.props.couponApplied });
        }
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidHide() {
        if (isValidElement(this.couponRef)) {
            this.couponRef.blur();
        }
    }
    handleClickedApplyCoupon() {
        Keyboard.dismiss();
        this.handleApplyCoupon(this.state.coupon);
    }
    handleOnchangeText(text) {
        this.setState({ coupon: validAlphaNumericRegex(text) });
        this.props.resetErrorResponseForCoupon();
    }
    handleOnFocus() {
        this.setState({ isKeyBoardShown: true });
        this.props.onFocus();
    }
    handleOnBlur() {
        this.setState({ isKeyBoardShown: false });
    }
    handleRef(ref) {
        this.couponRef = ref;
    }

    render() {
        const { couponApplied, lookupCouponErrorResponse, onLayout } = this.props;
        return (
            <View onLayout={onLayout}>
                {this.renderRedeemPoints()}
                {!this.state.redeem && (
                    <>
                        <SizedBox style={styles.sizedBoxStyle} height={5} />
                        <T2SView style={styles.couponRowContainer} accessible={false}>
                            <CouponTextFieldComponent
                                coupon={this.state.coupon}
                                redeem={this.state.redeem}
                                handleOnFocus={this.handleOnFocus}
                                handleOnBlur={this.handleOnBlur}
                                couponRef={this.handleRef}
                                screenName={screenName}
                                couponApplied={couponApplied}
                                lookupCouponErrorResponse={lookupCouponErrorResponse}
                                errorText={
                                    isValidElement(lookupCouponErrorResponse)
                                        ? convertMessageToAppLanguage(lookupCouponErrorResponse, this.props.languageKey)
                                        : ''
                                }
                                handleApplyCoupon={this.handleApplyCoupon.bind(this, this.state.coupon, true)}
                                handleOnchangeText={this.handleOnchangeText}
                            />
                            <T2STouchableOpacity
                                screenName={screenName}
                                id={VIEW_ID.APPLY_BUTTON}
                                onPress={this.handleClickedApplyCoupon}
                                disabled={this.state.redeem}
                                style={isValidElement(lookupCouponErrorResponse) ? styles.couponErrorContainer : styles.couponContainer}
                                accessible={false}>
                                <T2SFlatButton
                                    disabled={this.state.redeem}
                                    compact={true}
                                    buttonStyle={styles.couponButtonStyle}
                                    buttonTextStyle={
                                        isValidElement(couponApplied) || isValidElement(lookupCouponErrorResponse)
                                            ? styles.couponRemoveStyle
                                            : styles.couponApplyStyle
                                    }
                                    contentStyle={styles.contentButtonStyle}
                                    onPress={this.handleClickedApplyCoupon}
                                    id={VIEW_ID.APPLY_BUTTON}
                                    title={
                                        isValidElement(couponApplied) || isValidElement(lookupCouponErrorResponse)
                                            ? LOCALIZATION_STRINGS.REMOVE
                                            : LOCALIZATION_STRINGS.APPLY
                                    }
                                    screenName={SCREEN_NAME.BASKET_SCREEN}
                                    uppercase={false}
                                    accessible={false}
                                />
                            </T2STouchableOpacity>
                            {this.renderRemoveCouponModel()}
                        </T2SView>
                    </>
                )}
            </View>
        );
    }
    renderRemoveCouponModel() {
        return (
            <T2SModal
                id={VIEW_ID.REMOVE_COUPON_MODAL}
                screenName={screenName}
                dialogCancelable={true}
                title={LOCALIZATION_STRINGS.CONFIRM_OTP_CONFIRM}
                description={LOCALIZATION_STRINGS.REMOVE_COUPON_CONFIRM_MSG}
                isVisible={this.state.showCouponRemoveModal}
                negativeButtonId={''}
                positiveButtonId={''}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                requestClose={this.hideRemoveCouponModal}
                positiveButtonClicked={this.removeCoupon}
                negativeButtonClicked={this.hideRemoveCouponModal}
            />
        );
    }
    hideRemoveCouponModal() {
        this.setState({ showCouponRemoveModal: false });
    }
    handleApplyCoupon(coupon, noValidationMsg = false) {
        const { storeConfigId, storeConfigDiscountType } = this.props;
        if (isValidElement(this.props.couponApplied)) {
            this.setState({ showCouponRemoveModal: true });
        } else if (isValidElement(this.props.lookupCouponErrorResponse)) {
            this.props.resetErrorResponseForCoupon();
            this.setState({ coupon: '' });
            this.logRemoveCouponEvent(coupon);
        } else if (isValidString(this.state.coupon)) {
            let couponCode = coupon.toUpperCase();
            this.setState({ coupon: couponCode });
            this.props.lookupCouponAction(couponCode, storeConfigId, isAdvancedDiscount(storeConfigDiscountType));
            Analytics.logEvent(ANALYTICS_SCREENS.BASKET_SCREEN, ANALYTICS_EVENTS.COUPON_APPLIED);
        } else if (!noValidationMsg) {
            showErrorMessage(LOCALIZATION_STRINGS.ENTER_VALID_COUPON);
        }
    }

    logRemoveCouponEvent(coupon) {
        const { countryBaseFeatureGateResponse, storeConfigId, basketData } = this.props;
        logCouponStatus(countryBaseFeatureGateResponse, SEGMENT_EVENTS.COUPON_REMOVED, {
            coupon: coupon,
            storeId: storeConfigId,
            coupon_value: basketData?.coupon?.value ?? '',
            coupon_label: basketData?.coupon?.label ?? ''
        });
    }
    removeCoupon() {
        this.props.updateBasketAction(BASKET_UPDATE_TYPE.COUPON, null, '');
        this.logRemoveCouponEvent(this.state.coupon);
        this.setState({ coupon: '' });
        this.props.removeCoupon();
        this.hideRemoveCouponModal();
    }
    redeemPointsClicked() {
        if (this.state.coupon.length > 0) {
            showErrorMessage(LOCALIZATION_STRINGS.COUPON_APPLIED_POINTS_CANNOT_REDEEMED);
        } else {
            const redeem = !this.state.redeem;
            this.setState({ redeem: redeem });
            this.props.applyRedeemAction(redeem);
            this.props.isRedeemAppliedStatus(redeem);
        }
    }
    renderRedeemPoints() {
        const { redeemPoints, redeemPointsMessage, isRedeemApplied } = this.props;
        if (isValidElement(redeemPoints) && redeemPoints > 0) {
            return (
                <RedeemPointsComponent
                    isRedeemApplied={isRedeemApplied}
                    redeemPointsMessage={redeemPointsMessage}
                    screenName={screenName}
                    redeemPointsClicked={this.redeemPointsClicked}
                />
            );
        }
    }
}

const mapStateToProps = (state) => ({
    couponApplied: state.basketState.couponApplied,
    lookupCouponErrorResponse: state.basketState.lookupCouponErrorResponse,
    redeemPoints: selectLoyaltyPoints(state),
    redeemPointsMessage: selectLoyaltyPointMessage(state),
    isRedeemApplied: state.basketState.isRedeemApplied,
    languageKey: selectLanguageKey(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    storeConfigId: state.appState.storeConfigResponse?.id,
    storeConfigDiscountType: state.appState.storeConfigResponse?.discount_type,
    basketData: state.basketState.viewBasketResponse
});

const mapDispatchToProps = {
    lookupCouponAction,
    updateBasketAction,
    removeCoupon,
    resetErrorResponseForCoupon,
    applyRedeemAction,
    isRedeemAppliedStatus
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponRowContainer);
