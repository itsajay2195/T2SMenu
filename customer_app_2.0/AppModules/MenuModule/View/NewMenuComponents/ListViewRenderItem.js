import React, { useCallback, memo } from 'react';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { ListViewSkeletonLoader } from '../../Utils/MenuSkeletonLoader';
import { CategoryListComponent } from '../NewMenuComponents/CategoryListComponent';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import PreviousOrderComponent from '../../../HomeModule/View/PreviousOrderComponent';
import Styles from '../Styles/MenuStyle';
import Colors from 't2sbasemodule/Themes/Colors';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';

const screenName = SCREEN_OPTIONS.NEW_MENU_CATEGORY_SCREEN.route_name;
let bestSellingData;
const PreviousOrdersList = () => {
    return (
        <T2SView>
            {bestSellingData ? (
                <T2SView style={Styles.likeIconStyle}>
                    <T2SIcon
                        id={VIEW_ID.LIKE_ICON}
                        screenName={screenName}
                        icon={FONT_ICON.LIKE}
                        color={Colors.suvaGrey}
                        style={Styles.searchIconStyle}
                        size={22}
                    />
                    <T2SText id={VIEW_ID.BEST_SELLING_ITEMS_VIEW} screenName={screenName} style={Styles.bestSellingHeaderText}>
                        {LOCALIZATION_STRINGS.TA_RECOMMENDATION}
                    </T2SText>
                </T2SView>
            ) : null}
            <PreviousOrderComponent
                screenName={screenName}
                previousOrderResponse={bestSellingData}
                isFromBestSelling={true}
                selectedOrderType={bestSellingData}
                isNewMenuBestSelling={true}
            />
        </T2SView>
    );
};

const ListViewRenderItem = React.memo(
    ({ item, takeAwayTitle, cuisines, rating, isLoading, getSubCategories, bestSellingDataOuterScope }) => {
        bestSellingData = bestSellingDataOuterScope;
        const { title, description } = item;
        let subCategoriesComaSeparated = getSubCategories(item.data).join(', ');
        let subCategoriesData = getSubCategories(item.data);
        const categoryOnPress = useCallback(() => {
            handleNavigation(
                !subCategoriesData.length > 3
                    ? SCREEN_OPTIONS.NEW_MENU_SUBCAT_SCREEN.route_name
                    : SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name,
                {
                    takeAwayTitle: takeAwayTitle,
                    item: item,
                    title: title,
                    cuisines: cuisines,
                    rating: rating
                }
            );
        }, [cuisines, item, rating, subCategoriesData.length, takeAwayTitle, title]);

        if (item.title === 'row') {
            return <PreviousOrdersList item={item} />;
        }

        return (
            <>
                {title.length > 0 && !isLoading ? (
                    <CategoryListComponent
                        screenName={screenName}
                        title={title}
                        description={description}
                        subCategoriesComaSeparated={subCategoriesComaSeparated}
                        onPress={categoryOnPress}
                    />
                ) : (
                    <ListViewSkeletonLoader />
                )}
            </>
        );
    }
);

export default memo(ListViewRenderItem);
