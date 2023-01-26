import React from 'react';
import CustomIcon from '../../CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { styles } from './Style/StarStyle';
import PropTypes from 'prop-types';
import T2SView from '../T2SView';
import Colors from '../../../Themes/Colors';
import SwipeableRating from 'react-native-swipeable-rating';
import { isValidElement } from '../../../Utils/helpers';

export default class Stars extends React.Component {
    state = {
        rating: this.props.starValue
    };

    handleRating = (rating) => {
        this.setState({ rating });
    };

    render() {
        const { screenName, id, size, onPress, totalStars, starContainerStyle, offsetFromLeft, emptyStarColor, emptyIcon } = this.props;
        const stars = [];

        stars.push(
            <SwipeableRating
                color={Colors.rating_yellow}
                emptyColor={isValidElement(emptyStarColor) ? emptyStarColor : Colors.rating_grey}
                emptyIcon={isValidElement(emptyIcon) ? emptyIcon : 'star'}
                size={size}
                rating={this.state.rating}
                minRating={1}
                maxRating={totalStars}
                xOffset={offsetFromLeft ? offsetFromLeft : 0}
                onPress={(value) => {
                    this.handleRating(value);
                    onPress(value);
                }}
            />
        );

        return (
            <T2SView screenName={screenName} id={id} style={starContainerStyle}>
                {stars}
            </T2SView>
        );
    }

    renderStar = ({ value }) => {
        const { size, starValue, onPress, activeStarColor, inActiveStarColor } = this.props;
        const color = value <= starValue ? activeStarColor.color : inActiveStarColor.color;
        return (
            <CustomIcon
                name={value <= starValue ? FONT_ICON.STAR_FILL : FONT_ICON.STAR_STROKE}
                color={color}
                size={size}
                onPress={() => {
                    onPress(value);
                }}
            />
        );
    };
}

Stars.propTypes = {
    onPress: PropTypes.func.isRequired,
    activeStarColor: PropTypes.string,
    inActiveStarColor: PropTypes.string,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    size: PropTypes.number
};

Stars.defaultProps = {
    totalStars: 5,
    size: 50,
    activeStarColor: Colors.secondary_color,
    inActiveStarColor: Colors.ashColor,
    starContainerStyle: styles.starContainerStyle
};
