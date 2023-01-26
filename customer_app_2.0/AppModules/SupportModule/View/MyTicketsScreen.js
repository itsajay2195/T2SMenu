import React, { Component } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { T2SAppBar } from 't2sbasemodule/UI';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { isValidNotEmptyString, safeIntValue } from 't2sbasemodule/Utils/helpers';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { VIEW_ID } from '../Utils/SupportConstants';
import Colors from 't2sbasemodule/Themes/Colors';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import BaseComponent from '../../BaseModule/BaseComponent';
import { MyTicketStyle } from '../Style/MyTicketsScreenStyle';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { submitNewTicket } from '../Utils/SupportHelpers';
import { showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { handleGoBack } from '../../../CustomerApp/Navigation/Helper';

let screenName = SCREEN_OPTIONS.MY_TICKETS_SCREEN.screen_title;
let maxLinesForComments = 3;

class MyTicketsScreen extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitButtonState = this.handleSubmitButtonState.bind(this);
        this.state = {
            description: null,
            showSubmitLoading: false,
            isSubmitButtonEnabled: false,
            descriptionInputHeight: 40,
            emptyDescriptionError: false
        };
    }
    componentDidMount() {
        this.setState({ descriptionInputHeight: 40 });
    }

    render() {
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={LOCALIZATION_STRINGS.SUBMIT_TICKET}
                    showElevation={false}
                    actions={this.renderSubmitButton()}
                />
                {this.renderTextInput(
                    VIEW_ID.DESCRIPTION,
                    LOCALIZATION_STRINGS.DESCRIPTION,
                    this.state.description,
                    this.state.emptyDescriptionError,
                    Platform.OS === 'android' ? 'visible-password' : 'default',
                    'sentences',
                    true,
                    160,
                    true,
                    null,
                    null,
                    true
                )}
            </BaseComponent>
        );
    }

    renderSubmitButton() {
        const { showSubmitLoading, isSubmitButtonEnabled } = this.state;
        return (
            <View>
                {showSubmitLoading ? (
                    <View style={MyTicketStyle.loaderView}>
                        <ActivityIndicator color={Colors.secondary_color} size={'small'} />
                    </View>
                ) : (
                    <T2STouchableOpacity screenName={screenName} id={VIEW_ID.SUBMIT_BUTTON} onPress={this.handleSubmit}>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.SUBMIT_TEXT}
                            style={[
                                MyTicketStyle.submitTextStyle,
                                isSubmitButtonEnabled ? { color: Colors.textBlue } : { color: Colors.suvaGrey }
                            ]}>
                            {LOCALIZATION_STRINGS.SUBMIT}
                        </T2SText>
                    </T2STouchableOpacity>
                )}
            </View>
        );
    }

    handleOnContentSizeChange(id, event) {
        if (id === VIEW_ID.DESCRIPTION) {
            this.setState({ descriptionInputHeight: event.nativeEvent.contentSize.height });
        }
    }

    renderTextInput(
        id,
        label,
        value,
        error = false,
        keyboardType = 'default',
        autoCapitalize = 'none',
        isRequired = false,
        maxlength = 160,
        autoCorrect = false,
        onFocus = null,
        onBlur = null,
        autoFocus = false
    ) {
        return (
            <View style={MyTicketStyle.textInputView}>
                <T2STextInput
                    screenName={screenName}
                    id={id}
                    label={label}
                    value={value}
                    maxLength={safeIntValue(maxlength)}
                    onChangeText={this.handleOnChangeText.bind(this, id)}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    error={error}
                    errorText={this.handleTextInputErrorText(id)}
                    required={isRequired}
                    multiline={id === VIEW_ID.DESCRIPTION}
                    scrollEnabled={id === VIEW_ID.DESCRIPTION}
                    minHeight={
                        Platform.OS === 'ios' && id === VIEW_ID.DESCRIPTION && maxLinesForComments
                            ? 20 * maxLinesForComments
                            : Platform.OS === 'android' && id === VIEW_ID.DESCRIPTION
                            ? this.state.descriptionInputHeight
                            : null
                    }
                    onContentSizeChange={this.handleOnContentSizeChange.bind(this, id)}
                    blurOnSubmit={true}
                    returnKeyType={'default'}
                    autoCorrect={autoCorrect}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    autoFocus={autoFocus}
                />
            </View>
        );
    }

    handleOnChangeText(id, text) {
        if (id === VIEW_ID.DESCRIPTION) {
            this.setState(
                {
                    description: text,
                    emptyDescriptionError: !isValidNotEmptyString(text)
                },
                this.handleSubmitButtonState
            );
        }
    }

    handleSubmitButtonState() {
        const { description } = this.state;
        this.setState({
            isSubmitButtonEnabled: isValidNotEmptyString(description)
        });
    }

    handleTextInputErrorText(id) {
        return id === VIEW_ID.DESCRIPTION ? LOCALIZATION_STRINGS.EMPTY_DESCRIPTION_ERROR : '';
    }

    handleSubmit() {
        const { description, isSubmitButtonEnabled } = this.state;
        const { profileResponse } = this.props;

        if (isSubmitButtonEnabled) {
            submitNewTicket(profileResponse, description);
            showInfoMessage(LOCALIZATION_STRINGS.SUBMIT_TICKET_SUCCESS_MSG);
            handleGoBack();
        } else {
            this.setState({ emptyDescriptionError: !isValidNotEmptyString(description) });
        }
    }
}
const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(MyTicketsScreen);
