import {windowResized, detectTargetRemoval} from './utils.js';
import {getRule, getRuleIndex} from './style.js';

export let sheet;
export let rules;
export let ttDiv;
export let ttContainer;
export let beforeRule;
export let afterRule;
export let targetRule;
export let set = false;
export let pseudoDiv;
export const targetTimerInterval = 500;
//export let targetTimer = null;

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

//	if (document.styleSheets.length == 0) {
		var head = document.getElementsByTagName("head")[0];
		sheet = document.createElement("style")
		sheet.type = "text/css";
		sheet.rel = 'stylesheet';
		sheet.media = 'screen';
		sheet.title = 'fxToolTip';
		sheet = head.appendChild(sheet).sheet;
//	};
	
	sheet = document.styleSheets[0];
	rules = sheet.cssRules ? sheet.cssRules: sheet.rules;

			
	
	if (sheet.insertRule) {
//		sheet.insertRule('.fxToolTip {opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block;}', rules.length);
		sheet.insertRule('.fxToolTip {opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block}', rules.length);
		sheet.insertRule('.fxContainer {width:100%;height:100%;overflow:hidden;text-overflow:ellipsis}', rules.length);

//		sheet.insertRule('.fxToolTip {opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block; text-overflow:clip}', rules.length);
		sheet.insertRule('.fxToolTip::after{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
		sheet.insertRule('.fxToolTipTarget {cursor: help;}', rules.length);
	} else {
//		sheet.addRule('.fxToolTip', '{opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block;}', rules.length);
		sheet.addRule('.fxToolTip', '{opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block}', rules.length);
//		sheet.addRule('.fxToolTip', '{opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block; text-overflow:clip}', rules.length);
		sheet.addRule('.fxContainer', '{width:100%;height:100%;overflow:hidden;text-overflow:ellipsis}', rules.length);
		sheet.addRule('.fxToolTip::after', '{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
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

	pseudoDiv = document.createElement('div');
	pseudoDiv.style.visible = 'hidden';
	pseudoDiv.style.position = 'absolute';
	pseudoDiv.style.display = 'inline-block';
	document.body.insertBefore(pseudoDiv, document.body.firstChild);
	
	//targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
	
	set = true;
};

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
	
	set = false;
};

