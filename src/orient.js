/** 
 * @module orient
 * @desc The orient module provides functions to determine the optimum orientation of a tooltip
 * if auto-sizing is set to true, and to set the proper CSS values for the tooltip's div elements. 
 */

import {ttDiv, beforeRule, afterRule} from './init.js';
import {windowHeight, windowWidth, getElementCoordinates, overlap, parseSize} from './utils.js';

/**
 * @function position
 * @desc Sets the position of the tooltip relative to the HTML element with which it is associated.
 * @param {string} targetElement The unique id of the HTML element that owns the tooltip.
 * @param {Tip} target The object containing all of the current tooltip's options and content.
 */
export function position (targetElement, target, orientation) {
    
    const targetCoordinates = getElementCoordinates(targetElement);
    const divWidth = ttDiv.getBoundingClientRect()['width'];
    const divHeight = ttDiv.getBoundingClientRect()['height'];
    const halfDivHeight = divHeight / 2;
    const halfDivWidth = divWidth / 2;
    const borderRadius = parseSize(target.borderRadius(), 'width', ttDiv);
    const arrowSize = parseSize(target.arrowSize(), 'width', ttDiv);

    afterRule.borderWidth = arrowSize + 'px';

    let top;
    let left;
    let verticalAdjust;
    let horizontalAdjust;
    let sizeAdjust;

    let adjustVertical = function (top) {
        let topAdjust = top;
        let arrowAdjust = halfDivHeight;

        if (top < 0) { 
            topAdjust = 0;
            arrowAdjust = Math.max(arrowSize + borderRadius, top + halfDivHeight);
        } else if (top + divHeight > windowHeight) {
            topAdjust = windowHeight - divHeight;
            arrowAdjust = Math.min(divHeight - borderRadius - arrowSize, halfDivHeight +  top - topAdjust);
        };

        return {topAdjust: Math.round(topAdjust), arrowAdjust: Math.round(arrowAdjust)};
    }

    let adjustHorizontal = function (left) {
        let leftAdjust = left;
        let arrowAdjust = halfDivWidth;

        if (left < 0) { 
            leftAdjust = 0;
            arrowAdjust = Math.max(arrowSize + borderRadius, left + halfDivWidth);
        } else if (left + divWidth > windowWidth) {
            leftAdjust = windowWidth - divWidth;
            arrowAdjust = Math.min(divWidth - borderRadius - arrowSize, halfDivWidth + left - leftAdjust);
        };

        return {leftAdjust: Math.round(leftAdjust), arrowAdjust: Math.round(arrowAdjust)};
    }

    switch (orientation) {
        case 'top': {
            top = targetCoordinates.top - arrowSize - divHeight;
            if (top < 0) {
                beforeRule.height = Math.round(divHeight + top) + 'px';
                top = 0;
            };
            left = (targetCoordinates.width / 2) + targetCoordinates.left - halfDivWidth;
            horizontalAdjust = adjustHorizontal(left);

            beforeRule.top = Math.round(top) + 'px';
            beforeRule.left = horizontalAdjust.leftAdjust + 'px';

            afterRule.top = '99.5%';    //  '100%';
            afterRule.left = horizontalAdjust.arrowAdjust + 'px';
            afterRule.bottom = '';
            afterRule.right = '';   
            afterRule.marginLeft = -arrowSize + 'px';
            afterRule.marginTop = '';
            afterRule.borderColor = target.backgroundColor() + ' transparent transparent transparent';
            break;
        };
        case 'bottom': {
            top = targetCoordinates.top + targetCoordinates.height + arrowSize;
            sizeAdjust = windowHeight - divHeight + top + arrowSize;
            beforeRule.height = (sizeAdjust < 0) ? (divHeight + sizeAdjust) + 'px' : beforeRule.height;
            left = (targetCoordinates.width / 2) + targetCoordinates.left - halfDivWidth;
            horizontalAdjust = adjustHorizontal(left);
            
            beforeRule.top = Math.round(top) + 'px'; 
            beforeRule.left = horizontalAdjust.leftAdjust + 'px'; 

            afterRule.top = '';
            afterRule.left = horizontalAdjust.arrowAdjust + 'px';
            afterRule.bottom = '99.5%'; //'100%';
            afterRule.right = '';
            afterRule.marginLeft = -arrowSize + 'px';
            afterRule.marginTop = '';
            afterRule.borderColor = 'transparent transparent ' + target.backgroundColor() + ' transparent';
            break;
        };
        case 'left': {
            top =  (targetCoordinates.height / 2) + targetCoordinates.top - halfDivHeight;
            left =  targetCoordinates.left - divWidth - arrowSize;
            if (left < 0) {
                beforeRule.width = Math.round(divWidth + left) + 'px';
                left = 0;
            };
            verticalAdjust = adjustVertical(top);
            
            beforeRule.top = verticalAdjust.topAdjust + 'px';
            beforeRule.left = Math.round(left) + 'px';

            afterRule.top = verticalAdjust.arrowAdjust + 'px';
            afterRule.left = '99.5%';   //'100%';
            afterRule.bottom = '';
            afterRule.right = '';
            afterRule.marginLeft = '';
            afterRule.marginTop = -arrowSize + 'px';
            afterRule.borderColor = 'transparent transparent transparent ' + target.backgroundColor();
            break;
        };
        case 'right': {
            top = (targetCoordinates.height / 2) + targetCoordinates.top - halfDivHeight;
            left = targetCoordinates.left + targetCoordinates.width + arrowSize;
            sizeAdjust = windowWidth - divWidth + left + arrowSize;
            beforeRule.width = (sizeAdjust < 0) ? (divWidth + sizeAdjust) + 'px' : beforeRule.width;
            verticalAdjust = adjustVertical(top);
            
            beforeRule.top = verticalAdjust.topAdjust + 'px'; 
            beforeRule.left = Math.round(left) + 'px';

            afterRule.top = verticalAdjust.arrowAdjust + 'px';
            afterRule.left = '';
            afterRule.bottom = '';
            afterRule.right = '99.5%';  //'100%';
            afterRule.marginLeft = '';
            afterRule.marginTop = -arrowSize + 'px';
            afterRule.borderColor = 'transparent ' + target.backgroundColor() + ' transparent transparent';
            break;
        };
    };
}

