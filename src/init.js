/** 
 * @module init
 * @desc The init module provides functions to initialize the fxToolTip environment
 * upon startup, and to remove it upon shutdown.
 */

import {windowResized} from './utils.js';
import {getRule, getRuleIndex} from './style.js';
import {targetTimer} from './fxTip.js';

/**
 * The CSS stylesheet used to store and alter the fxToolTip div elements' styles.
 * @type CSSStyleSheet
 * @global
 */
export let sheet;

/**
 * A collection of all of the CSS rules in the document's stylesheet.
 * @type Array
 * @global
 */
export let rules;

/**
 * The HTML div element inserted into the DOM which is used to display
 * all tooltips. This element is assigned the *fxToolTip* class.
 * @type DOM.element
 * @global
 */
export let ttDiv;

/**
 * The HTML div element inserted into the DOM which is used to display
 * all tooltip content. Child element of *ttDiv*.
 * @type DOM.Element
 * @global
 */
export let ttContainer;

/**
 * CSS rule associated with the *.fxToolTip* class.
 * @type CSSRule
 * @global
 */
export let beforeRule;

/**
 * CSS rule associated with the *.fxToolTip::after* pseudo class.
 * Used to style the tooltip arrow.
 * @type CSSRule
 * @global
 */
export let afterRule;

/**
 * CSS rule associated with the *.fxToolTipTarget* class. This class
 * is appended to all DOM elements associated with a tooltip. Used to
 * style the target element's cursor on hover.
 * @type CSSRule
 * @global
 */
export let targetRule;

/**
 * Represents the state of the fxToolTip environment.
 * @type boolean
 * @global
 */
export let set = false;

/**
 * @function setup
 * @desc The setup function is called upon initialization of the fxToolTip environment.
 * First, it sets a listener for the window *resize* event which invokes the
 * [windowResized]{@link module:utils~windowResized} function. Second, it determines if there
 * is a current stylesheet associated with the document, and if not inserts one. Next, it
 * inserts four class styles (*.fxToolTip*, *.fxContainer*, *.fxToolTip::after*, and *.fxTooltipTarget*).
 * *.fxToolTip* contains all of the rules that style the tooltip. *.fxToolTip::after* contains all of
 * the rules that style the tooltip arrow. *.fxContainer* contains rules that style the tooltip content.
 * *.fxToolTipTarget* contains one rule that styles the cursor of the target element on hover.
 * The setup function also appends one div element to the document body element created with the class
 * name '.fxToolTip' and styles all tooltips in the document.
 *
 * *note*:  The classes and div elements are created only once and shared by all of the tooltips.
 */
export function setUp() {

    if (set) { return; };
    
    if (window.addEventListener) {
        window.addEventListener('resize', windowResized);
    } else if (window.attachEvent) {
        window.attachEvent('onresize', windowResized);
    } else {
        window.onresize = windowResized;
    };
    windowResized();

    if (document.styleSheets.length == 0) {
        var head = document.getElementsByTagName("head")[0];
        sheet = document.createElement("style")
        sheet.type = "text/css";
        sheet.rel = 'stylesheet';
        sheet.media = 'screen';
        sheet.title = 'fxToolTip';
        sheet = head.appendChild(sheet).sheet;
    };
    
    sheet = document.styleSheets[0];
    rules = sheet.cssRules ? sheet.cssRules: sheet.rules;
    
    const fxToolTipRule = `.fxToolTip {
        opacity: 0;
        -moz-opacity: 0;
        -khtml-opacity: 0;
        position: fixed;
        visibility: hidden;
        z-index: 100;
        pointer-events: none;
        display: inline-block;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box}`

    const fxContainerRule = `.fxContainer {
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        -o-text-overflow: ellipsis}`

    const fxToolTipAfterRule = `.fxToolTip::after{
        content: "";
        position: absolute;
        border-style: solid;
        pointer-events: none;}`

    if (sheet.insertRule) {
        sheet.insertRule(fxToolTipRule, rules.length);
        sheet.insertRule(fxContainerRule, rules.length);
        sheet.insertRule(fxToolTipAfterRule, rules.length);
        sheet.insertRule('.fxToolTipTarget {cursor: help;}', rules.length);
    } else {
        sheet.addRule(fxToolTipRule, rules.length);
        sheet.addRule(fxContainerRule, rules.length);
        sheet.addRule(fxToolTipAfterRule, rules.length);
        sheet.addRule('.fxToolTipTarget', '{cursor: help;}', rules.length);
    };
    
    beforeRule = getRule('.fxToolTip').style;
    afterRule = getRule('.fxToolTip::after').style;
    targetRule = getRule('.fxToolTipTarget').style;
    
    ttDiv = document.createElement('div');
    ttDiv.className = 'fxToolTip';
    document.body.insertBefore(ttDiv, document.body.firstChild);

    ttContainer = document.createElement('div');
    ttContainer.className = 'fxContainer';
    ttDiv.appendChild(ttContainer);
    
    set = true;
}

/**
 * @function closeDown
 * @desc The closeDown function is called after the last tooltip is removed from the stack.
 * It removes all event listeners, div elements, and CSS styles and rules.
 */
export function closeDown() {
    
    if (window.removeEventListener) {
        window.removeEventListener('resize', windowResized);
    } else if (window.detachEvent) {
        window.detachEvent('onresize', windowResized);
    } else {
        window.onresize = '';
    };

    if (sheet.deleteRule) {
        sheet.deleteRule(getRuleIndex('.fxToolTip'));   
        sheet.deleteRule(getRuleIndex('.fxToolTip::after'));
        sheet.deleteRule(getRuleIndex('.fxToolTipTarget'))
    } else {
        sheet.removeRule(getRuleIndex('.fxToolTip'));
        sheet.removeRule(getRuleIndex('.fxToolTip::after'));
        sheet.removeRule(getRuleIndex('.fxToolTipTarget'))
    };
    
    ttDiv.parentNode.removeChild(ttDiv);
    pseudoDiv.parentNode.removeChild(pseudoDiv);
    
    sheet = undefined;
    rules = undefined;
    
    window.clearInterval(targetTimer);

    set = false;
}

