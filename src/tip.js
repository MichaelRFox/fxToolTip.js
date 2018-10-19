import {ttDiv, ttContainer, targetTimerInterval, closeDown, beforeRule} from './startAndFinish.js';
import {aspectRatio, parseSize, parseColor} from './utils.js';
import {mouseOver, mouseOut, mouseMove} from './mouse.js';
import {detectTargetRemoval} from './utils.js';
//import {ttDiv} from './startAndFinish.js';
//import {targetTimer} from './utils.js';

export let tips = [];
export let tipsIndex = [];

export function sizeTip (target) {

		beforeRule.width = 'auto';
		beforeRule.height = 'auto';

		var perimeter;
		var height;
		var width;
		var oldWidth = ttDiv.offsetWidth;
		var newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;;
		var oldDelta = Math.abs(newAspect - aspectRatio);
		var itterations = 0;
		var newDelta = oldDelta;
		
		//console.log('aspect ratio: ', aspectRatio);
		while (newDelta > 0.1 && itterations < 10) {
			perimeter = ttDiv.offsetWidth + ttDiv.offsetHeight;
			height = 1 / ((aspectRatio + 1) / perimeter);
			width = perimeter - height;
			beforeRule.width = Math.round(width) + 'px';
			newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
			newDelta = Math.abs(newAspect - aspectRatio);
			if (Math.abs(newDelta - oldDelta) < 0.1) {
				if (oldDelta < newDelta) { beforeRule.width = Math.round(oldWidth) + 'px' };
				itterations = 10;
			} else {
				oldWidth = width;
				oldDelta = newDelta;
				itterations++;
			}
			//console.log('Itteration #', itterations, ' aspect: ', ttDiv.offsetWidth / ttDiv.offsetHeight);
		};
	};

