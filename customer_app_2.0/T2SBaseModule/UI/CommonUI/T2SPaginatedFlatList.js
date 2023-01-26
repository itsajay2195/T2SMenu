import T2SRefreshControl from './T2SRefreshControl';
import React, { useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';

/**
 * Sample Template
 <T2SPaginatedFlatList
    screenName={screenName}
    id={}
    keyExtractor={}
    data={}
    renderItem={}
    onPageEnd={}
    onRefresh={}
 />
 **/

const T2SPaginatedFlatList = (props) => {
    const { screenName, refreshAutomationId, onPageEnd, onRefresh } = props;
    const [refreshing, setRefreshing] = useState(false);

    if (refreshing) {
        setRefreshing(false);
    }
    return (
        <SwipeListView
            {...props}
            onRefresh={null}
            refreshControl={
                <T2SRefreshControl
                    screenName={screenName}
                    id={refreshAutomationId}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        onRefresh();
                    }}
                />
            }
            onEndReached={onPageEnd}
            onEndReachedThreshold={0.7}
        />
    );
};

export default T2SPaginatedFlatList;
