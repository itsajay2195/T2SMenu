import React from 'react';
import { View } from 'react-native';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { VIEW_ID } from '../../Utils/Constants';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';
import { styles } from '../../Style/TakeawayListWidgetStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

const TakeawayImageComponent = ({ screenName, itemName, isNewTakeaway, logoUrl }) => {
    const renderNewTakeawayLabel = () => {
        return (
            <T2SView style={styles.newTakeawayLabel}>
                <T2SText screenName={screenName} id={VIEW_ID.NEW_TAKEAWAY_TEXT} style={styles.newTakeawayText}>
                    {LOCALIZATION_STRINGS.NEW}
                </T2SText>
            </T2SView>
        );
    };

    return (
        <View>
            {isNewTakeaway && renderNewTakeawayLabel()}
            <T2SFastImage
                screenName={screenName}
                id={itemName + '_' + VIEW_ID.TAKEAWAY_IMAGE}
                source={logoUrl}
                defaultImage={
                    isFranchiseApp()
                        ? require('../../../../FranchiseApp/Images/no_image_small_pattern.png')
                        : require('../../../HomeModule/Utils/Images/no_image.png')
                }
                defaultImageStyle={styles.imageStyle}
                style={styles.imageStyle}
                resizeMode="contain"
            />
        </View>
    );
};

export default React.memo(TakeawayImageComponent);
