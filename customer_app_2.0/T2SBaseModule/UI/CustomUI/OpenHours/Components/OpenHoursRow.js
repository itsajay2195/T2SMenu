import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import OpenHoursCell from './OpenHoursCell';
import styles from '../OpenHoursStyle';
import { isValidElement } from '../../../../Utils/helpers';

const OpenHoursRow = (props) => {
    const { rowData, screenName, id } = props;
    let isToday = isValidElement(rowData?.columnData[0]?.isToday) ? rowData?.columnData[0]?.isToday : false;
    return (
        isValidElement(rowData?.columnData) && (
            <View
                style={[styles.openHoursRowContainer, { backgroundColor: rowData?.bgColor }, rowData?.isHeader && styles.headerBorderStyle]}
                id={id}>
                {rowData?.columnData.map((item, index) => (
                    <OpenHoursCell
                        key={index}
                        isHeader={rowData?.isHeader}
                        isToday={isToday}
                        screenName={screenName}
                        cellData={item}
                        rowIndex={index}
                    />
                ))}
            </View>
        )
    );
};

OpenHoursRow.propTypes = {
    rowData: PropTypes.object.isRequired,
    screenName: PropTypes.string.isRequired
};

export default OpenHoursRow;
