import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { ADD_BUTTON_CONSTANT, ADD_BUTTON_VIEW_ID } from './Utils/AddButtonConstant';
import { DEFAULT_ITEM_COUNT, DEFAULT_MAX_LIMIT } from './Utils/AddButtonConfig';
import styles from './AddButtonStyle';
import { showErrorMessage } from '../../../Network/NetworkHelpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { defaultTouchArea } from '../../../Utils/helpers';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import QuantityAddAndMinusButton from './MicroComponent/QuantityAndAddButton';
import T2SView from '../../CommonUI/T2SView';
import Colors from '../../../Themes/Colors';
/**
 * How to use item add button widget?
 * Step 1: import AddButton.js
 * Step 2: Declare an state array for maintaining item count along with item id
 * Step 3: Define a function to receive and update count and item id
 * Step 4: Add widget code in your JSX code and pass below param as props
 * @param {itemCount:string, itemId:string, onUpdateCount:func, maxQuantity:number, disableAddButton:bool, screenName:string, showPlainAddButton:bool} props
 * Sample Code:
 * import ItemAddButtonWidget from 't2sbasemodule/UI/CustomUI/ItemAddButton/AddButton';
 * const [menuItems, setMenuItems] = useState([{itemId: 'item-0001', itemCount: 0}]);
 * const updateItemCount = (count, itemId)  => {
        const updatedItems = menuItems.map(item => {
            if(item.itemId === itemId)
                return {...item, itemCount: count}
            else
                return item
        });
        setMenuItems(updatedItems);
    };
 * JSX:
 * <ItemAddButtonWidget
 itemCount={menuItems[0].itemCount}
 itemId={menuItems[0].itemId}
 maxQuantity={99}
 onUpdateCount={updateItemCount}
 disableAddButton={false}
 screenName={SCREEN_NAME.HOME_SCREEN}
 showPlainAddButton={false}
 />
 */

const ItemAddButton = (props) => {
    const { quantity, itemId, onUpdateCount, maxQuantity, disableAddButton, screenName, itemName, itemNotAvailable, orderType } = props;
    const orderTypeString = orderType === ORDER_TYPE.COLLECTION ? LOCALIZATION_STRINGS.COLLECTION : LOCALIZATION_STRINGS.DELIVERY;
    const updateItemCount = (type) => {
        if (!props.networkConnected) {
            showErrorMessage(LOCALIZATION_STRINGS.GENERIC_ERROR_MSG, null, Colors.persianRed);
            return;
        }
        if (!props.disableAddButton) {
            if (type === ADD_BUTTON_CONSTANT.ADD) {
                if (quantity < maxQuantity) onUpdateCount(quantity + 1, itemId, type);
            } else {
                onUpdateCount(quantity - 1, itemId, type);
            }
        } else if (itemNotAvailable) {
            showErrorMessage(LOCALIZATION_STRINGS.ITEM_NOT_AVAILABLE + ' ' + orderTypeString);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW);
        }
    };

    return (
        <View style={[styles.itemAddContainer, disableAddButton && { opacity: 0.5 }]}>
            {quantity > 0 ? (
                <Fragment>
                    <QuantityAddAndMinusButton
                        screenName={screenName}
                        id={ADD_BUTTON_VIEW_ID.MINUS_BUTTON + '_' + itemName}
                        disableAddButton={disableAddButton}
                        onPress={updateItemCount.bind(this, ADD_BUTTON_CONSTANT.MINUS)}
                        quantity={quantity}
                        isMinus={true}
                    />

                    <T2SView screenName={screenName} id={ADD_BUTTON_VIEW_ID.COUNT_TEXT + '_' + itemName} style={styles.countTextView}>
                        <T2SText screenName={screenName} id={ADD_BUTTON_VIEW_ID.COUNT_TEXT + '_' + itemName} style={styles.textStyle}>
                            {quantity}
                        </T2SText>
                    </T2SView>
                    <QuantityAddAndMinusButton
                        screenName={screenName}
                        id={ADD_BUTTON_VIEW_ID.ADD_BUTTON + '_' + itemName}
                        onPress={updateItemCount.bind(this, ADD_BUTTON_CONSTANT.ADD)}
                    />
                </Fragment>
            ) : (
                <T2STouchableOpacity
                    screenName={screenName}
                    id={ADD_BUTTON_VIEW_ID.ADD_BUTTON + '_' + itemName}
                    onPress={updateItemCount.bind(this, ADD_BUTTON_CONSTANT.ADD)}
                    hitSlop={defaultTouchArea()}>
                    <View style={disableAddButton ? [styles.addButtonBgView, styles.disableOpacityStyle] : styles.addButtonBgView}>
                        <Text style={styles.textStyle}>{LOCALIZATION_STRINGS.ADD.toUpperCase()}</Text>
                    </View>
                </T2STouchableOpacity>
            )}
        </View>
    );
};

ItemAddButton.propTypes = {
    quantity: PropTypes.number.isRequired, // quantity is not passed it will be considered as zero by default
    onUpdateCount: PropTypes.func.isRequired,
    itemId: PropTypes.number.isRequired,
    maxQuantity: PropTypes.number,
    disableAddButton: PropTypes.bool,
    screenName: PropTypes.string.isRequired,
    showPlainAddButton: PropTypes.bool,
    networkConnected: PropTypes.bool
};

ItemAddButton.defaultProps = {
    quantity: DEFAULT_ITEM_COUNT,
    maxQuantity: DEFAULT_MAX_LIMIT,
    disableAddButton: false,
    networkConnected: true
};

export default React.memo(ItemAddButton);
