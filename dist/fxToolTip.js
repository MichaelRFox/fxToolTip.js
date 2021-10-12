var fxToolTip = function() {
    "use strict";
    function position(targetElement, target, orientation) {
        var targetCoordinates = getElementCoordinates(targetElement);
        var divWidth = ttDiv.getBoundingClientRect()["width"];
        var divHeight = ttDiv.getBoundingClientRect()["height"];
        var halfDivHeight = divHeight / 2;
        var halfDivWidth = divWidth / 2;
        var borderRadius = parseSize(target.borderRadius(), "width", ttDiv);
        var arrowSize = parseSize(target.arrowSize(), "width", ttDiv);
        afterRule.borderWidth = arrowSize + "px";
        var top;
        var left;
        var verticalAdjust;
        var horizontalAdjust;
        var sizeAdjust;
        var adjustVertical = function adjustVertical(top) {
            var topAdjust = top;
            var arrowAdjust = halfDivHeight;
            if (top < 0) {
                topAdjust = 0;
                arrowAdjust = Math.max(arrowSize + borderRadius, top + halfDivHeight);
            } else if (top + divHeight > windowHeight) {
                topAdjust = windowHeight - divHeight;
                arrowAdjust = Math.min(divHeight - borderRadius - arrowSize, halfDivHeight + top - topAdjust);
            }
            return {
                topAdjust: Math.round(topAdjust),
                arrowAdjust: Math.round(arrowAdjust)
            };
        };
        var adjustHorizontal = function adjustHorizontal(left) {
            var leftAdjust = left;
            var arrowAdjust = halfDivWidth;
            if (left < 0) {
                leftAdjust = 0;
                arrowAdjust = Math.max(arrowSize + borderRadius, left + halfDivWidth);
            } else if (left + divWidth > windowWidth) {
                leftAdjust = windowWidth - divWidth;
                arrowAdjust = Math.min(divWidth - borderRadius - arrowSize, halfDivWidth + left - leftAdjust);
            }
            return {
                leftAdjust: Math.round(leftAdjust),
                arrowAdjust: Math.round(arrowAdjust)
            };
        };
        switch (orientation) {
          case "top":
            {
                top = targetCoordinates.top - arrowSize - divHeight;
                if (top < 0) {
                    beforeRule.height = Math.round(divHeight + top) + "px";
                    top = 0;
                }
                left = targetCoordinates.width / 2 + targetCoordinates.left - halfDivWidth;
                horizontalAdjust = adjustHorizontal(left);
                beforeRule.top = Math.round(top) + "px";
                beforeRule.left = horizontalAdjust.leftAdjust + "px";
                afterRule.top = "99.5%";
                afterRule.left = horizontalAdjust.arrowAdjust + "px";
                afterRule.bottom = "";
                afterRule.right = "";
                afterRule.marginLeft = -arrowSize + "px";
                afterRule.marginTop = "";
                afterRule.borderColor = target.backgroundColor() + " transparent transparent transparent";
                break;
            }

          case "bottom":
            {
                top = targetCoordinates.top + targetCoordinates.height + arrowSize;
                sizeAdjust = windowHeight - divHeight + top + arrowSize;
                beforeRule.height = sizeAdjust < 0 ? divHeight + sizeAdjust + "px" : beforeRule.height;
                left = targetCoordinates.width / 2 + targetCoordinates.left - halfDivWidth;
                horizontalAdjust = adjustHorizontal(left);
                beforeRule.top = Math.round(top) + "px";
                beforeRule.left = horizontalAdjust.leftAdjust + "px";
                afterRule.top = "";
                afterRule.left = horizontalAdjust.arrowAdjust + "px";
                afterRule.bottom = "99.5%";
                afterRule.right = "";
                afterRule.marginLeft = -arrowSize + "px";
                afterRule.marginTop = "";
                afterRule.borderColor = "transparent transparent " + target.backgroundColor() + " transparent";
                break;
            }

          case "left":
            {
                top = targetCoordinates.height / 2 + targetCoordinates.top - halfDivHeight;
                left = targetCoordinates.left - divWidth - arrowSize;
                if (left < 0) {
                    beforeRule.width = Math.round(divWidth + left) + "px";
                    left = 0;
                }
                verticalAdjust = adjustVertical(top);
                beforeRule.top = verticalAdjust.topAdjust + "px";
                beforeRule.left = Math.round(left) + "px";
                afterRule.top = verticalAdjust.arrowAdjust + "px";
                afterRule.left = "99.5%";
                afterRule.bottom = "";
                afterRule.right = "";
                afterRule.marginLeft = "";
                afterRule.marginTop = -arrowSize + "px";
                afterRule.borderColor = "transparent transparent transparent " + target.backgroundColor();
                break;
            }

          case "right":
            {
                top = targetCoordinates.height / 2 + targetCoordinates.top - halfDivHeight;
                left = targetCoordinates.left + targetCoordinates.width + arrowSize;
                sizeAdjust = windowWidth - divWidth + left + arrowSize;
                beforeRule.width = sizeAdjust < 0 ? divWidth + sizeAdjust + "px" : beforeRule.width;
                verticalAdjust = adjustVertical(top);
                beforeRule.top = verticalAdjust.topAdjust + "px";
                beforeRule.left = Math.round(left) + "px";
                afterRule.top = verticalAdjust.arrowAdjust + "px";
                afterRule.left = "";
                afterRule.bottom = "";
                afterRule.right = "99.5%";
                afterRule.marginLeft = "";
                afterRule.marginTop = -arrowSize + "px";
                afterRule.borderColor = "transparent " + target.backgroundColor() + " transparent transparent";
                break;
            }
        }
    }
    function optimumOrientation(targetElement, target) {
        var elementCoordinates = getElementCoordinates(targetElement);
        var arrowSize = parseSize(target.arrowSize(), "width", ttDiv);
        var midX = elementCoordinates.left + elementCoordinates.width / 2;
        var midY = elementCoordinates.top + elementCoordinates.height / 2;
        var divWidth = ttDiv.getBoundingClientRect()["width"];
        var divHeight = ttDiv.getBoundingClientRect()["height"];
        var halfDivHeight = divHeight / 2;
        var halfDivWidth = divWidth / 2;
        var leftOverlap = overlap("left", {
            x0: elementCoordinates.left - arrowSize - divWidth,
            x1: elementCoordinates.left - arrowSize,
            y0: midY - halfDivHeight,
            y1: midY + halfDivHeight
        });
        var rightOverlap = overlap("right", {
            x0: elementCoordinates.left + elementCoordinates.width + arrowSize,
            x1: elementCoordinates.left + elementCoordinates.width + arrowSize + divWidth,
            y0: midY - halfDivHeight,
            y1: midY + halfDivHeight
        });
        var topOverlap = overlap("top", {
            x0: midX - halfDivWidth,
            x1: midX + halfDivWidth,
            y0: elementCoordinates.top - arrowSize - divHeight,
            y1: elementCoordinates.top - arrowSize
        });
        var bottomOverlap = overlap("bottom", {
            x0: midX - halfDivWidth,
            x1: midX + halfDivWidth,
            y0: elementCoordinates.top + elementCoordinates.height + arrowSize,
            y1: elementCoordinates.top + elementCoordinates.height + arrowSize + divHeight
        });
        switch (target.preferredOrientation()) {
          case "left":
            {
                if (leftOverlap.overlap == 1) return "left";
                break;
            }

          case "right":
            {
                if (rightOverlap.overlap == 1) return "right";
                break;
            }

          case "top":
            {
                if (topOverlap.overlap == 1) return "top";
                break;
            }

          case "bottom":
            {
                if (bottomOverlap.overlap == 1) return "bottom";
                break;
            }
        }
        var overlaps = [ leftOverlap, rightOverlap, topOverlap, bottomOverlap ];
        if (leftOverlap.overlap < 1 && rightOverlap.overlap < 1 && topOverlap.overlap < 1 && bottomOverlap.overlap < 1) {
            return overlaps[overlaps.reduce((function(prev, current, index, array) {
                if (current.overlap > array[prev].overlap) {
                    return index;
                } else {
                    return prev;
                }
            }), 0)].side;
        }
        overlaps = overlaps.reduce((function(prev, current) {
            if (current.overlap == 1) {
                return prev.concat(current);
            } else {
                return prev;
            }
        }), []);
        if (overlaps.length == 1) {
            return overlaps[0].side;
        }
        return overlaps[overlaps.reduce((function(prev, current, index, array) {
            if (current.spacing[current.side] >= array[prev].spacing[prev.side]) {
                return index;
            } else {
                return prev;
            }
        }), 0)].side;
    }
    function getOrientation(targetElement, target) {
        if (target.orientation() != undefined) return target.orientation();
        if (target.autoPosition()) return optimumOrientation(targetElement, target);
        if (target.preferredOrientation() != "none") return target.preferredOrientation();
        return "right";
    }
    var globalOptions$1 = {
        content: "",
        orientation: undefined,
        preferredOrientation: "right",
        autoPosition: true,
        autoSize: true,
        mousePoint: false,
        trackMouse: false,
        cursor: "help",
        fontFamily: "verdana, sans-serif",
        fontSize: "1em",
        foregroundColor: "white",
        backgroundColor: "#333333",
        backgroundOpacity: 1,
        padding: "5px 10px",
        borderRadius: "12px",
        boxShadow: "8px 8px 8px 0 rgba(0,0,0, 0.5)",
        transitionVisible: "opacity 0.4s ease-in 0s",
        transitionHidden: "opacity 0.4s ease-out 0s",
        arrowSize: "12px",
        width: "auto",
        maxWidth: "none",
        minWidth: "auto",
        height: "auto",
        maxHeight: "none",
        minHeight: "auto"
    };
    function applyOptions(target) {
        var transitionString;
        beforeRule.fontFamily = target.font().family;
        beforeRule.fontSize = target.font().size;
        beforeRule.color = target.foregroundColor();
        beforeRule.backgroundColor = target.backgroundColor();
        beforeRule.padding = target.padding();
        beforeRule.borderRadius = target.borderRadius();
        targetRule.cursor = target.cursor();
        beforeRule.boxShadow = target.boxShadow();
        beforeRule["-moz-boxShadow"] = target.boxShadow();
        beforeRule["-webkit-boxShadow"] = target.boxShadow();
        transitionString = target.transitionVisible();
        beforeRule.transition = transitionString;
        beforeRule["-moz-transition"] = transitionString;
        beforeRule["-webkit-transiton"] = transitionString;
        beforeRule["-o-transition"] = transitionString;
        beforeRule.maxWidth = target.maxWidth();
        beforeRule.minWidth = target.minWidth();
        beforeRule.maxHeight = target.maxHeight();
        beforeRule.minHeight = target.minHeight();
        ttContainer.innerHTML = target.content();
        if (target.autoSize()) {
            sizeTip();
        } else {
            beforeRule.width = target.width();
            beforeRule.height = target.height();
        }
    }
    function resetOptions(target) {
        ttContainer.innerHTML = "";
        beforeRule.width = 0;
        beforeRule.height = 0;
        beforeRule.width = globalOptions$1.width;
        beforeRule.height = globalOptions$1.height;
        beforeRule.maxHeight = globalOptions$1.maxHeight;
        beforeRule.minHeight = globalOptions$1.minHeight;
        beforeRule.maxWidth = globalOptions$1.maxWidth;
        beforeRule.minWidth = globalOptions$1.minWidth;
    }
    var mouseX;
    var mouseY;
    var timer;
    var suspended = false;
    function getMouseCoordinates(event) {
        event = event || window.event;
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    function mouseOver(event) {
        event = event || window.event;
        if (suspend()) {
            return;
        }
        var targetElement = this;
        var target;
        if (beforeRule.visibility !== "hidden") {
            beforeRule.transition = "";
            clearTimeout(timer);
        }
        beforeRule.visibility = "visible";
        getMouseCoordinates(event);
        target = tips[tipsIndex.indexOf(targetElement.id)];
        applyOptions(target);
        var orientation = getOrientation(targetElement, target);
        position(targetElement, target, orientation);
        beforeRule.opacity = target.backgroundOpacity();
    }
    function mouseMove(event) {
        event = event || window.event;
        if (suspend()) {
            return;
        }
        var targetElement = this;
        var target;
        target = tips[tipsIndex.indexOf(targetElement.id)];
        if (!target.trackMouse()) {
            return;
        }
        getMouseCoordinates(event);
        var orientation = getOrientation(targetElement, target);
        position(targetElement, target, orientation);
    }
    function mouseOut(event) {
        var targetElement = this;
        if (window.getComputedStyle(targetElement, null).getPropertyValue("opacity") == 0 && suspend()) {
            return;
        }
        var target = tips[tipsIndex.indexOf(targetElement.id)];
        var transitionString = target.transitionHidden();
        var transitionDuration = +transitionString.split(" ")[1].replace("s", "");
        var transitionDelay = +transitionString.split(" ")[3].replace("s", "");
        beforeRule.transition = transitionString;
        beforeRule["-moz-transition"] = transitionString;
        beforeRule["-webkit-transiton"] = transitionString;
        beforeRule["-o-transition"] = transitionString;
        timer = window.setTimeout((function() {
            beforeRule.visibility = "hidden";
            resetOptions();
        }), (transitionDuration + transitionDelay) * 1e3);
        beforeRule.opacity = 0;
    }
    function suspend(suspendTips) {
        if (suspendTips == undefined) {
            return suspended;
        }
        if (checkBoolean(suspendTips, "suspend")) {
            suspended = suspendTips;
        }
    }
    var windowWidth;
    var windowHeight;
    var aspectRatio;
    function windowResized() {
        windowWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
        windowHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
        aspectRatio = windowWidth / windowHeight;
    }
    function getElementCoordinates(element) {
        var cursorBuffer = 0;
        var clientRect = {};
        var boundingClientRect = {};
        var target = tips[tipsIndex.indexOf(element.id)];
        if (target.mousePoint()) {
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
        return {
            top: clientRect.top,
            left: clientRect.left,
            height: height,
            width: width
        };
    }
    function overlap(side, coords) {
        var precision = 7;
        var divArea = (coords.x1 - coords.x0) * (coords.y1 - coords.y0);
        var xDist = Math.min(coords.x1, windowWidth) - Math.max(coords.x0, 0);
        var yDist = Math.min(coords.y1, windowHeight) - Math.max(coords.y0, 0);
        var overlapArea = xDist > 0 && yDist > 0 ? xDist * yDist : 0;
        var overlap = parseFloat((overlapArea / divArea).toFixed(precision));
        var spacing = {
            left: coords.x0,
            right: windowWidth - coords.x1,
            top: coords.y0,
            bottom: windowHeight - coords.y0
        };
        return {
            side: side,
            overlap: overlap,
            spacing: spacing
        };
    }
    function hexToRgb(hex) {
        var rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return [ parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16) ];
    }
    function createPseudoDiv(template) {
        var pseudoDiv = document.createElement("div");
        if (template != undefined) {
            var font = window.getComputedStyle(template, null).getPropertyValue("font");
            pseudoDiv.style.font = font;
            pseudoDiv.style.width = template.getBoundingClientRect()["width"] + "px";
            pseudoDiv.style.height = template.getBoundingClientRect()["height"] + "px";
        }
        pseudoDiv.style.visibility = "hidden";
        pseudoDiv.style.position = "absolute";
        pseudoDiv.style.display = "inline-block";
        pseudoDiv.id = "pseudoDiv";
        document.body.insertBefore(pseudoDiv, document.body.firstChild);
        return pseudoDiv;
    }
    function parseColor(input) {
        var pseudoDiv = createPseudoDiv();
        pseudoDiv.style.color = input;
        var rgb = getComputedStyle(pseudoDiv, null).color;
        if (rgb.indexOf("#") !== -1) {
            rgb = hexToRgb(rgb);
        } else rgb = rgb.match(/\d+/g);
        pseudoDiv.remove();
        return "rgb(".concat(rgb[0], ", ").concat(rgb[1], ", ").concat(rgb[2], ")");
    }
    function parseSize(size) {
        var dimension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "width";
        var template = arguments.length > 2 ? arguments[2] : undefined;
        if (typeof size == "number") {
            return size;
        }
        var result;
        var pseudoDiv = createPseudoDiv(template);
        if (size.indexOf("%") != -1) {
            var percent = parseInt(size, 10) / 100;
            result = pseudoDiv.getBoundingClientRect()[dimension] * percent;
        } else {
            pseudoDiv.style[dimension] = size;
            result = pseudoDiv.getBoundingClientRect()[dimension];
        }
        pseudoDiv.remove();
        return result;
    }
    function checkSize(size) {
        if (typeof size == "string") {
            var regex = /^(\d*\.)?\d+(?:(cm)|(mm)|(in)|(px)|(pt)|(pc)|(em)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(%))/;
            var match = size.match(regex);
            if (match != null && match[0].length == size.length) {
                return true;
            }
        }
        console.log("Option setting error. ".concat(size, " is an invalid CSS size"));
        return false;
    }
    function checkBoolean(argument, argumentName) {
        if ([ true, false ].indexOf(argument) == -1) {
            console.log("Option setting error. ".concat(argumentName, " must be one of [true | false]"));
            return false;
        } else {
            return true;
        }
    }
    function checkFontFamily(fontFamily) {
        if (document.fonts == undefined) return true;
        if (document.fonts.check("16px ".concat(fontFamily))) return true;
        console.log("Option setting error. ".concat(fontFamily, " is not a valid font family for this browser"));
        return false;
    }
    function checkCSS(rule, style) {
        if (style == "initial") {
            return true;
        }
        var result;
        var pseudoDiv = createPseudoDiv();
        pseudoDiv.style[rule] = "initial";
        pseudoDiv.style[rule] = style;
        if (pseudoDiv.style[rule] == "initial") {
            console.log("Option setting error. ".concat(style, " is not a valid style for ").concat(rule));
            result = false;
        } else {
            result = true;
        }
        pseudoDiv.remove();
        return result;
    }
    function _wrapRegExp() {
        _wrapRegExp = function(re, groups) {
            return new BabelRegExp(re, undefined, groups);
        };
        var _super = RegExp.prototype;
        var _groups = new WeakMap;
        function BabelRegExp(re, flags, groups) {
            var _this = new RegExp(re, flags);
            _groups.set(_this, groups || _groups.get(re));
            return _setPrototypeOf(_this, BabelRegExp.prototype);
        }
        _inherits(BabelRegExp, RegExp);
        BabelRegExp.prototype.exec = function(str) {
            var result = _super.exec.call(this, str);
            if (result) result.groups = buildGroups(result, this);
            return result;
        };
        BabelRegExp.prototype[Symbol.replace] = function(str, substitution) {
            if (typeof substitution === "string") {
                var groups = _groups.get(this);
                return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, (function(_, name) {
                    return "$" + groups[name];
                })));
            } else if (typeof substitution === "function") {
                var _this = this;
                return _super[Symbol.replace].call(this, str, (function() {
                    var args = arguments;
                    if (typeof args[args.length - 1] !== "object") {
                        args = [].slice.call(args);
                        args.push(buildGroups(args, _this));
                    }
                    return substitution.apply(this, args);
                }));
            } else {
                return _super[Symbol.replace].call(this, str, substitution);
            }
        };
        function buildGroups(result, re) {
            var g = _groups.get(re);
            return Object.keys(g).reduce((function(groups, name) {
                groups[name] = result[g[name]];
                return groups;
            }), Object.create(null));
        }
        return _wrapRegExp.apply(this, arguments);
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function _classPrivateFieldGet(receiver, privateMap) {
        var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
        return _classApplyDescriptorGet(receiver, descriptor);
    }
    function _classPrivateFieldSet(receiver, privateMap, value) {
        var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
        _classApplyDescriptorSet(receiver, descriptor, value);
        return value;
    }
    function _classExtractFieldDescriptor(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to " + action + " private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function _classApplyDescriptorGet(receiver, descriptor) {
        if (descriptor.get) {
            return descriptor.get.call(receiver);
        }
        return descriptor.value;
    }
    function _classApplyDescriptorSet(receiver, descriptor, value) {
        if (descriptor.set) {
            descriptor.set.call(receiver, value);
        } else {
            if (!descriptor.writable) {
                throw new TypeError("attempted to set read only private field");
            }
            descriptor.value = value;
        }
    }
    function _checkPrivateRedeclaration(obj, privateCollection) {
        if (privateCollection.has(obj)) {
            throw new TypeError("Cannot initialize the same private elements twice on an object");
        }
    }
    function _classPrivateFieldInitSpec(obj, privateMap, value) {
        _checkPrivateRedeclaration(obj, privateMap);
        privateMap.set(obj, value);
    }
    function getRule(rule) {
        rule = rule.toLowerCase();
        for (var i = 0; i < rules.length; i++) {
            var name = rules[i].cssText.match(_wrapRegExp(/((?:(?!\{)[\s\S])*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\{/i, {
                name: 1
            })).groups.name.trim();
            if (name.toLowerCase() == rule) return rules[i];
        }
        return undefined;
    }
    function getRuleIndex(rule) {
        rule = rule.toLowerCase();
        for (var i = 0; i < rules.length; i++) {
            var name = rules[i].cssText.match(_wrapRegExp(/((?:(?!\{)[\s\S])*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\{/i, {
                name: 1
            })).groups.name.trim();
            if (name.toLowerCase() == rule) return i;
        }
        return null;
    }
    var sheet;
    var rules;
    var ttDiv;
    var ttContainer;
    var beforeRule;
    var afterRule;
    var targetRule;
    var set = false;
    function setUp() {
        if (set) {
            return;
        }
        if (window.addEventListener) {
            window.addEventListener("resize", windowResized);
        } else if (window.attachEvent) {
            window.attachEvent("onresize", windowResized);
        } else {
            window.onresize = windowResized;
        }
        windowResized();
        if (document.styleSheets.length == 0) {
            var head = document.getElementsByTagName("head")[0];
            sheet = document.createElement("style");
            sheet.type = "text/css";
            sheet.rel = "stylesheet";
            sheet.media = "screen";
            sheet.title = "fxToolTip";
            sheet = head.appendChild(sheet).sheet;
        }
        sheet = document.styleSheets[0];
        rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
        var fxToolTipRule = ".fxToolTip {\n        opacity: 0;\n        -moz-opacity: 0;\n        -khtml-opacity: 0;\n        position: fixed;\n        visibility: hidden;\n        z-index: 100;\n        pointer-events: none;\n        display: inline-block;\n        box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        -webkit-box-sizing: border-box}";
        var fxContainerRule = ".fxContainer {\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        -ms-text-overflow: ellipsis;\n        -o-text-overflow: ellipsis}";
        var fxToolTipAfterRule = '.fxToolTip::after{\n        content: "";\n        position: absolute;\n        border-style: solid;\n        pointer-events: none;}';
        if (sheet.insertRule) {
            sheet.insertRule(fxToolTipRule, rules.length);
            sheet.insertRule(fxContainerRule, rules.length);
            sheet.insertRule(fxToolTipAfterRule, rules.length);
            sheet.insertRule(".fxToolTipTarget {cursor: help;}", rules.length);
        } else {
            sheet.addRule(fxToolTipRule, rules.length);
            sheet.addRule(fxContainerRule, rules.length);
            sheet.addRule(fxToolTipAfterRule, rules.length);
            sheet.addRule(".fxToolTipTarget", "{cursor: help;}", rules.length);
        }
        beforeRule = getRule(".fxToolTip").style;
        afterRule = getRule(".fxToolTip::after").style;
        targetRule = getRule(".fxToolTipTarget").style;
        ttDiv = document.createElement("div");
        ttDiv.className = "fxToolTip";
        document.body.insertBefore(ttDiv, document.body.firstChild);
        ttContainer = document.createElement("div");
        ttContainer.className = "fxContainer";
        ttDiv.appendChild(ttContainer);
        set = true;
    }
    function closeDown() {
        if (window.removeEventListener) {
            window.removeEventListener("resize", windowResized);
        } else if (window.detachEvent) {
            window.detachEvent("onresize", windowResized);
        } else {
            window.onresize = "";
        }
        if (sheet.deleteRule) {
            sheet.deleteRule(getRuleIndex(".fxToolTip"));
            sheet.deleteRule(getRuleIndex(".fxToolTip::after"));
            sheet.deleteRule(getRuleIndex(".fxToolTipTarget"));
        } else {
            sheet.removeRule(getRuleIndex(".fxToolTip"));
            sheet.removeRule(getRuleIndex(".fxToolTip::after"));
            sheet.removeRule(getRuleIndex(".fxToolTipTarget"));
        }
        ttDiv.parentNode.removeChild(ttDiv);
        pseudoDiv.parentNode.removeChild(pseudoDiv);
        sheet = undefined;
        rules = undefined;
        window.clearInterval(targetTimer);
        set = false;
    }
    var tips = [];
    var tipsIndex = [];
    function getTipByElementId(elementId) {
        var index = tipsIndex.indexOf(elementId);
        if (index !== -1) {
            return tips[index];
        } else {
            return undefined;
        }
    }
    function sizeTip() {
        function getAspect() {
            return ttDiv.getBoundingClientRect()["width"] / ttDiv.getBoundingClientRect()["height"];
        }
        function getPerimeter() {
            return ttDiv.getBoundingClientRect()["width"] + ttDiv.getBoundingClientRect()["height"];
        }
        beforeRule.width = "auto";
        beforeRule.height = "auto";
        var perimeter;
        var height;
        var width;
        var oldWidth = ttDiv.getBoundingClientRect()["width"];
        var newAspect = getAspect();
        var oldDelta = Math.abs(newAspect - aspectRatio);
        var itterations = 0;
        var newDelta = oldDelta;
        while (newDelta > .1 && itterations < 10) {
            perimeter = getPerimeter();
            height = 1 / ((aspectRatio + 1) / perimeter);
            width = perimeter - height;
            beforeRule.width = Math.round(width) + "px";
            newAspect = getAspect();
            newDelta = Math.abs(newAspect - aspectRatio);
            if (Math.abs(newDelta - oldDelta) < .1) {
                if (oldDelta < newDelta) {
                    beforeRule.width = Math.round(oldWidth) + "px";
                }
                itterations = 10;
            } else {
                oldWidth = width;
                oldDelta = newDelta;
                itterations++;
            }
        }
        beforeRule.width = ttDiv.getBoundingClientRect()["width"] + "px";
        beforeRule.height = ttDiv.getBoundingClientRect()["height"] + "px";
    }
    var _options = new WeakMap;
    var _elementId = new WeakMap;
    var Tip = function() {
        function Tip(elementId, content, global) {
            _classCallCheck(this, Tip);
            _classPrivateFieldInitSpec(this, _options, {
                writable: true,
                value: void 0
            });
            _classPrivateFieldInitSpec(this, _elementId, {
                writable: true,
                value: void 0
            });
            global = global == undefined ? false : global;
            if (global) {
                _classPrivateFieldSet(this, _options, globalOptions$1);
            } else {
                content = content == undefined ? "" : content;
                var targetElement = document.getElementById(elementId);
                if (targetElement == undefined) {
                    throw new Error("There is no element in the DOM with an id of: ".concat(elementId));
                }
                _classPrivateFieldSet(this, _options, Object.assign({}, globalOptions$1));
                _classPrivateFieldSet(this, _elementId, elementId);
                var className = targetElement.getAttribute("class") == null ? "" : targetElement.getAttribute("class");
                targetElement.setAttribute("class", className + " fxToolTipTarget");
                if (targetElement.addEventListener) {
                    targetElement.addEventListener("mouseover", mouseOver, false);
                    targetElement.addEventListener("mouseout", mouseOut, false);
                    targetElement.addEventListener("mousemove", mouseMove, false);
                } else {
                    targetElement.onmouseover = mouseOver;
                    targetElement.onmouseout = mouseOut;
                    targetElement.onmousemove = mouseMove;
                }
                this.content(content);
            }
        }
        _createClass(Tip, [ {
            key: "content",
            value: function content(_content) {
                if (_content == undefined) {
                    return _classPrivateFieldGet(this, _options).content;
                }
                _classPrivateFieldGet(this, _options).content = _content;
                if (beforeRule.opacity == _classPrivateFieldGet(this, _options).backgroundOpacity) {
                    applyOptions(this);
                }
                return this;
            }
        }, {
            key: "orientation",
            value: function orientation(_orientation) {
                if (_orientation == undefined) {
                    return _classPrivateFieldGet(this, _options).orientation;
                }
                if ([ "left", "right", "top", "bottom" ].indexOf(_orientation) == -1) {
                    console.log("Option setting error. Orientation must be one of ['left' | 'right' | 'top' | 'bottom']");
                } else {
                    _classPrivateFieldGet(this, _options).orientation = _orientation;
                }
                return this;
            }
        }, {
            key: "preferredOrientation",
            value: function preferredOrientation(_preferredOrientation) {
                if (_preferredOrientation == undefined) {
                    return _classPrivateFieldGet(this, _options).preferredOrientation;
                }
                if ([ "left", "right", "top", "bottom", "none" ].indexOf(_preferredOrientation) == -1) {
                    console.log("Option setting error. preferredOrientation must be one of ['left' | 'right' | 'top' | 'bottom' | 'none']");
                } else {
                    _classPrivateFieldGet(this, _options).preferredOrientation = _preferredOrientation;
                }
                return this;
            }
        }, {
            key: "autoPosition",
            value: function autoPosition(_autoPosition) {
                if (_autoPosition == undefined) {
                    return _classPrivateFieldGet(this, _options).autoPosition;
                }
                if (checkBoolean(_autoPosition, "autoPosition")) {
                    _classPrivateFieldGet(this, _options).autoPosition = _autoPosition;
                }
                return this;
            }
        }, {
            key: "autoSize",
            value: function autoSize(_autoSize) {
                if (_autoSize == undefined) {
                    return _classPrivateFieldGet(this, _options).autoSize;
                }
                if (checkBoolean(_autoSize, "autoSize")) {
                    _classPrivateFieldGet(this, _options).autoSize = _autoSize;
                    if (_autoSize == true) {
                        _classPrivateFieldGet(this, _options).width = "auto";
                        _classPrivateFieldGet(this, _options).height = "auto";
                    }
                }
                return this;
            }
        }, {
            key: "mousePoint",
            value: function mousePoint(_mousePoint) {
                if (_mousePoint == undefined) {
                    return _classPrivateFieldGet(this, _options).mousePoint;
                }
                if (checkBoolean(_mousePoint, "mousePoint")) {
                    _classPrivateFieldGet(this, _options).mousePoint = _mousePoint;
                }
                return this;
            }
        }, {
            key: "trackMouse",
            value: function trackMouse(_trackMouse) {
                if (_trackMouse == undefined) {
                    return _classPrivateFieldGet(this, _options).trackMouse;
                }
                if (checkBoolean(_trackMouse, "trackMouse")) {
                    _classPrivateFieldGet(this, _options).trackMouse = _trackMouse;
                    _classPrivateFieldGet(this, _options).mousePoint = _trackMouse;
                }
                return this;
            }
        }, {
            key: "cursor",
            value: function cursor(_cursor) {
                if (_cursor == undefined) {
                    return _classPrivateFieldGet(this, _options).cursor;
                }
                if ([ "auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "e-resize", "n-resize", "ne-resize", "nw-resize", "s-resize", "se-resize", "sw-resize", "w-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "col-resize", "row-resize", "all-scroll", "zoom-in", "zoom-out", "grab", "grabbing" ].indexOf(_cursor) == -1) {
                    console.log("Option setting error. cursor must be one of ['auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing']");
                } else {
                    _classPrivateFieldGet(this, _options).cursor = _cursor;
                }
                return this;
            }
        }, {
            key: "font",
            value: function font(family, size) {
                if (arguments.length == 0) {
                    return {
                        family: _classPrivateFieldGet(this, _options).fontFamily,
                        size: _classPrivateFieldGet(this, _options).fontSize
                    };
                }
                if (arguments.length == 1) {
                    size = "1em";
                }
                if (typeof size == "number") {
                    size += "px";
                }
                if (checkFontFamily(family) && checkSize(size)) {
                    _classPrivateFieldGet(this, _options).fontFamily = family;
                    _classPrivateFieldGet(this, _options).fontSize = size;
                }
                return this;
            }
        }, {
            key: "foregroundColor",
            value: function foregroundColor(_foregroundColor) {
                if (_foregroundColor == undefined) {
                    return _classPrivateFieldGet(this, _options).foregroundColor;
                }
                if (checkCSS("color", _foregroundColor)) {
                    _classPrivateFieldGet(this, _options).foregroundColor = _foregroundColor;
                }
                return this;
            }
        }, {
            key: "backgroundColor",
            value: function backgroundColor(_backgroundColor) {
                if (_backgroundColor == undefined) {
                    return _classPrivateFieldGet(this, _options).backgroundColor;
                }
                if (checkCSS("background-color", _backgroundColor)) {
                    _classPrivateFieldGet(this, _options).backgroundColor = _backgroundColor;
                }
                return this;
            }
        }, {
            key: "backgroundOpacity",
            value: function backgroundOpacity(_backgroundOpacity) {
                if (_backgroundOpacity == undefined) {
                    return _classPrivateFieldGet(this, _options).backgroundOpacity;
                }
                if (checkCSS("opacity", _backgroundOpacity)) {
                    _classPrivateFieldGet(this, _options).backgroundOpacity = _backgroundOpacity;
                }
                return this;
            }
        }, {
            key: "padding",
            value: function padding(_padding) {
                var _this = this;
                if (_padding == undefined) {
                    return _classPrivateFieldGet(this, _options).padding;
                }
                var tmpPadding;
                _padding = _padding.split(" ", 4);
                _padding.forEach((function(d) {
                    if (typeof d == "number") {
                        d += "px";
                    }
                    if (!checkSize(d)) return _this;
                }));
                switch (_padding.length) {
                  case 0:
                    {
                        return _classPrivateFieldGet(this, _options).padding;
                    }

                  case 1:
                    {
                        tmpPadding = "".concat(_padding[0], " ").concat(_padding[0], " ").concat(_padding[0], " ").concat(_padding[0]);
                        break;
                    }

                  case 2:
                    {
                        tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[0], " ").concat(_padding[1]);
                        break;
                    }

                  case 3:
                    {
                        tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[2], " ").concat(_padding[1]);
                        break;
                    }

                  case 4:
                    {
                        tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[2], " ").concat(_padding[3]);
                        break;
                    }
                }
                if (checkCSS("padding", tmpPadding)) {
                    _classPrivateFieldGet(this, _options).padding = tmpPadding;
                }
                return this;
            }
        }, {
            key: "borderRadius",
            value: function borderRadius(_borderRadius) {
                if (_borderRadius == undefined) {
                    return _classPrivateFieldGet(this, _options).borderRadius;
                }
                if (typeof _borderRadius == "number") {
                    _borderRadius += "px";
                }
                if (checkSize(_borderRadius)) {
                    _classPrivateFieldGet(this, _options).borderRadius = _borderRadius;
                }
                return this;
            }
        }, {
            key: "boxShadow",
            value: function boxShadow(size, color, opacity) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).boxShadow;
                }
                var parsedColor;
                var boxShadowString;
                var rgbCore;
                if (arguments[0] == "none") {
                    _classPrivateFieldGet(this, _options).boxShadow = "";
                } else {
                    if (typeof size == "number") {
                        size += "px";
                    }
                    if (checkSize(size) && checkCSS(color, "color") && checkCSS(opacity, "opacity")) {
                        parsedColor = parseColor(color);
                        if (opacity !== 0) {
                            rgbCore = parsedColor.match(/\d+/g);
                            boxShadowString = "rgba(".concat(parseInt(rgbCore[0], 10), ", ").concat(parseInt(rgbCore[1], 10), ", ").concat(parseInt(rgbCore[2], 10), ", ").concat(opacity, ")");
                        } else {
                            boxShadowString = parsedColor;
                        }
                        _classPrivateFieldGet(this, _options).boxShadow = "".concat(size, " ").concat(size, " ").concat(size, " 0 ").concat(boxShadowString);
                    }
                }
                return this;
            }
        }, {
            key: "transitionVisible",
            value: function transitionVisible(delay, duration) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).transitionVisible;
                }
                if (typeof delay != "number" && typeof duration != "number") {
                    console.log("Option setting error. Either ".concat(delay, " and/or ").concat(duration, " are not a valid arguments"));
                } else {
                    _classPrivateFieldGet(this, _options).transitionVisible = "opacity ".concat(duration, "s ease-in ").concat(delay, "s");
                }
                return this;
            }
        }, {
            key: "transitionHidden",
            value: function transitionHidden(delay, duration) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).transitionHidden;
                }
                if (typeof delay != "number" && typeof duration != "number") {
                    console.log("Option setting error. Either ".concat(delay, " and/or ").concat(duration, " are not a valid arguments"));
                } else {
                    _classPrivateFieldGet(this, _options).transitionHidden = "opacity ".concat(duration, "s ease-out ").concat(delay, "s");
                }
                return this;
            }
        }, {
            key: "arrowSize",
            value: function arrowSize(_arrowSize) {
                if (_arrowSize == undefined) {
                    return _classPrivateFieldGet(this, _options).arrowSize;
                }
                if (typeof _arrowSize == "number") {
                    _arrowSize += "px";
                }
                if (checkSize(_arrowSize)) {
                    _classPrivateFieldGet(this, _options).arrowSize = _arrowSize;
                }
                return this;
            }
        }, {
            key: "width",
            value: function width(_width) {
                if (_width == undefined) {
                    return _classPrivateFieldGet(this, _options).width;
                }
                if (typeof _width == "number") {
                    _width += "px";
                }
                if (_width == "auto" || checkSize(_width)) {
                    _classPrivateFieldGet(this, _options).width = _width;
                }
                _classPrivateFieldGet(this, _options).autoSize = _width == "auto" ? _classPrivateFieldGet(this, _options).autoSize : false;
                return this;
            }
        }, {
            key: "maxWidth",
            value: function maxWidth(_maxWidth) {
                if (_maxWidth == undefined) {
                    return _classPrivateFieldGet(this, _options).maxWidth;
                }
                if (typeof _maxWidth == "number") {
                    _maxWidth += "px";
                }
                if (_maxWidth == "none" || checkSize(_maxWidth)) {
                    _classPrivateFieldGet(this, _options).maxWidth = _maxWidth;
                }
                return this;
            }
        }, {
            key: "minWidth",
            value: function minWidth(_minWidth) {
                if (_minWidth == undefined) {
                    return _classPrivateFieldGet(this, _options).minWidth;
                }
                if (typeof _minWidth == "number") {
                    _minWidth += "px";
                }
                if (_minWidth == "auto" || checkSize(_minWidth)) {
                    _classPrivateFieldGet(this, _options).minWidth = _minWidth;
                }
                return this;
            }
        }, {
            key: "height",
            value: function height(_height) {
                if (_height == undefined) {
                    return _classPrivateFieldGet(this, _options).height;
                }
                if (typeof _height == "number") {
                    _height += "px";
                }
                if (_height == "auto" || checkSize(_height)) {
                    _classPrivateFieldGet(this, _options).height = _height;
                }
                _classPrivateFieldGet(this, _options).autoSize = _height == "auto" ? options.autoSize : false;
                return this;
            }
        }, {
            key: "maxHeight",
            value: function maxHeight(_maxHeight) {
                if (_maxHeight == undefined) {
                    return _classPrivateFieldGet(this, _options).maxHeight;
                }
                if (typeof _maxHeight == "number") {
                    _maxHeight += "px";
                }
                if (_maxHeight == "none" || checkSize(_maxHeight)) {
                    _classPrivateFieldGet(this, _options).maxHeight = _maxHeight;
                }
                return this;
            }
        }, {
            key: "minHeight",
            value: function minHeight(_minHeight) {
                if (_minHeight == undefined) {
                    return _classPrivateFieldGet(this, _options).minHeight;
                }
                if (typeof _minHeight == "number") {
                    _minHeight += "px";
                }
                if (_minHeight == "auto" || checkSize(_minHeight)) {
                    _classPrivateFieldGet(this, _options).minHeight = _minHeight;
                }
                return this;
            }
        }, {
            key: "remove",
            value: function remove() {
                var targetElement = document.getElementById(_classPrivateFieldGet(this, _elementId));
                if (targetElement != undefined) {
                    var className = targetElement.getAttribute("class") == null ? "" : targetElement.getAttribute("class");
                    className = className.replace(" fxToolTipTarget", "");
                    targetElement.setAttribute("class", className);
                    if (targetElement.removeEventListener) {
                        targetElement.removeEventListener("mouseover", mouseOver);
                        targetElement.removeEventListener("mouseout", mouseOut);
                        targetElement.removeEventListener("mousemove", mouseMove);
                    } else {
                        targetElement.onmousemove = null;
                        targetElement.onmouseover = null;
                        targetElement.onmouseout = null;
                    }
                }
                var tipIndex = tipsIndex.indexOf(_classPrivateFieldGet(this, _elementId));
                if (tipIndex != -1) {
                    tips.splice(tipIndex, 1);
                    tipsIndex.splice(tipIndex, 1);
                    if (tips.length == 0) {
                        closeDown();
                    }
                }
            }
        } ]);
        return Tip;
    }();
    var DOMchecking = true;
    var targetTimerInterval = 500;
    var targetTimer;
    function create(elementId, content) {
        if (document.getElementById(elementId) == null) {
            return;
        }
        content = content == undefined ? "" : content;
        var index = tipsIndex.indexOf(elementId);
        if (index !== -1) {
            tips[index].remove();
        }
        var newTip = new Tip(elementId, content);
        tips.push(newTip);
        tipsIndex.push(elementId);
        if (targetTimer == undefined && DOMchecking) {
            targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
        }
        return tips[tips.length - 1];
    }
    function remove(elementId) {
        if (document.getElementById(elementId) == null) {
            return;
        }
        var index = tipsIndex.indexOf(elementId);
        if (index !== -1) tips[index].remove();
    }
    function checkDOM(checkDOM) {
        if (checkDOM == undefined) return DOMchecking;
        if (checkBoolean(checkDOM)) {
            DOMchecking = checkDOM;
            if (DOMchecking) {
                targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
            } else {
                window.clearInterval(targetTimer);
            }
        }
    }
    function detectTargetRemoval() {
        tipsIndex.forEach((function(thisTip, i) {
            if (document.getElementById(thisTip) == null) {
                tips[i].remove();
            }
        }));
    }
    setUp();
    var globalOptions = new Tip("", "", true);
    var index = {
        create: create,
        remove: remove,
        getTipByElementId: getTipByElementId,
        globalOptions: globalOptions,
        suspend: suspend,
        checkDOM: checkDOM
    };
    return index;
}();