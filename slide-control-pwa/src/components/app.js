import { h, Component } from 'preact';
import { Router } from 'preact-router';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Controller from '../routes/controller';

import firebase from 'firebase/app';
import 'firebase/firestore';

let config = {
	apiKey: 'AIzaSyCqS1FW46byte9poi87zoS1dGxy1nMlVZI',
	authDomain: 'slide-control-firebase.firebaseapp.com',
	databaseURL: 'https://slide-control-firebase.firebaseio.com',
	projectId: 'slide-control-firebase',
	storageBucket: 'slide-control-firebase.appspot.com',
	messagingSenderId: '377566080352'
};

firebase.initializeApp(config);

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Controller path="/controller/:id" />
				</Router>
			</div>
		);
	}
}
