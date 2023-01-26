import React, { useRef } from 'react';
import T2SView from './T2SView';
import T2SText from './T2SText';

const containerStyle = {
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
};

const textStyle = { color: 'white', fontSize: 14 };

const T2SRenderCount = () => {
    if (__DEV__) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const renderCount = useRef(0);
        renderCount.current = renderCount.current + 1;
        return (
            <T2SView style={containerStyle}>
                <T2SText style={textStyle}>{String(renderCount.current)}</T2SText>
            </T2SView>
        );
    }
    return null;
};

export default T2SRenderCount;
