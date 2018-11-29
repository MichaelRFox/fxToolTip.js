import {rules} from './startAndFinish.js';

export function getRule (rule) {
	rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
		if (rules[i].selectorText.toLowerCase() == rule) return (rules[i]);
	};
	return undefined;
};

export function getRuleIndex (rule) {
	rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
		if (rules[i].selectorText.toLowerCase() == rule) return (i);
	};
	return null;
};
