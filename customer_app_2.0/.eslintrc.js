module.exports = {
    root: true,
    extends: ['@react-native-community', 'plugin:prettier/recommended', 'eslint:recommended', 'plugin:react/recommended'],
    rules: {
        'react/prop-types': 0,
        'react/no-string-refs': 0,
        'react/no-did-mount-set-state': 0,
        'react/display-name': 0
    }
};
