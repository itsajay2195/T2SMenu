import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const itemLoader = Array(2).fill(0);
const subTotalLoader = Array(2).fill(0);

const ViewOrderLoader = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={1000} height={35} marginTop={10} marginBottom={10} />
            <SkeletonPlaceholder.Item width={140} height={20} margin={10} />

            {itemLoader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item
                            flexDirection="row"
                            flex={1}
                            justifyContent="space-between"
                            marginTop={10}
                            marginHorizontal={10}>
                            <SkeletonPlaceholder.Item width={180} height={20} />
                            <SkeletonPlaceholder.Item width={40} height={20} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item width={140} height={20} marginTop={5} marginStart={50} />
                        <SkeletonPlaceholder.Item width={140} height={20} marginTop={5} marginStart={50} />
                        <SkeletonPlaceholder.Item width={1000} height={2} marginTop={10} />
                    </Fragment>
                );
            })}
            {subTotalLoader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item
                            flexDirection="row"
                            flex={1}
                            justifyContent="space-between"
                            marginTop={10}
                            marginHorizontal={10}>
                            <SkeletonPlaceholder.Item width={140} height={20} />
                            <SkeletonPlaceholder.Item width={40} height={20} />
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}

            <SkeletonPlaceholder.Item width={1000} height={2} marginTop={10} />
            <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between" marginTop={10} marginHorizontal={10}>
                <SkeletonPlaceholder.Item width={120} height={20} />
                <SkeletonPlaceholder.Item width={80} height={20} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default React.memo(ViewOrderLoader);
