"use strict";

var _combofield = require("../combofield");

var _combofield2 = _interopRequireDefault(_combofield);

var _reactAddonsTestUtils = require("react-addons-test-utils");

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = require("jquery");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ComboSearch', function () {
	it('is available', function () {
		expect(_combofield2["default"]).not.toBe(null);
	});

	it('display propersearch', function () {
		var component = null,
		    node = null,
		    nodeBtn = null,
		    nodeElements = null,
		    props = getProps();

		props.defaultSelection = null;
		component = prepare(props);
		node = _reactAddonsTestUtils2["default"].findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		nodeBtn = _reactAddonsTestUtils2["default"].findRenderedDOMComponentWithClass(component, "proper-combo-virtualField-add");
		nodeElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		expect(nodeElements.length).toBe(0);

		// Open Combo
		_reactAddonsTestUtils2["default"].Simulate.click(node);
		nodeElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		expect(nodeElements.length).not.toBe(0); // Showing 9
		expect(component.state.show).toBe(true);

		// Close Combo
		_reactAddonsTestUtils2["default"].Simulate.click(node);
		expect(component.state.show).toBe(false);

		// Open Combo with button (right side)
		_reactAddonsTestUtils2["default"].Simulate.click(nodeBtn);
		expect(component.state.show).toBe(true);

		// Close Combo with button (right side)
		_reactAddonsTestUtils2["default"].Simulate.click(nodeBtn);
		expect(component.state.show).toBe(false);
	});

	it('elements rendered in virtual field', function () {
		var nodeElements = undefined,
		    props = getProps(),
		    component = prepare(props);

		// By default should be 3
		nodeElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element");
		expect(nodeElements.length).toBe(3);
	});

	it('add  elements virtual field', function () {
		var component = null,
		    node = null,
		    virtualElements = null,
		    nodeElements = null,
		    props = getProps();

		props.multiSelect = true;
		props.defaultSelection = null;
		component = prepare(props);

		// Display
		node = _reactAddonsTestUtils2["default"].findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		_reactAddonsTestUtils2["default"].Simulate.click(node); // Open Combo

		// Add elements
		nodeElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element"); // Get elements to click
		_reactAddonsTestUtils2["default"].Simulate.click(nodeElements[0]);
		_reactAddonsTestUtils2["default"].Simulate.click(nodeElements[1]);
		_reactAddonsTestUtils2["default"].Simulate.click(nodeElements[2]);

		// Check Virtual field
		virtualElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element"); // Get elements in virtual field
		expect(virtualElements.length).toBe(3);
	});

	it('remove elements on virtual field', function (done) {
		var component = null,
		    removeNodes = null,
		    props = getProps(),
		    def = (0, _jquery.Deferred)();

		props.afterSelect = function (data, selection) {
			def.resolve(data, selection);
		};
		component = prepare(props);

		// Remove elements
		removeNodes = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element-delete"); // Get the remove icon of each
		_reactAddonsTestUtils2["default"].Simulate.click(removeNodes[0]); // Default 3 -> remove 1

		def.done(function (data, selection) {
			expect(selection.length).toBe(2);
			expect(data.length).toBe(2);
			expect(selection).toContain('item_998');
			expect(selection).toContain('item_1000');
			expect(data).toContain(props.data[0]); // 1000
		}).always(done);
	});

	it('remove elements clicking on propersearch', function (done) {
		var component = undefined,
		    nodeElements = undefined,
		    node = undefined,
		    props = getProps(),
		    def = (0, _jquery.Deferred)();

		props.afterSelect = function (data, selection) {
			def.resolve(data, selection);
		};
		component = prepare(props);

		// Open Combo
		node = _reactAddonsTestUtils2["default"].findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		_reactAddonsTestUtils2["default"].Simulate.click(node);

		// Remove elements
		nodeElements = _reactAddonsTestUtils2["default"].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element"); // Get elements to click
		_reactAddonsTestUtils2["default"].Simulate.click(nodeElements[2]); // Default 3 -> remove 1. Remove third element (1000-999-[998])

		def.done(function (data, selection) {
			expect(selection.length).toBe(2);
			expect(data.length).toBe(2);
			expect(selection).toContain('item_999');
			expect(selection).toContain('item_1000');
			expect(data).toContain(props.data[1]); // 999
		}).always(done);
	});

	it('update props', function () {
		var removeNodes = undefined,
		    props = getProps(),
		    component = undefined,
		    wrapper = document.createElement('div'),
		    data = [];
		component = _reactDom2["default"].render(_react2["default"].createElement(_combofield2["default"], props), wrapper);

		// Update props set default selection with 2 elements
		for (var i = 500; i > 0; i--) {
			data.push({ frt: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values' });
		}
		props.data = data;
		props.idField = 'frt', props.defaultSelection = ['item_499', 'item_38', 'item_955', 'item_1000'];
		component = _reactDom2["default"].render(_react2["default"].createElement(_combofield2["default"], props), wrapper);

		// The selected data should be 2 because 1000 / 955 doesn't exist in the new data array
		expect(component.state.selectedData.length).toBe(2);
	});
});

function prepare(props) {
	return _reactAddonsTestUtils2["default"].renderIntoDocument(_react2["default"].createElement(_combofield2["default"], props));
}

function formater(listElement) {
	return _react2["default"].createElement(
		"button",
		{ className: "btn btn-default" },
		listElement.name
	);
}

function getProps() {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

	var data = [];

	for (var i = length; i > 0; i--) {
		data.push({ itemID: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values' });
	};

	return {
		data: data,
		idField: 'itemID',
		defaultSelection: ['item_999', 'item_998', 'item_1000'],
		displayField: 'display',
		filterField: 'name',
		multiSelect: true,
		listWidth: 100,
		listHeight: 100,
		maxHeight: 100, // virtual field then scroll
		maxSelection: 300, // max elements in the virtual field
		uniqueId: 'combo'
	};
}