import React, { useCallback } from 'react';
import { View } from 'react-native';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { VIEW_ID } from '../../Utils/HomeConstants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/HomeStyles';
import TakeawayBackgroundImage from 't2sbasemodule/UI/CustomUI/TakeawayBackgroundImage';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getTakeawayName } from 't2sbasemodule/Utils/helpers';
import { getRecentOrderedDate } from '../../Utils/Helper';
import { ORDER_STATUS, ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getCurrencyFromBasketResponse } from 'appmodules/BaseModule/GlobalAppHelper';
import SizedBox from 't2sbasemodule/UI/CustomUI/SizedBox';
import OrderStatusComponent from './OrderStatusComponent';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

const RecentOrderListComponent = ({
    screenName,
    name,
    id,
    order_placed_on,
    timeZone,
    sending,
    isSpanish,
    currencyId,
    currency,
    total,
    reorderText,
    onReOrderClicked,
    imageURL,
    sendingText,
    status,
    summaryItems
}) => {
    const handleOnPress = useCallback(() => {
        onReOrderClicked(id);
    }, [id, onReOrderClicked]);

    const getTakeAwayName = getTakeawayName(name);
    const getRecentOrderDate = getRecentOrderedDate(order_placed_on, timeZone);

    return (
        <T2STouchableOpacity
            accessible={false}
            screenName={screenName}
            id={VIEW_ID.ORDER_STATUS_CONTAINER + '_' + getTakeAwayName}
            onPress={handleOnPress}>
            <T2SView style={styles.baseMarginViewStyle} screenName={screenName} id={VIEW_ID.ORDER_STATUS_VIEW}>
                <View
                    style={styles.recentReOrderContainerStyle}
                    {...setTestId(screenName, VIEW_ID.ORDER_STATUS_VIEW + '_' + getTakeAwayName)}>
                    <View style={styles.recentReOrderMainRowViewStyle}>
                        <View style={styles.takeawayImageBorderStyle}>
                            <TakeawayBackgroundImage
                                id={VIEW_ID.ORDER_STATUS_IMAGE + '-' + imageURL}
                                source={{ uri: imageURL }}
                                screenName={screenName}
                                style={styles.takeawayImageStyle}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.reOrderContentViewStyle}>
                            <View style={styles.takeAwayNameAndTimerStyle}>
                                <T2SText
                                    style={styles.takeawayNameTextStyle}
                                    screenName={screenName}
                                    id={VIEW_ID.ORDER_STORE_NAME + '-' + getTakeAwayName}>
                                    {getTakeAwayName}
                                </T2SText>
                                <T2SText
                                    style={styles.dayTextStyle}
                                    screenName={screenName}
                                    id={VIEW_ID.ORDER_PLACED_DATE + '-' + getRecentOrderDate}>
                                    {getRecentOrderDate}
                                </T2SText>
                            </View>
                            <T2SText
                                style={styles.summaryItemTextStyle}
                                numberOfLines={2}
                                screenName={screenName}
                                id={VIEW_ID.ORDER_SUMMARY_ITEMS + '-' + summaryItems}>
                                {summaryItems}
                            </T2SText>
                            {status === ORDER_STATUS.CANCEL_ORDER && (
                                <OrderStatusComponent screenName={screenName} text={LOCALIZATION_STRINGS.CANCELLED} />
                            )}
                            <View style={styles.reOrderBottomViewStyle}>
                                <View style={[styles.orderTypeViewStyle, { marginBottom: isSpanish ? 2 : 6 }]}>
                                    {sending === ORDER_TYPE.DELIVERY || sending === 'to' ? (
                                        <T2SIcon
                                            name={FONT_ICON.DELIVERY}
                                            color={Colors.secondary_color}
                                            style={styles.deliveryViewStyle}
                                            screenName={screenName}
                                            size={22}
                                            id={VIEW_ID.DELIVERY}
                                        />
                                    ) : (
                                        <T2SIcon
                                            name={FONT_ICON.COLLECTION}
                                            screenName={screenName}
                                            id={VIEW_ID.COLLECTION}
                                            style={styles.deliveryViewStyle}
                                            size={22}
                                            color={Colors.secondary_color}
                                        />
                                    )}
                                    <T2SText
                                        style={isSpanish ? styles.orderTypeSpanishTextStyle : styles.orderTypeTextStyle}
                                        screenName={screenName}
                                        id={VIEW_ID.ORDER_TYPE + '_' + sendingText}>
                                        {sendingText}
                                    </T2SText>
                                </View>
                                <View style={styles.orderTypeReOrderViewStyle}>
                                    <T2SText
                                        id={VIEW_ID.REORDER_TOTAL_TEXT + '_' + total}
                                        screenName={screenName}
                                        style={styles.reOrderItemTotalTextStyle}>
                                        {getCurrencyFromBasketResponse(currencyId, currency)}
                                        {total}
                                    </T2SText>
                                    <T2SView style={styles.reOrderViewStyle} screenName={screenName} id={VIEW_ID.REORDER_CLICKABLE_VIEW}>
                                        <T2SText
                                            screenName={screenName}
                                            id={VIEW_ID.REORDER_TOTAL + '_' + reorderText}
                                            style={styles.reOrderTextStyle}>
                                            {reorderText}{' '}
                                        </T2SText>
                                    </T2SView>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </T2SView>
            <SizedBox height={5} style={{ backgroundColor: Colors.dividerGrey }} />
        </T2STouchableOpacity>
    );
};

export default React.memo(RecentOrderListComponent);
