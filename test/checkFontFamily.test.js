import {jest} from '@jest/globals';
import {checkFontFamily} from '../src/utils.js';

//jsdom does not suppport the fontFace interface
test.todo('checkFontFamily')

// test.each`
//     input                      |   expected
//     ${'tahoma'}                |   ${true}
//     ${'tahona, sans-serif'}    |   ${true}
//     ${'blah blah blah'}        |   ${false}
//     `('checkFontFamily Function Test - returns $expected when input is $input', ({input, expected}) => {
//         expect(checkFontFamily(input)).toBe(expected);
// });