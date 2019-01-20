import { h, Component } from 'preact';
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

	submitCode() {
		console.log('hi');
	}

	getGreeting() {
		return 'Good Evening,';
	}

	render() {
		return (
			<div class={style.home}>
				<div class={style.logo} />
				<h1>{this.getGreeting()}</h1>
				<p>
					Now just open your slides and type in your generated code to get started:
				</p>
				<input class={style.code} type="number" />
				<Button text="DONE" action={this.setOnboarded} />
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
