import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/HomeStyles';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
const screenName = SCREEN_NAME.HOME_SCREEN;
const RecentOrderHeaderComponent = ({ title, buttonText, onPress }) => {
    return (
        <T2SView style={styles.baseMarginViewStyle}>
            <T2SView style={styles.recentOrderRowStyle} screenName={screenName} id={VIEW_ID.RECENT_ORDER_TEXT_VIEW}>
                <T2SText style={styles.recentOrdersStyle} screenName={screenName} id={VIEW_ID.RECENT_ORDERS_TEXT}>
                    {title}
                </T2SText>
                <T2STouchableOpacity
                    screenName={screenName}
                    id={VIEW_ID.ORDER_HISTORY_VIEW_ALL}
                    style={styles.viewAllButtonStyle}
                    onPress={onPress}>
                    <T2SText screenName={screenName} id={VIEW_ID.VIEW_ALL} style={styles.viewAllTextStyle}>
                        {buttonText}
                    </T2SText>
                </T2STouchableOpacity>
            </T2SView>
        </T2SView>
    );
};

export default React.memo(RecentOrderHeaderComponent);
