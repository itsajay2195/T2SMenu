import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { string, arrayOf, number, func } from 'prop-types';
import { styles } from './styles/SelectedAddonStyle';
import T2SText from '../CommonUI/T2SText';
import * as Analytics from '../../../AppModules/AnalyticsModule/Analytics';
import { VIEW_ID } from '../../Utils/Constants';
import { isValidElement } from '../../Utils/helpers';
import CustomIcon from './CustomIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { DEFAULT_MODIFIER } from 'appmodules/MenuModule/Utils/MenuConstants';
import { ANALYTICS_SCREENS, ANALYTICS_EVENTS } from '../../../AppModules/AnalyticsModule/AnalyticsConstants';

/**
 * props @param { screenName, addOns, visibleLines, onPress }
 * screenName   - It is required param for automation
 * addOns       - List of selected Add-on as Array of String
 * visibleLines - Number of line that visible others are scrollable, it may be a fraction
 * onPress      - This have a callback addOn like below
 *
 * addOn retun from onPress @param { text, key }
 * text         - Clicked Add-on text,
 * key          - Clicked Add-on index value
 */

type Prop = {};
export default class SelectedAddon extends Component<Prop> {
    constructor(props) {
        super(props);
        this.state = {
            addonHeight: 0,
            containerHeight: 0
        };
        this.scrollViewRef = React.createRef();
    }

    handleAddonLayout = ({ nativeEvent }) => {
        this.setState({ addonHeight: nativeEvent.layout.height + 6 });
    };
    handleContainerLayout = ({ nativeEvent }) => {
        this.setState({ containerHeight: nativeEvent.layout.height });
    };
    handleOnPress = (addOn) => {
        Analytics.logEvent(ANALYTICS_SCREENS.ADD_ON, ANALYTICS_EVENTS.SELECTED_ADD_ON, { addOn });
        this.props.handleOnPress(addOn);
    };
    scrollContentToBottom() {
        if (isValidElement(this.scrollViewRef) && isValidElement(this.scrollViewRef.current)) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }
    renderAddOn = ({ addOn, index, screenName }) => {
        const AddOnName = this.getAddOnName(addOn);
        return (
            <T2STouchableOpacity
                id={VIEW_ID.ADDON_BUTTON}
                screenName={screenName}
                activeOpacity={0.5}
                style={styles.addOnContainer}
                onPress={() => {
                    this.handleOnPress(addOn);
                }}>
                {index !== 0 && <CustomIcon name={FONT_ICON.ADD} style={styles.plus} />}
                <T2SText
                    id={VIEW_ID.ADDON_TEXT + '_' + AddOnName}
                    screenName={screenName}
                    style={styles.addOn}
                    onLayout={this.handleAddonLayout}>
                    {AddOnName}
                </T2SText>
            </T2STouchableOpacity>
        );
    };
    getAddOnName = (addOn) => {
        if (
            !isValidElement(addOn.modifier) ||
            addOn.modifier.toLowerCase() === DEFAULT_MODIFIER.toLowerCase() ||
            addOn.modifier.length === 0
        )
            return addOn.name;
        return `${addOn.modifier} ${addOn.name}`;
    };

    render() {
        const AddOn = this.renderAddOn;
        const { addonHeight, containerHeight } = this.state;
        const { visibleLines, addOns, screenName } = this.props;
        const maxHeight = addonHeight * visibleLines + 4;
        const isMaxHeight = maxHeight < containerHeight;
        const heightOfWidget = isMaxHeight ? maxHeight : containerHeight;
        const padding = addOns.length > 0 ? 4 : 0;
        return (
            <View style={{ height: heightOfWidget }}>
                <ScrollView showsVerticalScrollIndicator={false} ref={this.scrollViewRef}>
                    <View style={[styles.wrapText, { padding }]} onLayout={this.handleContainerLayout}>
                        {isValidElement(addOns) &&
                            addOns.map((val, key) => <AddOn screenName={screenName} addOn={val} index={key} key={key} />)}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

SelectedAddon.propTypes = {
    screenName: string.isRequired,
    addOns: arrayOf(string),
    visibleLines: number,
    onPress: func
};

SelectedAddon.defaultProps = {
    screenName: undefined,
    addOns: [],
    visibleLines: 3.1,
    onPress: () => {}
};
