import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { string } from 'prop-types';
import { styles } from '../styles/InformationStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { DEFAULT_LINE_COUNT, MAX_LINE_COUNT, VIEW_ID } from '../../Utils/TakeawayDetailsConstants';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import { logEvent } from '../../../AnalyticsModule/Analytics';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

type Props = {};
export default class DescriptionComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapsed: false,
            readMoreEnabled: false,
            numberOfTextLines: 0,
            shouldUpdateNumberOfLines: true
        };
    }

    readMoreEnabled() {
        const { screenName } = this.props;
        const { collapsed, readMoreEnabled } = this.state;
        const readMoreConfig = collapsed
            ? {
                  style: styles.descriptionReadMore,
                  readMoreText: LOCALIZATION_STRINGS.READ_MORE,
                  dot: ' ... '
              }
            : {
                  readMoreText: LOCALIZATION_STRINGS.READ_LESS,
                  style: styles.descriptionReadMorefull
              };
        return readMoreEnabled ? (
            <T2SText id={VIEW_ID.READ_MORE_DOT} screenName={screenName} style={readMoreConfig.style}>
                {readMoreConfig.dot}
                <T2SText id={VIEW_ID.READ_MORE} screenName={screenName} style={styles.descriptionReadMoreText} onPress={this.toggle}>
                    {readMoreConfig.readMoreText}
                </T2SText>
            </T2SText>
        ) : null;
    }

    toggle() {
        const { collapsed } = this.state;
        logEvent(ANALYTICS_SCREENS.ABOUT_US, ANALYTICS_EVENTS.TOGGLE_READ_MORE);
        this.setState({ collapsed: !collapsed });
    }

    getLayoutWithDummyView(shouldUpdateNumberOfLines, numberOfTextLines, description) {
        return (
            <Text
                style={styles.dummyViewTextStyle}
                onTextLayout={({ nativeEvent: { lines } }) => {
                    this.setState({ numberOfTextLines: lines.length });
                    if (lines.length > MAX_LINE_COUNT && shouldUpdateNumberOfLines) {
                        this.setState({ collapsed: true, readMoreEnabled: true, shouldUpdateNumberOfLines: false });
                    }
                }}>
                {description}
            </Text>
        );
    }

    render() {
        const { screenName, text: description } = this.props;
        const { collapsed, shouldUpdateNumberOfLines, numberOfTextLines } = this.state;

        if (description.length === 0) {
            return null;
        }

        return (
            <View style={styles.descriptionContainer}>
                {this.getLayoutWithDummyView(shouldUpdateNumberOfLines, numberOfTextLines, description)}
                {numberOfTextLines !== 0 && (
                    <View>
                        <View style={styles.description}>
                            <Text
                                ref={(ref) => (this.desc = ref)}
                                style={styles.descriptionText}
                                {...setTestId(screenName, VIEW_ID.DESCRIPTION)}
                                numberOfLines={collapsed ? MAX_LINE_COUNT : DEFAULT_LINE_COUNT}>
                                {description}
                            </Text>
                            {this.readMoreEnabled()}
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

DescriptionComponent.defaultProps = {
    screenName: '',
    text: ''
};
DescriptionComponent.propTypes = {
    screenName: string.isRequired,
    text: string.isRequired
};
