import React from 'react';
import Search from "../../src/jsx/propercombo";

function getDefaultProps() {
	return {
		dev: "In process of development..."
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			dev: this.props.dev
		}
	}

	render() {
		return (
	    	<div style={{position: 'absolute', width: '100%', top: '20%'}}>
	    		<div style={{position: 'absolute', top: 0, left: '10%',  width: '40%'}}>
		        	<div style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}}>
		        		<h2>{this.state.dev}</h2>
		        	</div>
		        </div>
		      	<div style={{position: 'absolute', top: 0, left: '33%',  width: '25%'}}>
		        	<div id="canvas" style={{position: 'absolute', top: 0, bottom: 0, width:' 75%'}}>
		        		<img src="http://ardalis.com/wp-content/uploads/2015/11/one-does-not-simply-estimate-task-duration.jpg"/>
		        	</div>
		      	</div>
		    </div>
	    );

	}
}

App.defaultProps = getDefaultProps();

export default App;