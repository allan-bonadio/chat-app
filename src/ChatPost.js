//
//  chat post - one message posted by one user once, 
//			depicted with a chat bubble of some sort
//
/* eslint-disable eqeqeq, no-throw-literal  */

import React from 'react';

class ChatPost extends React.Component {

	render() {
		////debugger;////
		if (typeof this.props.connectedAs != 'string') debugger;////
		//if (typeof this.props.post.connectedAs != 'string') debugger;////
		let p = this.props.post;
		let whichSide, leftName, rightName;
		if (p.connectedAs == this.props.connectedAs) {
			whichSide = 'right-bubble';
			rightName = 'me';
			leftName = '';
		}
		else {
			whichSide = 'left-bubble';
			leftName = p.connectedAs +': ';
			rightName = '';
		}
		
		return (
			<section className='Chat-Post' >
				<li className={whichSide} >
					<div className='left-name'>{leftName}</div>
					{p.text}
					<div className='right-name'>{rightName}</div>
					{}
				</li>
			</section>
		);
	}
}

export default ChatPost;
