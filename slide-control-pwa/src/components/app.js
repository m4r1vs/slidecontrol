import { h, Component } from 'preact';
import { Router } from 'preact-router';

// routes
import Home from '../routes/home';
import Help from '../routes/help';
import Controller from '../routes/controller';

// Components
import Snackbar from '../components/snackbar';
import Header from '../components/header';
import Nav from '../components/nav';
import Blank from '../routes/blank';

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

	handleRoute = route => {

		let attributes = route.active[0].attributes;

		this.setState({
			headerTitle: attributes.title,
			headerTransparent: !!attributes.transparentHeader,
			headerArrow: !!attributes.arrowHeader,
			headerSmall: !!attributes.smallHeader,
			headerChildren: !!attributes.changeHeaderChildren
		});

		document.querySelector('meta[name=theme-color]')
			.setAttribute('content', attributes.theme);
	}

	handleNavClick = () => {
		if (this.state.headerArrow) window.history.back();
		else {
			document.body.style.overflow = 'hidden';

			const drawer = document.getElementById('drawer');
			const greyback = document.getElementById('drawerback');

			greyback.style.display = 'block';

			drawer.style.transition = 'margin-left .16s cubic-bezier(0.0, 0.0, 0.2, 1)';
			greyback.style.transition = 'opacity .16s linear';

			drawer.style.opacity = '1';
			greyback.style.opacity = '1';

			drawer.style.marginLeft = '0px';
		}
	}

	changeHeaderTitle = title => this.setState({
		headerTitle: title
	})

	changeHeaderChildren = children => this.setState({
		headerChildren: children
	})

	constructor(props) {
		super(props);

		this.state = {
			headerTransparent: true,
			headerSmall: false,
			headerArrow: false,
			headerTitle: '',
			headerChildren: <div />
		};

		this.timeout = null;
		this.handleRoute = this.handleRoute.bind(this);
		this.showSnackbar = this.showSnackbar.bind(this);
		this.changeHeaderTitle = this.changeHeaderTitle.bind(this);
		this.changeHeaderChildren = this.changeHeaderChildren.bind(this);
		this.handleNavClick = this.handleNavClick.bind(this);
	}

	render() {

		return (
			<div id="app">

				<Nav />

				<Header
					small={this.state.headerSmall}
					transparent={this.state.headerTransparent}
					arrow={this.state.headerArrow}
					onNavClick={this.handleNavClick}
					title={this.state.headerTitle}
					children={this.state.headerChildren}
				/>

				{/* Global Components */}
				<Snackbar {...this.state.notification} />

				{/* Different routes */}
				<Router onChange={this.handleRoute}>
					<Home path="/" title="Slidecontrol" theme="#212121" transparentHeader />
					<Help path="/help" title="Help" theme="#ffbc16" arrowHeader />
					<Controller
						smallHeader
						changeHeaderTitle={this.changeHeaderTitle}
						changeHeaderChildren={this.changeHeaderChildren}
						showSnackbar={this.showSnackbar}
						path="/controller/:id"
						theme="#ffbc16"
						title="Loading..."
						arrowHeader
					/>
					<Blank default title="Error 404" theme="#212121" transparentHeader />
				</Router>
			</div>
		);
	}
}
