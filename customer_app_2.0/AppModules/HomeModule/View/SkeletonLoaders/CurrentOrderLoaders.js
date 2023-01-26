import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CurrentOrderLoaders = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="column" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
                    <SkeletonPlaceholder.Item width={110} height={16} margin={10} />
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
                        <SkeletonPlaceholder.Item width={20} height={16} margin={10} />
                        <SkeletonPlaceholder.Item width={50} height={16} marginTop={10} marginRight={10} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
                        <SkeletonPlaceholder.Item width={20} height={15} marginTop={10} marginLeft={10} />
                        <SkeletonPlaceholder.Item width={50} height={15} margin={10} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item width={60} height={15} flex={1} margin={10} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flex={1} height={80} margin={10} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default CurrentOrderLoaders;
