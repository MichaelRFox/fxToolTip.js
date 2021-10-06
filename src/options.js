/** 
 * @module options
 * @desc The options module provides the [globalOptions]{@link module:options~globalOptions} object which serves as the template
 * for all [Tip]{@link Tip} object options. The [globalOptions]{@link module:options~globalOptions} object may be
 * directly changed so as to become the new defaults for all subsequently created tooltips through the globalOptions object which
 * is exposed by the [default]{@link module:index~default} object, which is exported in [index.js]{@link module:index}.
 * It also provided the [applyOptions]{@link module:options~applyOptions} function which sets the fxTooltip div's styles.
*/

import {beforeRule, afterRule, targetRule, ttContainer} from './init.js';
import {sizeTip} from './tips.js';

/**
 * @typedef {Object} globalOptions
 * @desc The globalOptions object contains all of the option settings for each tooltip. A globalOptions object is stored within each
 * [Tip]{@link Tip} object and its members may be modified by methods exposed by the [Tip]{@link Tip} object.
 * @property {string} content Contains the HTML text to be displayed when the tooltip is shown. **Default** - ''.
 * @property {string} orientation The side of the target HTML element where the tooltip is positioned. **Default**: 'right'.
 * @property {string} preferredOrientation The preferred side of the target HTML element where the tooltip is positioned. **Default**: 'right'.
 * @property {boolean} autoPosition Whether or not the tooltip should be optimally positioned relative to its owning HTML element. **Default**: true.
 * @property {boolean} autoSize Whether or not the tooltip should be optimally sized relative to its content. **Default**: true.
 * @property {boolean} mousePoint Whether the tooltip arrow should track relative to the mouse cursor. **Default**: false.
 * @property {boolean} trackMouse Whether the tooltip should track relative to the muse cursor. **Default**: false.
 * @property {string} cursor Which CSS cursor should be displayed when the mouse is over a tooltip's owing HTML element. **Default**: help'.
 * @property {string} fontFamily The font family for text inside the tooltip. **Default**: 'verdana, sans-serif'.
 * @property {int} fontSize The font size for text inside the tooltip. **Default**: '16'.
 * @property {string} foregroundColor The color for foreground elements (e.g., text) inside the tooltip. **Default**: 'white'.
 * @property {string} backgroundColor The background color of the tooltip. **Default**: '#333333'.
 * @property {int} backgroundOpacity The opacity of the tooltip. **Default**: 1.
 * @property {string} padding The tooltip padding around its content. **Default**: '5px 10px'.
 * @property {int} borderRadius The rounding of the tooltip's corners. **Default**: 12.
 * @property {string} boxShadow The box shadow to the lower left of the tooltip. **Default**: '8px 8px 8px 0 rgba(0,0,0, 0.5)'.
 * @property {string} transitionVisible The delay and duration of the tooltip becoming visible when the mouse hovers over its owing HTML element. **Default**: 'opacity 0.4s ease-in 0s'.
 * @property {string} transitionHidden The delay and duration of the tooltip becoming invisible when the mouse hovers over its owing HTML element. **Default**: 'opacity 0.4s ease-out 0s'.
 * @property {int} arrowSize The size of the tooltip's arrow. **Default**: 12.
 * @property {string} width The width of the tooltip. **Default**: 'auto'.
 * @property {string} maxWidth The maximum width of the tooltip. **Default**: 'none'.
 * @property {int} minWidth The minimum width of the tooltip. **Default**: 0.
 * @property {string} height The height of the tooltip. **Default**: 'auto'.
 * @property {string} maxHeight The maximum height of the tooltip. **Default**: 'none'.
 * @property {int} minHeight The minimum height of the tooltip. **Default**: 0.
 */
export let globalOptions = {
    content: '',
    orientation: 'right',
    preferredOrientation: 'right',
    autoPosition: true,
    autoSize: true,
    mousePoint: false,
    trackMouse: false,
    cursor: 'help',
    fontFamily: 'verdana, sans-serif',
    fontSize: '16',
    foregroundColor: 'white',
    backgroundColor: '#333333',
    backgroundOpacity: 1,
    padding: '5px 10px',
    borderRadius: 12,
    boxShadow: '8px 8px 8px 0 rgba(0,0,0, 0.5)',
    transitionVisible: 'opacity 0.4s ease-in 0s',
    transitionHidden: 'opacity 0.4s ease-out 0s',
    arrowSize: 12,
    width: 'auto',
    maxWidth: 'none',
    minWidth: 0,
    height: 'auto',
    maxHeight: 'none',
    minHeight: 0
};

/**
 * @function applyOptions
 * @desc This function is called when a DOM HTML element is hovered over, but before the tooltip becomes visible.
 * It sets the CSS styles of the fxTooltip div element in accordance with the options setting stored in its
 * [Tip]{@link Tip} class object.
 * @param {Tip} target The [Tip]{@link Tip} class object being visualized.
 */
export function applyOptions  (target) {
	
    let transitionString;

    beforeRule.fontFamily = target.font().family;
    beforeRule.fontSize = target.font().size + 'px';
    beforeRule.color = target.foregroundColor();
    beforeRule.backgroundColor = target.backgroundColor();

    beforeRule.padding = target.padding();
    beforeRule.borderRadius = target.borderRadius() + 'px';
    afterRule.borderWidth = target.arrowSize() + 'px';
    targetRule.cursor = target.cursor();

    beforeRule.boxShadow = target.boxShadow();
    beforeRule['-moz-boxShadow'] = target.boxShadow();
    beforeRule['-webkit-boxShadow'] = target.boxShadow();

    transitionString = target.transitionVisible();
    beforeRule.transition = transitionString;
    beforeRule['-moz-transition'] = transitionString;
    beforeRule['-webkit-transiton'] = transitionString;
    beforeRule['-o-transition'] = transitionString;

    beforeRule.maxWidth = (target.maxWidth() == 'none') ? 'none' : target.maxWidth() + 'px'; 
    beforeRule.minWidth = (target.minWidth() == 0) ? 0 : target.minWidth() + 'px'; 
    beforeRule.maxHeight = (target.maxHeight() == 'none') ? 'none' : target.maxHeight() + 'px'; 
    beforeRule.minHeight = (target.minHeight() == 0) ? 0 : target.minHeight() + 'px'; 	
    
    ttContainer.innerHTML = target.content();

    if (target.autoSize()) {
        sizeTip(target);
    } else {
        beforeRule.width = target.width() == 'auto' ? 'auto' : target.width() + 'px';
        beforeRule.height = target.height() == 'auto' ? 'auto' : target.height() + 'px';
    };

}