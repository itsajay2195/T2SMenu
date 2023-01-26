import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { NewMenuStyle } from '../Styles/NewMenuStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import React from 'react';

export const CategoryListComponent = ({ title, description, subCategoriesComaSeparated, onPress, screenName, subCategories, imageUrl }) => {
    return (
        <>
            <T2STouchableOpacity style={NewMenuStyle.listViewItem} onPress={onPress}>
                {/* <T2SView>
                            <Image
                                style={styles.listViewimageStyle}
                                resizeMethod="resize"
                                source={{
                                    uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg'
                                }}
                            />
                        </T2SView> */}
                <T2SView style={NewMenuStyle.listViewItemContentWrapper}>
                    <T2SView style={NewMenuStyle.flex1}>
                        <T2SText numberOfLines={1} style={NewMenuStyle.listViewItemTitleStyle}>
                            {title}
                        </T2SText>

                        {subCategoriesComaSeparated ? (
                            <T2SText style={NewMenuStyle.listTitleWrapper} numberOfLines={1}>
                                {subCategoriesComaSeparated}
                            </T2SText>
                        ) : null}
                        {description ? (
                            <T2SText style={NewMenuStyle.listTitleWrapper} numberOfLines={1}>
                                {description}
                            </T2SText>
                        ) : null}
                    </T2SView>

                    <T2SView style={NewMenuStyle.listViewItemRigtArrowIconWrapper}>
                        <T2SIcon
                            id={VIEW_ID.INFO_CON}
                            screenName={screenName}
                            icon={FONT_ICON.RIGHT_ARROW_2}
                            color={Colors.lightBlue}
                            size={15}
                        />
                    </T2SView>
                </T2SView>
            </T2STouchableOpacity>
        </>
    );
};
