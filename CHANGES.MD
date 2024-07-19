# fxToolTip Change Log

>  **Tags:**
> 
> - :boom:       		 Breaking Change
> - :eyeglasses: 		 Spec Compliance
> - :rocket:     		 New Feature
> - :bug:        		 Bug Fix
> - :pencil:       		 Documentation
> - :house:      		 Internal
> - :hammer_and_wrench:  Improvement

# Version 2

### v2.4.9
_Jul 19 2024
- :bug: Updated dev dependencies to resolve vulnerabilities in @babel/traverse

### v2.4.8
_Jan 12, 2023_
- :bug: Updated dev dependencies to resolve vulnerabilities in json5 and terser.
- :house: Removed support for ie in .browserslistrc.

### v2.4.7

_Apr 25, 2022_
- :house: Updated jest to 28.0.0.

## v2.4.6

_Apr 4, 2022_
- :house: Fixes to package.json.

## v2.4.5

_Apr 4, 2022_
- :house: Updated license.md.

## v2.4.4

_Apr 4, 2022_
- :pencil: Various typo fixes to the documentation.

## v2.4.3

_Apr 3, 2022_
- :bug: Updated babel-core to resolve vulnerability in minimist.

## v2.4.2

_Feb 3, 2022_
- :pencil: FIxed documentation link.

## v2.4.1

_Feb 3, 2022_
- :pencil: Fixed link to demos.

## v2.4.0

_Feb 3, 2022_
- :hammer_and_wrench: Updated all dev dependencies.

## v2.3.0

_Feb 3, 2022_
- :eyeglasses: Renamed .babelrc to babel.config.json.
- :hammer_and_wrench: Added some unit tests using jest.
- :hammer_and_wrench: Improvements to *parseColor* and *hexToRgb* utilities.
- :bug: Fixed bug in *getElementCoordiates* overlap bottom.
- :hammer_and_wrench: Added dev-dependency for *fxStripJsDoc* since terser has depreciated the *beautify* option.
- :pencil: Improvement to docs.
- :bug: Updated dev dependencies to resolve vulnerability in jsdoc.

## v2.2.0

_Oct 11, 2021_
- :bug: Fixed tooltip overflow into scrollbar
- :bug: Addressed edge cases where tooltip is too large for the client viewport.
- :hammer_and_wrench: Improved deconfliction of position, auto-positioning, and preferred-orientation options.
- :hammer_and_wrench: Implemented new algorithm for auto-positioning.
- :hammer_and_wrench: Added additional error checking for tooltip options.
- :boom: Added the ability to set appropriate options to percentage values.
- :hammer_and_wrench: Updated dev-dependencies.
- :pencil: Updated docs.

## v2.1.1

_Oct 6, 2021_
- :bug: Fixed broken docs link
- :pencil: Docs updates
- :boom: Added new method to the fxToolTip object to suspend or enable checking the DOM for deleted DOM elements.

## v2.1.0

_Oct 5, 2021_
- :pencil: Updated Readme.md - clarified cursor usage
- :bug: change default orientation to 'right' to provide a default if autoPosition is false
- :hammer_and_wrench: Added error checking code to several options
- :hammer_and_wrench: Converted the fxTooltip code to and ES6 class and incorporated tip.js
- :bug: Improved mouseout delay
- :bug: Corrected bug in code that automatically shuts down the fxToolTip environment
- :pencil: Added jsDoc annotations throughout - created new documentation github.io

## v2.0.1

_Sept 25, 2021_
- :bug: fixed typo in autoPosition option code
- :bug: fixed typo in autoSize option

## v2.0.0

_Sept 24, 2021_
- :warning: Set default max/min height/width to *none*
- :warning: Stopped transpiling src directory code (dist directory files are still transpiled)
- :bug: Resolved conflicts between .autoSize() and .width() and .height() methods
- :pencil: Updated readme.md

# Version 1

## v1.4.6

