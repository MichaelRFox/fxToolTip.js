/** 
 * @module fxTip
 * @desc The fxTip module provides the *create* and *remove* functions which are exposed by the
 * [default]{@link module:index~default} object, which is exported in [index.js]{@link module:index}.
 * It also provides a listener to detect the removal of DOM elements that have a tooltip
 * associated with them.
 */

import {tips, tipsIndex} from './tips.js';
import {Tip} from './Tip.js';

/**
 * The timing metric used to determine how frequently the DOM should be queried for
 * removed elements. Triggers the [detectTargetRemoval]{@link module:utils~detectTargetRemoval}
 * event listener.
 * @type number
 */
const targetTimerInterval = 500;

/**
 * The timer returned by window.setInterval. Used to suspend and
 * resume target removal detection.
 * @type number
 * @global
 */
export let targetTimer;

/** 
 * @function create
 * @desc Creates a new [Tip]{@link Tip} class object with all of the default parameters.
 * @param {string} elementId The unique id of the DOM element that be associated with the tooltip.
 * @param {string} content Any valid HTML content that will be displayed in the tooltip when shown.
 * @returns {(Tip | undefined)} A newly instantiated [Tip]{@link Tip} class object. If the element
 * represented by the elementId parameter is not in the DOM, returns undefined.
 */
export function create (elementId, content) {
    if (document.getElementById(elementId) == null) {
        return;
    };
    
    let index = tipsIndex.indexOf(elementId);

    if (index !== -1) {
        tips[index].remove();
    };

    let newTip = new Tip (elementId, content);
    tips.push(newTip);
    tipsIndex.push(elementId);

    if (targetTimer == undefined) {
        targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
    };

    return tips[tips.length - 1];
 
}

/** 
 * @function remove
 * @desc Removes a specific tooltip from the stack (both the [tips]{@link module:tips~tips}
 * and [tipsIndex]{@link module:tips~tipsIndex} arrays) by calling the [Tip]{@link Tip} class
 * object's *remove* method. If the element represented by
 * the elementId parameter is not in the DOM, no action is taken.
 * @param {string} elementId The unique id of the DOM element associated with the tooltip
 * to be removed.
 */

export function remove (elementId) {
    if (document.getElementById(elementId) == null) {
        return;
    };

    let index = tipsIndex.indexOf(elementId);
    if (index !== -1) tips[index].remove();

}

/**
 * @function detectTargetRemoval
 * @desc Iterates through the tooltip stack to determine if any DOM elements associated
 * with tooltips have been removed. These tooltips are then removed from the stack.
 * @event
 */
function detectTargetRemoval() {
    tipsIndex.forEach ((thisTip, i) => {
        if (document.getElementById(thisTip) == null) {
            tips[i].remove();
        };
    });
}
