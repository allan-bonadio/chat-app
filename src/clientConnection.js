/* eslint-disable eqeqeq, no-throw-literal, no-restricted-globals  */

import config from './config';
import App from './App';

// so we don't loop forever
let nFailedConnections = 0;

// this represents the websocket connection to the server, 
// and the user's name and stuff
class clientConnection {
	// form a connection with the user's name
	constructor(connectedAs) {
		clientConnection.me = this;
		
		this.connectedAs = connectedAs;
		this.ws = new WebSocket('ws://localhost:'+ config.WS_PORT +'/socket');
		
		this.ws.onopen = ev => {
			
			// the first thing, they're going to want our name.
			clientConnection.sendCommandToServer({
					what: 'connectedAs', connectedAs});
		};

		this.ws.onclose = ev => {
			console.log("ws closed, try reopening", this.ws, nFailedConnections);
			nFailedConnections++;
			if (nFailedConnections > 10) {
				alert("Your server doesn't seem to be there.  Try again later.");
				location = location.href;
				return;
			}
			
			// lets just turn around and open another one.
			// App has to do that.
			setTimeout(() => App.me.initiateConnect(connectedAs), 1000);

		};

		this.ws.onmessage = message => {
			//console.log(" message:", message, message.data);
			this.commandFromServer(JSON.parse(message.data));
		};
	}
	
	commandFromServer(payload) {
		switch (payload.what) {
		case 'allHistory':
			App.setHistory(payload.history);
			break;
		
		default:
			console.error("unknown command from server:", payload);
		}
	}
	
	// send a command tree to the server over the ws connection
	static sendCommandToServer(cmd) {
		let ws = this.me.ws;
		console.log(ws);
		if (ws.readyState != ws.OPEN) {
			console.error("connection closed somehow, reopening");
			return;
		}
		this.me.ws.send(JSON.stringify(cmd, null, '\t'));
	}
}

export default clientConnection;

