import React from 'react';
import { View } from 'react-native';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import Styles from '../Styles/MenuStyle';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { T2SText } from 't2sbasemodule/UI';

const SubCatImageComponent = ({ imageUrl, itemId, screenName, imageText }) => {
    return (
        <View>
            <T2SFastImage
                source={{ uri: imageUrl }}
                style={Styles.subCatImage}
                id={VIEW_ID.SUB_CATEGORY + itemId?.toString()}
                screenName={screenName}
            />
            <View style={Styles.subCatShadowView}>
                <T2SText
                    numberOfLines={1}
                    id={VIEW_ID.SUB_CATEGORY + imageText?.toString()}
                    screenName={screenName}
                    style={[Styles.subCategoryStyle, Styles.shbCatShadowViewText]}>
                    {imageText?.toUpperCase()}
                </T2SText>
            </View>
        </View>
    );
};
export default React.memo(SubCatImageComponent);
