import { ttDiv, beforeRule, afterRule } from './startAndFinish.js';
import { windowHeight, windowWidth, getElementCoordinates } from './utils.js';

export function orient(targetElement, target) {

  var targetCoordinates = getElementCoordinates(targetElement);
  var top;
  var left;
  var verticalAdjust;
  var horizontalAdjust;
  var sizeAdjust;

  var adjustVertical = function adjustVertical(top) {
    var topAdjust = top;
    var arrowAdjust = ttDiv.offsetHeight / 2;

    if (top < 0) {
      topAdjust = 0;
      arrowAdjust = Math.max(target.arrowSize() + target.borderRadius(), top + ttDiv.offsetHeight / 2);
    } else if (top + ttDiv.offsetHeight > windowHeight) {
      topAdjust = windowHeight - ttDiv.offsetHeight;
      arrowAdjust = Math.min(ttDiv.offsetHeight - target.borderRadius() - target.arrowSize(), ttDiv.offsetHeight / 2 + top - topAdjust);
    };

    return { topAdjust: Math.round(topAdjust), arrowAdjust: Math.round(arrowAdjust) };
  };

  var adjustHorizontal = function adjustHorizontal(left) {
    var leftAdjust = left;
    var arrowAdjust = ttDiv.offsetWidth / 2;

    if (left < 0) {
      leftAdjust = 0;
      arrowAdjust = Math.max(target.arrowSize() + target.borderRadius(), left + ttDiv.offsetWidth / 2);
    } else if (left + ttDiv.offsetWidth > windowWidth) {
      leftAdjust = windowWidth - ttDiv.offsetWidth;
      arrowAdjust = Math.min(ttDiv.offsetWidth - target.borderRadius() - target.arrowSize(), ttDiv.offsetWidth / 2 + left - leftAdjust);
    };

    return { leftAdjust: Math.round(leftAdjust), arrowAdjust: Math.round(arrowAdjust) };
  };

  switch (target.orientation()) {
    case 'top':{
        top = targetCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
        if (top < 0) {
          beforeRule.height = Math.round(ttDiv.offsetHeight + top - target.arrowSize()) + 'px';
          top = 0;
        };
        left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
        horizontalAdjust = adjustHorizontal(left);

        beforeRule.top = Math.round(top) + 'px';
        beforeRule.left = horizontalAdjust.leftAdjust + 'px';

        afterRule.top = '99.5%'; //  '100%';
        afterRule.left = horizontalAdjust.arrowAdjust + 'px';
        afterRule.bottom = '';
        afterRule.right = '';
        afterRule.marginLeft = -target.arrowSize() + 'px';
        afterRule.marginTop = '';
        afterRule.borderColor = target.backgroundColor() + ' transparent transparent transparent';
        break;
      };
    case 'bottom':{
        top = targetCoordinates.top + targetCoordinates.height + target.arrowSize();
        sizeAdjust = windowHeight - (ttDiv.offsetHeight + top + target.arrowSize());
        beforeRule.height = sizeAdjust < 0 ? ttDiv.offsetHeight + sizeAdjust + 'px' : beforeRule.height;
        left = targetCoordinates.width / 2 + targetCoordinates.left - ttDiv.offsetWidth / 2;
        horizontalAdjust = adjustHorizontal(left);

        beforeRule.top = Math.round(top) + 'px';
        beforeRule.left = horizontalAdjust.leftAdjust + 'px';

        afterRule.top = '';
        afterRule.left = horizontalAdjust.arrowAdjust + 'px';
        afterRule.bottom = '99.5%'; //'100%';
        afterRule.right = '';
        afterRule.marginLeft = -target.arrowSize() + 'px';
        afterRule.marginTop = '';
        afterRule.borderColor = 'transparent transparent ' + target.backgroundColor() + ' transparent';
        break;
      };
    case 'left':{
        top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
        left = targetCoordinates.left - ttDiv.offsetWidth - target.arrowSize();
        if (left < 0) {
          beforeRule.width = ttDiv.offsetWidth + left + 'px';
          left = 0;
        };
        verticalAdjust = adjustVertical(top);

        beforeRule.top = verticalAdjust.topAdjust + 'px';
        beforeRule.left = Math.round(left) + 'px';

        afterRule.top = verticalAdjust.arrowAdjust + 'px';
        afterRule.left = '99.5%'; //'100%';
        afterRule.bottom = '';
        afterRule.right = '';
        afterRule.marginLeft = '';
        afterRule.marginTop = -target.arrowSize() + 'px';
        afterRule.borderColor = 'transparent transparent transparent ' + target.backgroundColor();
        break;
      };
    case 'right':{
        top = targetCoordinates.height / 2 + targetCoordinates.top - ttDiv.offsetHeight / 2;
        left = targetCoordinates.left + targetCoordinates.width + target.arrowSize();
        sizeAdjust = windowWidth - (ttDiv.offsetWidth + left + target.arrowSize());
        beforeRule.width = sizeAdjust < 0 ? ttDiv.offsetWidth + sizeAdjust + 'px' : beforeRule.width;
        verticalAdjust = adjustVertical(top);

        beforeRule.top = verticalAdjust.topAdjust + 'px';
        beforeRule.left = Math.round(left) + 'px';

        afterRule.top = verticalAdjust.arrowAdjust + 'px';
        afterRule.left = '';
        afterRule.bottom = '';
        afterRule.right = '99.5%'; //'100%';
        afterRule.marginLeft = '';
        afterRule.marginTop = -target.arrowSize() + 'px';
        afterRule.borderColor = 'transparent ' + target.backgroundColor() + ' transparent transparent';
        break;
      };}
  ;
}

