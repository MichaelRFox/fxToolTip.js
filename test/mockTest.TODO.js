import {jest} from '@jest/globals';
// import {windowHeight, windowWidth, overlap} from '../src/utils.js';
const utilsModule = await import ('../src/utils.js');

jest.mock (utilsModule, async () => {
	// const utilsModule = jest.requireActual('../src/utils.js');
		return {
			__esModule: true,
			...jest.requireActual(utilsModule),
			// ...utilsModule,
			overlap: jest.fn(() => {overlap}),
			windowWidth: 900,
			windowHeight: 600
		};
});


test('Test of mock', () => {
	// expect(overlap('left', {x0: 10, x1: 300, y0: 10, y1: 600})).toStrictEqual({side: 'left', overlap: 1, spacing: {left: 10, right: 724, top: 10, bottom: 168}});
	expect(utilsModule.windowWidth).toBe(900);
	// expect(windowHeight).toBe(600);
});