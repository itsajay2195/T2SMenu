import React, { useCallback } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import styles from '../Styles/ViewCartButtonStyle';
import Colors from 't2sbasemodule/Themes/Colors';
import {
    selectBasketID,
    selectBasketProgress,
    selectCartItems,
    selectCartItemsQuantity,
    selectIsBasketLoading,
    selectTotal
} from '../../Redux/BasketSelectors';
import { isCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import {
    isBasketTakeAwayOpenSelector,
    isPreOrderAvailableSelector,
    isPreOrderEnabledSelector,
    isTakeAwayOpenSelector,
    selectCurrencyFromBasket,
    selectHasUserLoggedIn
} from 't2sbasemodule/Utils/AppSelectors';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { redirectRouteAction } from '../../../../CustomerApp/Redux/Actions';
import { VIEW_ID } from '../../Utils/BasketConstants';
import RepeatAddOnContainer from '../../../MenuModule/View/Components/RepeatAddOnContainer';
import { repeatAddOnAction, updateCartOnFocusAction } from '../../Redux/BasketAction';
import AddOnsItemPopup from '../../../MenuModule/View/Components/AddOnsItemPopup';
import { NO } from '../../../MenuModule/Utils/MenuConstants';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import { debounce } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isNotSameStore, skipStoreOpenStatus } from '../../Utils/BasketHelper';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import CartButton from './MicroComoponent/BasketCartButton';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

const screenWidth = Dimensions.get('window').width;

const ViewCartButton = (props) => {
    const insets = useSafeAreaInsets();

    const {
        cartItems,
        currency,
        total,
        screenName,
        totalItems,
        buttonType,
        fromHome,
        hasBasketID,
        fromTakeawayList,
        basketStoreID,
        storeConfigId,
        isBasketTakeawayOpen,
        isTakeawayOpen,
        isBasketTakeawayEnabledForPreOrder,
        isPreOrderEnabled,
        handleBasketNavigation,
        isUserLoggedIn,
        routes,
        redirectRouteAction,
        countryBaseFeatureGateResponse
    } = props;
    const navigation = useNavigation();
    const handleDebounce = useCallback(() => {
        handleDebounceClickAction(
            navigation,
            fromTakeawayList,
            basketStoreID,
            storeConfigId,
            isBasketTakeawayOpen,
            isTakeawayOpen,
            isBasketTakeawayEnabledForPreOrder,
            isPreOrderEnabled,
            handleBasketNavigation,
            buttonType,
            isUserLoggedIn,
            routes,
            redirectRouteAction,
            countryBaseFeatureGateResponse
        );
    }, [
        navigation,
        fromTakeawayList,
        basketStoreID,
        storeConfigId,
        isBasketTakeawayOpen,
        isTakeawayOpen,
        isBasketTakeawayEnabledForPreOrder,
        isPreOrderEnabled,
        handleBasketNavigation,
        buttonType,
        isUserLoggedIn,
        routes,
        redirectRouteAction,
        countryBaseFeatureGateResponse
    ]);
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            props.updateCartOnFocusAction();
        });

        return unsubscribe;
    }, [props, navigation]);
    return (
        <View>
            <RepeatAddOnContainer fromHome={fromHome} />
            {!(screenName === SCREEN_OPTIONS.MENU_SCREEN.screen_title && isNotSameStore(basketStoreID, storeConfigId)) &&
                isValidElement(cartItems) &&
                cartItems.length > 0 && (
                    <View>
                        <AddOnsItemPopup />
                        {screenName === SCREEN_OPTIONS.MENU_SCREEN.screen_title && (
                            <View style={[styles.bottomBarContainer, { width: screenWidth }]}>
                                <View style={styles.bottomBarStyle}>
                                    <View style={styles.bottomBarSideStyle} />
                                    <T2SImage
                                        style={styles.imageStyle}
                                        screenName={screenName}
                                        id={VIEW_ID.BOTTOM_IMAGE}
                                        source={require('../../../../FoodHubApp/Images/BottomBarCurve.png')}
                                    />
                                    <View style={styles.bottomBarSideStyle} />
                                </View>
                            </View>
                        )}
                        <View
                            style={[
                                styles.container,
                                {
                                    marginBottom:
                                        Platform.OS === 'ios' && screenName !== SCREEN_OPTIONS.MENU_SCREEN.screen_title
                                            ? -insets.bottom
                                            : 0,
                                    backgroundColor: screenName !== SCREEN_OPTIONS.MENU_SCREEN.screen_title && Colors.bottomBar
                                }
                            ]}>
                            <View>
                                {isValidElement(totalItems) && (
                                    <T2SText style={styles.itemTextStyle} screenName={screenName} id={VIEW_ID.TOTAL_ITEM}>
                                        {totalItems} {totalItems === 1 ? LOCALIZATION_STRINGS.ITEM : LOCALIZATION_STRINGS.ITEMS}
                                    </T2SText>
                                )}
                                {isValidElement(total) ? (
                                    <T2SText style={styles.totalTextStyle} screenName={screenName} id={VIEW_ID.TOTAL_PRICE}>
                                        {currency}
                                        {total.value}
                                    </T2SText>
                                ) : (
                                    <T2SText style={styles.totalTextStyle} screenName={screenName} id={VIEW_ID.TOTAL_PRICE} />
                                )}
                            </View>
                            <CartButton
                                screenName={screenName}
                                buttonType={buttonType}
                                onPress={isValidElement(hasBasketID) && handleDebounce}
                            />
                        </View>
                    </View>
                )}
        </View>
    );
};

