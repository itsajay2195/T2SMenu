import React from 'react';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import styles from '../../Styles/HomeStyles';

const RecentTakeawayHeaderComponent = ({ title }) => {
    return (
        <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RECENT_TAKEAWAY_TITLE_TEXT} style={styles.recentTakeawayText}>
            {title}
        </T2SText>
    );
};

export default React.memo(RecentTakeawayHeaderComponent);
