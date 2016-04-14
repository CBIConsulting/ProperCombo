# ProperCombo
A virtual field that show a ProperSearch component (https://github.com/CBIConsulting/ProperSearch) and display the selected items in boxes inside the field

[![Build Status](https://travis-ci.org/CBIConsulting/ProperCombo.svg)](https://travis-ci.org/CBIConsulting/ProperCombo)

Used technologies:

- React
- ES6
- Webpack
- Babel
- Node
- Compass
- Jasmine
- Karma


Features of ProperCombo:

* Data selection allowed from a list
* List filtering on search
* Allow multi and single selection
* Return the selection
* List virtual rendered


The compile and compressed ProperCombo distribution file can be found in the dist folder along with the css file. Add the default stylesheet `dist/propercombo.min.css`, then import it into any module.

## Live Demo
http://cbiconsulting.github.io/ProperCombo/

## External dependencies
* React and React DOM
* Underscore


## Preview
![screen shot 2016-04-14 at 18 45 00] (examples/screenshots/example_screenshoot.png "Example of ProperCombo with multiselect")

## Use this module in your projects
```
npm install react-propercombo --save
```

## How to start

Run:
```
npm install
npm start
```

Check your http://localhost:8080/ or  `open http://localhost:8080/`

## How to test

`npm test`

### Component properties
This module has the same properties as ProperSearch component (https://github.com/CBIConsulting/ProperSearch) and...
maxHeight: Max. height of the virtual field when it receive new elements, after overcome the max height a scroll bar will appear (Number) Default 100 (px)
maxSelection: Max. elements rendered inside the virtual field, after this number of elements if the user select more elements the virtual field will show a item with the number of selected elements (Integer) Default 200
secondaryDisplay: Field that will be used to render the items inside the virtual field. It you don't set this field then the field used will be the display field (String) Default 'label'

### Basic Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Combo from 'react-propercombo';

// Function Called after select items in the list.

const afterSelect = (data, selection) => {
	console.info(data);
	console.info(selection);
}

// List data
const data = [];

for (var i = 10000; i >= 0; i--) {
	data.push({value: 'item-' + i, label: 'Item ' + i});
}

// Render the Search component
ReactDOM.render(
	<Combo
		data={data}
		multiSelect={true}
		afterSelect={afterSelect}
	/>,
	document.getElementById('example')
);
```


Contributions
------------

Use [GitHub issues](https://github.com/CBIConsulting/ProperCombo/issues) for requests.

Changelog
---------

Changes are tracked as [GitHub releases](https://github.com/CBIConsulting/ProperCombo/releases).
