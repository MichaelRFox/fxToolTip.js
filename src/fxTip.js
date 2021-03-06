import { set, setUp } from './startAndFinish.js';
import { tip, tips, tipsIndex } from './tip.js';

export function create(elementId, content) {

  if (document.getElementById(elementId) == null) {
    return;
  };

  if (!set) setUp();
  var index = tipsIndex.indexOf(elementId);

  if (index !== -1) {
    tips[index].remove();
  };

  var newTip = new tip(elementId, content);
  tips.push(newTip);
  tipsIndex.push(elementId);
  return tips[tips.length - 1];

}

export function remove(elementId) {

  if (document.getElementById(elementId) == null) {
    return;
  };

  var index = tipsIndex.indexOf(elementId);
  if (index !== -1) tips[index].remove();

}