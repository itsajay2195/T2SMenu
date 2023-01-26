import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { customerAppTheme } from '../../../Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },

    backButtonStyle: {
        paddingVertical: 20,
        paddingHorizontal: 20
    },

    bottomDrawerSection: {
        alignSelf: 'center',
        padding: 16,
        color: customerAppTheme.colors.secondaryText,
        fontSize: setFont(10)
    },

    sideMenuViewContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginTop: 5,
        alignItems: 'center'
    },
    imageStyle: {
        marginLeft: 5
    },
    moreLessImage: {
        color: Colors.suvaGrey,
        marginLeft: 5
    },
    sideMenuText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        marginLeft: 10,
        flex: 1
    },
    versionNameText: {
        width: '100%',
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        color: Colors.suvaGrey
    },
    versionContainer: {
        width: '100%',
        padding: 20
    },
    arrowStyle: {
        marginRight: 15
    },
    dividerStyle: {
        marginHorizontal: 12,
        height: 1,
        backgroundColor: Colors.gallery,
        marginVertical: 10,
        marginTop: 16
    },
    navigationHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    navigationHeaderImage: {
        flex: 0.6,
        height: 60, //to match with AppBar height
        left: 20
    },
    joinBetaViewStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    joinBetaTextStyle: {
        color: Colors.lightBlue,
        fontSize: setFont(12),
        textDecorationLine: 'underline',
        padding: 3,
        left: -3
    },
    sideMenuTakeAwayNameStyle: {
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    copyright: {
        aspectRatio: 5.68,
        height: 15,
        margin: 5,
        alignSelf: 'center',
        alignItems: 'center'
    }
});
