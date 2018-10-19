	function orient (targetElement, target) {
		let sizeAdjust;
		
		case 'top': {
			//top = targetCoordinates.top  - target.arrowSize() - ttDiv.offsetHeight;
			if (top < 0) {
				beforeRule.height = (ttDiv.offsetHeight + top) + 'px';
				top = 0;
			};

		case 'bottom': {
			//top = targetCoordinates.top + targetCoordinates.height + target.arrowSize();
			sizeAdjust = screenHeight - (ttDiv.offsetHeight + top + target.arrowSize());
			beforeRule.height = (sizeAdjust < 0) ? (ttDiv.offsetHeight + sizeAdjust) + 'px' : beforeRule.height;

		case 'left': {
			//top =  (targetCoordinates.height / 2) + targetCoordinates.top - (ttDiv.offsetHeight / 2);
			//left =  targetCoordinates.left - ttDiv.offsetWidth - target.arrowSize();
			if (left < 0) {
				beforeRule.width = (ttDiv.offsetWidth + left) + 'px';
				left = 0;
			};


		case 'right': {
			//top = (targetCoordinates.height / 2) + targetCoordinates.top - (ttDiv.offsetHeight / 2);
			//left = targetCoordinates.left + targetCoordinates.width + target.arrowSize();
			sizeAdjust = screenWidth - (ttDiv.offsetWidth + left + target.arrowSize());
			beforeRule.width = (sizeAdjust < 0) ? (ttDiv.offsetWidth + sizeAdjust) + 'px' : beforeRule.width;
