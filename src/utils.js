/** 
 * @module utils
 * @desc The utils module provides a variety of helper functions to parse and convert variables,
 * get coordinates, and validate parameters.
 */

import {tips, tipsIndex} from './tips.js';
import {pseudoDiv} from './init.js';
import {mouseX, mouseY} from './mouse.js';

/**
 * Global variable containing the width of the current viewport. Updated by the
 * [windowResized]{@link event:windowResized} event listener.
 * @type number
 * @global
 */
export let windowWidth;

/**
 * Global variable containing the height of the current viewport. Updated by the
 * [windowResized]{@link event:windowResized} event listener.
 * @type number
 * @global
 */
export let windowHeight;

/**
 * Global variable containing the aspect ratio of the current viewport. Updated by the
 * [windowResized]{@link event:windowResized} event listener.
 * @type number
 * @global
 */
export let aspectRatio;

/** 
 * @function windowResized
 * @desc Monitors changes in window size and resets the global [windowWidth]{@link windowWidth},
 * [windowHeight]{@link windowHeight}, and [aspectRatio]{@link aspectRatio} variables.
 * @event
 */
export function windowResized() {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    aspectRatio = windowWidth / windowHeight;
}

/**
 * @function getElementCoordinates
 * @desc Gets the width, height, top, and left coordinate in the client space
 * for any DOM element.
 * @param {DOM.element} element The DOM element whose tooltip is being queried.
 * @returns {Object} The width, height, top, and left coordinate in the client space
 */
export function getElementCoordinates (element) {
    let cursorBuffer = 0;
    let clientRect = {};
    let boundingClientRect = {};

    let target = tips[tipsIndex.indexOf(element.id)];
    
    if (target.mousePoint()) {// == true) {
        clientRect.left = mouseX - cursorBuffer;
        clientRect.top = mouseY - cursorBuffer;
        clientRect.right = mouseX + cursorBuffer;
        clientRect.bottom = mouseY + cursorBuffer;
    } else {
        boundingClientRect = element.getBoundingClientRect();
        clientRect.left = boundingClientRect.left - cursorBuffer;
        clientRect.top = boundingClientRect.top - cursorBuffer;
        clientRect.right = boundingClientRect.right + cursorBuffer;
        clientRect.bottom = boundingClientRect.bottom + cursorBuffer;
    };
    let height = clientRect.bottom - clientRect.top;
    let width = clientRect.right - clientRect.left;

    return {top: clientRect.top, left: clientRect.left, height: height, width: width};
}

/**
 * @function hexToRgb
 * @desc Converts a CSS string formatted as hex to rgb format.
 * @param {string} hex The hex representation of the CSS color
 * @returns {string} The color formatted as an rgb string.
 */
function hexToRgb(hex) {
    let rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
}

/**
 * @function parseColor
 * @desc Parses any valid CSS color
 * @param {string} input Any valid css color.
 * @returns {string} The CSS color formatted as an rgb string
 */
export function parseColor(input) {
    pseudoDiv.style.color = input;
    let rgb = getComputedStyle(pseudoDiv, null).color;
    if (rgb.indexOf('#') !== -1) { 
        rgb = hexToRgb(rgb);
    } else rgb = rgb.match(/\d+/g);
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

/**
 * @function parseSize
 * @desc Parses any valid CSS size, except for percentage.
 * @param {(number | string)} size Any valid CSS size (e.g. 12px, 3em)
 * @param {string} dimension The dimension ['width' | 'height'] to return.
 * **Default**: 'width'.
 * @returns {number} The size in pixels.
 * 
 */
export function parseSize (size, dimension) {
    if (typeof size == 'number') { return size; };
    dimension = (dimension == undefined) ? 'width' : dimension;
    if (dimension == 'width') { 
        pseudoDiv.style.width = size;
        return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('width'), 10);
    } else {
        pseudoDiv.style.height = size;
        return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('height'), 10);
    };
}

/**
 * @function checkBoolean
 * @desc Validates whether an input is boolean [true | false].
 * @since v2.1.0
 * @param {(any | boolean)} argument The argument to be checked.
 * @param {string} argumentName A string representation of the calling function.
 * @returns {boolean} True if the argument is boolean, false otherwise - logs an error to the console
 */
export function checkBoolean (argument, argumentName) {
    if ([true, false].indexOf(argument) == -1) {
        console.log(`Option setting error. ${argumentName} must be one of [true | false]`);
        return false;
    } else {
        return true;
    };
}

/**
 * @function checkFontFamily
 * @desc Validates whether a font family is available on the browser. Note not all
 * browsers support the document.font interface (esp. all versions of Internet Explorer - 
 * if you are still using IE, I'm coming to your house and setting your computer on fire).
 * @since v2.1.0
 * @param {string} argument The font family being checked.
 * @returns {boolean} True if the font is available or the document.font interface is unsupported,
 * false otherwise - logs an error to the console
 */
export function checkFontFamily (fontFamily) {
    if (document.fonts == undefined) return true;  //interface undefined - probably IE
    if (document.fonts.check(`16px ${fontFamily}`)) return true;
    console.log(`Option setting error. ${fontFamily} is not a valid font family for this browser`);
    return false;
}

/**
 * @function checkCSS
 * @desc Validates whether a CSS value is valid. It does this by setting the value in a div
 * and the checking to see if the style has indeed changed.
 * @since v2.1.0
 * @param {string} variable The CSS rule (e.g., padding, border-radius, etc.) being checked.
 * @param {string} style The style to validate.
 * @returns {boolean} True if the CSS is valid, false otherwise - logs an error to the console
 */
export function checkCSS (variable, style) {
    pseudoDiv.style[variable] = 'initial';
    pseudoDiv.style[variable] = style;
    if (pseudoDiv.style[variable] == 'initial') {
        console.log(`Option setting error. ${style} is not a valid style for ${variable}`);
        return false;
    } else {
        return true;
    };
}