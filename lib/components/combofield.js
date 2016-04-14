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

var _messages4 = require('../lang/messages');

var _messages5 = _interopRequireDefault(_messages4);

var _reactPropersearch = require('react-propersearch');

var _reactPropersearch2 = _interopRequireDefault(_reactPropersearch);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDefaultProps() {
	return {
		maxHeight: 100, // Then scroll
		maxSelection: 200,
		secondaryDisplay: null, // To use when displayField is a function. Can be the name of a field or other function
		data: [],
		messages: _messages5['default'],
		lang: 'ENG',
		defaultSelection: [],
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
		afterSelect: null // Function
	};
}

var ComboField = function (_React$Component) {
	_inherits(ComboField, _React$Component);

	function ComboField(props) {
		_classCallCheck(this, ComboField);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComboField).call(this, props));

		_this.state = {
			selectedData: null,
			selection: _this.props.defaultSelection,
			uniqueId: _underscore2['default'].uniqueId('comboField_'),
			secondaryDisplay: _this.props.secondaryDisplay,
			show: false
		};
		return _this;
	}

	_createClass(ComboField, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

			if (this.props.secondaryDisplay != nextProps.secondaryDisplay) {
				var fieldsSet = new Set(_underscore2['default'].keys(nextProps.data[0]));
				var _messages = this.props.messages[this.props.lang];

				// Change secondaryDisplay but that field doesn't exist in the data
				if (!fieldsSet.has(nextProps.secondaryDisplay)) {
					console.error(_messages.errorSecondaryDisplay + ' ' + nextProps.secondaryDisplay + ' ' + _messages.errorData);
				} else {
					this.setState({
						secondaryDisplay: nextProps.secondaryDisplay
					});
				}

				return false;
			}

			return somethingChanged;
		}
	}, {
		key: 'afterSelect',
		value: function afterSelect(data, selection) {
			this.setState({
				selectedData: data,
				selection: selection
			}, this.sendSelection(data, selection));
		}
	}, {
		key: 'sendSelection',
		value: function sendSelection(data, selection) {
			if (typeof this.props.afterSelect == 'function') {
				this.props.afterSelect.call(this, data, selection);
			}
		}
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
	}, {
		key: 'addNewItems',
		value: function addNewItems(e) {
			e.preventDefault();

			this.setState({
				show: !this.state.show
			});
		}
	}, {
		key: 'onRemoveElement',
		value: function onRemoveElement() {
			var _this2 = this;

			var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var e = arguments[1];

			e.preventDefault();

			var selection = _underscore2['default'].clone(this.state.selection),
			    data = _underscore2['default'].clone(this.state.selectedData),
			    index = 0;

			if (!_underscore2['default'].isNull(id)) {
				_underscore2['default'].each(data, function (element) {
					if (element[_this2.props.idField] == id) index = data.indexOf(element);
				});

				data.splice(index, 1);
				selection.splice(selection.indexOf(id.toString()), 1);
			} else {
				data = [];
				selection = [];
			}

			this.setState({
				selectedData: data,
				selection: selection
			});
		}
	}, {
		key: 'getContent',
		value: function getContent() {
			var search = null,
			    placeholder = this.props.placeholder;

			if (_underscore2['default'].isNull(placeholder)) {
				placeholder = this.props.messages[this.props.lang].placeholder;
			}

			search = _react2['default'].createElement(_reactPropersearch2['default'], {
				key: this.state.uniqueId + '-content-Search',
				className: this.props.searchClassName,
				data: this.props.data,
				messages: this.props.messages,
				idField: this.props.idField,
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
				afterSelect: this.afterSelect.bind(this)
			});

			return search;
		}
	}, {
		key: 'getList',
		value: function getList() {
			var _this3 = this;

			var data = this.state.selectedData,
			    list = [],
			    display = null,
			    item = undefined,
			    size = 0;

			if (data) size = data.length;

			if (this.props.data.length == size) {
				var _messages2 = this.props.messages[this.props.lang];

				item = _react2['default'].createElement(
					'div',
					{ key: 'datalist-element-1', className: 'proper-combo-virtualField-list-element' },
					_react2['default'].createElement(
						'span',
						null,
						_messages2.allData + ' (' + size + ')'
					),
					_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: this.onRemoveElement.bind(this, null) })
				);

				list.push(item);
			} else if (size > this.props.maxSelection) {
				var _messages3 = this.props.messages[this.props.lang];

				item = _react2['default'].createElement(
					'div',
					{ key: 'datalist-element-1', className: 'proper-combo-virtualField-list-element' },
					_react2['default'].createElement(
						'span',
						null,
						size + ' ' + _messages3.dataToBig
					),
					_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: this.onRemoveElement.bind(this, null) })
				);

				list.push(item);
			} else {
				_underscore2['default'].each(data, function (element, index) {
					if (!_underscore2['default'].isNull(_this3.props.secondaryDisplay)) {
						display = element[_this3.props.secondaryDisplay];
					} else {
						display = element[_this3.props.displayField];
					}

					if (typeof display == 'function') {
						display = display(element);
					}

					item = _react2['default'].createElement(
						'div',
						{ key: 'datalist-element-' + index, className: 'proper-combo-virtualField-list-element' },
						_react2['default'].createElement(
							'span',
							null,
							display
						),
						_react2['default'].createElement('i', { 'aria-hidden': 'true', className: 'fa fa-times proper-combo-virtualField-list-element-delete', onClick: _this3.onRemoveElement.bind(_this3, element[_this3.props.idField]) })
					);

					list.push(item);
				});
			}

			return list;
		}
	}, {
		key: 'render',
		value: function render() {
			var content = this.getContent(),
			    elementsList = this.getList(),
			    className = "proper-combo",
			    contentClass = "proper-combo-content";
			var maxHeight = this.props.maxHeight;

			if (this.props.className) {
				className += ' ' + this.props.className;
			}

			if (!this.state.show) {
				content = null;
			}

			return _react2['default'].createElement(
				'div',
				{ key: this.state.uniqueId, className: className },
				_react2['default'].createElement(
					'div',
					{ key: this.state.uniqueId + '-field', className: 'proper-combo-virtual' },
					_react2['default'].createElement(
						'div',
						{ key: this.state.uniqueId + '-fieldllist', className: 'proper-combo-virtualField', ref: this.state.uniqueId + '_fieldllist', style: { maxHeight: maxHeight }, onClick: this.onVirtualClick.bind(this) },
						_react2['default'].createElement(
							_react2['default'].addons.CSSTransitionGroup,
							{
								key: this.state.uniqueId + '-fieldllist-elements',
								className: 'proper-combo-virtualField-list',
								transitionName: 'list',
								component: 'ul',
								transitionEnterTimeout: 250,
								transitionLeaveTimeout: 250 },
							elementsList
						)
					),
					_react2['default'].createElement(
						'button',
						{ className: "proper-combo-virtualField-add", onClick: this.addNewItems.bind(this) },
						_react2['default'].createElement('i', { className: 'fa fa-chevron-down' })
					)
				),
				_react2['default'].createElement(
					_react2['default'].addons.CSSTransitionGroup,
					{
						key: this.state.uniqueId + '-content',
						className: contentClass,
						transitionName: 'content',
						component: 'div',
						transitionAppear: true,
						transitionAppearTimeout: 400,
						transitionEnterTimeout: 400,
						transitionLeaveTimeout: 400 },
					content
				)
			);
		}
	}]);

	return ComboField;
}(_react2['default'].Component);

ComboField.defaultProps = getDefaultProps();

exports['default'] = ComboField;
module.exports = exports['default'];