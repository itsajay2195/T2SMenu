# Customer App 2.0

UI components are built using [React Native Paper](https://callstack.github.io/react-native-paper/)

Navigation : [React Navigation V5](https://reactnavigation.org/docs/getting-started)

### Installing

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository using SSH
git clone git@github.com:uktech/customer_app_2.0.git
# Go into the repository
cd customer_app_2.0

# swich branch if need 
# Install dependencies
npm install
# For iOS, we need to install pod
cd ios
# Install pod
pod install

```

### Running



| OS      | Customer App   | Foodhub       |
|  :---:  |     :---:      |     :---:     |
| Android | `npm run ca`   | `npm run fa`  |
| iOS     | `npm run ci`   | `npm run fi`  |

### AppBar

We can use `T2SAppBarStateless` in any `StackNavigator` with the header mode as `screen`. By default it'll take care of `back` navigation and `title`

```js
<DashBoardStack.Navigator
    headerMode="screen"
    screenOptions={{
        header: ({ scene, previous, navigation }) => <T2SAppBarStateless scene={scene} previous={previous} navigation={navigation} />
    }}>
    <DashBoardStack.Screen name="dashboard" component={HomeScreen} />
    <DashBoardStack.Screen name="details" component={Details} />
</DashBoardStack.Navigator>
```

### AppBar Title

We can have custom title using `options` props of `Screen` by defining `headerTitle` as follows,

```js
<DashBoardStack.Navigator
    headerMode="screen"
    screenOptions={{
        header: ({ scene, previous, navigation }) => <T2SAppBarStateless scene={scene} previous={previous} navigation={navigation} />
    }}>
    <DashBoardStack.Screen name="dashboard" component={HomeScreen} options={{ headerTitle: 'My HomeScreen' }} />
    <DashBoardStack.Screen name="details" component={Details} options={{ headerTitle: 'My Details' }} />
</DashBoardStack.Navigator>
```

or in `ClassComponent` as,

```js
this.props.navigation.setOptions({
    headerTitle: 'Custom Title'
});
```

### AppBar Action Buttons(Header Buttons)

<img src="https://github.com/uktech/customer_app_2.0/blob/new-components/T2SBaseModule/screenshots/appbar_action_button.png" width="400">

You can have Action Buttons using navigation `setOptions` and define your action buttons using `actions` props.

In `componentDidMount()`,

```js
this.props.navigation.setOptions({
    header: ({ scene, previous, navigation }) => (
        <T2SAppBarStateless
            scene={scene}
            previous={previous}
            navigation={navigation}
            actions={
                <Fragment>
                    <T2SIconButton icon={FONT_ICON.CALL_FILLED} onPress={() => {}} />
                    <T2SIconButton icon={FONT_ICON.HEART_FILL} onPress={() => {}} />
                    <T2SFlatButton onPress={() => {}} title={'Save'} />
                </Fragment>
            }
        />
    )
});
```

### Can I use AppBar inside `render()` method?

Yes, you can use. But Here we'll be using a different component, `T2SAppBarStateful` and not `T2SAppBarStateless`.
(At time of writing this, we don't have time to customise it ;) So, you can come with your idea to reuse `T2SAppBarStateless` )

So please note that we'll be using `T2SAppBarStateful`.
`T2SAppBarStateful` is useful when you have stateful components in the `T2SAppBarStateful`, like updating a badge count or showing a overflow menu.

Make sure to change the `headerShown` to `false` in the options as follows,

```js
<DashBoardStack.Screen name="details" component={Details} options={{ headerShown: false }} />
```

then in component,

```js
 render() {
        return (
            <View>
                <T2SAppBarStateful
                    title={'title from render'}
                    actions={
                        <Fragment>
                            <IconButton
                                icon={() => <T2SCustomIcon size={35} name="Settings" />}
                                onPress={() => {}}
                            />
                        </Fragment>
                    }
                />
            </View>
        );
    }
```

### T2SButton

<img src="https://github.com/uktech/customer_app_2.0/blob/new-components/T2SBaseModule/screenshots/containe_button.png" width="200">

```js
<T2SButton
    title={'My Button'}
    onPress={() => {
        console.log('button pressed');
    }}
/>
```

### T2SFlatButton

<img src="https://github.com/uktech/customer_app_2.0/blob/new-components/T2SBaseModule/screenshots/flat_button.png" width="200">

```js
<T2SFlatButton
    title={'Flat Button'}
    onPress={() => {
        console.log('button pressed');
    }}
/>
```

### T2SOutlineButton

<img src="https://github.com/uktech/customer_app_2.0/blob/new-components/T2SBaseModule/screenshots/outline_button.png" width="200">

```js
<T2SOutlineButton
    title={'Outline Button'}
    onPress={() => {
        console.log('button pressed');
    }}
/>
```

### T2SOutlineButton with icon

<img src="https://github.com/uktech/customer_app_2.0/blob/new-components/T2SBaseModule/screenshots/icon_button.png" width="200">

```js
<T2SOutlineButton
    icon={FONT_ICON.FACEBOOK}
    // icon={() => <T2SIcon icon={FONT_ICON.FACEBOOK} size={24} color={'red} />}
    buttonTextStyle={{ paddingLeft: 8 }}
    onPress={() => {
        console.log('button pressed');
    }}
/>
```

### T2SIconButton

```js
<T2SIconButton icon={FONT_ICON.NOTIFICATION} onPress={() => {}} />
```

### T2STextInput

```js
<T2STextInput
    errorText={'Name is required'}
    label={'Name'}
    error={true}
    value={this.state.name}
    onChangeText={(text) => {
        this.setState({ name: text });
    }}
/>
```
