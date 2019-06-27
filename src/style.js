import {rules} from './startAndFinish.js';

export function getRule (rule) {
    rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
        var name = rules[i].cssText.match(/(?<name>[^{]*)\s*{/i).groups.name.trim();
        if (name.toLowerCase() == rule) return (rules[i]);
	};
    return undefined;
};

export function getRuleIndex (rule) {
	rule = rule.toLowerCase();
	for (var i = 0; i < rules.length; i++) {
        var name = rules[i].cssText.match(/(?<name>[^{]*)\s*{/i).groups.name.trim();
		if (name.toLowerCase() == rule) return (i);
	};
	return null;
};
