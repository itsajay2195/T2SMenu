import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PreviousOrderLoader = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item width={160} height={20} margin={10} />
                <SkeletonPlaceholder.Item width={100} height={20} margin={10} />
                <SkeletonPlaceholder.Item width={100} height={20} margin={10} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item padding={10}>
                <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                    <SkeletonPlaceholder.Item width={160} height={100} margin={10} />

                    <SkeletonPlaceholder.Item width={160} height={100} margin={10} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default PreviousOrderLoader;
