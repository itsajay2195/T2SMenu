import React, { Component } from 'react';
import { View } from 'react-native';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import { styles } from './Style/LanguageListItemStyle';
import { SCREEN_NAMES, VIEW_ID } from '../../Utils/Constants';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { getDescriptionText } from '../../Utils/helpers';

class LanguageListItem extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.item !== this.props.item || nextProps.language !== this.props.language;
    }
    render() {
        const { item, language, handleLanguageSelection, defaultLanguage } = this.props;
        return (
            <T2STouchableOpacity
                style={styles.flatListTouchable}
                onPress={handleLanguageSelection}
                activeOpacity={1}
                screenName={SCREEN_NAMES.LANGUAGE}
                id={VIEW_ID.SELECT_LANGUAGE + (isValidElement(item) && isValidString(item.code) ? item.code : '')}
                accessible={false}>
                <View id={VIEW_ID.LANGUAGE_ID} style={styles.flexDirectionRowContainer}>
                    <View style={styles.flexDirectionColumnContainer}>
                        <T2SText id={VIEW_ID.LANGUAGE_TEXT} style={styles.languageListItemText}>
                            {item.name}
                        </T2SText>
                        <T2SText id={VIEW_ID.LANGUAGE_DESC} style={styles.descriptionText}>
                            {getDescriptionText(item, defaultLanguage)}
                        </T2SText>
                    </View>
                    {isValidElement(item) &&
                        isValidString(item.code) &&
                        isValidElement(language) &&
                        isValidElement(language.code) &&
                        item.code === language.code && (
                            <T2SIcon
                                id={VIEW_ID.TICK_ICON}
                                style={styles.tick}
                                color={Colors.primaryColor}
                                icon={FONT_ICON.TICK}
                                size={30}
                            />
                        )}
                </View>
            </T2STouchableOpacity>
        );
    }
}

export default LanguageListItem;
