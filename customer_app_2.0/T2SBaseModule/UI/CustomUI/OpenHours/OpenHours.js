import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';

import styles from './OpenHoursStyle';
import * as OpenHoursHelper from './Utils/OpenHoursHelper';
import OpenHoursRow from './Components/OpenHoursRow';
import { connect } from 'react-redux';
import { isValidElement } from '../../../Utils/helpers';

/**
 * How to use Opening Hours Widget?
 * Step 1: import OpenHours.js
 * Step 2: Add widget code in your JSX code and pass below param as props
 * @param {openHoursData:object, screenName:string, showPlainAddButton:bool} props
 * Sample Code:
 * import import OpenHoursWidget from 't2sbasemodule/UI/CustomUI/OpenHours/OpenHours';
 * JSX:
 * <OpenHoursWidget openHoursData={openHoursData} screenName={SCREEN_NAME.HOME_SCREEN} />
 */

const OpenHours = (props) => {
    const { openHoursData, screenName, timeZone, showFullData, id } = props;
    if (isValidElement(openHoursData) && isValidElement(timeZone)) {
        const openHoursFormattedDate = OpenHoursHelper.getOpenHoursFormattedDate(openHoursData, timeZone, showFullData);

        return (
            <View style={styles.openHoursContainer}>
                {openHoursFormattedDate.map((item, index) => (
                    <OpenHoursRow key={index} rowData={item} screenName={screenName} id={id} />
                ))}
            </View>
        );
    }
    return null;
};

OpenHours.propTypes = {
    openHoursData: PropTypes.object.isRequired,
    screenName: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    timeZone: selectTimeZone(state)
});

export default connect(mapStateToProps)(OpenHours);
