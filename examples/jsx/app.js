import React from 'react';
import Combo from "../../src/jsx/propercombo";

function getDefaultProps() {
	return {
		dev: "In process of development..."
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: []
		}
	}

	componentWillMount() {
		let data = [];

		for (let i = 100; i > 0; i--) {
			data.push({'value':i, 'label':'Item ' + i});
		}

		this.setState({
			data: data
		});
	}

	render() {
		return (
	    	<div style={{position: 'absolute', width: '100%', top: '20%'}}>
	    		<div style={{position: 'absolute', top: 0, left: '20%',  width: '20%'}}>
		        	<Combo data={this.state.data} multiSelect={true} lang={'SPA'} />
		        </div>
		    </div>
	    );

	}
}

App.defaultProps = getDefaultProps();

export default App;