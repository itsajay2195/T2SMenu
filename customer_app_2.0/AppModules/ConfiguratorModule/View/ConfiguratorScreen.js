import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import {
    CONFIG_KEYS,
    CONFIGURATOR_DATA,
    CONFIGURATOR_KEY,
    ITEM_TYPE,
    SCREEN_NAME,
    STRING_CONSTANTS,
    VIEW_ID
} from '../Utils/ConfiguratorConstants';
import {
    getBaseURL,
    getEnvType,
    getFranchiseHost,
    getFranchiseId,
    getLiveChatKey,
    getStoreId,
    getBugseeValue
} from '../Utils/ConfiguratorHelper';
import styles from './Styles/ConfiguratorStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SDropdown from 't2sbasemodule/UI/CommonUI/T2SDropdown';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import {
    copyToClipboard,
    isCustomerApp,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    safeStringValue,
    isDebugBuildType
} from 't2sbasemodule/Utils/helpers';
import { connect } from 'react-redux';
import {
    restartAppAction,
    updateConfigurationAction,
    updateBugSeeFirstLaunchAction,
    launchBugsee
} from '../../../CustomerApp/Redux/Actions';
import CodePush from 'react-native-code-push';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import ProfileSwitchRow from '../../ProfileModule/MicroComponents/ProfileSwitchRow';
import Bugsee from 'react-native-bugsee';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

let timeout;
let restartTimeout;
class ConfiguratorScreen extends Component {
    constructor(props) {
        super(props);
        this.changeUpdateButtonState = this.changeUpdateButtonState.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.state = {
            environment: '',
            liveChatKey: '',
            storeId: '',
            environmentType: '',
            apiVersion: null,
            deviceToken: null,
            showErrorStoreId: false,
            showErrorApiVersion: false,
            showUpdateButton: false,
            franchiseId: null,
            franchiseHost: null,
            buildInfo: null,
            showErrorEnvironment: false,
            bugseeToggle: false,
            updateBugSeeFirstLaunch: false
        };
    }

