var fxToolTip = (function () {
'use strict';

//import {ttDiv, windowHeight, beforeRule, afterRule} from './globals.js';

function orient(targetElement, target) {

	var targetCoordinates = getElementCoordinates(targetElement);
	var top = void 0;
	var left = void 0;
	var verticalAdjust = void 0;
	var horizontalAdjust = void 0;
	var sizeAdjust = void 0;
	//var arrowAdjust;

	var adjustVertical = function adjustVertical(top) {
		var topAdjust = top;
		var arrowAdjust = ttDiv.offsetHeight / 2;

		if (top < 0) {
			topAdjust = 0;
			arrowAdjust = Math.max(target.arrowSize() + target.borderRadius(), top + ttDiv.offsetHeight / 2);
		} else if (top + ttDiv.offsetHeight > windowHeight) {
			topAdjust = windowHeight - ttDiv.offsetHeight;
			arrowAdjust = Math.min(ttDiv.offsetHeight - target.borderRadius() - target.arrowSize(), ttDiv.offsetHeight / 2 + top - topAdjust);
		}

		return { topAdjust: Math.round(topAdjust), arrowAdjust: Math.round(arrowAdjust) };
	};

	var adjustHorizontal = function adjustHorizontal(left) {
		var leftAdjust = left;
		var arrowAdjust = ttDiv.offsetWidth / 2;

		if (left < 0) {
			leftAdjust = 0;
			arrowAdjust = Math.max(target.arrowSize() + target.borderRadius(), left + ttDiv.offsetWidth / 2);
		} else if (left + ttDiv.offsetWidth > windowWidth) {
			leftAdjust = windowWidth - ttDiv.offsetWidth;
			arrowAdjust = Math.min(ttDiv.offsetWidth - target.borderRadius() - target.arrowSize(), ttDiv.offsetWidth / 2 + left - leftAdjust);
		}

		return { leftAdjust: Math.round(leftAdjust), arrowAdjust: Math.round(arrowAdjust) };
	};

	switch (target.orientation()) {
		case 'top':
			{
				top = targetCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
				if (top < 0) {
					beforeRule.height = Math.round(ttDiv.offsetHeight + top - target.arrowSize()) + 'px';
					top = 0;
				}
				left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
				horizontalAdjust = adjustHorizontal(left);

				beforeRule.top = Math.round(top) + 'px';
				beforeRule.left = horizontalAdjust.leftAdjust + 'px';

				afterRule.top = '99.5%'; //	'100%';
				afterRule.left = horizontalAdjust.arrowAdjust + 'px';
				afterRule.bottom = '';
				afterRule.right = '';
				afterRule.marginLeft = -target.arrowSize() + 'px';
				afterRule.marginTop = '';
				afterRule.borderColor = target.backgroundColor() + ' transparent transparent transparent';
				break;
			};
		case 'bottom':
			{
				top = targetCoordinates.top + targetCoordinates.height + target.arrowSize();
				sizeAdjust = windowHeight - (ttDiv.offsetHeight + top + target.arrowSize());
				beforeRule.height = sizeAdjust < 0 ? ttDiv.offsetHeight + sizeAdjust + 'px' : beforeRule.height;
				left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
				horizontalAdjust = adjustHorizontal(left);

				beforeRule.top = Math.round(top) + 'px';
				beforeRule.left = horizontalAdjust.leftAdjust + 'px';

				afterRule.top = '';
				afterRule.left = horizontalAdjust.arrowAdjust + 'px';
				afterRule.bottom = '99.5%'; //'100%';
				afterRule.right = '';
				afterRule.marginLeft = -target.arrowSize() + 'px';
				afterRule.marginTop = '';
				afterRule.borderColor = 'transparent transparent ' + target.backgroundColor() + ' transparent';
				break;
			};
		case 'left':
			{
				top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
				left = targetCoordinates.left - ttDiv.offsetWidth - target.arrowSize();
				if (left < 0) {
					beforeRule.width = ttDiv.offsetWidth + left + 'px';
					left = 0;
				}
				verticalAdjust = adjustVertical(top);

				beforeRule.top = verticalAdjust.topAdjust + 'px';
				beforeRule.left = Math.round(left) + 'px';

				afterRule.top = verticalAdjust.arrowAdjust + 'px';
				afterRule.left = '99.5%'; //'100%';
				afterRule.bottom = '';
				afterRule.right = '';
				afterRule.marginLeft = '';
				afterRule.marginTop = -target.arrowSize() + 'px';
				afterRule.borderColor = 'transparent transparent transparent ' + target.backgroundColor();
				break;
			};
		case 'right':
			{
				top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
				left = targetCoordinates.left + targetCoordinates.width + target.arrowSize();
				sizeAdjust = windowWidth - (ttDiv.offsetWidth + left + target.arrowSize());
				beforeRule.width = sizeAdjust < 0 ? ttDiv.offsetWidth + sizeAdjust + 'px' : beforeRule.width;
				verticalAdjust = adjustVertical(top);

				beforeRule.top = verticalAdjust.topAdjust + 'px';
				beforeRule.left = Math.round(left) + 'px';

				afterRule.top = verticalAdjust.arrowAdjust + 'px';
				afterRule.left = '';
				afterRule.bottom = '';
				afterRule.right = '99.5%'; //'100%';
				afterRule.marginLeft = '';
				afterRule.marginTop = -target.arrowSize() + 'px';
				afterRule.borderColor = 'transparent ' + target.backgroundColor() + ' transparent transparent';
				break;
			};
	}
}

function optimumOrientation(targetElement, target) {

	var elementCoordinates = getElementCoordinates(targetElement);
	var elementCenterH = elementCoordinates.left + elementCoordinates.width / 2;
	var elementCenterV = elementCoordinates.top + elementCoordinates.height / 2;

	var leftSpacing = elementCenterH - ttDiv.offsetWidth / 2;
	var rightSpacing = windowWidth - elementCenterH - ttDiv.offsetWidth / 2; //check this
	var topSpacing = elementCenterV - ttDiv.offsetHeight / 2;
	var bottomSpacing = windowHeight - elementCenterV - ttDiv.offsetHeight / 2;

	var leftMargin = elementCoordinates.left - target.arrowSize() - ttDiv.offsetWidth;
	var rightMargin = windowWidth - ttDiv.offsetWidth - target.arrowSize() - elementCoordinates.left - elementCoordinates.width;
	var topMargin = elementCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
	var bottomMargin = windowHeight - ttDiv.offsetHeight - target.arrowSize() - elementCoordinates.top - elementCoordinates.height;

	var leftValue = Math.min(topSpacing, bottomSpacing, leftMargin);
	var rightValue = Math.min(topSpacing, bottomSpacing, rightMargin);
	var topValue = Math.min(leftSpacing, rightSpacing, topMargin);
	var bottomValue = Math.min(leftSpacing, rightSpacing, bottomMargin);

	switch (target.preferredOrientation()) {
		case 'left':
			{
				if (leftValue >= 0) return 'left';break;
			};
		case 'right':
			{
				if (rightValue >= 0) return 'right';break;
			};
		case 'top':
			{
				if (topValue >= 0) return 'top';break;
			};
		case 'bottom':
			{
				if (bottomValue >= 0) return 'bottom';break;
			};
	}

	if (leftValue < 0 && rightValue < 0 && topValue < 0 && bottomValue < 0) {
		leftValue += elementCoordinates.height;
		rightValue += elementCoordinates.height;
		topValue += elementCoordinates.width;
		bottomValue += elementCoordinates.width;
	}

	var maxValue = Math.max(leftValue, rightValue, topValue, bottomValue);
	switch (true) {
		case leftValue == maxValue:
			return 'left';
		case rightValue == maxValue:
			return 'right';
		case topValue == maxValue:
			return 'top';
		case bottomValue == maxValue:
			return 'bottom';
	}
}

function applyOptions(target) {

	//var boxShadowString;
	//var rgbCore;
	var transitionString;

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

	beforeRule.maxWidth = target.maxWidth() + 'px';
	beforeRule.maxHeight = target.maxHeight() + 'px';

	beforeRule.width = target.minWidth() + 'px';

	//ttDiv.innerHTML = target.content();
	ttContainer.innerHTML = target.content();

	if (target.autoSize()) {
		sizeTip(target);
	} else {
		beforeRule.width = target.width() + (targetWidth() !== 'auto') ? 'px' : '';
		beforeRule.height = target.height() + (targetHeight() !== 'auto') ? 'px' : '';
	}
	//	ttDiv.innerHTML = target.content();
}

//import {mouseX, mouseY, beforeRule, tips, tipsIndex, targetElement} from './globals.js';
var mouseX = void 0;
var mouseY = void 0;

var timer = void 0;

function getMouseCoordinates(event) {

	/*	if (typeof d3 !== 'undefined') {
 		mouseX = d3.event.clientX;
 		mouseY = d3.event.clientX;
 	} else {
 */mouseX = event.clientX;
	mouseY = event.clientY;
	//	};
}

function mouseOver(event) {
	var targetElement = this;
	var target;

	event = event || window.event;

	if (beforeRule.visibility !== 'hidden') {
		beforeRule.transition = '';
		clearTimeout(timer);
	}

	beforeRule.visibility = 'visible';

	getMouseCoordinates(event);

	target = tips[tipsIndex.indexOf(targetElement.id)];

	applyOptions(target);
	//	if (target.autoSize()) { sizeTip(target); };
	//	beforeRule.width = target.width() + 'px';
	if (target.autoPosition()) {
		// == true) {
		target.orientation(optimumOrientation(targetElement, target), true);
	}
	orient(targetElement, target);
	beforeRule.opacity = target.backgroundOpacity();
}

function mouseMove(event) {
	var targetElement = this;
	var target;

	target = tips[tipsIndex.indexOf(targetElement.id)];
	if (!target.trackMouse()) {
		return;
	} // == false) { return; };

	event = event || window.event;

	getMouseCoordinates(event);

	if (target.autoPosition()) {
		target.orientation(optimumOrientation(targetElement, target), true);
	}
	//		if (target.autoPosition() == true) { target.orientation(optimumOrientation(targetElement, target), true); };
	orient(targetElement, target);
}

function mouseOut(event) {
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
	transitionDuration = transitionString.split(' ')[1].replace('s', '');
	timer = window.setTimeout(function () {
		beforeRule.visibility = 'hidden';
	}, transitionDuration * 1000);
	beforeRule.opacity = 0;
}

//import {ttDiv} from './startAndFinish.js';
//import {targetTimer} from './utils.js';

var tips = [];
var tipsIndex = [];

function sizeTip(target) {

	beforeRule.width = 'auto';
	beforeRule.height = 'auto';

	var perimeter;
	var height;
	var width;
	var oldWidth = ttDiv.offsetWidth;
	var newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
	var oldDelta = Math.abs(newAspect - aspectRatio);
	var itterations = 0;
	var newDelta = oldDelta;

	console.log('aspect ratio: ', aspectRatio);
	while (newDelta > 0.1 && itterations < 10) {
		perimeter = ttDiv.offsetWidth + ttDiv.offsetHeight;
		height = 1 / ((aspectRatio + 1) / perimeter);
		width = perimeter - height;
		beforeRule.width = Math.round(width) + 'px';
		newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
		newDelta = Math.abs(newAspect - aspectRatio);
		if (Math.abs(newDelta - oldDelta) < 0.1) {
			if (oldDelta < newDelta) {
				beforeRule.width = Math.round(oldWidth) + 'px';
			}
			itterations = 10;
		} else {
			oldWidth = width;
			oldDelta = newDelta;
			itterations++;
		}
		console.log('Itteration #', itterations, ' aspect: ', ttDiv.offsetWidth / ttDiv.offsetHeight);
	}
}

/*

export function sizeTip (target) {
	var p, h, w;
	
	p = ttDiv.offsetWidth + ttDiv.offsetHeight;
	ttDiv.style.width = '';
	h = 1 / ((aspectRatio + 1) / p);
	w = p - h;
	target.width(Math.max(target.minWidth(), Math.round(w)), true);
};

*/
function tip(elementId, content) {
	var thisToolTip = this;
	var targetElement = void 0;
	var targetTimer = void 0;
	var className = void 0;

	var options = {
		content: '',
		orientation: '',
		preferredOrientation: 'right',
		autoPosition: true,
		autoSize: true,
		mousePoint: false,
		trackMouse: false,
		cursor: 'help',
		fontFamily: 'Tahoma',
		fontSize: '16',
		foregroundColor: 'beige',
		backgroundColor: 'midnightBlue',
		backgroundOpacity: 1,
		padding: '5px 10px',
		borderRadius: 12,
		boxShadow: '8px 8px 8px 0 rgba(0,0,0, 0.5)',
		transitionVisible: 'opacity 0.4s 0s',
		transitionHidden: 'opacity 0.4s 0s',
		arrowSize: 12,
		width: 'auto',
		maxWidth: 0,
		minWidth: 80,
		height: 'auto',
		maxHeight: 0
	};

	thisToolTip.content = function (content) {
		if (typeof content == 'undefined') {
			return options.content;
		}

		options.content = content;

		return thisToolTip;
	};

	thisToolTip.orientation = function (orientation, autoPosition) {
		if (typeof orientation == 'undefined') {
			return options.orientation;
		}
		autoPosition = typeof autoPosition == 'undefined' ? false : autoPosition;

		options.orientation = orientation;
		options.autoPosition = autoPosition;

		return thisToolTip;
	};

	thisToolTip.preferredOrientation = function (preferredOrientation) {
		if (typeof preferredOrientation == 'undefined') {
			return options.preferredOrientation;
		}

		options.preferredOrientation = preferredOrientation;

		return thisToolTip;
	};

	thisToolTip.autoPosition = function (autoPosition) {
		if (typeof autoPosition == 'undefined') {
			return options.autoPosition;
		}

		options.autoPosition = autoPosition;
		//if (autoPosition == false && options.position == '') options.position = 'right';
		if (autoPosition && options.position == '') options.position = 'right';

		return thisToolTip;
	};

	thisToolTip.autoSize = function (autoSize) {
		if (typeof autosize == 'undefined') {
			return options.autoSize;
		}

		options.autoSize = autoSize;

		return thisToolTip;
	};

	thisToolTip.mousePoint = function (mousePoint) {
		if (typeof mousePoint == 'undefined') {
			return options.mousePoint;
		}

		options.mousePoint = mousePoint;

		return thisToolTip;
	};

	thisToolTip.trackMouse = function (trackMouse) {
		if (typeof trackMouse == 'undefined') {
			return options.trackMouse;
		}

		options.trackMouse = trackMouse;
		options.mousePoint = trackMouse;

		return thisToolTip;
	};

	thisToolTip.cursor = function (cursor) {
		if (typeof cursor == 'undefined') {
			return options.cursor;
		}

		options.cursor = cursor;

		return thisToolTip;
	};

	thisToolTip.font = function (family, size) {
		if (arguments.length == 0) {
			return { family: options.fontFamily, size: options.fontSize };
		}
		if (arguments.length == 1) {
			size = '1em';
		}

		options.fontFamily = family;
		options.fontSize = parseSize(size);

		return thisToolTip;
	};

	thisToolTip.foregroundColor = function (foregroundColor) {
		if (typeof foregroundColor == 'undefined') {
			return options.foregroundColor;
		}

		options.foregroundColor = foregroundColor;

		return thisToolTip;
	};

	thisToolTip.backgroundColor = function (backgroundColor) {
		if (typeof backgroundColor == 'undefined') {
			return options.backgroundColor;
		}

		options.backgroundColor = backgroundColor;

		return thisToolTip;
	};

	thisToolTip.backgroundOpacity = function (backgroundOpacity) {
		if (typeof backgroundOpacity == 'undefined') {
			return options.backgroundOpacity;
		}

		options.backgroundOpacity = backgroundOpacity;

		return thisToolTip;
	};

	thisToolTip.padding = function (padding) {
		if (typeof padding == 'undefined') {
			return options.padding;
		}

		var size0;
		var size1;
		padding = padding.split(' ', 4);
		switch (padding.length) {
			case 0:
				{
					return options.padding;
					//break;
				};
			case 1:
				{
					size0 = parseSize(padding[0]);
					options.padding = size0 + 'px ' + size0 + 'px ' + size0 + 'px ' + size0 + 'px';
					break;
				};
			case 2:
				{
					size0 = parseSize(padding[0]);
					size1 = parseSize(padding[1]);
					options.padding = size0 + 'px ' + size1 + 'px ' + size0 + 'px ' + size1 + 'px';
					break;
				};
			case 3:
				{
					size0 = parseSize(padding[1]);
					options.padding = parseSize(padding[0]) + 'px ' + size0 + 'px ' + parseSize(padding[2]) + 'px ' + size0 + 'px';
					break;
				};
			case 4:
				{
					options.padding = parseSize(padding[0]) + 'px ' + parseSize(padding[1]) + 'px ' + parseSize(padding[2]) + 'px ' + parseSize(padding[3]) + 'px';
					break;
				};
		}

		return thisToolTip;
	};

	thisToolTip.borderRadius = function (borderRadius) {
		if (typeof borderRadius == 'undefined') {
			return options.borderRadius;
		}

		options.borderRadius = parseSize(borderRadius);

		return thisToolTip;
	};

	thisToolTip.boxShadow = function (size, color, opacity) {
		if (arguments.length == 0) {
			return options.boxShadow;
		}

		var parsedColor;
		var parsedSize;
		var boxShadowString;
		var rgbCore = void 0;

		if (arguments[0] == 'none') {
			options.boxShadow = '';
		} else {
			parsedSize = parseSize(size);
			parsedColor = parseColor(color);

			if (opacity !== 0) {
				rgbCore = parsedColor.match(/\d+/g);
				boxShadowString = 'rgba(' + parseInt(rgbCore[0]) + ',' + parseInt(rgbCore[1]) + ',' + parseInt(rgbCore[2]) + ',' + opacity + ')';
			} else {
				boxShadowString = parsedColor;
			}
			options.boxShadow = parsedSize + 'px ' + parsedSize + 'px ' + parsedSize + 'px 0 ' + boxShadowString;
		}

		return thisToolTip;
	};

	thisToolTip.transitionVisible = function (delay, duration) {
		if (arguments.length == 0) {
			return options.transitionVisible;
		}

		options.transitionVisible = 'opacity ' + duration + 's ease-in ' + delay + 's';

		return thisToolTip;
	};

	thisToolTip.transitionHidden = function (delay, duration) {
		if (arguments.length == 0) {
			return options.transitionHidden;
		}

		options.transitionHidden = 'opacity ' + duration + 's ease-out ' + delay + 's';

		return thisToolTip;
	};

	thisToolTip.arrowSize = function (arrowSize) {
		if (typeof arrowSize == 'undefined') {
			return options.arrowSize;
		}

		options.arrowSize = parseSize(arrowSize);

		return thisToolTip;
	};

	thisToolTip.width = function (width, autoSize) {
		if (typeof width == 'undefined') {
			return options.width;
		}
		autoSize = typeof autoSize == 'undefined' ? false : true;

		options.width = parseSize(width);
		options.autoSize = autoSize;

		return thisToolTip;
	};

	thisToolTip.minWidth = function (minWidth) {
		if (typeof minWidth == 'undefined') {
			return options.minWidth;
		}

		options.minWidth = parseSize(minWidth);

		return thisToolTip;
	};

	thisToolTip.height = function (height, autoSize) {
		if (typeof height == 'undefined') {
			return options.height;
		}
		autoSize = typeof autoSize == 'undefined' ? false : true;

		options.height = parseSize(height);
		options.autoSize = autoSize;

		return thisToolTip;
	};

	thisToolTip.maxWidth = function (maxWidth) {
		if (typeof maxWidth == 'undefined') {
			return options.maxWidth;
		}

		options.maxWidth = parseSize(maxWidth);

		return thisToolTip;
	};

	thisToolTip.maxHeight = function (maxHeight) {
		if (typeof maxHeight == 'undefined') {
			return options.maxHeight;
		}

		options.maxHeight = parseSize(maxHeight, 'height');

		return thisToolTip;
	};

	thisToolTip.remove = function () {

		window.clearInterval(targetTimer);

		className = targetElement.getAttribute('class') === null ? "" : targetElement.getAttribute('class');
		className = className.replace(' fxToolTipTarget', '');
		targetElement.setAttribute('class', className);

		if (targetElement.removeEventListener) {
			targetElement.removeEventListener('mouseover', mouseOver);
			targetElement.removeEventListener('mouseout', mouseOut);
			targetElement.removeEventListener('mousemove', mouseMove);
		} else {
			targetElement.onmousemove = null;
			targetElement.onmouseover = null;
			targetElement.onmouseout = null;
		}

		var tipIndex = tipsIndex.indexOf(elementId);

		tips.splice(tipIndex, 1);
		tipsIndex.splice(tipIndex, 1);
		if (tips.length == 0) {
			closeDown();
		} else {
			targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
		}
	};

	/* constructor */

	targetElement = document.getElementById(elementId);
	className = targetElement.getAttribute('class') === null ? "" : targetElement.getAttribute('class');
	targetElement.setAttribute('class', className + ' fxToolTipTarget');

	if (targetElement.addEventListener) {
		targetElement.addEventListener('mouseover', mouseOver, false);
		targetElement.addEventListener('mouseout', mouseOut, false);
		targetElement.addEventListener('mousemove', mouseMove, false);
	} else {
		targetElement.onmouseover = mouseOver;
		targetElement.onmouseout = mouseOut;
		targetElement.onmousemove = mouseMove;
	}

	thisToolTip.maxWidth('75%');
	thisToolTip.maxHeight('75%', 'height');

	options.content = content;

	return thisToolTip;
}

var windowWidth = void 0;
var windowHeight = void 0;
var aspectRatio = void 0;

function detectTargetRemoval() {
	tipsIndex.forEach(function (thisTip, i) {
		if (document.getElementById(thisTip) == null) {
			tips[i].remove();
		}
	});
}

function windowResized() {
	windowWidth = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
	windowHeight = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
	aspectRatio = windowWidth / windowHeight;
}

function getElementCoordinates(element) {
	var cursorBuffer = 0;
	var clientRect = {};
	var boundingClientRect = {};

	var target = tips[tipsIndex.indexOf(element.id)];

	if (target.mousePoint()) {
		// == true) {
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
	}
	var height = clientRect.bottom - clientRect.top;
	var width = clientRect.right - clientRect.left;

	return { top: clientRect.top, left: clientRect.left, height: height, width: width };
}

function hexToRgb(hex) {
	var rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
	return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
}

function parseColor(input) {
	var rgb;
	pseudoDiv.style.color = input;
	rgb = getComputedStyle(pseudoDiv, null).color;
	if (rgb.indexOf('#') !== -1) {
		rgb = hexToRgb(rgb);
	} else rgb = rgb.match(/\d+/g);
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

/*
export function parseSize (size) {
	if (typeof size == 'number') { return size; };
	pseudoDiv.style.width = size;
	return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('width'), 10);
};

*/
function parseSize(size, dimension) {
	if (typeof size == 'number') {
		return size;
	}
	dimension = dimension == undefined ? 'width' : dimension;
	if (dimension == 'width') {
		pseudoDiv.style.width = size;
		return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('width'), 10);
	} else {
		pseudoDiv.style.height = size;
		return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('height'), 10);
	}
}

function getRule(rule) {
	rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
		if (rules[i].selectorText.toLowerCase() == rule) return rules[i];
	}
}

