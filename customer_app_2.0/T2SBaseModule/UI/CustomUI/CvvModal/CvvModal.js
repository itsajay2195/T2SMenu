import React, { useCallback, useState } from 'react';
import { Platform, StatusBar, View, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import styles from './Style/CvvStyle';
import { VIEW_ID } from './Utils/CvvConstants';
import T2SText from '../../CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import T2SView from '../../CommonUI/T2SView';
import T2STextInput from '../../CommonUI/T2STextInput';
import T2SButton from '../../CommonUI/T2SButton';
import { isValidString } from '../../../Utils/helpers';

const CvvModal = ({ screenName, isVisible, requestClose, dialogCancelable, cancelClicked, payClicked, errorMsg }) => {
    const [cvv, setCvv] = useState('');
    const [cvvError, setCvvError] = useState(false);

    const closeModal = useCallback(() => {
        requestClose();
        cancelClicked();
        setCvv('');
    }, [requestClose, cancelClicked, setCvv]);

    const onPayButtonClicked = useCallback(() => {
        let validCvv = cvv.replace(/\D/g, '');
        setCvvError(cvv.length < 3 || !isValidString(validCvv));
        payClicked(cvv);
        setCvv('');
    }, [setCvvError, cvv, payClicked]);
    return (
        <Modal isVisible={isVisible} onBackdropPress={dialogCancelable ? closeModal : {}} onRequestClose={closeModal}>
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
                        {LOCALIZATION_STRINGS.VERIFY_CARD}
                    </T2SText>
                    <T2SView screenName={screenName} id={VIEW_ID.CVV_TEXT_INPUT}>
                        <CvvTextInput
                            screenName={screenName}
                            value={cvv}
                            errorMsg={errorMsg}
                            showError={cvvError}
                            setCvv={setCvv}
                            setCvvError={setCvvError}
                        />
                    </T2SView>
                    <View style={styles.modalButtonContainer}>
                        <CancelButton screenName={screenName} cancelClicked={closeModal} />

                        <PayButton screenName={screenName} payClicked={onPayButtonClicked} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const CvvTextInput = React.memo(({ screenName, value, errorMsg, showError, setCvv, setCvvError }) => {
    const onCvvChanged = (data) => {
        let cvv = data.replace(/\D/g, '');
        setCvv(cvv);
        if (cvv.length >= 3) {
            setCvvError(false);
        }
    };

    return (
        <T2STextInput
            screenName={screenName}
            id={VIEW_ID.CVV_TEXT_INPUT}
            label={LOCALIZATION_STRINGS.ENTER_CVV}
            value={value}
            onChangeText={onCvvChanged}
            autoFocus={true}
            keyboardType={'numeric'}
            secureTextEntry={false}
            maxLength={4}
            error={showError}
            errorText={isValidString(errorMsg) ? errorMsg : LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_CVV}
            required={true}
        />
    );
});

const PayButton = React.memo(({ payClicked, screenName }) => {
    return (
        <T2SButton
            buttonTextStyle={styles.btnTextStyle}
            buttonStyle={styles.payBtnStyle}
            onPress={() => payClicked()}
            screenName={screenName}
            id={VIEW_ID.PAY_BUTTON}
            title={LOCALIZATION_STRINGS.PAY}
        />
    );
});

const CancelButton = React.memo(({ screenName, cancelClicked }) => {
    return (
        <T2SButton
            buttonTextStyle={styles.btnTextStyle}
            mode={'outlined'}
            buttonStyle={styles.cancelBtnStyle}
            onPress={() => cancelClicked()}
            screenName={screenName}
            id={VIEW_ID.CANCEL_BUTTON}
            title={LOCALIZATION_STRINGS.CANCEL}
        />
    );
});

CvvModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    payClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
    onCvvChange: PropTypes.func.isRequired,
    requestClose: PropTypes.func.isRequired,
    dialogCancelable: PropTypes.bool,
    errorMsg: PropTypes.string,
    showError: PropTypes.bool
};
CvvModal.defaultProps = {
    dialogCancelable: true,
    showError: false,
    screenName: 'Verify Card'
};

export default React.memo(CvvModal);
