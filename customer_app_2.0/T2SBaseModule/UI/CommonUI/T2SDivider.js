import * as React from 'react';
import { Divider } from 'react-native-paper';
import { customerAppTheme } from '../../../CustomerApp/Theme';

const T2SDivider = ({ style }) => {
    return <Divider style={[{ backgroundColor: customerAppTheme.colors.divider, height: 1 }, style]} />;
};

export default T2SDivider;
