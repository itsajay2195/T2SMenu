import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Dimensions } from 'react-native';

const OrderStatusSkeleton = () => {
    let deviceWidth = Dimensions.get('window').width - 20;
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
                width={deviceWidth - 50}
                height={20}
                marginLeft={10}
                marginTop={40}
                alignSelf="center"
                justifyContent="space-between"
            />
            <SkeletonPlaceholder.Item
                width={deviceWidth - 100}
                height={20}
                marginLeft={10}
                marginTop={10}
                alignSelf="center"
                justifyContent="space-between"
            />
            <SkeletonPlaceholder.Item width={75} height={75} marginTop={30} justifyContent="space-between" alignSelf="center" />
            <SkeletonPlaceholder.Item width={deviceWidth - 20} height={50} marginLeft={20} marginTop={40} />
            <SkeletonPlaceholder.Item flexDirection="row" marginTop={40} marginLeft={20}>
                <SkeletonPlaceholder.Item width={150} height={25} />
                <SkeletonPlaceholder.Item width={30} height={25} marginLeft={10} />
                <SkeletonPlaceholder.Item width={30} height={25} marginLeft={10} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default OrderStatusSkeleton;
