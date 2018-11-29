import {beforeRule, afterRule, targetRule, ttDiv, ttContainer} from './startAndFinish.js';
import {sizeTip} from './tip.js';
import {aspectRatio, parseSize, parseColor} from './utils.js';
import {getRule} from './style.js';

let globalOptions = {
    content: '',
    orientation: '',
    preferredOrientation: 'right',
    autoPosition: true,
    autoSize: true,
    mousePoint: false,
    trackMouse: false,
    cursor: 'help',
    fontFamily: 'verdana sans-serif',
    fontSize: '16',
    foregroundColor: 'white',
    backgroundColor: '#333333',
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

export let tipOptions = function(global) {

	global = global == undefined ? false : global;
    let that = this;
    let options;

    if (global) {
        options = globalOptions;
    } else {
        options = Object.assign({}, globalOptions);
    };

    that.content = function (content) {
        if (typeof content == 'undefined') { return options.content; };
        options.content = content;
        if (beforeRule.opacity == that.backgroundOpacity()) {
        	applyOptions(that);
        }
        return that;
    };

	that.orientation = function (orientation, autoPosition) {
		if (typeof orientation == 'undefined') { return options.orientation; };
		autoPosition = (typeof autoPosition == 'undefined') ? false: autoPosition;
		options.orientation = orientation;
		options.autoPosition = autoPosition;
		return that;
	};

	that.preferredOrientation = function (preferredOrientation) {
		if (typeof preferredOrientation == 'undefined') { return options.preferredOrientation; };
		options.preferredOrientation = preferredOrientation;
		return that;
	};

	that.autoPosition = function (autoPosition) {
		if (typeof autoPosition == 'undefined') { return options.autoPosition; };
		options.autoPosition = autoPosition;
		if (autoPosition && options.position == '') options.position = 'right';
		return that;
	};
	
	that.autoSize = function (autoSize) {
		if (typeof autosize == 'undefined') { return options.autoSize;	};
		options.autoSize = autoSize;
		return that;
	};
	
	that.mousePoint = function (mousePoint) {
		if (typeof mousePoint == 'undefined') { return options.mousePoint;	};
		options.mousePoint = mousePoint;
		return that;
	};

	that.trackMouse = function (trackMouse) {
		if (typeof trackMouse == 'undefined') { return options.trackMouse; };
		options.trackMouse = trackMouse;
		options.mousePoint = trackMouse;
		return that;
	};

	that.cursor = function (cursor) {
		if (typeof cursor == 'undefined') { return options.cursor; };
		options.cursor = cursor;
		return that;
	};

	that.font = function (family, size) {
		if (arguments.length == 0) { return {family: options.fontFamily, size: options.fontSize}; };
		if (arguments.length == 1) { size = '1em'; };
		options.fontFamily = family;
		options.fontSize = parseSize(size);
		return that;
	};

	that.foregroundColor = function (foregroundColor) {
		if (typeof foregroundColor == 'undefined') { return options.foregroundColor; };
		options.foregroundColor = foregroundColor;
		return that;
	};

	that.backgroundColor = function (backgroundColor) {
		if (typeof backgroundColor == 'undefined') { return options.backgroundColor; };
		options.backgroundColor = backgroundColor;
		return that;
	};

	that.backgroundOpacity = function (backgroundOpacity) {
		if (typeof backgroundOpacity == 'undefined') { return options.backgroundOpacity; };
		options.backgroundOpacity = backgroundOpacity;
		return that;
	};

	that.padding = function (padding) {
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
		
		return that;
	};

	that.borderRadius = function (borderRadius) {
		if (typeof borderRadius == 'undefined') { return options.borderRadius; };
		options.borderRadius = parseSize(borderRadius);
		return that;
	};

	that.boxShadow = function (size, color, opacity) {
		if (arguments.length == 0) { return options.boxShadow };
		
		let parsedColor;
		let parsedSize;
		let boxShadowString;
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
		return that;
	};

	that.transitionVisible = function (delay, duration) {
		if (arguments.length == 0) { return options.transitionVisible; };
		options.transitionVisible = 'opacity ' + duration + 's ease-in ' + delay + 's';
		return that;
	};
	
	that.transitionHidden = function (delay, duration) {
		if (arguments.length == 0) { return options.transitionHidden; };
		options.transitionHidden = 'opacity ' + duration + 's ease-out ' + delay + 's';
		return that;
	};
	
	that.arrowSize = function (arrowSize) {
		if (typeof arrowSize == 'undefined') { return options.arrowSize; };
		options.arrowSize = parseSize(arrowSize);
		return that;
	};

	that.width = function (width, autoSize) {
		if (typeof width == 'undefined') { return options.width; };
		autoSize = (typeof autoSize == 'undefined') ? false : true;
		options.width = parseSize(width);
		options.autoSize = autoSize;
		return that;
	};
	
	that.minWidth = function (minWidth) {
		if (typeof minWidth == 'undefined') { return options.minWidth; };
		options.minWidth = parseSize(minWidth);
		return that;
	};

	that.height = function (height, autoSize) {
		if (typeof height == 'undefined') { return options.height; };
		autoSize = (typeof autoSize == 'undefined') ? false : true;
		options.height = parseSize(height);
		options.autoSize = autoSize;
		return that;
	};
	

	that.maxWidth = function (maxWidth) {
		if (typeof maxWidth == 'undefined') { return options.maxWidth; };
		options.maxWidth = parseSize(maxWidth);
		return that;
	};
	
	that.maxHeight = function (maxHeight) {
		if (typeof maxHeight == 'undefined') { return options.maxHeight; };
		options.maxHeight = parseSize(maxHeight, 'height');
		return that;
	};
    return that;
};

export function applyOptions  (target) {
	
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

	ttContainer.innerHTML = target.content();
		
	if (target.autoSize()) {
		sizeTip(target);
	} else {
		beforeRule.width = target.width() + (targetWidth() !== 'auto') ? 'px' : '';
		beforeRule.height = target.height() + (targetHeight() !== 'auto') ? 'px' : '';
	};
};

    
