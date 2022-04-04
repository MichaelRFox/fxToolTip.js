
import {globalOptions, applyOptions} from './options.js';
import {beforeRule, closeDown} from './init.js';
import {checkBoolean, checkCSS, checkFontFamily, checkSize, parseColor} from './utils.js';
import {mouseOver, mouseOut, mouseMove} from './mouse.js';
import {tips, tipsIndex} from './tips.js';

/** the Tip class */
export class Tip {
    #options;
    #elementId;

    /**
     * Instantiates a new tooltip with all of the default options, and provides methods to customize each option.
     * @param {string} elementId The unique id of the DOM element that will be associated with the tooltip.
     * If there is no element in the DOM with this id, throws and error.
     * @param {string} content Any valid HTML which will be displayed in the tooltip.
     * @param {boolean} global If this is set to true, the changes to the returned tooltip will affect all subsequently
     * instantiated tooltips. This parameter is only used internally when the globalOptions object is created.
     * @returns {Tip} A [Tip]{@link Tip} class object which contains a private [globalOptions]{@link module:options~globalOptions}
     * object and exposes several methods to customize those options.
     */
    constructor (elementId, content, global) {
        global = global == undefined ? false : global;
        if (global) { // create global Tip class object without mouse listeners
            this.#options = globalOptions;
        } else {
            content = content == undefined ? '' : content;
            let targetElement = document.getElementById(elementId);
            if (targetElement == undefined) {
                throw new Error (`There is no element in the DOM with an id of: ${elementId}`);
            };
            this.#options = Object.assign({}, globalOptions);
            this.#elementId = elementId;
            let className = (targetElement.getAttribute('class') == null) ? '' : targetElement.getAttribute('class');
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
            this.content(content);            
        };
    }

