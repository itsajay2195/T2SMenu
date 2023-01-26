import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors } from 't2sbasemodule/Themes';
const loader = Array(2).fill(0);

const BasketRecommendationShimmer = () => {
    return (
        <SkeletonPlaceholder>
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" height={70} backgroundColor={Colors.white}>
                            <SkeletonPlaceholder.Item marginLeft={20}>
                                <SkeletonPlaceholder.Item width={160} height={20} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item alignItems="flex-end" flexDirection="row" marginLeft={50}>
                                <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} />
                                <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} marginLeft={20} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export default BasketRecommendationShimmer;
