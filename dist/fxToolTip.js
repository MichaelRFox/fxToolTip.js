var fxToolTip = function() {
    "use strict";
    function orient(targetElement, target) {
        var targetCoordinates = getElementCoordinates(targetElement);
        var top;
        var left;
        var verticalAdjust;
        var horizontalAdjust;
        var sizeAdjust;
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
            return {
                topAdjust: Math.round(topAdjust),
                arrowAdjust: Math.round(arrowAdjust)
            };
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
            return {
                leftAdjust: Math.round(leftAdjust),
                arrowAdjust: Math.round(arrowAdjust)
            };
        };
        switch (target.orientation()) {
          case "top":
            {
                top = targetCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
                if (top < 0) {
                    beforeRule.height = Math.round(ttDiv.offsetHeight + top - target.arrowSize()) + "px";
                    top = 0;
                }
                left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
                horizontalAdjust = adjustHorizontal(left);
                beforeRule.top = Math.round(top) + "px";
                beforeRule.left = horizontalAdjust.leftAdjust + "px";
                afterRule.top = "99.5%";
                afterRule.left = horizontalAdjust.arrowAdjust + "px";
                afterRule.bottom = "";
                afterRule.right = "";
                afterRule.marginLeft = -target.arrowSize() + "px";
                afterRule.marginTop = "";
                afterRule.borderColor = target.backgroundColor() + " transparent transparent transparent";
                break;
            }

          case "bottom":
            {
                top = targetCoordinates.top + targetCoordinates.height + target.arrowSize();
                sizeAdjust = windowHeight - (ttDiv.offsetHeight + top + target.arrowSize());
                beforeRule.height = sizeAdjust < 0 ? ttDiv.offsetHeight + sizeAdjust + "px" : beforeRule.height;
                left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
                horizontalAdjust = adjustHorizontal(left);
                beforeRule.top = Math.round(top) + "px";
                beforeRule.left = horizontalAdjust.leftAdjust + "px";
                afterRule.top = "";
                afterRule.left = horizontalAdjust.arrowAdjust + "px";
                afterRule.bottom = "99.5%";
                afterRule.right = "";
                afterRule.marginLeft = -target.arrowSize() + "px";
                afterRule.marginTop = "";
                afterRule.borderColor = "transparent transparent " + target.backgroundColor() + " transparent";
                break;
            }

          case "left":
            {
                top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
                left = targetCoordinates.left - ttDiv.offsetWidth - target.arrowSize();
                if (left < 0) {
                    beforeRule.width = ttDiv.offsetWidth + left + "px";
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
                afterRule.marginTop = -target.arrowSize() + "px";
                afterRule.borderColor = "transparent transparent transparent " + target.backgroundColor();
                break;
            }

          case "right":
            {
                top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
                left = targetCoordinates.left + targetCoordinates.width + target.arrowSize();
                sizeAdjust = windowWidth - (ttDiv.offsetWidth + left + target.arrowSize());
                beforeRule.width = sizeAdjust < 0 ? ttDiv.offsetWidth + sizeAdjust + "px" : beforeRule.width;
                verticalAdjust = adjustVertical(top);
                beforeRule.top = verticalAdjust.topAdjust + "px";
                beforeRule.left = Math.round(left) + "px";
                afterRule.top = verticalAdjust.arrowAdjust + "px";
                afterRule.left = "";
                afterRule.bottom = "";
                afterRule.right = "99.5%";
                afterRule.marginLeft = "";
                afterRule.marginTop = -target.arrowSize() + "px";
                afterRule.borderColor = "transparent " + target.backgroundColor() + " transparent transparent";
                break;
            }
        }
    }
    function optimumOrientation(targetElement, target) {
        var elementCoordinates = getElementCoordinates(targetElement);
        var elementCenterH = elementCoordinates.left + elementCoordinates.width / 2;
        var elementCenterV = elementCoordinates.top + elementCoordinates.height / 2;
        var leftSpacing = elementCenterH - ttDiv.offsetWidth / 2;
        var rightSpacing = windowWidth - elementCenterH - ttDiv.offsetWidth / 2;
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
          case "left":
            {
                if (leftValue >= 0) return "left";
                break;
            }

          case "right":
            {
                if (rightValue >= 0) return "right";
                break;
            }

          case "top":
            {
                if (topValue >= 0) return "top";
                break;
            }

          case "bottom":
            {
                if (bottomValue >= 0) return "bottom";
                break;
            }
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
            return "left";

          case rightValue == maxValue:
            return "right";

          case topValue == maxValue:
            return "top";

          case bottomValue == maxValue:
            return "bottom";
        }
    }
    var globalOptions$1 = {
        content: "",
        orientation: "right",
        preferredOrientation: "right",
        autoPosition: true,
        autoSize: true,
        mousePoint: false,
        trackMouse: false,
        cursor: "help",
        fontFamily: "verdana, sans-serif",
        fontSize: "16",
        foregroundColor: "white",
        backgroundColor: "#333333",
        backgroundOpacity: 1,
        padding: "5px 10px",
        borderRadius: 12,
        boxShadow: "8px 8px 8px 0 rgba(0,0,0, 0.5)",
        transitionVisible: "opacity 0.4s ease-in 0s",
        transitionHidden: "opacity 0.4s ease-out 0s",
        arrowSize: 12,
        width: "auto",
        maxWidth: "none",
        minWidth: 0,
        height: "auto",
        maxHeight: "none",
        minHeight: 0
    };
    function applyOptions(target) {
        var transitionString;
        beforeRule.fontFamily = target.font().family;
        beforeRule.fontSize = target.font().size + "px";
        beforeRule.color = target.foregroundColor();
        beforeRule.backgroundColor = target.backgroundColor();
        beforeRule.padding = target.padding();
        beforeRule.borderRadius = target.borderRadius() + "px";
        afterRule.borderWidth = target.arrowSize() + "px";
        targetRule.cursor = target.cursor();
        beforeRule.boxShadow = target.boxShadow();
        beforeRule["-moz-boxShadow"] = target.boxShadow();
        beforeRule["-webkit-boxShadow"] = target.boxShadow();
        transitionString = target.transitionVisible();
        beforeRule.transition = transitionString;
        beforeRule["-moz-transition"] = transitionString;
        beforeRule["-webkit-transiton"] = transitionString;
        beforeRule["-o-transition"] = transitionString;
        beforeRule.maxWidth = target.maxWidth() == "none" ? "none" : target.maxWidth() + "px";
        beforeRule.minWidth = target.minWidth() == 0 ? 0 : target.minWidth() + "px";
        beforeRule.maxHeight = target.maxHeight() == "none" ? "none" : target.maxHeight() + "px";
        beforeRule.minHeight = target.minHeight() == 0 ? 0 : target.minHeight() + "px";
        ttContainer.innerHTML = target.content();
        if (target.autoSize()) {
            sizeTip();
        } else {
            beforeRule.width = target.width() == "auto" ? "auto" : target.width() + "px";
            beforeRule.height = target.height() == "auto" ? "auto" : target.height() + "px";
        }
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
        if (target.autoPosition()) {
            target.orientation(optimumOrientation(targetElement, target), true);
        }
        orient(targetElement, target);
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
        if (target.autoPosition()) {
            target.orientation(optimumOrientation(targetElement, target), true);
        }
        orient(targetElement, target);
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
        }), (transitionDuration + transitionDelay) * 1e3);
        beforeRule.opacity = 0;
    }
    function suspend(suspendTips) {
        if (typeof suspendTips == "undefined") {
            return suspended;
        }
        if (checkBoolean(suspendTips, "suspend")) {
            suspended = suspendTips;
        }
    }
    var windowWidth;
    var windowHeight;
    var aspectRatio;
    function detectTargetRemoval() {
        tipsIndex.forEach((function(thisTip, i) {
            if (document.getElementById(thisTip) == null) {
                tips[i].remove();
            }
        }));
    }
    function windowResized() {
        windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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
    function hexToRgb(hex) {
        var rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return [ parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16) ];
    }
    function parseColor(input) {
        pseudoDiv.style.color = input;
        var rgb = getComputedStyle(pseudoDiv, null).color;
        if (rgb.indexOf("#") !== -1) {
            rgb = hexToRgb(rgb);
        } else rgb = rgb.match(/\d+/g);
        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    }
    function parseSize(size, dimension) {
        if (typeof size == "number") {
            return size;
        }
        dimension = dimension == undefined ? "width" : dimension;
        if (dimension == "width") {
            pseudoDiv.style.width = size;
            return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue("width"), 10);
        } else {
            pseudoDiv.style.height = size;
            return parseInt(window.getComputedStyle(pseudoDiv, null).getPropertyValue("height"), 10);
        }
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
    function checkCSS(variable, style) {
        pseudoDiv.style[variable] = "initial";
        pseudoDiv.style[variable] = style;
        if (pseudoDiv.style[variable] == "initial") {
            console.log("Option setting error. ".concat(style, " is not a valid style for ").concat(variable));
            return false;
        } else {
            return true;
        }
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
    var pseudoDiv;
    var targetTimerInterval = 500;
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
        if (sheet.insertRule) {
            sheet.insertRule(".fxToolTip {opacity: 0;position: fixed;visibility: hidden;z-index: 100;pointer-events: none;display: inline-block}", rules.length);
            sheet.insertRule(".fxContainer {width:100%;height:100%;overflow:hidden;text-overflow:ellipsis}", rules.length);
            sheet.insertRule('.fxToolTip::after{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
            sheet.insertRule(".fxToolTipTarget {cursor: help;}", rules.length);
        } else {
            sheet.addRule(".fxToolTip", "{opacity: 0;position: fixed;visibility: hidden;z-index: 100;pointer-events: none;display: inline-block}", rules.length);
            sheet.addRule(".fxContainer", "{width:100%;height:100%;overflow:hidden;text-overflow:ellipsis}", rules.length);
            sheet.addRule(".fxToolTip::after", '{content: "";position: absolute;border-style: solid;pointer-events: none;}', rules.length);
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
        pseudoDiv = document.createElement("div");
        pseudoDiv.style.visibility = "hidden";
        pseudoDiv.style.position = "absolute";
        pseudoDiv.style.display = "inline-block";
        document.body.insertBefore(pseudoDiv, document.body.firstChild);
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
            if (userRules == false) {
                sheet.deleteRule(getRuleIndex(".fxToolTip"));
            }
            sheet.deleteRule(getRuleIndex(".fxToolTip::after"));
            sheet.deleteRule(getRuleIndex(".fxToolTipTarget"));
        } else {
            if (userRules == false) {
                sheet.removeRule(getRuleIndex(".fxToolTip"));
            }
            sheet.removeRule(getRuleIndex(".fxToolTip::after"));
            sheet.removeRule(getRuleIndex(".fxToolTipTarget"));
        }
        ttDiv.parentNode.removeChild(ttDiv);
        pseudoDiv.parentNode.removeChild(pseudoDiv);
        sheet = undefined;
        rules = undefined;
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
    function sizeTip(target) {
        beforeRule.width = "auto";
        beforeRule.height = "auto";
        var perimeter;
        var height;
        var width;
        var oldWidth = ttDiv.offsetWidth;
        var newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
        var oldDelta = Math.abs(newAspect - aspectRatio);
        var itterations = 0;
        var newDelta = oldDelta;
        while (newDelta > .1 && itterations < 10) {
            perimeter = ttDiv.offsetWidth + ttDiv.offsetHeight;
            height = 1 / ((aspectRatio + 1) / perimeter);
            width = perimeter - height;
            beforeRule.width = Math.round(width) + "px";
            newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
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
                _classPrivateFieldSet(this, _options, Object.assign({}, globalOptions$1));
                _classPrivateFieldSet(this, _elementId, elementId);
                var targetElement = document.getElementById(elementId);
                var className = targetElement.getAttribute("class") === null ? "" : targetElement.getAttribute("class");
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
                    _classPrivateFieldGet(this, _options).autoPosition = false;
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
                if (checkFontFamily(family)) {
                    _classPrivateFieldGet(this, _options).fontFamily = family;
                    _classPrivateFieldGet(this, _options).fontSize = parseSize(size);
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
                if (_padding == undefined) {
                    return _classPrivateFieldGet(this, _options).padding;
                }
                var size0;
                var size1;
                var tmpPadding;
                _padding = _padding.split(" ", 4);
                switch (_padding.length) {
                  case 0:
                    {
                        return _classPrivateFieldGet(this, _options).padding;
                    }

                  case 1:
                    {
                        size0 = parseSize(_padding[0]);
                        tmpPadding = size0 + "px " + size0 + "px " + size0 + "px " + size0 + "px";
                        break;
                    }

                  case 2:
                    {
                        size0 = parseSize(_padding[0]);
                        size1 = parseSize(_padding[1]);
                        tmpPadding = size0 + "px " + size1 + "px " + size0 + "px " + size1 + "px";
                        break;
                    }

                  case 3:
                    {
                        size0 = parseSize(_padding[1]);
                        tmpPadding = parseSize(_padding[0]) + "px " + size0 + "px " + parseSize(_padding[2]) + "px " + size0 + "px";
                        break;
                    }

                  case 4:
                    {
                        tmpPadding = parseSize(_padding[0]) + "px " + parseSize(_padding[1]) + "px " + parseSize(_padding[2]) + "px " + parseSize(_padding[3]) + "px";
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
                _classPrivateFieldGet(this, _options).borderRadius = parseSize(_borderRadius);
                return this;
            }
        }, {
            key: "boxShadow",
            value: function boxShadow(size, color, opacity) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).boxShadow;
                }
                var parsedColor;
                var parsedSize;
                var boxShadowString;
                var rgbCore;
                if (arguments[0] == "none") {
                    _classPrivateFieldGet(this, _options).boxShadow = "";
                } else {
                    parsedSize = parseSize(size);
                    parsedColor = parseColor(color);
                    if (opacity !== 0) {
                        rgbCore = parsedColor.match(/\d+/g);
                        boxShadowString = "rgba(" + parseInt(rgbCore[0]) + "," + parseInt(rgbCore[1]) + "," + parseInt(rgbCore[2]) + "," + opacity + ")";
                    } else {
                        boxShadowString = parsedColor;
                    }
                    _classPrivateFieldGet(this, _options).boxShadow = parsedSize + "px " + parsedSize + "px " + parsedSize + "px 0 " + boxShadowString;
                }
                return this;
            }
        }, {
            key: "transitionVisible",
            value: function transitionVisible(delay, duration) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).transitionVisible;
                }
                _classPrivateFieldGet(this, _options).transitionVisible = "opacity " + duration + "s ease-in " + delay + "s";
                return this;
            }
        }, {
            key: "transitionHidden",
            value: function transitionHidden(delay, duration) {
                if (arguments.length == 0) {
                    return _classPrivateFieldGet(this, _options).transitionHidden;
                }
                _classPrivateFieldGet(this, _options).transitionHidden = "opacity " + duration + "s ease-out " + delay + "s";
                return this;
            }
        }, {
            key: "arrowSize",
            value: function arrowSize(_arrowSize) {
                if (_arrowSize == undefined) {
                    return _classPrivateFieldGet(this, _options).arrowSize;
                }
                _classPrivateFieldGet(this, _options).arrowSize = parseSize(_arrowSize);
                return this;
            }
        }, {
            key: "width",
            value: function width(_width) {
                if (_width == undefined) {
                    return _classPrivateFieldGet(this, _options).width;
                }
                _classPrivateFieldGet(this, _options).width = _width == "auto" ? "auto" : parseSize(_width);
                _classPrivateFieldGet(this, _options).autoSize = _width == "auto" ? options.autoSize : false;
                return this;
            }
        }, {
            key: "maxWidth",
            value: function maxWidth(_maxWidth) {
                if (_maxWidth == undefined) {
                    return _classPrivateFieldGet(this, _options).maxWidth;
                }
                _classPrivateFieldGet(this, _options).maxWidth = _maxWidth == "none" ? "none" : parseSize(_maxWidth);
                return this;
            }
        }, {
            key: "minWidth",
            value: function minWidth(_minWidth) {
                if (_minWidth == undefined) {
                    return _classPrivateFieldGet(this, _options).minWidth;
                }
                _classPrivateFieldGet(this, _options).minWidth = _minWidth == "none" ? "none" : parseSize(_minWidth);
                return this;
            }
        }, {
            key: "height",
            value: function height(_height) {
                if (_height == undefined) {
                    return _classPrivateFieldGet(this, _options).height;
                }
                _classPrivateFieldGet(this, _options).height = _height == "auto" ? "auto" : parseSize(_height, "height");
                _classPrivateFieldGet(this, _options).autoSize = _height == "auto" ? options.autoSize : false;
                return this;
            }
        }, {
            key: "maxHeight",
            value: function maxHeight(_maxHeight) {
                if (_maxHeight == undefined) {
                    return _classPrivateFieldGet(this, _options).maxHeight;
                }
                _classPrivateFieldGet(this, _options).maxHeight = _maxHeight == "none" ? "none" : parseSize(_maxHeight, "height");
                return this;
            }
        }, {
            key: "minHeight",
            value: function minHeight(_minHeight) {
                if (_minHeight == undefined) {
                    return _classPrivateFieldGet(this, _options).minHeight;
                }
                _classPrivateFieldGet(this, _options).minHeight = _minHeight == "none" ? "none" : parseSize(_minHeight, "height");
                return this;
            }
        }, {
            key: "remove",
            value: function remove() {
                var targetTimer;
                window.clearInterval(targetTimer);
                var targetElement = document.getElementById(_classPrivateFieldGet(this, _elementId));
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
                var tipIndex = tipsIndex.indexOf(_classPrivateFieldGet(this, _elementId));
                tips.splice(tipIndex, 1);
                tipsIndex.splice(tipIndex, 1);
                if (tips.length == 0) {
                    closeDown();
                } else {
                    targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
                }
            }
        } ]);
        return Tip;
    }();
    function create(elementId, content) {
        if (document.getElementById(elementId) == null) {
            return;
        }
        var index = tipsIndex.indexOf(elementId);
        if (index !== -1) {
            tips[index].remove();
        }
        var newTip = new Tip(elementId, content);
        tips.push(newTip);
        tipsIndex.push(elementId);
        return tips[tips.length - 1];
    }
    function remove(elementId) {
        if (document.getElementById(elementId) == null) {
            return;
        }
        var index = tipsIndex.indexOf(elementId);
        if (index !== -1) tips[index].remove();
    }
    setUp();
    var globalOptions = new Tip("", "", true);
    var index = {
        create: create,
        remove: remove,
        getTipByElementId: getTipByElementId,
        globalOptions: globalOptions,
        suspend: suspend
    };
    return index;
}();