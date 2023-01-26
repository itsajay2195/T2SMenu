import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export function getXOffset(layouts, index, paddingLeft = 0) {
    let offset = 0;
    const paddingLength = ((width - layouts[index].width) * paddingLeft) / 100;
    layouts.forEach((layout, key) => {
        if (index > key) {
            offset += layout.width;
        }
    });
    return offset - paddingLength;
}
export function getYOffset(layouts, index) {
    let offset = 0;
    layouts.forEach((layout, key) => {
        if (index > key) {
            offset += layout.height;
        }
    });
    return offset;
}
