import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const loader = Array(5).fill(0);

const TakeawayShimmer = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={1000} height={3} marginBottom={10} />
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between" marginHorizontal={15}>
                <SkeletonPlaceholder.Item width={200} height={20} borderRadius={4} />
                <SkeletonPlaceholder.Item width={100} height={20} borderRadius={4} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={1000} height={3} marginTop={10} marginBottom={10} />
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={15} justifyContent="space-between" marginTop={10}>
                            <SkeletonPlaceholder.Item width={105} height={105} borderRadius={4} />
                            <SkeletonPlaceholder.Item flex={1} marginHorizontal={10}>
                                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={5}>
                                    <SkeletonPlaceholder.Item width={160} height={20} borderRadius={4} marginHorizontal={5} />
                                    <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} />
                                </SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item marginStart={5} width={140} height={20} borderRadius={4} marginTop={5} />
                                <SkeletonPlaceholder.Item marginTop={5} flexDirection="row" justifyContent="space-between">
                                    <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} marginHorizontal={5} />
                                    <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} marginEnd={15} />
                                </SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item marginStart={5} width={100} height={20} borderRadius={4} marginTop={5} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item
                            marginTop={10}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            marginHorizontal={15}>
                            <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={3} height={20} marginHorizontal={10} />
                            <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={3} height={20} marginHorizontal={10} />
                            <SkeletonPlaceholder.Item width={20} height={20} borderRadius={4} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item width={1000} height={3} marginTop={10} />
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export default TakeawayShimmer;
