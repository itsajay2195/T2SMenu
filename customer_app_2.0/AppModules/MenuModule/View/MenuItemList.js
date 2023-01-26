import React, { Component } from 'react';
import { View, NativeModules, LayoutAnimation } from 'react-native';
import Styles from './Styles/MenuStyle';
import { isValidElement, isValidString, isValidURL } from 't2sbasemodule/Utils/helpers';
import { isNoOfferItem } from '../../BasketModule/Utils/BasketHelper';
import QuantityButton from './Components/QuantityButton';
import { connect } from 'react-redux';
import { menuItemId } from '../Redux/MenuAction';
import _ from 'lodash';
import {
    MenuItemImage,
    MenuItemDescription,
    MenuItemName,
    MenuItemOffer,
    MenuItemPrice
} from './Components/MicroComponents/MenuItemComponents';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class MenuItemList extends Component {
    constructor(props) {
        super(props);
        this.handleImageAction = this.handleImageAction.bind(this);
        this.state = {
            itemId: null
        };
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { itemId } = this.state;
        const {
            name,
            screenName,
            secondLanguage,
            description,
            price,
            image,
            item_id,
            category_id,
            isFromReOrderItem,
            collectionType,
            deliveryType
        } = this.props;
        return (
            name !== nextProps.name ||
            screenName !== nextProps.screenName ||
            secondLanguage !== nextProps.secondLanguage ||
            description !== nextProps.description ||
            price !== nextProps.price ||
            image !== nextProps.image ||
            item_id !== nextProps.item_id ||
            category_id !== nextProps.category_id ||
            isFromReOrderItem !== nextProps.isFromReOrderItem ||
            collectionType !== nextProps.collectionType ||
            deliveryType !== nextProps.deliveryType ||
            (!isValidElement(nextProps.itemId) && this.props.itemId === item_id) ||
            (!isValidElement(this.props.itemId) && nextProps.itemId === item_id) ||
            (isValidElement(nextProps.itemId) && this.props.itemId === item_id) ||
            (isValidElement(nextProps.itemId) && nextProps.itemId === nextProps.item_id) ||
            (isFromReOrderItem && this.props.itemId === itemId) ||
            itemId !== nextState.itemId
        );
    }
    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { itemId } = props;
        if (itemId !== state.itemId) {
            value.itemId = itemId;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        const { itemId } = this.state;
        if (isValidElement(prevState) && prevState.itemId !== itemId) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    render() {
        const { item, image, description } = this.props;
        return (
            <View>
                {isValidURL(image) ? (
                    this.checkIsFullView(item) ? (
                        <View>
                            {this.renderImage()}
                            {this.renderDetailsWithoutImage()}
                        </View>
                    ) : (
                        <View style={Styles.itemContainer}>
                            {this.renderImage()}
                            {isValidString(description) ? this.renderDetailsContainsImage() : this.renderDetailsWithoutDescription()}
                        </View>
                    )
                ) : (
                    this.renderDetailsWithoutImage()
                )}
            </View>
        );
    }

    renderImage() {
        const { screenName, item, image } = this.props;
        return (
            <MenuItemImage
                image={image}
                id={item.id}
                isFromReOrderItem={isValidElement(item.isFromReOrderItem) ? item.isFromReOrderItem : null}
                screenName={screenName}
                isFullView={this.checkIsFullView(item)}
                onPress={this.handleImageAction}
            />
        );
    }

    renderDetailsWithoutImage() {
        const { offer, description, item } = this.props;
        return (
            <View style={[Styles.fullViewItemContainer, this.checkIsFullView(item) ? { marginVertical: 12 } : { marginBottom: 12 }]}>
                {isValidString(description) ? (
                    isValidString(offer) && !isNoOfferItem(offer) ? (
                        <View style={Styles.flexColumn}>
                            <View style={{ marginTop: 5 }}>
                                {this.renderName(false)}
                                {this.renderDescription(false)}
                            </View>
                            <View style={{ paddingRight: 12 }}>{this.renderOfferPriceQuantityContainer()}</View>
                        </View>
                    ) : (
                        <View style={[Styles.flexColumn, { marginRight: 12, marginTop: 12 }]}>
                            <View style={Styles.flexRow}>
                                <View style={{ flex: 6.5 }}>{this.renderName(false)}</View>
                            </View>
                            {this.renderDescription(false)}
                            <View style={{ flex: 3.5 }}>{this.renderOfferPriceQuantityContainer(false)}</View>
                        </View>
                    )
                ) : (
                    <View style={Styles.contentContainer}>
                        <View style={{ flex: isValidString(offer) && !isNoOfferItem(offer) ? 4 : 6.5 }}>{this.renderName(false)}</View>
                        <View>{this.renderOfferPriceQuantityContainer()}</View>
                    </View>
                )}
            </View>
        );
    }

    renderDetailsContainsImage() {
        return (
            <View style={Styles.fullViewItemContainer}>
                <View style={Styles.flexColumn}>
                    <View>
                        {this.renderName(true)}
                        {this.renderDescription(true)}
                    </View>
                    {this.renderOfferPriceQuantityContainer()}
                </View>
            </View>
        );
    }

    renderDetailsWithoutDescription() {
        const { offer } = this.props;
        return (
            <View style={[Styles.fullViewItemContainer, { justifyContent: 'space-between' }]}>
                {isValidString(offer) && !isNoOfferItem(offer) ? (
                    <View style={Styles.flexColumn}>
                        {this.renderName()}
                        {this.renderOfferPriceQuantityContainer()}
                    </View>
                ) : (
                    <View style={Styles.flexColumn}>
                        <View>{this.renderName(true)}</View>
                        <View>{this.renderOfferPriceQuantityContainer()}</View>
                    </View>
                )}
            </View>
        );
    }

    renderOfferPriceQuantityContainer(isFlex = false) {
        const { offer, price, screenName, item } = this.props;
        return (
            <View style={[Styles.rowReverse, isFlex && { flex: 1 }]}>
                {this.renderQuantityButton(screenName, item)}
                {this.renderPrice(screenName, price)}
                {this.renderOffer(screenName, offer)}
            </View>
        );
    }

    renderName(isWithImage) {
        const { name, secondLanguage, description, screenName } = this.props;
        return (
            <MenuItemName
                screenName={screenName}
                isWithImage={isWithImage}
                description={description}
                name={name}
                secondLanguage={secondLanguage}
            />
        );
    }

    renderDescription(isWithImage) {
        const { description, screenName } = this.props;
        if (isValidString(description)) {
            return <MenuItemDescription screenName={screenName} isWithImage={isWithImage} description={description} />;
        }
    }

    renderOffer(screenName, offer) {
        if (isValidString(offer) && !isNoOfferItem(offer)) {
            return <MenuItemOffer screenName={screenName} offer={offer} />;
        }
    }

    renderPrice(screenName, price) {
        return <MenuItemPrice screenName={screenName} price={price} />;
    }

    renderQuantityButton() {
        const { deliveryType, collectionType, screenName, item, isFromReOrder, isFromPreviousOrder } = this.props;
        return (
            <QuantityButton
                item={item}
                collectionType={collectionType}
                deliveryType={deliveryType}
                screenName={screenName}
                isFromReOrder={isFromReOrder}
                isFromPreviousOrder={isFromPreviousOrder}
            />
        );
    }

    checkIsFullView(item) {
        const { itemId } = this.state;
        const { orderId } = this.props;
        if (isValidElement(item)) {
            if (isValidElement(item.isFromReOrderItem) && isValidElement(orderId)) {
                return this.getRecentOrderId(item.id, orderId) === itemId;
            } else {
                return item.id === itemId;
            }
        }
    }
    handleImageAction(id, isFromReOrderItem) {
        const { itemId } = this.state;
        const { orderId } = this.props;
        if (isValidElement(isFromReOrderItem) && isValidElement(orderId)) {
            // to handle the recent order
            const recentOrderId = this.getRecentOrderId(id, orderId);
            if (recentOrderId === itemId) {
                this.props.menuItemId(null);
            } else {
                this.props.menuItemId(recentOrderId);
            }
        } else {
            // to handle the menu item
            if (id === itemId) {
                this.props.menuItemId(null);
            } else {
                this.props.menuItemId(id);
            }
        }
    }

    getRecentOrderId(id, orderId) {
        return id + '' + orderId;
    }
}

const mapStateToProps = (state) => ({
    itemId: state.menuState.itemId
});

const mapDispatchToProps = {
    menuItemId
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemList);
