import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { SizedBox, T2SAppBar, T2SIcon } from 't2sbasemodule/UI';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../Styles/FreeItemStyles';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import { connect } from 'react-redux';
import { isValidElement, makeHapticFeedback } from 't2sbasemodule/Utils/helpers';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { addOrRemoveItemToBasketAction, updateFreeItemClickAction } from '../../Redux/BasketAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HapticFrom } from 't2sbasemodule/Utils/Constants';
import { debounce } from 'lodash';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { isAdvancedDiscount, isOnlineDiscountApplied } from '../../Utils/BasketHelper';
import { selectBasketViewResponse } from '../../Redux/BasketSelectors';
import GiftItemsComponent from '../Components/MicroComoponent/GiftItemsComponent';

class FreeItemsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            freeItems: []
        };
        this.renderItemList = this.renderItemList.bind(this);
    }

    componentDidMount() {
        let { freeItems } = this.props.route.params;
        if (isValidElement(freeItems)) this.setState({ freeItems });
    }

    render() {
        return (
            <SafeAreaView style={styles.rootContainer}>
                <T2SAppBar title={LOCALIZATION_STRINGS.GIFT_ITEM} />
                {this.renderDisclaimerWarning()}
                {this.renderTitle()}
                <SizedBox style={styles.sizedBoxStyle} height={6} />
                {this.renderList()}
            </SafeAreaView>
        );
    }

    renderTitle() {
        return (
            <T2SView style={styles.titleContainerStyle}>
                <T2SText style={styles.titleTextStyle} screenName={SCREEN_NAME.FREE_ITEM_LIST} id={VIEW_ID}>
                    {LOCALIZATION_STRINGS.SELECT_YOUR_FREE_ITEM}
                </T2SText>
            </T2SView>
        );
    }

    /**
     * When the advanced discount applicable for the takeaway and the online discount is applied to the cart
     * then we have to display this warning message
     * @returns {JSX.Element}
     */
    renderDisclaimerWarning() {
        let { storeConfigDiscountType, basketResponse } = this.props;
        if (isAdvancedDiscount(storeConfigDiscountType) && isOnlineDiscountApplied(basketResponse)) {
            return (
                <View style={styles.warningContainer}>
                    <T2SIcon icon={FONT_ICON.ALERT} color={Colors.orange} size={24} />
                    <T2SText screenName={SCREEN_NAME.BASKET_SCREEN} id={VIEW_ID.WARNING_TEXT} style={styles.warningText}>
                        {LOCALIZATION_STRINGS.DISCLAIMER_WARNING_MSG}
                    </T2SText>
                </View>
            );
        }
    }

    renderList() {
        return (
            this.state.freeItems.length > 0 && (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.freeItems}
                    renderItem={this.renderItemList}
                    keyExtractor={(item) => item.id}
                />
            )
        );
    }

    renderItemList({ item }) {
        return (
            <GiftItemsComponent
                handleItemClicked={this.handleItemClicked}
                itemId={item.id}
                itemName={item.name}
                itemSecondLanguageName={item.second_language_name}
                itemDescription={item.description}
            />
        );
    }

    handleItemClicked = debounce(
        (itemId) => {
            //TODO Add-on flow not yet handled for free item. Need to handle if required
            const { freeItems } = this.state;
            const item = isValidElement(freeItems) ? freeItems.find((Item) => Item.id === itemId) : {};
            this.props.updateFreeItemClickAction(true);
            this.props.addOrRemoveItemToBasketAction(item.id, 1, ADD_BUTTON_CONSTANT.ADD, item, false, undefined, undefined, true);
            this.props.navigation.pop();
            makeHapticFeedback(this.props.featureGateResponse, HapticFrom.ITEM_ADDED);
        },
        1000,
        { leading: true, trailing: false }
    );
}

const mapStateToProps = (state) => ({
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    basketResponse: selectBasketViewResponse(state),
    storeConfigDiscountType: state.appState.storeConfigResponse?.discount_type
});
const mapDispatchToProps = {
    addOrRemoveItemToBasketAction,
    updateFreeItemClickAction
};
export default connect(mapStateToProps, mapDispatchToProps)(FreeItemsList);
