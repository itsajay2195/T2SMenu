import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { filterStyle } from '../Cuisines/Style/FilterCategoryListStyle';
import { filterBy } from '../../Utils/SortByList';
import { connect } from 'react-redux';
import FilterCategoryItem from '../MicroComponents/FilterCategoryItem';

class FilterCategoryList extends Component {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }

    render() {
        const { countryId } = this.props;
        return (
            <View style={filterStyle.mainContainer}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={filterBy(countryId)}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                />
            </View>
        );
    }

    renderItem(item, index) {
        let checkIsSelected = this.props.filterList.includes(item.key);
        return (
            <FilterCategoryItem
                itemTitle={item.title}
                indexValue={index}
                itemKey={item.key}
                handleOnPress={this.handlePress}
                checkStatus={checkIsSelected}
            />
        );
    }

    handlePress(itemKey) {
        if (!this.props.filterList.includes(itemKey)) {
            this.props.onFilterList([...this.props.filterList, itemKey]);
        } else {
            let filteredItems = this.props.filterList.filter(function(value) {
                return value !== itemKey;
            });
            this.props.onFilterList(filteredItems);
        }
    }
}

const mapStateToProps = (state) => ({
    countryId: state.appState.s3ConfigResponse?.country?.id
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FilterCategoryList);
