import React from 'react';
import { FlatList, Modal, TouchableWithoutFeedback, View } from 'react-native';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import listPopupStyle from './Styles/ListPopupStyles';
import { SCREEN_NAME, VIEW_ID } from '../Utils/TableReservationConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';

export const TimeSlotListPopup = ({ title, inputData, visible, onModelRowItemClicked, onRequestClose }) => {
    const renderListSeparator = () => {
        return <View style={listPopupStyle.itemSeparator} />;
    };

    const renderRowValue = ({ item }) => {
        return (
            <T2STouchableOpacity style={listPopupStyle.listItemStyle} onPress={() => onModelRowItemClicked(item)}>
                <View>
                    <View style={listPopupStyle.innerListItemStyle}>
                        <T2SText id={VIEW_ID.LIST_ITEM} screenName={SCREEN_NAME.LIST_POPUP} style={listPopupStyle.listItemText}>
                            {item}
                        </T2SText>
                    </View>
                </View>
            </T2STouchableOpacity>
        );
    };

    return (
        <Modal onRequestClose={onRequestClose} visible={visible} animationType="fade" transparent>
            <View style={listPopupStyle.bgStyle}>
                <TouchableWithoutFeedback onPress={onRequestClose}>
                    <View style={listPopupStyle.rootContainerStyle}>
                        <View style={listPopupStyle.innerContainerStyle}>
                            <View style={listPopupStyle.dynamicHeightStyle}>
                                <T2STouchableOpacity onPress={onRequestClose}>
                                    <CustomIcon name={FONT_ICON.CLOSE} size={15} style={listPopupStyle.closeIconStyle} />
                                </T2STouchableOpacity>
                            </View>
                            <View style={listPopupStyle.headerViewStyle}>
                                <T2SText
                                    id={VIEW_ID.LIST_POPUP_TITLE}
                                    screenName={SCREEN_NAME.LIST_POPUP}
                                    style={listPopupStyle.headerTextStyle}>
                                    {title}
                                </T2SText>
                            </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                data={inputData}
                                ItemSeparatorComponent={renderListSeparator}
                                renderItem={renderRowValue}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};
