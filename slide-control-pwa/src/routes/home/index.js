import { h, Component } from 'preact';
import { route, Link } from 'preact-router';

import style from './style.scss';

// gets shown after onboarding
export default class Home extends Component {

	getGreeting() {
		let h = new Date().getHours();
		if (h < 3) return 'Good Night,';
		else if (h < 10) return 'Good Morning,';
		else if (h < 13) return 'Hey there,';
		else if (h < 18) return 'Good Afternoon,';
		else if (h < 22) return 'Good Evening,';
		return 'Good Night,';
	}

	changeInput(e) {
		this.setState({
			input: e.srcElement.value
		});
	}

	sendCode(e) {
		if (e) e.preventDefault();
		if (!this.Socket.OPEN) this.props.showSnackbar(
			'Calling server returned a wucy fucky :o',
			'SETTINGS',
			3000,
			() => route('/settings')
		);
		this.input.disabled = true;
		this.Socket.send(JSON.stringify({
			reason: 'check-slide-code',
			code: this.state.input
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
				'Error starting WebSocket :O',
				'SETTINGS',
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
			if (message.reason === 'slide-code-ok') {
				route(`/controller/${message.code}`);
			}
			if (message.reason === 'slide-code-not-ok') {
				this.props.showSnackbar(
					`Hmm, seems like the code ${message.code} is not used by any presentation :/`,
					'HELP',
					5000,
					() => route('/help')
				);
				this.input.disabled = false;
			}
		};

		this.Socket.onerror = error => {
			this.props.showSnackbar(
				'We fucked up big here, server seems dead ass dead',
				'SETTINGS',
				5000,
				() => route('/settings')
			);
			console.error('We fucked up big here: ', error);
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
					Enter your slide's code here,<br />or let us show you <Link href="/help/">how to get your code</Link><br />
				</p>

				{/* Code input-field */}
				<form onSubmit={this.sendCode} autocomplete="off">

					<input
						name="code"
						ref={input => this.input = input}
						placeholder="0000"
						aria-label="Your Slides Code"
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

					<input class={style.button} type="submit" value="LET'S GO" />
					
					<br />

					<Link href="/help/">I NEED HELP</Link>

				</form>
			</div>
		);
	}
}