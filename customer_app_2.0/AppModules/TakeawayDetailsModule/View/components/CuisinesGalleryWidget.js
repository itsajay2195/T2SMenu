import React, { Component } from 'react';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { FlatList, View } from 'react-native';
import { style } from './styles/CuisinessGalleryWidgetStyles';
import { Text } from 'react-native-paper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { IMAGE_VALUES } from '../../Utils/TakeawayDetailsConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import FullScreenImageModalView from '../FullScreenImageModalView';
import { getCuisinesFlatListData } from './utils/helpers';
import CuisinesGalleryRow from './CuisinesGalleryRow';

class CuisinesGalleryWidget extends Component {
    constructor() {
        super();
    }

    state = {
        imageModalVisibleStatus: false,
        tempImageURL: null,
        index: null,
        showMore: false,
        flatListData: [],
        moreListData: []
    };

    componentDidMount() {
        this.setState({
            flatListData: getCuisinesFlatListData(this.props.data, 0, 4),
            moreListData: getCuisinesFlatListData(this.props.data, 4, this.props.data.length)
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props)) {
            let cuisineData = getCuisinesFlatListData(props?.data, 0, 4);
            if (cuisineData !== state.flatListData) {
                return {
                    ...state,
                    flatListData: cuisineData
                };
            }
        }
    }

    render() {
        const { moreListData, flatListData } = this.state;
        return isArrayNonEmpty(flatListData) && typeof flatListData[0]?.image_url !== 'undefined' ? (
            <View style={style.mainContainer}>
                <Text style={style.imageGalleryTitleStyle}>{LOCALIZATION_STRINGS.CUISINES}</Text>
                {this.renderFlatList(flatListData)}
                {this.state.imageModalVisibleStatus && this.showImageModal()}
                {moreListData.length > IMAGE_VALUES.IMAGE_COUNT && this.renderMoreButton()}
                {this.state.showMore && this.renderMoreCuisine(moreListData)}
            </View>
        ) : null;
    }

    renderFlatList(data) {
        return (
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (isValidElement(data) ? this.fullScreenImage(item, index) : null)}
                keyExtractor={(item, index) => index + ''}
            />
        );
    }

    renderMoreCuisine(data) {
        return (
            <FlatList
                data={data}
                numColumns={4}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (isValidElement(data) ? this.fullScreenImage(item, index) : null)}
                keyExtractor={(item, index) => index + ''}
            />
        );
    }

    renderMoreButton() {
        return (
            <T2STouchableOpacity>
                <T2SText style={style.moreLessText}>
                    {this.state.showMore ? LOCALIZATION_STRINGS.SHOW_LESS : LOCALIZATION_STRINGS.SHOW_MORE}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    fullScreenImage(item, index) {
        return <CuisinesGalleryRow item={item} index={index} />;
    }

    showImageModal() {
        return (
            <FullScreenImageModalView
                imageModalVisible={this.state.imageModalVisibleStatus}
                imageURL={this.state.tempImageURL}
                index={this.state.index}
                images={this.props.data}
                title={LOCALIZATION_STRINGS.CUISINES}
                isCuisine={true}
                onRequestClose={() => this.setState({ imageModalVisibleStatus: false })}
            />
        );
    }

    showModalView(visible, imageURL, index, data) {
        return this.setState({
            imageModalVisibleStatus: visible,
            tempImageURL: imageURL.image_url,
            index: index,
            images: data
        });
    }

    showMoreButtonAction() {
        this.setState({
            showMore: !this.state.showMore
        });
    }
}

export default CuisinesGalleryWidget;