export function tip (elementId, content) {
	let thisToolTip = this;
	let targetElement;
	let targetTimer;
	let className;

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
		if (typeof content == 'undefined') { return options.content; };
		
		options.content = content;
		
		return thisToolTip;
	};
	
	thisToolTip.orientation = function (orientation, autoPosition) {
		if (typeof orientation == 'undefined') { return options.orientation; };
		autoPosition = (typeof autoPosition == 'undefined') ? false: autoPosition;
		
		options.orientation = orientation;
		options.autoPosition = autoPosition;

		return thisToolTip;
	};

	thisToolTip.preferredOrientation = function (preferredOrientation) {
		if (typeof preferredOrientation == 'undefined') { return options.preferredOrientation; };

		options.preferredOrientation = preferredOrientation;
		
		return thisToolTip;
	};

	thisToolTip.autoPosition = function (autoPosition) {
		if (typeof autoPosition == 'undefined') { return options.autoPosition; };
		
		options.autoPosition = autoPosition;
		//if (autoPosition == false && options.position == '') options.position = 'right';
		if (autoPosition && options.position == '') options.position = 'right';
		
		return thisToolTip;
	};
	
	thisToolTip.autoSize = function (autoSize) {
		if (typeof autosize == 'undefined') { return options.autoSize;	};

		options.autoSize = autoSize;

		return thisToolTip;
	};
	
	thisToolTip.mousePoint = function (mousePoint) {
		if (typeof mousePoint == 'undefined') { return options.mousePoint;	};

		options.mousePoint = mousePoint;
	
		return thisToolTip;
	};

	thisToolTip.trackMouse = function (trackMouse) {
		if (typeof trackMouse == 'undefined') { return options.trackMouse; };

		options.trackMouse = trackMouse;
		options.mousePoint = trackMouse;

		return thisToolTip;
	};

	thisToolTip.cursor = function (cursor) {
		if (typeof cursor == 'undefined') { return options.cursor; };

		options.cursor = cursor;

		return thisToolTip;
	};

	thisToolTip.font = function (family, size) {
		if (arguments.length == 0) { return {family: options.fontFamily, size: options.fontSize}; };
		if (arguments.length == 1) { size = '1em'; };

		options.fontFamily = family;
		options.fontSize = parseSize(size);

		return thisToolTip;
	};

	thisToolTip.foregroundColor = function (foregroundColor) {
		if (typeof foregroundColor == 'undefined') { return options.foregroundColor; };

		options.foregroundColor = foregroundColor;

		return thisToolTip;
	};

	thisToolTip.backgroundColor = function (backgroundColor) {
		if (typeof backgroundColor == 'undefined') { return options.backgroundColor; };
		
		options.backgroundColor = backgroundColor;

		return thisToolTip;
	};

	thisToolTip.backgroundOpacity = function (backgroundOpacity) {
		if (typeof backgroundOpacity == 'undefined') { return options.backgroundOpacity; };
		
		options.backgroundOpacity = backgroundOpacity;

		return thisToolTip;
	};

	thisToolTip.padding = function (padding) {
		if(typeof padding == 'undefined') { return options.padding; };
		
		var size0;
		var size1;
		padding = padding.split(' ', 4);
		switch (padding.length) {
			case 0: {
				return options.padding;
				//break;
			};
			case 1: {
				size0 = parseSize(padding[0]);
				options.padding = size0 + 'px ' + size0 + 'px ' + size0 + 'px ' + size0 + 'px';
				break;
			};
			case 2: {
				size0 = parseSize(padding[0]);
				size1 = parseSize(padding[1]);
				options.padding = size0 + 'px ' + size1 + 'px ' + size0 + 'px ' + size1 + 'px';
				break;
			};
			case 3: {
				size0 = parseSize(padding[1]);
				options.padding = parseSize(padding[0]) + 'px ' + size0 + 'px ' + parseSize(padding[2]) + 'px ' + size0 + 'px';
				break;
			};
			case 4: {
				options.padding = parseSize(padding[0]) + 'px ' + parseSize(padding[1]) + 'px ' + parseSize(padding[2]) + 'px ' + parseSize(padding[3]) + 'px';
				break;
			};
		};
		
		return thisToolTip;
	};

	thisToolTip.borderRadius = function (borderRadius) {
		if (typeof borderRadius == 'undefined') { return options.borderRadius; };

		options.borderRadius = parseSize(borderRadius);

		return thisToolTip;
	};

	thisToolTip.boxShadow = function (size, color, opacity) {
		if (arguments.length == 0) { return options.boxShadow };
		
		var parsedColor;
		var parsedSize;
		var boxShadowString;
		let rgbCore;

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
			};
			options.boxShadow = parsedSize + 'px ' + parsedSize + 'px ' + parsedSize + 'px 0 ' + boxShadowString;
		};

		return thisToolTip;
	};

	thisToolTip.transitionVisible = function (delay, duration) {
		if (arguments.length == 0) { return options.transitionVisible; };
	
		options.transitionVisible = 'opacity ' + duration + 's ease-in ' + delay + 's';
		
		return thisToolTip;
	};
	
	thisToolTip.transitionHidden = function (delay, duration) {
		if (arguments.length == 0) { return options.transitionHidden; };
	
		options.transitionHidden = 'opacity ' + duration + 's ease-out ' + delay + 's';
		
		return thisToolTip;
	};
	
	thisToolTip.arrowSize = function (arrowSize) {
		if (typeof arrowSize == 'undefined') { return options.arrowSize; };
		
		options.arrowSize = parseSize(arrowSize);

		return thisToolTip;
	};

	thisToolTip.width = function (width, autoSize) {
		if (typeof width == 'undefined') { return options.width; };
		autoSize = (typeof autoSize == 'undefined') ? false : true;
		
		options.width = parseSize(width);
		options.autoSize = autoSize;
		
		return thisToolTip;
	};
	
	thisToolTip.minWidth = function (minWidth) {
		if (typeof minWidth == 'undefined') { return options.minWidth; };
		
		options.minWidth = parseSize(minWidth);
		
		return thisToolTip;
	};

	thisToolTip.height = function (height, autoSize) {
		if (typeof height == 'undefined') { return options.height; };
		autoSize = (typeof autoSize == 'undefined') ? false : true;
		
		options.height = parseSize(height);
		options.autoSize = autoSize;
		
		return thisToolTip;
	};
	

	thisToolTip.maxWidth = function (maxWidth) {
		if (typeof maxWidth == 'undefined') { return options.maxWidth; };
		
		options.maxWidth = parseSize(maxWidth);
		
		return thisToolTip;
	};
	
	thisToolTip.maxHeight = function (maxHeight) {
		if (typeof maxHeight == 'undefined') { return options.maxHeight; };
		
		options.maxHeight = parseSize(maxHeight, 'height');
		
		return thisToolTip;
	};

	thisToolTip.remove = function () {

		window.clearInterval(targetTimer);
			
		className =  (targetElement.getAttribute('class') === null) ? "" : targetElement.getAttribute('class');
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
			};
	
		var tipIndex = tipsIndex.indexOf(elementId);
		
		tips.splice(tipIndex, 1);
		tipsIndex.splice(tipIndex, 1);
		if (tips.length == 0) {
			closeDown(); 
		} else {
			targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
		};
	};
	
	/* constructor */

		targetElement = document.getElementById(elementId);
		className = (targetElement.getAttribute('class') === null) ? "" : targetElement.getAttribute('class');
		targetElement.setAttribute('class', className + ' fxToolTipTarget')

		if(targetElement.addEventListener) {
			targetElement.addEventListener('mouseover', mouseOver, false);
			targetElement.addEventListener('mouseout', mouseOut, false);
			targetElement.addEventListener('mousemove', mouseMove, false);		
		} else {
			targetElement.onmouseover = mouseOver;
			targetElement.onmouseout = mouseOut;
			targetElement.onmousemove = mouseMove;
		};
		
		thisToolTip.maxWidth('75%');
		thisToolTip.maxHeight('75%', 'height');
	
		options.content = content;

	return (thisToolTip);
};
