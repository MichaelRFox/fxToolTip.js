import {beforeRule, afterRule, targetRule, ttDiv, ttContainer} from './startAndFinish.js';
import {sizeTip} from './tip.js';

export function applyOptions  (target) {
	
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
	};
//	ttDiv.innerHTML = target.content();
};