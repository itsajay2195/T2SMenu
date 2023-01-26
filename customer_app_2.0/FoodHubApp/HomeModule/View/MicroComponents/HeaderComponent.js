import React, { Component } from 'react';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { Platform, View } from 'react-native';
import styles from '../../Styles/HomeStyles';
import { connect } from 'react-redux';
import { redirectRouteAction, storeConfigResponseAction } from '../../../../CustomerApp/Redux/Actions';
import { selectCartItemsQuantity } from 'appmodules/BasketModule/Redux/BasketSelectors';
import BasketIcon from 'appmodules/HomeModule/View/components/BasketIcon';

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.totalItems !== nextProps.totalItems;
    }

    render() {
        const { backgroundColor, totalItems, navigation } = this.props;
        return (
            <View>
                <View style={[Platform.OS === 'ios' && { height: 45 }, { backgroundColor: backgroundColor }]} />
                <View style={Platform.OS === 'ios' && styles.headerView}>
                    <BaseComponent
                        showHeader={true}
                        showElevation={false}
                        navigation={navigation}
                        headerStyle={{ backgroundColor: backgroundColor }}
                        actions={
                            isValidElement(totalItems) && totalItems > 0 && <BasketIcon navigation={navigation} totalItems={totalItems} />
                        }
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    totalItems: selectCartItemsQuantity(state)
});

const mapDispatchToProps = {
    redirectRouteAction,
    storeConfigResponseAction
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
