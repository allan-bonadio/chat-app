//
//  chat app server - mediates chat session(s) between brower clients
//
/* eslint-disable eqeqeq, no-throw-literal  */

import React from 'react';
import $ from 'jquery';

import ChatPost from './ChatPost';
import clientConnection from './clientConnection';

// the lower panel, the <main element, with the chat history and entry box
class ChatPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text: ''};
		this.handleKeystroke = this.handleKeystroke.bind(this);
		this.handlePost = this.handlePost.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	render() {
		// no username means not loggged in yet, so hide all the chat stuff
		if (! this.props.connectedAs)
			return '';
		
		console.log('this.props.connectedAs', this.props.connectedAs);
		console.log('this.props.history', this.props.history);
		if (typeof this.props.connectedAs != 'string') debugger;////
		let chatPosts = this.props.history.map((post, ix) => 
			<ChatPost post={post} key={ix} connectedAs={this.props.connectedAs} />
		);
		
		// always at least 3 lines showing, or more if it's a big msg (approx)
		let rows = this.state.text.length / 100 + 3;
		
		return (
			<main className="Chat-Panel">
				<ul>
					{chatPosts}
				</ul>
				<div className='chat-entry'>
					<textarea value={this.state.text} rows={rows}
							onKeyUp={this.handleKeystroke} 
							onChange={this.handleChange}
							placeholder='type your message here and hit Return'>
					</textarea>
					&nbsp;
					<button type='button' onClick={this.handlePost}>
						Post
					</button>
				</div>
			</main>
		);
	
	}
	
	// keystroke in the textarea
	handleKeystroke(ev) {
		if (ev.code == 'Enter' || ev.keyCode == 13)
			this.handlePost(ev);
	}

	// need a change event to run a text box
	handleChange(ev) {
		this.setState({text: ev.target.value});
	}

	// click on the Post button (or hit return)
	// posts a new chat message by sending to server.
	// It'll send us the whole history once it gets around to it.
	handlePost(ev) {
		clientConnection.sendCommandToServer({
			what: 'post', 
			connectedAs: this.props.connectedAs, 
			text: this.state.text});
		
		// clear the box, but focus it
		this.setState({text: ''});
		$('.chat-entry textarea').focus();
	}
}

export default ChatPanel;
