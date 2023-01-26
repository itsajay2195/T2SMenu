import React from 'react';
import { View } from 'react-native';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { defaultTouchArea, isValidElement } from 't2sbasemodule/Utils/helpers';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import MenuItemList from '../MenuItemList';
import {
    isPreOrderAvailableSelector,
    isTakeAwayOpenSelector,
    selectCurrencyFromStore,
    selectHasUserLoggedIn
} from 't2sbasemodule/Utils/AppSelectors';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import styles from '../Styles/MenuRecentOrderStyle';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { selectRecentOrdersOfParticularTakeaway } from '../../Redux/MenuSelector';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getReOrderAddOns } from '../../Utils/MenuHelpers';
import T2SDivider from 't2sbasemodule/UI/CommonUI/T2SDivider';

const screenName = SCREEN_OPTIONS.MENU_SCREEN.route_name;
const MenuRecentOrders = (props) => {
    const { recentOrders, currency, isFromReOrder, handleReOrder, isUserLoggedIn } = props;
    const reOrderDisable = !props.isPreOrderEnabled && !props.isTakeawayOpen ? true : props.disableReOrderButton;
    if (isUserLoggedIn && isValidElement(recentOrders) && recentOrders.length > 0) {
        return (
            <View style={styles.previousOrderView}>
                {recentOrders.map((item, index) => {
                    if (
                        isValidElement(item) &&
                        isValidElement(item.summary) &&
                        isValidElement(item.summary.items) &&
                        item.summary.items.length > 0
                    ) {
                        return (
                            <View key={item.id}>
                                {index === 0 && (
                                    <T2SText screenName={screenName} id={VIEW_ID.PREV_ORDER} style={styles.titleStyle}>
                                        {LOCALIZATION_STRINGS.PREVIOUS_ORDERS}
                                    </T2SText>
                                )}
                                <View style={styles.rowContainer}>
                                    <T2SText screenName={screenName} id={VIEW_ID.DATE_ID_DELIVERY} style={styles.dateStyle}>
                                        {getDeliveryDate(item.delivery_time)}
                                    </T2SText>
                                    <T2STouchableOpacity
                                        onPress={() => {
                                            if (!props.isPreOrderEnabled && !props.isTakeawayOpen) {
                                                showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW);
                                                return;
                                            }
                                            handleReOrder(item);
                                        }}
                                        id={VIEW_ID.RE_ORDER}
                                        screenName={screenName}
                                        hitSlop={defaultTouchArea()}
                                        disabled={reOrderDisable}>
                                        <View style={[styles.buttonStyle, { opacity: reOrderDisable ? 0.6 : 1.0 }]}>
                                            <T2SText
                                                screenName={screenName}
                                                id={VIEW_ID.RE_ORDER}
                                                style={[styles.buttonTextStyle, { opacity: reOrderDisable ? 0.6 : 1.0 }]}>
                                                {LOCALIZATION_STRINGS.RE_ORDER}
                                            </T2SText>
                                        </View>
                                    </T2STouchableOpacity>
                                </View>
                                {renderItemList(item.summary, currency, isFromReOrder, item.id)}
                                {index !== recentOrders.length - 1 && <T2SDivider style={{ marginHorizontal: 15 }} />}
                            </View>
                        );
                    }
                })}
            </View>
        );
    }
    return null;
};
const renderItemList = (summary, currency, isFromReOrder, orderId) => {
    const { items } = summary;
    return items.map((item) => renderItemData(item, currency, isFromReOrder, orderId));
};
const renderItemData = (item, currency, isFromReOrder, orderId) => {
    return (
        <MenuItemList
            isFromReOrder={isFromReOrder}
            orderId={orderId}
            name={item.name}
            offer={item.offer}
            secondLanguage={item.second_language_name}
            description={getReOrderAddOns(item)}
            price={item.price}
            screenName={screenName}
            currency={currency}
            item={item}
            isFromPreviousOrder={true}
            image={item.image}
            item_id={item.id}
            category_id={item.category_id}
            isFromReOrderItem={item.isFromReOrderItem}
            collectionType={item.collection}
            deliveryType={item.delivery}
        />
    );
};
const getDeliveryDate = (time) => {
    if (isValidElement(time)) {
        try {
            return moment(time).format(DATE_FORMAT.DD_MMM_YYYY);
        } catch (e) {
            return '';
        }
    }
    return '';
};

const mapStateToProps = (state) => ({
    recentOrders: selectRecentOrdersOfParticularTakeaway(state),
    isTakeawayOpen: isTakeAwayOpenSelector(state),
    isPreOrderEnabled: isPreOrderAvailableSelector(state),
    currency: selectCurrencyFromStore(state),
    isUserLoggedIn: selectHasUserLoggedIn(state),
    disableReOrderButton: state.orderManagementState.reOrderButtonStatus
});
//if its propscheck is true it will not render...
// if its propscheck  false it will render
function propCheck(prevProps, nextProps) {
    return (
        nextProps.isFromReOrder === prevProps.isFromReOrder &&
        nextProps.isUserLoggedIn === prevProps.isUserLoggedIn &&
        nextProps.recentOrders === prevProps.recentOrders &&
        nextProps.isTakeawayOpen === prevProps.isTakeawayOpen &&
        nextProps.disableReOrderButton === prevProps.disableReOrderButton
    );
}

export default connect(mapStateToProps, null)(React.memo(MenuRecentOrders, propCheck));
