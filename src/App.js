import React from 'react';
import './App.css';
import ChatPanel from './ChatPanel';
import HeaderPanel from './HeaderPanel';

class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			// this is false if not connected, or the user name if connected
			connectedAs: null,
		};
		
		this.connect = this.connect.bind(this);
	}

	render() {
		return (
			<div className="App">
				<HeaderPanel connectedAs={this.state.connectedAs} />
				<ChatPanel connectedAs={this.state.connectedAs} />
			</div>
		);
	
	}
	
	// called by the header panel when a user wants to log in
	connect(userName) {
	
	}
}

export default App;
