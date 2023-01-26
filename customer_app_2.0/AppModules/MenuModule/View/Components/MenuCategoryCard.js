import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

export const ListViewComponent = ({ item }) => {
    console.log('hello');
    const { title } = item;
    return (
        <>
            {title.length > 0 ? (
                <TouchableOpacity style={styles.listViewItem}>
                    <Image
                        style={styles.listViewimageStyle}
                        resizeMethod="resize"
                        source={{
                            uri:
                                'https://images.squarespace-cdn.com/content/v1/53b839afe4b07ea978436183/1608506169128-S6KYNEV61LEP5MS1UIH4/traditional-food-around-the-world-Travlinmad.jpg'
                        }}
                    />
                    <Text numberOfLines={1} style={styles.listViewItemTitleStyle}>
                        {title}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </>
    );
};

export const GridViewComponent = ({ item }) => {
    const { title } = item;
    return (
        <>
            {title.length > 0 ? (
                <TouchableOpacity style={styles.gridViewItem}>
                    <View style={styles.gridViewImageWrapper}>
                        <Image
                            style={styles.gridViewimageStyle}
                            resizeMethod="resize"
                            source={{
                                uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg'
                            }}
                        />
                    </View>
                    <Text numberOfLines={1} style={[styles.gridViewItemTitleStyle]}>
                        {title}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </>
    );
};

// const ListViewMenuCategoryCard = ({ navigation, category, getSubCategories }) => {
//     return (
//         <TouchableOpacity onPress={() => navigation.navigate(SCREEN_OPTIONS. NEW_MENU_ITEM_SCREEN.route_name)} activeOpacity={1} style={styles.listViewContainer}>
//             <T2SImage
//                 style={styles.categoryImage}
//                 resizeMode={'cover'}
//                 source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg' }}
//             />
//             <View style={styles.categorydetails}>
//                 <T2SText style={styles.title}>{category.title}</T2SText>
//                 <T2SText style={{ ...styles.subCategories, ...styles.listSubCategories }} numberOfLines={1}>
//                     {getSubCategories(category.data).join(', ')}
//                 </T2SText>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const GridViewMenuCategoryCard = ({ navigation, category, getSubCategories }) => {
//     return (
//         <TouchableOpacity onPress={() => navigation.navigate(SCREEN_OPTIONS. NEW_MENU_ITEM_SCREEN.route_name)} activeOpacity={1} style={styles.gridViewContainer}>
//             {/* <T2SImage
//                 style={styles.categoryImage}
//                 resizeMode={'cover'}
//                 source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg' }}
//             /> */}
//             <View style={styles.categorydetails}>
//                 <T2SText style={styles.title}>{category.title}gv</T2SText>
//                 {/* <T2SText style={{ ...styles.subCategories, ...styles.listSubCategories }} numberOfLines={1}>
//                     {getSubCategories(category.data).join(', ')}
//                 </T2SText> */}
//             </View>
//         </TouchableOpacity>
//     );
// };

const styles = StyleSheet.create({
    // listViewContainer: {
    //     paddingHorizontal: 10,
    //     flex: 1,
    //     paddingVertical: 15,
    //     borderBottomColor: customerAppTheme.colors.divider,
    //     borderBottomWidth: 1,
    //     flexDirection: 'row'
    // },
    // gridViewContainer: {
    //     width: '100%',
    //     borderWidth: 1
    // },
    // categorydetails: {
    //     flex: 1
    // },
    // title: {
    //     fontSize: setFont(16),
    //     color: Colors.primaryTextColor,
    //     fontFamily: FONT_FAMILY.BOLD,
    //     fontWeight: '600',
    //     paddingBottom: 10
    // },
    // subCategories: {
    //     fontSize: setFont(13),
    //     fontFamily: FONT_FAMILY.REGULAR,
    //     color: Colors.secondaryTextColor,
    //     fontWeight: '400'
    // },
    // listSubCategories: {
    //     paddingBottom: 10
    // },
    // categoryImage: {
    //     height: '100%',
    //     width: '15%',
    //     borderBottomLeftRadius: 10,
    //     borderBottomRightRadius: 10,
    //     borderTopLeftRadius: 10,
    //     borderTopRightRadius: 10,
    //     marginRight: 10
    // },
    // gridCategoryImage: {
    //     height: windowHeight * 0.2,
    //     width: '100%',
    //     marginBottom: 10,
    //     marginRight: 0
    // }
    container: {
        flex: 1
    },
    listViewItem: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginVertical: 10
    },
    gridViewItem: {
        flex: 1,
        height: 120,
        justifyContent: 'center'
    },
    listItemContainer: {
        margin: 20
    },
    takeAwayNameWrapper: {
        flex: 1,
        marginVertical: 10,
        justifyContent: 'center',
        paddingVertical: 10
    },
    takeawayNameStyle: {
        fontWeight: 'bold',
        fontSize: 24
    },
    headerContainerStyle: { flexDirection: 'row', alignItems: 'center' },
    headerGridWrpperStyle: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center' },
    switchStyle: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
    gridViewimageStyle: { borderRadius: 10, height: 80, width: 80 },
    listViewimageStyle: { borderRadius: 10, height: 40, width: 40 },
    gridViewImageWrapper: { display: 'flex', alignItems: 'center' },
    gridViewItemTitleStyle: { fontWeight: 'bold', paddingVertical: 5 },
    listViewItemTitleStyle: { fontWeight: 'bold', padding: 10 },
    backIcon: {
        fontSize: 25,
        padding: 10
    }
});
