import PropTypes from 'prop-types';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native';
import styles from '../View/Styles/MissingItemModelStyle';
import Modal from 'react-native-modal';
import React, { useCallback } from 'react';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from 't2sbasemodule/UI/CustomUI/CvvModal/Utils/CvvConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import { T2SDivider } from 't2sbasemodule/UI';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const MissingItemModel = ({ screenName, isVisible, requestClose, dialogCancelable, missingItems, cancelClicked, proceedClicked }) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={() => (dialogCancelable ? requestClose() : {})} onRequestClose={() => requestClose()}>
            {Platform.OS === 'android' ? (
                <View>
                    <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                </View>
            ) : null}
            <KeyboardAvoidingView
                style={styles.keyboardViewStyle}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                showsVerticalScrollIndicator={false}>
                <View style={styles.containerStyle}>
                    <T2SText id={VIEW_ID.VERIFY_CARD_TEXT} screenName={screenName} style={styles.modelTitleStyle}>
                        {LOCALIZATION_STRINGS.WARNING.toUpperCase()}
                    </T2SText>
                    <T2SText id={VIEW_ID.VERIFY_CARD_TEXT} screenName={screenName} style={styles.modelDescriptionStyle}>
                        {LOCALIZATION_STRINGS.ITEM_NOT_AVAILABLE_PRE_ORDER}
                    </T2SText>

                    <T2SText id={VIEW_ID.VERIFY_CARD_TEXT} screenName={screenName} style={styles.missingItemTextStyle}>
                        {LOCALIZATION_STRINGS.MISSING_ITEM_TEXT}
                    </T2SText>
                    <MissingItemFlatList missingItem={missingItems} />
                    <View style={styles.modalButtonContainer}>
                        <CancelButton screenName={screenName} cancelClicked={cancelClicked} />
                        <ProceedButton screenName={screenName} proceedClicked={proceedClicked} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const MissingItemFlatList = ({ missingItem }) => {
    return (
        <View style={styles.missingItemContainer}>
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={missingItem}
                renderItem={renderMissingListItem}
                ItemSeparatorComponent={() => <T2SDivider style={styles.paddingHorizontalStyle} />}
                useFlatList
            />
        </View>
    );
};

const renderMissingListItem = ({ item }) => {
    return (
        <T2SText style={styles.missingItemTextStyle}>
            {item.quantity} X {item.name}
        </T2SText>
    );
};

const CancelButton = React.memo(({ cancelClicked, screenName }) => {
    return (
        <T2SButton
            buttonTextStyle={styles.btnTextStyle}
            mode={'outlined'}
            buttonStyle={styles.cancelBtnStyle}
            onPress={cancelClicked}
            screenName={screenName}
            id={VIEW_ID.CANCEL_BUTTON}
            title={LOCALIZATION_STRINGS.CANCEL}
        />
    );
});

const ProceedButton = React.memo(({ screenName, proceedClicked }) => {
    const onPressEvent = useCallback(() => {
        if (isValidElement(proceedClicked)) {
            proceedClicked();
        }
    }, [proceedClicked]);
    return (
        <T2SButton
            buttonTextStyle={styles.btnTextStyle}
            buttonStyle={styles.payBtnStyle}
            onPress={onPressEvent}
            screenName={screenName}
            id={VIEW_ID.PAY_BUTTON}
            title={LOCALIZATION_STRINGS.PROCEED}
        />
    );
});

MissingItemModel.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    proceedClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
    requestClose: PropTypes.func.isRequired,
    dialogCancelable: PropTypes.bool,
    errorMsg: PropTypes.string,
    showError: PropTypes.bool
};
MissingItemModel.defaultProps = {
    dialogCancelable: true,
    showError: false,
    screenName: 'Missing Item Model'
};

export default React.memo(MissingItemModel);
