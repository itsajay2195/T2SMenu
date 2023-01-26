import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ReviewWidget from './components/ReviewWidget';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ReviewConstants';
import { connect } from 'react-redux';
import { T2SAppBar } from 't2sbasemodule/UI';
import { styles } from './Styles/OverallReviewWidgetStyle';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenName = SCREEN_NAME.VIEW_ORDER_REVIEW;

class ViewReviewScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.VIEW_REVIEW);
    }
    render() {
        return (
            <SafeAreaView style={styles.viewReviewContainer}>
                {this.renderHeader()}
                {this.renderFeedbackText()}
                {this.renderReview()}
            </SafeAreaView>
        );
    }

    renderHeader() {
        const { route, storeConfigName } = this.props;
        return (
            <T2SAppBar
                id={VIEW_ID.APP_BAR}
                screenName={screenName}
                title={
                    isValidElement(route.params.store) && isValidString(route.params.store.name)
                        ? route.params.store.name
                        : isValidElement(storeConfigName) && isValidString(storeConfigName)
                        ? storeConfigName
                        : ''
                }
            />
        );
    }

    renderFeedbackText() {
        return (
            <T2SText id={VIEW_ID.FEEDBACK_TEXT} screenName={screenName} style={styles.headerText}>
                {LOCALIZATION_STRINGS.FEEDBACK}
            </T2SText>
        );
    }

    renderReview() {
        const { route, storeConfigName } = this.props;
        return (
            <ScrollView>
                <ReviewWidget
                    screenName={screenName}
                    review={route.params.review}
                    storeName={
                        isValidElement(route.params.store) && isValidString(route.params.store.name)
                            ? route.params.store.name
                            : isValidElement(storeConfigName) && isValidString(storeConfigName)
                            ? storeConfigName
                            : ''
                    }
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ appState }) => ({
    storeConfigName: appState.storeConfigResponse?.name
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ViewReviewScreen);
