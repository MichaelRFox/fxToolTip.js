import {jest} from '@jest/globals';
import {overlap} from '../src/utils.js';

test.each`
    side                |   coords                                      |   expected
    ${'center'}         |   ${{x0: 10, x1: 300, y0: 10, y1: 600}}       | ${{side: 'center', overlap: 1, spacing: {left: 10, right: 724, top: 10, bottom: 168}}}
    ${'upper left'}     |   ${{x0: -10, x1: 10, y0: -10, y1: 10}}       | ${{side: 'upper left', overlap: 0.25, spacing: {left: -10, right: 1014, top: -10, bottom: 758}}}
    ${'upper right'}    |   ${{x0: 1014, x1: 1034, y0: -10, y1: 10}}    | ${{side: 'upper right', overlap: 0.25, spacing: {left: 1014, right:-10, top: -10, bottom: 758}}}
    ${'lower right'}    |   ${{x0: 1014, x1: 1034, y0: 758, y1: 778}}   | ${{side: 'lower right', overlap: 0.25, spacing: {left: 1014, right:-10, top: 758, bottom: -10}}}
    ${'lower left'}     |   ${{x0: -10, x1: 10, y0: 758, y1: 778}}      | ${{side: 'lower left', overlap: 0.25, spacing: {left: -10, right: 1014, top: 758, bottom: -10}}}
    ${'upper'}          |   ${{x0: 502, x1: 522, y0: -10, y1: 10}}      | ${{side: 'upper', overlap: 0.5, spacing: {left: 502, right: 502, top: -10, bottom: 758}}}
    ${'lower'}          |   ${{x0: 502, x1: 522, y0: 758, y1: 778}}     | ${{side: 'lower', overlap: 0.5, spacing: {left: 502, right: 502, top: 758, bottom: -10}}}
    ${'left'}           |   ${{x0: -10, x1: 10, y0: 374, y1: 394}}      | ${{side: 'left', overlap: 0.5, spacing: {left: -10, right: 1014, top: 374, bottom: 374}}}
    ${'right'}          |   ${{x0: 1014, x1: 1034, y0: 374, y1: 394}}   | ${{side: 'right', overlap: 0.5, spacing: {left: 1014, right: -10, top: 374, bottom: 374}}}
    `('overlap Function Test - returns $expected when side is $side and coords are $coords', ({side, coords, expected}) => {
        expect(overlap(side, coords)).toStrictEqual(expected);
});