    componentDidMount() {
        if (this.props.configFileName) {
            this.setStateValueFromLocalData(this.props.configFileName);
            this.setStateValueFromProps();
        }
        if (!this.props.updateBugSeeFirstLaunch) {
            this.props.launchBugsee();
            this.setBugseeAttributes();
            setTimeout(() => {
                Bugsee.stop();
            }, 2000);
            this.props.updateBugSeeFirstLaunchAction(true);
        }
    }

    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
        if (isValidElement(restartTimeout)) {
            clearTimeout(restartTimeout);
        }
    }

    setStateValueFromLocalData(data) {
        this.setState({
            environment: getBaseURL(data),
            liveChatKey: getLiveChatKey(data),
            storeId: getStoreId(data),
            franchiseId: getFranchiseId(data),
            franchiseHost: getFranchiseHost(data),
            environmentType: getEnvType(data),
            bugseeToggle: getBugseeValue(data)
        });
    }

    setStateValueFromProps() {
        const { apiVersion, deviceToken } = this.props;
        if (
            !isValidElement(this.state.apiVersion) &&
            !isValidElement(this.state.deviceToken) &&
            isValidElement(apiVersion) &&
            isValidElement(deviceToken)
        )
            this.setState({
                apiVersion: apiVersion,
                deviceToken: deviceToken
            });
    }

    render() {
        return (
            <SafeAreaView>
                <View>{this.renderHeader()}</View>
                <View>{this.renderList()}</View>
                {isDebugBuildType() && <View>{this.renderBugseeToggle()}</View>}
            </SafeAreaView>
        );
    }

    renderHeader() {
        return (
            <T2SAppBar
                showElevation={false}
                id={VIEW_ID.BACK_BUTTON}
                screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                actions={this.renderHeaderRight()}
                title={LOCALIZATION_STRINGS.SCREEN_TITLE}
            />
        );
    }

    renderHeaderRight() {
        if (this.state.showUpdateButton) {
            return (
                <T2STouchableOpacity
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                    style={styles.headerMenuStyle}
                    onPress={() => {
                        //TODO If needed, we should verify the given store id is valid or not with s3 then update the configuration
                        this.updateConfigAction();
                        restartTimeout = setTimeout(() => {
                            this.restartApp();
                        }, 500);
                    }}>
                    <T2SText id={VIEW_ID.UPDATE_BUTTON} screenName={SCREEN_NAME.CONFIGURATOR_SCREEN} style={styles.headerMenuTextStyle}>
                        {LOCALIZATION_STRINGS.UPDATE}
                    </T2SText>
                </T2STouchableOpacity>
            );
        }
    }

    renderBuildInfo() {
        const { buildInfo } = this.state;
        if (isValidElement(buildInfo)) {
            return (
                <>
                    <View style={styles.dropDownViewStyle}>
                        <Text style={styles.labelTextStyle}>{STRING_CONSTANTS.BRANCH_INFO.toUpperCase()}</Text>
                        <Text style={styles.valueTextStyle}>{isValidString(buildInfo.branch_name) ? buildInfo.branch_name : '-'}</Text>
                    </View>
                    <View style={styles.dropDownViewStyle}>
                        <Text style={styles.labelTextStyle}>{STRING_CONSTANTS.BUILD_TIME.toUpperCase()}</Text>
                        <Text style={styles.valueTextStyle}>{isValidString(buildInfo.build_time) ? buildInfo.build_time : '-'}</Text>
                    </View>
                </>
            );
        }
        return null;
    }

    restartApp() {
        this.props.restartAppAction();
        timeout = setTimeout(() => CodePush.restartApp(), 500);
    }

    renderBugseeToggle() {
        const { bugseeToggle } = this.state;
        return (
            <View style={styles.dropDownViewStyle}>
                <ProfileSwitchRow
                    title={CONFIGURATOR_KEY.BUGSEE}
                    toggleId={VIEW_ID.NOTIFICATIONS_TOGGLE}
                    toggleValue={bugseeToggle}
                    toggleChange={this.toggleChange}
                />
            </View>
        );
    }

    toggleChange() {
        this.setState({ bugseeToggle: !this.state.bugseeToggle }, () => {
            this.updateConfigAction();
            if (this.state.bugseeToggle) {
                this.props.launchBugsee();
                this.setBugseeAttributes();
            } else {
                Bugsee.stop();
            }
        });
    }

    updateConfigAction() {
        this.props.updateConfigurationAction({
            [CONFIG_KEYS.config_base_url]: this.state.environment,
            [CONFIG_KEYS.config_live_chat_key]: this.state.liveChatKey,
            [CONFIG_KEYS.config_store_id]: isNonCustomerApp() ? AppConfig.STORE_ID : this.state.storeId,
            [CONFIG_KEYS.config_api_version]: this.state.apiVersion,
            [CONFIG_KEYS.config_franchise_id]: this.state.franchiseId,
            [CONFIG_KEYS.config_franchise_host]: this.state.franchiseHost,
            [CONFIG_KEYS.config_env_type]: this.state.environmentType,
            [CONFIG_KEYS.config_bugsee_value]: this.state.bugseeToggle
        });
    }

    renderList() {
        return (
            <FlatList
                data={CONFIGURATOR_DATA}
                renderItem={({ item }) => {
                    return this.renderItem(item);
                }}
                extraData={this.state}
                // ListFooterComponent={() => this.renderBuildInfo()}
            />
        );
    }

    renderItem(item) {
        const key = item.key;
        const value = this.getStateValue(key);
        if (item.itemType === ITEM_TYPE.DROP_DOWN) {
            return (
                <View style={styles.dropDownViewStyle}>
                    <Text style={styles.labelTextStyle}>{key}</Text>
                    {key === CONFIGURATOR_KEY.ENVIRONMENT ? (
                        <View>
                            <T2STextInput
                                screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                                id={key}
                                value={this.state.environment}
                                autoCapitalize="none"
                                keyboardType={key === CONFIGURATOR_KEY.FRANCHISE_ID ? 'numeric' : 'default'}
                                onChangeText={this.handleOnEnvironmentChangeTextInput.bind(this, key)}
                                error={this.getErrorState(key)}
                                errorText={this.getErrorMsg(key)}
                            />
                            <T2STouchableOpacity
                                style={styles.arrowStyle}
                                id={key}
                                screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                                accessible={false}>
                                <T2SDropdown
                                    id={key}
                                    screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                                    inputData={item.values}
                                    menuItemTextStyle={styles.valueTextStyle}
                                    textStyle={styles.valueTextStyle}
                                    onSelected={this.handleDropdownClicked.bind(this, key)}
                                    showUnderline={false}
                                />
                            </T2STouchableOpacity>
                        </View>
                    ) : (
                        <T2SDropdown
                            id={key}
                            screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                            inputData={item.values}
                            menuItemTextStyle={styles.valueTextStyle}
                            textStyle={styles.valueTextStyle}
                            value={value}
                            onSelected={this.handleDropdownClicked.bind(this, key)}
                        />
                    )}
                </View>
            );
        } else if (item.itemType === ITEM_TYPE.TEXT_INPUT) {
            return (
                ((isNonCustomerApp() && key !== CONFIGURATOR_KEY.STORE_ID) ||
                    isCustomerApp() ||
                    (isFranchiseApp() && key === CONFIGURATOR_KEY.FRANCHISE_ID) ||
                    (isFranchiseApp() && key === CONFIGURATOR_KEY.FRANCHISE_HOST)) && (
                    <View style={styles.dropDownViewStyle}>
                        <T2STextInput
                            screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                            id={key}
                            label={key}
                            value={value}
                            autoCapitalize="none"
                            keyboardType={key === CONFIGURATOR_KEY.FRANCHISE_ID ? 'numeric' : 'default'}
                            onChangeText={this.handleOnChangeTextInput.bind(this, key)}
                            error={this.getErrorState(key)}
                            errorText={this.getErrorMsg(key)}
                        />
                    </View>
                )
            );
        } else if (item.itemType === ITEM_TYPE.TEXT) {
            return (
                <T2STouchableOpacity
                    screenName={SCREEN_NAME.CONFIGURATOR_SCREEN}
                    id={key}
                    style={styles.dropDownViewStyle}
                    onPress={() => {
                        copyToClipboard(safeStringValue(value), LOCALIZATION_STRINGS.COPIED_TO_CLIPBOARD);
                    }}>
                    <Text style={styles.labelTextStyle}>{key}</Text>
                    <Text style={styles.valueTextStyle}>{value}</Text>
                </T2STouchableOpacity>
            );
        }
    }

    getErrorState(key) {
        if (key === CONFIGURATOR_KEY.ENVIRONMENT) {
            return this.state.showErrorEnvironment;
        }
        if (key === CONFIGURATOR_KEY.STORE_ID) {
            return this.state.showErrorStoreId;
        }
        if (key === CONFIGURATOR_KEY.API_VERSION) {
            return this.state.showErrorApiVersion;
        }
    }

    getErrorMsg(key) {
        if (key === CONFIGURATOR_KEY.ENVIRONMENT) {
            return LOCALIZATION_STRINGS.ERROR_MESSAGE_ENVIRONMENT;
        }
        if (key === CONFIGURATOR_KEY.STORE_ID) {
            return LOCALIZATION_STRINGS.ERROR_MESSAGE_STORE_ID;
        }
        if (key === CONFIGURATOR_KEY.API_VERSION) {
            return LOCALIZATION_STRINGS.ERROR_MESSAGE_API_VERSION;
        }
    }

    getStateValue(key) {
        if (key === CONFIGURATOR_KEY.ENVIRONMENT) {
            return this.state.environment;
        }
        if (key === CONFIGURATOR_KEY.ENVIRONMENT_TYPE) {
            return this.state.environmentType;
        }
        if (key === CONFIGURATOR_KEY.LIVE_CHAT_KEY) {
            return this.state.liveChatKey;
        }
        if (key === CONFIGURATOR_KEY.STORE_ID) {
            return this.state.storeId;
        }
        if (key === CONFIGURATOR_KEY.API_VERSION) {
            return this.state.apiVersion;
        }
        if (key === CONFIGURATOR_KEY.DEVICE_TOKEN) {
            return this.state.deviceToken;
        }
        if (isFranchiseApp()) {
            if (key === CONFIGURATOR_KEY.FRANCHISE_ID) {
                return this.state.franchiseId;
            }
            if (key === CONFIGURATOR_KEY.FRANCHISE_HOST) {
                return this.state.franchiseHost;
            }
        }
    }

    handleOnEnvironmentChangeTextInput(key, text) {
        this.handleOnChangeTextInput(key, text.trim());
    }

    handleOnChangeTextInput(key, text) {
        if (key === CONFIGURATOR_KEY.ENVIRONMENT) {
            this.setState({ environment: text, showErrorEnvironment: !isValidString(text) }, () => {
                this.changeUpdateButtonState();
            });
        }
        if (key === CONFIGURATOR_KEY.STORE_ID) {
            this.setState({ storeId: text, showErrorStoreId: !isValidString(text) }, () => {
                this.changeUpdateButtonState();
            });
        }
        if (key === CONFIGURATOR_KEY.API_VERSION) {
            this.setState({ apiVersion: text, showErrorApiVersion: !isValidString(text) }, () => {
                this.changeUpdateButtonState();
            });
        }
        if (isFranchiseApp()) {
            if (key === CONFIGURATOR_KEY.FRANCHISE_ID) {
                this.setState({ franchiseId: text, showErrorStoreId: !isValidString(text) }, () => {
                    this.changeUpdateButtonState();
                });
            }
            if (key === CONFIGURATOR_KEY.FRANCHISE_HOST) {
                this.setState({ franchiseHost: text, showErrorStoreId: !isValidString(text) }, () => {
                    this.changeUpdateButtonState();
                });
            }
        }
    }

    handleDropdownClicked(key, selectedData) {
        if (key === CONFIGURATOR_KEY.ENVIRONMENT) {
            this.setState({ environment: selectedData.value });
        }
        if (key === CONFIGURATOR_KEY.ENVIRONMENT_TYPE) {
            this.setState({ environmentType: selectedData.value });
        }
        if (key === CONFIGURATOR_KEY.LIVE_CHAT_KEY) {
            this.setState({ liveChatKey: selectedData.value });
        }
        this.changeUpdateButtonState();
    }

    changeUpdateButtonState() {
        let showUpdateButton = isCustomerApp() ? isValidString(this.state.storeId) : isValidString(this.state.apiVersion);
        this.setState({ showUpdateButton: showUpdateButton });
    }

    setBugseeAttributes() {
        if (isDebugBuildType()) {
            const { profileResponse, isUserLoggedIn } = this.props;
            if (isValidString(profileResponse?.email)) {
                Bugsee.setEmail(profileResponse.email);
                Bugsee.setAttribute('Email', profileResponse.email);
            }
            if (isValidString(isUserLoggedIn)) {
                Bugsee.setAttribute('isUserLoggedIn', isUserLoggedIn);
            }
            if (isValidString(profileResponse?.phone)) {
                Bugsee.setAttribute('Phone', profileResponse.phone);
            }
            if (isValidString(profileResponse?.first_name)) {
                Bugsee.setAttribute('FirstName', profileResponse.first_name);
            }
            if (isValidString(profileResponse?.last_name)) {
                Bugsee.setAttribute('Last Name', profileResponse.last_name);
            }
        }
    }
}

const mapStateToProps = (state) => ({
    deviceToken: state.pushNotificationState.deviceToken,
    apiVersion: AppConfig.API_VERSION,
    configFileName: getConfiguration(state),
    updateBugSeeFirstLaunch: state.envConfigState.bugseeLaunch,
    profileResponse: state.profileState.profileResponse,
    isUserLoggedIn: selectHasUserLoggedIn(state)
});

const mapDispatchToProps = {
    restartAppAction,
    updateConfigurationAction,
    updateBugSeeFirstLaunchAction,
    launchBugsee
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfiguratorScreen);
