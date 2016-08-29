'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _messages2 = require('../lang/messages');

var _messages3 = _interopRequireDefault(_messages2);

var _reactPropersearch = require('react-propersearch');

var _reactPropersearch2 = _interopRequireDefault(_reactPropersearch);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Set = require('es6-set');

function getDefaultProps() {
	return {
		maxHeight: 100, // Then scroll
		maxSelection: 200,
		secondaryDisplay: null, // To use when displayField is a function. Can be the name of a field or other function
		data: [],
		rawdata: null, // Case you want to use your own inmutable data. Read prepareData() method for more info. (ProperSearch)
		indexed: null, // Case you want to use your own inmutable data. Read prepareData() method for more info.
		messages: _messages3['default'],
		lang: 'ENG',
		defaultSelection: [],
		hiddenSelection: [],
		multiSelect: false,
		listWidth: null,
		listHeight: 200,
		listRowHeight: 26,
		searchFieldClass: null,
		listClass: null,
		listElementClass: null,
		searchClassName: null,
		className: null,
		placeholder: null,
		searchIcon: 'fa fa-search fa-fw',
		clearIcon: 'fa fa-times fa-fw',
		throttle: 160, // milliseconds
		minLength: 3,
		defaultSearch: null,
		autoComplete: 'off',
		idField: 'value',
		displayField: 'label',
		listShowIcon: true,
		filter: null, // Optional function (to be used when the displayField is an function too)
		filterField: null, // By default it will be the displayField
		afterSelect: null, // Function
		uniqueId: _underscore2['default'].uniqueId('comboField_'),
		allowsEmptySelection: false };
}

/**
 * A virtual field that show a ProperSearch component (https://github.com/CBIConsulting/ProperSearch) and display the selected items in boxes inside the field
 *
 * Simple example usage:
 *
 * 	let data = [];
 * 	data.push({
 *	  	value: 1,
 *	  	label: 'Apple'
 * 	});
 *
 *	let afterSelect = (data, selection) => {
 *		console.info(data);
 *		console.info(selection);
 *	}
 *
 * 	<ComboField
 *		data={data}
 *		afterSelect={afterSelect}
 *	/>
 * ```
 */
// Put this to true to get a diferent ToolBar that allows select empty

