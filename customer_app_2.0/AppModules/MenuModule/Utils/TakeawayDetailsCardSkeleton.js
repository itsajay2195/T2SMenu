import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TakeawayDetailsCardSkeleton = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item width={150} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={15} marginTop={10} marginRight={10} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginRight={10} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={200} height={25} marginTop={10} marginLeft={10} />
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between" marginBottom={10}>
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginLeft={10} />
                <SkeletonPlaceholder.Item width={50} height={25} marginTop={10} marginRight={10} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default TakeawayDetailsCardSkeleton;
