import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { T2SModal } from 't2sbasemodule/UI';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { useNavigation } from '@react-navigation/native';
import { editFromBasketAction } from '../../../BasketModule/Redux/BasketAction';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { redirectRouteAction } from '../../../../CustomerApp/Redux/Actions';
import { selectEditFromBasketPopUpVisibility } from '../../../BasketModule/Redux/BasketSelectors';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';

const AddOnsItemPopup = ({ editFromBasketAction, isUserLoggedIn, redirectRouteAction, isVisible }) => {
    const navigation = useNavigation();

    const handleAddOnsItemPositiveButtonClicked = useCallback(() => {
        editFromBasketAction(false);
        if (isUserLoggedIn) {
            navigation.navigate(SCREEN_OPTIONS.BASKET.route_name);
        } else {
            redirectRouteAction(SCREEN_OPTIONS.BASKET.route_name);
            navigation.navigate(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        }
    }, [editFromBasketAction, isUserLoggedIn, navigation, redirectRouteAction]);

    const handleAddOnsItemNegativeButtonClicked = useCallback(() => {
        editFromBasketAction(false);
    }, [editFromBasketAction]);

    return (
        <T2SModal
            isVisible={isVisible}
            positiveButtonText={LOCALIZATION_STRINGS.BASKET}
            positiveButtonClicked={handleAddOnsItemPositiveButtonClicked}
            negativeButtonClicked={handleAddOnsItemNegativeButtonClicked}
            requestClose={handleAddOnsItemNegativeButtonClicked}
            title={''}
            description={LOCALIZATION_STRINGS.ADD_ON_DECREMENT_QUANTITY_WARNING}
        />
    );
};

const mapStateToProps = (state) => ({
    isVisible: selectEditFromBasketPopUpVisibility(state),
    isUserLoggedIn: selectHasUserLoggedIn(state)
});

const mapDispatchToProps = {
    editFromBasketAction,
    redirectRouteAction
};
export default connect(mapStateToProps, mapDispatchToProps)(AddOnsItemPopup);
