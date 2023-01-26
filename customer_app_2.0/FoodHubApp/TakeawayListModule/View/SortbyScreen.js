import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFilterType } from '../Redux/TakeawayListAction';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SortByStyles } from '../Style/SortByScreenStyle';
import { FlatList, View } from 'react-native';
import { sortBy } from '../Utils/SortByList';
import RadioButton from 't2sbasemodule/UI/CommonUI/T2SRadioButton';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { SCREEN_NAME, VIEW_ID } from '../Utils/Constants';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { SafeAreaView } from 'react-native-safe-area-context';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { selectFilterType } from '../Redux/TakeawayListSelectors';
import { isUKApp } from 'appmodules/BaseModule/GlobalAppHelper';

class SortByScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radiobutton: null,
            filterType: null,
            sortByList: null
        };
    }
    componentDidMount() {
        if (isValidElement(this.props.filterType)) {
            this.setState({
                radiobutton: this.props.filterType,
                filterType: this.props.filterType,
                sortByList: sortBy(isUKApp(this.props.countryID))
            });
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props.filterType) && state.radiobutton !== props.filterType) {
            return {
                radiobutton: props.filterType,
                filterType: state.filterType
            };
        }
    }
    renderItem(item, index) {
        return (
            <T2SView style={SortByStyles.mainContainer}>
                <T2STouchableOpacity
                    id={VIEW_ID.FILTER_RADIOBUTTON + item.title}
                    screenName={SCREEN_NAME.FILTER_SCREEN}
                    onPress={this.handlePress.bind(this, item)}
                    style={SortByStyles.detailedContainer}>
                    <T2SText
                        id={item.title + '_' + VIEW_ID.FILTER_NAME_TEXT}
                        style={SortByStyles.radioTextStyle}
                        screenName={SCREEN_NAME.FILTER_SCREEN}>
                        {item.title}
                    </T2SText>
                    <RadioButton
                        status={this.checkStatus(item)}
                        onPress={this.handlePress.bind(this, item)}
                        style={this.checkStatus(item) ? SortByStyles.radioButtonStyle : SortByStyles.radioButtonInActiveStyle}
                        radioDotStyle={SortByStyles.dotStyle}
                    />
                </T2STouchableOpacity>
                <View
                    style={
                        index !== this.state.sortByList?.length - 1
                            ? [SortByStyles.dividerStyle, { marginVertical: 10 }]
                            : SortByStyles.lastIndexContainer
                    }
                />
            </T2SView>
        );
    }
    checkStatus(item) {
        return item.key === this.state.filterType;
    }

    handlePress(item) {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_FILTER, ANALYTICS_EVENTS.SORT_BY_BUTTON_CLICKED);
        if (this.state.radiobutton !== item.title) {
            this.props.setFilterType(item.key);
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <SafeAreaView style={SortByStyles.topShadowContainer}>
                <T2SAppBar title={LOCALIZATION_STRINGS.SORT} headerTextStyle={SortByStyles.headerTextStyle} />
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={this.state.sortByList}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                />
            </SafeAreaView>
        );
    }
}
const mapStateToProps = (state) => ({
    filterType: selectFilterType(state),
    countryID: state.appState.s3ConfigResponse?.country?.id
});

const mapDispatchToProps = {
    setFilterType
};

export default connect(mapStateToProps, mapDispatchToProps)(SortByScreen);
