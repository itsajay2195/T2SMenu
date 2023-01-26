import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CurrentOffersLoader = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item width={270} height={200} margin={10} />
                <SkeletonPlaceholder.Item width={270} height={200} margin={10} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default CurrentOffersLoader;
