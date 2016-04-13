'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _messages = require('../lang/messages');

var _messages2 = _interopRequireDefault(_messages);

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
		data: [],
		messages: _messages2['default'],
		lang: 'ENG',
		defaultSelection: null,
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
			uniqueId: _underscore2['default'].uniqueId('comboField-'),
			show: false,
			items: ['Start from here']
		};
		return _this;
	}

	_createClass(ComboField, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

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
			console.log(e.target);
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
		value: function onRemoveElement(id, e) {
			var _this2 = this;

			e.preventDefault();

			var selection = _underscore2['default'].clone(this.state.selection),
			    data = _underscore2['default'].clone(this.state.selectedData),
			    index = 0;

			_underscore2['default'].each(data, function (element) {
				if (element[_this2.props.idField] == id) index = data.indexOf(element);
			});

			data.splice(index, 1);
			selection.splice(selection.indexOf(id.toString()), 1);

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
			    item = undefined;

			_underscore2['default'].each(data, function (element, index) {
				item = _react2['default'].createElement(
					'div',
					{ key: 'datalist-element-' + index, className: 'proper-combo-virtualField-list-element' },
					_react2['default'].createElement(
						'span',
						null,
						element[_this3.props.displayField]
					),
					_react2['default'].createElement(
						'span',
						{ className: 'proper-combo-virtualField-list-element-delete' },
						_react2['default'].createElement(
							'svg',
							{ viewBox: '0 0 40 40', className: 'list-element-delete-icon', onClick: _this3.onRemoveElement.bind(_this3, element[_this3.props.idField]) },
							_react2['default'].createElement('path', { className: 'list-element-delete-icon-stroke', d: 'M 12,12 L 28,28 M 28,12 L 12,28' })
						)
					)
				);
				list.push(item);
			});

			return list;
		}
	}, {
		key: 'saveAndContinue',
		value: function saveAndContinue(e) {
			e.preventDefault();
			this.setState({ items: this.state.items.concat([Date.now()]) });
		}
	}, {
		key: 'render',
		value: function render() {
			var content = this.getContent(),
			    elementsList = this.getList(),
			    className = "proper-combo",
			    contentClass = "proper-combo-content";

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
						{
							key: this.state.uniqueId + '-fieldllist',
							style: { maxHeight: this.props.maxHeight + ' !important' },
							className: 'proper-combo-virtualField',
							ref: this.state.uniqueId + '-fieldllist',
							onClick: this.onVirtualClick.bind(this) },
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