/**
 * @function optimumOrientation
 * @desc  Determines the best side upon which to place the tooltip.
 * If [auto-positioning]{@link Tip#autoPosition} is on, the
 * [preferred-orientation]{@link Tip#prefferedOrientation}
 * setting will be honored unless there is insufficient viewport space.
 * in this case, the position with the most available space will be used.
 * @param {string} targetElement The DOM element that is associated with the tooltip.
 * @param {Tip} target The [Tip]{@link Tip} class object containing all of the current tooltip's options and content.
 * @returns {string} One of ['left' | 'right' | 'top' | 'bottom'].
 * @since v2.2.0
 */

export function optimumOrientation (targetElement, target) {

    const elementCoordinates = getElementCoordinates(targetElement);
    const arrowSize = parseSize(target.arrowSize(), 'width', ttDiv);

    const midX = elementCoordinates.left + (elementCoordinates.width / 2);
    const midY = elementCoordinates.top + (elementCoordinates.height / 2);

    const divWidth = ttDiv.getBoundingClientRect()['width'];
    const divHeight = ttDiv.getBoundingClientRect()['height'];
    const halfDivHeight = divHeight / 2;
    const halfDivWidth = divWidth / 2;

    const leftOverlap = overlap ('left',
        {
            x0: elementCoordinates.left - arrowSize - divWidth,
            x1: elementCoordinates.left - arrowSize,
            y0: midY - halfDivHeight,
            y1: midY + halfDivHeight
        });
    const rightOverlap = overlap ('right',
        {
            x0: elementCoordinates.left + elementCoordinates.width + arrowSize,
            x1: elementCoordinates.left + elementCoordinates.width + arrowSize + divWidth, 
            y0: midY - halfDivHeight,
            y1: midY + halfDivHeight
        });
    const topOverlap = overlap ('top',
        {
            x0: midX - halfDivWidth,
            x1: midX + halfDivWidth,
            y0: elementCoordinates.top - arrowSize - divHeight, 
            y1: elementCoordinates.top - arrowSize
        });
    const bottomOverlap = overlap ('bottom',
        {
            x0: midX - halfDivWidth,
            x1: midX + halfDivWidth,
            y0: elementCoordinates.top + elementCoordinates.height + arrowSize,
            y1: elementCoordinates.top + elementCoordinates.height + arrowSize + divHeight
        });

    switch (target.preferredOrientation()) {
        case 'left': { if (leftOverlap.overlap == 1) return 'left'; break; };
        case 'right': { if (rightOverlap.overlap == 1) return 'right'; break; };
        case 'top': { if (topOverlap.overlap == 1) return 'top'; break; };
        case 'bottom': { if (bottomOverlap.overlap == 1) return 'bottom'; break; };
    };

    // if there is no preferred orientation or all overlaps are less than 1
    let overlaps = [leftOverlap, rightOverlap, topOverlap, bottomOverlap];

    //if all of the overlaps are less than 1 return the greatest
    if (leftOverlap.overlap < 1 && rightOverlap.overlap < 1 && topOverlap.overlap < 1 && bottomOverlap.overlap < 1) {
        return overlaps[overlaps.reduce((prev, current, index, array) => {
            if (current.overlap > array[prev].overlap) {return index} else {return prev};
        }, 0)].side;
    };

    // remove all overlaps that are less than 1
    overlaps = overlaps.reduce((prev, current) => {
        if (current.overlap == 1) {return prev.concat(current)} else {return prev};
    }, []);

    if (overlaps.length == 1) { return overlaps[0].side; }; // only one left;

    return overlaps[overlaps.reduce((prev, current, index, array) => {
        if (current.spacing[current.side] >= array[prev].spacing[prev.side]) {return index} else { return prev} ;
    }, 0)].side;
}

/**
 * @function getOrientation
 * @desc Selects the appropriate orientation by deconflicting [auto-positioning]{@link Tip#autoPosition},
 * [prefererd-orientation]{@link Tip#preferredOrientation, and [orientation]{@link Tip#orientation}
 * settings in the Tip{} class object.
 * @param {string} targetElement The DOM element that is associated with the tooltip.
 * @param {Tip} target The [Tip]{@link Tip} class object containing all of the current tooltip's options and content.
 * @returns {string} One of ['left' | 'right' | 'top' | 'bottom'].
 * @since v2.1.2
 */
export function getOrientation (targetElement, target) {
    if (target.orientation() != undefined) return target.orientation();
    if (target.autoPosition()) return optimumOrientation (targetElement, target);
    if (target.preferredOrientation() != 'none') return target.preferredOrientation();
    return 'right';
}