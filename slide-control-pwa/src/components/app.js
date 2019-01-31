import { h, Component } from 'preact';
import { Router } from 'preact-router';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Help from '../routes/help';
import Controller from '../routes/controller';

import Snackbar from '../components/snackbar';

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

	hideSnackbar = () => {
		this.setState({
			notification: {
				text: null,
				actionText: null,
				clickAction: () => console.error('cLiCkEd An EmTy NoTiFiCaTiOn :!§')
			}
		});
	};

	showSnackbar = (text, actionText, delay, _clickAction) => {

		clearTimeout(this.timeout);

		const clickAction = () => {
			this.hideSnackbar();
			_clickAction();
		};

		this.setState({
			notification: {
				text,
				actionText,
				clickAction
			}
		});
		this.timeout = setTimeout(this.hideSnackbar, delay);
	};

	constructor(props) {
		super(props);
		this.timeout = null;
		this.showSnackbar = this.showSnackbar.bind(this);
	}

	render() {

		console.log(this.state);

		return (
			<div id="app">
				<Snackbar {...this.state.notification} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Help path="/help" />
					<Controller showSnackbar={this.showSnackbar} path="/controller/:id" />
				</Router>
			</div>
		);
	}
}
