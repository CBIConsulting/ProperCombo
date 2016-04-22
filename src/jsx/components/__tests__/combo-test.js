import Combo from "../combofield";
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import {Deferred} from 'jquery';

describe('ComboSearch', () => {
	it('is available', () => {
		expect(Combo).not.toBe(null);
	});

	it('display propersearch', () => {
		let component = null, node = null, nodeBtn = null, nodeElements = null, props = getProps();

		props.defaultSelection = null;
		component = prepare(props);
		node = TestUtils.findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		nodeBtn = TestUtils.findRenderedDOMComponentWithClass(component, "proper-combo-virtualField-add");
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		expect(nodeElements.length).toBe(0);

		// Open Combo
		TestUtils.Simulate.click(node);
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		expect(nodeElements.length).not.toBe(0); // Showing 9
		expect(component.state.show).toBe(true);

		// Close Combo
		TestUtils.Simulate.click(node);
		expect(component.state.show).toBe(false);

		// Open Combo with button (right side)
		TestUtils.Simulate.click(nodeBtn);
		expect(component.state.show).toBe(true);

		// Close Combo with button (right side)
		TestUtils.Simulate.click(nodeBtn);
		expect(component.state.show).toBe(false);
	});

	it('elements rendered in virtual field', () => {
		let nodeElements, props = getProps(), component = prepare(props);

		// By default should be 3
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element");
		expect(nodeElements.length).toBe(3);
	});

	it('add  elements virtual field', () => {
		let component = null, node = null, virtualElements = null, nodeElements = null, props = getProps();

		props.multiSelect = true;
		props.defaultSelection = null;
		component = prepare(props);

		// Display
		node = TestUtils.findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		TestUtils.Simulate.click(node); // Open Combo

		// Add elements
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element"); // Get elements to click
		TestUtils.Simulate.click(nodeElements[0]);
		TestUtils.Simulate.click(nodeElements[1]);
		TestUtils.Simulate.click(nodeElements[2]);

		// Check Virtual field
		virtualElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element"); // Get elements in virtual field
		expect(virtualElements.length).toBe(3);
	});

	it('remove elements on virtual field', (done) => {
		let component = null, removeNodes = null, props = getProps(), def = Deferred();

		props.afterSelect = (data, selection) => {
			def.resolve(data, selection);
		}
		component = prepare(props);

		// Remove elements
		removeNodes = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-combo-virtualField-list-element-delete"); // Get the remove icon of each
		TestUtils.Simulate.click(removeNodes[0]); // Default 3 -> remove 1

		def.done((data, selection) => {
			expect(selection.length).toBe(2);
			expect(data.length).toBe(2);
			expect(selection).toContain('item_998');
			expect(selection).toContain('item_1000');
			expect(data).toContain(props.data[0]) // 1000
		}).always(done);
	});

	it('remove elements clicking on propersearch', (done) => {
		let component, nodeElements, node, props = getProps(), def = Deferred();

		props.afterSelect = (data, selection) => {
			def.resolve(data, selection);
		}
		component = prepare(props);

		// Open Combo
		node = TestUtils.findRenderedDOMComponentWithClass(component, "proper-combo-virtualField");
		TestUtils.Simulate.click(node);

		// Remove elements
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element"); // Get elements to click
		TestUtils.Simulate.click(nodeElements[2]); // Default 3 -> remove 1. Remove third element (1000-999-[998])

		def.done((data, selection) => {
			expect(selection.length).toBe(2);
			expect(data.length).toBe(2);
			expect(selection).toContain('item_999');
			expect(selection).toContain('item_1000');
			expect(data).toContain(props.data[1]) // 999
		}).always(done);
	});


	it('update props', () => {
		let removeNodes, props = getProps(), component, wrapper = document.createElement('div'), data = [];
		component = ReactDOM.render(<Combo {...props} />, wrapper);

		// Update props set default selection with 2 elements
		for (let i = 500; i > 0; i--) {
			data.push({frt: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values'});
		}
		props.data = data;
		props.idField = 'frt',

		props.defaultSelection = ['item_499', 'item_38', 'item_955', 'item_1000']
		component = ReactDOM.render(<Combo {...props} />, wrapper);

		// The selected data should be 2 because 1000 / 955 doesn't exist in the new data array
		expect(component.state.selectedData.length).toBe(2);
	});
});


function prepare(props) {
	return TestUtils.renderIntoDocument(<Combo {...props} />);
}

function formater(listElement) {
	return <button className ="btn btn-default">{ listElement.name }</button>;
}

function getProps(length = 1000) {
	let data = [];

	for (let i = length; i > 0; i--) {
		data.push({itemID: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values'});
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
	}
}