import React, { Component } from 'react';
import { getDateStr, isValidElement } from 't2sbasemodule/Utils/helpers';
import { View } from 'react-native';
import Styles from './Styles/LoyaltyPointListItemStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, SCREEN_VIEW_ID } from '../../Utils/LoyaltyConstants';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { getOrderValuePointsTransactions } from '../../Utils/LoyaltyHelper';

class LoyaltyPointListItem extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.item !== this.props.item ||
            nextProps.backgroundViewColor !== this.props.backgroundViewColor ||
            nextProps.currency !== this.props.currency ||
            nextProps.loyaltyPoints !== this.props.loyaltyPoints ||
            nextProps.index !== this.props.index
        );
    }

    render() {
        const { item, backgroundViewColor, currency, loyaltyPoints, index } = this.props;
        return (
            isValidElement(item) && (
                <View style={[Styles.loyaltyListItemView, backgroundViewColor]} key={index}>
                    <View style={Styles.loyaltyListItem}>
                        <T2SText
                            numerOfLines={2}
                            style={[Styles.loyaltyListItemText, { alignSelf: 'center' }]}
                            id={SCREEN_VIEW_ID.ORDER_DATE_TEXT}
                            screenName={SCREEN_NAME.LOYALTY_SCREEN}>
                            {getDateStr(item.order_placed_on, DATE_FORMAT.DD_MMM_YYYY)}
                        </T2SText>
                    </View>
                    <View style={Styles.verticalDivider} />
                    <View style={Styles.loyaltyListItem}>
                        <T2SText
                            numerOfLines={2}
                            style={Styles.loyaltyListItemText}
                            id={SCREEN_VIEW_ID.ORDER_AMOUNT_TEXT}
                            screenName={SCREEN_NAME.LOYALTY_SCREEN}>
                            {getOrderValuePointsTransactions(item, currency, loyaltyPoints.category_info)}
                        </T2SText>
                    </View>
                    <View style={Styles.verticalDivider} />
                    <View style={Styles.loyaltyListItem}>
                        <T2SText
                            numerOfLines={2}
                            style={[Styles.loyaltyListItemText]}
                            screenName={SCREEN_NAME.LOYALTY_SCREEN}
                            id={SCREEN_VIEW_ID.POINTS_GAINED_TEXT}>
                            {item.points_gained}
                        </T2SText>
                    </View>
                </View>
            )
        );
    }
}

export default LoyaltyPointListItem;