function handleClickAction(
    navigation,
    fromTakeawayList,
    basketStoreID,
    storeConfigId,
    isBasketTakeawayOpen,
    isTakeawayOpen,
    isBasketTakeawayEnabledForPreOrder,
    isPreOrderEnabled,
    handleBasketNavigation,
    buttonType,
    isUserLoggedIn,
    routes,
    redirectRouteAction,
    countryBaseFeatureGateResponse
) {
    Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.BASKET);
    if (!buttonType) {
        if (isUserLoggedIn) {
            if (
                (isCustomerApp() && !isValidElement(storeConfigId)) ||
                skipStoreOpenStatus(countryBaseFeatureGateResponse) ||
                checkIsTakeawayOpen(basketStoreID, storeConfigId, isBasketTakeawayOpen, isTakeawayOpen) ||
                checkIsPreOrderEnabled(basketStoreID, storeConfigId, isBasketTakeawayEnabledForPreOrder, isPreOrderEnabled)
            ) {
                if (isValidElement(handleBasketNavigation)) {
                    navigation.dispatch((state) => {
                        if (isValidElement(state.routes) && state.routes.length > 0) {
                            let routes = state.routes;
                            routes.push({
                                name: SCREEN_OPTIONS.MENU_SCREEN.route_name,
                                params: {
                                    isFromReOrder: false,
                                    isFromCartIcon: true
                                }
                            });
                            routes.push({
                                name: SCREEN_OPTIONS.BASKET.route_name,
                                params: { isFromReOrder: false }
                            });
                            return CommonActions.reset({
                                ...state,
                                routes,
                                index: routes.length - 1
                            });
                        }
                    });
                } else {
                    navigation.navigate(SCREEN_OPTIONS.BASKET.route_name);
                }
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW);
            }
        } else {
            redirectRouteAction(SCREEN_OPTIONS.BASKET.route_name);
            if (fromTakeawayList) {
                navigation.navigate(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name, {
                    screen: SCREEN_OPTIONS.SOCIAL_LOGIN.route_name,
                    params: {
                        redirectRoute: routes,
                        redirectNavigation: navigation,
                        fromTakeawayList: fromTakeawayList
                    }
                });
            } else {
                navigation.navigate(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
            }
        }
    } else {
        navigation.navigate(SCREEN_OPTIONS.MENU_SCREEN.route_name, { keyboardFocus: NO });
    }
}

function checkIsTakeawayOpen(basketStoreID, storeConfigId, isBasketTakeawayOpen, isTakeawayOpen) {
    if (isNotSameStore(basketStoreID, storeConfigId)) {
        return isBasketTakeawayOpen;
    } else {
        return isTakeawayOpen;
    }
}

function checkIsPreOrderEnabled(basketStoreID, storeConfigId, isBasketTakeawayEnabledForPreOrder, isPreOrderEnabled) {
    if (isNotSameStore(basketStoreID, storeConfigId)) {
        return isBasketTakeawayEnabledForPreOrder;
    } else {
        return isPreOrderEnabled;
    }
}

const handleDebounceClickAction = debounce(handleClickAction, 1000, {
    leading: true,
    trailing: false
});
const mapStateToProps = (state) => ({
    cartItems: selectCartItems(state),
    totalItems: selectCartItemsQuantity(state),
    currency: selectCurrencyFromBasket(state),
    total: selectTotal(state),
    isUserLoggedIn: selectHasUserLoggedIn(state),
    isTakeawayOpen: isTakeAwayOpenSelector(state),
    storeConfigId: state.appState.storeConfigResponse?.id,
    isPreOrderEnabled: isPreOrderAvailableSelector(state),
    basketCreationProgress: selectBasketProgress(state),
    hasBasketID: selectBasketID(state),
    isBasketLoading: selectIsBasketLoading(state),
    basketStoreID: state.basketState.storeID,
    isBasketTakeawayOpen: isBasketTakeAwayOpenSelector(state),
    isBasketTakeawayEnabledForPreOrder: isPreOrderEnabledSelector(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse
});

const mapDispatchToProps = {
    redirectRouteAction,
    repeatAddOnAction,
    updateCartOnFocusAction
};
ViewCartButton.defaultProps = {
    buttonType: false,
    fromHome: false
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewCartButton);
