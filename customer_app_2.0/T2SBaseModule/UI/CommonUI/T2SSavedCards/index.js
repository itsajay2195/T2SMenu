import React, { Component } from 'react';
import { View } from 'react-native';
import Colors from '../../../Themes/Colors';
import T2SSavedCard from './T2SSavedCard';
import propTypes from 'prop-types';
import * as Analytics from '../../../../AppModules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../../AppModules/AnalyticsModule/AnalyticsConstants';

type prop = {};
export default class T2SSavedCards extends Component<prop> {
    constructor(props) {
        super(props);
        this.state = {
            selectedCard: null
        };
    }

    onPress(card, selectedCard) {
        this.setState({ selectedCard });
        Analytics.logEvent(ANALYTICS_SCREENS.SAVED_CARDS, ANALYTICS_EVENTS.SELECT_SAVED_CARD, { card: selectedCard });
        this.props.onSelectCard(card);
    }

    render() {
        const { selectedCard } = this.state;
        const {
            cards,
            color,
            style,
            iconStyle,
            cardTypeStyle,
            cardholderNameStyle,
            cardNumberStyle,
            cardExpiryDateStyle,
            screenName
        } = this.props;
        return (
            <View>
                {cards &&
                    cards.map((card, key) => (
                        <T2SSavedCard
                            key={key}
                            keyValue={key}
                            screenName={screenName}
                            card={card}
                            selected={selectedCard === key}
                            color={color}
                            style={style}
                            iconStyle={iconStyle}
                            cardTypeStyle={cardTypeStyle}
                            cardholderNameStyle={cardholderNameStyle}
                            cardNumberStyle={cardNumberStyle}
                            cardExpiryDateStyle={cardExpiryDateStyle}
                            onPress={() => this.onPress(card, key)}
                        />
                    ))}
            </View>
        );
    }
}

const doNothing = () => {};
const emptyStyle = {};

T2SSavedCards.defaultProps = {
    cards: [],
    onSelectCard: doNothing,
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
T2SSavedCards.propTypes = {
    card: propTypes.arrayOf(cardType),
    onSelectCard: propTypes.func,
    color: propTypes.string,
    style: propTypes.object,
    iconStyle: propTypes.object,
    cardTypeStyle: propTypes.object,
    cardholderNameStyle: propTypes.object,
    cardNumberStyle: propTypes.object,
    cardExpiryDateStyle: propTypes.object,
    screenName: propTypes.string.isRequired
};
