/** 
* @file foxToolTip.js
* @version 1.0.11
* @author Michael R Fox
* 
* @copyright (c) 2016 Michael R. Fox
* @license MIT
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* 
* @description foxToolTip.js is a small, simple library designed to show tooltips on hover over any DOM element.  It uses a combination of JavaScript and css styles to provide flexibility and ease of implementation.  It has no dependencies and should work on any modern browser (i.e., not Internet Explorer 8.0 and earlier).
*/
(function () {
	var tips = [];
	var tipsIndex = [];
	var windowWidth;
	var windowHeight;
	var aspectRatio;
	var sheet;
	var rules;
	var ttDiv;	
	var pseudoDiv;
	var beforeRule;
	var afterRule;
	var targetRule;
	var mouseX;
	var mouseY;
	var timer;
	var targetTimer;
	var targetTimerInterval = 500;
	var set = false;
		
	/** @function mouseOver
	 * @param event {window.event}
	 * @returns {null}
	 * @description The mouseOver function dispatches 'onmouseover' events from all registered target elements. This function identifies the target element using the 'this' keyword (note: we don't use the Microsoft unique attachEvent because the this keyword refers to the window object, not the targte element).  It then cancels any existing tooltip transition, sets the global mouse coodinates, sets the options for the target element, and shows the tooltip by setting the foxToolTip div's opacity.
	 */
	function mouseOver (event) {
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
		if (target.autoSize()) { sizeTip(target); };
		beforeRule.width = target.width() + 'px';
		if (target.autoPosition() == true) {
			target.orientation(optimumOrientation(targetElement, target), true);
		};
		orient(targetElement, target);
		beforeRule.opacity = target.backgroundOpacity();
	};

	function mouseMove (event) {
		var targetElement = this;
		var target;
		
		target = tips[tipsIndex.indexOf(targetElement.id)];
		if (target.trackMouse() == false) { return; };
		
		event = event || window.event;

		getMouseCoordinates(event);

		if (target.autoPosition() == true) { target.orientation(optimumOrientation(targetElement, target), true); };
		orient(targetElement, target);
	};

	function mouseOut (event) {
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
	
	function detectTargetRemoval() {
		tipsIndex.forEach(function (tip, i) {
			if (document.getElementById(tip) == null) {
				tips[i].remove();
			};
		});
	};
	
	function windowResized() {
		windowWidth = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
		windowHeight = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
		aspectRatio = windowWidth / windowHeight;
	};

	function getMouseCoordinates (event) {

		if (typeof d3 !== 'undefined') {
			mouseX = d3.event.clientX;
			mouseY = d3.event.clientX;
		} else {
			mouseX = event.clientX;
			mouseY = event.clientY;
		};
	};

	function getElementCoordinates (element) {
		var cursorBuffer = 15;
		var clientRect = {};

		var target = tips[tipsIndex.indexOf(element.id)];
		
		if (target.mousePoint() == true) {
			clientRect.left = mouseX - cursorBuffer;
			clientRect.top = mouseY - cursorBuffer;
			clientRect.right = mouseX + cursorBuffer;
			clientRect.bottom = mouseY + cursorBuffer;
		} else {
			clientRect = element.getBoundingClientRect();
		};
		var height = clientRect.bottom - clientRect.top;
		var width = clientRect.right - clientRect.left;

		return {top: clientRect.top, left: clientRect.left, height: height, width: width};
	};

	function getRule (rule) {
		rule = rule.toLowerCase();
		for (var i = 0; i < rules.length; i++) {
			if (rules[i].selectorText.toLowerCase() == rule) return (rules[i]);
		};
	};

	function getRuleIndex (rule) {
		rule = rule.toLowerCase();
		for (var i = 0; i < rules.length; i++) {
			if (rules[i].selectorText.toLowerCase() == rule) return (i);
		};
		return null;
	};

	function hexToRgb(hex) {
		var rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
		return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
	};
	
	function parseColor(input) {
	    var rgb;
	    pseudoDiv.style.color = input;
		rgb = getComputedStyle(pseudoDiv, null).color;
		if (rgb.indexOf('#') !== -1) { 
			rgb = hexToRgb(rgb);
		} else rgb = rgb.match(/\d+/g);
		return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	};

	function parseSize (size) {
		if (typeof size == 'number') { return size; };
	    pseudoDiv.style.width = size;
	    return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue('width'), 10);
	};
		
	function sizeTip (target) {
		var p, h, w;
		
		p = ttDiv.offsetWidth + ttDiv.offsetHeight;
		ttDiv.style.width = '';
		h = 1 / ((aspectRatio + 1) / p);
		w = p - h;
		target.width(Math.max(target.minWidth(), Math.round(w)), true);
	};

	function orient (targetElement, target) {
		
		var targetCoordinates = getElementCoordinates(targetElement);
		var top;
		var left;
		var verticalAdjust;
		var horizontalAdjust;
		var arrowAdjust;

		var adjustVertical = function (top) {
			var topAdjust = top;
			var arrowAdjust = ttDiv.offsetHeight / 2;

			if (top < 0) { 
				topAdjust = 0;
				arrowAdjust = Math.max((target.arrowSize()) + target.borderRadius(), top + (ttDiv.offsetHeight / 2));
			} else if (top + ttDiv.offsetHeight > windowHeight) {
				topAdjust = windowHeight - ttDiv.offsetHeight;
				arrowAdjust = Math.min(ttDiv.offsetHeight - target.borderRadius() - target.arrowSize(), (ttDiv.offsetHeight / 2) +  top - topAdjust);
			};

			return {topAdjust: Math.round(topAdjust), arrowAdjust: Math.round(arrowAdjust)};
		};

		var adjustHorizontal = function (left) {
			var leftAdjust = left;
			var arrowAdjust = ttDiv.offsetWidth / 2;

			if (left < 0) { 
				leftAdjust = 0;
				arrowAdjust = Math.max((target.arrowSize()) + target.borderRadius(), left + (ttDiv.offsetWidth / 2));
			} else if (left + ttDiv.offsetWidth > windowWidth) {
				leftAdjust = windowWidth - ttDiv.offsetWidth;
				arrowAdjust = Math.min(ttDiv.offsetWidth - target.borderRadius() - target.arrowSize(), (ttDiv.offsetWidth / 2) +  left - leftAdjust);
			};

			return {leftAdjust: Math.round(leftAdjust), arrowAdjust: Math.round(arrowAdjust)};
		};

		switch (target.orientation()) {
			case 'top': {
				top = targetCoordinates.top  - target.arrowSize() - ttDiv.offsetHeight;
				left = (targetCoordinates.width / 2) + targetCoordinates.left - (ttDiv.offsetWidth / 2);
				horizontalAdjust = adjustHorizontal(left);

				beforeRule.top = Math.round(top) + 'px';
				beforeRule.left = horizontalAdjust.leftAdjust + 'px';

				afterRule.top = '99.5%';	//	'100%';
				afterRule.left = horizontalAdjust.arrowAdjust + 'px';
				afterRule.bottom = '';
				afterRule.right = '';	
				afterRule.marginLeft = -target.arrowSize() + 'px';
				afterRule.marginTop = '';
				afterRule.borderColor = target.backgroundColor() + ' transparent transparent transparent';
				break;
			};
			case 'bottom': {
				top = targetCoordinates.top + targetCoordinates.height + target.arrowSize();
				left = (targetCoordinates.width / 2) + targetCoordinates.left - (ttDiv.offsetWidth / 2);
				horizontalAdjust = adjustHorizontal(left);
				
				beforeRule.top = Math.round(top) + 'px'; 
				beforeRule.left = horizontalAdjust.leftAdjust + 'px'; 

				afterRule.top = '';
				afterRule.left = horizontalAdjust.arrowAdjust + 'px';
				afterRule.bottom = '99.5%';	//'100%';
				afterRule.right = '';
				afterRule.marginLeft = -target.arrowSize() + 'px';
				afterRule.marginTop = '';
				afterRule.borderColor = 'transparent transparent ' + target.backgroundColor() + ' transparent';
				break;
			};
			case 'left': {
				top =  (targetCoordinates.height / 2) + targetCoordinates.top - (ttDiv.offsetHeight / 2);
				left =  targetCoordinates.left - ttDiv.offsetWidth - target.arrowSize();
				verticalAdjust = adjustVertical(top);
				
				beforeRule.top = verticalAdjust.topAdjust + 'px';
				beforeRule.left = Math.round(left) + 'px';

				afterRule.top = verticalAdjust.arrowAdjust + 'px';
				afterRule.left = '99.5%';	//'100%';
				afterRule.bottom = '';
				afterRule.right = '';
				afterRule.marginLeft = '';
				afterRule.marginTop = -target.arrowSize() + 'px';
				afterRule.borderColor = 'transparent transparent transparent ' + target.backgroundColor();
				break;
			};
			case 'right': {
				top = (targetCoordinates.height / 2) + targetCoordinates.top - (ttDiv.offsetHeight / 2);
				left = targetCoordinates.left + targetCoordinates.width + target.arrowSize();
				verticalAdjust = adjustVertical(top);
				
				beforeRule.top = verticalAdjust.topAdjust + 'px'; 
				beforeRule.left = Math.round(left) + 'px';

				afterRule.top = verticalAdjust.arrowAdjust + 'px';
				afterRule.left = '';
				afterRule.bottom = '';
				afterRule.right = '99.5%';	//'100%';
				afterRule.marginLeft = '';
				afterRule.marginTop = -target.arrowSize() + 'px';
				afterRule.borderColor = 'transparent ' + target.backgroundColor() + ' transparent transparent';
				break;
			};
		};
	};

	function optimumOrientation  (targetElement, target) {

		var elementCoordinates = getElementCoordinates(targetElement);
		var elementCenterH = elementCoordinates.left + (elementCoordinates.width / 2);
		var elementCenterV = elementCoordinates.top + (elementCoordinates.height / 2);
		
		var leftSpacing = elementCenterH - (ttDiv.offsetWidth / 2);
		var rightSpacing = windowWidth - elementCenterH - (ttDiv.offsetWidth / 2); //check this
		var topSpacing = elementCenterV - (ttDiv.offsetHeight / 2);
		var bottomSpacing = windowHeight - elementCenterV - (ttDiv.offsetHeight / 2);

		var leftMargin = elementCoordinates.left - target.arrowSize() - ttDiv.offsetWidth;
		var rightMargin = windowWidth - ttDiv.offsetWidth - target.arrowSize() - elementCoordinates.left - elementCoordinates.width;
		var topMargin = elementCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
		var bottomMargin = windowHeight - ttDiv.offsetHeight - target.arrowSize() - elementCoordinates.top - elementCoordinates.height ;

		var leftValue = Math.min(topSpacing, bottomSpacing, leftMargin);
		var rightValue = Math.min(topSpacing, bottomSpacing, rightMargin);
		var topValue = Math.min(leftSpacing, rightSpacing, topMargin);
		var bottomValue = Math.min(leftSpacing, rightSpacing, bottomMargin);

		switch (target.preferredOrientation()) {
			case 'left': { if (leftValue >= 0) return 'left'; break};
			case 'right': { if (rightValue >= 0) return 'right'; break};
			case 'top': { if (topValue >= 0) return 'top'; break};
			case 'bottom': { if (bottomValue >= 0) return 'bottom'; break};
		};

		if (leftValue < 0 && rightValue < 0  && topValue < 0 && bottomValue < 0) {
			leftValue += elementCoordinates.height;
			rightValue += elementCoordinates.height;
			topValue += elementCoordinates.width;
			bottomValue += elementCoordinates.width;
		};

		var maxValue = Math.max(leftValue, rightValue, topValue, bottomValue);
		switch (true) {
			case leftValue == maxValue: return 'left';
			case rightValue == maxValue: return 'right';
			case topValue == maxValue: return 'top';
			case bottomValue == maxValue: return 'bottom';
		};

	};

	function setUp() {
		if (set == true) { return; };
		
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
			sheet.title = 'foxToolTip';
			sheet = head.appendChild(sheet);
		};
		
		sheet = document.styleSheets[0];
		rules = sheet.cssRules ? sheet.cssRules: sheet.rules;
		
		if (sheet.insertRule) {
			sheet.insertRule('.foxToolTip {opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block;}', rules.length);
			sheet.insertRule('.foxToolTip::after{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
			sheet.insertRule('.foxToolTipTarget {cursor: help;}', rules.length);
		} else {
			sheet.addRule('.foxToolTip', '{opacity: 0;position: fixed;visibility: hidden;z-index: 1;pointer-events: none;display: inline-block;}', rules.length);
			sheet.addRule('.foxToolTip::after', '{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
			sheet.addRule('.foxToolTipTarget', '{cursor: help;}', rules.length);
		};
		beforeRule = getRule('.foxToolTip').style;
		afterRule = getRule('.foxToolTip::after').style;
		targetRule = getRule('.foxToolTipTarget').style;
		
		ttDiv = document.createElement('div');
		ttDiv.className = 'foxToolTip';
		document.body.insertBefore(ttDiv, document.body.firstChild);

		pseudoDiv = document.createElement('div');
		pseudoDiv.style.visible = 'hidden';
		pseudoDiv.style.position = 'absolute';
		pseudoDiv.style.display = 'inline-block';
		document.body.insertBefore(pseudoDiv, document.body.firstChild);
		
		targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
		
		set = true;
	};
	
	function closeDown() {
		
		if (window.removeEventListener) {
			window.removeEventListener('resize', windowResized);
		} else if (window.detachEvent) {
			window.detachEvent('onresize', windowResized);
		} else {
			window.onresize = '';
		};

		if (sheet.deleteRule) {
			sheet.deleteRule(getRuleIndex('.foxToolTip'));
			sheet.deleteRule(getRuleIndex('.foxToolTip::after'));
			sheet.deleteRule(getRuleIndex('.foxToolTipTarget'))
		} else {
			sheet.removeRule(getRuleIndex('.foxToolTip'));
			sheet.removeRule(getRuleIndex('.foxToolTip::after'));
			sheet.removeRule(getRuleIndex('.foxToolTipTarget'))
		};
		
		ttDiv.parentNode.removeChild(ttDiv);
		pseudoDiv.parentNode.removeChild(pseudoDiv);
		
		sheet = undefined;
		rules = undefined;
		
		set = false;
	};
	
	function applyOptions  (target) {
		
		var boxShadowString;
		var rgbCore;
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

		beforeRule.width = target.minWidth() + 'px';
		ttDiv.innerHTML = target.content();
	};

	tip = function (elementId, content) {
		var thisToolTip = this;
		var targetElement;
		
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
			minWidth: 80
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
			if (autoPosition == false && options.position == '') options.position = 'right';
			
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
					break;
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

		thisToolTip.remove = function () {

			window.clearInterval(targetTimer);
			
			if (typeof d3 !== 'undefined') {
				targetElement
					.classed('foxToolTipTarget', false)
					.on('mouseover', null)
					.on('mouseout', null)
					.on('mousemove', null);
			} else {
				targetElement.className = targetElement.className.replace(' foxToolTipTarget', '');

				if (targetElement.removeEventListener) {
					targetElement.removeEventListener('mouseover', mouseOver);
					targetElement.removeEventListener('mouseout', mouseOut);
					targetElement.removeEventListener('mousemove', mouseMove);
				} else {
					targetElement.onmousemove = null;
					targetElement.onmouseover = null;
					targetElement.onmouseout = null;
				};
			};
		
			var tipIndex = tipsIndex.indexOf(elementId);
			
			tips.splice(tipIndex, 1);
			tipsIndex.splice(tipIndex, 1);

			if (tips.length == 0) {
				closeDown(); 
			} else targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
		};
		
		/* constructor */
		if (typeof d3 !== 'undefined') {
			targetElement = d3.select('#' + elementId)
				.classed('foxToolTipTarget', true)
				.on('mouseover', mouseOver)
				.on('mouseout', mouseOut)
				.on('mousemove', mouseMove);
		} else {
			targetElement = document.getElementById(elementId);
			targetElement.className += ' foxToolTipTarget';

			if(targetElement.addEventListener) {
				targetElement.addEventListener('mouseover', mouseOver, false);
				targetElement.addEventListener('mouseout', mouseOut, false);
				targetElement.addEventListener('mousemove', mouseMove, false);
			} else {
				targetElement.onmouseover = mouseOver;
				targetElement.onmouseout = mouseOut;
				targetElement.onmousemove = mouseMove;
			};
		};
		if (typeof d3 !== 'undefined') {
			var parent = targetElement[0].parentNode;
			var config = {childList: true, subtree: true};
		} else {
			var parent = targetElement.parentNode;
			var config = {childList: true, subtree: false};
		};
		
		options.content = content;

		return (thisToolTip);
	};

	foxToolTip = {
		create: function (elementId, content) {
			if (document.getElementById(elementId) == null) { return; };
			if (!set) setUp();
			var index;
			index = tipsIndex.indexOf(elementId)
			if (index !== -1) {
				tips[index].remove();
			};
			var newTip = new tip(elementId, content);
			tips.push(newTip);
			tipsIndex.push(elementId);
			return tips[tips.length - 1];
		},

		remove: function (elementId) {
			var index;
			
			index = tipsIndex.indexOf(elementId);
			if (index !== -1) tips[index].remove();
		}
	};

	return (foxToolTip);
}) ();
