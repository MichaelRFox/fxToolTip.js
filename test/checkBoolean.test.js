import {jest} from '@jest/globals';
import {checkBoolean} from '../src/utils.js';

test.each`
    input           |   expected
    ${true}         |   ${true}
    ${false}        |   ${true}
    ${1}            |   ${false}
    ${undefined}    |   ${false}
    ${null}         |   ${false}
    ${''}           |   ${false}
    `('checkBoolean Function Test - returns $expected when input is $input', ({input, expected}) => {
        expect(checkBoolean(input)).toBe(expected);
});