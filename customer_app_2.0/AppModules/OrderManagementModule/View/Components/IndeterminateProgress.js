import React from 'react';
import { ProgressBar } from 'react-native-paper';
import styles from '../Styles/OrderStatusAnimationStyle';
import { Colors } from 't2sbasemodule/Themes';

const IndeterminateProgress = () => {
    return <ProgressBar indeterminate={true} style={styles.progressStyle} color={Colors.primaryColor} />;
};
export default React.memo(IndeterminateProgress);
