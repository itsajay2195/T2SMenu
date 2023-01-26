import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from './Styles/NotificationListItemStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/NotificationListConstants';
import { getDateString } from 't2sbasemodule/Utils/DateUtil';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';

class NotificationListItem extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.title !== this.props.title ||
            nextProps.message !== this.props.message ||
            nextProps.created_at !== this.props.created_at
        );
    }
    render() {
        const { title, message, created_at } = this.props;
        const createdDateStr = getDateString(created_at);
        return (
            <T2STouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    //  this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
                    handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                }}>
                <View style={styles.rowBackGroundViewContainer}>
                    <View style={styles.rowTitleContentView}>
                        <T2SText style={styles.rowTitleText} id={VIEW_ID.LIST_ITEM_TITLE} screenName={SCREEN_NAME.NOTIFICATION_LIST}>
                            {title}
                        </T2SText>
                        <T2SText style={styles.description} id={VIEW_ID.LIST_ITEM_DESCRIPTION} screenName={SCREEN_NAME.NOTIFICATION_LIST}>
                            {message}
                        </T2SText>
                    </View>
                    <View style={styles.dateContentView}>
                        <T2SText style={styles.dateText} id={VIEW_ID.LIST_ITEM_DATE} screenName={SCREEN_NAME.NOTIFICATION_LIST}>
                            {createdDateStr}
                        </T2SText>
                    </View>
                </View>
            </T2STouchableOpacity>
        );
    }
}

export default NotificationListItem;
