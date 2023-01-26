import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, ViewPropTypes } from 'react-native';
import _ from 'lodash';
import styles from './styles/OTPViewStyle';
import { setTestId } from '../../Utils/AutomationHelper';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

export default class OTPView extends Component {
    static propTypes = {
        codeLength: PropTypes.number,
        compareWithCode: PropTypes.string,
        inputPosition: PropTypes.string,
        size: PropTypes.number,
        space: PropTypes.number,
        className: PropTypes.string,
        cellBorderWidth: PropTypes.number,
        activeColor: PropTypes.string,
        inactiveColor: PropTypes.string,
        ignoreCase: PropTypes.bool,
        autoFocus: PropTypes.bool,
        codeInputStyle: TextInput.propTypes.style,
        containerStyle: viewPropTypes.style,
        onFulfill: PropTypes.func.isRequired,
        onCodeChange: PropTypes.func.isRequired,
        cursorColor: PropTypes.string,
        screenName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    };

    static defaultProps = {
        codeLength: 5,
        inputPosition: 'center',
        autoFocus: true,
        size: 40,
        className: 'border-box',
        cellBorderWidth: 1,
        activeColor: '#808080',
        inactiveColor: '#CCCCCC',
        space: 8,
        compareWithCode: '',
        ignoreCase: false,
        cursorColor: 'grey'
    };

    constructor(props) {
        super(props);

        this.state = {
            codeArr: new Array(this.props.codeLength).fill(''),
            currentIndex: 0
        };

        this.codeInputRefs = [];
    }

    componentDidMount() {
        const { compareWithCode, codeLength, inputPosition } = this.props;
        if (compareWithCode && compareWithCode.length !== codeLength) {
            //console.error('Invalid props: compareWith length is not equal to codeLength');
        }

        if (_.indexOf(['center', 'left', 'right', 'full-width'], inputPosition) === -1) {
            // console.error('Invalid input position. Must be in: center, left, right, full');
        }
    }

    clear() {
        this.setState({
            codeArr: new Array(this.props.codeLength).fill(''),
            currentIndex: 0
        });
        this._setFocus(0);
    }

    setCode(newCodeString) {
        let newCodeArr = new Array(this.props.codeLength).fill('');
        let updateCodeArr = [...newCodeString.replace(/[^0-9]/g, '')];
        // eslint-disable-next-line no-unused-vars
        for (const i in updateCodeArr) {
            if (i < this.props.codeLength) {
                newCodeArr[i] = updateCodeArr[i];
            }
        }
        this.setState({
            codeArr: newCodeArr
        });

        this.props.onFulfill(newCodeString);
    }

    _setFocus(index) {
        this.codeInputRefs[index].focus();
    }

    _blur(index) {
        this.codeInputRefs[index].blur();
    }

    _onFocus(index) {
        let newCodeArr = _.clone(this.state.codeArr);
        const currentEmptyIndex = _.findIndex(newCodeArr, (c) => !c);
        if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
            return this._setFocus(currentEmptyIndex);
        }
        // eslint-disable-next-line no-unused-vars
        for (const i in newCodeArr) {
            if (i >= index) {
                newCodeArr[i] = '';
            }
        }

