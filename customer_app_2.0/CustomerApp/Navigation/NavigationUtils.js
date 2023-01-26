import { isValidElement } from 't2sbasemodule/Utils/helpers';

const handleSwipeGesture = (props, gestureEnabled = false) => {
    if (isValidElement(props) && isValidElement(props.navigation)) {
        let parent = props.navigation.getParent();
        if (isValidElement(parent)) {
            return parent.setOptions({
                gestureEnabled: gestureEnabled
            });
        }
    }
};

export { handleSwipeGesture };
