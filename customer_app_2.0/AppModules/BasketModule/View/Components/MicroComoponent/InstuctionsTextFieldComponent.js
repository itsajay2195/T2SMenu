import { T2STextInput } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import React from 'react';

const InstuctionsTextFieldComponent = ({ screenName, allergyInfo, ref, onEndEditing, onFocus, onBlur, onChangeText }) => {
    return (
        <>
            <T2STextInput
                dense={true}
                inputRef={ref}
                blurOnSubmit={true}
                returnKeyType="done"
                label={LOCALIZATION_STRINGS.ENTER_INSTRUCTIONS}
                screenName={screenName}
                id={VIEW_ID.INSTRUCTION_TEXT_INPUT}
                onEndEditing={onEndEditing}
                onFocus={onFocus}
                onBlur={onBlur}
                value={allergyInfo}
                onChangeText={onChangeText}
                autoCapitalize={'sentences'}
                autoCorrect={true}
                multiline={true}
            />
        </>
    );
};

export default React.memo(InstuctionsTextFieldComponent);
