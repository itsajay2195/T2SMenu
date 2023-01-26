import React, { Component } from 'react';
import Colors from 't2sbasemodule/Themes/Colors';
import { FlatList, SafeAreaView, SectionList, TextInput, View, StatusBar } from 'react-native';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import styles from './Styles/MenuList';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { constructSectionListData, getName, getSearchResult } from '../Utils/MenuHelpers';
import _ from 'lodash';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { connect } from 'react-redux';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import Styles from './Styles/MenuStyle';
import MenuItemList from './MenuItemList';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SCREEN_NAME, VIEW_ID } from '../Utils/MenuConstants';

let screenName = SCREEN_NAME.MENU_SEARCH_SCREEN;
class SearchMenuView extends Component {
    constructor(props) {
        super(props);
        this.renderMenuItem = this.renderMenuItem.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onPressClose = this.onPressClose.bind(this);
        this.setshowSearchModal = this.setshowSearchModal.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.changeTextInputRef = this.changeTextInputRef.bind(this);
        this.state = {
            searchQuery: '',
            searchValue: '',
            searchResult: null
        };
    }
    changeTextInputRef(s) {
        this.search = s;
    }
    onChangeSearchText(query) {
        let { filteredMenu } = this.props;
        if (isValidString(query) && isValidElement(filteredMenu)) {
            this.setState({ searchResult: getSearchResult(query, _.cloneDeep(filteredMenu)) });
            Analytics.logEvent(ANALYTICS_SCREENS.MENU_SEARCH, ANALYTICS_EVENTS.MENU_SEARCH_QUERY, { query });
        } else {
            this.setState({ searchResult: null });
        }
    }
    onChangeText(query) {
        this.setState({ searchValue: query });
        this.onChangeSearchText(query);
    }

    setshowSearchModal() {
        this.setState({ showSearchModal: false });
    }
    onPressClose() {
        Analytics.logEvent(ANALYTICS_SCREENS.MENU_SEARCH, ANALYTICS_EVENTS.ICON_CLEAR);
        this.props.navigation.goBack();
    }
    renderSearchSectionList() {
        if (
            isValidElement(this.state.searchResult) &&
            isValidElement(this.state.searchResult.length) &&
            this.state.searchResult.length > 0
        ) {
            Analytics.logEvent(ANALYTICS_SCREENS.MENU_SEARCH, ANALYTICS_EVENTS.MENU_SEARCH_RESULT, {
                length: this.state.searchResult.length
            });
            let searchSectionListData = constructSectionListData(this.state.searchResult, null, false);
            return (
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                    <SectionList
                        sections={searchSectionListData}
                        stickySectionHeadersEnabled={false}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item, section }) => this.renderSectionItem(item, section, false)}
                        renderSectionHeader={this.renderSectionHeader}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
            );
        } else if (
            isValidElement(this.state.searchResult) &&
            isValidElement(this.state.searchResult.length) &&
            this.state.searchResult.length === 0 &&
            this.state.searchValue.length > 0
        ) {
            return <View style={Styles.noMenuStyle}>{this.renderNoMenu()}</View>;
        } else {
            return (
                <T2STouchableOpacity
                    style={styles.rootContainer}
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
            );
        }
    }

    renderNoMenu() {
        return (
            <View style={styles.emptyMenuContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.EMPTY_MENU_TEXT} style={styles.emptyMenuText}>
                    {LOCALIZATION_STRINGS.EMPTY_MENU}
                </T2SText>
            </View>
        );
    }

    renderSectionItem(item) {
        return (
            <View>
                <View style={Styles.subCategoryContainer}>
                    {isValidElement(item.name) && (
                        <T2SText screenName={screenName} id={VIEW_ID.SUB_CATEGORY + item.name.toString()} style={Styles.subCategoryStyle}>
                            {getName(item.name, item.second_language_name)}
                        </T2SText>
                    )}
                    {isValidString(item.description) && (
                        <T2SText screenName={screenName} id={VIEW_ID.SUB_CATEGORY + item.description} style={Styles.descriptionStyle}>
                            {item.description}
                        </T2SText>
                    )}
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    data={item.item}
                    renderItem={this.renderMenuItem}
                />
                <View style={styles.dividerStyle} />
            </View>
        );
    }

    renderMenuItem({ item }) {
        return (
            <MenuItemList
                screenName={screenName}
                isFromReOrder={this.props.isFromReOrder}
                name={item.name}
                offer={item.offer}
                secondLanguage={item.second_language_name}
                description={item.description}
                price={item.price}
                currency={this.props.currency}
                item={item}
                image={item.image}
                item_id={item.id}
                category_id={item.category_id}
                isFromReOrderItem={item.isFromReOrderItem}
                collectionType={item.collection}
                deliveryType={item.delivery}
            />
        );
    }

    renderSectionHeader({ section }) {
        return (
            <View style={Styles.categoryContainer}>
                <T2SText id={VIEW_ID.CATEGORY} style={Styles.categoryStyle}>
                    {section.title.toUpperCase()}
                </T2SText>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={Styles.safeAreaViewStyle}>
                <StatusBar backgroundColor="transparent" translucent={false} />
                <View style={Styles.searchMainContainer}>
                    <View style={Styles.searchMainView}>
                        <View style={Styles.searchSubView}>
                            <View style={Styles.searchSecondaryView}>
                                <T2SIcon name={FONT_ICON.SEARCH} style={[styles.backIcon]} onPress={this.setshowSearchModal} />
                                <TextInput
                                    {...setTestId(SCREEN_OPTIONS.MENU_SCREEN.screen_title, VIEW_ID.MENU_HEADER_SEARCH_TEXT_INPUT)}
                                    onChangeText={this.onChangeText}
                                    placeholder={LOCALIZATION_STRINGS.SEARCH_ITEMS}
                                    autoCorrect={false}
                                    value={this.state.searchValue}
                                    autoFocus={true}
                                    style={Styles.searchTextInputContainer}
                                    ref={this.changeTextInputRef}
                                />
                            </View>
                            <T2SIcon
                                screenName={screenName}
                                id={VIEW_ID.MENU_CLOSE_ICON}
                                style={Styles.searchCloseIconStyle}
                                name={FONT_ICON.CLOSE}
                                onPress={this.onPressClose}
                                size={20}
                            />
                        </View>
                    </View>
                    {this.renderSearchSectionList()}
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => ({
    filteredMenu: state.menuState.filteredMenu
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMenuView);
