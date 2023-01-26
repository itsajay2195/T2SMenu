import React, { Component } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { setSideMenuActiveAction, updateDefaultLanguage } from '../../../CustomerApp/Redux/Actions';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseModule/BaseComponent';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import { getDefaultLanguageName, getSelectedLanguage, isValidElement } from 't2sbasemodule/Utils/helpers';
import { getLanguage } from '../../../CustomerApp/Utils/AppConfig';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import LanguageListItem from './Components/LanguageListItem';

class LanguageScreen extends Component {
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.CHANGE_LANGUAGE);
        this.didFocus = this.props.navigation.addListener('focus', () => {
            this.props.updateDefaultLanguage(this.props.language, false, true);
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
        }
    }

    render() {
        return (
            <BaseComponent title={LOCALIZATION_STRINGS.APP_LANGUAGE} showHeader showCommonActions={false}>
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: Colors.backgroundGrey
                    }}>
                    {this.renderLanguageList()}
                </SafeAreaView>
            </BaseComponent>
        );
    }

    renderLanguageList() {
        const { defaultLanguage, languageOptions } = this.props;
        return (
            <FlatList
                data={getLanguage(defaultLanguage, languageOptions)}
                renderItem={({ item }) => {
                    return this.renderListItem(item);
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => <View style={{ height: 5, backgroundColor: Colors.grey }} />}
                ItemSeparatorComponent={() => <View style={{ height: 5, backgroundColor: Colors.grey }} />}
            />
        );
    }

    renderListItem(item) {
        const { language, defaultLanguage } = this.props;
        return (
            <LanguageListItem
                item={item}
                language={getSelectedLanguage(language, defaultLanguage)}
                handleLanguageSelection={this.handleLanguageSelection.bind(this, item)}
                defaultLanguage={getDefaultLanguageName(defaultLanguage)}
            />
        );
    }

    handleLanguageSelection(data) {
        Analytics.logAction(ANALYTICS_SCREENS.CHANGE_LANGUAGE, ANALYTICS_EVENTS.SELECT_LANGUAGE, { language: data.value });
        this.props.updateDefaultLanguage(data, true, false);
        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
        handleNavigation(SCREEN_OPTIONS.HOME.route_name);
    }
}

const mapStateToProps = (state) => ({
    language: state.appState.language,
    defaultLanguage: state.appState.s3ConfigResponse?.language?.default,
    languageOptions: state.appState.s3ConfigResponse?.language?.options
});

const mapDispatchToProps = {
    updateDefaultLanguage,
    setSideMenuActiveAction
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageScreen);
