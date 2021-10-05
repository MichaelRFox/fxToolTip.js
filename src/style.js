/** 
 * @module style 
 * @desc The style module provides two helper functions that retrieve rules and rule indexes
 * from the global rules collection.
 */

import {rules} from './init.js';

/**
 * @function getRule
 * @param {string} rule The name of the rule to retrieve.
 * @returns {(Object | undefined)} If the rule is located returns the rule object, otherwise undefined.
 */
export function getRule (rule) {
    rule = rule.toLowerCase();
    for (let i = 0; i < rules.length; i++) {
        let name = rules[i].cssText.match(/(?<name>[^{]*)\s*\{/i).groups.name.trim();
        if (name.toLowerCase() == rule) return (rules[i]);
    };
    return undefined;
}

/**
 * @function getRuleIndex
 * @param {string} rule The name of the rule index to retrieve.
 * @returns {(number | undefined)} If the rule is located returns the rule's index in the global
 * rules collection, otherwise undefined.
 */
export function getRuleIndex (rule) {
    rule = rule.toLowerCase();
    for (let i = 0; i < rules.length; i++) {
        let name = rules[i].cssText.match(/(?<name>[^{]*)\s*\{/i).groups.name.trim();
        if (name.toLowerCase() == rule) return (i);
    };
    return null;
}
