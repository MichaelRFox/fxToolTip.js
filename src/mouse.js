/** 
 * @module mouse
 * @desc The mouse module provides three event listener functions for mouseover, mouseout, and mousemove 
 * events. Additionally, it provides a suspend function which is exposed by the
 * [default]{@link module:index~default} object, which is exported in [index.js]{@link module:index}
 */

import {getOrientation, optimumOrientation, position} from './orient.js';
import {applyOptions, resetOptions} from './options.js';
import {tips, tipsIndex, sizeTip} from './tips.js';
import {beforeRule} from './init.js';
import {checkBoolean} from './utils.js';

/**
 * The current mouse cursor X position in the client space.
 * @type number
 * @global
 */
export let mouseX;

/**
 * The current mouse cursor Y position in the client space.
 * @type number
 * @global
 */
export let mouseY;

/**
 * Countdown timer that executes a on [mouseout]{@link module:mouse~mouseOut} event
 * to ensure that the .fxToolTip visibility CSS rule
 * is not set to hidden until the current tooltip's transition to hidden is completed.
 * @type number
 * @inner
 */ 
let timer;

/**
 * Current state of the [suspended]{@link module:mouse~suspend} toggle.
 * @type boolean
 * @inner
 */
let suspended = false;

/**
 * @function getMouseCoordinates
 * @desc Internal helper function which retrieves the current X and Y coordinates in the client window
 * and stores them in the global variables mouseX and mouseY.
 * @param {Event} event - The firing window event
 */ 
function getMouseCoordinates (event) {

    event = event || window.event;

    mouseX = event.clientX;
    mouseY = event.clientY;

}

/**
 * @function mouseOver
 * @desc Fires when the cursor hovers over a DOM element that has a tooltip associated with it.
 * @param {Event} event - The firing event.
 * @event mouseover
 */
export function mouseOver (event) {
    
    event = event || window.event;

    if (suspend()) {return};
    
    let targetElement = this;
    let target;

    if (beforeRule.visibility !== 'hidden') { //executed if another tooltip is transitioning to hidden
        beforeRule.transition = ''; 
        clearTimeout(timer);
    };

    beforeRule.visibility = 'visible';

    getMouseCoordinates(event);

    target = tips[tipsIndex.indexOf(targetElement.id)];

    applyOptions(target);

    let orientation = getOrientation(targetElement, target);

    position(targetElement, target, orientation);
    beforeRule.opacity = target.backgroundOpacity();
}

/**
 * @function mouseMove
 * @desc Fires when the cursor moves over a DOM element that has a tooltip associated with it.
 * @param {event} event - The firing window event.
 * @event mousemove
 */
export function mouseMove (event) {

    event = event || window.event;
    
    if (suspend()) {return};
    
    let targetElement = this;
    let target;
    
    target = tips[tipsIndex.indexOf(targetElement.id)];
    if (!target.trackMouse()) { return; };

    getMouseCoordinates(event);

    let orientation = getOrientation(targetElement, target);

    position(targetElement, target, orientation);
}

/**
 * @function mouseOut
 * @desc Fires when the cursor leaves a DOM element that has a tooltip associated with it.
 * @param {event} event - The firing window event.
 * @event mouseout
 */
export function mouseOut (event) {

    event = event || window.event;

    let targetElement = this;

    if (window.getComputedStyle(targetElement, null).getPropertyValue('opacity') == 0 && suspend()) {
        return;
    }

    let target = tips[tipsIndex.indexOf(targetElement.id)];
    let transitionString = target.transitionHidden();
    let transitionDuration = +transitionString.split(' ')[1].replace('s', '');
    let transitionDelay = +transitionString.split(' ')[3].replace('s', '');

    beforeRule.transition = transitionString;
    beforeRule['-moz-transition'] = transitionString;
    beforeRule['-webkit-transiton'] = transitionString;
    beforeRule['-o-transition'] = transitionString;

    timer = window.setTimeout(function() { // ensures the visibility isn't set to hidden until the transition completes
        beforeRule.visibility = 'hidden';
        resetOptions(target);
        },
        (transitionDuration + transitionDelay) * 1000);
    beforeRule.opacity = 0;

}

/** 
 * @function suspend
 * @desc This method is useful for temporarily suspending and re-enabling tooltips globally
 *  in such cases where other on-screen interaction may be interfered with by the tooltips.
 * @param {boolean} suspendTips Whether or not to suspend toolTips.
 * @returns {(boolean | undefined)} If the method is called without the suspendTips argument, the method 
 * returns the current state of tooltips (true for suspended, false for enabled). 
 * Otherwise, nothing is returned.
 */ 
export function suspend (suspendTips) {
    if (suspendTips == undefined) {return suspended};
    if (checkBoolean(suspendTips, 'suspend')) {
        suspended = suspendTips;
    };

}