import React from 'react';
import Combo from "../../src/jsx/propercombo";
import Normalizer from "../../node_modules/react-propersearch/lib/utils/normalize";
import {shallowEqualImmutable} from 'react-immutable-render-mixin';

function getDefaultProps() {
	return {
		listHeight: 200,
		listRowHeight: 35
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			fieldsSet: null,
			selection: ['item-100', 'item-99'],
			language: 'ENG',
			idField: 'value',
			displayField: 'label',
			defaultSearch: '',
			multiSelect: true,
			disableUnselect: false,
			listHeight: this.props.listHeight,
			listRowHeight: this.props.listRowHeight,
			placeholder: 'Search placeHolder',
			filterOff: false,
			dataSize: 100,
			shouldUpdate: true,
			secondaryDisplay: 'name',
			maxHeight: '100',
			maxSelection: 200,
		}
	}

	componentWillMount() {
		let data = [], fieldsSet = null;

		for (let i = this.state.dataSize; i > 0; i--) {
			data.push({itemID: 'item-' + i, display: this.formater.bind(this), name: 'Tést ' + i,moreFields: 'moreFields values'});
		};

		fieldsSet = new Set(_.keys(data[0]));

		this.setState({
			data: data,
			fieldsSet: fieldsSet,
			idField: 'itemID',
			displayField: 'display',
			secondaryDisplay: 'name'
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		let stateChanged = !shallowEqualImmutable(this.state, nextState);
		let propsChanged = !shallowEqualImmutable(this.props, nextProps);
		let somethingChanged = propsChanged || stateChanged;

		if (nextState.dataSize != this.state.dataSize) {
			let newData = [];

			for (let i = nextState.dataSize; i >= 0; i--) {
				newData.push({
					[nextState.idField]: 'item-' + i,
					[nextState.displayField]: 'Item ' + i,
					name: 'Teeést ' + i,
					fieldx: 'xxx ' + i,
					fieldy: 'yyy ' + i
				});
			}

			this.setState({
				data: newData,
				fieldsSet: new Set(_.keys(newData[0]))
			});

			return false;
		}

		if (!nextState.shouldUpdate) {
			this.setState({
				shouldUpdate: true
			});

			return false;
		}

		if (this.state.shouldUpdate != nextState.shouldUpdate) {
			return false;
		}

		// If something change update form
		if (somethingChanged) {
			this.refs.listHeight.value = nextState.listHeight;
			this.refs.listElementHeight.value = nextState.listRowHeight;
			this.refs.idField.value = nextState.idField;
			this.refs.displayField.value = nextState.displayField;
			this.refs.dataSize.value = nextState.dataSize;
			this.refs.listElementHeight.value = nextState.listRowHeight;
			this.refs.lang.value = nextState.language;
			this.refs.multi.value = nextState.multiSelect;
			this.refs.disableUnselect.value = nextState.disableUnselect;
		}

		return somethingChanged;
	}

	afterSelect(data, selection) {
		console.info('Data: ', data);
		console.info('Selection: ', selection);

		this.setState({
			selection: selection,
			shouldUpdate: false
		});
	}

	filter(listElement, value) {
		let data = listElement.name;
		data = Normalizer.normalize(data);
		return data.indexOf(value) >= 0;
	}

	formater(listElement) {
		return <button className ="btn btn-default" onClick={ (e) => {this.onButtonClick(e, listElement.name)} }>{ listElement.name }</button>;
	}

	onButtonClick(e, name) {
		console.log('Button ' + name + ' has been clicked');
	}

	onChangeData (e) {
		e.preventDefault();
		let data = [], fieldsSet = null, language = '', random = Math.floor(Math.random()* 10);
		let selection = ['item-' + random, 'item-2' + (random + 1)];
		let defaultSearch = 'test '+ random, placeholder = 'Search Placeholder ' + random;
		let listHeight = this.props.listHeight + random, listRowHeight = this.props.listRowHeight + random;
		let multiSelect = !this.state.multiSelect, dataSize = (Math.floor(Math.random()* 1000) + 10);
		let disableUnselect = !this.state.disableUnselect;

		if (random % 2 == 0) language = 'ENG';
		else language = 'SPA';

		for (let i = dataSize; i > 0; i--) {
			data.push({value: 'item-' + i, label: 'Item ' + i, name: 'Teeést ' + i, fieldx: 'xxx ' + i, fieldy: 'yyy ' + i});
		}

		fieldsSet = new Set(_.keys(data[0]));

		this.setState({
			data: data,
			fieldsSet: fieldsSet,
			idField: 'value',
			displayField: 'label',
			language: language,
			selection: selection,
			defaultSearch: defaultSearch,
			listHeight: listHeight,
			listRowHeight: listRowHeight,
			multiSelect: multiSelect,
			disableUnselect: disableUnselect,
			filter: null,
			placeholder: placeholder,
			afterSelect: this.afterSelect.bind(this),
			dataSize: dataSize
		});
	}

	onChangeSize(e) {
		e.preventDefault();
		let size = this.refs.dataSize.value;
		size = parseInt(size);

		if (!isNaN(size)) {
			this.setState({
				dataSize: size
			});
		} else {
			this.refs.dataSize.value = this.state.dataSize;
		}
	}

	onChangeIdField(e) {
		e.preventDefault();
		let fieldsSet = this.state.fieldsSet, newIdField = this.refs.idField.value;

		// Data has this field so update state otherwise set field to current state value
		// (SEARCH Component has prevent this and throws an error message in console and don't update the idField if that field doesn't exist in data)
		if (fieldsSet.has(newIdField)) {
			this.setState({
				idField: newIdField
			});
		} else {
			console.error('The data has no field with the name ' + newIdField + '. The fields of the data are: ', fieldsSet);
			this.refs.idField.value = this.state.idField;
		}
	}

	onChangeDisplay(e) {
		e.preventDefault();
		let fieldsSet = this.state.fieldsSet, newDisplayField = this.refs.displayField.value;

		// Data has this field so update state otherwise set field to current state value
		// (SEARCH Component has prevent this and throws an error message in console and don't update the displayField if that field doesn't exist in data)
		if (fieldsSet.has(newDisplayField)) {
			this.setState({
				displayField: newDisplayField
			});
		} else {
			console.error('The data has no field with the name ' + newDisplayField + '. The fields of the data are: ', fieldsSet);
			this.refs.displayField.value = this.state.displayField;
		}
	}

	onChangeSecDisplay(e) {
		e.preventDefault();
		let fieldsSet = this.state.fieldsSet, newSecondaryDisplay = this.refs.secondaryDisplay.value;

		// Data has this field so update state otherwise set field to current state value
		// (SEARCH Component has prevent this and throws an error message in console and don't update the displayField if that field doesn't exist in data)
		if (fieldsSet.has(newSecondaryDisplay)) {
			this.setState({
				secondaryDisplay: newSecondaryDisplay
			});
		} else {
			console.error('The data has no field with the name ' + newSecondaryDisplay + '. The fields of the data are: ', fieldsSet);
			this.refs.secondaryDisplay.value = this.state.secondaryDisplay;
		}
	}

	onChangeListHeight(e) {
		e.preventDefault();
		let height = this.refs.listHeight.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				listHeight: height
			});
		} else {
			this.refs.listHeight.value = this.state.listHeight;
		}
	}

	onChangeElementHeight(e) {
		e.preventDefault();
		let height = this.refs.listElementHeight.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				listRowHeight: height
			});
		} else {
			this.refs.listElementHeight.value = this.state.listRowHeight;
		}
	}

	onChangeMaxHeight(e) {
		e.preventDefault();
		let height = this.refs.maxHeight.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				maxHeight: height
			});
		} else {
			this.refs.maxHeight.value = this.state.maxHeight;
		}
	}

	onChangeMaxSelection(e) {
		e.preventDefault();
		let height = this.refs.maxSelection.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				maxSelection: height
			});
		} else {
			this.refs.maxSelection.value = this.state.maxSelection;
		}
	}

	onChangeMultiselect(e) {
		e.preventDefault();
		let multi = null, selection = this.state.selection ? this.state.selection[0] : null;
		if (this.refs.multi.value == 'true') multi = true;
		else multi = false;

		this.setState({
			multiSelect: multi,
			selection: selection
		});
	}

	onChangeDisableUnselect(e) {
		e.preventDefault();
		let disableUnselect = null;
		if (this.refs.disableUnselect.value == 'true') disableUnselect = true;
		else disableUnselect = false;

		this.setState({
			disableUnselect: disableUnselect,
		});
	}

	onChangeLang(e) {
		e.preventDefault();

		this.setState({
			language: this.refs.lang.value
		});
	}

	render() {
		let filter = !this.state.filterOff ? this.filter.bind(this) : null;
		let multiSelect = this.state.multiSelect, language = this.state.language;
		let disableUnselect = this.state.disableUnselect;

	    return (
	    	<div>
	    		<div style={{position: 'absolute', 'width': '100%',top: '5%', left: '40%'}}>
	    			<h1><a href="https://github.com/CBIConsulting/ProperCombo/blob/dev/examples/jsx/app.js"> Code </a></h1>
	    		</div>
		    	<div style={{position: 'absolute', width: '100%', top: '20%'}}>
			      	<div style={{position: 'absolute', top: 0, left: '10%',  width: '20%'}}>
				        <div style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}}>
				          	<form className="form-horizontal" role="form">
				          		<div className="form-group">
					                <label> List elements: </label>
					                <div className="form-inline">
					                	<input ref="dataSize" type="text" className="form-control" placeholder="Number of elements" defaultValue={this.state.dataSize} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeSize.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
				          		<div className="form-group">
					                <label> Id-Field: </label>
					                <div className="form-inline">
					                	<input ref="idField" type="text" className="form-control" placeholder="Id Field" defaultValue={this.state.idField} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeIdField.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Display-Field: </label>
					                <div className="form-inline">
					                	<input ref="displayField" type="text" className="form-control" placeholder="Display Field" defaultValue={this.state.displayField} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeDisplay.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Secondary-Display: </label>
					                <div className="form-inline">
					                	<input ref="secondaryDisplay" type="text" className="form-control" placeholder="Secondary Display Field" defaultValue={this.state.secondaryDisplay} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeSecDisplay.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> List Height: </label>
					                <div className="form-inline">
					                	<input ref="listHeight" type="text" className="form-control" placeholder="List Height" defaultValue={this.state.listHeight} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeListHeight.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> List Element Height: </label>
					                <div className="form-inline">
					                	<input ref="listElementHeight" type="text" className="form-control" id="listElementHeight" placeholder="List Element Height" defaultValue={this.state.listRowHeight} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeElementHeight.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Virtual Field Max.Height: </label>
					                <div className="form-inline">
					                	<input ref="maxHeight" type="text" className="form-control" placeholder="Virtual Field Max.Height" defaultValue={this.state.maxHeight} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeMaxHeight.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Max. Size in virtual field: </label>
					                <div className="form-inline">
					                	<input ref="maxSelection" type="text" className="form-control" placeholder="Max. Selection" defaultValue={this.state.maxSelection} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeMaxSelection.bind(this)}>
					            			<i style={{color:'red'}} className="fa fa-arrow-right" aria-hidden="true"/>
					            		</button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Multiselect </label>
					                <div className="form-inline">
					                  <select ref="multi" className="form-control" id="multiselect_id" defaultValue={multiSelect} onChange={this.onChangeMultiselect.bind(this)}>
					                    <option value={true}>Yes</option>
					                    <option value={false}>No</option>
					                  </select>
					                </div>
					            </div>
								<div className="form-group">
					                <label> Disable Unselect </label>
					                <div className="form-inline">
					                  <select ref="disableUnselect" className="form-control" id="disableunselect_id" defaultValue={disableUnselect} onChange={this.onChangeDisableUnselect.bind(this)}>
					                    <option value={true}>Yes</option>
					                    <option value={false}>No</option>
					                  </select>
					                </div>
					            </div>
					            <div className="form-group">
					                <label> Language: </label>
					               	<div className="form-inline">
					                  <select ref="lang" className="form-control input" id="language" defaultValue={language}  onChange={this.onChangeLang.bind(this)}>
					                    <option value="SPA">Spanish</option>
					                    <option value="ENG">English</option>
					                  </select>
					                </div>
					            </div>
				          	</form>
			        	</div>
			      	</div>
			      	<div style={{position: 'absolute', top: 0, left: '33%',  width: '25%'}}>
				        <div id="canvas" style={{position: 'absolute', top: 0, bottom: 0, width:' 75%'}}>
				        	<Combo
								data={this.state.data}
								idField={this.state.idField}
								displayField={this.state.displayField}
								listHeight={this.state.listHeight}
								listRowHeight={this.state.listRowHeight}
								lang={this.state.language}
								filter={filter}
								multiSelect={this.state.multiSelect}
								disableUnselect={this.state.disableUnselect}
								defaultSelection={this.state.selection}
								defaultSearch={this.state.defaultSearch}
								placeholder={this.state.placeholder}
								afterSelect={this.afterSelect.bind(this)}
								secondaryDisplay={this.state.secondaryDisplay}
								maxHeight={this.state.maxHeight}
								maxSelection={this.state.maxSelection}
							/>
							<div id="canvas-behind-content" style={{position: 'relative', top: 0, left: '-5%', width:' 110%', height: '400px', backgroundColor:'#2196F3'}}>
								<h2 style={{position: 'relative', top: '40%', left: '20%', color:'#FFC107'}}> Element Behind </h2>
							</div>
				        </div>
				        <div id="canvas2" style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: '20%'}}>
				        	<button className="btn btn-default" onClick={this.onChangeData.bind(this)}> Random Data </button>
				        </div>
			     	</div>
			    </div>
			</div>
	    );
	}
}

App.defaultProps = getDefaultProps();

export default App;