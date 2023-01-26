import { DefaultTheme } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';

// import { fontConfig } from './Fonts/FontConfig';

/**
 * Define App theme here.
 * TODO: We need to customise using Customer App generator
 * @type {Theme&{roundness: number, colors: ({primary: string; background: string; surface: string; accent: string; error: string; text: string; onSurface: string; onBackground: string; disabled: string; placeholder: string; backdrop: string; notification: string}&{drawer: string, accent: string, primary: string})}}
 */
export const customerAppTheme = {
    ...DefaultTheme,
    // fonts: configureFonts(fontConfig),
    roundness: 6,
    colors: {
        ...DefaultTheme.colors,
        primary: '#ffffff', //App Primary Color
        background: '#ffffff', //App Primary Background color
        backgroundSecondaryColor: '#f2f2f2',
        text: '#333333', //Primary Text Color,
        secondaryText: '#888888', // Secondary Text Color and TextInput color
        drawer: '#ffffff', //Drawer color
        primaryButton: Colors.primaryColor, //Primary Button Color
        primaryButtonTextColor: '#ffffff', //Primary Button text color
        divider: '#EEEEEE', //Divider Color
        link: '#198EBC' // Hyper link Text Color
    }
};
