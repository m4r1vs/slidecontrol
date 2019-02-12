import { h, Component } from 'preact';
import { route, Router } from 'preact-router';

import Localization from '../lib/localization';

// routes
import Home from '../routes/home';
import Help from '../routes/help';
import Controller from '../routes/controller';
import About from '../routes/about';
import AboutCredits from '../routes/about/credits';
import AboutUs from '../routes/about/us';
import AboutPrivacy from '../routes/about/privacy';
import AboutCode from '../routes/about/code';
import Welcome from '../routes/welcome';

// Components
import Snackbar from '../components/snackbar';
import Header from '../components/header';
import Nav from '../components/nav';
import Blank from '../routes/blank';
import Settings from '../routes/settings';
import Donate from '../routes/donate';
import Scanner from '../routes/scanner';
import AboutLicenses from '../routes/about/licenses';

import lang from './languages';

export default class App extends Component {
	
	/**
    * This function will hide the snackbar
    */
	hideSnackbar = () => {
		this.setState({
			notification: {
				text: null,
				actionText: null,
				clickAction: () => console.error('cLiCkEd An EmTy NoTiFiCaTiOn :!§')
			}
		});
	}
    
	/**
    * Show the snackbar with given information
    */
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
    
	/**
    * Gets fired on route change
    */
	handleRoute = route => {
        
		document.body.focus();
        
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
    
	/**
    * What should happen when the nav button is clicked
    */
	handleNavClick = () => {
		if (this.state.headerArrow) {
			if (window.history.length > 1) window.history.back();
			else route('/');
		}
		else {
            
			// hide navigation Drawer
			document.body.style.overflow = 'hidden';
			const drawer = document.getElementById('drawer');
			const greyback = document.getElementById('drawerback');
			greyback.style.display = 'block';
			drawer.style.transition = 'margin-left .16s cubic-bezier(0.0, 0.0, 0.2, 1)';
			greyback.style.transition = 'opacity .16s linear';
			drawer.style.opacity = '1';
			greyback.style.opacity = '1';
			drawer.style.marginLeft = '0px';
			drawer.focus();
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

		if (typeof window !== 'undefined') window.slidecontrolLanguage = Localization.language;
        
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
        
		if (!localStorage.getItem('slidecontrol-websocket-ip')) localStorage.setItem('slidecontrol-websocket-ip', 'wss://www.maniyt.de:61263');
        
		window.addEventListener('online', () => this.showSnackbar(
			lang.notifications.internet.connected,
			lang.notifications.internet.reload,
			4000,
			location.reload
		));
            
		window.addEventListener('offline', () => this.showSnackbar(
			lang.notifications.internet.disconnected,
			lang.notifications.internet.reload,
			4000,
			location.reload
		));
	}
            
	render() {
                
		return (
			<div id="app">
                    
				{/* Global Components */}
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
				<Snackbar {...this.state.notification} />
                    
				{/* Different routes (ignored by prerender) */}
				{typeof window !== 'undefined' && <Router onChange={this.handleRoute}>
					<Home languages={['en', 'de']} showSnackbar={this.showSnackbar} path="/" title={lang.titles.home} theme="#212121" transparentHeader />
					<Help path="/help" title={lang.titles.help} theme="#ffbc16" arrowHeader />
					<Scanner showSnackbar={this.showSnackbar} path="/scanner" title={lang.titles.scanner} theme="#ffbc16" arrowHeader />
                    
					<Controller
						languages={['en', 'de']}
						smallHeader
						changeHeaderTitle={this.changeHeaderTitle}
						changeHeaderChildren={this.changeHeaderChildren}
						showSnackbar={this.showSnackbar}
						path="/controller/:id"
						theme="#ffbc16"
						title={lang.titles.controller}
						arrowHeader
					/>
                    
					<Settings languages={['en', 'de']} path="/settings" title={lang.titles.settings} showSnackbar={this.showSnackbar} theme="#212121" transparentHeader />
					<Donate path="/donate" title={lang.titles.donate} theme="#212121" transparentHeader />
                    
					<About path="/about" title={lang.titles.about} theme="#212121" transparentHeader />
					<AboutUs path="/about/us" title={lang.titles.aboutUs} theme="#ffbc16" arrowHeader />
					<AboutCode path="/about/code" title={lang.titles.aboutCode} theme="#ffbc16" arrowHeader />
					<AboutPrivacy path="/about/privacy" title={lang.titles.aboutPrivacy} theme="#ffbc16" arrowHeader />
					<AboutCredits path="/about/credits" title={lang.titles.aboutCredits} theme="#ffbc16" arrowHeader />
					<AboutLicenses path="/about/licenses" title={lang.titles.aboutLicenses} theme="#ffbc16" arrowHeader />
					
					<Welcome path="/welcome" title={lang.titles.welcome} theme="#ffbc16" arrowHeader />
                    
					<Blank default title={lang.titles.blank} theme="#212121" transparentHeader />
                    
				</Router>}
			</div>
		);
	}
}
