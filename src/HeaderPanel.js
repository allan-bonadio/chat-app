//
//  chat app server - mediates chat session(s) between brower clients
//
/* eslint-disable eqeqeq, no-throw-literal, no-restricted-globals  */

import React from 'react';

class HeaderPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {nameAsEntered: '', isLoggedOn: false};
		this.handleKeystroke = this.handleKeystroke.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.initiateConnect = this.initiateConnect.bind(this);
	}
	
	render() {
		let disabled = ! this.state.nameAsEntered || this.state.isLoggedOn;
		
		return (
			<header className="App-header">
				<label >
					Enter the name you want to use: &nbsp;
					<input id='user-name-entry' autoComplete='off'
							onKeyUp={this.handleKeystroke}
							onChange={this.handleChange}
							value={this.state.nameAsEntered}
							disabled={this.state.isLoggedOn} />
				</label>
				&nbsp;
				<button type='button' 
						onClick={ev => this.initiateConnect(this.state.nameAsEntered)}
						disabled={disabled} >
					Connect
				</button>
				&nbsp;
				&nbsp;
				<button type='button'
						onClick={ev => location = location.href}
						disabled={disabled} >
					Disconnect
				</button>
			</header>
		);
		// the disconnect button just reloads the page
	}
	
	// but a change event doesn't have the keystroke
	handleKeystroke(ev) {
		// user hit return?  Sends it.
		if (ev.code == 'Enter' || ev.keyCode == 13)
			this.initiateConnect(ev.target.value);
	}
	
	// need a change event to run a text box
	handleChange(ev) {
		this.setState({nameAsEntered: ev.target.value});
	}
	
	// logs in
	initiateConnect(connectedAs) {
		this.setState({isLoggedOn: true});
		this.props.initiateConnect(connectedAs);
	}
	
}

export default HeaderPanel;
