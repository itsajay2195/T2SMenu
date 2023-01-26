import React from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import RepeatAddOnWidget from './RepeatAddOnWidget';
import {
    selectAddOnModalVisibility,
    selectItemAddOnCatID,
    selectLastAddOnID,
    selectLastAddOnItemQuantity,
    selectLastReOrderAddons,
    selectLastReOrderItemMenu,
    selectResourceIDsOfBasket
} from '../../../BasketModule/Redux/BasketSelectors';
import { addOrRemoveItemToBasketAction, repeatAddOnAction } from '../../../BasketModule/Redux/BasketAction';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { getDataForRepeatAddOn, isNoOfferItem } from '../../../BasketModule/Utils/BasketHelper';
import { REPEAT_ADD_ON } from '../../Utils/MenuConstants';
import { constructAddOnCategoryObject } from '../../Utils/MenuHelpers';

const RepeatAddOnContainer = (props) => {
    const navigation = useNavigation();
    const ID = props.lastAddOnID;
    const resIDs = props.resourceIDS;
    const reOrderAddOns = props.reOrderAddOns;

    if ((isValidElement(resIDs) || isValidElement(reOrderAddOns)) && isValidElement(ID)) {
        let data;
        if (isValidElement(props.reOrderMenuItem) && reOrderAddOns.length > 0) {
            data = {
                item: props.reOrderMenuItem,
                addOns: reOrderAddOns
            };
        } else if (isValidElement(resIDs)) {
            data = getDataForRepeatAddOn(resIDs, ID);
        }

        if (isValidElement(data)) {
            const { item, addOns } = data;
            return (
                <RepeatAddOnWidget
                    isModalVisible={props.isVisible}
                    itemName={item.name}
                    featureGateResponse={props.featureGateResponse}
                    lastOrderAddOnHistory={addOns}
                    onRepeatLastPressed={() => {
                        props.repeatAddOnAction(false);
                        const qty = props.lastAddOnItemQuantity;
                        if (isValidElement(item)) {
                            props.addOrRemoveItemToBasketAction(
                                ID,
                                qty,
                                ADD_BUTTON_CONSTANT.ADD,
                                item,
                                false,
                                getAddons(reOrderAddOns, resIDs, item, addOns),
                                REPEAT_ADD_ON.REPEAT
                            );
                        }
                    }}
                    onAddOnPressed={() => {
                        let addOnCatId;
                        if (isValidElement(item.item_addon_cat)) {
                            addOnCatId = item.item_addon_cat;
                        } else {
                            //for re-order
                            addOnCatId = props.addOnCatID;
                        }
                        const addOnCategoryGroup = constructAddOnCategoryObject(addOnCatId);
                        if (!isValidElement(addOnCategoryGroup)) return;
                        props.repeatAddOnAction(false);
                        const qty = props.lastAddOnItemQuantity;
                        if (isValidElement(item)) {
                            navigation.navigate(SCREEN_OPTIONS.MENU_ADD_ON.route_name, {
                                screen: SCREEN_OPTIONS.MENU_ADD_ON.route_name,
                                params: {
                                    addOnCategoryId: item.item_addon_cat,
                                    name: item.name,
                                    itemId: ID,
                                    addOnCategoryGroup,
                                    selectedItem: item,
                                    quantity: qty,
                                    fromHome: props.fromHome
                                }
                            });
                        }
                    }}
                    onBackdropPress={() => {
                        props.repeatAddOnAction(false);
                    }}
                    onBackButtonPress={() => {
                        props.repeatAddOnAction(false);
                    }}
                />
            );
        }
    }

    return null;
};

const getAddons = (reOrderAddOns, resIDs, item, addOns) => {
    //If it's from re-order addons
    if (reOrderAddOns.length > 0) {
        const resID = resIDs.find((element) => element.id === item.id);
        if (isValidElement(resID)) {
            return isNoOfferItem(item.offer) ? undefined : addOns;
        } else {
            //post request, if it's from re-order addons
            return addOns.length > 0 ? addOns : undefined;
        }
    } else {
        return isNoOfferItem(item.offer) ? undefined : addOns;
    }
};

const mapStateToProps = (state) => ({
    isVisible: selectAddOnModalVisibility(state),
    lastAddOnID: selectLastAddOnID(state),
    lastAddOnItemQuantity: selectLastAddOnItemQuantity(state),
    resourceIDS: selectResourceIDsOfBasket(state),
    addOnCatID: selectItemAddOnCatID(state),
    reOrderAddOns: selectLastReOrderAddons(state),
    reOrderMenuItem: selectLastReOrderItemMenu(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse
});

const mapDispatchToProps = {
    repeatAddOnAction,
    addOrRemoveItemToBasketAction
};
export default connect(mapStateToProps, mapDispatchToProps)(RepeatAddOnContainer);
