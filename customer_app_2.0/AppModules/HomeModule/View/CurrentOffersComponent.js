import React from 'react';
import { FlatList, View } from 'react-native';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { Card } from 'react-native-paper';
import style from './Styles/CurrentOffersStyle';
import { VIEW_ID } from '../Utils/HomeConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { isValidElement, isValidString, isValidURL } from 't2sbasemodule/Utils/helpers';

const CurrentOffersComponent = (props) => {
    const { screenName, response, itemClicked } = props;
    const viewHierarchy = !isValidElement(response) ? null : (
        <View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={response}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item, index) => renderListItem(screenName, item, itemClicked, index, response.length)}
            />
        </View>
    );
    return viewHierarchy;
};

function renderListItem(screenName, item, itemClicked, index, count) {
    if (isValidElement(item) && isValidElement(item.item) && isValidString(item.item.image) && isValidURL(item.item.image)) {
        return (
            <T2STouchableOpacity
                screenName={screenName}
                activeOpacity={0.9}
                id={VIEW_ID.CURRENT_OFFERS}
                onPress={() => {
                    Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.CURRENT_OFFERS_ITEM_CLICK);
                    itemClicked(item);
                }}>
                <Card style={style.cardStyle}>
                    <T2SFastImage
                        style={style.imageStyle}
                        source={{ uri: item.item.image }}
                        screenName={screenName}
                        id={VIEW_ID.OFFER_IMAGE_VIEW}
                    />
                    {index + 1 < count ? (
                        <T2SView style={style.pageIndicatorOverlayView}>
                            <T2SView style={style.pageIndicatorView}>
                                <CustomIcon size={25} name={FONT_ICON.RIGHT_ARROW_2} />
                            </T2SView>
                        </T2SView>
                    ) : null}
                </Card>
            </T2STouchableOpacity>
        );
    }
    //TODO The below code commented for future purpose. If we need we can use it
    // let colors = [Colors.red, Colors.icon_purple, Colors.ratingGreen, Colors.secondary_color, Colors.blue];
    // const { name, description } = item;
    // return (
    //     <T2STouchableOpacity
    //         screenName={screenName}
    //         activeOpacity={0.9}
    //         id={VIEW_ID.CURRENT_OFFERS}
    //         onPress={() => {
    //             Analytics.logEvent(ANALYTICS_EVENTS.CURRENT_OFFERS_ITEM_CLICK);
    //             itemClicked(item);
    //         }}>
    //         <Card style={style.cardStyle}>
    //             <View style={[style.imageContainerStyle, { backgroundColor: colors[index % colors.length] }]}>
    //                 <View screenName={screenName} id={VIEW_ID.OFFER_IMAGE_HOLDER} />
    //                 <T2SText style={style.offerTextStyle} screenName={screenName} id={VIEW_ID.AVAIL_OFFER}>
    //                     15% Off
    //                 </T2SText>
    //             </View>
    //             <View style={style.contentContainerStyle}>
    //                 <T2SText style={style.titleStyle} screenName={screenName} id={VIEW_ID.OFFER_TITLE}>
    //                     {'Category' + index}
    //                 </T2SText>
    //                 <T2SText style={style.descriptionStyle} screenName={screenName} id={VIEW_ID.OFFER_DESC} numberOfLines={2}>
    //                     {'Item1, Item2, Item3'}
    //                 </T2SText>
    //             </View>
    //         </Card>
    //     </T2STouchableOpacity>
    // );
}
export default CurrentOffersComponent;
