import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import messages from "../lang/messages";
import Search from "react-propersearch";
import {shallowEqualImmutable} from 'react-immutable-render-mixin';

function getDefaultProps() {
	return {
		maxHeight: 100, // Then scroll
		maxSelection: 200,
		secondaryDisplay: null, // To use when displayField is a function. Can be the name of a field or other function
		data: [],
		messages: messages,
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
	}
}

class ComboField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedData: null,
			selection: this.props.defaultSelection,
			uniqueId: _.uniqueId('comboField_'),
			secondaryDisplay: this.props.secondaryDisplay,
			show: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		let stateChanged = !shallowEqualImmutable(this.state, nextState);
		let propsChanged = !shallowEqualImmutable(this.props, nextProps);
		let somethingChanged = propsChanged || stateChanged;

		if (this.props.secondaryDisplay != nextProps.secondaryDisplay) {
			let fieldsSet = new Set(_.keys(nextProps.data[0]));
			let messages = this.props.messages[this.props.lang];

			// Change secondaryDisplay but that field doesn't exist in the data
			if (!fieldsSet.has(nextProps.secondaryDisplay)) {
				console.error(messages.errorSecondaryDisplay + ' ' + nextProps.secondaryDisplay + ' ' + messages.errorData);
			} else {
				this.setState({
					secondaryDisplay: nextProps.secondaryDisplay
				});
			}

			return false;
		}

		return somethingChanged;
	}

 	afterSelect(data, selection) {
		this.setState({
			selectedData: data,
			selection: selection
		}, this.sendSelection(data,selection));
	}

	sendSelection(data, selection) {
		if (typeof this.props.afterSelect == 'function') {
			this.props.afterSelect.call(this, data, selection);
		}
	}

	onVirtualClick(e) {
		e.preventDefault();
		if (e.target.className == 'proper-combo-virtualField' || e.target.className == 'proper-combo-virtualField-list') {
			this.setState({
				show: !this.state.show
			});
		}
	}

	addNewItems(e) {
		e.preventDefault();

		this.setState({
			show: !this.state.show
		});
	}

	onRemoveElement(id = null, e) {
		e.preventDefault();

		let selection = _.clone(this.state.selection), data = _.clone(this.state.selectedData), index = 0;

		if (!_.isNull(id)) {
			_.each(data, element => {
				if (element[this.props.idField] == id) index = data.indexOf(element);
			});

			data.splice(index,1);
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

	getContent() {
		let search = null, placeholder = this.props.placeholder;

		if (_.isNull(placeholder)) {
			placeholder = this.props.messages[this.props.lang].placeholder;
		}

		search = <Search
			key={this.state.uniqueId+'-content-Search'}
			className={this.props.searchClassName}
			data={this.props.data}
			messages={this.props.messages}
			idField={this.props.idField}
			displayField={this.props.displayField}
			lang={this.props.lang}
			filter={this.props.filter}
			autoComplete={this.props.autoComplete}
			searchIcon={this.props.searchIcon}
			clearIcon={this.props.clearIcon}
			throttle={this.props.throttle}
			minLength={this.props.minLength}
			fieldClass={this.props.searchFieldClass}
			listClass={this.props.listClass}
			listElementClass={this.props.listElementClass}
			listWidth={this.props.listWidth}
			listHeight={this.props.listHeight}
			listRowHeight={this.props.listRowHeight}
			multiSelect={this.props.multiSelect}
			defaultSelection={this.state.selection}
			defaultSearch={this.props.defaultSearch}
			placeholder={placeholder}
			listShowIcon={this.props.listShowIcon}
			filterField={this.props.filterField}
			afterSelect={this.afterSelect.bind(this)}
		/>;

		return search;
	}

	getList() {
		let data = this.state.selectedData, list = [], display = null,item, size = 0;

		if (data) size = data.length;

		if (this.props.data.length == size) {
			let messages = this.props.messages[this.props.lang];

			item = (
				<div key={'datalist-element-1'} className="proper-combo-virtualField-list-element">
					<span>{messages.allData + ' (' + size + ')'}</span>
					<i aria-hidden="true" className="fa fa-times proper-combo-virtualField-list-element-delete" onClick={this.onRemoveElement.bind(this, null)}/>
				</div>
			);

			list.push(item);

		} else if (size > this.props.maxSelection) {
			let messages = this.props.messages[this.props.lang];

			item = (
				<div key={'datalist-element-1'} className="proper-combo-virtualField-list-element">
					<span>{size + ' ' + messages.dataToBig}</span>
					<i aria-hidden="true" className="fa fa-times proper-combo-virtualField-list-element-delete" onClick={this.onRemoveElement.bind(this, null)}/>
				</div>
			);

			list.push(item);

		} else {
			_.each(data, (element, index) => {
				if (!_.isNull(this.props.secondaryDisplay)) {
					display = element[this.props.secondaryDisplay];
				} else {
					display = element[this.props.displayField];
				}

				if (typeof display == 'function') {
					display = display(element);
				}

				item = (
					<div key={'datalist-element-' + index} className="proper-combo-virtualField-list-element">
						<span>{display}</span>
						<i aria-hidden="true" className="fa fa-times proper-combo-virtualField-list-element-delete" onClick={this.onRemoveElement.bind(this, element[this.props.idField])}/>
					</div>
				);

				list.push(item);
			});
		}

		return list;
	}

	render() {
		let	content = this.getContent(), elementsList = this.getList(), className = "proper-combo", contentClass = "proper-combo-content";
		let maxHeight = this.props.maxHeight;

		if (this.props.className) {
			className += ' ' + this.props.className;
		}

		if (!this.state.show) {
			content = null;
		}

		return (
			<div key={this.state.uniqueId} className={className}>
				<div key={this.state.uniqueId + '-field'} className="proper-combo-virtual">
					<div key={this.state.uniqueId + '-fieldllist'} className="proper-combo-virtualField" ref={this.state.uniqueId + '_fieldllist'} style={{maxHeight:maxHeight}} onClick={this.onVirtualClick.bind(this)}>
						<React.addons.CSSTransitionGroup
							key={this.state.uniqueId + '-fieldllist-elements'}
							className="proper-combo-virtualField-list"
							transitionName="list"
							component='ul'
							transitionEnterTimeout={250}
							transitionLeaveTimeout={250}>
							{elementsList}
						</React.addons.CSSTransitionGroup>
					</div>
					<button className={"proper-combo-virtualField-add"} onClick={this.addNewItems.bind(this)}>
						<i className="fa fa-chevron-down"></i>
					</button>
				</div>
				<React.addons.CSSTransitionGroup
					key={this.state.uniqueId + '-content'}
					className={contentClass}
					transitionName="content"
					component='div'
					transitionAppear={true}
					transitionAppearTimeout={400}
					transitionEnterTimeout={400}
					transitionLeaveTimeout={400}>

					{content}
				</React.addons.CSSTransitionGroup>
			</div>
		);
	}
}

ComboField.defaultProps = getDefaultProps();

export default ComboField;