var ComboField = function (_React$Component) {
	_inherits(ComboField, _React$Component);

	function ComboField(props) {
		_classCallCheck(this, ComboField);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComboField).call(this, props));

		_this.state = {
			selectedData: null,
			selection: _this.props.defaultSelection,
			uniqueId: _this.props.uniqueId,
			secondaryDisplay: _this.props.secondaryDisplay,
			idField: _this.props.idField,
			show: false
		};
		return _this;
	}

	_createClass(ComboField, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var selection = this.state.selection,
			    data = undefined;
			if (!_underscore2['default'].isNull(selection) && selection.length > 0) {
				data = !_underscore2['default'].isArray(this.props.data) ? this.props.indexed : this.props.data;

				this.prepareData(selection, data, this.props.idField); // Update selectedData in component's state
			}
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

			if (propsChanged) {
				var dataChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props.data, nextProps.data);
				var idFieldChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props.idField, nextProps.idField);
				var selectionChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props.defaultSelection, nextProps.defaultSelection);
				var secondaryDisplayChanged = this.props.secondaryDisplay != nextProps.secondaryDisplay;
				var isInmutable = !_underscore2['default'].isArray(nextProps.data);

				if (dataChanged || idFieldChanged || selectionChanged || secondaryDisplayChanged) {
					if (dataChanged || idFieldChanged || selectionChanged) {
						var selection = selectionChanged ? nextProps.defaultSelection : this.state.selection;
						var data = dataChanged ? nextProps.data : this.props.data;
						var idField = idFieldChanged ? nextProps.idField : this.props.idField;
						var fieldsSet = !isInmutable ? new Set(_underscore2['default'].keys(data[0])) : new Set(_underscore2['default'].keys(data.get(0).toJSON()));

						if (!fieldsSet.has(nextProps.idField)) idField = this.props.idField;

						if (_underscore2['default'].isNull(selection) || _underscore2['default'].isNull(data)) {
							this.setState({
								selection: selection,
								idField: idField
							});
						} else {
							if (isInmutable && this.props.indexed) data = this.props.indexed;
							this.prepareData(selection, data, idField, isInmutable);
						}
					}

					// If the secondary display change then check if that field
					if (secondaryDisplayChanged) {
						var _fieldsSet = !isInmutable ? new Set(_underscore2['default'].keys(nextProps.data[0])) : new Set(_underscore2['default'].keys(nextProps.data.get(0).toJSON()));
						var messages = this.props.messages[this.props.lang];

						// Change secondaryDisplay, check if the field doesn't exist in the data and then throw an error msg or update the value
						if (!_fieldsSet.has(nextProps.secondaryDisplay) && typeof nextProps.secondaryDisplay != 'function') {
							console.error(messages.errorSecondaryDisplay + ' ' + nextProps.secondaryDisplay + ' ' + messages.errorData);
						} else {
							this.setState({
								secondaryDisplay: nextProps.secondaryDisplay
							});
						}
					}

					return false;
				}
			}

			return somethingChanged;
		}
	}, {
		key: 'prepareData',
		value: function prepareData(selection, newData, idField) {
			var _this2 = this;

			var isInmutable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

			if (!_underscore2['default'].isNull(selection) && !_underscore2['default'].isNull(newData)) {
				(function () {
					var data = newData,
					    selectedData = [],
					    dataKeys = undefined;

					if (!isInmutable) data = _underscore2['default'].indexBy(newData, idField);
					dataKeys = new Set(_underscore2['default'].keys(data));

					if (_underscore2['default'].isArray(selection)) {
						selection.forEach(function (element) {
							if (dataKeys.has(element.toString())) {
								selectedData.push(data[element]);
							}
						});
					} else if (typeof selection === 'string') {
						if (dataKeys.has(selection)) {
							selectedData.push(data[selection]);
						}
					}

					_this2.setState({
						selectedData: selectedData,
						selection: selection,
						idField: idField
					});
				})();
			}
		}

		/**
   * Function called each time the selection has changed. Apply an update in the components state then render again an update the child and
   * send the selection and the selected data to a function in props which name is the same (if exist)
   *
   * @param (Array)	selection 	The selected elements using the idField of data.
   * @param (Array)	data 		The selected data
   */

	}, {
		key: 'afterSelect',
		value: function afterSelect(data, selection) {
			var selectionChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state.selection, selection);

			if (selectionChanged) {
				this.setState({
					selectedData: data,
					selection: selection
				}, this.sendSelection(data, selection));
			}
		}

		/**
   * Send the selection and the selected data to a function in props which name is the afterSelect() (if exist)
   *
   * @param (Set)		selection 	The selected values using the values of the selected data.
   * @param (Array)	data 		The selected data
   */

	}, {
		key: 'sendSelection',
		value: function sendSelection(data, selection) {
			if (typeof this.props.afterSelect == 'function') {
				this.props.afterSelect.call(this, data, selection);
			}
		}

		/**
   * Function called when the someone click in the empty part of the virtual field. Change the `show´ state of the
   * component.
   *
   * @param (Object)	e 	Event which call this function
   */

	}, {
		key: 'onVirtualClick',
		value: function onVirtualClick(e) {
			e.preventDefault();
			if (e.target.className == 'proper-combo-virtualField' || e.target.className == 'proper-combo-virtualField-list') {
				this.setState({
					show: !this.state.show
				});
			}
		}

		/**
   * Function called when the someone click to the icon in the right of the virtual field. Change the `show´ state of the
   * component.
   *
   * @param (Object)	e 	Event which call this function
   */

	}, {
		key: 'addNewItems',
		value: function addNewItems(e) {
			e.preventDefault();

			this.setState({
				show: !this.state.show
			});
		}

		/**
   * Function called when the someone click in the close btn inside each element of the virtual field (selected elements).
   * Remove's the element from the selection and data arrays.
   *
   * @param (Integer)	id 	Id of the element which has to be removed from the virtual field. If it's null that means
   *						to many selected or all selected (then unSelect all)
   * @param (Object)	e 	Event which call the function
   */

	}, {
		key: 'onRemoveElement',
		value: function onRemoveElement() {
			var _this3 = this;

			var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var e = arguments[1];

			e.preventDefault();

			var selection = _underscore2['default'].clone(this.state.selection),
			    data = _underscore2['default'].clone(this.state.selectedData),
			    index = 0;

			// Not all selected or to many elements selected
			if (!_underscore2['default'].isNull(id)) {
				if (selection.length > 0) {
					// Find the index of the element
					_underscore2['default'].each(data, function (element) {
						if (element[_this3.props.idField] == id) index = data.indexOf(element);
					});

					// Then remove it
					data.splice(index, 1);
					selection.splice(selection.indexOf(id.toString()), 1);
				}
			} else {
				data = [];
				selection = [];
			}

			this.setState({
				selectedData: data,
				selection: selection
			}, this.sendSelection(data, selection));
		}

		/**
   * Build the ProperSearch component to be rendered
   *
   * @return (Search) search The built ProperSearch component with all it's props set up.
   */

	}, {
		key: 'getContent',
		value: function getContent() {
			var CSSTransition = process.env.NODE_ENV === 'Test' ? null : _react2['default'].addons.CSSTransitionGroup;
			var search = null,
			    placeholder = this.props.placeholder,
			    contentClass = "proper-combo-content";

			if (_underscore2['default'].isNull(placeholder)) {
				placeholder = this.props.messages[this.props.lang].placeholder;
			}

			search = _react2['default'].createElement(_reactPropersearch2['default'], {
				key: this.state.uniqueId + '-content-Search',
				className: this.props.searchClassName,
				data: this.props.data,
				indexed: this.props.indexed,
				rawdata: this.props.rawdata,
				messages: this.props.messages,
				idField: this.state.idField,
				displayField: this.props.displayField,
				lang: this.props.lang,
				filter: this.props.filter,
				autoComplete: this.props.autoComplete,
				searchIcon: this.props.searchIcon,
				clearIcon: this.props.clearIcon,
				throttle: this.props.throttle,
				minLength: this.props.minLength,
				fieldClass: this.props.searchFieldClass,
				listClass: this.props.listClass,
				listElementClass: this.props.listElementClass,
				listWidth: this.props.listWidth,
				listHeight: this.props.listHeight,
				listRowHeight: this.props.listRowHeight,
				multiSelect: this.props.multiSelect,
				defaultSelection: this.state.selection,
				defaultSearch: this.props.defaultSearch,
				placeholder: placeholder,
				listShowIcon: this.props.listShowIcon,
				filterField: this.props.filterField,
				afterSelect: this.afterSelect.bind(this),
				allowsEmptySelection: this.props.allowsEmptySelection,
				hiddenSelection: this.props.hiddenSelection
			});

			if (CSSTransition) {
				return _react2['default'].createElement(
					CSSTransition,
					{
						key: this.state.uniqueId + '-content',
						className: contentClass,
						transitionName: 'content',
						component: 'div',
						transitionAppear: true,
						transitionAppearTimeout: 400,
						transitionEnterTimeout: 400,
						transitionLeaveTimeout: 400 },
					search
				);
			} else {
				// Test - No Animations
				return _react2['default'].createElement(
					'div',
					{ key: this.state.uniqueId + '-content', className: contentClass },
					' ',
					search,
					' '
				);
			}
		}

		/**
   * Build the list of elements inside the virtual field. Each element is a div with a span inside which has the display field
   * of the selected element and an icon to remove it.
   *
   * @return (Array)	list 	Array of elements to be rendered inside the virtual field
   */

	}, {
		key: 'getList',
		value: function getList() {
			var _this4 = this;

			var CSSTransition = process.env.NODE_ENV === 'Test' ? null : _react2['default'].addons.CSSTransitionGroup;
			var data = this.state.selectedData,
			    list = [],
			    display = null,
			    item = undefined,
			    size = 0,
			    dataLength = undefined;

			if (data) size = data.length;
			dataLength = !_underscore2['default'].isArray(this.props.data) ? this.props.data.size : this.props.data.length;

			// If all selected then the list will have just one item / element with the size
			if (dataLength == size && size > 20) {
				var messages = this.props.messages[this.props.lang];

				item = _react2['default'].createElement(
					'li',
					{ key: 'datalist-element-0', className: 'proper-combo-virtualField-list-element' },
					_react2['default'].createElement(
						'span',
						{ key: 'msg-0' },
						messages.allData + ' (' + size + ')'
					),
					_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: this.onRemoveElement.bind(this, null) })
				);

				list.push(item);
			} else if (size > this.props.maxSelection) {
				// If there are more selected elements than the limit (default 200)
				var _messages = this.props.messages[this.props.lang];

				// Just one element with the number of selected elements and a message.
				item = _react2['default'].createElement(
					'li',
					{ key: 'datalist-element-0', className: 'proper-combo-virtualField-list-element' },
					_react2['default'].createElement(
						'span',
						{ key: 'msg-0' },
						size + ' ' + _messages.dataToBig
					),
					_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: this.onRemoveElement.bind(this, null) })
				);

				list.push(item);
			} else {
				// Between 1 element selected and all elements - 1 or maxSelection -1. Build the array of elements using to display the field of data which name is in
				// props.secondaryDisplay or in props.displayField if the first doesn't exist.
				_underscore2['default'].each(data, function (element, index) {
					if (!_underscore2['default'].isNull(_this4.props.secondaryDisplay)) {
						display = element[_this4.props.secondaryDisplay];
					} else {
						display = element[_this4.props.displayField];
					}

					// If that props contain a function then call it sending the entire element data
					if (typeof display == 'function') {
						display = display(element);
					}

					item = _react2['default'].createElement(
						'li',
						{ key: 'datalist-element-' + index, className: 'proper-combo-virtualField-list-element' },
						_react2['default'].createElement(
							'span',
							{ key: 'msg-' + index },
							display
						),
						_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: _this4.onRemoveElement.bind(_this4, element[_this4.props.idField]) })
					);

					list.push(item);
				});
			}
			if (CSSTransition) {
				return _react2['default'].createElement(
					CSSTransition,
					{
						key: this.state.uniqueId + '-fieldllist-elements',
						className: 'proper-combo-virtualField-list',
						transitionName: 'list',
						component: 'ul',
						transitionEnterTimeout: 250,
						transitionLeaveTimeout: 250 },
					list
				);
			} else {
				return _react2['default'].createElement(
					'ul',
					{ key: this.state.uniqueId + '-fieldllist-elements', className: 'proper-combo-virtualField-list' },
					' ',
					list,
					' '
				);
			}

			return list;
		}
	}, {
		key: 'render',
		value: function render() {
			var content = this.getContent(),
			    elementsList = this.getList(),
			    className = "proper-combo",
			    maxHeight = this.props.maxHeight;

			if (this.props.className) {
				className += ' ' + this.props.className;
			}

			if (!this.state.show) {
				content = null;
			}

			// CSSTransitionGroups for animations Content and List
			return _react2['default'].createElement(
				'div',
				{ key: this.state.uniqueId, className: className },
				_react2['default'].createElement(
					'div',
					{ key: this.state.uniqueId + '-field', className: 'proper-combo-virtual' },
					_react2['default'].createElement(
						'div',
						{ key: this.state.uniqueId + '-fieldllist', className: 'proper-combo-virtualField', ref: this.state.uniqueId + '_fieldllist', style: { maxHeight: maxHeight }, onClick: this.onVirtualClick.bind(this) },
						elementsList
					),
					_react2['default'].createElement(
						'button',
						{ className: 'proper-combo-virtualField-add', onClick: this.addNewItems.bind(this) },
						_react2['default'].createElement('i', { className: 'fa fa-chevron-down' })
					)
				),
				content
			);
		}
	}]);

	return ComboField;
}(_react2['default'].Component);

ComboField.defaultProps = getDefaultProps();

exports['default'] = ComboField;
module.exports = exports['default'];