export function optimumOrientation(targetElement, target) {

  var elementCoordinates = getElementCoordinates(targetElement);
  var elementCenterH = elementCoordinates.left + elementCoordinates.width / 2;
  var elementCenterV = elementCoordinates.top + elementCoordinates.height / 2;

  var leftSpacing = elementCenterH - ttDiv.offsetWidth / 2;
  var rightSpacing = windowWidth - elementCenterH - ttDiv.offsetWidth / 2; //check this
  var topSpacing = elementCenterV - ttDiv.offsetHeight / 2;
  var bottomSpacing = windowHeight - elementCenterV - ttDiv.offsetHeight / 2;

  var leftMargin = elementCoordinates.left - target.arrowSize() - ttDiv.offsetWidth;
  var rightMargin = windowWidth - ttDiv.offsetWidth - target.arrowSize() - elementCoordinates.left - elementCoordinates.width;
  var topMargin = elementCoordinates.top - target.arrowSize() - ttDiv.offsetHeight;
  var bottomMargin = windowHeight - ttDiv.offsetHeight - target.arrowSize() - elementCoordinates.top - elementCoordinates.height;

  var leftValue = Math.min(topSpacing, bottomSpacing, leftMargin);
  var rightValue = Math.min(topSpacing, bottomSpacing, rightMargin);
  var topValue = Math.min(leftSpacing, rightSpacing, topMargin);
  var bottomValue = Math.min(leftSpacing, rightSpacing, bottomMargin);

  switch (target.preferredOrientation()) {
    case 'left':{if (leftValue >= 0) return 'left';break;};
    case 'right':{if (rightValue >= 0) return 'right';break;};
    case 'top':{if (topValue >= 0) return 'top';break;};
    case 'bottom':{if (bottomValue >= 0) return 'bottom';break;};}
  ;

  if (leftValue < 0 && rightValue < 0 && topValue < 0 && bottomValue < 0) {
    leftValue += elementCoordinates.height;
    rightValue += elementCoordinates.height;
    topValue += elementCoordinates.width;
    bottomValue += elementCoordinates.width;
  };

  var maxValue = Math.max(leftValue, rightValue, topValue, bottomValue);
  switch (true) {
    case leftValue == maxValue:return 'left';
    case rightValue == maxValue:return 'right';
    case topValue == maxValue:return 'top';
    case bottomValue == maxValue:return 'bottom';}
  ;

}