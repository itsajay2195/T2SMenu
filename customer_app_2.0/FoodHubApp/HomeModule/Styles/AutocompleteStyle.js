import { StyleSheet } from 'react-native';
import Colors from '../../../T2SBaseModule/Themes/Colors';

export const AutocompleteStyle = StyleSheet.create({
    container: {
        height: 200,
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden'
    },
    suggestionListStyle: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
        elevation: 6
    },
    headerStyle: { color: Colors.lightBrown, padding: 10 },
    listItemStyle: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: Colors.lightGrey
    },
    listStyle: { backgroundColor: 'white', borderRadius: 10, paddingTop: 8, marginBottom: 20 },
    bottomFix: { height: 100 },
    flatListContainer: { flexGrow: 1, paddingBottom: 40 }
});
