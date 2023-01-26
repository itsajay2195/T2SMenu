import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Dimensions } from 'react-native';
const loader = Array(10).fill(0);
let windowWidth = Dimensions.get('window').width;

const MenuSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item width={100} height={20} marginTop={10} marginLeft={10} />
                        <SkeletonPlaceholder.Item flexDirection="row" flex={1} justifyContent="space-between">
                            <SkeletonPlaceholder.Item width={200} height={30} marginTop={10} marginLeft={10} />
                            <SkeletonPlaceholder.Item width={100} height={30} marginTop={10} marginRight={10} />
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export default MenuSkeletonLoader;

export const GridViewSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item marginHorizontal={5} height={250}>
                            <SkeletonPlaceholder.Item marginVertical={2} borderRadius={10} width={windowWidth / 2} height={200} />
                            <SkeletonPlaceholder.Item paddingVertical={10} marginTop={10} width={windowWidth / 3} height={20} />
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export const ListViewSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            {loader.map((index) => {
                return (
                    <Fragment key={index}>
                        <SkeletonPlaceholder.Item flexDirection="row" marginVertical={10} paddingVertical={10}>
                            {/* <SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item borderRadius={10} height={80} width={80} justifyContent={'center'} />
                            </SkeletonPlaceholder.Item> */}
                            <SkeletonPlaceholder.Item flex={1} marginLeft={5} width={'100%'} height={80}>
                                <SkeletonPlaceholder.Item padding={10} width={'20%'} />
                                <SkeletonPlaceholder.Item paddingVertical={10} width={'90%'} height={80}>
                                    <SkeletonPlaceholder.Item padding={10} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item margin={10}>
                                <SkeletonPlaceholder.Item padding={10} height={20} width={'20%'} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                    </Fragment>
                );
            })}
        </SkeletonPlaceholder>
    );
};

export const TakeAwayInfoBarSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            <Fragment>
                <SkeletonPlaceholder.Item marginVertical={10} paddingVertical={10}>
                    <SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item borderRadius={10} height={20} width={'80%'} justifyContent={'center'} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent={'space-between'} marginLeft={5} height={80}>
                        <SkeletonPlaceholder.Item paddingVertical={10} width={50} height={80}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item paddingVertical={10} width={50} height={80}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item paddingVertical={10} width={50} height={80}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </Fragment>
        </SkeletonPlaceholder>
    );
};

export const TopBarSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            <Fragment>
                <SkeletonPlaceholder.Item marginHorizontal={10} paddingVertical={10}>
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent={'space-between'}>
                        <SkeletonPlaceholder.Item width={'10%'} height={30}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item width={'60%'} height={30}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item width={'10%'} height={30}>
                            <SkeletonPlaceholder.Item padding={10} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </Fragment>
        </SkeletonPlaceholder>
    );
};

export const SwitchSkeletonLoader = () => {
    return (
        <SkeletonPlaceholder>
            <Fragment>
                <SkeletonPlaceholder.Item flex={1} height={50} flexDirection="row" justifyContent={'flex-end'} padding={10}>
                    <SkeletonPlaceholder.Item width={80}>
                        <SkeletonPlaceholder.Item padding={10} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </Fragment>
        </SkeletonPlaceholder>
    );
};
