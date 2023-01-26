import _ from 'lodash';

export const RUN_ALL = 'all';
export const RUN_DIAGONALLY = 'diagonal';

// diagonal invalid, random,
export function createDynamicValue(values, { includeEmptyString = true, maxRun = 3, type = RUN_DIAGONALLY }) {
    this.applyCallback = null;
    this.applyTest = [];

    this.keys = Object.keys(values);
    this.numElement = this.keys.length;

    // first run all valid callback
    this.testResult = _.fill(Array(this.numElement), 0); // 0 means all valid
    this.applyTest.push(generateValues(this.keys, values, this.testResult, { includeEmptyString }));

    // Dynamically run all error cases
    this.maxRun = maxRunForTest(this.keys, maxRun, type);

    if (type === RUN_ALL) {
        // run all Error once
        this.testResult = _.fill(Array(this.numElement), 1);
        this.applyTest.push(generateValues(this.keys, values, this.testResult, { includeEmptyString }));
    }

    const toExecute = generateExecution(this.maxRun, this.numElement, type);

    for (let i = 0; i < toExecute.length; i++) {
        this.testResult = toExecute[i];
        this.applyTest.push(generateValues(this.keys, values, this.testResult, { includeEmptyString }));
    }

    this.apply = (callback) => {
        for (let i = 0; i < this.applyTest.length; i++) {
            callback(this.applyTest[i], i === 0);
        }
    };
    return this;
}

// keys.length === testResult.length
function generateValues(keys, values, testResult, { includeEmptyString }) {
    const output = {};
    for (let i = 0; i < testResult.length; i++) {
        let value;
        if (testResult[i] === 0) {
            value = values[keys[i]];
        } else if (testResult[i] === 1) {
            value = null;
        } else if (testResult[i] === 2) {
            value = undefined;
        } else if (testResult[i] === 3) {
            if (typeof values[keys[i]] === 'string' && includeEmptyString) {
                value = '';
            }
            value = null;
        }

        output[keys[i]] = value;
    }
    return output;
}

// 00, 01, 10, 11, 02, 12, 21, 22,
function maxRunForTest(keys, maxCap, type) {
    let count = 0;
    if (type === RUN_DIAGONALLY) {
        count = keys.length;
    } else if (type === RUN_ALL) {
        count = Math.pow(keys.length, 2) - 2; // one success and another all failure
    }
    return Math.min(count, maxCap);
}

function generateExecution(numCap, numElement, type) {
    if (type === RUN_DIAGONALLY) {
        const output = [];
        for (let i = 0; i < numElement; i++) {
            const array = _.fill(Array(numElement), 0);
            array[i] = _.random(1, 3);
            output.push(array);
        }
        return _.shuffle(output).slice(0, numCap);
    } else if (type === RUN_ALL) {
        let output = getAllCombinationPossible(numElement);
        output = _.shuffle(output).slice(0, numCap);
        for (let j = 0; j < output.length; j++) {
            for (let i = 0; i < output[j].length; i++) {
                if (output[j][i] === 1) {
                    output[j][i] = _.random(1, 3);
                }
            }
        }
        return output;
    }
}

function getAllCombinationPossible(n) {
    let output = [];
    let arr = new Array(n);
    generateAllBinaryStrings(n, arr, 0, output);
    return output.slice(1, output.length - 1);
}

function generateAllBinaryStrings(n, arr, i, output) {
    if (i === n) {
        output.push([...arr]);
        return;
    }

    // First assign "0" at ith position
    // and try for all other permutations
    // for remaining positions
    arr[i] = 0;
    generateAllBinaryStrings(n, arr, i + 1, output);

    // And then assign "1" at ith position
    // and try for all other permutations
    // for remaining positions
    arr[i] = 1;
    generateAllBinaryStrings(n, arr, i + 1, output);
}
