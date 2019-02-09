import { h, Component } from 'preact';
import style from './style.scss';
import Button from '../../components/buttons';
import { Link } from 'preact-router';

const steps = [
	(
		<section fadeIn key="step1">
			<p>
				First of all you need to add our <a href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg" rel="noopener noreferrer" target="_blank">Chrome Extension</a> to
				the computer you want to present from:
			</p>
			<Button text="GET EXTENSION" href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg" />
		</section>
	),
	(
		<section fadeIn key="step2">
			<p>
				Once slidecontrol got added you can navigate to <a href="https://docs.google.com/presentation/u/0/" rel="noopener noreferrer" target="_blank">Google Slides</a> on your computer
				and open the slide you want to control:
			</p>
			<Button text="GOOGLE SLIDES" href="https://docs.google.com/presentation/u/0/" /><br /><br />
			<p>
				Now there is a <span>slidecontrol</span> button in the top right of Google Slides, next to the button <span>Present</span>.
			</p>
			<p>
				Click <span>slidecontrol</span> to open the chosen slide in a new tab with slidecontrol enabled.
			</p>
		</section>
	),
	(
		<section fadeIn key="step3">
			<p>
				Finally having your presentation in front of you, you are ready to get your slide's code.
			</p>
			<p>
				Just click on <span>start slidecontrol</span> in the
				bottom control-bar and your code will magically appear.
			</p>
			<p>
				Instead of typing in your code, there is also the option to generate a qr-code by clicking on <span>QR-Code</span> in the control-bar in Google Slides.
			</p>
			<Button to="/" text="TYPE" /> or <Button to="/scanner" text="SCAN" />
		</section>
	),
	(
		<section fadeIn key="step4">
			<h2>Got stuck?</h2>
			<p>
				Contact us by <a href="mailto:marius.niveri@gmail.com">E-Mail</a> and let us know how much we suck and how we can help you in case you are having trouble :)
			</p>
			<Button href="mailto:marius.niveri@gmail.com" text="Hit us up" />
		</section>
	)
];

export default class Help extends Component {

	nextStep() {
		this.setState(state => ({
			step: ((state.step + 1) > steps.length - 1) ? steps.length - 1 : state.step + 1
		}));
	}

	previousStep() {
		this.setState(state => ({
			step: state.step > 0 ? state.step - 1 : 0
		}));
	}

	constructor() {
		super();

		this.state = {
			step: 0
		};

		this.nextStep = this.nextStep.bind(this);
		this.previousStep = this.previousStep.bind(this);
	}
	
	render() {
		return (
			<div class={style.help} fadeIn>
				<h1>Step {this.state.step + 1}/{steps.length - 1}</h1>
				{steps[this.state.step]}
				<center class={style.buttons}>
					<Button action={this.nextStep} disabled={((this.state.step + 1) > steps.length - 1)} text={this.state.step >= steps.length - 2 ? "IM STUCK" : "NEXT STEP"} /><br />
					<Button inverse disabled={(this.state.step <= 0)} action={this.previousStep} text="PREVIOUS STEP" />
				</center>
			</div>
		);
	}
}