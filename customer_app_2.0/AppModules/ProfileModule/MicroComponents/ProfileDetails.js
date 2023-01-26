import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/ProfileStyles';
import { VIEW_ID } from '../Utils/ProfileConstants';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { Platform } from 'react-native';
import { LENGTH } from '../../AuthModule/Utils/AuthConstants';
import React, { useCallback } from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
let screenName = SCREEN_OPTIONS.PROFILE.route_name;
const ProfileDetails = ({
    value,
    showEmptyError,
    inValidError,
    viewId,
    labelId,
    errorText,
    invalidErrorText,
    handleOnChangeText,
    isFromModal = false
}) => {
    const OnChangedText = useCallback(
        (text) => {
            if (isValidElement(handleOnChangeText)) {
                handleOnChangeText(viewId, text);
            }
        },
        [viewId, handleOnChangeText]
    );
    return (
        <T2SView style={isFromModal ? styles.textInputViewStyle : styles.textInputContainer} id={viewId} screenName={screenName}>
            <T2STextInput
                screenName={screenName}
                id={viewId}
                label={labelId}
                value={value}
                onChangeText={OnChangedText}
                keyboardType={
                    viewId === VIEW_ID.EMAIL_ID_TEXT ? 'email-address' : Platform.OS === 'android' ? 'visible-password' : 'default'
                }
                autoCapitalize="none"
                maxLength={LENGTH.NAME_MAX_LENGTH}
                error={showEmptyError || inValidError}
                errorText={(showEmptyError && errorText) || (inValidError && invalidErrorText)}
                required={true}
                editable={viewId !== VIEW_ID.EXPORT_MAIL_TEXT}
            />
        </T2SView>
    );
};

export default React.memo(ProfileDetails);