function getRuleIndex(rule) {
	rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
		if (rules[i].selectorText.toLowerCase() == rule) return i;
	}
	return null;
}

var sheet = void 0;
var rules = void 0;
var ttDiv = void 0;
var ttContainer = void 0;
var beforeRule = void 0;
var afterRule = void 0;
var targetRule = void 0;
var set = false;
var pseudoDiv = void 0;
var targetTimerInterval = 500;
//export let targetTimer = null;

function setUp() {

	if (set) {
		return;
	}

	if (window.addEventListener) {
		window.addEventListener('resize', windowResized);
	} else if (window.attachEvent) {
		window.attachEvent('onresize', windowResized);
	} else {
		window.onresize = windowResized;
	}
	windowResized();

//	if (document.styleSheets.length == 0) {
		var head = document.getElementsByTagName("head")[0];
		sheet = document.createElement("style");
		sheet.type = "text/css";
		sheet.rel = 'stylesheet';
		sheet.media = 'screen';
		sheet.title = 'fxToolTip';
		sheet = head.appendChild(sheet).sheet;
//	}

	sheet = document.styleSheets[0];
	rules = sheet.cssRules ? sheet.cssRules : sheet.rules;

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
	}

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
}

function closeDown() {

	if (window.removeEventListener) {
		window.removeEventListener('resize', windowResized);
	} else if (window.detachEvent) {
		window.detachEvent('onresize', windowResized);
	} else {
		window.onresize = '';
	}

	if (sheet.deleteRule) {
		sheet.deleteRule(getRuleIndex('.fxToolTip'));
		sheet.deleteRule(getRuleIndex('.fxToolTip::after'));
		sheet.deleteRule(getRuleIndex('.fxToolTipTarget'));
	} else {
		sheet.removeRule(getRuleIndex('.fxToolTip'));
		sheet.removeRule(getRuleIndex('.fxToolTip::after'));
		sheet.removeRule(getRuleIndex('.fxToolTipTarget'));
	}

	ttDiv.parentNode.removeChild(ttDiv);
	pseudoDiv.parentNode.removeChild(pseudoDiv);

	sheet = undefined;
	rules = undefined;

	set = false;
}

/** 
* @file fxToolTip.js
* @version 1.0.13
* @author Michael R Fox
* @copyright (c) 2016 Michael R. Fox
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 
* Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
* distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
* following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  
* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function create(elementId, content) {
	if (document.getElementById(elementId) == null) {
		return;
	}
	if (!set) setUp();
	var index;
	index = tipsIndex.indexOf(elementId);
	if (index !== -1) {
		tips[index].remove();
	}
	var newTip = new tip(elementId, content);
	tips.push(newTip);
	tipsIndex.push(elementId);
	return tips[tips.length - 1];
}

function remove(elementId) {
	var index;

	index = tipsIndex.indexOf(elementId);
	if (index !== -1) tips[index].remove();
}

var index = { create: create, remove: remove };

return index;

}());