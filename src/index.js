/**
 * @author Michael.R.Fox, Ph.D. <fox.michael.r@gmail.com>
 * @copyright Michael R. Fox, Ph.D., 2021, 2022
 * @license MIT
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sub-license, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software:
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. * 
 * @overview 
 * [![npm version](https://badge.fury.io/js/fx.tooltip.js.svg)](https://badge.fury.io/js/fx.tooltip.js)
 * ![npm bundle size](https://img.shields.io/bundlephobia/min/fx.tooltip.js)
 * ![npm](https://img.shields.io/npm/dw/fx.tooltip.js)
 * ![GitHub last commit](https://img.shields.io/github/last-commit/MichaelRFox/fxTooltip.js)
 * ![GitHub top language](https://img.shields.io/github/languages/top/MichaelRFox/fxTooltip.js)
 * ![NPM](https://img.shields.io/npm/l/fx.tooltip.js)
 * [![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
 * 
 * fxToolTip is a small, simple library designed to show tooltips on hover over any DOM element.
 * It uses a combination of JavaScript and CSS styles to provide flexibility and ease of implementation.
 * It has no dependencies and should work on any modern browser (i.e., not Internet Explorer 8.0 and earlier).
 * fxToolTip will automatically size and position tooltips (default behavior) to ensure they are displayed
 * in the viewport. Tooltips can be positioned relative to their target DOM element (default behavior) or track the mouse.
 * fxToolTip supports method chaining and integrates nicely with [d3.js]{@link https://d3js.org/}. Tooltips can be styled
 * in a wide variety of ways, and can contain any valid HTML (text, tables, images, svg, etc.).
 * 
 * # Installation
 * ```bash
 * npm install fx.tooltip.js --save
 *
 * -or-
 *
 * npm install -g fx.tooltip.js  //install globally
 * ```
 * # Demonstrations
 * - [Demonstration of General Capabilities]{@link https://michaelrfox.github.io/demos/fxTooltipDemos/features/}
 * - [Demonstration of D3.js Integration]{@link https://michaelrfox.github.io/demos/fxTooltipDemos/d3/}
 *
 * # Usage
 * Include fxTooltip in your project in one of two ways:
 *
 * You can include a reference to the built version of the library
 * ```html
 * <!DOCTYPE Html>
 *   <html>
 *       <head>
 *           <body>
 *               <script type = 'text/javascript' src = 'fxToolTip.min.js'></script>
 *               .
 *               <!--   or   -->
 *               .
 *               <script type = 'text/javascript' src = 'https://cdn.jsdelivr.net/npm/fx.tooltip.js@latest/dist/fxToolTip.js'></script>
 *               .
 *           </body>
 *       </head>
 *   </html>
 * ````
 * 
 * Or you can include it in your JavaScript build</caption>
 * ```javascript
 * import {default as fxToolTip} from './node_modules/fx.tooltip.js';
 * ```
 * 
 * if you use this option note that the source files are in ES6 (unlike the distribution files which have been transpiled).
 * In this case, if you need to support older browsers you may want to edit your *.babelrc* file to specifically transpile fxToolTip:
 * ```json
 * {
 *      "exclude": "/node_modules\/(?!fx.tooltip.js)/"
 * }
 * ```
 *
 * # Minimal Example
 * The following example creates a tooltip that will show when the mouse hovers over the div element with the id of *myDiv*.
 * The tooltip will display with all of the default properties. The create method returns a [Tip]{@link Tip} class
 * object whose methods may be invoked to customize its properties.
 * 
 * ```html
 * <!DOCTYPE Html>
 *   <html>
 *       <head>
 *           <body>
 *               <div id = 'myDiv'>This is a sample DOM element</div>
 *               <script type = 'module'>
 *                   import {default as fxToolTip} from './node_modules/fx.tooltip.js';
 *                   const tooltipText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
 *                   fxToolTip.create('myDiv', tooltipText);
 *               </script>
 *           </body>
 *       </head>
 *   </html>
 * 
 * ```
 * 
 * # Tooltip Content
 * 
 * Content for tooltips in fxToolTip.js can contain any valid HTML, not just text.  The content can be styled using
 * CSS selector styles or in-lined within the HTML itself.  Here are a few examples:
 * 
 * ## Tables
 * 
 * When using tables and [auto-sizing]{@link Tip#autoSize} in fxToolTip, it may be necessary to set the minimum width using the
 * [minWidth]{@link Tip#minWidth} method on the [Tip]{@link Tip} object.  
 * 
 * ```javascript
 * let table = '<table id = 'table' width='100%'><tr><th>id</th><th>name</th><th>address</th></tr><tr><td>1</td><td>Bill Smith</td><td>17 Cherry Lane</td></tr><tr><td>2</td><td>Ed Walker</td><td>427 Oak Lane</td></tr></table>'
 * let content = '<p class='centeredHeading'>Address</p>' + table;
 * let myToolTip = fxToolTip.create('myElement', content)
 *     .minWidth('300px');
 * ```
 * 
 * ## Images
 * 
 * Embedding images is possible by using the image tag.  To support [auto-sizing]{@link Tip#autoSize}, you should include the height and width
 * attributes in the image tag, and set the minimum width using the [minWidth]{@link Tip#minWidth} method on the [Tip]{@link Tip}.
 * 
 * ```javascript
 * let content = '<p class='centeredHeading'>Company Logo</p><img src=logo.png alt='logo' width='300px' height='300px'></img>';
 * 
 * fxToolTip.create('myElement', content)
 *     .minWidth('300px')
 *     .arrowSize('0.5em')
 *     .cursor('pointer')
 *     .padding('5px', '1em', '2em');
 * ```
 * 
 * You may also embed inline svg if your browser supports it. To support auto-sizing, it may be necessary to set the
 * minimum width using the [minWidth]{@link Tip#minWidth} method on the [Tip]{@link Tip}.
 *
 * ```javascript
 * var svg = '<svg width='250' height='250'><rect x='50' y='50' rx='20' ry='20' width='150' height='150' style='fill:red;stroke:black;stroke-width:5' /></svg>'
 *
 * fxToolTip.create('myElement', svg)
 *     .minWidth(250)
 *     .mousePoint(true)
 *     .trackMouse(true);
 * ```
 * 
 * # Integrating with d3.js
 * 
 * [d3.js]{@link https://d3js.org/} has a few peculiarities (especially with respect to d3 selectors),
 * that fxToolTip.js accommodates.  In typical d3 coding, one generally won't save a unique variable
 * for each tooltip, as d3's chaining methods are generally used to create svg and other objects.
 * This is easily accommodated by using the d3.js each method to create tooltips.  Note that each
 * element that will have a tooltip associated with it must have a unique id. The following code
 * illustrates one convenient way to do this:
 * 
 * ```javascript
 * let svg = d3.select('body').append('svg').attr('id', 'svg')
 *     .attr('width', width + margin.right + margin.left)
 *     .attr('height', height + margin.top + margin.bottom);
 * 
 * let svgGroup = svg.append('g')
 *     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
 * 
 * let node = svgGroup.selectAll('g.node')
 *     .data(nodes);   
 * 
 * let nodeEnter = node.enter().append('g')
 *     .attr('class', 'node');
 * 
 * nodeEnter.append('circle')
 *     .attr('r', 1e-6)
 *     .style('fill', 'lightSteelBlue')
 *     .style('stroke', 'lightSteelBlue')
 *     //This is where we assign a unique id
 *     .attr('id', function(d, i) { return 'node' + i })
 *     //This is where we create a tooltip for each node
 *     .each (function (d) {   
 *         var content = '<p>' + d.toolTipText + '</p>';
 *         fxToolTip.create('node' + d.id, content)
 *             .backgroundColor('midnightBlue')
 *             .backgroundOpacity(0.9)
 *             .foregroundColor('linen')
 *             .transitionVisible(0.5, 0.4)
 *             .transitionHidden(0, 0.4)
 *             .padding('0px 10px')
 *             .borderRadius(16)
 *             .arrowSize(16);
 *     };
 * ```
 * 
 * You can find a demo of integrating fxToolTip with D3.js at {@link https://michaelrfox.github.io/demos/fxTooltipDemos/d3/}.
 */

