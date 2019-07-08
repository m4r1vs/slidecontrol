import { h, Component } from 'preact';
import { route, Link } from 'preact-router';
import lang from './languages';

import style from './style.scss';

// gets shown after onboarding
export default class Home extends Component {

	getGreeting() {
		let h = new Date().getHours();
		if (h < 3) return lang.greetings.night;
		else if (h < 10) return lang.greetings.morning;
		else if (h < 13) return lang.greetings.day;
		else if (h < 18) return lang.greetings.afternoon;
		else if (h < 22) return lang.greetings.evening;
		return lang.greetings.night;
	}

	changeInput(e) {
		this.setState({
			input: e.srcElement.value
		});
	}

	sendCode(e) {
		if (e) e.preventDefault();

		if (parseInt(this.state.input, 10) === 420) {
			if (localStorage.getItem('slidecontrolLit') === 'totally') {
				localStorage.setItem('slidecontrolLit', 'yes');
				location.reload();
			}
			else {
				this.props.showSnackbar(
					lang.errors.tooLit.msg,
					lang.errors.tooLit.action,
					6000,
					() => this.props.makeItLit(true)
				);
			}
			return;
		}

		if (!this.Socket.OPEN) this.props.showSnackbar(
			lang.errors.socketClosed.msg,
			lang.errors.socketClosed.action,
			3000,
			() => route('/settings')
		);
		this.input.disabled = true;
		this.Socket.send(JSON.stringify({
			command: 'check-presentation-id',
			data: {
				presentationID: this.state.input
			}
		}));
	}

	constructor(props) {
		super(props);
		
		this.state = {
			input: null
		};

		window.WebSocket = window.WebSocket || window.MozWebSocket;
		try {
			this.Socket = new WebSocket(localStorage.getItem('slidecontrol-websocket-ip'));
		}
		catch (error) {
			console.error(error);
			this.props.showSnackbar(
				lang.errors.socketClosed.msg,
				lang.errors.socketClosed.action,
				4000,
				() => route('/settings')
			);
		}
		this.changeInput = this.changeInput.bind(this);
		this.sendCode = this.sendCode.bind(this);
		this.openScanner = () => route('/scanner');
	}

	componentDidMount() {

		this.input.disabled = false;

		this.Socket.onmessage = message => {
			message = JSON.parse(message.data);
			if (message.command === 'presentation-id-ok') {
				route(`/controller/${message.data.presentationID}`);
			}
			if (message.command === 'presentation-id-unknown') {
				this.props.showSnackbar(
					lang.errors.wrongCode.msg(message.data.presentationID),
					lang.errors.wrongCode.action,
					5000,
					() => route('/help')
				);
				this.input.disabled = false;
			}
		};

		this.Socket.onerror = error => {
			this.props.showSnackbar(
				lang.errors.socketError.msg,
				lang.errors.socketError.action,
				5000,
				() => route('/settings')
			);
			console.error('socket-error: ', error);
		};

	}

	componentWillUnmount() {
		this.Socket.close();
	}

	render() {

		return (
			<div class={style.home} fadeIn>

				<h1>{this.getGreeting()}</h1>

				<p>
					{lang.page.enterCode[0]}<br />{lang.page.enterCode[1]}<Link href="/help/">{lang.page.enterCode[2]}</Link><br />
				</p>

				{/* Code input-field */}
				<form onSubmit={this.sendCode} autocomplete="off">

					<input
						name="code"
						ref={input => this.input = input}
						placeholder="0000"
						aria-label={lang.page.codeLabel}
						value={this.state.input}
						onChange={this.changeInput}
						required class={style.code}
						type="number"
						autocomplete="off"
					/>
					
					<button type="button" class={style.scanButton} onClick={this.openScanner} >
						<i class="material-icons">photo_camera</i>
					</button>

					<br />

					<input class={style.button} type="submit" value={lang.page.submitCodeButton} />
					
					<br />

					<Link href="/help/">{lang.page.helpButton}</Link>

				</form>
			</div>
		);
	}
}