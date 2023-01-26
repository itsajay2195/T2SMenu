# Get Started
Please checkout `App-test.js`[(source)](App-test.js) for example and it is a starting point to proceed with. Those who are new please note you need to be aware of following points.

1. All unit test uses `TestRunner.js` [(source)](TestUtils/TestRunner.js). This is our custom implementation, you can visit that class to see how to use.
2. We are using `jest`[(documentation)](https://jestjs.io/docs/expect) framework and you just need to be aware of following thing

```javascript

// In Jest you can define group, it is just like folder structure, like folder inside folder. 
describe('group', () => {
    // Then you can define each test
    test('test', () => {
        expect(2+2).toEqual(4); // We use expect for assertion.
    })
    test('async test', async () => {

    })
});

```

## Things to Refer

You need to keep below documentation open as these are used extensively in our unit testing.

1. Component Testing - We use Enzyme - Shallow [(documentation)](https://enzymejs.github.io/enzyme/docs/api/shallow.html)
1. API testing - We use MSW [(documentation)](https://mswjs.io/docs/api/request)
1. Redux testing - We use SAGA Tester [(documentation)](https://github.com/wix/redux-saga-tester)
1. Storybook - Component documentation and testing - [(documentation)](https://storybook.js.org/blog/storybook-5-3/) **We are using 5.3 version of storybook**

## Mock and Spy
This is a new concept for unit testing, you can mock and spy any object/file/module in jest. This is so powerful and easy to use.

Things you should know:
1. `__mocks__` contains all the mocks for library that have native dependency. Visit the folder to add/update mocks on any library or if it fails in ur use cases.
2. `jest.spyon()` a most used tool to know if chain are receiving proper command.

## How to write Stories

You can create Stories in [stories folder](storybook/stories), ensure after you do that specify in [stories/T2SPreorderTiming.js](storybook/stories/index.js) file else it won't show the story in UI. 

## How to mock API
To mock the API, please use Postman collection.

### Mock API using Postman Collection
1. Import the postman collection in Postman. We have one postman collection in project root folder. [MYT-FUSION.postman_collection.json](MYT-FUSION.postman_collection.json)
1. Create a request and when you run, save it as an Example.
1. Ensure all body and query parameter matches, when we hit api it will automatically take that response.
1. Ensure to use environment variable whereever possible.
