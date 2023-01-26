import React, { Fragment } from 'react';

import { getTotalSavingStatus } from '../../../BaseModule/Utils/FeatureGateHelper';
import { isValidTotalSavings } from '../../Utils/OrderManagementHelper';
import { View } from 'react-native';
import { styles } from '../Styles/OrderHistoryScreenStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { getAppName, isCustomerApp, isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { selectCurrencySymbol } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';

const OrderHistoryTotalSavings = (props) => {
    const { totalSavingsResponse, currency } = props;
    return (
        <Fragment>
            {isNonCustomerApp() &&
                isValidElement(totalSavingsResponse) &&
                isValidElement(totalSavingsResponse.totalSavings) &&
                renderTotalSavingsForFoodhub(totalSavingsResponse.totalSavings, props)}
            {isCustomerApp() &&
                isValidElement(totalSavingsResponse) &&
                isValidElement(totalSavingsResponse.totalSavings) &&
                renderTotalSavings(totalSavingsResponse.totalSavings, currency)}
        </Fragment>
    );
};
const renderTotalSavings = (totalSavings, currency) => {
    if (isValidTotalSavings(totalSavings)) {
        return (
            <View style={styles.totalSavingsViewStyle}>
                <T2SText style={styles.totalSavingsTextStyle} screenName={SCREEN_NAME.ORDER_HISTORY} id={VIEW_ID.YOUR_TOTAL_SAVINGS_TEXT}>
                    {`${LOCALIZATION_STRINGS.YOUR_TOTAL_SAVINGS} `}
                </T2SText>
                <View style={styles.totalSavingsCurrencyViewStyle}>
                    <T2SText
                        style={styles.totalSavingsCurrencyTextStyle}
                        id={VIEW_ID.TOTAL_SAVINGS_VALUE_TEXT}
                        screenName={SCREEN_NAME.ORDER_HISTORY}>
                        {` ${currency} ${totalSavings}`}
                    </T2SText>
                </View>
            </View>
        );
    }
};
const renderTotalSavingsForFoodhub = (totalSavings, props) => {
    const { featureGateResponse, currency } = props;
    let modifiedTotalSavings = Math.round(parseFloat(totalSavings)).toString();
    if (getTotalSavingStatus(featureGateResponse) && isValidTotalSavings(totalSavings)) {
        return (
            <T2SView
                screenName={SCREEN_NAME.ORDER_HISTORY}
                id={VIEW_ID.YOUR_TOTAL_SAVINGS_VIEW}
                accessible={false}
                style={styles.totalSavingsFoodhubViewStyle}>
                <T2SText
                    style={styles.totalSavingsFoodhubTextStyle}
                    screenName={SCREEN_NAME.ORDER_HISTORY}
                    id={VIEW_ID.YOUR_TOTAL_SAVINGS_TEXT}>
                    {`${LOCALIZATION_STRINGS.YOUR_SAVINGS_THROUGH} ${getAppName()}`}
                </T2SText>
                <T2SView
                    id={VIEW_ID.TOTAL_SAVINGS_VALUE_TEXT_VIEW}
                    screenName={SCREEN_NAME.ORDER_HISTORY}
                    style={styles.totalSavingsCurrencyFoodhubViewStyle}>
                    <T2SText
                        style={styles.totalSavingsCurrencyTextStyle}
                        id={VIEW_ID.TOTAL_SAVINGS_VALUE_TEXT}
                        screenName={SCREEN_NAME.ORDER_HISTORY}>
                        {` ${currency} ${modifiedTotalSavings} `}
                    </T2SText>
                </T2SView>
            </T2SView>
        );
    }
};
const mapStateToProps = (state) => ({
    totalSavingsResponse: state.totalSavingsState.totalSavingsResponse,
    currency: selectCurrencySymbol(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse
});

export default connect(mapStateToProps, null)(OrderHistoryTotalSavings);
