import React, { Component } from 'react';
import Modal from 'react-native-modal';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { RepeatAddOnWidgetStyle } from '../Styles/RepeatAddOnWidgetStyle';
import { isValidElement, makeHapticFeedback } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/MenuConstants';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { T2SButton } from 't2sbasemodule/UI';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import { debounce } from 'lodash';
import { HapticFrom } from 't2sbasemodule/Utils/Constants';

class RepeatAddOnWidget extends Component {
    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props.isModalVisible) && state.isAddOnModalVisible !== props.isModalVisible) {
            return {
                isAddOnModalVisible: props.isModalVisible
            };
        }
    }
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.REPEAT_ADD_ON_WIDGET);
    }

    constructor(props) {
        super(props);
        this.state = {
            isAddOnModalVisible: false
        };
    }

    onRepeatLastPressed = debounce(
        () => {
            this.props.onRepeatLastPressed();
            Analytics.logAction(ANALYTICS_SCREENS.REPEAT_ADD_ON_WIDGET, ANALYTICS_EVENTS.REPEAT_LAST_BUTTON);
            makeHapticFeedback(this.props.featureGateResponse, HapticFrom.ITEM_ADDED);
        },
        500,
        { leading: true, trailing: false }
    );

    render() {
        //props required = isModalVisible , itemName , lastOrderAddOnHistory
        //call back - onRepeatLastPressed , onAddOnPressed
        const { lastOrderAddOnHistory, itemName, onBackdropPress, onBackButtonPress } = this.props;
        if (isValidElement(lastOrderAddOnHistory)) {
            const data = lastOrderAddOnHistory.map((addOn) => addOn.name);
            return (
                <Modal
                    backdropOpacity={0.5}
                    style={RepeatAddOnWidgetStyle.modalContainer}
                    isVisible={this.state.isAddOnModalVisible}
                    onBackdropPress={onBackdropPress}
                    onBackButtonPress={onBackButtonPress}>
                    <T2SView style={RepeatAddOnWidgetStyle.modalView}>
                        <T2SText
                            screenName={SCREEN_NAME.REPEAT_ADD_ON_WIDGET}
                            id={VIEW_ID.ITEM_NAME_TEXT}
                            style={RepeatAddOnWidgetStyle.itemNameText}>
                            {itemName.toUpperCase()}
                        </T2SText>
                        {!isValidElement(data) ? null : (
                            <T2SView>
                                <T2SText
                                    id={VIEW_ID.REPEAT_LAST_ORDER_TEXT}
                                    screenName={SCREEN_NAME.REPEAT_ADD_ON_WIDGET}
                                    style={RepeatAddOnWidgetStyle.addOnHeaderText}>
                                    {LOCALIZATION_STRINGS.REPEAT_LAST_ORDER}
                                </T2SText>
                                <T2SView style={RepeatAddOnWidgetStyle.addOnView}>
                                    <T2SText
                                        screenName={SCREEN_NAME.REPEAT_ADD_ON_WIDGET}
                                        id={VIEW_ID.ADD_ON_TEXT}
                                        style={RepeatAddOnWidgetStyle.addOnText}>
                                        {data.join(', ')}
                                    </T2SText>
                                </T2SView>
                            </T2SView>
                        )}
                        <T2SView style={RepeatAddOnWidgetStyle.buttonContainer}>
                            <T2SButton
                                buttonStyle={RepeatAddOnWidgetStyle.newAddOnButton}
                                contentStyle={RepeatAddOnWidgetStyle.buttonContentStyle}
                                buttonTextStyle={RepeatAddOnWidgetStyle.newAddOnText}
                                title={LOCALIZATION_STRINGS.NEW_ADD_ON}
                                id={VIEW_ID.ADD_ON_BUTTON}
                                screenName={SCREEN_NAME.REPEAT_ADD_ON_WIDGET}
                                onPress={() => {
                                    this.props.onAddOnPressed();
                                    Analytics.logAction(ANALYTICS_SCREENS.REPEAT_ADD_ON_WIDGET, ANALYTICS_EVENTS.NEW_ADD_ON_BUTTON);
                                }}
                            />

                            <T2SButton
                                contentStyle={RepeatAddOnWidgetStyle.buttonContentStyle}
                                buttonStyle={RepeatAddOnWidgetStyle.repeatLastButton}
                                buttonTextStyle={RepeatAddOnWidgetStyle.repeatLastText}
                                title={LOCALIZATION_STRINGS.REPEAT_LAST}
                                id={VIEW_ID.REPEAT_LAST_BUTTON}
                                screenName={SCREEN_NAME.REPEAT_ADD_ON_WIDGET}
                                onPress={() => {
                                    this.onRepeatLastPressed();
                                }}
                            />
                        </T2SView>
                    </T2SView>
                </Modal>
            );
        }
        return null;
    }
}

export default RepeatAddOnWidget;
