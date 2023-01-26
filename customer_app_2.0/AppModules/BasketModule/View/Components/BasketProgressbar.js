import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { ProgressBar } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { selectBasketLoader } from '../../Redux/BasketSelectors';

const BasketProgressbar = ({ basketLoader }) => {
    if (basketLoader) {
        return <ProgressBar color={Colors.secondary_color} indeterminate={true} />;
    }
    return <View style={{ height: 4 }} />;
};

function propCheck(prevProps, nextProps) {
    return prevProps.basketLoader === nextProps.basketLoader;
}
const mapStateToProps = (state) => ({
    basketLoader: selectBasketLoader(state)
});
export default connect(mapStateToProps, null)(React.memo(BasketProgressbar, propCheck));