_Sep 17, 2021_
- :hammer_and_wrench: updated babel to resolve dependency vulnerability
- :hammer_and_wrench: Bump path-parse from 1.0.6 to 1.0.7
- :hammer_and_wrench: Bump browserslist from 4.13.0 to 4.16.5
- :hammer_and_wrench: Bump lodash from 4.17.19 to 4.17.21

## v1.4.5

_Oct 13, 2020_
- :hammer_and_wrench: updated links to demos

## v1.4.4

_Oct 12, 2020_
- :hammer_and_wrench: fixed broken link to demos

## v1.4.3

_Aug 18, 2020_
- :pencil: Updated readme.md

## v1.4.2

_Jul 16, 2020_
- :bug: updated babel to remove dependency vulnerability

## v1.4.1

_Mar 17, 2020_
- :bug: updated babel to resolve dependency vulnerability

## v1.4.0

_Dec 24, 2019_
- :boom: added method to temporarily suspend or re-enable tooltip function

## v1.3.0

_Dec 22, 2019_
- :bug: minor bug fix to style regexes
- :bug: updated eslint to address dev vulnerability
- :bug: fixed lodash dev dependency vulnerability

## v1.2.4

_Jul 13, 2019_
- :bug: fixed dev dependency vulnerability in babel

## v1.2.3

_Jun 27, 2019_    
- :bug: fixed vulnerability in dependency yaml

## v1.2.2

_Jun 27, 2019_
- :bug: corrected bug in getRule
- :bug: updated eslint to fix vulnerability    

## v1.2.1

_Nov 29, 2018_  
- :bug: bug fix

## v1.2.0

_Nov 29, 2018_   
- :hammer_and_wrench: improved dynamic content changes

## v1.1.1

_Oct 26, 2018_
- :pencil:egregious typos
- :boom: added global option setting capability
- :bug: minor bug fix
- :boom: added the ability to retrieve fxToolTip object by DOM node id
    
## v1.0.13

_Oct 14, 2016_
- :bug: Reorganized distro and fixed a few bugs

## v1.0.12

_Sep 23, 2016_
- :pencil:Changed script name from publish to docs
- :hammer_and_wrench: Added install instructions
- :pencil:Fixed a typo
- :pencil:Clean up code example
- :hammer_and_wrench: Clean up of the repository    
- :hammer_and_wrench: Updated dev dependencies
- :hammer_and_wrench: reorganized repository, aded package.json and rollup.config.js

## v1.0.11

_Jun 30, 2016_
- :hammer_and_wrench: Merge branch 'master' of https://github.com/MichaelRFox/foxToolTip.js update

## v1.0.10

_Jun 29, 2016_   
- :pencil: Changed D3 links to d3.org
- :hammer_and_wrench: Added another demo bl.ock    
- :hammer_and_wrench: Added link to the D3 demo bl.ock

## v1.0.9

_Jun 28, 2016_
- :pencil: Starting to add some jsDoc

## v1.0.8

_Jun 24, 2016_
- :hammer_and_wrench: fixed directory   
- :bug: Removed debug code

## v1.0.7

_Jun 24, 2016_    
- :bug: Fixed logic error
- :bug: Fixed string literal error

## v1.0.6

_Jun 23, 2016_
- :hammer_and_wrench: Improved auto delete feature - works on IE
- :hammer_and_wrench: Added some tooltip text

## v1.0.5

_Jun 23, 2016_    
- :bug: fixed error in json file
- :hammer_and_wrench: deleted duplicate link

## v1.0.4

_Jun 22, 2016_    
- :hammer_and_wrench: Added tiger image file for index.html
- :hammer_and_wrench: Added d3 demo

## v1.0.3

_Jun 22, 2016_
- :boom: Added auto delete feature
- :hammer_and_wrench: created license.md

## v1.0.2

_Jun 20, 2016_
- :hammer_and_wrench: Just neatened things up a bit
- :bug: fixed issue with Opera getComputedStyle() inconsistency

## v1.0.1

_Jun 20, 2016_    
- :bug: updated default border radius
- :bug: fixed js source

## v1.0.0

_Jun 19, 2016_
- :hammer_and_wrench: initial commit