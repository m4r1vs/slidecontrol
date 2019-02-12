import { h, Component } from 'preact';
import style from './style.scss';
import Button from '../../components/buttons';

import Localization from '../../lib/localization';
import lang from './language';

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
			lang.notifications.serverSaved(ip),
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

					<h3>{lang.page.server.title}</h3>

					{/* Description */}
					<div>
						<p>{lang.page.server.description[0]}</p>
						<p>{lang.page.server.description[1]}</p>
					</div>

					<p>{lang.page.server.select.title}</p>

					<select
						id="server-options"
						ref={select => this.serverIpSelectElement = select}
						value={this.state.serverIpSelect}
						onChange={this.changeServerIpSelect}
					>
						<option value="wss://www.maniyt.de:61263">wss://www.maniyt.de:61263</option>
						<option value="wss://mn.uber.space/slidecontrol-socket">wss://mn.uber.space/slidecontrol-socket</option>
					</select>

					<p>{lang.page.server.input.title}</p>
					
					<input
						ref={input => this.serverIpInputElement = input}
						onChange={this.changeServerIpInput}
						aria-label="Or local server"
						type="text"
						placeholder="ws://localhost:1337"
						id="server-local"
					/>

					<p>{lang.page.server.description[2](this.state.serverIp)}</p>

					<Button text={lang.page.server.buttonSave} action={this.saveServer} />

				</section>

				<section>

					<h3>{lang.page.language.title}</h3>

					<div>
						<p>{lang.page.language.description}</p>
					</div>

					<select id="server-options" ref={select => this.languageSelectElement = select} value={this.state.languageSelect} onChange={this.changeLanguage}>
						<option value="en">{lang.page.language.languages.en}</option>
						<option value="de">{lang.page.language.languages.de}</option>
					</select>

				</section>

			</div>
		);
	}
}