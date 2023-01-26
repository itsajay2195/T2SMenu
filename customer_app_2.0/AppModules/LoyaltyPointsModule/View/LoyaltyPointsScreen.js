import React, { Component } from 'react';
import BaseComponent from '../../BaseModule/BaseComponent';
import LoyaltyBannerView from './LoyaltyBannerView';
import { SafeAreaView, Text, View } from 'react-native';
import Styles from '../Styles/LoyaltyStyles';
import { connect } from 'react-redux';
import { getCurrentLoyaltyPoints } from '../Utils/LoyaltyHelper';
import { isDisplayBanner, isValidElement } from 't2sbasemodule/Utils/helpers';
import { selectCurrencySymbol } from 't2sbasemodule/Utils/AppSelectors';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, SCREEN_VIEW_ID } from '../Utils/LoyaltyConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import T2SPaginatedFlatList from 't2sbasemodule/UI/CommonUI/T2SPaginatedFlatList';
import Colors from 't2sbasemodule/Themes/Colors';
import { getLoyaltyTransactions } from '../../BasketModule/Redux/BasketAction';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import LoyaltyPointListItem from './Components/LoyaltyPointListItem';
class LoyaltyPointsScreen extends Component {
    constructor(props) {
        super(props);
        this.onRefreshHandle = this.onRefreshHandle.bind(this);
        this.state = {
            bannerVisible: false
        };
    }
    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.props.getLoyaltyTransactions();
            this.showBanner();
        });
        Analytics.logScreen(ANALYTICS_SCREENS.LOYALTY_POINTS);
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }

    renderLoyaltyPointsListHeader() {
        return (
            <View style={Styles.loyaltyListHeaderViewStyle}>
                <View style={Styles.loyaltyListHeader}>
                    <Text style={Styles.loyaltyListHeaderTextStyle} numerOfLines={2}>
                        {LOCALIZATION_STRINGS.ORDER_DATE}
                    </Text>
                </View>
                <View style={Styles.loyaltyListHeader}>
                    <Text style={Styles.loyaltyListHeaderTextStyle} numerOfLines={2}>
                        {LOCALIZATION_STRINGS.ORDER_AMOUNT}
                    </Text>
                </View>
                <View style={Styles.loyaltyListHeader}>
                    <Text style={Styles.loyaltyListHeaderTextStyle} numerOfLines={2}>
                        {LOCALIZATION_STRINGS.POINTS_GAINED}
                    </Text>
                </View>
            </View>
        );
    }

    LoyaltyPointsItem = ({ item, index }) => {
        const { currency, loyaltyPoints } = this.props;
        let backgroundViewColor = index % 2 === 0 ? { backgroundColor: Colors.white } : Styles.loyaltyOddRowViewStyle;
        return (
            <LoyaltyPointListItem
                item={item}
                backgroundViewColor={backgroundViewColor}
                currency={currency}
                loyaltyPoints={loyaltyPoints}
                index={index}
            />
        );
    };

    onRefreshHandle() {
        this.props.getLoyaltyTransactions();
        this.showBanner();
    }

    showBanner() {
        const { loyaltyStatusMessage, loyaltyPoints } = this.props;
        if (isDisplayBanner(loyaltyStatusMessage, loyaltyPoints)) {
            this.setState({ bannerVisible: true });
        } else {
            this.setState({ bannerVisible: false });
        }
    }

    render() {
        const { loyaltyStatusMessage, loyaltyPoints } = this.props;
        return (
            <BaseComponent
                showHeader={true}
                showZendeskChat={false}
                title={LOCALIZATION_STRINGS.LOYALTY_POINTS}
                navigation={this.props.navigation}>
                <View style={Styles.mainContainer}>
                    {this.state.bannerVisible && this.disableLoyaltyPointsBanner(loyaltyStatusMessage)}
                    <LoyaltyBannerView value={getCurrentLoyaltyPoints(loyaltyPoints)} />
                    {isValidElement(loyaltyPoints) && loyaltyPoints.transactions.length <= 0 && (
                        <View style={Styles.loyaltyInfoMessageContainer}>{this.loyaltyPointsZeroInfoMessage()}</View>
                    )}
                    {isValidElement(loyaltyPoints) &&
                        isValidElement(loyaltyPoints.transactions) &&
                        loyaltyPoints.transactions.length > 0 &&
                        this.showLoyaltyPoints()}
                </View>
            </BaseComponent>
        );
    }
    showLoyaltyPoints() {
        return (
            <View style={Styles.loyaltyPonitsDetailsContainer}>
                {this.renderLoyaltyPointsListHeader()}
                <SafeAreaView style={Styles.loyaltyListItem}>
                    {isValidElement(this.props.loyaltyPoints.transactions) && (
                        <T2SPaginatedFlatList
                            id={SCREEN_VIEW_ID.POINT_LIST}
                            screenName={SCREEN_NAME.LOYALTY_SCREEN}
                            showsVerticalScrollIndicator={false}
                            onRefresh={this.onRefreshHandle}
                            useFlatList
                            keyExtractor={(item, index) => index}
                            data={this.props.loyaltyPoints.transactions}
                            renderItem={this.LoyaltyPointsItem}
                        />
                    )}
                </SafeAreaView>
            </View>
        );
    }
    loyaltyPointsZeroInfoMessage() {
        return (
            <View style={Styles.infoMessageViewStyle}>
                <T2SText
                    style={Styles.infoMessageTextStyle}
                    id={SCREEN_VIEW_ID.ZERO_POINTS_INFO_MESSAGE_TEXT}
                    screenName={SCREEN_NAME.LOYALTY_SCREEN}>
                    {LOCALIZATION_STRINGS.ZERO_POINTS_INFO_MESSAGE}
                </T2SText>
            </View>
        );
    }
    disableLoyaltyPointsBanner(infoMessage) {
        return (
            <View style={Styles.bannerViewStyle}>
                <T2SText
                    style={Styles.bannerTextStyle}
                    screenName={SCREEN_NAME.LOYALTY_SCREEN}
                    id={SCREEN_VIEW_ID.DISABLE_LOYALTY_POINTS_MESSAGE_BANNER_TEXT}>
                    {infoMessage}
                </T2SText>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loyaltyPoints: state.basketState.loyaltyTransactions,
    currency: selectCurrencySymbol(state),
    loyaltyStatusMessage: state.appState.storeConfigResponse?.loyalty_status_message
});

const mapDispatchToProps = {
    getLoyaltyTransactions
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyaltyPointsScreen);
