import React, { Component } from 'react';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { ADD_ON_TYPE, VIEW_ID } from '../../Utils/MenuConstants';
import Styles from '../Styles/AddOnStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getAddOnPrice, getAddonText, getModifiedTextStyle } from '../../Utils/MenuHelpers';
import { T2SCheckBox, T2SRadioButton } from 't2sbasemodule/UI';
import { View } from 'react-native';

class AddOnItem extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (
            this.props.screenName !== nextProps.screenName ||
            this.props.currency !== nextProps.currency ||
            this.props.addOn !== nextProps.addOn ||
            this.props.addOn?.type !== nextProps.addOn?.type ||
            this.props.addOn?.id !== nextProps.addOn?.id
        );
    }
    render() {
        let { currency, addOn, screenName, onPress } = this.props;
        return (
            <T2STouchableOpacity
                id={VIEW_ID.ADD_ON_CHECKBOX + addOn.name.toString()}
                screenName={screenName}
                onPress={onPress}
                style={Styles.itemContainer}>
                <T2SText
                    id={VIEW_ID.ADD_ON_CHECKBOX + addOn.name}
                    screenName={screenName}
                    style={[Styles.itemFontStyle, getModifiedTextStyle(addOn.modifier), Styles.itemStyle]}>
                    {getAddonText(addOn)}
                </T2SText>
                <View style={Styles.amountContainer}>
                    <T2SText
                        id={VIEW_ID.ADD_ON_CHECKBOX + addOn.price}
                        screenName={screenName}
                        style={[Styles.itemFontStyle, Styles.amountText]}>
                        {getAddOnPrice(addOn, currency)}
                    </T2SText>
                    {(addOn.type === ADD_ON_TYPE.MULTI || addOn.type === ADD_ON_TYPE.TICK) && (
                        <T2SCheckBox id={VIEW_ID.ADD_ON_CHECKBOX} screenName={screenName} status={addOn.isSelected} onPress={onPress} />
                    )}
                    {addOn.type === ADD_ON_TYPE.RADIO && (
                        <T2SRadioButton id={VIEW_ID.ADD_ON_RADIO} screenName={screenName} status={addOn.isSelected} onPress={onPress} />
                    )}
                </View>
            </T2STouchableOpacity>
        );
    }
}
export default AddOnItem;
