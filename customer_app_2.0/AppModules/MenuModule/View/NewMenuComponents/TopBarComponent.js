import { TextInput } from 'react-native';
import React from 'react';
import T2SIcon from '../../../../T2SBaseModule/UI/CommonUI/T2SIcon';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from '../../../../AppModules/BasketModule/Utils/BasketConstants';
// import Styles from '../Styles/MenuStyle';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import OrderTypeAction from '../../../HomeModule/View/components/OrderTypeAction';
import { handleGoBack } from '../../../../CustomerApp/Navigation/Helper';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { isValidElement, isCustomerApp } from 't2sbasemodule/Utils/helpers';
import { selectAddOnModalVisibility } from '../../../BasketModule/Redux/BasketSelectors';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { connect } from 'react-redux';
import { selectCollectionStatus, selectDeliveryStatus } from '../../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { skipStoreOpenStatus } from '../../../BasketModule/Utils/BasketHelper';
import { isTakeawayOpen } from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { isPreOrderEnabled } from 'appmodules/QuickCheckoutModule/Utils/Helper';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { repeatAddOnAction } from '../../../BasketModule/Redux/BasketAction';
import { showHideOrderTypeAction } from '../../../OrderManagementModule/Redux/OrderManagementAction';
import { selectOrderType } from '../../../OrderManagementModule/Redux/OrderManagementSelectors';
import Colors from 't2sbasemodule/Themes/Colors';
import { TopBarSkeletonLoader } from '../../../MenuModule/Utils/MenuSkeletonLoader';
import { TopBarComponentStyle } from '../Styles/NewMenuStyle';

let screenName = SCREEN_OPTIONS.MENU_SCREEN.screen_title;
let onOrderTypeActionPressedProps;

const onOrderTypeActionPressed = () => {
    const {
        isVisible,
        storeConfigShowCollection,
        storeConfigShowDelivery,
        storeStatusDelivery,
        storeStatusCollection,
        storeConfigPreOrder,
        countryBaseFeatureGateResponse,
        storeConfigId,
        handleOrderTypePress
    } = onOrderTypeActionPressedProps;
    Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.ORDER_TYPE);
    if (isValidElement(isVisible) && isVisible === true) {
        repeatAddOnAction(false);
    }
    if (
        (isCustomerApp() && !isValidElement(storeConfigId)) ||
        skipStoreOpenStatus(countryBaseFeatureGateResponse) ||
        isTakeawayOpen(storeConfigShowDelivery, storeStatusDelivery, storeConfigShowCollection, storeStatusCollection) ||
        isPreOrderEnabled(storeConfigPreOrder)
    ) {
        handleOrderTypePress(true);
    } else {
        showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_MESSAGE);
    }
};

const MenuSearchBar = ({ handleSearch, searchValue, clearSearch, placeholderText }) => {
    return (
        <T2SView style={TopBarComponentStyle.searchHeaderContainer}>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={searchValue}
                onChangeText={handleSearch}
                placeholder={placeholderText}
                style={TopBarComponentStyle.textInputStyle}
            />
            {searchValue.length > 0 ? (
                <T2STouchableOpacity onPress={clearSearch}>
                    <T2SIcon
                        icon={FONT_ICON.WRONG}
                        color={Colors.suvaGrey}
                        // style={styles.rightIconStyle}
                        size={20}
                        id={VIEW_ID.CLOSED_ICON}
                        screenName={screenName}
                    />
                </T2STouchableOpacity>
            ) : null}
        </T2SView>
    );
};

const TopBarComponent = ({ searchTextInput, setSearchTextInput, clearSearch, placeholderText, ...props }) => {
    const {
        isMenuLoading,
        isVisible,
        storeConfigShowCollection,
        storeConfigShowDelivery,
        storeStatusDelivery,
        storeStatusCollection,
        storeConfigPreOrder,
        countryBaseFeatureGateResponse,
        storeConfigId,
        selectedOrderType,
        showHideOrderTypeAction: handleOrderTypePress
    } = props;

    onOrderTypeActionPressedProps = {
        isVisible,
        storeConfigShowCollection,
        storeConfigShowDelivery,
        storeStatusDelivery,
        storeStatusCollection,
        storeConfigPreOrder,
        countryBaseFeatureGateResponse,
        storeConfigId,
        handleOrderTypePress
    };

    return (
        <>
            {isMenuLoading ? (
                <TopBarSkeletonLoader />
            ) : (
                <T2SView style={TopBarComponentStyle.container}>
                    <T2STouchableOpacity style={TopBarComponentStyle.iconWrapper} onPress={handleGoBack}>
                        <T2SIcon id={VIEW_ID.BACK_ARROW} size={24} name={FONT_ICON.BACK} />
                    </T2STouchableOpacity>
                    <T2SView style={TopBarComponentStyle.searchBarWrapper}>
                        <MenuSearchBar
                            handleSearch={setSearchTextInput}
                            searchValue={searchTextInput}
                            clearSearch={clearSearch}
                            placeholderText={placeholderText}
                        />
                    </T2SView>
                    <T2SView style={TopBarComponentStyle.orderTypeWrapper}>
                        <OrderTypeAction
                            isFull={true}
                            isTransparent={true}
                            key={VIEW_ID.COLLECTION_DELIVERY_ICON}
                            orderType={selectedOrderType}
                            onPress={onOrderTypeActionPressed}
                            screenName={screenName}
                            // showSearchFilter={true}
                            // handleSearchIconClickAction={handleSearchIconClickAction}
                        />
                    </T2SView>
                </T2SView>
            )}
            {/* {showSearch ? <MenuSearchBar handleSearch={setSearchTextInput} searchValue={searchTextInput} /> : null} */}
        </>
    );
};

const mapStateToProps = (state) => ({
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    isVisible: selectAddOnModalVisibility(state),
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeStatusDelivery: selectDeliveryStatus(state),
    storeStatusCollection: selectCollectionStatus(state),
    storeConfigPreOrder: state.appState.storeConfigResponse?.preorder,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    storeConfigId: state.appState.storeConfigResponse?.id,
    selectedOrderType: selectOrderType(state)
});

const mapDispatchToProps = {
    showHideOrderTypeAction
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBarComponent);
