//import {mouseX, mouseY, beforeRule, tips, tipsIndex, targetElement} from './globals.js';
import {optimumOrientation, orient} from './orient.js';
import {applyOptions} from './options.js';
import {tips, tipsIndex, sizeTip} from './tip.js';
import {beforeRule} from './startAndFinish.js';

export let mouseX;
export let mouseY;

let timer;

function getMouseCoordinates (event) {

/*	if (typeof d3 !== 'undefined') {
		mouseX = d3.event.clientX;
		mouseY = d3.event.clientX;
	} else {
*/		mouseX = event.clientX;
		mouseY = event.clientY;
//	};
};

export function mouseOver (event) {
	var targetElement = this;
	var target;
	
	event = event || window.event;

	if (beforeRule.visibility !== 'hidden') { 
		beforeRule.transition = ''; 
		clearTimeout(timer);
	};

	beforeRule.visibility = 'visible';
	
	getMouseCoordinates(event);

	target = tips[tipsIndex.indexOf(targetElement.id)];
	
	applyOptions(target);
//	if (target.autoSize()) { sizeTip(target); };
//	beforeRule.width = target.width() + 'px';
	if (target.autoPosition()) { // == true) {
		target.orientation(optimumOrientation(targetElement, target), true);
	};
	orient(targetElement, target);
	beforeRule.opacity = target.backgroundOpacity();
};

export function mouseMove (event) {
	var targetElement = this;
	var target;
	
	event = event || window.event;
	
	target = tips[tipsIndex.indexOf(targetElement.id)];
	if (!target.trackMouse()) { return; }; // == false) { return; };

	getMouseCoordinates(event);

	if (target.autoPosition()) { target.orientation(optimumOrientation(targetElement, target), true); };
//		if (target.autoPosition() == true) { target.orientation(optimumOrientation(targetElement, target), true); };
	orient(targetElement, target);
};

export function mouseOut (event) {
	var targetElement = this;
	var target;
	var transitionString;
	var transitionDuration;

	event = event || window.event;
	target = tips[tipsIndex.indexOf(targetElement.id)];

	transitionString = target.transitionHidden();
	beforeRule.transition = transitionString;
	beforeRule['-moz-transition'] = transitionString;
	beforeRule['-webkit-transiton'] = transitionString;
	beforeRule['-o-transition'] = transitionString;
	transitionDuration =  transitionString.split(' ')[1].replace('s', '');
	timer = window.setTimeout(function() { beforeRule.visibility = 'hidden'; }, transitionDuration * 1000);
	beforeRule.opacity = 0;
};

