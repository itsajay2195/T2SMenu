import React, { Component } from 'react';
import { View, TouchableNativeFeedback } from 'react-native';
import Colors from '../../../Themes/Colors';
import { style as styles } from './T2SSavedCardStyle';
import CustomIcon from '../../CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import propTypes from 'prop-types';
import T2SText from '../T2SText';

const { RADIO_BUTTON_SELECTED, RADIO_BUTTON_UNSELECTED } = FONT_ICON;
const getViewId = (view_id) => 'T2SSavedCard_' + view_id;

type prop = {};
export default class T2SSavedCard extends Component<prop> {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            card,
            selected,
            onPress,
            color,
            style,
            iconStyle,
            cardTypeStyle,
            cardholderNameStyle,
            cardNumberStyle,
            cardExpiryDateStyle,
            keyValue,
            screenName
        } = this.props;
        const { cardType, cardholderName, cardNumber, cardExpiryDate } = card;
        const icon = selected ? RADIO_BUTTON_SELECTED : RADIO_BUTTON_UNSELECTED;
        const viewId = {
            cardType: getViewId(`CARD_TYPE_${keyValue}`),
            cardholderName: getViewId(`CARDHOLDER_NAME_${keyValue}`),
            cardNumber: getViewId(`CARD_NUMBER_${keyValue}`),
            cardExpiryDate: getViewId(`CARD_EXPIRY_DATE_${keyValue}`)
        };
        return (
            <TouchableNativeFeedback onPress={onPress}>
                <View style={[styles.cardContainer, style]}>
                    <CustomIcon name={icon} color={color} style={[styles.radio, iconStyle]} />
                    <View style={[styles.leftSideCardContainer]}>
                        <T2SText id={viewId.cardType} screenName={screenName} style={[styles.cardTypeStyle, cardTypeStyle]}>
                            {cardType}
                        </T2SText>
                        <T2SText
                            id={viewId.cardholderName}
                            screenName={screenName}
                            style={[styles.cardholderNameStyle, cardholderNameStyle]}>
                            {cardholderName}
                        </T2SText>
                    </View>
                    <View style={styles.flex} />
                    <View style={[styles.rightSideCardContainer]}>
                        <T2SText id={viewId.cardNumber} screenName={screenName} style={[styles.cardNumberStyle, cardNumberStyle]}>
                            {cardNumber}
                        </T2SText>
                        <T2SText id={viewId.cardExpiryDate} screenName={screenName} style={[styles.cardExpiryStyle, cardExpiryDateStyle]}>
                            {cardExpiryDate}
                        </T2SText>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const emptyCard = {
    cardType: '',
    cardholderName: '',
    cardNumber: '',
    cardExpiryDate: ''
};
const doNothing = () => {};
const emptyStyle = {};

T2SSavedCard.defaultProps = {
    card: emptyCard,
    selected: false,
    onPress: doNothing,
    color: Colors.primaryColor,
    style: emptyStyle,
    iconStyle: emptyStyle,
    cardTypeStyle: emptyStyle,
    cardholderNameStyle: emptyStyle,
    cardNumberStyle: emptyStyle,
    cardExpiryDateStyle: emptyStyle,
    screenName: ''
};
const cardType = propTypes.exact({
    cardType: propTypes.string,
    cardholderName: propTypes.string,
    cardNumber: propTypes.string,
    cardExpiryDate: propTypes.string
});
T2SSavedCard.propTypes = {
    card: cardType,
    selected: propTypes.bool,
    onPress: propTypes.func,
    color: propTypes.string,
    style: propTypes.object,
    iconStyle: propTypes.object,
    cardTypeStyle: propTypes.object,
    cardholderNameStyle: propTypes.object,
    cardNumberStyle: propTypes.object,
    cardExpiryDateStyle: propTypes.object,
    screenName: propTypes.string.isRequired
};
