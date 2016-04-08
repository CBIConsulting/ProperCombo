import React from 'react';
import _ from 'underscore';
import messages from "../lang/messages";

function getDefaultProps() {
	return {
		test: null
	}
}

class ComboField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			test: this.prop.test
		}
	}

	render() {
		return (
			<div>loading...</div>
		);
	}
}

ComboField.defaultProps = getDefaultProps();

export default ComboField;