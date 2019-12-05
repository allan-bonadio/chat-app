//
//  chat app server - mediates chat session(s) between brower clients
//

import config from '../src/config';


fs.writeFile('chat-app.pid', process.pid);

/* ***************************************************** ws server */


const WebSocket = require('ws');
 
const sockServer = new WebSocket.server({port: config.WS_PORT});
 
sockServer.on('connection', ws => {
  ws.on('message', message => {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});


/* ***************************************************** http server */


const fs = require('fs');
const path = require('path');
const express = require('express')
const app = express()

app.use('/', express.static('public', {fallthrough: false}));

app.listen(HTTP_PORT);
console.log("Now listening on http://localhost:"+ config.HTTP_PORT);


