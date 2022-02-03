import {jest} from '@jest/globals';
import {parseSize} from '../src/utils.js';

//jsdom doesn't support getBoundingClientRect
test.todo('parseSize')

// `
//     input       |   expected
//     ${'16px'}   |   ${16}
//     ${'1em'}    |   ${16}
//     ${32}       |   ${32}
//     `('parseSize Function Test - returns $expected when input is $input', ({input, expected}) => {
//         expect(parseSize(input)).toBe(expected);
// });