    /**
     * Although the content of the tooltip is set with the [create]{@link module:fxTip~create} method, 
     * you may use the content method on an [Tip]{@link Tip} object to dynamically alter 
     * the content of the tooltip at runtime. The content argument can be any valid HTML (text, tables, images, svg, etc.).
     * @param {string} content Any valid HTML to displayed when the tooltip is visible. **Default**: ''.
     * @returns {(Tip | string)} If the content argument is passed, the *content* method returns the [Tip]{@link Tip} object.  
     * If the content method is called with no arguments, the content method returns the current content string.
     * @example <caption>fxTootip.content() method</caption>
     * let myTooltip = fxToolTip.create('myElement', 'Loreiem Ipsum');
     * .
     * .
     * .
     * myTooltip.content('Ut enim ad minim veniam');
     */
    content (content) {
        if (content == undefined) { return this.#options.content; };
        this.#options.content = content;
        if (beforeRule.opacity == this.#options.backgroundOpacity) { // inject new content while tip is shown
            applyOptions(this);
        };
        return this;
    }

    /**
     * You may set the location of the tooltip relative to the target element (or cursor if the [mousePoint]{@link Tip#mousePoint} 
     * method is called with true as the argument).  If the orientation is set, auto-positioning is disabled
     * (see the [autoPosition]{@link Tip#autoPosition} method).
     * @param {string} orientation One of ['right' | 'left' | 'top' | 'bottom']. **Default**: 'right'.
     * @returns {(Tip | string)} If the orientation argument is passed, the *orientation* method returns the [Tip]{@link Tip} object.
     * If the *orientation* method is called with no arguments, the *orientation* method returns the current orientation setting.
     * @example <caption>Tip.orientation() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .orientation('left');
     */
    orientation (orientation) {
        if (orientation == undefined) { return this.#options.orientation; };
        if (['left', 'right', 'top', 'bottom'].indexOf(orientation) == -1) {
            console.log("Option setting error. Orientation must be one of ['left' | 'right' | 'top' | 'bottom']");
        } else {
            this.#options.orientation = orientation;
            //this.#options.autoPosition = false; //autoPosition;            
        };
        return this;
    }

    /** 
     * The *preferredOrientation* method is designed to work with auto-positioning.
     * If there is sufficient space to display the tooltip at the preferred orientation,
     * then regardless of which position is optimum, the tooltip will be displayed at the preferred orientation.
     * If there is insufficient room to display the tooltip at the preferred orientation,
     * then auto-positioning takes over and displays the tooltip at the optimum position.
     * @param {string} preferredOrientation One of ['right' | 'left' | 'top' | 'bottom' | 'none']. **Default**: 'right'.
     * @returns {(Tip | boolean)} If the orientation argument is passed, the *preferredOrientation* method returns the [Tip]{@link Tip} object.
     * If the *preferredOrientation* method is called with no arguments, the *preferredOrientation* method returns the current preferredOrientation setting.
     * @example <caption>Tip.preferredOrientation() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .preferredOrientation('left');
     */
    preferredOrientation (preferredOrientation) {
        if (preferredOrientation == undefined) { return this.#options.preferredOrientation; };
        if (['left', 'right', 'top', 'bottom', 'none'].indexOf(preferredOrientation) == -1) {
            console.log("Option setting error. preferredOrientation must be one of ['left' | 'right' | 'top' | 'bottom' | 'none']");
        } else {
            this.#options.preferredOrientation = preferredOrientation;            
        };
        return this;
    }

    /**
     * If set to true, the *autoPosition* method enables auto-positioning of the tooltip.  
     * Auto-positioning evaluates the available screen space on all four sides of the target
     * element (or cursor if the [mousePoint]{@link Tip#mousePoint} method is called with true as the argument)
     * and the height and width of the tooltip and positions the tooltip at the orientation with the most room.
     * If the preferred orientation is not set to 'none', and that location has sufficient room to display the tooltip, 
     * then the preferred location is used.
     * @param {boolean} autoPosition One of [true | false], **Default**: true.
     * @returns {(Tip | boolean)} if the autoPosition argument is passed, the *autoPosition* method returns the
     * [Tip]{@link Tip} object. If the *autoPosition* method is called with no arguments,
     * the *autoPosition* method returns the current autoPosition setting.
     * @example <caption>Tip.autoPosition() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .autoPosition(false);
     */
    autoPosition (autoPosition) {
        if (autoPosition == undefined) { return this.#options.autoPosition; };
        if (checkBoolean(autoPosition, 'autoPosition')) {
            this.#options.autoPosition = autoPosition;
        };
        // if (autoPosition && options.position == '') options.position = 'right';
        return this;
    }
    
    /**
     * If set to true, the *autoSize* method enables auto-sizing of the tooltip.
     * Auto-sizing evaluates the content of the tooltip and attempts to scale the width and height
     * of the tooltip to conform to the aspect ratio of the document viewport.
     * Auto-sizing to the document viewport aspect ratio is intended to present an appealing appearance
     * and maximize the probability that the tooltip will be displayable on the screen.
     * If the content includes non-text elements like tables or images, it may be necessary to set the
     * minimum width of the tooltip using the [minWidth]{@link Tip#minWidth} method or the
     * minimum height using the [minHeight]{@link Tip#minHeight} method.
     * *Note*: auto-sizing does not actually set the tooltip height.  It sets the width, so that when
     * the tooltip div element auto-scales the height for overflow, the desired aspect ratio is achieved.
     * If autoSize is set to true, both the [width]{@link Tip#width} and
     * [height]{@link Tip#height} options are set to 'auto'.
     * @param {boolean} autoSize One of [true | false]. **Default**: true.
     * @returns {(Tip | boolean)} If the autoSize argument is passed, the *autoSize* method returns the
     * [Tip]{@link Tip} object.  If the *autoSize* method is called with no arguments,
     * the *autoSize* method returns the current autoSize setting.
     * @example <caption>Tip.autoSize() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .autoSize(false);
     */
    autoSize (autoSize) {
        if (autoSize == undefined) { return this.#options.autoSize; };
        if (checkBoolean(autoSize, 'autoSize')) {
            this.#options.autoSize = autoSize;
            if (autoSize == true) {
                this.#options.width = 'auto';
                this.#options.height = 'auto';
            };
        };
        return this;
    }

    /**
     * If set to true, the *mousePoint* method causes the tooltip to be displayed relative to the cursor position
     * instead of the target element.  If set to false the tooltip will be displayed relative to the target element.
     * In this case, the tooltip will attempt to center relative to one of the four sides of the target element
     * (depending on the auto-position setting).  If, due to document viewport limitations, the tooltip can't center itself,
     * it will adjust the tooltip left, right, up, or down as appropriate, but offset the tooltip pointer to keep
     * it centered on the element.
     * @param {boolean} mousePoint One of [true | false]. **Default**: false.
     * @returns {(Tip | boolean)} If the mousePoint argument is passed, the *mousePoint* method returns the
     * [Tip]{@link Tip} object. If the *mousePoint* method is called with no arguments,
     * the *mousePoint* method returns the current mousePoint setting.
     * @example <caption>Tip.mousePoint() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .mousePoint(true);
     */    
    mousePoint (mousePoint) {
        if (mousePoint == undefined) { return this.#options.mousePoint;  };
        if (checkBoolean(mousePoint, 'mousePoint')) {
            this.#options.mousePoint = mousePoint;
        };
        return this;
    }

    /**
     * If set to true, the *trackMouse* method causes the tooltip to follow the cursor as it moves over the target element.
     * If auto-positioning is set to true, the tooltip will continue to adjust it orientation to ensure that it can be displayed
     * within the document viewport.  The tooltip will also continuously offset the tooltip pointer, as required, to keep it
     * centered relative to the cursor. When true is passed to the *trackMouse* method, the [mousePoint]{@link Tip#mousePoint}
     * option to will automatically be set to true as well.
     * @param {boolean} mousePoint  One of [true | false]. **Default**: false.
     * @returns {(Tip | boolean)} If the trackMouse argument is passed, the *trackMouse* method returns the
     * [Tip]{@link Tip} object. If the *trackMouse* method is called with no arguments,
     * the *trackMouse* method returns the current trackMouse setting.
     * @example <caption>Tip.trackMouse() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .trackMouse(true);
     */ 
    trackMouse (trackMouse) {
        if (trackMouse == undefined) { return this.#options.trackMouse; };
        if (checkBoolean(trackMouse, 'trackMouse')) {
            this.#options.trackMouse = trackMouse;
            this.#options.mousePoint = trackMouse;            
        };
        return this;
    }

    /**
     * The *cursor* method allows programmatic control of the cursor appearance as the mouse hovers over the target element.
     * Note that not all defined cursor types are available in all browsers.
     * @param {string} cursor One of ['auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' |
     * 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' |
     * 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' |
     * 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing']. **Default**: 'help'.
     * @returns {(Tip | string)} If the cursor argument is passed, the *cursor* method returns the
     * [Tip]{@link Tip} object.  If the *cursor* method is called with no arguments, the *cursor*
     * method returns the current cursor setting.
     * @example <caption>Tip.cursor() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .cursor('pointer');
     */
    cursor (cursor) {
        if (cursor == undefined) { return this.#options.cursor; };
        if (['auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'e-resize', 'n-resize', 'ne-resize', 'nw-resize', 's-resize', 'se-resize', 'sw-resize', 'w-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'all-scroll', 'zoom-in', 'zoom-out', 'grab', 'grabbing'].indexOf(cursor) == -1) {
            console.log("Option setting error. cursor must be one of ['auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing']");
        } else {
            this.#options.cursor = cursor;
        };
        return this;
    }

    /**
     * Setting the font family and size via the *font* method, sets the font-family and font-size options contained within the
     *  which is injected into the *.fxToolTip* style's ruleset upon hover over the
     * target element. These options set defaults for text within the tooltip, but can be customized through inline or css selector styles,
     * contained in the content that is passed to the [create]{@link Tip#create} method.
     * @param {string} family Any valid CSS font-family (e.g., 'tahoma, sans-serif'). **Default**: 'verdana, sans-serif'.
     * @param {(number | string)} size Any valid CSS font-size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels. Default: 16.
     * @returns {(Tip | Object)} If the family and size arguments are passed, the *font* method returns the [Tip]{@link Tip} object}.
     * If the *font* method is called with no arguments, the *font* method returns the current
     * font setting as an object (e.g., {family:'tahoma, sans-serf', size:16}).
     * @example <caption>Tip.font() method</caption>
     * <style>
     *      H1 {
     *          .font-size: 1.25em;
     *          .font-weight: bold;
     *      }
     *      .myClass {
     *          .font-style: italic;
     *      }
     * </style>
     * <body>
     *      <script type = 'text/javascript' src='fxToolTip.js'></script>
     *      
     *      <p id='myElement'>This is the target element</p>
     *      
     *      <script>
     *          let content = '<H1>Lorem ipsum</H1><p>Ut enim ad minim veniam, <span class='myClass'>quis nostrud</span> exercitation</p>';
     *          let myTooltip = fxToolTip.create('myElement', content)
     *              .font('verdana, sans-serf', '12px')
     *      </script>
     * </body>
     */
    font (family, size) {
        if (arguments.length == 0) { return {family: this.#options.fontFamily, size: this.#options.fontSize}; };
        if (arguments.length == 1) { size = '1em'; };
        if (typeof size == 'number') { size += 'px'; };
        if (checkFontFamily(family) && checkSize(size)) {
            this.#options.fontFamily = family;
            this.#options.fontSize = size; //parseSize(size);            
        };
        return this;
    }

    /**
     * Setting the tooltip foregroundColor via the *foregroundColor* method, sets the foregroundColor option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover over the
     * target element. The forgroundColor option sets defaults for text color within the tooltip, but can be customized through
     * inline or CSS selector styles.
     * @param {string} foregroundColor Any valid CSS color such as hex, rgb, or a named CSS color. **Default**: 'white'.
     * @returns {(Tip | string)} if the color argument is passed, the *foregroundColor* method returns the
     * [Tip]{@link Tip} object. If the *foregroundColor* method is called with no arguments,
     * the *foregroundColor* method returns the current foregroundColor setting.
     * @example <caption>Tip.foregroundColor() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .foregroundColor('rgb(20, 40, 128)');
     */
    foregroundColor (foregroundColor) {
        if (foregroundColor == undefined) { return this.#options.foregroundColor; };
        if (checkCSS('color', foregroundColor)) {
            this.#options.foregroundColor = foregroundColor;
        };
        return this;
    }

    /**
     * Setting the tooltip backgroundColor via the *backgroundColor* method, sets the backgroundColor option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover over the
     * target element. The backgroundColor option sets the background color of the tooltip.
     * @param {string} backgroundColor Any valid CSS color such as hex, rgb, or a named CSS color. **Default**: '#333333'.
     * @returns {(Tip | string)} If the backgroundColor argument is passed, the *backgroundColor* method returns the
     * [Tip]{@link Tip} object.  If the *backgroundColor* method is called with no arguments,
     * the *backgroundColor* method returns the current backgroundColor setting.
     * @example <caption>Tip.backgroundColor() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      backgroundColor('rgb(20, 40, 128)');
     */
    backgroundColor  (backgroundColor) {
        if (backgroundColor == undefined) { return this.#options.backgroundColor; };
        if (checkCSS('background-color', backgroundColor)) {
            this.#options.backgroundColor = backgroundColor;
        };
        return this;
    }

    /**
     * Setting the tooltip backgroundOpacity via the *backgroundOpacity* method, sets the backgroundOpacity option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover over the target
     * element. The backgroundOpacity option sets the background opacity of the tooltip.
     * @param {number} backgroundOpacity A value [0...1]. **Default**: 1.
     * @returns {(Tip | number)} If the backgroundOpacity argument is passed, the *backgroundOpacity* method returns the
     * [Tip]{@link Tip} object.  If the *backgroundOpacity* method is called with no arguments,
     * the *backgroundOpacity* method returns the current backgroundOpacity setting.
     * @example <caption>Tip.backgroundOpacity() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      backgroundOpacity(0.5);
     */
    backgroundOpacity (backgroundOpacity) {
        if (backgroundOpacity == undefined) { return this.#options.backgroundOpacity; };
        if (checkCSS('opacity', backgroundOpacity)) {
            this.#options.backgroundOpacity = backgroundOpacity;
        };
        return this;
    }

    /** 
     * Setting the tooltip padding via the *padding* method, sets the padding option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover
     * over the target element. The padding option establishes the padding for the tooltip.  If the padding argument contains
     * only one measurement, uniform padding is applied to all sides of the tooltip.  If the padding argument contains two measurements,
     * the first measure is applied to the top and bottom, and the second to the left and right. If the padding argument contains
     * three measurements, the first is applied to the top, the second to the left and right, and the third to the bottom. 
     * If the padding argument contains four measurements, they are applied to the top, left, bottom, right respectively.
     * @param {string}  padding A string representing 1 to 4 valid CSS sizes (e.g., '1em' | '16px') **except for percentage**.
     * If no unit of measurement is given it is assumed to be in pixels. **Default**: '5px 10px'.
     * @returns {(Tip | string)} If the padding argument is passed, the *padding* method returns the [Tip]{@link Tip} object.
     * If the *padding* method is called with no arguments, the *padding* method returns the current padding setting formatted
     * as a single CSS shorthand string (e.g. '5px 10px').
     * @example <caption>Tip.padding() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .padding('2em 5px 1em 5px');
     */
    padding (padding) {
        if(padding == undefined) { return this.#options.padding; };
        
        // let size0;
        // let size1;
        let tmpPadding;
        padding = padding.split(' ', 4);

        padding.forEach (d => {
            if (typeof d == 'number') { d += 'px'; };
            if (!checkSize(d)) return this;
        });

        switch (padding.length) {
            case 0: {
                return this.#options.padding;
            };
            case 1: {
                // size0 = parseSize(padding[0]);
                // tmpPadding = size0 + 'px ' + size0 + 'px ' + size0 + 'px ' + size0 + 'px';
                tmpPadding = `${padding[0]} ${padding[0]} ${padding[0]} ${padding[0]}`;
                break;
            };
            case 2: {
                // size0 = parseSize(padding[0]);
                // size1 = parseSize(padding[1]);
                // tmpPadding = size0 + 'px ' + size1 + 'px ' + size0 + 'px ' + size1 + 'px';
                tmpPadding = `${padding[0]} ${padding[1]} ${padding[0]} ${padding[1]}`;
                break;
            };
            case 3: {
                // size0 = parseSize(padding[1]);
                // tmpPadding = parseSize(padding[0]) + 'px ' + size0 + 'px ' + parseSize(padding[2]) + 'px ' + size0 + 'px';
                tmpPadding = `${padding[0]} ${padding[1]} ${padding[2]} ${padding[1]}`;
                break;
            };
            case 4: {
                // tmpPadding = parseSize(padding[0]) + 'px ' + parseSize(padding[1]) + 'px ' + parseSize(padding[2]) + 'px ' + parseSize(padding[3]) + 'px';
                tmpPadding = `${padding[0]} ${padding[1]} ${padding[2]} ${padding[3]}`;
                break;
            };
        };
        if (checkCSS('padding', tmpPadding)) {
            this.#options.padding = tmpPadding;
        };
        return this;
    }

    /**
     * Setting the borderRadius via the *borderRadius* method, sets the borderRadius option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon
     * hover over the target element. The borderRadius option sets a uniform borderRadius for the tooltip corners.
     * @param {(number | string)} borderRadius Any valid CSS size (e.g., '1em' | '16px').
     * If a number is passed, it is assumed to be in pixels. **Default**: 12.
     * @returns {(Tip | string)} If the borderRadius argument is passed, the *borderRadius* method returns the
     * [Tip]{@link Tip} object. If the *borderRadius* method is called with no arguments,
     * the *borderRadius* method returns the current borderRadius setting.
     * @example <caption>Tip.borderRadius() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .borderRadius('1em');
     */
    borderRadius (borderRadius) {
        if (borderRadius == undefined) { return this.#options.borderRadius; };
        if (typeof borderRadius == 'number') { borderRadius += 'px'; };
        if (checkSize(borderRadius)) {
            this.#options.borderRadius = borderRadius; 
        }
        // this.#options.borderRadius = parseSize(borderRadius);
        return this;
    }

    /**
     * Setting the boxShadow size, color, and opacity via the *boxShadow* method, sets the boxShadow option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover over the
     * target element. The boxShadow option sets a box shadow offsets to the lower right of the tooltip.
     * @param {(number | string)} size Any valid CSS size (e.g., '1em' | '16px') **except percentage**, or 'none'.
     * If a number is passed, it is assumed to be in pixels.  If 'none' is passed as a single argument, no boxShadow is shown. **Default**: 8px'.
     * @param {string} color Any valid CSS color such as hex, rgb, or a named CSS color. **Default**: 'rgb(0,0,0)'.
     * @param {number} opacity A number [0...1]. **Default**:  0.5.
     * @returns {(Tip | string)} If arguments are passed, the *boxShadow* method returns the [Tip]{@link Tip} object.
     * If the *boxShadow* method is called with no arguments, the *boxShadow* method returns the current boxShadow setting as a CSS box-shadow
     * shorthand string (e.g. '8px 8px 8px 0 rgba(0,0,0,0.5)').
     * @example <caption>Tip.boxShadow() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .boxShadow('1em', '#0000FF', 0.5); 
     * @todo check input parameters 
     */
    boxShadow (size, color, opacity) {
        if (arguments.length == 0) { return this.#options.boxShadow };

        let parsedColor;
        let parsedSize;
        let boxShadowString;
        let rgbCore;

        if (arguments[0] == 'none') {
            this.#options.boxShadow = '';
        } else {
            if (typeof size == 'number') { size += 'px'; };
            if (checkSize(size) && checkCSS(color, 'color') && checkCSS(opacity, 'opacity')) {
                // parsedSize = parseSize(size);
                parsedColor = parseColor(color);

                if (opacity !== 0) { 
                    rgbCore = parsedColor.match(/\d+/g);
                    // boxShadowString = 'rgba(' + parseInt(rgbCore[0]) + ',' + parseInt(rgbCore[1]) + ',' + parseInt(rgbCore[2]) + ',' + opacity + ')';
                    boxShadowString = `rgba(${parseInt(rgbCore[0], 10)}, ${parseInt(rgbCore[1], 10)}, ${parseInt(rgbCore[2], 10)}, ${opacity})`;
                } else {
                    boxShadowString = parsedColor;
                };
                // this.#options.boxShadow = parsedSize + 'px ' + parsedSize + 'px ' + parsedSize + 'px 0 ' + boxShadowString;
                this.#options.boxShadow = `${size} ${size} ${size} 0 ${boxShadowString}`;
            }
        };
        return this;
    }

    /**
     * Setting the transitionVisible delay and duration via the *transitionVisible* method, sets the transitionVisible option contained
     * within the [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon hover over
     * the target element. The transitionVisible option sets the transition effect upon hover over the target element.
     * @param {number} delay Any valid number in seconds. **Default**: 0.4.
     * @param {number} duration Any valid number in seconds. **Default**: 0.
     * @returns {(Tip | string)} If arguments are passed, the *transitionVisible* method returns the [Tip]{@link Tip} object).
     * If the *transitionVisible* method is called with no arguments, the *transitionVisible* method returns the current transitionVisible 
     * setting as a CSS transition shorthand string (e.g. 'opacity 0.4s 0s').
     * @example <caption>Tip.transitionVisible() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .transitionVisible(0, 0.6);
     */
    transitionVisible(delay, duration) {
        if (arguments.length == 0) { return this.#options.transitionVisible; };
        if (typeof delay != 'number' && typeof duration != 'number') {
            console.log(`Option setting error. Either ${delay} and/or ${duration} are not a valid arguments`)
        } else {
            // this.#options.transitionVisible = 'opacity ' + duration + 's ease-in ' + delay + 's';
            this.#options.transitionVisible = `opacity ${duration}s ease-in ${delay}s`;
        };
        return this;
    }
    
    /**
     * Setting the transitionHidden delay and duration via the *transitionHidden* method, sets the transitionHidden option contained within the
     * [Tip]{@link Tip} object which is injected into the *.fxToolTip* style's ruleset upon target element mouseout.
     * The transitionHidden option sets the transition effect upon target element mouseout.
     * @param {number} delay Any valid number in seconds. **Default**: 0.4.
     * @param {number} duration Any valid number in seconds. **Default**: 0.
     * @returns {(Tip | string)} If arguments are passed, the *transitionHidden* method returns the [Tip]{@link Tip} object.
     * If the *transitionHidden* method is called with no arguments, the *transitionHidden* method returns the current transitionHidden setting
     * as a CSS transition shorthand string (e.g. 'opacity 0.4s 0s').
     * @example <caption>Tip.transitionHidden() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum';
     *      .transitionHidden(0, 0.2);
     */
    transitionHidden (delay, duration) {
        if (arguments.length == 0) { return this.#options.transitionHidden; };
        if (typeof delay != 'number' && typeof duration != 'number') {
            console.log(`Option setting error. Either ${delay} and/or ${duration} are not a valid arguments`)
        } else {
            // this.#options.transitionHidden = 'opacity ' + duration + 's ease-out ' + delay + 's';
            this.#options.transitionHidden = `opacity ${duration}s ease-out ${delay}s`;
        };
        return this;
    }
    
    /**
     * Setting the arrowSize via the *arrowSize* method, sets the arrowSize option contained within the [Tip]{@link Tip} object
     * which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. The arrowSize option sets the size of the tooltip's arrow.
     * @param {(number | string)} arrowSize Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels. **Default**: 12.
     * @returns {(Tip | string)} If the arrowSize argument is passed, the *arrowSize* method returns the [Tip]{@link Tip} object).
     * If the *arrowSize* method is called with no arguments, the *arrowSize* method returns the current arrowSize setting.
     * @example <caption>Tip.arrowSize() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .arrowSize('1.2em');
     */
    arrowSize (arrowSize) {
        if (arrowSize == undefined) { return this.#options.arrowSize; };
        if (typeof arrowSize == 'number') { arrowSize += 'px'; };
        if (checkSize(arrowSize)) {
            // this.#options.arrowSize = parseSize(arrowSize); 
            this.#options.arrowSize = arrowSize; 
        };
        return this;
    }

    /**
     * Setting the width via the *width* method, sets the width option contained within the  [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. When the width
     * option is set to any value other than auto, auto-sizing is disabled. However, if the [autoSize]{@link Tip#autoSize}
     * method is subsequently set to true, the width setting will be ignored. If the *width* is an absolute value
     * (e.g., '200px' | '30em'), it will remain constant if the screen size changes. In this case, it may be more appropriate
     * to use a realtive measure such as percentage
     * @param {(number | string)} width Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed
     * to be in pixels. **Default**: 'auto'.
     * @returns {(Tip | string)} If the width argument is passed, the *width* method returns the [Tip]{@link Tip}
     * object.  If the *width* method is called with no arguments, the *width* method returns the current width setting.
     * @example <caption>Tip.width() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .width('500px');
     */
    width (width) {
        if (width == undefined) { return this.#options.width; };
        if (typeof width == 'number') { width += 'px'; };
        if (width == 'auto' || checkSize(width)) {
            this.#options.width = width;
        };
        // this.#options.width = width == 'auto' ? 'auto' : parseSize(width);
        this.#options.autoSize = width == 'auto' ? this.#options.autoSize : false;
        return this;
    }
    
    /**
     * Setting the maximum width via the *maxWidth* method, sets the maxWidth option contained within the [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element.
     * The maxWidth option sets the maximum width of the tooltip upon hover over the target element.
     * The *maxWidth* method is useful to ensure that tooltips don't grow too large when using [auto-sizing]{@link Tip#autoSize}
     * or when their content is very large and may overflow smaller screens.
     * @param {(number | string)} maxWidth Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels.
     * **default**: 'none'.
     * @returns {(Tip | string)} If the maxWidth argument is passed, the *maxWidth* method returns the [Tip]{@link Tip}
     * object.  If the *maxWidth* method is called with no arguments, the *maxWidth* method returns the current maxWidth setting.
     * @example <caption>Tip.maxWidth() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .maxWidth('100px');
     */
    maxWidth(maxWidth) {
        if (maxWidth == undefined) { return this.#options.maxWidth; };
        if (typeof maxWidth == 'number') { maxWidth += 'px'; };
        if (maxWidth == 'none' || checkSize(maxWidth)) {
            this.#options.maxWidth = maxWidth;
        };
        // this.#options.maxWidth = maxWidth == 'none' ? 'none' : parseSize(maxWidth);
        return this;
    }

    /**
     * Setting the minimum width via the *minWidth* method, sets the minWidth option contained within the [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. The minWidth option sets the
     * minimum width of the tooltip upon hover over the target element.  The *minWidth* method is useful to ensure that non-text content
     * elements such as tables are correctly displayed in the tooltip when using [auto-sizing]{@link Tip#autoSize}.
     * @param {(number | string)} minWidth Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels.
     * **Default**: 0.
     * @returns {(Tip | string)} if the minWidth argument is passed, the *minWidth* method returns the [Tip]{@link Tip}
     * object. If the *minWidth* method is called with no arguments, the *minWidth* method returns the current minWidth setting.
     * @example <caption>Tip.minWidth() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .minWidth('100px');
     */
    minWidth (minWidth) {
        if (minWidth == undefined) { return this.#options.minWidth; };
        if (typeof minWidth == 'number') { minWidth += 'px'; };
        if (minWidth == 'auto' || checkSize(minWidth)) {
            this.#options.minWidth = minWidth;
        };
        // this.#options.minWidth = minWidth == 'none' ? 'none' : parseSize(minWidth);
        return this;
    }

    /**
     * Setting the height via the *height* method, sets the height option contained within the [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. When the height option
     * is set to any value other than auto, [auto-sizing]{@link Tip#autoSize} is disabled. However, if the
     * [autoSize]{@link Tip#autoSize} method is subsequently set to true, the height setting will be ignored.
     * @param {(number | string)} height Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels.
     * **Default**: 'auto'.
     * @returns {(Tip | string)} if the height argument is passed, the *height* method returns the [Tip]{@link Tip}
     * object.  If the *height* method is called with no arguments, the *height* method returns the current height setting.
     * @example <caption>Tip.height() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .height('500px');
     */
    height (height) {
        if (height == undefined) { return this.#options.height; };
        if (typeof height == 'number') { height += 'px'; };
        if (height == 'auto' || checkSize(height)) {
            this.#options.height = height;
        };
        // this.#options.height = height == 'auto' ? 'auto': parseSize(height, 'height');
        this.#options.autoSize = height == 'auto' ? options.autoSize : false;
        return this;
    }
    
    /**
     * Setting the maximum height via the *maxHeight* method, sets the maxHeight option contained within the [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. The *maxHeight* method is useful
     * to ensure that tooltips don't grow too large when using [auto-sizing]{@link Tip#autoSize} or when their content is very large
     * and may overflow smaller screens.
     * @param {(number | string)} maxHeight Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels.
     * **Default**: 'none'.
     * @returns {(Tip | string)} if the maxHeight argument is passed, the *maxHeight* method returns the [Tip]{@link Tip}
     * object.  If the *maxHeight* method is called with no arguments, the *maxHeight* method returns the current maxHeight setting.
     * @example <caption>Tip.maxHeight() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .maxHeight('500px');
     */
    maxHeight (maxHeight) {
        if (maxHeight == undefined) { return this.#options.maxHeight; };
        if (typeof maxHeight == 'number') { maxHeight += 'px'; };
        if (maxHeight == 'none' || checkSize(maxHeight)) {
            this.#options.maxHeight = maxHeight;
        };
        // this.#options.maxHeight = maxHeight == 'none' ? 'none' : parseSize(maxHeight, 'height');
        return this;
    }

    /**
     * Setting the minimum height via the *minHeight* method, sets the minHeight option contained within the [Tip]{@link Tip}
     * object which is injected into the *.fxToolTip* style's ruleset upon hover over the target element. The *minHeight* method is
     * useful to ensure that non-text content elements such as tables are correctly displayed in the tooltip when using
     * [auto-sizing]{@link Tip#autoSize}.
     * @param {(number | string)} minHeight Any valid CSS size (e.g., '1em' | '16px').  If a number is passed, it is assumed to be in pixels.
     * **Default**: 0.
     * @returns {(Tip | string)} If the minHeight argument is passed, the *minHeight* method returns the [Tip]{@link Tip}
     * object.  If the *minHeight* method is called with no arguments, the *minHeight* method returns the current minHeight setting.
     * @example <caption>Tip.minHeight() method</caption>
     * fxToolTip.create('myElement', 'Loreiem Ipsum')
     *      .minHeight('100px');
     */
    minHeight (minHeight) {
        if (minHeight == undefined) { return this.#options.minHeight; };
        if (typeof minHeight == 'number') { minHeight += 'px'; };
        if (minHeight == 'auto' || checkSize(minHeight)) {
            this.#options.minHeight = minHeight;
        };
        // this.#options.minHeight = minHeight == 'none' ? 'none' : parseSize(minHeight, 'height');
        return this;
    }

    /**
     * Similar to the [global remove]{@link module:fxTip~remove} method, the *remove* method of a [Tip]{@link Tip} object
     * removes all of the event listeners and the associated [Tip]{@link Tip} object object from the stack.
     * If this is the only [Tip]{@link Tip} object on the stack, the *remove* method will remove all of the *.fxTooltip*
     * CSS rules from the stylesheet and set the library back to its un-instantiated state.  Generally, this method is not required,
     * since fxToolTip automatically [detects]{@link module:utils~detectTargetRemoval} the removal of target elements,
     * and performs corresponding tooltip removal automatically.
     * @example <caption>Tip.remove() method</caption>
     * let myToolTip = fxToolTip.create('myElement', 'Loreiem Ipsum');
     * .
     * .
     * .
     * myToolTip.remove();
     */
    remove () {
        /** remove the fxTooltip class name */
        let targetElement = document.getElementById(this.#elementId);
        if (targetElement != undefined) {
            let className = (targetElement.getAttribute('class') == null) ? '' : targetElement.getAttribute('class');
            className = className.replace(' fxToolTipTarget', '');
            targetElement.setAttribute('class', className);

            /** remove the mouse listeners */
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

        let tipIndex = tipsIndex.indexOf(this.#elementId);
        
        if (tipIndex != -1) {
            tips.splice(tipIndex, 1);
            tipsIndex.splice(tipIndex, 1);
            if (tips.length == 0) {
                closeDown(); 
            };
        };
    };    

}