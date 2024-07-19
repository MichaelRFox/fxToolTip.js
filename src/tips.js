/** 
 * @module tips
 * @desc The tips module provides functions to retrieve a tip object from its owning DOM element's
 * unique id and to auto-size a tooltip.
 */

import {ttDiv, beforeRule} from './init.js';
import {aspectRatio} from './utils.js';

/**
 * An array of [Tip]{@link Tip} class objects representing all of the tooltips that have been instantiated.
 * @type Array
 * @global
 */
export let tips = [];

/**
 * An array of DOM element ids corresponding to each of the [Tip]{@link Tip} class objects in the *tips* array.
 * @type Array
 * @global
 */
export let tipsIndex = [];

/**
 * @function getTipByElementId
 * @desc Retrieves the [Tip]{@link Tip} class object associated with the DOM element that 
 * has the unique id provided by the argument, *elementId*. If there is no [Tip]{@link Tip} class object 
 * associated with the id, returns undefined. This is useful for when you create several tooltips 
 * which will need to accessed at run time and you do not wish to store a variable to hold each.
 * @param {string} elementId The unique id of the target DOM element whose tooltip you want to retrieve.
 * @returns {Tip} if the tip exists, returns the [Tip]{@link Tip} class object associated with the DOM
 * element id provided. Otherwise, undefined.
 */
export function getTipByElementId(elementId) {
    let index = tipsIndex.indexOf(elementId);
    if (index !== -1) {
        return tips[index];
    } else {
        return (undefined);
    };
}

/** 
 * @function sizeTip
 * @desc Automatically sizes the tooltip to roughly correspond to the viewport's aspect ratio.
 * This function is only called if the [autoSize]{@link Tip#autoSize} option is true.
 */
export function sizeTip () {

    // beforeRule.aspectRatio = aspectRatio;
    // beforeRule.maxWidth = 'min-content';

    // let minWidth = ttDiv.getBoundingClientRect()['width'];
    // let maxHeight = ttDiv.getBoundingClientRect()['height'];
    // let area = minWidth * maxHeight;
    // let width = Math.ceil(Math.sqrt(area * aspectRatio));

    // beforeRule.width = width + 'px';
    // beforeRule.maxWidth = 'none';

    // return;

    function getAspect () {
        return ttDiv.getBoundingClientRect()['width'] / ttDiv.getBoundingClientRect()['height'];
    }

    function getPerimeter() {
        return ttDiv.getBoundingClientRect()['width'] + ttDiv.getBoundingClientRect()['height'];
    }

    beforeRule.width = 'auto';
    beforeRule.height = 'auto';

    let perimeter;
    let height;
    let width;

    let oldWidth = ttDiv.getBoundingClientRect()['width'];
    let newAspect = getAspect();
    let oldDelta = Math.abs(newAspect - aspectRatio);
    let itterations = 0;
    let newDelta = oldDelta;

    while (newDelta > 0.1 && itterations < 10) {
        perimeter = getPerimeter();
        height = 1 / ((aspectRatio + 1) / perimeter);
        width = perimeter - height;
        beforeRule.width = Math.round(width) + 'px';
        newAspect =getAspect();
        newDelta = Math.abs(newAspect - aspectRatio);
        if (Math.abs(newDelta - oldDelta) < 0.1) {
            if (oldDelta < newDelta) { beforeRule.width = Math.round(oldWidth) + 'px' };
            itterations = 10;
        } else {
            oldWidth = width;
            oldDelta = newDelta;
            itterations++;
        };
    };

    beforeRule.width = ttDiv.getBoundingClientRect()['width'] + 'px';
    beforeRule.height = ttDiv.getBoundingClientRect()['height'] + 'px';
     
}