        this.setState({
            codeArr: newCodeArr,
            currentIndex: index
        });
    }

    _isMatchingCode(code, compareWithCode, ignoreCase = false) {
        if (ignoreCase) {
            return code.toLowerCase() === compareWithCode.toLowerCase();
        }
        return code === compareWithCode;
    }

    _getContainerStyle(size, position) {
        switch (position) {
            case 'left':
                return {
                    justifyContent: 'flex-start',
                    height: size,
                    flex: 0.1
                };
            case 'center':
                return {
                    justifyContent: 'center',
                    height: size,
                    flex: 0.1
                };
            case 'right':
                return {
                    justifyContent: 'flex-end',
                    height: size,
                    flex: 0.1
                };
            default:
                return {
                    justifyContent: 'space-between',
                    height: size,
                    flex: 0.1
                };
        }
    }

    _getInputSpaceStyle(space) {
        const { inputPosition } = this.props;
        switch (inputPosition) {
            case 'left':
                return {
                    marginRight: space
                };
            case 'center':
                return {
                    marginRight: space / 2,
                    marginLeft: space / 2
                };
            case 'right':
                return {
                    marginLeft: space
                };
            default:
                return {
                    marginRight: 0,
                    marginLeft: 0
                };
        }
    }

    _getClassStyle(className, active) {
        const { cellBorderWidth, activeColor, inactiveColor, space } = this.props;
        let classStyle = {
            ...this._getInputSpaceStyle(space),
            color: activeColor
        };

        switch (className) {
            case 'clear':
                return _.merge(classStyle, { borderWidth: 0 });
            case 'border-box':
                return _.merge(classStyle, {
                    borderWidth: cellBorderWidth,
                    borderColor: active ? activeColor : inactiveColor
                });
            case 'border-circle':
                return _.merge(classStyle, {
                    borderWidth: cellBorderWidth,
                    borderRadius: 50,
                    borderColor: active ? activeColor : inactiveColor
                });
            case 'border-b':
                return _.merge(classStyle, {
                    borderBottomWidth: cellBorderWidth,
                    borderColor: active ? activeColor : inactiveColor
                });
            case 'border-b-t':
                return _.merge(classStyle, {
                    borderTopWidth: cellBorderWidth,
                    borderBottomWidth: cellBorderWidth,
                    borderColor: active ? activeColor : inactiveColor
                });
            case 'border-l-r':
                return _.merge(classStyle, {
                    borderLeftWidth: cellBorderWidth,
                    borderRightWidth: cellBorderWidth,
                    borderColor: active ? activeColor : inactiveColor
                });
            default:
                return className;
        }
    }

    _onKeyPress(e) {
        if (e.nativeEvent.key === 'Backspace') {
            const { currentIndex } = this.state;
            let newCodeArr = _.clone(this.state.codeArr);
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            // eslint-disable-next-line no-unused-vars
            for (const i in newCodeArr) {
                if (i >= nextIndex) {
                    newCodeArr[i] = '';
                }
            }
            this.props.onCodeChange(newCodeArr.join(''));
            this._setFocus(nextIndex);
        }
    }

    _onInputCode(character, index) {
        const { codeLength, onFulfill, compareWithCode, ignoreCase, onCodeChange } = this.props;
        let newCodeArr = _.clone(this.state.codeArr);
        newCodeArr[index] = character.replace(/[^0-9]/g, ''); //regex 0 to 9

        if (index === codeLength - 1) {
            const code = newCodeArr.join('');

            if (compareWithCode) {
                const isMatching = this._isMatchingCode(code, compareWithCode, ignoreCase);
                onFulfill(isMatching, code);
                !isMatching && this.clear();
            } else {
                onFulfill(code);
            }
            this._blur(this.state.currentIndex);
        } else {
            this._setFocus(this.state.currentIndex + 1);
        }

        this.setState(
            (prevState) => {
                return {
                    codeArr: newCodeArr,
                    currentIndex: prevState.currentIndex + 1
                };
            },
            () => {
                onCodeChange(newCodeArr.join(''));
            }
        );
    }

    render() {
        const { codeLength, codeInputStyle, containerStyle, inputPosition, autoFocus, className, size } = this.props;

        const initialCodeInputStyle = {
            width: size,
            height: size
        };

        let codeInputs = [];
        for (let i = 0; i < codeLength; i++) {
            const id = i;
            codeInputs.push(
                <TextInput
                    key={id}
                    ref={(ref) => (this.codeInputRefs[id] = ref)}
                    style={[
                        styles.codeInput,
                        initialCodeInputStyle,
                        this._getClassStyle(className, this.state.currentIndex === id),
                        codeInputStyle
                    ]}
                    underlineColorAndroid="transparent"
                    selectionColor={this.props.cursorColor}
                    keyboardType={'phone-pad'}
                    returnKeyType={'done'}
                    {...this.props}
                    autoFocus={autoFocus && id === 0}
                    onFocus={() => this._onFocus(id)}
                    value={this.state.codeArr[id] ? this.state.codeArr[id].toString() : ''}
                    onChangeText={(text) => this._onInputCode(text, id)}
                    onKeyPress={(e) => this._onKeyPress(e)}
                    maxLength={1}
                    {...setTestId(this.props.screenName, this.props.id)}
                />
            );
        }

        return <View style={[styles.container, this._getContainerStyle(size, inputPosition), containerStyle]}>{codeInputs}</View>;
    }
}
