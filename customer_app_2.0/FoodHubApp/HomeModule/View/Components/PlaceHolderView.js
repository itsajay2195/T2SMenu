import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import styles from '../../Styles/HomeStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import PlaceHolderListComponent from '../MicroComponents/PlaceHolderListComponent';
const screenName = SCREEN_NAME.HOME_SCREEN;

function renderCardSteps(id, stepNo, icon, title) {
    return <PlaceHolderListComponent stepNo={stepNo} icon={icon} title={title} />;
}
const PlaceHolderView = () => {
    return (
        <T2SView screenName={screenName} id={VIEW_ID.ENJOY_FOOD_VIEW} style={styles.enjoyFoodView}>
            <T2SText screenName={screenName} id={VIEW_ID.ENJOY_FOOD_TEXT} style={styles.enjoyFoodTextStyle}>
                {LOCALIZATION_STRINGS.ENJOY_FOOD_TEXT}
            </T2SText>
            <T2SView screenName={screenName} id={VIEW_ID.RENDER_CARDS} style={styles.row}>
                {renderCardSteps(VIEW_ID.LOCATE, LOCALIZATION_STRINGS.STEP1, FONT_ICON.LOCATE, LOCALIZATION_STRINGS.LOCATE)}
                {renderCardSteps(VIEW_ID.SELECT, LOCALIZATION_STRINGS.STEP2, FONT_ICON.SELECT, LOCALIZATION_STRINGS.SELECT)}
                {renderCardSteps(VIEW_ID.PAY, LOCALIZATION_STRINGS.STEP3, FONT_ICON.PAY, LOCALIZATION_STRINGS.PAY)}
                {renderCardSteps(VIEW_ID.RELISH, LOCALIZATION_STRINGS.STEP4, FONT_ICON.RELISH, LOCALIZATION_STRINGS.RELISH)}
            </T2SView>
        </T2SView>
    );
};

function propCheck(prevProps, nextProps) {
    return prevProps.language === nextProps.language;
}

export default React.memo(PlaceHolderView, propCheck);
