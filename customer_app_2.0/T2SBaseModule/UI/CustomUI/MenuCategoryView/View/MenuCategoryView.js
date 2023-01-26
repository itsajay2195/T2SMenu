import React, { Component } from 'react';
import { FlatList, Platform } from 'react-native';
import styles from '../Style/MenuCategoryViewStyle';
import { VIEW_ID } from 'appmodules/MenuModule/Utils/MenuConstants';
import { isValidElement } from '../../../../Utils/helpers';
import T2STouchableOpacity from '../../../CommonUI/T2STouchableOpacity';
import { T2SText } from '../../../index';
import { SCREEN_OPTIONS } from '../../../../../CustomerApp/Navigation/ScreenOptions';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

let screenName = SCREEN_OPTIONS.MENU_SCREEN.screen_title,
    timeout;
class MenuCategoryView extends Component {
    constructor() {
        super();
        this.renderCategoryListItem = this.renderCategoryListItem.bind(this);
        this.scrollToIndexFailed = this.scrollToIndexFailed.bind(this);
        this.getItemLayout = this.getItemLayout.bind(this);
    }

    componentDidMount() {
        if (isValidElement(this.props.activeIndex)) {
            this.handleScroll(this.props.activeIndex);
        }
    }
    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== this.props.data || nextProps.activeIndex !== this.props.activeIndex;
    }

    render() {
        const { data } = this.props;
        return (
            <FlatList
                ref={(ref) => (this.contentRef = ref)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                data={data}
                bounces={false}
                initialNumToRender={data.length}
                onScrollToIndexFailed={this.scrollToIndexFailed}
                getItemLayout={this.getItemLayout}
                renderItem={this.renderCategoryListItem}
                style={styles.listContainer}
            />
        );
    }

    renderCategoryListItem({ item, index }) {
        const { activeIndex } = this.props;
        if (index === 0 || item === LOCALIZATION_STRINGS.BEST_SELLING) {
            return null;
        }
        return (
            <T2STouchableOpacity
                id={VIEW_ID.CATEGORY_VIEW + index}
                screenName={screenName}
                style={styles.categoryTextBg}
                onPress={this.handleOnItemSelected.bind(this, index)}>
                <T2SText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    id={VIEW_ID.CATEGORY + index}
                    screenName={screenName}
                    style={index === activeIndex ? [styles.categoryText, styles.categoryActiveText] : styles.categoryText}>
                    {item}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    getItemLayout(data, index) {
        let viewHeight = styles.categoryTextBg.height;
        return { length: viewHeight, offset: viewHeight * index - viewHeight * 2, index };
    }

    scrollToIndexFailed(error) {
        const offset = error.averageItemLength * error.index;
        if (isValidElement(this.contentRef)) {
            this.contentRef.scrollToOffset({ offset });
        }
        this.handleScroll(error.index);
    }

    handleOnItemSelected(index) {
        this.props.onItemSelected(index);
    }

    handleScroll(index) {
        timeout = setTimeout(
            () => {
                if (isValidElement(this.contentRef) && index >= 10) {
                    this.contentRef.scrollToIndex({ animated: true, index: index });
                }
            },
            Platform.OS === 'ios' ? 150 : 300
        );
    }
}

export default MenuCategoryView;
