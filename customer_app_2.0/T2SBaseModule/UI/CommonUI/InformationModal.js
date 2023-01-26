import T2SModal from './T2SModal';
import React, { Component } from 'react';
import { isValidElement } from '../../Utils/helpers';

/*
 * Wrapper around T2SModal to use in react-navigation
 */
export class InformationModal extends Component {
    constructor(props) {
        super(props);
        this.handleInformationModalPositiveButtonClicked = this.handleInformationModalPositiveButtonClicked.bind(this);
        this.state = {
            isModalVisible: false
        };
    }

    componentDidMount(): void {
        this.setState({ isModalVisible: true });
    }
    componentWillUnmount(): void {
        this.setState({ isModalVisible: false });
    }
    handleInformationModalPositiveButtonClicked() {
        this.props.navigation.goBack();
    }
    render() {
        if (isValidElement(this.props.route) && isValidElement(this.props.route.params)) {
            const {
                title,
                description,
                positiveButtonText,
                positiveButtonStyle,
                dialogCancelable,
                titleCenter,
                descriptionTextStyle,
                positiveButtonTextStyle,
                titleTextStyle,
                textAllCaps
            } = this.props.route.params;

            return (
                <T2SModal
                    isVisible={this.state.isModalVisible}
                    positiveButtonText={positiveButtonText}
                    positiveButtonStyle={positiveButtonStyle}
                    positiveButtonTextStyle={positiveButtonTextStyle}
                    titleTextStyle={titleTextStyle}
                    textAllCaps={textAllCaps}
                    title={title}
                    description={description}
                    titleCenter={titleCenter}
                    dialogCancelable={dialogCancelable}
                    descriptionTextStyle={descriptionTextStyle}
                    positiveButtonClicked={this.handleInformationModalPositiveButtonClicked}
                    requestClose={this.handleInformationModalPositiveButtonClicked}
                />
            );
        }
    }
}
