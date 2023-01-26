import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const loader = Array(10).fill(0);

const BasketShimmer = () => {
    return (
        <SkeletonPlaceholder>
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={30}>
                            <SkeletonPlaceholder.Item marginLeft={20}>
                                <SkeletonPlaceholder.Item width={180} height={20} borderRadius={4} />
                                <SkeletonPlaceholder.Item marginTop={6} width={140} height={20} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft={100} alignItems="flex-end">
                                <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export default BasketShimmer;
