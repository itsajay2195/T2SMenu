import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const OurRecommendationLoader = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={180} height={20} marginTop={20} />
            <SkeletonPlaceholder.Item flexDirection="column" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between" alignItems={'center'}>
                    <SkeletonPlaceholder.Item width={148} height={17} />
                    <SkeletonPlaceholder.Item width={40} height={16} marginTop={5} />
                    <SkeletonPlaceholder.Item width={68} height={46} marginTop={5} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={148} height={17} />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flexDirection="column" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between" alignItems={'center'}>
                    <SkeletonPlaceholder.Item width={148} height={17} />
                    <SkeletonPlaceholder.Item width={40} height={16} marginTop={5} />
                    <SkeletonPlaceholder.Item width={68} height={46} marginTop={5} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={148} height={17} />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flexDirection="column" flex={1} justifyContent="space-between">
                <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between" alignItems={'center'}>
                    <SkeletonPlaceholder.Item width={148} height={17} />
                    <SkeletonPlaceholder.Item width={40} height={16} marginTop={5} />
                    <SkeletonPlaceholder.Item width={68} height={46} marginTop={5} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={148} height={17} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default OurRecommendationLoader;
