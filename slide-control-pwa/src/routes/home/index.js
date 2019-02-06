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
		e.preventDefault();
		if (!this.Socket.OPEN) this.props.showSnackbar(
			'Server call made a wucy fucky :o',
			'RELOAD',
			3000,
			location.reload
		);
		this.input.disabled = true;
		this.Socket.send(JSON.stringify({
			reason: 'check-slide-code',
			code: this.state.input
		}));
	}

	routeHelp() {
		route('/help');
	}

	constructor(props) {
		super(props);
		
		this.state = {
			input: null
		};

		window.WebSocket = window.WebSocket || window.MozWebSocket;
		this.Socket = new WebSocket('wss://www.maniyt.de:61263');
		this.changeInput = this.changeInput.bind(this);
		this.sendCode = this.sendCode.bind(this);
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
					4000,
					() => route('/help')
				);
				this.input.disabled = false;
			}
		};

		this.Socket.onerror = error => console.error(error);
	}

	componentWillUnmount() {
		this.Socket.close();
	}

	render() {

		document.body.style.background = '#212121';

		return (
			<div class={style.home} fadeIn>

				<h1>{this.getGreeting()}</h1>

				<p>
					Now just open your slide and start slidecontrol there in order to get your code:<br />
				</p>

				{/* Code input-field */}
				<form onSubmit={this.sendCode}>

					<input
						name="code"
						ref={input => this.input = input}
						placeholder="0000"
						value={this.state.input}
						onChange={this.changeInput}
						required class={style.code}
						type="number"
					/>

					<br />

					<input class={style.button} type="submit" value="LET'S GO" />
					
					<br />

					<Link href="/help/">what code?</Link>

				</form>
			</div>
		);
	}
}