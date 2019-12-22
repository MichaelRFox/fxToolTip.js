import {optimumOrientation, orient} from './orient.js';
import {applyOptions} from './options.js';
import {tips, tipsIndex, sizeTip} from './tip.js';
import {beforeRule} from './startAndFinish.js';

export let mouseX;
export let mouseY;

let timer;

function getMouseCoordinates (event) {

    event = event || window.event;

    mouseX = event.clientX;
    mouseY = event.clientY;

}

export function mouseOver (event) {
    
    event = event || window.event;

    let targetElement = this;
    let target;

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

export function mouseMove (event) {

    event = event || window.event;
    
    let targetElement = this;
    let target;
    
    target = tips[tipsIndex.indexOf(targetElement.id)];
    if (!target.trackMouse()) { return; };

    getMouseCoordinates(event);

    if (target.autoPosition()) { 
        target.orientation(optimumOrientation(targetElement, target), true);
    };
//      if (target.autoPosition() == true) { target.orientation(optimumOrientation(targetElement, target), true); };
    orient(targetElement, target);
}

export function mouseOut (event) {

    event = event || window.event;

    let targetElement = this;
    let target = tips[tipsIndex.indexOf(targetElement.id)];
    let transitionString = target.transitionHidden();
    let transitionDuration =  transitionString.split(' ')[1].replace('s', '');

    beforeRule.transition = transitionString;
    beforeRule['-moz-transition'] = transitionString;
    beforeRule['-webkit-transiton'] = transitionString;
    beforeRule['-o-transition'] = transitionString;

    timer = window.setTimeout(function() {
        beforeRule.visibility = 'hidden';
        },
        transitionDuration * 1000);
    beforeRule.opacity = 0;

}