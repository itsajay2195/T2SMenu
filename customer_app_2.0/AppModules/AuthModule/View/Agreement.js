import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { T2SAppBar, T2SButton } from 't2sbasemodule/UI';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { connect } from 'react-redux';
import { AuthConstants, SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SCheckBox from 't2sbasemodule/UI/CommonUI/T2SCheckBox';
import { AgreementStyle } from '../Styles/AgreementStyle';
import * as Analytics from '../../AnalyticsModule/Analytics';
import {
    getPolicy,
    isCustomerApp,
    isEmailPromotionChecked,
    isSmsPromotionChecked,
    isValidElement,
    isValidString
} from 't2sbasemodule/Utils/helpers';
import { onNotAgreedGDPRAction, updateBulkConsentAction } from '../Redux/AuthAction';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import HyperlinkText from 't2sbasemodule/UI/CustomUI/HyperlinkText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { Text } from 'react-native-paper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { policyLookupAction } from '../../../CustomerApp/Redux/Actions';
import _ from 'lodash';
import { setUserEmailSubscription, setUserSMSSubscription } from '../../AnalyticsModule/Braze';

class Agreement extends Component {
    constructor(props) {
        super(props);
        this.handleNotAgreedAction = this.handleNotAgreedAction.bind(this);
        this.handleAgreeAction = this.handleAgreeAction.bind(this);
    }

    state = {
        emailChecked: false,
        smsChecked: false,
        policyContent: ''
    };

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.GDPR_AGREEMENT_SCREEN);
        const { policyLookupResponse, promotion_campaigns, opt_in_opt_out_email, opt_in_opt_out_sms } = this.props;
        const policy = getPolicy(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.terms_and_conditions);
        if (isValidElement(policy) && isValidString(policy.short_description)) {
            this.setState({ policyContent: policy.short_description });
        } else {
            this.props.policyLookupAction();
        }
        if (isCustomerApp() && isValidElement(opt_in_opt_out_email) && isValidElement(opt_in_opt_out_sms)) {
            this.setPromotions(opt_in_opt_out_email, opt_in_opt_out_sms);
        } else if (isValidElement(promotion_campaigns)) {
            this.setPromotions(promotion_campaigns.opt_in_opt_out_email, promotion_campaigns.opt_in_opt_out_sms);
        }
    }

    setPromotions(email, sms) {
        this.setState({
            emailChecked: isEmailPromotionChecked(email),
            smsChecked: isSmsPromotionChecked(sms)
        });
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { policyLookupResponse } = props;
        if (policyLookupResponse !== state.policyLookupResponse) {
            value.policyLookupResponse = policyLookupResponse;
            const policy = getPolicy(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.terms_and_conditions);
            if (isValidElement(policy) && isValidString(policy.short_description)) {
                value.policyContent = policy.short_description;
            }
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <SafeAreaView style={AgreementStyle.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderHeader()}
                    {this.renderTermsAndConditionView()}
                    {this.renderContactPermissionView()}
                    {this.renderPrivacyPolicyView()}
                    {this.renderPromotionTextView()}
                    {this.renderCheckBoxContainerView()}
                    {this.renderAgreeButton()}
                </ScrollView>
            </SafeAreaView>
        );
    }

    renderHeader() {
        return <T2SAppBar title={LOCALIZATION_STRINGS.AGREEMENT} handleLeftActionPress={this.handleNotAgreedAction} />;
    }

    renderTermsAndConditionView() {
        return (
            <View style={AgreementStyle.termsAndConditionView}>
                {this.renderCommonText(LOCALIZATION_STRINGS.TERMS_AND_CONDITIONS, AgreementStyle.headerTextStyle)}
                <T2SText
                    style={AgreementStyle.termsAndConditionContentText}
                    id={VIEW_ID.POLICY_CONTENT_TEXT}
                    screenName={SCREEN_NAME.AGREEMENT_SCREEN}>
                    {this.state.policyContent}
                </T2SText>
            </View>
        );
    }

    renderContactPermissionView() {
        return (
            <View style={AgreementStyle.contactPermissionView}>
                {this.renderCommonText(LOCALIZATION_STRINGS.CONTACT_PERMISSION, AgreementStyle.headerTextStyle)}
            </View>
        );
    }

    renderPrivacyPolicyView() {
        return (
            <View style={AgreementStyle.privacyPolicyMainView}>
                <View style={AgreementStyle.privacyPolicyView}>
                    {this.renderCommonText(LOCALIZATION_STRINGS.PRIVACY_POLICY_TEXT, AgreementStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.TERMS_AND_CONDITIONS_TEXT, LOCALIZATION_STRINGS.TERMS_AND_CONDITIONS)}
                    {this.renderCommonText(LOCALIZATION_STRINGS.PRIVACY_POLICY_COMMA, AgreementStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.TERMS_OF_USE_TEXT, LOCALIZATION_STRINGS.TERMS_OF_USE)}
                    {this.renderCommonText(' ' + LOCALIZATION_STRINGS.PRIVACY_POLICY_AND, AgreementStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.PRIVACY_POLICY_TEXT, LOCALIZATION_STRINGS.PRIVACY_POLICY)}
                </View>
            </View>
        );
    }
    renderPromotionTextView() {
        return (
            <View style={AgreementStyle.promotionTextViewStyle}>
                {this.renderCommonText(LOCALIZATION_STRINGS.PROMOTIONS_TEXT, AgreementStyle.promotionsText)}
            </View>
        );
    }

    renderCommonText(name, textStyle) {
        return <Text style={textStyle}>{name}</Text>;
    }

    renderHyperLinkText(id, name) {
        return (
            <HyperlinkText
                id={id}
                screenName={SCREEN_NAME.AGREEMENT_SCREEN}
                onPress={this.handleGDPRScreenNavigation.bind(this, this.getRouteName(id))}
                name={name}
            />
        );
    }

    renderCheckBoxContainerView() {
        return (
            <View style={AgreementStyle.checkBoxContainer}>
                <View style={AgreementStyle.checkBoxView}>
                    <T2SCheckBox
                        id={VIEW_ID.EMAIL_CHECKBOX}
                        screenName={SCREEN_NAME.AGREEMENT_SCREEN}
                        label={LOCALIZATION_STRINGS.EMAIL}
                        status={this.state.emailChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                        onPress={() => this.setState({ emailChecked: !this.state.emailChecked })}
                    />
                </View>
                <View style={AgreementStyle.checkBoxView}>
                    <T2SCheckBox
                        id={VIEW_ID.SMS_CHECKBOX}
                        screenName={SCREEN_NAME.AGREEMENT_SCREEN}
                        label={LOCALIZATION_STRINGS.SMS}
                        status={this.state.smsChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                        onPress={() => this.setState({ smsChecked: !this.state.smsChecked })}
                    />
                </View>
            </View>
        );
    }

    renderAgreeButton() {
        return (
            <T2SButton
                buttonStyle={AgreementStyle.buttonStyle}
                buttonTextStyle={AgreementStyle.buttonTextStyle}
                screenName={SCREEN_NAME.AGREEMENT_SCREEN}
                id={VIEW_ID.AGREE_BUTTON}
                title={LOCALIZATION_STRINGS.AGREE.toUpperCase()}
                onPress={this.handleAgreeAction}
            />
        );
    }

    handleNotAgreedAction() {
        this.props.onNotAgreedGDPRAction();
        if (NavigationService.navigationRef.current?.canGoBack()) {
            NavigationService.navigationRef.current?.goBack();
        }
    }

    handleGDPRScreenNavigation(routeName) {
        handleNavigation(routeName, { showBackButton: true });
    }

    getRouteName(id) {
        if (id === VIEW_ID.TERMS_AND_CONDITIONS_TEXT) {
            return SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name;
        } else if (id === VIEW_ID.TERMS_OF_USE_TEXT) {
            return SCREEN_OPTIONS.TERMS_OF_USE.route_name;
        } else {
            return SCREEN_OPTIONS.PRIVACY_POLICY.route_name;
        }
    }

    handleAgreeAction() {
        const { profileResponse, storeId, countryBaseFeatureGateResponse } = this.props;
        let { emailChecked, smsChecked } = this.state;
        if (isValidElement(profileResponse) && isValidElement(profileResponse.id) && isValidElement(storeId)) {
            // GDPR consent update
            Analytics.logAction(ANALYTICS_SCREENS.GDPR_AGREEMENT_SCREEN, ANALYTICS_EVENTS.AGREE_GDPR_BUTTON_CLICKED);
            // Email & Sms consent update
            Analytics.logAction(ANALYTICS_SCREENS.GDPR_AGREEMENT_SCREEN, ANALYTICS_EVENTS.UPDATE_CONSENT, {
                email: emailChecked,
                sms: smsChecked
            });
            setUserSMSSubscription(smsChecked, countryBaseFeatureGateResponse);
            setUserEmailSubscription(emailChecked, countryBaseFeatureGateResponse);
            this.props.navigation.goBack();
            this.props.updateBulkConsentAction(true, emailChecked, smsChecked, true, this.props.profileResponse.id, this.props.storeId);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.ERROR_MESSAGE_AGREE_GDPR);
        }
    }
}

const mapStateToProps = (state) => ({
    policyLookupResponse: state.appState.policyLookupResponse,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    profileResponse: state.authState.profileResponseWithoutConsent,
    storeId: selectStoreId(state),
    promotion_campaigns: state.appState.s3ConfigResponse?.promotion_campaigns,
    opt_in_opt_out_email: state.appState.storeConfigResponse?.opt_in_opt_out_email,
    opt_in_opt_out_sms: state.appState.storeConfigResponse?.opt_in_opt_out_sms
});

const mapDispatchToProps = {
    updateBulkConsentAction,
    onNotAgreedGDPRAction,
    policyLookupAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Agreement);
