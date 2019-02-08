import { h, Component } from 'preact';
import { route, Router } from 'preact-router';

// routes
import Home from '../routes/home';
import Help from '../routes/help';
import Controller from '../routes/controller';
import About from '../routes/about';

// Components
import Snackbar from '../components/snackbar';
import Header from '../components/header';
import Nav from '../components/nav';
import Blank from '../routes/blank';
import Settings from '../routes/settings';
import Donate from '../routes/donate';
import Scanner from '../routes/scanner';

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

		document.body.style.background = '#212121';
		let attributes = route.active[0].attributes;

		this.setState({
			headerTitle: attributes.title,
			headerTransparent: !!attributes.transparentHeader,
			headerArrow: !!attributes.arrowHeader,
			headerColor: attributes.theme,
			headerSmall: !!attributes.smallHeader,
			headerChildren: !!attributes.changeHeaderChildren
		});

		document.querySelector('meta[name=theme-color]')
			.setAttribute('content', attributes.theme);
	}

	handleNavClick = () => {
		if (this.state.headerArrow) {
			if (window.history.length > 1) window.history.back();
			else route('/');
		}
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

	componentDidMount() {
		window.addEventListener('online', () => this.showSnackbar(
			'Connected to the internet',
			null,
			2500,
			() => console.warn('Lol, y u c this?')
		));

		window.addEventListener('offline', () => this.showSnackbar(
			'Lost connection to the internet',
			'RELOAD',
			4000,
			location.reload
		));
	}

	render() {

		return (
			<div id="app">

				<Nav />

				<Header
					small={this.state.headerSmall}
					transparent={this.state.headerTransparent}
					arrow={this.state.headerArrow}
					color={this.state.headerColor}
					onNavClick={this.handleNavClick}
					title={this.state.headerTitle}
					children={this.state.headerChildren}
				/>

				{/* Global Components */}
				<Snackbar {...this.state.notification} />

				{/* Different routes */}
				<Router onChange={this.handleRoute}>
					<Home showSnackbar={this.showSnackbar} path="/" title="Slidecontrol" theme="#212121" transparentHeader />
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
					<Settings path="/settings" title="Settings" theme="#212121" transparentHeader />
					<Donate path="/donate" title="Donate <3" theme="#212121" transparentHeader />
					<About path="/about" title="About" theme="#212121" transparentHeader />
					<Scanner showSnackbar={this.showSnackbar} path="/scanner" title="Scanner" theme="#ffbc16" arrowHeader />
					<Blank default title="Error 404" theme="#212121" transparentHeader />
	
				</Router>
			</div>
		);
	}
}
