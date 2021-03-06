import { optimumOrientation, orient } from './orient.js';
import { applyOptions } from './options.js';
import { tips, tipsIndex, sizeTip } from './tip.js';
import { beforeRule } from './startAndFinish.js';

export var mouseX;
export var mouseY;

var timer;
var suspended = false;

function getMouseCoordinates(event) {

  event = event || window.event;

  mouseX = event.clientX;
  mouseY = event.clientY;

}

export function mouseOver(event) {

  event = event || window.event;

  if (suspend()) {return;};

  var targetElement = this;
  var target;

  if (beforeRule.visibility !== 'hidden') {
    beforeRule.transition = '';
    clearTimeout(timer);
  };

  beforeRule.visibility = 'visible';

  getMouseCoordinates(event);

  target = tips[tipsIndex.indexOf(targetElement.id)];

  applyOptions(target);
  //  if (target.autoSize()) { sizeTip(target); };
  //  beforeRule.width = target.width() + 'px';
  if (target.autoPosition()) {
    target.orientation(optimumOrientation(targetElement, target), true);
  };
  orient(targetElement, target);
  beforeRule.opacity = target.backgroundOpacity();
}

export function mouseMove(event) {

  event = event || window.event;

  if (suspend()) {return;};

  var targetElement = this;
  var target;

  target = tips[tipsIndex.indexOf(targetElement.id)];
  if (!target.trackMouse()) {return;};

  getMouseCoordinates(event);

  if (target.autoPosition()) {
    target.orientation(optimumOrientation(targetElement, target), true);
  };
  //      if (target.autoPosition() == true) { target.orientation(optimumOrientation(targetElement, target), true); };
  orient(targetElement, target);
}

export function mouseOut(event) {

  event = event || window.event;

  var targetElement = this;

  if (window.getComputedStyle(targetElement, null).getPropertyValue('opacity') == 0 && suspend()) {
    return;
  }

  var target = tips[tipsIndex.indexOf(targetElement.id)];
  var transitionString = target.transitionHidden();
  var transitionDuration = transitionString.split(' ')[1].replace('s', '');

  beforeRule.transition = transitionString;
  beforeRule['-moz-transition'] = transitionString;
  beforeRule['-webkit-transiton'] = transitionString;
  beforeRule['-o-transition'] = transitionString;

  timer = window.setTimeout(function () {
    beforeRule.visibility = 'hidden';
  },
  transitionDuration * 1000);
  beforeRule.opacity = 0;

}

export function suspend(suspendTips) {
  if (typeof suspendTips == 'undefined') {return suspended;};
  suspended = suspendTips;
}