/** 
 * @module index 
 * @desc The entry point for fxToolTip. fxToolTip exports a single object which contains methods to create and remove tooltips,
 * retrieve a [Tip]{@link Tip} class object from the unique id of its associated DOM element, A special Tip class object with
 * which one can alter the defaults globally, a method to suspend or resume showing tooltips, and a method to suspend or
 * resume polling of the DOM for removed elements.
 */
import {create, remove, checkDOM} from './fxTip.js';
import {getTipByElementId} from './tips.js';
import {Tip} from './Tip.js';
import {suspend} from './mouse.js';
import {setUp} from './init.js';

setUp();

let globalOptions = new Tip('', '', true);
/**
 * @typedef {Object} default - The default object exported by fxToolTip which exposes
 * five methods and one object.
 * @property {function} create - Method to instantiate a new [Tip]{@link Tip} class object.
 * See the [create]{@link module:fxTip~create} method.
 * @property {function} remove - Method to remove a [Tip]{@link Tip} class object.
 * See the [remove]{@link module:fxTip~remove} method.
 * @property {function} getTipByElementId - Method to retrieve a [Tip]{@link Tip} class
 * object using the DOM element id associated with it. See the
 * [getTipByElementId]{@link module:tips~getTipByElementId} method.
 * @property {Tip} globalOptions - A Tip class object whose methods modify tooltip options
 * globally. See the [Tip]{@link Tip} class object.
 * @property {function} suspend - A method to suspend or resume showing tooltips globally.
 * See the [suspend]{@link module:mouse~suspend} method.
 * @property {function} checkDOM - Method to toggle polling for deleted DOM elements.
 * See [checkDOM]{@link module:fxTip~checkDOM}.
 */
export default {create, remove, getTipByElementId, globalOptions, suspend, checkDOM};