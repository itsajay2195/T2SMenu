import React from 'react';
import { T2SCheckBox, T2SIcon } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import { selectContactFreeDelivery } from '../../Redux/BasketSelectors';
import { connect } from 'react-redux';
import { setContactFreeAction } from '../../Redux/BasketAction';
import styles from '../Styles/ContactFreeDeliveryStyle';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from '../../../AnalyticsModule/AnalyticsConstants';

const ContactFreeDelivery = (props) => {
    const { screenName, analyticsScreenName, contactFreeDelivery } = props;
    const onContactInfoClicked = () => {
        showInfoMessage(LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_DESCRIPTION);
    };
    return isValidElement(props.collapse) && props.collapse ? (
        <T2SView style={[styles.container, props.containerStyle]}>
            <T2SView style={{ flexDirection: 'row' }}>
                <T2SCheckBox
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    id={VIEW_ID.QC_CHECKBOX_UNFILL}
                    checkBoxStyle={{ color: Colors.carrotOrange }}
                    style={{ flex: 1 }}
                    status={contactFreeDelivery}
                    onPress={() => {
                        Analytics.logEvent(analyticsScreenName, ANALYTICS_EVENTS.CONTACT_FREE_DELIVERY, {
                            contact_free: !props.contactFreeDelivery
                        });
                        props.setContactFreeAction(!props.contactFreeDelivery);
                    }}
                    textstyle={styles.checkBoxTextStyle}
                    label={LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_TITLE}
                />
                <T2STouchableOpacity screenName={screenName} id={VIEW_ID.UNFILLED_INFO_ICON} onPress={onContactInfoClicked.bind(this)}>
                    <T2SIcon icon={FONT_ICON.INFO_ICON_UNFILLED} color={Colors.black} size={24} />
                </T2STouchableOpacity>
            </T2SView>
        </T2SView>
    ) : (
        <T2SView style={[styles.container, props.containerStyle]}>
            <T2SView>
                <T2SCheckBox
                    status={props.contactFreeDelivery}
                    onPress={() => {
                        Analytics.logEvent(analyticsScreenName, ANALYTICS_EVENTS.CONTACT_FREE_DELIVERY, {
                            contact_free: !props.contactFreeDelivery
                        });
                        props.setContactFreeAction(!props.contactFreeDelivery);
                    }}
                    textstyle={styles.checkBoxTextStyle}
                    label={LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_TITLE}
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    id={VIEW_ID.QC_CHECKBOX_FILL}
                />
            </T2SView>
            <T2SText screenName={SCREEN_NAME.BASKET_SCREEN} id={VIEW_ID.QC_CONTACT_FREE_DELIVERY_ID} style={styles.contentStyle}>
                {LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_DESCRIPTION}
            </T2SText>
        </T2SView>
    );
};

const mapStateToProps = (state) => ({
    contactFreeDelivery: selectContactFreeDelivery(state)
});

const mapDispatchToProps = {
    setContactFreeAction
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactFreeDelivery);
