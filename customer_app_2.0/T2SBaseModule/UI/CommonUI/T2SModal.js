import React from 'react';
import { Platform, StatusBar, Text, View, ViewPropTypes } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import styles from './Style/DialogModalStyle';
import { isEmpty, isNonEmptyString, isValidElement, isValidString } from '../../Utils/helpers';
import T2SButton from './T2SButton';
import Colors from '../../Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

const viewPropTypes = ViewPropTypes || View.propTypes;

const T2SModal = ({
    isVisible,
    requestClose,
    title,
    description,
    negativeButtonClicked,
    positiveButtonClicked,
    positiveButtonText,
    negativeButtonText,
    positiveButtonStyle,
    negativeButtonStyle,
    descriptionTextStyle,
    positiveButtonTextStyle,
    negativeButtonTextStyle,
    titleTextStyle,
    customView,
    onModalHide,
    dialogCancelable = true,
    titleCenter = false,
    textAllCaps = true,
    negativeButtonId = 'negativeButton',
    positiveButtonId = 'positiveButton',
    titleId = 'title',
    descriptionId = 'description',
    screenName = 'Modal',
    isTitleVisible = true
}) => {
    return (
        <View>
            <Modal
                isVisible={isVisible}
                onBackdropPress={() => (dialogCancelable ? requestClose() : {})}
                onRequestClose={() => requestClose()}
                onModalHide={() => (isValidElement(onModalHide) ? onModalHide() : {})}>
                {Platform.OS === 'android' ? (
                    <View>
                        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                    </View>
                ) : null}
                <View style={styles.modalContentContainerStyle}>
                    {!isEmpty(title) && isTitleVisible ? (
                        <T2SText
                            id={titleId}
                            screenName={screenName}
                            style={[
                                styles.modalHeaderStyle,
                                titleCenter ? styles.modalHeaderTitleCenter : styles.modalHeaderStyle,
                                titleTextStyle
                            ]}>
                            {title}
                        </T2SText>
                    ) : null}

                    {isValidElement(customView) ? (
                        customView
                    ) : isValidString(description) ? (
                        <T2SText id={descriptionId} screenName={screenName} style={[styles.modalDescriptionStyle, descriptionTextStyle]}>
                            {description}
                        </T2SText>
                    ) : null}
                    <View accessible={false} style={styles.modalButtonContainer}>
                        {isNonEmptyString(negativeButtonText) ? (
                            <T2SButton
                                buttonTextStyle={[styles.negativeButtonTextStyle, negativeButtonTextStyle]}
                                mode={'outlined'}
                                buttonStyle={[styles.negativeButtonStyle, negativeButtonStyle]}
                                onPress={negativeButtonClicked}
                                screenName={screenName}
                                id={negativeButtonId}
                                uppercase={textAllCaps}
                                color={Colors.white}
                                title={negativeButtonText}
                            />
                        ) : null}

                        {isNonEmptyString(negativeButtonText) && <View style={styles.buttonSpaceStyle} />}
                        <T2SButton
                            buttonTextStyle={[styles.buttonTextStyle, positiveButtonTextStyle]}
                            buttonStyle={[styles.positiveButtonStyle, positiveButtonStyle]}
                            onPress={positiveButtonClicked}
                            screenName={screenName}
                            id={positiveButtonId}
                            uppercase={textAllCaps}
                            title={positiveButtonText}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
T2SModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    negativeButtonText: PropTypes.string,
    positiveButtonText: PropTypes.string.isRequired,
    positiveButtonClicked: PropTypes.func.isRequired,
    negativeButtonClicked: PropTypes.func,
    requestClose: PropTypes.func.isRequired,
    positiveButtonStyle: viewPropTypes.style,
    negativeButtonStyle: viewPropTypes.style,
    positiveButtonTextStyle: Text.propTypes.style,
    negativeButtonTextStyle: Text.propTypes.style,
    descriptionTextStyle: Text.propTypes.style,
    titleTextStyle: Text.propTypes.style,
    dialogCancelable: PropTypes.bool,
    titleCenter: PropTypes.bool,
    textAllCaps: PropTypes.bool,
    customView: PropTypes.element,
    isTitleVisible: PropTypes.bool,
    negativeButtonId: PropTypes.string,
    positiveButtonId: PropTypes.string,
    titleId: PropTypes.string,
    descriptionId: PropTypes.string
};

export default React.memo(T2SModal);
