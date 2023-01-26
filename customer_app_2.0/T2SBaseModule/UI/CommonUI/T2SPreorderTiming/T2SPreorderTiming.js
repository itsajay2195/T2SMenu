import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import T2SPreorderTimingWidget from './T2SPreorderTimingWidget';
import * as Analytics from '../../../../AppModules/AnalyticsModule/Analytics';
import propTypes from 'prop-types';
import { CONSTANTS } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { isValidElement } from '../../../Utils/helpers';
import { ANALYTICS_SCREENS, ANALYTICS_EVENTS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { connect } from 'react-redux';
import { selectPreOrderASAP } from '../../../Utils/AppSelectors';

let timeOut;

class T2SPreorderTiming extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1
        };

        this.handleItemClicked = this.handleItemClicked.bind(this);
    }

    componentDidMount() {
        const { dates, initialTime } = this.props;
        if (initialTime !== CONSTANTS.IMMEDIATELY) {
            let index = dates.indexOf(initialTime);
            if (index !== -1) {
                this.setState({ selectedIndex: index });
                timeOut = setTimeout(() => {
                    this.flatListRef && this.flatListRef.scrollToIndex({ animated: false, index: this.state.selectedIndex });
                }, 300);
            }
        }
    }
    componentWillUnmount() {
        if (isValidElement(this.timeout)) {
            clearTimeout(timeOut);
        }
    }

    handleItemClicked(date, index, isPreOrderASAP = false) {
        this.setState({ selectedIndex: index });
        Analytics.logEvent(ANALYTICS_SCREENS.QC_GET_IT_BY, ANALYTICS_EVENTS.PRE_ORDER_TIMING_CLICK, { date });
        this.props.onPress(date, isPreOrderASAP);
    }

    getItemLayout = (data, index) => ({ length: 80, offset: 85 * index, index });
    renderItem = ({ item, index }) => {
        const { screenName, isPreOrderASAP } = this.props;
        return (
            <T2SPreorderTimingWidget
                selected={index === this.state.selectedIndex}
                screenName={screenName}
                date={item}
                onPress={this.handleItemClicked}
                isPreOrderASAP={isPreOrderASAP && index === 0}
            />
        );
    };

    render() {
        const { dates } = this.props;
        return (
            <FlatList
                ref={(ref) => {
                    this.flatListRef = ref;
                }}
                getItemLayout={this.getItemLayout}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={dates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
            />
        );
    }
}

T2SPreorderTiming.defaultProps = {
    onPress: () => {},
    dates: [],
    screenName: ''
};
T2SPreorderTiming.propTypes = {
    onPress: propTypes.func,
    dates: propTypes.array,
    screenName: propTypes.string
};

const mapStateToProps = (state) => ({
    isPreOrderASAP: selectPreOrderASAP(state)
});

export default connect(mapStateToProps)(T2SPreorderTiming);
