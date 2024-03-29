//
//  chat app server - mediates chat session(s) between brower clients
//

import React from 'react';
import './App.css';
import ChatPanel from './ChatPanel';
import HeaderPanel from './HeaderPanel';
import clientConnection from './clientConnection';

class App extends React.Component {
	constructor(props) {
		super(props);
		App.me = this;
		
		this.state = {
			// this is false if not connected, or the user name if connected
			connectedAs: '',
			
			// all the posts, in chron order
			history: [],
		};
		
		this.initiateConnect = this.initiateConnect.bind(this);
	}

	render() {
		return (
			<div className="App">
				<HeaderPanel connectedAs={this.state.connectedAs} 
					initiateConnect={this.initiateConnect} />
				<ChatPanel connectedAs={this.state.connectedAs} 
					history={this.state.history}  />
			</div>
		);
	
	}
	
	// we get a list of all the chat msgs that have gone past.
	static setHistory(history) {
	
		App.me.setState({history});
	}
	
	
	// called when user clicks Connect button
	initiateConnect(connectedAs) {
		this.setState({connectedAs});
		
		// now open up the socket to the server
		try {
			this.clientConnection = new clientConnection(connectedAs);		
		} catch (ex) {
		
		}
	}
}

export default App;
