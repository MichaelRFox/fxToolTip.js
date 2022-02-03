import {jest} from '@jest/globals';
import {checkCSS} from '../src/utils.js';

test.todo('checkCSS')

// `
//     rule                    |   style                   |   expected
//     ${'background-color'}   |   ${'white'}              | ${true}
//     ${'border'}             |   ${'0 px 12em 4px 1em'}  | ${true}
//     ${'opacity'}            |   ${'help'}               | ${false}
//     `('checkCSS Function Test - returns $expected when rule is $rule and style is $style', ({rule, style, expected}) => {
//         expect(checkCSS(rule, style)).toBe(expected);
// });