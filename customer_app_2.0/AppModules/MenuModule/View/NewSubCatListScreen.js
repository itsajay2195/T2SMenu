import { Text, SafeAreaView, FlatList } from 'react-native';
import React, { useState, useCallback } from 'react';
import TopBarComponent from './NewMenuComponents/TopBarComponent';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { NewMenuSubCategoryStyle, MenuCategoryItemsStyle } from './Styles/NewMenuStyle';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { CategoryListComponent } from './NewMenuComponents/CategoryListComponent';

const screenName = SCREEN_OPTIONS.NEW_MENU_SUBCAT_SCREEN.route_name;
//const NO_ITEMS_PER_SCREEN = 5;
let formattedData, setCategoryOuterScope, setSearchTextInputOuterScope, setHeightOuterScope, heightValueOuterScope;
//const defaultSubCatIamge = require('../../../FoodHubApp/Images/default_image_bg.png');

const searchOperation = (text, setSubCatItems) => {
    if (text.length > 0) {
        const formattedQuery = text.toLowerCase();
        const newData = formattedData.filter((catItem) => catItem.name.toLowerCase().includes(formattedQuery));
        setSubCatItems(newData);
    } else {
        setSubCatItems(formattedData);
    }
};
const clearSearch = (setCatItems, setSearchTextInput) => {
    setCatItems(formattedData);
    setSearchTextInput('');
};

const filterResults = (text) => {
    setSearchTextInputOuterScope(text);
    searchOperation(text, setCategoryOuterScope);
};

const renderSubcatListItem = ({ item }) => {
    return <SubcatListItem item={item} />;
};

//todo: add image when subcat image is available
const SubcatListItem = ({ item }) => {
    const { name, description, image } = item;

    const subcatOnPress = useCallback(() => {
        handleNavigation(SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name, {
            item: { title: name, data: [item] }
        });
    }, [item, name]);
    return (
        <CategoryListComponent
            title={name}
            subCategories={item}
            description={description}
            imageUrl={image}
            screenName={screenName}
            onPress={subcatOnPress}
        />
    );
};

const onLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    if (!heightValueOuterScope) {
        setHeightOuterScope(height);
    }
};

const itemSeparatorComponentFlatlist = () => <T2SView style={NewMenuSubCategoryStyle.itemSeparator} />;

const NewSubCatListScreen = (props) => {
    const { route } = props;
    const { item, title, description } = route.params;
    const [searchTextInput, setSearchTextInput] = useState('');
    const [subCatItems, setSubCatItems] = useState(item.data);
    const [flexHeight, setHeight] = useState(null);
    setHeightOuterScope = setHeight;
    heightValueOuterScope = flexHeight;
    formattedData = item.data;
    setCategoryOuterScope = setSubCatItems;
    setSearchTextInputOuterScope = setSearchTextInput;
    const onClearPress = useCallback(() => clearSearch(setSubCatItems, setSearchTextInput), [setSubCatItems, setSearchTextInput]);
    return (
        <SafeAreaView style={NewMenuSubCategoryStyle.container}>
            <TopBarComponent
                searchTextInput={searchTextInput}
                setSearchTextInput={filterResults}
                clearSearch={onClearPress}
                placeholderText={'Search Subcategories...'}
            />
            <T2SView style={NewMenuSubCategoryStyle.categoryHeaderContainer}>
                <Text style={MenuCategoryItemsStyle.subCatHeaderText}>{title}</Text>
            </T2SView>
            {description ? (
                <T2SView style={MenuCategoryItemsStyle.subCatHeaderContainer}>
                    <Text style={MenuCategoryItemsStyle.subCatSectionTextStyle}>{description}</Text>
                </T2SView>
            ) : null}
            <T2SView onLayout={onLayout} style={MenuCategoryItemsStyle.flex1}>
                {flexHeight ? (
                    <FlatList
                        contentContainerStyle={NewMenuSubCategoryStyle.flatListContentContainerStyle}
                        ItemSeparatorComponent={itemSeparatorComponentFlatlist}
                        data={subCatItems}
                        renderItem={renderSubcatListItem}
                        keyExtractor={(subCatitem) => subCatitem.index}
                    />
                ) : null}
            </T2SView>
        </SafeAreaView>
    );
};

export default NewSubCatListScreen;
