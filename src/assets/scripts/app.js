import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
	render() {
		const { data } = this.props;
		return data.map(item => (<p key={item.data}>{item.data}</p>));
	}
}

App.propTypes = {
	data: PropTypes.array.isRequired,
};
