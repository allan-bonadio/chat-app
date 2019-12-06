
import config from './config';
import App from './App';

// this represents the websocket connection to the server, 
// and the user's name and stuff
class clientConnection {
	// form a connection with the user's name
	constructor(connectedAs) {
		clientConnection.me = this;
		
		if (typeof connectedAs != 'string') debugger;////
		this.connectedAs = connectedAs;
		this.ws = new WebSocket('ws://localhost:'+ config.WS_PORT +'/socket');
		console.log("ws created");

		this.ws.onopen = ev => {
			console.log("ws opened");
			
			// the first thing, they're going to want our name.
			if (typeof connectedAs != 'string') debugger;////
			clientConnection.sendCommandToServer({
					what: 'connectedAs', connectedAs});
		};

		this.ws.onclose = ev => {
			console.log("ws closed, try reopening");
			
			// lets just turn around and open another one.
			// App has to do that.
			if (typeof connectedAs != 'string') debugger;////
			App.me.initiateConnect(connectedAs);
		};

		this.ws.onmessage = message => {
			console.log("wow, we got a  message:", message, message.data);
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
		this.me.ws.send(JSON.stringify(cmd, null, '\t'));
	}
}

export default clientConnection;

