import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/HomeStyles';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { T2SIcon, T2SText } from 't2sbasemodule/UI';
import { Card } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';

const PlaceHolderListComponent = ({ stepNo, icon, title }) => {
    return (
        <Card accessible={false} style={styles.cardContainer}>
            <T2SView accessible={false} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.CARD_VIEW} style={styles.cardViewStyle}>
                <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.STEP_NO_TEXT + stepNo} style={styles.stepNoText}>
                    {stepNo}
                </T2SText>
                <T2SIcon
                    name={icon}
                    size={45}
                    screenName={SCREEN_NAME.HOME_SCREEN}
                    id={VIEW_ID.CARD_TITLE + icon}
                    color={Colors.carrotOrange}
                    style={styles.cardIcon}
                />
                <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.CARD_TITLE + title} style={styles.cardTitle}>
                    {title}
                </T2SText>
            </T2SView>
        </Card>
    );
};

export default React.memo(PlaceHolderListComponent);
