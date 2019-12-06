//
//	chat app server - mediates chat session(s) between brower clients
//

let config = require('./src/config.js');
let fs = require('fs');

fs.writeFile('chat-app.pid', process.pid, err => {
		if (err)
			console.error(err);
	});

/* ***************************************************** chat info */

// the users who are logged on.	And how to send to them.
// each like {connectedAs: 'natasha', ws: ws}
let chattingUsers = [];

// all the chat messages since the server started up
let history = [{connectedAs: 'chat-app', text: "Welcome to Chat App.	Go ahead and type stuff in."}];


/* ***************************************************** ws server */


const WebSocket = require('ws');
 
const sockServer = new WebSocket.Server({
	host: 'localhost',
	port: config.WS_PORT,
	path: '/socket',
});
console.log("socket created");

// send any message to any client (one at a time)
function sendMessage(ws, msgTree) {
	if (ws.readyState !== WebSocket.OPEN) {
		// it closed on us.  Just forget it.  
		// When they reconnect, they'll get the full history
		return;
	}
	
	try {
		// these extra args to stringify formats it nice with indenting
		ws.send(JSON.stringify(msgTree, null, '\t'));
		console.log("sent history to client");
	} catch (ex) {
		console.warn("ws.send couldn't send:", ex, "but life goes on");
	}
}

// send the allHistory command to one client, with the complete history
function sendHistory(ws) {
	sendMessage(ws, {what: 'allHistory', history});
}

// receive connection, do preliminaries, and set up important handlers
sockServer.on('connection', ws => {
	console.log("connection made from client");
	
	// the first thing they're gonna need is all the chat msgs so far
	sendHistory(ws);

	ws.on('message', message => {
		console.log('command received from client:', message);
		commandFromClient(JSON.parse(message), ws);
		
	});
 
 	// sometimes it just closes from the other end.  whatever.
	ws.on('close', (code, reason) => {
		console.log(`WS Close: code=${code} reason=${reason}`);
		
		// what now?  this seems to happen from time to time.
		// wait for client to log in again
	});
 
	ws.on('error', message => {
		console.error('error from client:', arguments);
	});
 
});
console.log("Now listening on ws://localhost:"+ config.WS_PORT);


/* ***************************************************** chat action */

// one of our clients sent in a message that they typed.	
// Add it to the list and tell everybody.
function newIncomingChatMessage(connectedAs, text) {
	history.push({connectedAs, text});
	
	// now send out the whole history aGAIN
	// in the future some way of maintaining a long list can be implemented
	// not today
	chattingUsers.forEach(user => sendHistory(user.ws));
}

// handle any msg from the client from the ws
function commandFromClient(payload, ws) {

	switch (payload.what) {
	case 'connectedAs':
		let connectedas, connectedAs = payload.connectedAs;

		// make sure the name is unique, case insens.  
		// If not, add a digit at the end.  note connectedas is case folded.
		for (;;) {
			connectedas = connectedAs.toLowerCase();
			let another = chattingUsers.find(u => u.connectedas == connectedas);
			if (! another)
				break;
			
			// append a random digit.  Separated by a space unless it already is.
			if (! / (\d+)$/.test(connectedAs))
				connectedAs += ' ';
			connectedAs += Math.floor(Math.random() * 10);
		}
		
		// store also the casefolded name to make the loop above more practical
		chattingUsers.push({connectedAs, connectedas, ws})
		break;
	
	case 'post':
		// Toss another chat message on the pile.  
		newIncomingChatMessage(payload.connectedAs, payload.text) 
		break;
	
	default:
		console.error("unknown command from server:", payload);
	}

}