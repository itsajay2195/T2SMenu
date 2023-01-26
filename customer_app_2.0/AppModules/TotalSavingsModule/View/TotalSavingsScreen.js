import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import BaseComponent from '../../BaseModule/BaseComponent';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { getFoodHubTotalSavingsAction } from '../../../FoodHubApp/HomeModule/Redux/HomeAction';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getTotalSavingsContent } from '../Utils/TotalSavingsHelpers';
import { connect } from 'react-redux';
import TotalSavingsWidget from 't2sbasemodule/UI/CustomUI/TotalSavings/TotalSavings';
import { makeGetTotalSavingsAction } from 'appmodules/TotalSavingsModule/Redux/TotalSavingsAction';
import TotalSavingsStyles from '../Styles/TotalSavingsStyles';
import { SCREEN_NAME, VIEW_ID } from '../Utils/TotalSavingsConstants';
import { getAppName, getTakeawayName, isCustomerApp, isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { selectCurrencySymbol, selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';

class TotalSavingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSavingsContent: null,
            totalSavingAmount: ''
        };
    }

    componentDidMount() {
        this.setState({
            totalSavingsContent: getTotalSavingsContent(
                LOCALIZATION_STRINGS.SAVINGS_CONTENT_1,
                isCustomerApp() ? getTakeawayName(this.props.storeConfigName) : getAppName()
            )
        });
        this.didFocus = this.props.navigation.addListener('focus', () => {
            if (isFoodHubApp()) {
                this.props.getFoodHubTotalSavingsAction();
            } else if (this.props.isUserLoggedIn) {
                this.props.makeGetTotalSavingsAction();
            }
        });
    }

    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
        }
    }

    getFoodHubTotalSavingAmount() {
        const { foodHubTotalSavings } = this.props;
        if (isFoodHubApp() && isValidElement(foodHubTotalSavings) && isValidString(foodHubTotalSavings.savings)) {
            return foodHubTotalSavings.savings.toString();
        }
        return '0';
    }
    getUserTotalSavings() {
        const { totalSavingsResponse } = this.props;
        if (isValidElement(totalSavingsResponse) && isValidElement(totalSavingsResponse.totalSavings)) {
            return totalSavingsResponse.totalSavings.toString();
        }
        return '0';
    }

    render() {
        const TotalSavingResponse = this.getFoodHubTotalSavingAmount();
        const { currency } = this.props;
        return (
            <BaseComponent
                showHeader={true}
                showElevation={!isFoodHubApp()}
                showZendeskChat={false}
                title={!isFoodHubApp() && LOCALIZATION_STRINGS.TOTAL_SAVINGS}
                navigation={this.props.navigation}>
                <View style={TotalSavingsStyles.container}>
                    {isFoodHubApp() && (
                        <T2SText
                            id={VIEW_ID.TOTAL_SAVINGS_TITLE_TEXT}
                            screenName={SCREEN_NAME.TOTAL_SAVINGS}
                            style={TotalSavingsStyles.foodhubHeaderStyle}>
                            {LOCALIZATION_STRINGS.TOTAL_SAVINGS.toUpperCase()}
                        </T2SText>
                    )}
                    <TotalSavingsWidget
                        currencySymbol={currency}
                        totalSavingsAmount={isFoodHubApp() ? TotalSavingResponse : this.getUserTotalSavings()}
                        screenName={SCREEN_NAME.TOTAL_SAVINGS}
                    />
                    {isFoodHubApp() && isValidElement(TotalSavingResponse) && (
                        <T2SText
                            screenName={SCREEN_NAME.TOTAL_SAVINGS}
                            id={VIEW_ID.FOODHUB_SAVINGS_TEXT}
                            style={TotalSavingsStyles.foodHubSubHeaderText}>
                            {LOCALIZATION_STRINGS.TOTAL_SAVINGS_THROUGH_FOODHUB}
                        </T2SText>
                    )}
                    <View style={TotalSavingsStyles.textContainer}>
                        <T2SText
                            screenName={SCREEN_NAME.TOTAL_SAVINGS}
                            id={VIEW_ID.TITLE_TEXT}
                            style={isFoodHubApp() ? TotalSavingsStyles.titleStyleFoodHub : TotalSavingsStyles.titleStyle}>
                            {LOCALIZATION_STRINGS.AMAZING}
                        </T2SText>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <T2SText
                                screenName={SCREEN_NAME.TOTAL_SAVINGS}
                                id={VIEW_ID.TOTAL_SAVINGS_CONTENT_TEXT}
                                style={TotalSavingsStyles.contentStyle}>
                                {isFoodHubApp() ? LOCALIZATION_STRINGS.SAVINGS_CONTENT : this.state.totalSavingsContent}
                            </T2SText>
                            <T2SText
                                screenName={SCREEN_NAME.TOTAL_SAVINGS}
                                id={VIEW_ID.BOTTOM_CONTENT_TEXT}
                                style={TotalSavingsStyles.contentStyle}>
                                {LOCALIZATION_STRINGS.SAVINGS_CONTENT_2}
                            </T2SText>
                        </ScrollView>
                    </View>
                </View>
            </BaseComponent>
        );
    }
}

const mapStateToProps = (state) => ({
    storeConfigName: state.appState.storeConfigResponse?.name,
    foodHubTotalSavings: state.foodHubHomeState.foodHubTotalSavings,
    totalSavingsResponse: state.totalSavingsState.totalSavingsResponse,
    currency: selectCurrencySymbol(state),
    isUserLoggedIn: selectHasUserLoggedIn(state)
});
const mapDispatchToProps = { getFoodHubTotalSavingsAction, makeGetTotalSavingsAction };
export default connect(mapStateToProps, mapDispatchToProps)(TotalSavingsScreen);
