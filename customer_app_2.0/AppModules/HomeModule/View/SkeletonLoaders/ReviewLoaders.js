import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ReviewLoaders = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item width={160} height={20} margin={10} />
                <SkeletonPlaceholder.Item width={100} height={20} margin={10} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item padding={10}>
                <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                    <SkeletonPlaceholder.Item width={100} height={17} marginTop={10} />
                    <SkeletonPlaceholder.Item width={60} height={15} marginTop={10} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={70} height={12} marginTop={5} />
                <SkeletonPlaceholder.Item flex={1} height={15} marginTop={5} />
                <SkeletonPlaceholder.Item flex={1} height={15} marginTop={5} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default ReviewLoaders;
