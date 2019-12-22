import {ttDiv, ttContainer, targetTimerInterval, closeDown, beforeRule} from './startAndFinish.js';
import {aspectRatio, parseSize, parseColor} from './utils.js';
import {mouseOver, mouseOut, mouseMove} from './mouse.js';
import {detectTargetRemoval} from './utils.js';
import {tipOptions} from './options.js';

export let tips = [];
export let tipsIndex = [];

export function getTipByElementId(elementId) {
    let index = tipsIndex.indexOf(elementId);
    if (index !== -1) {
        return tips[index];
    } else {
        return (undefined);
    };
}

export function sizeTip (target) {

    beforeRule.width = 'auto';
    beforeRule.height = 'auto';

    let perimeter;
    let height;
    let width;
    let oldWidth = ttDiv.offsetWidth;
    let newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;;
    let oldDelta = Math.abs(newAspect - aspectRatio);
    let itterations = 0;
    let newDelta = oldDelta;
    
    while (newDelta > 0.1 && itterations < 10) {
        perimeter = ttDiv.offsetWidth + ttDiv.offsetHeight;
        height = 1 / ((aspectRatio + 1) / perimeter);
        width = perimeter - height;
        beforeRule.width = Math.round(width) + 'px';
        newAspect = ttDiv.offsetWidth / ttDiv.offsetHeight;
        newDelta = Math.abs(newAspect - aspectRatio);
        if (Math.abs(newDelta - oldDelta) < 0.1) {
            if (oldDelta < newDelta) { beforeRule.width = Math.round(oldWidth) + 'px' };
            itterations = 10;
        } else {
            oldWidth = width;
            oldDelta = newDelta;
            itterations++;
        };
    };
}

export function tip (elementId, content) {
    
    let targetElement;
    let targetTimer;
    let className;
    
    let thisToolTip = new tipOptions;

    thisToolTip.remove = function () {

        window.clearInterval(targetTimer);
            
        className =  (targetElement.getAttribute('class') === null) ? "" : targetElement.getAttribute('class');
        className = className.replace(' fxToolTipTarget', '');
        targetElement.setAttribute('class', className);

            if (targetElement.removeEventListener) {
                targetElement.removeEventListener('mouseover', mouseOver);
                targetElement.removeEventListener('mouseout', mouseOut);
                targetElement.removeEventListener('mousemove', mouseMove);
            } else {
                targetElement.onmousemove = null;
                targetElement.onmouseover = null;
                targetElement.onmouseout = null;
            };
    
        var tipIndex = tipsIndex.indexOf(elementId);
        
        tips.splice(tipIndex, 1);
        tipsIndex.splice(tipIndex, 1);
        if (tips.length == 0) {
            closeDown(); 
        } else {
            targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
        };
    };
    
    /* constructor */

        targetElement = document.getElementById(elementId);
        className = (targetElement.getAttribute('class') === null) ? "" : targetElement.getAttribute('class');
        targetElement.setAttribute('class', className + ' fxToolTipTarget')

        if(targetElement.addEventListener) {
            targetElement.addEventListener('mouseover', mouseOver, false);
            targetElement.addEventListener('mouseout', mouseOut, false);
            targetElement.addEventListener('mousemove', mouseMove, false);      
        } else {
            targetElement.onmouseover = mouseOver;
            targetElement.onmouseout = mouseOut;
            targetElement.onmousemove = mouseMove;
        };
        
        thisToolTip.maxWidth('75%');
        thisToolTip.maxHeight('75%', 'height');
        thisToolTip.content(content);
        //options.content = content;

    return (thisToolTip);
}
