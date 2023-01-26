import { Platform, TextInput, View } from 'react-native';
import styles from '../../Style/SearchAddressStyle';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { Colors } from 't2sbasemodule/Themes';
import { VIEW_ID } from '../../../AddressModule/Utils/AddressConstants';
import { isValidElement, touchArea } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { Appbar } from 'react-native-paper';
import React from 'react';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

export const SearchHeader = React.memo(({ screenName, suggestion, reference, onChange, onClear, onBack }) => {
    return (
        <Appbar.Header style={Platform.OS === 'ios' ? styles.iosElevation : styles.androidElevation}>
            <View style={styles.searchHeaderContainer}>
                <CustomIcon style={styles.searchIcon} name={FONT_ICON.SEARCH} size={24} color={Colors.tabGrey} />
                <SearchInput suggestion={suggestion} reference={reference} onChange={onChange} screenName={screenName} />
                {suggestion.length > 0 && <CloseIcon onClear={onClear} screenName={screenName} />}
                <CancelButton onBack={onBack} screenName={screenName} />
            </View>
        </Appbar.Header>
    );
});

export const SearchInput = React.memo(({ suggestion, reference, onChange, screenName }) => {
    return (
        <TextInput
            {...setTestId(screenName, VIEW_ID.ADDRESS_SEARCH)}
            value={suggestion}
            ref={(ref) => isValidElement(reference) && reference(ref)}
            onChangeText={onChange}
            style={styles.searchInput}
            underlineColorAndroid="transparent"
            requestFocus={isValidElement(reference)}
            hitSlop={touchArea(0, 16, 0, 12)}
            placeholder={LOCALIZATION_STRINGS.SEARCH_FOR_AREA}
        />
    );
});

export const CloseIcon = React.memo(({ onClear, screenName }) => {
    return (
        <T2STouchableOpacity screenName={screenName} id={VIEW_ID.CLOSED_ICON} hitSlop={touchArea(0, 20, 0, 12)} onPress={onClear}>
            <CustomIcon style={styles.clearIcon} name={FONT_ICON.CLOSE} size={22} color={Colors.black} />
        </T2STouchableOpacity>
    );
});

export const CancelButton = React.memo(({ onBack, screenName }) => {
    return (
        <T2STouchableOpacity
            screenName={screenName}
            id={VIEW_ID.CANCEL_BTN}
            style={styles.cancelButtonContainer}
            onPress={onBack}
            hitSlop={touchArea(2, 20, 2, 20)}>
            <T2SText style={styles.cancelButton} screenName={screenName} id={VIEW_ID.CANCEL_TEXT}>
                {LOCALIZATION_STRINGS.CANCEL}
            </T2SText>
        </T2STouchableOpacity>
    );
});
