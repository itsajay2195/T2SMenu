export const config = {
    screens: {
        home: {
            path: 'home/:id?',
            parse: {
                id: (id: String) => `${id}`
            }
        }
    }
};
export const linking = {
    config
};
