import { h, Component } from 'preact';
import { Router } from 'preact-router';

// routes
import Home from '../routes/home';
import Help from '../routes/help';
import Controller from '../routes/controller';

// Components
import Snackbar from '../components/snackbar';

export default class App extends Component {
	
	hideSnackbar = () => {
		this.setState({
			notification: {
				text: null,
				actionText: null,
				clickAction: () => console.error('cLiCkEd An EmTy NoTiFiCaTiOn :!§')
			}
		});
	}

	showSnackbar = (text, actionText, delay, clickAction) => {

		clearTimeout(this.timeout);

		const _clickAction = () => {
			this.hideSnackbar();
			clickAction();
		};

		this.setState({
			notification: {
				text,
				actionText,
				clickAction: _clickAction
			}
		});
		this.timeout = setTimeout(this.hideSnackbar, delay);
	}

	constructor(props) {
		super(props);
		this.timeout = null;
		this.showSnackbar = this.showSnackbar.bind(this);
	}

	render() {

		return (
			<div id="app">

				{/* Global Components */}
				<Snackbar {...this.state.notification} />

				{/* Different routes */}
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Help path="/help" />
					<Controller showSnackbar={this.showSnackbar} path="/controller/:id" />
				</Router>
			</div>
		);
	}
}
