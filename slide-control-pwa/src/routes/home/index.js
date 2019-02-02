import { h, Component } from 'preact';
import { route, Link } from 'preact-router';
import style from './style.scss';

import Button from '../../components/buttons';

// Gets shown on first visit of app
class Onboarding extends Component {

	setOnboarded() {
		localStorage.setItem('onboarded', 'true');
		location.href = '/';
	}

	render() {
		return (
			<div class={style.home}>

				<div class={style.logo} >
					<span>BETA</span>
				</div>

				<h1>Hi there,</h1>
				<p>
					Slidecontrol is the app to command your slides.<br />
					Before you get started you need to make sure that you have installed our browser extension on the device hosting your slides.
				</p>

				<Button text="got it, continue" action={this.setOnboarded} />
			</div>
		);
	}
}

// gets shown after onboarding
class Main extends Component {

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
		route(`/controller/${this.state.input}`);
	}

	constructor(props) {
		super(props);
		
		this.state = {
			input: null
		};

		this.changeInput = this.changeInput.bind(this);
		this.sendCode = this.sendCode.bind(this);
	}

	render() {
		return (
			<div class={style.home} fadeIn>

				<div class={style.logo} >
					<span>BETA</span>
				</div>

				<h1>{this.getGreeting()}</h1>

				<p>
					Now just open your slide and start slidecontrol there in order to get your code:<br />
				</p>

				{/* Code input-field */}
				<form onSubmit={this.sendCode}>

					<input
						name="code"
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

const Home = () => {
	const onboarded = localStorage.getItem('onboarded') === 'true';
	return onboarded ? <Main /> : <Onboarding />;
};

export default Home;
