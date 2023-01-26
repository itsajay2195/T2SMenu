import { VIEW_ID } from '../../Utils/Constants';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 't2sbasemodule/Themes/Colors';
import { styles } from '../../Style/TakeawaySearchListStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import React, { useCallback } from 'react';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export const OfferBannerListItem = React.memo(({ screenName, itemId, itemTitle, offerValue, offerMaxValue, onPress }) => {
    const onItemPress = useCallback(() => {
        if (isValidElement(onPress)) {
            onPress(offerValue, offerMaxValue);
        }
    }, [offerValue, offerMaxValue, onPress]);

    return (
        <T2STouchableOpacity accessible={false} screenName={screenName} id={VIEW_ID.OFFER_BANNER_VIEW} onPress={onItemPress}>
            <LinearGradient
                colors={itemId % 2 === 0 ? [Colors.mildPersianRed, Colors.mildRed] : [Colors.black, Colors.black]}
                useAngle={true}
                angle={itemId % 2 === 0 ? 93 : 270}
                style={styles.offerBannerItem}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.OFFER_BANNER_TEXT}
                    style={[styles.offerTitleText, itemId % 2 !== 0 && styles.customOfferText]}>
                    {itemTitle}
                </T2SText>
            </LinearGradient>
        </T2STouchableOpacity>
    );
});

export const SeeMoreButton = React.memo(({ screenName, onPress }) => {
    return (
        <T2STouchableOpacity onPress={onPress}>
            <LinearGradient
                style={styles.seeMoreContainer}
                colors={['#E8E8E8', '#CCCCCC']}
                start={{
                    x: 0,
                    y: 0.5
                }}
                end={{
                    x: 0,
                    y: 1
                }}>
                <T2SView
                    screenName={screenName}
                    id={VIEW_ID.SEE_MORE_TOUCHABLE}
                    accessible={false}
                    onPress={onPress}
                    style={styles.seeMoreView}>
                    <T2SIcon icon={FONT_ICON.FORK_SPOON} size={40} style={{ color: 'black', paddingBottom: 10 }} />
                    <T2SText style={styles.seeMoreText} screenName={screenName} id={VIEW_ID.SEE_MORE_TEXT}>
                        {LOCALIZATION_STRINGS.VIEW_MORE}
                    </T2SText>
                </T2SView>
            </LinearGradient>
        </T2STouchableOpacity>
    );
});
