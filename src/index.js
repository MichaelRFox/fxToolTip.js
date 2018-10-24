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

import {set, setUp} from './startAndFinish.js';
import {tip, tips, tipsIndex} from './tip.js';

 function create (elementId, content) {
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
};

function remove (elementId) {
	var index;
	
	index = tipsIndex.indexOf(elementId);
	if (index !== -1) tips[index].remove();
};

function getTipByElementId(elementId) {
	let index = tipIndex.indexOf(elementId);
	if (index !== -1) {
		return tips[index];
	} else {
		return (undefined);
	};
};

export default {create, remove, getTipByElementId};