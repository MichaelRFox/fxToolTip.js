/** 
 * @module fxTip
 * @desc The fxTip module provides the *create* and *remove* functions which are exposed by the
 * [default]{@link module:index~default} object, which is exported in [index.js]{@link module:index}.
 * It also provides a listener to detect the removal of DOM elements that have a tooltip
 * associated with them and exports a method to suspend polling of the DOM for removed elements.
 */

import {tips, tipsIndex} from './tips.js';
import {Tip} from './Tip.js';
import {checkBoolean} from './utils.js'

/**
 * The state of whether DOM polling is enabled
 * @type boolean
 * @since v2.1.1
 */
let DOMchecking = true;

/**
 * The timing metric used to determine how frequently the DOM should be queried for
 * removed elements. Triggers the [detectTargetRemoval]{@link module:utils~detectTargetRemoval}
 * event listener.
 * @type number
 * @const
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
 * @desc Creates a new [Tip]{@link Tip} class object with all of the default parameters. If a tooltip
 * is already associated with DOM element represented by the *elementId* parameter, that tolltip is
 * deleted and replaced by a new one.
 * @param {string} elementId The unique id of the DOM element that be associated with the tooltip.
 * @param {string} content Any valid HTML content that will be displayed in the tooltip when shown.
 * @returns {(Tip | undefined)} A newly instantiated [Tip]{@link Tip} class object. If the element
 * represented by the elementId parameter is not in the DOM, returns undefined.
 */
export function create (elementId, content) {
    if (document.getElementById(elementId) == null) {
        return;
    };
    
    content = content == undefined ? '' : content;

    let index = tipsIndex.indexOf(elementId);

    if (index !== -1) {
        tips[index].remove();
    };

    let newTip = new Tip (elementId, content);
    tips.push(newTip);
    tipsIndex.push(elementId);

    if (targetTimer == undefined && DOMchecking) {
        targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
    };

    return tips[tips.length - 1];
 
}

/** 
 * @function remove
 * @desc Removes a specific tooltip from the stack (both the [tips]{@link module:tips~tips}
 * and [tipsIndex]{@link module:tips~tipsIndex} arrays) by calling the [Tip]{@link Tip} class
 * object's *remove* method. If the DOM element represented by
 * the *elementId* parameter is not in the DOM, no action is taken.
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
 * @function checkDOM
 * @desc Controls whether the DOM will be periodically polled to see if DOM elements
 * that are associated with a tooltip have been remove from the document, and
 * automatically removes the [Tip]{@link Tip} class object. This may be useful if
 * your document has a large number of tooltips and you don't desire the additional
 * overhead of polling the DOM.
 * @param {boolean} checkDOM Whether to poll the DOM or not.
 * @since v2.1.1
 */
export function checkDOM (checkDOM) {
    if (checkDOM == undefined) return DOMchecking;
    if (checkBoolean(checkDOM)) {
        DOMchecking = checkDOM;
        if (DOMchecking) {
            targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);            
        } else {
            window.clearInterval(targetTimer);
        };
    };
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
