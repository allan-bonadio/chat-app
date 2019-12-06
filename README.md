# Chat App
A simple application demonstrating chat.

## How to Run

npm start

This starts the server and the react server.  Surf to localhost:3000 or whateveripaddres:3000 .  Enter your name and then start typing messages.  It's a big party line so everybody's posts are all in one conversation.

Surf to localhost:3000 again from another browser window (or another browser, or another machine).  Enter a different name.  You can now conduct a conversation.

## Design Decisions

It seems easier to run chat from a server rather than browser-to-browser.  Mainly, I don't know WebRTC, which seems like the way to do that.

So, we have a server (nodejs) and chat clients in browsers.  The server must maintain these:

- list of users
- current conversations

UI should have pages:

- user register
- login (no pw for simplicity)
- chat page
- way to 'call' another user

A simpler, preliminary version would just have one conversation, and it's a party line; everybody's posts all get displayed together, and everybody sees everybody else's posts.  No user registration or 'login' needed; just type your name into a blank on the page and you can see the current conversation.

So the server should maintain just one conversation, and just the users logged in at a given time.  client requests to server:

- 'login' new user and new browser
- logout
- retrieve conversation so far (maybe have post IDs so you can download only those that you need..?)
- make a post

It can use websockets so that the browser can get alerted spontaneously to new posts.  And, since the socket is bidirectional, the requests can be sent down that way, too.  So the login and logout can happen at the same time as the websocket connecting and disconnecting.

The server, however, must be able to do http requests; it must serve its HTML page to the browser.  This is how a user starts going.
