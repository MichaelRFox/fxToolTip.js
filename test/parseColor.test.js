import {jest} from '@jest/globals';
import {parseColor} from '../src/utils.js';

// todo: jsDom doesn't seem to parse hsl or named colors correctly 
test.each`
    input                       |   expected
    ${'#B8860B'}                |   ${'rgb(184, 134, 11)'}
    ${'#E9967A'}                |   ${'rgb(233, 150, 122)'}
    ${'#000'}                   |   ${'rgb(0, 0, 0)'}
    ${'rgb(120, 120, 120)'}     |   ${'rgb(120, 120, 120)'}
    ${'rgba(55, 24, 128, 80)'}  |   ${'rgb(55, 24, 128)'}
    ${'#E9967A80'}              |   ${'rgb(233, 150, 122)'}
    `('parseColor Function Test - returns $expected when input is $input', ({input, expected}) => {
        expect(parseColor(input)).toBe(expected);
});