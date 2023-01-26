import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './style';
import PropTypes from 'prop-types';
import { getXOffset, getYOffset } from './helper';
import { setTestId } from '../../../Utils/AutomationHelper';
import { isValidElement } from '../../../Utils/helpers';
let autoScrollTimeOut;
export default class StickyHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            headerHeadingLayouts: [],
            contentLayouts: [],
            clicked: false
        };
    }
    componentDidMount() {
        const { headerData, defaultCategory } = this.props;
        if (isValidElement(headerData) && isValidElement(defaultCategory)) {
            let index = headerData.indexOf(defaultCategory.name);
            if (index !== 0) {
                autoScrollTimeOut = setTimeout(() => {
                    this.setActiveIndex(index);
                }, 5000); //TODO: remove the timeout, when the list is optimized
            }
        }
    }

    componentWillUnmount() {
        if (isValidElement(autoScrollTimeOut)) {
            clearTimeout(autoScrollTimeOut);
        }
    }

    render() {
        return (
            <View>
                {this.renderHeader()}
                {this.renderContent()}
            </View>
        );
    }

    renderContent() {
        const { renderItems, data } = this.props;
        return (
            <ScrollView ref={(ref) => (this.contentRef = ref)} onScroll={this.onScrollContent} onMomentumScrollEnd={this.onScrollEnd}>
                {data.map((val, key) => (
                    <View key={key} onLayout={this.onLayoutContent.bind(this, key)}>
                        {renderItems(val)}
                    </View>
                ))}
            </ScrollView>
        );
    }

    renderHeader() {
        const { activeIndex } = this.state;
        const { headingStyle, activeHeadingStyle, headerData, screenName } = this.props;
        return (
            <ScrollView horizontal ref={(ref) => (this.headerRef = ref)} showsHorizontalScrollIndicator={false}>
                {headerData.map((heading, key) => {
                    const isActive = key === activeIndex;
                    const headStyle = isActive
                        ? [styles.headingStyle, headingStyle, activeHeadingStyle]
                        : [styles.headingStyle, headingStyle];
                    return (
                        <View key={key} onLayout={this.onLayoutHeading.bind(this, key)}>
                            <Text onPress={this.onPressHeader.bind(this, key)} style={headStyle} {...setTestId(screenName, 'StickyHeader')}>
                                {heading}
                            </Text>
                            {isActive && <View style={styles.underLineStyle} />}
                        </View>
                    );
                })}
            </ScrollView>
        );
    }

    onLayoutHeading = (key, event) => {
        const layout = event.nativeEvent.layout;
        const { headerHeadingLayouts } = this.state;
        this.setState(() => {
            headerHeadingLayouts[key] = layout;
            return { headerHeadingLayouts };
        });
    };

    onLayoutContent = (key, event) => {
        const layout = event.nativeEvent.layout;
        const { contentLayouts } = this.state;
        this.setState(() => {
            contentLayouts[key] = layout;
            return { contentLayouts };
        });
    };

    onScrollContent = (event) => {
        let offset = 0;
        let index = 0;
        const { y } = event.nativeEvent.contentOffset;
        const { headerHeadingLayouts, contentLayouts, clicked } = this.state;
        const { paddingLeftHeaderPercent } = this.props;
        contentLayouts.forEach((layout, key) => {
            if (offset < y + 1) {
                offset += layout.height;
                index = key;
            }
        });
        if (!clicked) {
            this.setState({ activeIndex: index });
            this.headerRef.scrollTo({ x: getXOffset(headerHeadingLayouts, index, paddingLeftHeaderPercent), y: 0, animated: true });
        }
    };

    onScrollEnd = () => {
        this.setState({ clicked: false });
    };

    onPressHeader = (key) => {
        this.setState({ clicked: true });
        this.setActiveIndex(key);
    };

    setActiveIndex(key) {
        const { headerHeadingLayouts, contentLayouts } = this.state;
        const { paddingLeftHeaderPercent } = this.props;
        this.setState({ activeIndex: key });
        this.headerRef.scrollTo({ x: getXOffset(headerHeadingLayouts, key, paddingLeftHeaderPercent), y: 0, animated: true });
        this.contentRef.scrollTo({ x: 0, y: getYOffset(contentLayouts, key), animated: true });
    }
}

StickyHeader.defaultProps = {
    data: [],
    headerData: [],
    headingStyle: {},
    activeHeadingStyle: {},
    renderItems: () => <View />,
    paddingLeftHeaderPercent: 50
};

StickyHeader.propTypes = {
    data: PropTypes.array.isRequired,
    headerData: PropTypes.arrayOf(PropTypes.string).isRequired,
    headingStyle: PropTypes.object,
    activeHeadingStyle: PropTypes.object,
    renderItems: PropTypes.func,
    paddingLeftHeaderPercent: PropTypes.number
};
