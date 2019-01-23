import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.scss';

import Button from '../../components/buttons';

class Onboarding extends Component {

	setOnboarded() {
		localStorage.setItem('onboarded', 'true');
		location.href = '/';
	}

	render() {
		return (
			<div class={style.home}>
				<div class={style.logo} />
				<h1>Hi there,</h1>
				<p>
					Slidecontrol is the app to command your slides. Before you get started you need to make sure that you have installed our browser extension on the device hosting your slides.
				</p>
				<Button text="got it, continue" action={this.setOnboarded} />
			</div>
		);
	}
}

class Main extends Component {

	getGreeting() {
		return 'Good Evening,';
	}

	changeInput(e) {
		this.setState({
			input: e.srcElement.value
		});
	}

	sendCode() {
		route(`/controller/${this.state.input}`);
	}

	constructor(props) {
		
		super(props);
		
		this.state = {
			input: 0
		};

		this.changeInput = this.changeInput.bind(this);
		this.sendCode = this.sendCode.bind(this);
	}

	render() {
		return (
			<div class={style.home}>
				<div class={style.logo} />
				<h1>{this.getGreeting()}</h1>
				<p>
					Now just open your slides and type in your generated code to get started:
				</p>
				<input placeholder="0000" onChange={this.changeInput} required class={style.code} type="number" /><br />
				<Button text="DONE" action={this.sendCode} />
			</div>
		);
	}
}

const Home = () => {

	const onboarded = localStorage.getItem('onboarded') === 'true';

	return onboarded ? <Main /> : <Onboarding />;
};


(
	<div class={style.home}>
		<div class={style.logo} />
		<h1>welcome to slidecontrol.</h1>

	</div>
);

export default Home;
