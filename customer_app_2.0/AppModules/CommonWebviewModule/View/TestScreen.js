import React, { Component } from 'react';
import BaseComponent from '../../BaseModule/BaseComponent';
import { T2SButton, T2SText } from 't2sbasemodule/UI';
import { Share } from 'react-native';
import { isValidString } from 't2sbasemodule/Utils/helpers';

class TestScreen extends Component {
    onShare = async () => {
        try {
            await Share.share({
                message: JSON.stringify(this.props.route.params.gpay_respo)
            });
        } catch (error) {
            alert(error.message);
        }
    };
    render() {
        const { route } = this.props;
        return (
            <BaseComponent showHeader={true}>
                {isValidString(route?.params?.gpay_respo) && (
                    <T2SText screenName={'TEST'} id={'TEST'}>
                        {JSON.stringify(route.params.gpay_respo)}
                    </T2SText>
                )}

                <T2SButton onPress={this.onShare} title="Share" />
            </BaseComponent>
        );
    }
}

export default TestScreen;
