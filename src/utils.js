/** 
 * @module utils
 * @desc The utils module provides a variety of helper functions to parse and convert variables,
 * get coordinates, and validate parameters.
 */

import {tips, tipsIndex} from './tips.js';
import {mouseX, mouseY} from './mouse.js';

/**
 * Global variable containing the width of the current viewport. Updated by the
 * [windowResized]{@link event:windowResized} event listener.
 * @type number
 * @global
 */
export let windowWidth = 1024;

/**
 * Global variable containing the height of the current viewport. Updated by the
 * [windowResized]{@link event:windowResized} event listener.
 * @type number
 * @global
 */
export let windowHeight = 768;

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
    windowWidth =  document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    windowHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight ;
    aspectRatio = windowWidth / windowHeight;
}

/**
 * @function getElementCoordinates
 * @desc Gets the width, height, top, and left coordinate in the client space
 * for any DOM element. Used to retrieve the dimensions of the tooltip target.
 * @param {DOM.element} element The DOM element whose tooltip is being queried.
 * @returns {Object} The width, height, top, and left coordinate in the client space.
 */
export function getElementCoordinates (element) {
    const cursorBuffer = 0;
    let clientRect = {};
    let boundingClientRect = {};

    let target = tips[tipsIndex.indexOf(element.id)];
    
    if (target.mousePoint()) {
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
 * @function overlap
 * @desc Computes the percent of a div element that is within the bounds of the viewport.
 * Used to support [optimum-orientaton]{@link module:orient~optimumOrientation}.
 * @param {Object} coords The absolute coordinates {x0, x1, y0, y1} of the div element of interest.
 * @returns {Object} An object containing the side, overlap, and the spacing around each side.
 * @since v2.2.0
 */
export function overlap (side, coords) {
    const precision = 7;

    const divArea = (coords.x1 - coords.x0) * (coords.y1 - coords.y0);

    const xDist = (Math.min(coords.x1, windowWidth) - Math.max(coords.x0, 0));
    const yDist = (Math.min(coords.y1, windowHeight) - Math.max(coords.y0, 0));

    const overlapArea = xDist > 0 && yDist > 0 ? xDist * yDist : 0;

    const overlap = parseFloat((overlapArea / divArea).toFixed(precision));
    const spacing = {
        left: coords.x0,
        right: windowWidth - coords.x1,
        top: coords.y0,
        bottom: windowHeight - coords.y1
    };

    return {side: side, overlap: overlap, spacing: spacing};
}

/**
 * @function hexToRgb
 * @desc Converts a CSS string formatted as hex to rgb format.
 * @param {string} hex The hex representation of the CSS color
 * @returns {string} The color formatted as an rgb string.
 */
function hexToRgb(hex) {
    let rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    // return `rgb(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)})`;
    return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
}

/** 
 * @function createPseudoDiv
 * @desc Creates a hidden div element to facillitate parsing of [colors]{@link module:utils~parseColor}
 * and [sizes]{@link module:utils~parseSize}. If the template argument is passed clones the div properties from it.
 * @param {HTML.div} template An existing div element.
 * @returns {HTML.div} A hidden div element.
 * @since v2.2.0
 */
function createPseudoDiv (template) {

    let pseudoDiv = document.createElement('div');

    if (template != undefined) {
        const font = window.getComputedStyle(template, null).getPropertyValue('font');
        pseudoDiv.style.font = font;
        pseudoDiv.style.width = template.getBoundingClientRect()['width'] + 'px';
        pseudoDiv.style.height = template.getBoundingClientRect()['height'] + 'px';
    };
    pseudoDiv.style.visibility = 'hidden';
    pseudoDiv.style.position = 'absolute';
    pseudoDiv.style.display = 'inline-block';
    pseudoDiv.id = 'pseudoDiv';
    document.body.insertBefore(pseudoDiv, document.body.firstChild);

    return pseudoDiv;
}

/**
 * @function parseColor
 * @desc Parses any valid CSS color
 * @param {string} color Any valid CSS color.
 * @returns {string} The CSS color formatted as an rgb string.
 * If opacity values (e.g., rgba) are passed, the opacity is
 * stripped out and simple rgb is returned.
 */
export function parseColor(color) {
    let pseudoDiv = createPseudoDiv();
    pseudoDiv.style.color = color;
    let rgb = window.getComputedStyle(pseudoDiv, null).getPropertyValue('color');
    if (rgb.indexOf('#') !== -1) { 
        rgb = hexToRgb(rgb);
    } else rgb = rgb.match(/\d+/g);
    pseudoDiv.remove()
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * @function parseSize
 * @desc Parses any valid CSS size.
 * @param {(number | string)} size Any valid CSS size (e.g. 12px, 3em).
 * @param {string} dimension The dimension ['width' | 'height'] to return.
 * **Default**: 'width'.
 * @param {HTML.div} template A div element containing the style options of a tooltip.
 * If the size to be computed, this argument must be passed.
 * @returns {number} The size in pixels (without the 'px' suffix).
 */
export function parseSize (size, dimension = 'width', template) {
    if (typeof size == 'number') { return size; };
    let result;
    let pseudoDiv = createPseudoDiv (template);
    if (size.indexOf('%') != -1) {
        let percent = parseInt(size, 10) / 100;
        result = pseudoDiv.getBoundingClientRect()[dimension] * percent;
    } else {
        pseudoDiv.style[dimension] = size;
        result = pseudoDiv.getBoundingClientRect()[dimension];       
    };
    pseudoDiv.remove();
    return result;
}

/**
 * @function checkSize
 * @desc Validates that the size is a valid CSS size.
 * @param {string} size Any valid CSS size (e.g. 12px, 3em).
 * @returns {boolean} True if the size argument is a valid size, false
 * otherwise - logs an error to the console.
 * @since v2.2.0
 */
export function checkSize (size) {
    if (typeof size == 'string') {
        const regex = /^(\d*\.)?\d+(?:(cm)|(mm)|(in)|(px)|(pt)|(pc)|(em)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(%))/;
        let match = size.match(regex);
        if (match != null && match[0].length == size.length) { return true; }; 
    };
    console.log(`Option setting error. ${size} is an invalid CSS size`);
    return false;
}

/**
 * @function checkBoolean
 * @desc Validates whether an input is boolean [true | false].
 * @since v2.1.0
 * @param {(any | boolean)} argument The argument to be checked.
 * @param {string} argumentName A string representation of the calling function.
 * @returns {boolean} True if the argument is boolean, false otherwise - logs an error to the console.
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
 * browsers support the FontFaceSet interface (esp. all versions of Internet Explorer - 
 * if you are still using IE, I'm coming to your house and setting your computer on fire).
 * @since v2.1.0
 * @param {string} argument The font family being checked.
 * @returns {boolean} True if the font is available or the FontFaceSet interface is unsupported,
 * false otherwise - logs an error to the console
 */
export function checkFontFamily (fontFamily) {
    if (document.fonts == undefined) return true;  //interface undefined - probably IE
    if (document.fonts.check(`16px ${fontFamily}`)) return true;
    console.log (`Option setting error. ${fontFamily} is not a valid font family for this browser`);
    return false;
}

/**
 * @function checkCSS
 * @desc Validates whether a CSS value is valid. It does this by setting the value in a
 * temporary div element and the checking to see if the style has indeed changed.
 * @param {string} rule The CSS rule (e.g., padding, border-radius, etc.) being checked.
 * @param {string} style The style to validate.
 * @returns {boolean} True if the CSS is valid, false otherwise - logs an error to the console
 * @since v2.1.0
 */
export function checkCSS (rule, style) {
    if (style == 'initial') { return true; }; //always valid
    let result;
    let pseudoDiv = createPseudoDiv();
    pseudoDiv.style[rule] = 'initial';
    pseudoDiv.style[rule] = style;
    if (pseudoDiv.style[rule] == 'initial') {
        console.log(`Option setting error. ${style} is not a valid style for ${rule}`);
        result = false;
    } else {
        result = true;
    };

    pseudoDiv.remove()
    return result;
}