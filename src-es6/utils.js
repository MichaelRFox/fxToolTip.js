import {tip, tips, tipsIndex} from './tip.js';
import {pseudoDiv} from './startAndFinish.js';
import {mouseX, mouseY} from './mouse.js';

export let windowWidth;
export let windowHeight;
export let aspectRatio;

export function detectTargetRemoval() {
    tipsIndex.forEach ((thisTip, i) => {
        if (document.getElementById(thisTip) == null) {
            tips[i].remove();
        };
    });
/*    
    tipsIndex.forEach(function (thisTip, i) {
        if (document.getElementById(thisTip) == null) {
            tips[i].remove();
        };
    });
*/
}

export function windowResized() {
    windowWidth = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
    windowHeight = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
    aspectRatio = windowWidth / windowHeight;
}

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

function hexToRgb(hex) {
    let rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
}

export function parseColor(input) {
    let rgb;
    pseudoDiv.style.color = input;
    rgb = getComputedStyle(pseudoDiv, null).color;
    if (rgb.indexOf('#') !== -1) { 
        rgb = hexToRgb(rgb);
    } else rgb = rgb.match(/\d+/g);
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

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