import { h, Component } from 'preact';
import style from './style.scss';
import Button from '../../components/buttons';

import Localization from '../../lib/localization';

export default class Settings extends Component {

	/**
	 * Save the current input to localStorage
	 */
	saveServer = () => {
		let ip = this.state.serverIpInput || this.state.serverIpSelect;
		if (ip) localStorage.setItem('slidecontrol-websocket-ip', ip);

		this.setState({
			serverIp: ip
		});

		this.props.showSnackbar(
			'Changed server to ' + ip,
			null,
			3500,
			() => console.warn('hey there dude(tte)')
		);
	}

	/**
	 * User changed the input in the <select />
	 */
	changeServerIpSelect = () => {
		this.setState({
			serverIpSelect: this.serverIpSelectElement.value
		});
	}

	/**
	 * User typed into the <input type="text" />
	 */
	changeServerIpInput = () => {
		this.setState({
			serverIpInput: this.serverIpInputElement.value
		});
	}

	changeLanguage = () => {
		this.setState({
			languageSelect: this.languageSelectElement.value
		});
		Localization.language = this.languageSelectElement.value;
		location.reload();
	}

	constructor(props) {
		super(props);

		this.state = {
			serverIpInput: '',
			serverIpSelect: 'wss://www.maniyt.de:61263',
			serverIp: 'wss://www.maniyt.de:61263',
			languageSelect: window.slidecontrolLanguage
		};

		this.serverIpSelectElement = null;
	}

	componentWillMount() {
		this.setState(state => ({
			serverIp: localStorage.getItem('slidecontrol-websocket-ip') || state.serverIp
		}));
	}

	render() {
		return (
			<div class={style.settings} fadeIn>

				<section>

					WebSocket Server
					
					<br /><br />

					<span>
						If you are having problems connecting to our server you can try connecting to a different one here.<br /><br />
						Just remember to also change to the chosen server in slidecontrol's extension settings as well (click on the icon in Chrome's menu and then "Options").<br /><br />
						WebSocket server to connect to:
					</span>

					<br />

					<select id="server-options" ref={select => this.serverIpSelectElement = select} value={this.state.serverIpSelect} onChange={this.changeServerIpSelect}>
						<option value="wss://www.maniyt.de:61263">wss://www.maniyt.de:61263</option>
						<option value="wss://mn.uber.space/slidecontrol-socket">wss://mn.uber.space/slidecontrol-socket</option>
					</select>

					<br /><br />
					
					<span>Or if you run your server locally (dont forget "ws(s)://"):</span>
					
					<br />
					
					<input ref={input => this.serverIpInputElement = input} onChange={this.changeServerIpInput} aria-label="Or local server" type="text" placeholder="ws://localhost:1337" id="server-local" />

					<br /><br />

					Current server: <span>{this.state.serverIp}</span>
					
					<br /><br />

					<div id="status" />
					<Button text="save" action={this.saveServer} />

				</section>

				<section>
					Language

					<br /><br />

					<span>
						Slidecontrol is available in different languages, choose yours here. If you want to add a language or just help to translate slidecontrol, raise a GitHub issue please.
					</span>

					<br /><br />

					<select id="server-options" ref={select => this.languageSelectElement = select} value={this.state.languageSelect} onChange={this.changeLanguage}>
						<option value="en">English</option>
						<option value="de">German</option>
					</select>

					<br /><br />

				</section>

			</div>
		);
	}
}