import {jest} from '@jest/globals';
import {checkSize} from '../src/utils.js';

test.each`
    input       |   expected
    ${'16px'}   |   ${true}
    ${'1em'}    |   ${true}
    ${'32'}     |   ${false}
    `('checkSize Function Test - returns $expected when input is $input', ({input, expected}) => {
        expect(checkSize(input)).toBe(expected);
});